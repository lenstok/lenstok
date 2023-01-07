import { API_KEY } from '@/constants'
import { Player } from '@livepeer/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const LiveContent = () => {
    const [data, setData] = useState<any[]>()
    const [name, setName] = useState("")

  useEffect(() => {
    const response = {
      method: "get",
      url: "https://livepeer.studio/api/stream",
      params: {
        "streamsonly": 1
      },
      headers: {
        "authorization": `Bearer ${API_KEY}`
      }
    }

    axios(response)
      .then((result) => {
        setData(result?.data)
      })
      .catch((error) => {
        error = new Error()
      })
  }, [])
  
  console.log(data)

  return (
    <div>
        {data?.map(data => (
            <>
                {data?.isActive === true && (
                    <>
                        {data?.playbackId && (
                            <div className='p-5' key={data?.id}>
                                <Player 
                                  title={data?.name}
                                  playbackId={data?.playbackId}
                                  autoPlay
                                />
                                <div>
                                  {data?.name}
                                </div>
                                <div>
                                  {data?.playbackId}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </>
        ))}
    </div>
  )
}

export default LiveContent