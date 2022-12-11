import { HLSData } from "@/types/app"
import { Hls, Player, Video } from "@vime/react"
import { FC, Ref, useRef } from "react"
import clsx from 'clsx'

interface Props {
    source: string
    wrapperClassName?: string
    ratio?: string
    isSensitiveContent?: boolean
    hls?: HLSData
    className: string
  }
  
  interface PlayerProps {
    source: string
    ratio?: string
    hls?: HLSData
  }
  
  const PlayerInstance = ({ source, ratio, hls }: PlayerProps) => {
    const playerRef = useRef<HTMLVmPlayerElement>()
  
    return (
      <div>
        <div className="relative z-[5]">
          <Player
            tabIndex={1}
            ref={playerRef as Ref<HTMLVmPlayerElement>}
            aspectRatio={ratio}
            controls
            autoplay
            muted
          >
            {hls?.url ? (
              <Hls version="latest">
                <source data-src={hls.url} type={hls.type} />
              </Hls>
            ) : (
              <Video
                preload="metadata"
                crossOrigin="anonymous"
                autoPiP
              >
                <source data-src={source} />
              </Video>
            )}
          </Player>
        </div>
      </div>
    )
  }
  
  const VideoPlayer: FC<Props> = ({
    source,
    ratio = '9:16',
    wrapperClassName,
    hls
  }) => {
  
    return (
      <div className={clsx('overflow-hidden md:rounded-xl', wrapperClassName)}>
          <PlayerInstance
            source={source}
            ratio={ratio}
            hls={hls}
          />
      </div>
    )
  }
  
  export default VideoPlayer