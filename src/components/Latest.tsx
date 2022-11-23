import {
  ExplorePublicationsDocument,
  ExplorePublicationResult,
  Profile,
} from "@/types/lens";
import type { Publication } from "@/types/lens";
import { useQuery } from "@apollo/client";
import VideoCard from "@/components/UI/VideoCard";

const Latest = () => {
  const { data, loading, error } = useQuery<{
    explorePublications: ExplorePublicationResult;
  }>(ExplorePublicationsDocument, {
    variables: {
      request: {
        sortCriteria: "LATEST",
        publicationTypes: ["POST"],
        limit: 10,
        metadata: {
          mainContentFocus: ["VIDEO"],
        },
      },
    },
  });
  const publications = data?.explorePublications.items;
  console.log("DATA", data?.explorePublications.items);
  
  return (
    <div>
      {publications?.map((pub: Publication) => (
        <VideoCard key={pub.id} publication={pub as Publication} profile={pub.profile as Profile} />
      ))}
    </div>
  );
};

export default Latest;
