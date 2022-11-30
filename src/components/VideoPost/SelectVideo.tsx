import { useState } from "react";
import fileReaderStream from "filereader-stream";
import { useVideoStore } from "@/store/video";
import BundlrUpload from "../VideoUpload/BundlrUpload";

const SelectVideo = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadedVideo = useVideoStore((state) => state.uploadedVideo);
  const setUploadedVideo = useVideoStore((state) => state.setUploadedVideo);

  const onChoosenFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setSelectedFile(e?.target?.files[0]);
  };

  const uploadVideo = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile);
      console.log("Preview", preview);
      const stream = fileReaderStream(selectedFile);
      console.log("Stream:", stream);
      setUploadedVideo({ preview: preview, stream: stream });
    }
  };

  return (
    <div className="flex">
      <label htmlFor="chooseVideo" className="flex flex-col">
        Select a video:
        <input id="choosenVideo" type="file" onChange={onChoosenFile} />
        <button onClick={uploadVideo}>Upload!</button>
        {uploadedVideo.stream && <BundlrUpload />}
      </label>
    </div>
  );
};

export default SelectVideo;
