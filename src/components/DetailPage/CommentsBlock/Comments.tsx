import React, { Dispatch, FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppStore, useTransactionPersistStore } from "src/store/app";

import NoResults from "./NoResults";
import { useQuery } from "@apollo/client";
import { Publication, PublicationsDocument } from "@/types/lens";
import { useRouter } from "next/router";
import { sanitizeIpfsUrl } from "@/utils/sanitizeIpfsUrl";
import CreateComment from "./CreateComment";
import getAvatar from "@/lib/getAvatar";
import CommentData from "./CommentData";
import QueuedData from "../../QueuedData";
import LoginButton from "@/components/Login/LoginButton";
import LitJsSdk from "@lit-protocol/sdk-browser";
import lit from "@/lib/lit";

interface Props {
  publication: Publication;
}

const Comments: FC<Props> = ({ publication }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);

  const router = useRouter();
  const { id } = router.query;
  const variables = {
    request: {
      commentsOf: id,
    },
  };

  const { data, loading, error, refetch } = useQuery(PublicationsDocument, {
    variables,
  });
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const fetchComments = async () => {
        const fetchedComments: any = await decrypt();
        setComments(fetchedComments);
      };
      fetchComments().catch(console.error);
    }
  }, [data]);
  console.log("Comments", comments);

  const refetchComments = () => {
    refetch({
      ...variables,
    });
  };

  async function decrypt() {
    if (data) {
      let decryptedComments = await Promise.all(
        comments.map(async (comment) => {
          const attributes = comment.metadata.attributes[0];
          if (attributes && attributes.traitType === "encrypted") {
            try {
              const ipfsUrl = comment.metadata.attributes[0].value;
              const response = await fetch(ipfsUrl);
              const jsonLit = await response.json();
              const blob = LitJsSdk.base64StringToBlob(jsonLit.litComment);
              const message = await lit.decryptString(
                blob,
                jsonLit.litKkey,
                publication.profile.ownedBy,
                currentProfile?.ownedBy
              );
              const decrypted = message.decryptedFile;
              return decrypted;
            } catch (err) {
              console.log(err);
            }
          } else {
            return comment.metadata.content;
          }
        })
      );
      return decryptedComments;
    }
  }

  return (
    <>
      <div className="overflow-y-auto">
        <div className=" h-screen flex-grow flex flex-col items-stretch gap-3 overflow-y-auto bg-[#F2F4F7] p-5">
          {txnQueue.map(
            (txn) =>
              txn?.type === "NEW_COMMENT" &&
              txn?.parent === publication?.id && (
                <div key={txn.id}>
                  <QueuedData txn={txn} />
                </div>
              )
          )}
          {comments?.map((comment) => (
            <>
              <CommentData comment={comment as Publication} />
            </>
          ))}
        </div>
      </div>
      {currentProfile ? (
        <CreateComment
          publication={publication as Publication}
          refetchComments={() => refetchComments()}
        />
      ) : (
        <LoginButton />
      )}
    </>
  );
};

export default Comments;
