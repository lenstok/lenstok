import type { NextPage } from "next";

import Navbar from "@/components/Navbar";
import UploadVideo from "@/components/VideoUpload";

const Upload: NextPage = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <UploadVideo />
      </div>
    </div>
  );
};

export default Upload;
