import {
  ExplorePublicationsDocument,
  ExplorePublicationResult,
} from "@/types/lens";
import { useQuery } from "@apollo/client";

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
        <div key={pub.id}>{pub?.metadata?.media[0]?.original.url}</div>
      ))}
    </div>
  );
};

export default Explore;
