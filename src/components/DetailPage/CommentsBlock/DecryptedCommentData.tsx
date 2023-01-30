import { useAppStore } from "@/store/app";
import { useCanDecryptStatusQuery } from "@/types/graph";
import { DecryptFailReason, Publication, PublicationMetadataV2Input } from "@/types/lens";
import useNFT from "@/utils/useNFT";
import { CollectConditionOutput, Erc20OwnershipOutput, NftOwnershipOutput } from "@lens-protocol/sdk-gated/dist/graphql/types";
import Link from "next/link";
import Image from "next/image";
import React, { FC, useState } from "react";
import { useProvider, useSigner, useToken } from "wagmi";
import getAvatar from "@/lib/getAvatar";
import { LockOpenIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { sanitizeIpfsUrl } from "@/utils/sanitizeIpfsUrl";
import axios from "axios";
import { LensGatedSDK } from "@lens-protocol/sdk-gated";
import { LIT_PROTOCOL_ENV, OPENSEA_MARKETPLACE_URL, POLYGONSCAN_URL } from "@/constants";

interface Props {
    encryptedPublication: Publication;
}

const DecryptedCommentData: FC<Props> = ({ encryptedPublication }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<any>(null);
  const [canDecrypt, setCanDecrypt] = useState<boolean>(encryptedPublication?.canDecrypt.result);
  const [reasons, setReasons] = useState<any>(encryptedPublication?.canDecrypt.reasons);
  const provider = useProvider();
  const { data: signer } = useSigner();

  useCanDecryptStatusQuery({
    variables: {
      request: { publicationId: encryptedPublication.id },
      profileId: currentProfile?.id ?? null
    },
    pollInterval: 5000,
    skip: canDecrypt || !currentProfile,
    onCompleted: (data) => {
      setCanDecrypt(data.publication?.canDecrypt.result || false);
      setReasons(data.publication?.canDecrypt.reasons || []);
    }
  });

  const getCondition = (key: string) => {
    const criteria: any = encryptedPublication.metadata.encryptionParams?.accessCondition.or?.criteria;

    const getCriteria = (key: string) => {
      return criteria.map((item: any) => item[key]).find((item: any) => item);
    };

    if (getCriteria('and')?.criteria) {
      return getCriteria('and')
        .criteria.map((item: any) => item[key])
        .find((item: any) => item);
    }

    if (getCriteria('or')?.criteria) {
      return getCriteria('or')
        .criteria.map((item: any) => item[key])
        .find((item: any) => item);
    }

    return criteria.map((item: any) => item[key]).find((item: any) => item);
  };

  // Conditions
  const tokenCondition: Erc20OwnershipOutput = getCondition('token');
  const nftCondition: NftOwnershipOutput = getCondition('nft');
  const collectCondition: CollectConditionOutput = getCondition('collect');

  const { data: tokenData } = useToken({
    address: tokenCondition?.contractAddress,
    chainId: tokenCondition?.chainID,
    enabled: Boolean(tokenCondition)
  });

  const { data: nftData } = useNFT({
    address: nftCondition?.contractAddress,
    chainId: nftCondition?.chainID,
    enabled: Boolean(nftCondition)
  });

  // Status
  // Collect checks - https://docs.lens.xyz/docs/gated#collected-publication
  const hasNotCollectedPublication = reasons?.includes(DecryptFailReason.HasNotCollectedPublication)
  const collectNotFinalisedOnChain = !hasNotCollectedPublication && reasons?.includes(DecryptFailReason.CollectNotFinalisedOnChain)
  // Follow checks - https://docs.lens.xyz/docs/gated#profile-follow
  const doesNotFollowProfile = reasons?.includes(DecryptFailReason.DoesNotFollowProfile);
  const followNotFinalisedOnChain =
    !doesNotFollowProfile && reasons?.includes(DecryptFailReason.FollowNotFinalisedOnChain);
  // Token check - https://docs.lens.xyz/docs/gated#erc20-token-ownership
  const unauthorizedBalance = reasons?.includes(DecryptFailReason.UnauthorizedBalance);
  // NFT check - https://docs.lens.xyz/docs/gated#erc20-token-ownership
  const doesNotOwnNft = reasons?.includes(DecryptFailReason.DoesNotOwnNft);

  const getDecryptedData = async () => {
    if (!signer || isDecrypting) {
        return
    }

    setIsDecrypting(true)
    const contentUri = sanitizeIpfsUrl(encryptedPublication?.onChainContentURI)
    const { data } = await axios.get(contentUri)
    const sdk = await LensGatedSDK.create({ provider, signer, env: LIT_PROTOCOL_ENV as any })
    const { decrypted, error } = await sdk.gated.decryptMetadata(data)
    setDecryptedData(decrypted)
    setDecryptError(error)
    setIsDecrypting(false)
  } 

  useEffect(() => {
    const lensLitAuthSig = localStorage.getItem('lens-lit-authsig');

    if (lensLitAuthSig) {
      getDecryptedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (!currentProfile) {
    return(
        <div className="flex gap-2">
        <Link href={`/profile/${encryptedPublication.profile.id}`} key={encryptedPublication.profile.id}>
        <div className="flex-shrink-0 rounded-full">
        <Image
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            src={getAvatar(encryptedPublication.profile)}
            alt={encryptedPublication.profile.handle}
          />
        </div>
        </Link>
        <div className="flex-grow w-[90%]">
            <p className="font-bold hover:underline">{encryptedPublication.profile.handle}</p>
            <p
             style={{
              wordWrap: "break-word",
              overflowWrap: "break-word",
             }}
            >
                Login to Decrypt
            </p>
        </div>
    </div>
    )
  }

  if (!canDecrypt) {
    return(
        <div className="flex gap-2">
        <Link href={`/profile/${encryptedPublication.profile.id}`} key={encryptedPublication.profile.id}>
        <div className="flex-shrink-0 rounded-full">
        <Image
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            src={getAvatar(encryptedPublication.profile)}
            alt={encryptedPublication.profile.handle}
          />
        </div>
        </Link>
        <div className="flex-grow w-[90%]">
            <p className="font-bold hover:underline">{encryptedPublication.profile.handle}</p>
            <p
             style={{
              wordWrap: "break-word",
              overflowWrap: "break-word",
             }}
            >
                <span className="flex flex-row bg-[#96de26] text-[#25511f] font-semibold p-2 rounded cursor-pointer">
                    <LockClosedIcon className="w-5 h-5 mr-2" />
                    To Decrypt this you have to:

                    {/* Collect checks */}
                    {hasNotCollectedPublication && (
                        <div>
                            Collect the{' '}
                            <Link
                                href={`/detail/${collectCondition?.publicationId}`}
                            >
                                {encryptedPublication.__typename}
                            </Link>
                        </div>
                    )}
                    {collectNotFinalisedOnChain && (
                        <div>Collect finalizing on chain...</div>
                    )}

                    {/* Follow checks */}
                    {doesNotFollowProfile && (
                        <div>
                            Follow{' '}
                            <Link
                                href={`/profile/${encryptedPublication?.profile?.id}`} 
                                key={encryptedPublication?.profile?.id}
                            >
                                {encryptedPublication?.profile?.handle}
                            </Link>
                        </div>
                    )}
                    {followNotFinalisedOnChain && (
                        <div>Follow finalizing on chain...</div>
                    )}

                    {/* Token check */}
                    {unauthorizedBalance && (
                        <div>
                            <a
                                href={`${POLYGONSCAN_URL}/token/${tokenCondition.contractAddress}`}
                                className="font-bold underline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {tokenCondition.amount} {tokenData?.symbol}
                            </a>
                            {' '} to unlock
                        </div>
                    )}

                    {/* NFT check */}
                    {doesNotOwnNft && (
                        <div>
                            <a
                                href={`${OPENSEA_MARKETPLACE_URL}/collection/polygon/${nftCondition.contractAddress}/items`}
                                className="font-bold underline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {nftData?.contractMetadata?.symbol}
                            </a>
                            {' '}nft to unlock 
                        </div>
                    )}
                </span>
            </p>
        </div>
    </div>
    )
  }

  if(!decryptedData) {
    return(
        <div className="flex gap-2">
            <Link href={`/profile/${encryptedPublication.profile.id}`} key={encryptedPublication.profile.id}>
            <div className="flex-shrink-0 rounded-full">
            <Image
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
                src={getAvatar(encryptedPublication.profile)}
                alt={encryptedPublication.profile.handle}
              />
            </div>
            </Link>
            <div className="flex-grow w-[90%]">
                <p className="font-bold hover:underline">{encryptedPublication.profile.handle}</p>
                <p
                 style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                 }}
                >
                    <span className="flex flex-row bg-[#96de26] text-[#25511f] font-semibold p-2 rounded cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation()
                        getDecryptedData()
                    }}
                    >
                        <LockOpenIcon className="w-5 h-5 mr-2" />
                        Decrypt {encryptedPublication.__typename}
                    </span>
                </p>
            </div>
        </div>
      )
  }

  const publication: PublicationMetadataV2Input = decryptedData;

  return(
    <div className="flex gap-2">
        <Link href={`/profile/${encryptedPublication.profile.id}`} key={encryptedPublication.profile.id}>
        <div className="flex-shrink-0 rounded-full">
        <Image
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            src={getAvatar(encryptedPublication.profile)}
            alt={encryptedPublication.profile.handle}
          />
        </div>
        </Link>
        <div className="flex-grow w-[90%]">
            <p className="font-bold hover:underline">{encryptedPublication.profile.handle}</p>
            <p
             style={{
              wordWrap: "break-word",
              overflowWrap: "break-word",
             }}
            >
                {publication.content}
            </p>
        </div>
    </div>
  )
}

export default DecryptedCommentData

function useEffect(arg0: () => void, arg1: never[]) {
    throw new Error("Function not implemented.");
}
