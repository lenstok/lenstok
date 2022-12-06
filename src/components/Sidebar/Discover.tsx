import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { topics } from '../../utils/const';

const Discover = () => {
    const router = useRouter();
    const { topic } = router.query

    const activeTopicStyle = 'lg:border-2 bg-[#96de26] lg:border-[#a3f32b] px-3 py-2 rounded lg:rounded-full flex items-center gap-2 justify-center cursor-pointer text-[#25511f]';
    const topicStyle = "lg:border-2 hover:text-[#25511f] hover:bg-[#96de26] lg:border-gray-300 px-3 py-2 rounded lg:rounded-full flex items-center gap-2 justify-center cursor-pointer text-[#25511f]";

    return (
        <div className="xl:border-b-2 xl:border-gray-200 pb-6">
        <p className="text-gray-500 font-semibold m-3 mt-4 hidden lg:block">
            Popular Topics
        </p>
        <div className="flex gap-3 flex-wrap">
         {topics?.map((item) => (
          <Link href={`/?topic=${item.name}`} key={item.name}>
            <div className={topic === item.name ? activeTopicStyle : topicStyle}>
              <span className='font-bold text-2xl xl:text-md '>
                {item.icon}
              </span>
              <span className={`font-medium text-md hidden lg:block capitalize`}>
                {item.name}
              </span>
            </div>
          </Link>
            ))}
        </div>
        </div>
    )
}

export default Discover