import { useAppStore } from '@/store/app';
import { Player, useCreateStream } from '@livepeer/react';
import React, { useMemo } from 'react'

const CreateStream = () => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const streamName = currentProfile?.handle

    const {
        mutate: createStream,
        data: stream,
        status,
      } = useCreateStream(streamName ? { name: streamName } : null)
    
      const isLoading = useMemo(() => status === 'loading', [status])
    
      console.log(stream)
  return (
    <div className='flex flex-col justify-items-center m-auto text-center p-3 w-[600px]'>
      {stream?.playbackId && (
        <>
        <p className='mb-5'>
          For the stream to work please input the following keys in OBS Studio:
          <ul>
            <li><b>RTMP Ingest Url:</b> rtmp://rtmp.livepeer.com/live</li>
            <li><b>Stream Key:</b> {stream?.streamKey}</li>
          </ul>
          Don't have OBS? <a href="https://obsproject.com/">Download here.</a>
        </p>
        
        <Player
          title={stream?.name}
          playbackId={stream?.playbackId}
          autoPlay
          muted 
        />
        </>
      )}

      {!stream && (
        <>
          <button
            onClick={() => {
              createStream?.()
            } }
          >
            Create Stream
          </button>
        </>
      )}
    </div>
  )
}

export default CreateStream