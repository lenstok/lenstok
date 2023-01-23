import { API_KEY } from '@/constants'
import { Player } from '@livepeer/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const LiveContent = () => {
    const [data, setData] = useState<any[]>()
    const [name, setName] = useState("")

  useEffect(() => {
    const headers = {
      'authorization': `Bearer ${API_KEY}`
    };
    
    axios({
        method: 'get',
        url: 'https://livepeer.studio/api/stream',
        headers: headers,
        params: {
            streamsonly: 1,
            filters: JSON.stringify([{
                id: 'isActive', 
                value: true
            }])
        }
    }).then(response => {
        setData(response.data);
    }).catch(error => {
        console.log(error);
    });
  }, [])
  
  console.log(data)

  return (
    <div>
      {data?.length === 0 && (
        <div className="bg-black h-[500px] flex justify-center items-center m-4">
        <p className="text-white font-semibold text-xl">No active livestreams happening right now</p>
      </div>
      )}
        {data?.map(data => (
                <>
                  {data?.playbackId && (
                    <div className='p-5' key={data?.id}>
                      <Player 
                        title={data?.name}
                        playbackId={data?.playbackId}
                        autoPlay
                      />
                    </div>
                  )}
                </>
        ))}
    </div>
  )
}

export default LiveContent