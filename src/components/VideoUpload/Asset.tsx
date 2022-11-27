interface Props {
  asset: File;
  progress: string | null;
}

const Asset = ({ asset, progress }: Props) => {
  return (
    <div className="bg-white shadow-md rounded-lg w-[40%] mt-8">
      <div className="flex flex-row items-center ">
        <div className="flex justify-center items-center w-24 h-20 rounded-l-lg bg-gradient-to-r from-[#00A660] to-[#2BCE88]">
          <p className="text-xl font-semibold text-white">
            .{asset.name.split(".").pop()}
          </p>
        </div>
        <div className="flex flex-col justify-center items-start ml-8">
          <p className="text-lg font-semibold text-gray-800">{asset.name}</p>
          <p>{progress}</p>
        </div>
      </div>
    </div>
  );
};

export default Asset;
