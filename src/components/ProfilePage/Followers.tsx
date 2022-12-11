import getAvatar from '@/lib/getAvatar'
import { useFollowersQuery } from '@/types/graph'
import React, { FC } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import InfiniteLoader from '../UI/InfiniteLoader'
import Loader from '../UI/Loader'
import Image from 'next/image'
import { GoVerified } from 'react-icons/go'

interface Props {
    profileId: string
}

const Followers: FC<Props> = ({profileId}) => {

    const request = { profileId: profileId, limit: 10 }

    const { data, loading, error, fetchMore } = useFollowersQuery({
        variables: { request },
        skip: !profileId
    })

    const followers = data?.followers?.items
    const pageInfo = data?.followers?.pageInfo
    const hasMore = pageInfo?.next && followers?.length !== pageInfo.totalCount

    const loadMore = async () => {
        await fetchMore({
            variables: { request: { ...request, cursor: pageInfo?.next} }
        })
    }

    if (loading) {
        return <Loader message="Loading followers" />
    }

    if (followers?.length === 0) {
        return (
        <div className="p-5">
            No Followers
        </div>
        )
    }

  return (
    <div className="overflow-y-auto max-h-[80vh]" id="scrollableDiv">
        <InfiniteScroll
            dataLength={followers?.length ?? 0}
            scrollThreshold={0.5}
            hasMore={hasMore}
            next={loadMore}
            loader={<InfiniteLoader />}
            scrollableTarget="scrollableDiv"
        > 
            <div className="divide-y">
                {followers?.map((follow) => (
                    <div className="p-5" key={follow?.wallet?.defaultProfile?.id}>
                        {follow?.wallet?.defaultProfile ? (
                            <div className="flex gap-3 hover:bg-primary p-2 cursor-pointer font-semibold rounded items-center">
                                <div>
                                    <img
                                        width={40}
                                        height={40}
                                        className="rounded-full cursor-pointer"
                                        src={getAvatar(follow?.wallet?.defaultProfile)}
                                        alt={follow?.wallet?.defaultProfile?.handle}
                                    />
                                </div>
                                <div className="hidden lg:block">
                                    <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                                        {follow?.wallet?.defaultProfile?.handle}
                                        <GoVerified className="text-blue-400" />
                                        <p className="cpaitalize text-gray-400 text-xs">
                                            {follow?.wallet?.defaultProfile?.name} {""}
                                        </p>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            null
                        ) }
                        
                    </div>
                ))}
            </div>
        </InfiniteScroll>
    </div>
  )
}

export default Followers