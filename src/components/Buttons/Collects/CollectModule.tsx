import { LENS_HUB_ABI } from '@/abi/abi';
import { UpdateOwnableFeeCollectModule } from '@/abi/UpdateOwnableFeeCollectModule';
import Collectors from '@/components/ProfilePage/Collectors';
import { Button } from '@/components/UI/Button';
import { Modal } from '@/components/UI/Modal';
import { LENSHUB_PROXY, RELAY_ON, UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS } from '@/constants';
import getAssetAddress from '@/lib/getAssetAddress';
import getCoingeckoPrice from '@/lib/getCoingeckoPrice';
import getSignature from '@/lib/getSignature';
import onError from '@/lib/onError';
import { useAppStore } from '@/store/app';
import { useApprovedModuleAllowanceAmountQuery, useCollectModuleQuery, useCreateCollectTypedDataMutation, useProxyActionMutation, usePublicationRevenueQuery } from '@/types/graph';
import { CollectModules, Publication } from '@/types/lens';
import useBroadcast from '@/utils/useBroadcast';
import { CameraIcon, UsersIcon } from '@heroicons/react/24/outline';
import { BigNumber } from 'ethers';
import { defaultAbiCoder, splitSignature } from 'ethers/lib/utils';
import React, { Dispatch, FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useAccount, useBalance, useContractRead, useContractWrite, useSignTypedData } from 'wagmi';
import getTokenImage from '../../../lib/getTokenImage';
import Loader from '../../UI/Loader';
import Image from 'next/image'

interface Props {
    publication: Publication
    setAlreadyCollected: Dispatch<boolean>
    setCount: Dispatch<number>
    count: number
}

