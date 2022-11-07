import Navbar from '@/components/UI/Navbar';
import ProfilePage from '@/components/UI/ProfilePage';
import Sidebar from '@/components/UI/Sidebar';
import { ProfileDocument } from '@/types/lens';
import type { Profile } from '@/types/lens'
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, {useEffect} from 'react'

const Id = () => {
    const router = useRouter()
    const { id } = router.query
    
    useEffect(() => {
      if (id) {
        console.log("Profile", profile)
      }
    }, [id])

    const { data, loading, error } = useQuery(ProfileDocument, {
      variables: {
        request: {
          profileId: id
        }
      }
    });
    if (loading) return 'Loading..';
    if (error) return `Error! ${error.message}`;
      
    const profile = data?.profile
    return (
        <div>
          <div className="xl:w-[1200px] m-auto overflow-hidden h-[100vh]">
            <Navbar />
            <div className="flex gap-6 md:gap-20 ">
              <div className="h-[92vh] overflow-hidden xl:hover:overflow-auto">
                <Sidebar />
              </div>
              <div className="mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1">
                <ProfilePage key={profile?.id} profile={profile as Profile} />
              </div>
            </div>
          </div>
        </div>
      );
}

export default Id