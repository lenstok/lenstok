import Link from 'next/link'
import { IoMdAdd } from 'react-icons/io'

const BottomNav: React.FC = () => {
  return (
    <div>
    <nav className="fixed bottom-0 left-0 right-0 rounded-md bg-emerald-700 z-10 flex items-center justify-around px-4 py-3 shadow-md">
    <button className="text-white hover:text-gray-100 focus:outline-none focus:text-gray-100 border-gray-800">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      </button>
      <button className="text-white hover:text-gray-100 focus:outline-none focus:text-gray-100 border-gray-800">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
      </button>
      <button className="text-white hover:text-gray-100 focus:outline-none focus:text-gray-100 border-gray-800">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </button>
    </nav>
  
    </div>
  )
}

export default BottomNav