const CollectModule: FC<Props> = ({publication, setAlreadyCollected, setCount, count }) => {
    const userSigNonce = useAppStore((state) => state.userSigNonce);
    const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
    const currentProfile = useAppStore((state) => state.currentProfile);
    const { address } = useAccount();
    const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });
    const [hasCollectedByMe, setHasCollectedByMe] = useState(publication?.hasCollectedByMe);
    const [showCollectorsModal, setShowCollectorsModal] = useState(false);
    const [allowed, setAllowed] = useState(true)
    const [revenue, setRevenue] = useState(0);
    const [usdPrice, setUsdPrice] = useState(0);

    const { data, loading } = useCollectModuleQuery({
        variables: { request: { publicationId: publication?.id } }
      });
  
      const collectModule: any = data?.publication?.collectModule
  
      const onCompleted = () => {
        toast.success('Collect Susccessfully!')
        setAlreadyCollected(true)
        setCount(count + 1)
      }
  
      const { isFetching, refetch } = useContractRead({
        address: UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
        abi: UpdateOwnableFeeCollectModule,
        functionName: 'getPublicationData',
        args: [parseInt(publication.profile?.id), parseInt(publication?.id.split('-')[1])],
        enabled: false
      })
  
      const {  data: writeData,
        isLoading: writeLoading,
        write } = useContractWrite({
        address: LENSHUB_PROXY,
        abi: LENS_HUB_ABI,
        functionName: 'collectWithSig',
        mode: 'recklesslyUnprepared',
        onSuccess: onCompleted,
        onError
      })

      const { data: allowanceData, loading: allowanceLoading } = useApprovedModuleAllowanceAmountQuery({
        variables: {
          request: {
            currencies: collectModule?.amount?.asset?.address,
            followModules: [],
            collectModules: collectModule?.type,
            referenceModules: []
          }
        },
        skip: !collectModule?.amount?.asset?.address || !currentProfile,
        onCompleted: (data) => {
          setAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00');
        }
      })

      const { data: revenueData, loading: revenueLoading } = usePublicationRevenueQuery({
        variables: {
          request: {
            publicationId: publication?.id
          }
        },
        pollInterval: 5000,
        skip: !publication?.id
      });

      useEffect(() => {
        setRevenue(parseFloat((revenueData?.publicationRevenue?.revenue?.total?.value as any) ?? 0));
        if (collectModule?.amount) {
          getCoingeckoPrice(getAssetAddress(collectModule?.amount?.asset?.symbol)).then((data) => {
            setUsdPrice(data);
          });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [revenueData]);

      const { data: balanceData, isLoading: balanceLoading } = useBalance({
        addressOrName: address,
        token: collectModule?.amount?.asset?.address,
        formatUnits: collectModule?.amount?.asset?.decimals,
        watch: true
      });

      let hasAmount = false;
        if (balanceData && parseFloat(balanceData?.formatted) < parseFloat(collectModule?.amount?.value)) {
            hasAmount = false;
        } else {
            hasAmount = true;
        }
  
      const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
      const [createCollectTypedData, { loading: typedDataLoading }] = useCreateCollectTypedDataMutation({
        onCompleted: async ({ createCollectTypedData }) => {
          try {
            const { id, typedData } = createCollectTypedData
            const { profileId, pubId, data: collectData, deadline } = typedData.value
            const signature = await signTypedDataAsync(getSignature(typedData.value))
            const { v, r, s } = splitSignature(signature)
            const sig = { v, r, s, deadline }
            const inputStruct = {
              collector: address,
              profileId,
              pubId,
              data: collectData,
              sig
            }
  
            setUserSigNonce(userSigNonce +1)
            if (!RELAY_ON) {
              return write?.({ recklesslySetUnpreparedArgs: [inputStruct] })
            }
  
            const {
              data: { broadcast: result }
            } = await broadcast({ request: { id, signature } })
  
            if ('reason' in result) {
              write?.({ recklesslySetUnpreparedArgs: [inputStruct] })
            }
          } catch {}
        },
        onError
      })
  
      const [createCollectProxyAction, { loading: proxyActionLoading }] = useProxyActionMutation({
        onCompleted,
        onError
      })
  
      const createViaProxyAction = async (variables: any) => {
        const { data } = await createCollectProxyAction({ variables })
        if (!data?.proxyAction) {
          createCollectTypedData({
            variables: {
              request: { publicationId: publication?.id },
              options: { overrideSigNonce: userSigNonce }
            }
          })
        }
      }
  
      const createCollect = () => {
        if (!currentProfile) {
          return toast.error("Please connect your wallet!")
        }
  
        if (collectModule?.type === CollectModules.FreeCollectModule) {
          createViaProxyAction({
            request: { collect: { freeCollect: { publicationId: publication?.id } }}
          })
        } else if (collectModule?.__typename === 'UnknownCollectModuleSettings') {
          refetch().then(({ data }) => {
            if (data) {
              const decodedData: any = data
              const encodedData = defaultAbiCoder.encode(
                ['address', 'uint256'],
                [decodedData?.[2] as string, decodedData?.[1] as BigNumber]
              )
              createCollectTypedData({
                variables: {
                  options: { overrideSigNonce: userSigNonce},
                  request: { publicationId: publication?.id, unknownModuleData: encodedData }
                }
              })
            }
          })
        } else {
          createCollectTypedData({
            variables: {
              options: { overrideSigNonce: userSigNonce },
              request: { publicationId: publication?.id }
            }
          })
        }
      }
  
      if (loading) {
        return <Loader message="Loading collect" />;
      }
  
      const isLoading =
      typedDataLoading || proxyActionLoading || signLoading || isFetching || writeLoading || broadcastLoading;

  return (
    <div className="p-5">
        <div className="pb-2 space-y-1.5">
            <div className="flex items-center space-x-2">
                {publication?.metadata?.name && (
                    <div className="text-xl font-bold">{publication?.metadata?.name}</div>
                )}
            </div>
            {publication?.metadata?.description && (
                <div className="text-gray-500 line-clamp-2">{publication?.metadata?.description}</div>
            )}
        </div>
        {collectModule?.amount && (
            <div className="flex items-center py-2 space-x-1.5">
                <Image 
                    src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                    className="w-5 h-5"
                    height={20}
                    width={20}
                    alt={collectModule?.amount?.asset?.symbol}
                    title={collectModule?.amount?.asset?.symbol}
                />
            </div>
        )}
        <div className="space-y-1.5">
            <div className="block space-y-1 sm:flex sm:space-x-5 item-center">
                <div className='flex items-center space-x-2'>
                    <UsersIcon className="w-4 h-4 text-gray-500" />
                    <div 
                      className="font-bold cursor-pointer"
                      onClick={() => {
                        setShowCollectorsModal(!showCollectorsModal)
                      }}
                    >
                      {count} collectors
                    </div>
                    <Modal
                      title="Collected by"
                      show={showCollectorsModal}
                      onClose={() => setShowCollectorsModal(false)}
                    >
                      <Collectors publicationId={publication?.id} />
                    </Modal>
                </div>
                {collectModule?.collectLimit && (
                    <div className="flex items-center space-x-2">
                        <CameraIcon className="w-4 h-4 text-gray-500" />
                        <div className="font-bold">{parseInt(collectModule?.collectLimit) - count} avaliable</div>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2 mt-5">
                {currentProfile && !hasCollectedByMe ? (
                    allowanceLoading || balanceLoading ? (
                        <div className="w-28 rounded-lg h-[34px] shimmer" />
                    ) : allowed ? (
                        hasAmount ? (
                            <Button onClick={createCollect}
                            disabled={isLoading}
                            variant="primary"
                            >
                                Collect Now
                            </Button>
                        ) : (
                            null
                        )
                    ) : (
                        "Collected"
                    )
                ) : null}
            </div>
        </div>
    </div>
  )
}

export default CollectModule