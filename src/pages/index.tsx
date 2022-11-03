import type { NextPage } from "next";
import {
  ExplorePublicationsDocument,
  ExplorePublicationResult,
} from "@/types/lens";
import { useQuery } from "@apollo/client";
import LoginButton from "@/components/LoginButton";

const Home: NextPage = () => {
  const { data, loading, error } = useQuery<{
    explorePublications: ExplorePublicationResult;
  }>(ExplorePublicationsDocument, {
    variables: {
      sortCriteria: "LATEST",
      limit: 10,
      metadata: {
        mainContentFocus: ["VIDEO"],
      },
    },
  });
  const publications = data?.explorePublications.items;
  console.log("DATA", data?.explorePublications);
  return (
    <div>
      <>
        <LoginButton />
        {publications?.map((publication) => {
          <div>{publication.metadata.media[0].original.url}</div>;
        })}
      </>
    </div>
  );
};

export default Home;
