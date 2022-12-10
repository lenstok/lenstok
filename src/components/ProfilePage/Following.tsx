import getAvatar from "@/lib/getAvatar"
import { useFollowingQuery } from "@/types/graph"
import { Profile } from "@/types/lens"
import { FC } from "react"
import { GoVerified } from "react-icons/go"
import InfiniteScroll from "react-infinite-scroll-component"
import InfiniteLoader from "../UI/InfiniteLoader"
import Loader from "../UI/Loader"

interface Props {
    profile: Profile
}

const Following: FC<Props> = ({profile}) => {

    const request = { address: profile?.ownedBy, limit: 10 }

    const { data, loading, error, fetchMore } = useFollowingQuery({
        variables: { request },
        skip: !profile?.id
    })

    const following = data?.following?.items
    const pageInfo = data?.following?.pageInfo
    const hasMore = pageInfo?.next && following?.length !== pageInfo.totalCount

    const loadMore = async () => {
        await fetchMore({
            variables: { request: { ...request, cursor: pageInfo?.next} }
        })
    }

    if (loading) {
        return <Loader message="Loading Following" />
    }

    if (following?.length === 0) {
        return (
        <div className="p-5">
            No Following
        </div>
        )
    }

  return (
    <div className="overflow-y-auto max-h-[80vh]" id="scrollableDiv">
        <InfiniteScroll
            dataLength={following?.length ?? 0}
            scrollThreshold={0.5}
            hasMore={hasMore}
            next={loadMore}
            loader={<InfiniteLoader />}
            scrollableTarget="scrollableDiv"
        > 
            <div className="divide-y">
                {following?.map((follow) => (
                    <div className="p-5" key={follow?.profile?.id}>
                        <div className="flex gap-3 hover:bg-primary p-2 cursor-pointer font-semibold rounded items-center">
                            <div>
                                <img
                                    width={40}
                                    height={40}
                                    className="rounded-full cursor-pointer"
                                    src={getAvatar(follow?.profile)}
                                    alt={follow?.profile?.handle}
                                />
                            </div>
                            <div className="hidden lg:block">
                                <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                                    {follow?.profile?.handle}
                                    <GoVerified className="text-blue-400" />
                                    <p className="cpaitalize text-gray-400 text-xs">
                                        {follow?.profile?.name} {""}
                                    </p>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </InfiniteScroll>
    </div>
  )
}

export default Following