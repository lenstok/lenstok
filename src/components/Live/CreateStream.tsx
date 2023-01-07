import { API_KEY } from '@/constants';
import { useAppStore } from '@/store/app';
import { Player, useCreateStream } from '@livepeer/react';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react'

const CreateStream = () => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [streamTerminated, setstreamTerminated] = useState(false)
    const streamName = currentProfile?.handle

    const {
      mutate: createStream,
      data: stream,
      status,
    } = useCreateStream(streamName ? { name: streamName } : null)

    console.log(stream)


    const terminateStream = () => {
      const response = {
        method: "delete",
        url: `https://livepeer.studio/api/stream/${stream?.id}`,
        headers: {
          "authorization": `Bearer ${API_KEY}`
        }
      }
  
      axios(response)
        .then((result) => {
          console.log("Stream terminated")
          setstreamTerminated(true)
        })
        .catch((error) => {
          error = new Error()
        })
    }

  return (
    <div className='flex flex-col justify-items-center m-auto text-center p-3 w-[600px]'>
      {!streamTerminated ? (
        <>
        {stream?.playbackId && (
          <>
          <div className='mb-5'>
            For the stream to work please input the following keys in OBS Studio:
            <ul>
              <li><b>RTMP Ingest Url:</b> rtmp://rtmp.livepeer.com/live</li>
              <li><b>Stream Key:</b> {stream?.streamKey}</li>
            </ul>
            Don&apos;t have OBS? <a href="https://obsproject.com/">Download here.</a>
          </div>
          
          <Player
            title={stream?.name}
            playbackId={stream?.playbackId}
            autoPlay
            muted 
          />

          <button 
            className='active:bg-violet-600 py-1 px-3 drop-shadow-xl rounded text-sm mt-2 border hover:text-[#25511f] hover:bg-[#96de26] transition cursor-pointer bg-[#96de26] text-[#25511f] font-semibold' 
            onClick={() => terminateStream()}
          >
            Terminate Stream
          </button>
          </>
        )}

        {!stream && (
          <>
            <button
              className='active:bg-violet-600 py-1 px-3 drop-shadow-xl rounded text-sm mt-2 border hover:text-[#25511f] hover:bg-[#96de26] transition cursor-pointer bg-[#96de26] text-[#25511f] font-semibold'
              onClick={() => {
                createStream?.()
              } }
            >
              Create Stream
            </button>
          </>
        )}
      </>
      ) : (
        <>
          <div>Stream Terminated Sussesfully</div>
          <Link href="/">Home</Link>
        </>
      )}
    </div>
  )
}

export default CreateStream