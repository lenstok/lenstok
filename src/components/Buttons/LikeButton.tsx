import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import Like from '../Like';
import { Publication } from '@/types/lens';

//should also add authorisation so user cant like posttwice
interface Props {
  publication: Publication
}

const LikeButton: FC<Props> = ({publication}) => {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(publication.stats.totalUpvotes)

  useEffect(() => {
    if (publication?.reaction === 'UPVOTE') {
      setLiked(true)
    } else {
      setLiked(false)
    }
  }, [publication?.reaction])
  

  return (
    <div className="flex gap-6">
    <div className="mt-4 flex flex-col justify-center items-center cursor-pointer">
      <Like setCount={setCount} count={count} setLiked={setLiked} liked={liked} publication={publication as Publication} />
        <p className="text-xs font-semibold text-gray-400"> {count} </p>
      </div>
    </div>
  );
}

export default LikeButton; 