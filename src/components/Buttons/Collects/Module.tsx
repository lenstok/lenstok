import { ApprovedAllowanceAmount, CollectModules } from "@/types/lens";
import { FC } from "react";
import AllowanceButton from "./AllowanceButton";


interface Props {
  allowance: any;
}

const Allowance: FC<Props> = ({ allowance }) => {
  return (
    <div className="space-y-4 p-5">
      {allowance?.approvedModuleAllowanceAmount?.map((item: ApprovedAllowanceAmount) =>
        item?.module === CollectModules.RevertCollectModule ||
        item?.module === CollectModules.FreeCollectModule ? (
          ''
        ) : (
          <AllowanceButton key={item?.contractAddress} module={item} />
        )
      )}
    </div>
  );
};

export default Allowance;