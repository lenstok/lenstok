import { useEffect, useState } from "react";
import { useAccount, useConnect, useSigner, useBalance } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { CHAIN_ID } from "@/constants";
import toast from "react-hot-toast";
import { WebBundlr } from "@bundlr-network/client";
import { utils } from "ethers";
import { useAppStore } from "@/store/app";
import { ARWEAVE_WEBSITE_URL } from "@/constants";

export default function BundlrUpload() {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner({
    onError(error) {
      toast.error(error?.message);
    },
  });
  const { data: userBalance } = useBalance({
    addressOrName: address,
    chainId: CHAIN_ID,
  });
  const bundlrData = useAppStore((state) => state.bundlrData);
  const setBundlrData = useAppStore((state) => state.setBundlrData);
  const getBundlrInstance = useAppStore((state) => state.getBundlrInstance);
  const uploadedVideo = useAppStore((state) => state.uploadedVideo);
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo);

  const [totalUploaded, setTotalUploaded] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  console.log("Bundlr Data", bundlrData);

  const fetchBalance = async (bundlr?: WebBundlr) => {
    const instance = bundlr || bundlrData.instance;
    if (address && instance) {
      const balance = await instance.getBalance(address);
      setBundlrData({
        balance: utils.formatEther(balance.toString()),
      });
    }
  };

  const estimatePrice = async (bundlr: WebBundlr) => {
    console.log("Stream", uploadedVideo.stream);
    if (!uploadedVideo.stream)
      return toast.error("Upload cost estimation failed!");
    const price = await bundlr.getPrice(uploadedVideo.stream?.size);
    setBundlrData({
      estimatedPrice: utils.formatEther(price.toString()),
    });
  };

  const initBundlr = async () => {
    if (signer?.provider && address && !bundlrData.instance) {
      toast("Sign to initialize & estimate upload...");
      const bundlr = await getBundlrInstance(signer);
      if (bundlr) {
        await fetchBalance(bundlr);
        await estimatePrice(bundlr);
        setBundlrData({ instance: bundlr });
      }
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (signer?.provider && mounted) {
      console.log("INIT BUNDLR INSTANCE");
      initBundlr().catch((error) => toast("[Error Init Bundlr]", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer?.provider, mounted]);

  useEffect(() => {
    if (bundlrData.instance && mounted) {
      fetchBalance(bundlrData.instance).catch((error) =>
        console.log("[Error Fetch Bundlr Balance]", error)
      );
      estimatePrice(bundlrData.instance).catch((error) =>
        console.log("[Error Estimate Video Price ]", error)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundlrData.instance]);

  const depositToBundlr = async () => {
    if (!bundlrData.instance) return await initBundlr();
    if (!bundlrData.deposit) return toast.error("Enter deposit amount");
    const depositAmount = parseFloat(bundlrData.deposit);
    const value = utils.parseUnits(depositAmount.toString())._hex;
    if (!value || Number(value) < 1) {
      return toast.error("Invalid deposit amount");
    }
    if (
      userBalance?.formatted &&
      parseFloat(userBalance?.formatted) < depositAmount
    ) {
      return toast.error("Insufficient funds in your wallet");
    }
    setBundlrData({ depositing: true });
    try {
      const fundResult = await bundlrData.instance.fund(value);
      if (fundResult) {
        toast.success(
          `Deposit of ${utils.formatEther(
            fundResult?.quantity
          )} is done and it will be reflected in few seconds.`
        );
      }
    } catch (error) {
      toast.error("Failed to deposit");
      console.log("[Error Bundlr Deposit]", error);
    } finally {
      await fetchBalance();
      setBundlrData({
        deposit: null,
        showDeposit: false,
        depositing: false,
      });
    }
  };

  const uploadToBundlr = async () => {
    try {
      if (!bundlrData.instance) console.log("Bundlr instance is undefined");
      if (bundlrData.balance > bundlrData.estimatedPrice) {
        const uploader = bundlrData.instance?.uploader.chunkedUploader;
        uploader?.setBatchSize(2);
        uploader?.setChunkSize(10_000_000);
        uploader?.on("chunkUpload", (chunkInfo) => {
          const fileSize = uploadedVideo?.file?.size as number;
          const percentCompleted = Math.round(
            (chunkInfo.totalUploaded * 100) / fileSize
          );
          setUploadedVideo({
            loading: true,
            percent: percentCompleted,
          });
        });
        const tags = [
          {
            name: "Content-Type",
            value: uploadedVideo.videoType || "video/mp4",
          },
          { name: "App-Name", value: "Lenstok" },
        ];
        const upload = uploader?.uploadData(uploadedVideo.stream as any, {
          tags: tags,
        });
        const response = await upload;
        console.log("Upload", response);
        setUploadedVideo({
          videoSource: `${ARWEAVE_WEBSITE_URL}/${response?.data.id}`,
          isUploadToAr: true,
        });
      } else {
        toast.error(
          "Insuffisant balance on your account. Please fund it to reach the estimated price."
        );
      }
    } catch (error) {
      toast.error("Failed to upload video to bundlr.");
      console.log("Failed to upload video to bundlr: ", error);
    }
  };

  return (
    <div className="w-full mt-4 space-y-2">
      <div className="flex flex-col">
        <div className="inline-flex items-center justify-between text-xs font-semibold rounded opacity-70">
          <span className="flex items-center space-x-1.5">
            <span>Your Storage Balance</span>

            <button
              type="button"
              className="focus:outline-none"
              onClick={() => fetchBalance()}
            >
              Refresh balance
            </button>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-lg font-medium">{bundlrData.balance}</span>
          <span>
            <button
              type="button"
              onClick={() =>
                setBundlrData({ showDeposit: !bundlrData.showDeposit })
              }
              className="inline-flex py-0.5 items-center pl-1.5 pr-0.5 bg-emerald-700 text-white rounded-full focus:outline-none dark:bg-gray-800"
            >
              <span className="text-xs px-0.5">Deposit</span>
            </button>
          </span>
        </div>
      </div>
      {bundlrData.showDeposit && (
        <div>
          <div className="inline-flex flex-col text-xs font-medium opacity-70">
            Amount to deposit
          </div>
          <div className="flex items-end space-x-2">
            <input
              type="number"
              placeholder="100 MATIC"
              className="!py-1.5"
              autoComplete="off"
              min={0}
              value={bundlrData.deposit || ""}
              onChange={(e) => {
                setBundlrData({ deposit: e.target.value });
              }}
            />
            <div>
              <button
                type="button"
                disabled={bundlrData.depositing}
                onClick={() => depositToBundlr()}
                className="mb-0.5 !py-1.5"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <span className="inline-flex flex-col text-xs font-semibold opacity-70">
          Estimated Cost to Upload
        </span>
        <div className="text-lg font-medium">{bundlrData.estimatedPrice}</div>
      </div>
      <div>
        <button
          type="button"
          disabled={bundlrData.depositing}
          onClick={() => uploadToBundlr()}
          className="mb-0.5 !py-1.5"
        >
          Upload to Bundlr
        </button>
      </div>
    </div>
  );
}
