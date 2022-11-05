import {
  ExplorePublicationsDocument,
  ExplorePublicationResult,
} from "@/types/lens";
import type { Publication } from "@/types/lens";
import { useQuery } from "@apollo/client";
import VideoCard from "@/components/UI/VideoCard";

const Explore = () => {
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
      {publications?.map((pub) => (
        <VideoCard key={pub.id} publication={pub as Publication} />
      ))}
    </div>
  );
};

export default Explore;
