import { useRef, useState } from "react";
import Button from "./Button";
import Asset from "./Asset";
import { useCreateAsset } from "@livepeer/react";

const VideoUpload = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [asset, setAsset] = useState<File | null>(null);

  const {
    mutate: createAsset,
    data: assets,
    progress,
    error,
  } = useCreateAsset(
    asset ? { sources: [{ name: asset.name, file: asset }] } : null
  );

  const uploadAsset = async () => {
    console.log("Uploading...", progress);
    await createAsset?.();
  };

  const choseFile = () => {
    ref.current?.click();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setAsset(file);
    } else {
      return;
    }
  };
  console.log("Assets", progress);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00A660] to-[#2BCE88] mb-4">
        Publish on Lenstok!
      </h1>
      <Button onClick={asset ? uploadAsset : choseFile}>
        {asset ? "Upload Video" : "Select Video"}
      </Button>
      <input type={"file"} className="hidden" ref={ref} onChange={onChange} />
      {asset && <Asset asset={asset} />}
    </div>
  );
};

export default VideoUpload;
