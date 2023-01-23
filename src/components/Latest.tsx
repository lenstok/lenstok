import {
  ExplorePublicationsDocument,
  ExplorePublicationResult,
  Profile,
} from "@/types/lens";
import type { Publication } from "@/types/lens";
import { useQuery } from "@apollo/client";
import VideoCard from "@/components/HomePage/VideoCard";
import { useAppStore } from "@/store/app";

const Latest = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error } = useQuery<{
    explorePublications: ExplorePublicationResult;
  }>(ExplorePublicationsDocument, {
    variables: {
      request: {
        sortCriteria: "LATEST",
        publicationTypes: ["POST"],
        limit: 20,
        excludeProfileIds: [
          "0x5eaf",
          "0x3f7d",
          "0x5b94",
          "0x5c7c",
          "0x62dd",
          "0x53cd",
        ],
        metadata: {
          mainContentFocus: ["VIDEO"],
        },
      },
      reactionRequest,
      profileId,
    },
  });
  const publications = data?.explorePublications.items;
  console.log("DATA", data?.explorePublications.items);

  return (
    <div>
      {publications?.map((pub: Publication) => (
        <VideoCard
          key={pub.id}
          publication={pub as Publication}
          profile={pub.profile as Profile}
        />
      ))}
    </div>
  );
};

export default Latest;
