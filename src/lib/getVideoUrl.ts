import { Publication } from "@/types/lens"
import { sanitizeIpfsUrl } from "@/utils/sanitizeIpfsUrl"

export const getVideoUrl = (publication: any) => {
    const url =
      publication?.metadata?.media[1]?.original.url ||
      publication?.metadata?.media[0]?.original.url
    return sanitizeIpfsUrl(url)
  }
  
  export const getPermanentVideoUrl = (publication: any) => {
    return sanitizeIpfsUrl(publication?.metadata?.media[0]?.original.url)
  }
  
  export const getPlaybackIdFromUrl = (publication: any) => {
    const url = publication?.metadata?.media[1]?.original.url
    if (!url) return null
    const pathname = new URL(url).pathname
    const playbackId = pathname.split('/')[2]
    return playbackId
  }
  
  export const getIsIPFSUrl = (url: string) => {
    return url?.includes('ipfs')
  }