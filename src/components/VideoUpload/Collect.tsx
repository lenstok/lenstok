import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

const Collect = () => {
  const canCollects = ["Anyone", "Followers", "None"];
  const prizes = ["Free", "1", "5", "10"];
  const [canCollect, setCanCollect] = useState(canCollects[0]);
  const [prize, setPrize] = useState(prizes[0]);

  console.log("Collect value", canCollect);

  return (
    <div className="space-y-2">
      {" "}
      <RadioGroup value={canCollect} onChange={setCanCollect}>
        <RadioGroup.Label>Who can collect your video?</RadioGroup.Label>
        <div className="flex">
          {canCollects.map((canCollect) => (
            <RadioGroup.Option key={canCollect} value={canCollect}>
              {({ active, checked }) => (
                <div
                  className={`${
                    active ? "bg-blue-500 text-white" : "bg-white text-black"
                  }`}
                >
                  {canCollect}
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <RadioGroup value={prize} onChange={setPrize}>
        <RadioGroup.Label>Prize (wMatic):</RadioGroup.Label>
        <div className="flex">
          {prizes.map((prize) => (
            <RadioGroup.Option key={prize} value={prize}>
              {({ active, checked }) => (
                <div
                  className={`${
                    active ? "bg-blue-500 text-white" : "bg-white text-black"
                  }`}
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
