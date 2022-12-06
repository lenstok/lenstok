import React, { useEffect, useState, useRef, useMemo } from "react";
import { useCreateAsset, useUpdateAsset, Player } from "@livepeer/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import fileReaderStream from "filereader-stream";
import { topics } from "@/utils/const";
import Asset from "@/components/VideoUpload/Asset";
import LensSteps from "@/components/VideoUpload/LensSteps";
import BundlrUpload from "@/components/VideoUpload/BundlrUpload";
import {
  useAppStore,
  UPLOADED_VIDEO_FORM_DEFAULTS,
  UPLOADED_VIDEO_BUNDLR_DEFAULTS,
} from "@/store/app";

import toast from "react-hot-toast";
import { Spinner } from "../UI/Spinner";

const UploadVideo = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [videoAsset, setVideoAsset] = useState<File | null>(null);
  const [wrongFileType, setWrongFileType] = useState(false);
  const currentUser = useAppStore((state) => state.currentProfile);
  const uploadedVideo = useAppStore((state) => state.uploadedVideo);
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo);
  const setBundlrData = useAppStore((state) => state.setBundlrData);
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

  console.log("Current User is", currentUser);

  const resetToDefaults = () => {
    setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS);
    setBundlrData(UPLOADED_VIDEO_BUNDLR_DEFAULTS);
    setTitle("");
    setDescription("");
  };

  useEffect(() => {
    if (uploadedVideo.isIndexed) {
      resetToDefaults();
    }
  }, [uploadedVideo.isIndexed]);

  const uploadAsset = async () => {
    if (videoAsset) {
      const preview = URL.createObjectURL(videoAsset);
      const stream = fileReaderStream(videoAsset);
      setUploadedVideo({
        stream: stream,
        preview: preview,
        videoType: videoAsset.type || "video/mp4",
        title: title,
        description: description,
        category: category,
        isUploadToAr: true,
        buttonText: "Upload Video",
      });
      toast.success(
        "Please sign with your wallet to check you storage balance on Bundlr and if necessary fund it with some Matic."
      );
    }

    if (error) console.log("Error", error);
  };
  console.log("Stream from index", uploadedVideo.stream);

  const choseFile = () => {
    ref.current?.click();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const previewURL = URL.createObjectURL(file);
      setVideoAsset(file);
      setUploadedVideo({ preview: previewURL });
    } else {
      return;
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
              {uploadedVideo.stream ? (
                <div>
                  {uploadedVideo.preview ? (
                    <div>
                      <video
                        title={videoAsset?.name}
                        src={uploadedVideo.preview}
                      />
                    </div>
                  ) : (
                    <div>{videoAsset?.name}</div>
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
          {uploadedVideo.stream && <BundlrUpload />}
          <div className="flex gap-6 mt-10">
            <button
              onClick={resetToDefaults}
              type="button"
              className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
            >
              {" "}
              Discard
            </button>
            {uploadedVideo.isUploadToAr ? (
              <button
                type="button"
                className="bg-emerald-700 text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
                disabled={uploadedVideo.loading}
              >
                <div className="flex justify-around">
                  <div>
                    <LensSteps />
                  </div>
                  {uploadedVideo.loading && (
                    <div>
                      <Spinner />
                    </div>
                  )}
                </div>
              </button>
            ) : (
              <div>
                <button
                  onClick={videoAsset ? uploadAsset : choseFile}
                  type="button"
                  className="bg-emerald-700 text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
                >
                  {videoAsset ? "Upload Video" : "Select a Video"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;
