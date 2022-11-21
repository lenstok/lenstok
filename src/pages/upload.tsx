import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { topics } from '../utils/const'

const Upload = () => {
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [videoAsset, setVideoAsset] = useState();
    const [wrongFileType, setWrongFileType] = useState(false);

    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState(topics[0].name); //this is a placeholder for now

    const uploadVideo = async (e: any) => {
        const selectedFile = e.target.files[0];
        const fileTypes = ['video/mp4', 'video/webm', 'video/ogg'];

        //LOGIC TO UPLOAD VIDEO TO STORAGE HERE?
        if (fileTypes.includes(selectedFile.type)) {
            setIsLoading(true);
            setWrongFileType(false);
            
        } else {
          setIsLoading(false);
          setWrongFileType(true);
    }
}

    //LOGIC TO POST VIDEO
    const handlePost = async () => {

    }
 
    return (
        <div className='flex w-full h-full absolute left-0 top-[60px] mb-10 pt-10 lg:pt-20 bg-[#f8f8f8] justify-center'>
            <div className='bg-white rounded-lg xl:h-[80vh] w-[60%] flex gap-6 flex-wrap justify-between items-center p-14 pt-6'>
                <div>
                    <div>
                     <p className='text-2xl font-bold'>Upload Video</p>
                     <p className='text-md text-gray-400 mt-1'>Post a video to your account</p>
                    </div>
                    <div className='border-dashed rounced-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100'>
                        {isLoading ? (
                            <p>Uploading....</p>
                        ) : (
                            <div>
                              {videoAsset ? (
                                <div>
                                     <video
                                     src={'/'}
                                     loop
                                     controls
                                     className='rounded-xl h-[450px] mt-16 bg-black'
                                     >
                                     </video>
                                </div>
                              ) : (
                                <label className='cursor-pointer'>
                                    <div className='flex flex-col items-center justify-center h-full'>
                                      <div className='flex flex-col justify-center items-center'>
                                        <p className='font-bold text-xl'>
                                          <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                                        </p>
                                        <p className='text-xl font-semibold'>
                                            Upload Video
                                        </p>
                                      </div>

                                      <p className='text-gray-400 text-center mt-10 text-sm leading-10'>
                                        MP4 or WebM or ogg <br/>
                                        720x1280 resolution or higher <br />
                                        Make it short <br />
                                        Less than 2 GB
                                      </p>
                                      <p className='bg-[#96de26] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none'>
                                        Select File
                                      </p>
                                    </div>
                                     <input 
                                     type='file' accept='video/mp4,video/x-m4v,video/*'
                                     name='upload-video'
                                     className='w-0 h-0'
                                     onChange={uploadVideo}
                                     >
                                     </input>
                                </label>
                              )}
                            </div>
                        )}
                        {wrongFileType && (
                            <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[250px]'
                            >Please select a video file</p>
                        )}
                    </div>
                </div>

                <div className='flex flex-col gap-3 pb-10'>
                        <label className='text-md font-medium'>Caption</label>
                        <input
                        type='text'
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className='rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2'
                        ></input>

                        <label className='text-md font-medium'>Choose a Category</label>
                        <select
                        onChange={(e) => setCategory(e.target.value)}
                        className='outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer'
                        >
                          {topics.map((topic) => (
                            <option
                            key={topic.name}
                            className='outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'
                            value={topic.name}
                            >
                              {topic.name}
                            </option>
                           ))};
                        </select>
                        <div className='flex gap-6 mt-10'>
                            <button
                                onClick={() => {}}
                                type='button'
                                className='border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
                            > Discard
                            </button>
                            <button
                            onClick={handlePost}
                            type='button'
                            className='bg-emerald-700 text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
                            > POST!
                            </button>
                        </div>
                    </div>

            </div>
        </div>
    )
}

export default Upload 