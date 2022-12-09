import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { useAppStore } from "@/store/app";

const Collect = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const uploadedVideo = useAppStore((state) => state.uploadedVideo);
  const canCollects = ["Anyone", "Followers"];
  const prizes = ["Free", "1", "5", "10"];
  const [canCollect, setCanCollect] = useState(canCollects[0]);
  const [prize, setPrize] = useState(prizes[0]);

  useEffect(() => {
    uploadedVideo.collectModule.recipient = currentProfile?.ownedBy;
    if (prize === "Free") {
      uploadedVideo.collectModule.isFreeCollect = true;
      uploadedVideo.collectModule.isFeeCollect = false;
      uploadedVideo.collectModule.amount!.value = "0";
      if (canCollect === "Anyone") {
        uploadedVideo.collectModule.followerOnlyCollect = false;
      } else {
        uploadedVideo.collectModule.followerOnlyCollect = true;
      }
    } else {
      uploadedVideo.collectModule.isFreeCollect = false;
      uploadedVideo.collectModule.isFeeCollect = true;
      uploadedVideo.collectModule.amount!.value = prize;
      if (canCollect === "Anyone") {
        uploadedVideo.collectModule.followerOnlyCollect = false;
      } else {
        uploadedVideo.collectModule.followerOnlyCollect = true;
      }
    }
  }, [canCollect, prize]);
  console.log("Collect value", canCollect);
  console.log("Prize", prize);

  return (
    <div className="space-y-2">
      {" "}
      <RadioGroup value={canCollect} onChange={setCanCollect}>
        <RadioGroup.Label as="div" className="my-2">
          Who can collect your video?
        </RadioGroup.Label>
        <div className="flex justify-center">
          {canCollects.map((canCollect) => (
            <RadioGroup.Option key={canCollect} value={canCollect}>
              {({ active, checked }) => (
                <div
                  className={clsx("p-2 cursor-pointer rounded", {
                    "bg-emerald-700 text-white": checked,
                    "bg-white text-black": !checked,
                  })}
                >
                  {canCollect}
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <RadioGroup value={prize} onChange={setPrize}>
        <RadioGroup.Label as="div" className="my-2">
          Prize (in wMatic):
        </RadioGroup.Label>
        <div className="flex justify-center">
          {prizes.map((prize) => (
            <RadioGroup.Option key={prize} value={prize}>
              {({ active, checked }) => (
                <div
                  className={clsx("p-2 cursor-pointer rounded", {
                    "bg-emerald-700 text-white": checked,
                    "bg-white text-black": !checked,
                  })}
                >
                  {prize}
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default Collect;
