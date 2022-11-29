import React, { useEffect, useState, useRef, useMemo } from "react";
import { useCreateAsset, useUpdateAsset, Player } from "@livepeer/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { topics } from "@/utils/const";
import Asset from "@/components/VideoUpload/Asset";
import LensSteps from "@/components/VideoUpload/LensSteps";
import { useAppStore } from "@/store/app";

const Upload = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [videoAsset, setVideoAsset] = useState<File | null>(null);
  const [playbackId, setPlaybackId] = useState<string | undefined>();
  const [wrongFileType, setWrongFileType] = useState(false);
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(topics[0].name); //this is a placeholder for now

  const {
    mutate: createAsset,
    data: assets,
    progress,
    isSuccess,
    error,
  } = useCreateAsset(
    videoAsset
      ? { sources: [{ name: videoAsset.name, file: videoAsset }] }
      : null
  );

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

  const uploadAsset = async () => {
    console.log("Uploading...", progress);
    const response = await createAsset?.();
    if (response) console.log("Mutation response", response);
    if (assets) console.log("Asset ID FROM UPLOAD FUCNTIOJ`N", assets?.[0].id);
    const playbackId = assets?.[0].playbackId;
    setPlaybackId(playbackId);
    setUploadedVideo({
      title: title,
      description: description,
      category: category,
    });
    if (error) console.log("Error", error);
  };

  const choseFile = () => {
    ref.current?.click();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const previewURL = URL.createObjectURL(file);
      setVideoAsset(file);
    } else {
      return;
    }
  };
  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0];
    const fileTypes = ["video/mp4", "video/webm", "video/ogg"];

    if (fileTypes.includes(selectedFile.type)) {
      setIsLoading(true);
      setWrongFileType(false);
    } else {
      setIsLoading(false);
      setWrongFileType(true);
    }
  };

  return (
    <div className="flex w-full h-full absolute left-0 top-[70px] lg:top-[70px] mb-10 pt-10 lg:pt-5 bg-[#F8F8F8] justify-center">
      <div className=" bg-white rounded-lg lg:h-[90vh] flex gap-6 flex-wrap justify-center items-center p-14 pt-6">
        <div>
          <div>
            <p className="text-2xl font-bold">Upload Video</p>
            <p className="text-md text-gray-400 mt-1">
              Post a video to your account
            </p>
          </div>
          <div className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[458px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100">
            <div>
              {videoAsset ? (
                <div>
                  {assets?.[0].playbackId ? (
                    <div>
                      <Player
                        title={videoAsset.name}
                        playbackId={assets?.[0].playbackId}
                      />
                    </div>
                  ) : (
                    <div>
                      <Asset asset={videoAsset} progress={progressFormatted} />
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold text-xl">
                        <FaCloudUploadAlt className="text-gray-300 text-6xl" />
                      </p>
                      <p className="text-xl font-semibold">Upload Video</p>
                    </div>

                    <p className="text-gray-400 text-center mt-10 text-sm leading-10">
                      MP4 or WebM or ogg <br />
                      720x1280 resolution or higher <br />
                      Make it short <br />
                      Less than 2 GB
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={ref}
                    name="upload-video"
                    className="hidden"
                    onChange={onChange}
                  ></input>
                </label>
              )}
            </div>

            {wrongFileType && (
              <p className="text-center text-xl text-red-400 font-semibold mt-4 w-[250px]">
                Please select a video file
              </p>
            )}
          </div>
        </div>

        {/* //start form// */}
        <div className="flex flex-col gap-3 pb-10">
          <label className="text-md font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2"
          ></input>

          <label className="text-md font-medium">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2"
          ></input>

          <label className="text-md font-medium">Choose a Category</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer"
          >
            {topics.map((topic) => (
              <option
                key={topic.name}
                className="outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300"
                value={topic.name}
              >
                {topic.name}
              </option>
            ))}
            ;
          </select>

          <div className="flex gap-6 mt-10">
            <button
              onClick={() => {}}
              type="button"
              className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
            >
              {" "}
              Discard
            </button>
            {assets?.[0].playbackId ? (
              <button
                /*  onClick={handlePost} */
                type="button"
                className="bg-emerald-700 text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
              >
                <LensSteps
                  id={assets?.[0].id}
                  title={title}
                  description={description}
                />
              </button>
            ) : (
              <div>
                {videoAsset ? (
                  <button
                    onClick={uploadAsset}
                    type="button"
                    className="bg-emerald-700 text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
                  >
                    Upload to Arweave
                  </button>
                ) : (
                  <button
                    onClick={choseFile}
                    type="button"
                    className="bg-emerald-700 text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
                  >
                    Select a Video
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
