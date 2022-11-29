import { useEffect, useRef, useState, useMemo } from "react";
import { useAppStore } from "@/store/app";
import Button from "./Button";
import Asset from "./Asset";
import LensSteps from "./LensSteps";
import { useCreateAsset, useUpdateAsset, Player } from "@livepeer/react";
import LoginButton from "@/components/LoginButton";

const VideoUpload = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState("");
  const uploadedVideo = useAppStore((state) => state.uploadedVideo);
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo);

  const {
    mutate: createAsset,
    data: assets,
    progress,
    isSuccess,
    error,
  } = useCreateAsset(
    video ? { sources: [{ name: video.name, file: video }] } : null
  );

  const uploadAsset = async () => {
    console.log("Uploading...", progress);
    const response = await createAsset?.();
    if (response) console.log("Mutation response", response);
    if (assets) console.log("Asset ID", assets?.[0].id);
    if (error) console.log("Error", error);
  };

  const progressFormatted = useMemo(
    () =>
      progress?.[0].phase === "failed"
        ? "Failed to process video."
        : progress?.[0].phase === "waiting"
        ? "Waiting"
        : progress?.[0].phase === "uploading"
        ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
        : progress?.[0].phase === "processing"
        ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
        : null,
    [progress]
  );
  const choseFile = () => {
    ref.current?.click();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const previewURL = URL.createObjectURL(file);
      setPreviewURL(previewURL);
      console.log("File data", file);
      setVideo(file);
    } else {
      return;
    }
  };
  console.log("Assets", assets);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00A660] to-[#2BCE88] mb-4">
        Publish on Lenstok!
      </h1>
      <LoginButton />
      <Button onClick={video ? uploadAsset : choseFile}>
        {video ? "Upload Video" : "Select Video"}
      </Button>
      <input type={"file"} className="hidden" ref={ref} onChange={onChange} />
      {video && <Asset asset={video} progress={progressFormatted} />}
      {assets?.map((asset) => (
        <div key={asset.id}>
          <div className="w-550 mt-12">
            {asset?.playbackId && (
              <div>
                <Player title={asset.name} playbackId={asset.playbackId} />
                <LensSteps id={asset.id} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoUpload;
