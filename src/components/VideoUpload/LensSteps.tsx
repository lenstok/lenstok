import { useEffect } from "react";
import { useAppStore } from "@/store/app";
import type {
  CreatePublicPostRequest,
  PublicationMetadataMediaInput,
  PublicationMetadataV2Input,
} from "@/types/lens";
import {
  PublicationContentWarning,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
} from "@/types/lens";
import { v4 as uuidv4 } from "uuid";
import { LENSTOK_URL } from "@/constants";

interface Props {
  id: string;
}

const LensSteps = ({ id }: Props) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo);
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo);
  const storeToIPFS = async () => {
    const body = { id: "ec7a8247-e579-45ba-bd39-07e1b48907c5" };
    try {
      console.log("TRY");
      const response = await fetch(`${LENSTOK_URL}/api/get-ipfs-cid`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status !== 200) {
        alert("Something wrong while trying getting Ipfs cid");
      } else {
        console.log("Form successfully submitted!");
        let responseJSON = await response.json();
        console.log("IPFS response is", responseJSON);
        const url = responseJSON.storage.ipfs.url;
        console.log("ipfs url:", url);
        setUploadedVideo({ videoSource: url });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadMetadata = async () => {
    console.log("UUUUUUUUUUUUUUUUUP");
    try {
      const metadata: PublicationMetadataV2Input = {
        version: "2.0.0",
        metadata_id: uuidv4(),
        description: uploadedVideo.description.trim(),
        content:
          `${uploadedVideo.title}\n\n${uploadedVideo.description}`.trim(),
        locale: "en",
        tags: [""],
        mainContentFocus: PublicationMainFocus.Video,
        animation_url: uploadedVideo.videoSource,
        image: uploadedVideo.thumbnail,
        imageMimeType: uploadedVideo.thumbnailType,
        name: uploadedVideo.title.trim(),
        attributes: [],
        media: [{ item: uploadedVideo.videoSource }],
        appId: "lenstok",
      };
      const response = await fetch(`${LENSTOK_URL}/api/metaToIpfs`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(metadata),
      });

      if (response.status !== 200) {
        console.log("Something wrong while trying storing to IPFS");
      } else {
        console.log("Metadata sent successfully to Ipfs...");
        let responseJSON = await response.json();
        console.log("Metadata  response is", responseJSON);
        /* const url = responseJSON.storage.ipfs.url;
        console.log("ipfs url:", url); */
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      Uploading to lens<button onClick={uploadMetadata}>send!</button>
    </div>
  );
};

export default LensSteps;
