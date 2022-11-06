import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from "src/store/app";

import { GoVerified } from 'react-icons/go';

import NoResults from './NoResults';

const Comments = () => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const comments = [];
    const isPostingComment = false;

    return (
      <div className="border-t-2 border-gray-200 pt-4 px-10 mt-4 bg-[#F8F8F8] border-b-2 lg:pb-0 pb-[100px]">
        <div className="overflow-scroll lg:h-[475px]">
             {comments.length ? (
                <div>videos</div>
             ) : (
                <NoResults text='No Comments Yet! Be the first...' />
             )}
        </div>
        {!currentProfile && (
            <div className="absolute bottom-0 left-0 pb-6 px-2 md:px-10">
                <form onSubmit={() => {}} className="flex gap-4">
                    <input
                    type="text"
                    // value={}
                    onChange={() => {}}
                    className='bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg'
                    placeholder='Add comment..'
                    />
                    <button className="text-md text-gray-400 border-gray-100" onClick={() => {}}>
                        {isPostingComment ? 'Commenting...' 
                        :
                        'Comment'}
                    </button>
                </form>
            </div>
        )}
      </div>
    ) 
}

export default Comments;

