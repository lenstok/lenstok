import Link from 'next/link'
import { IoMdAdd } from 'react-icons/io'
import { useAppStore } from "src/store/app";
import { toast } from "react-hot-toast";

const BottomNav: React.FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <div>
    <nav className="fixed bottom-0 left-0 right-0 h-[47px] rounded-t-md bg-emerald-700 z-10 flex items-center justify-around px-4 py-3 shadow-md">
    <button className="text-white hover:text-gray-100 focus:outline-none focus:text-gray-100 border-gray-800">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      </button>
      <button className="text-white hover:text-gray-100 focus:outline-none focus:text-gray-100 border-gray-800">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </button>

      {currentProfile ? (
      <Link href={`/profile/${currentProfile.id}`} key={currentProfile.id}>
      <button className="text-white hover:text-gray-100 focus:outline-none focus:text-gray-100 border-gray-800">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </button>
      </Link>
      ) : ( 
      <button 
      onClick= {() => {
        {toast.error("Log in to view profile");}
       }}
      className="text-white hover:text-gray-100 focus:outline-none focus:text-gray-100 border-gray-800">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    </button>
      )}

      <Link href='/upload'>
       <button 
       className="text-white hover:text-gray-100 focus:outline-none focus:text-gray-100 border-gray-800">
        <IoMdAdd className='text-xl h-8 w-10 border-2 border-white '/>{' '}
        </button>  
        </Link>
    </nav>
    </div>
  )
}

export default BottomNav

