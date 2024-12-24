import React from 'react';
import useUserStore from '@/stores/UserStore';
import useStudentStore from '@/stores/StudentStore';
import { Bell, CircleHelp, MessageSquareMore, Search, Settings2 } from 'lucide-react';
import Image from 'next/image';

type Props = {}

function TopBar({}: Props) {
  const {user} = useUserStore();
  const {searchOnStudents} = useStudentStore();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = e.target.value;
    searchOnStudents(searchString); // Call the search function with the input value
  };

  return (
    <div className='w-full rounded-lg flex flex-row justify-between items-center text-gray-800'>
      <div className='bg-white flex flex-row items-center w-1/2 px-2 rounded-lg'>
        <Search size={22}/>
        <input 
          className='w-full p-2 border-0'
          type="text" 
          placeholder='Search your students'
          onChange={handleSearch}
        />
      </div>
      <div className='h-full p-2 rounded-md hover:bg-gray-300 cursor-pointer'>
        <CircleHelp size={22}/>
      </div>
      <div className='h-full p-2 rounded-md hover:bg-gray-300 cursor-pointer'>
        <MessageSquareMore size={22}/>
      </div>
      <div className='h-full p-2 rounded-md hover:bg-gray-300 cursor-pointer'>
        <Settings2 size={22}/>
      </div>
      <div className='h-full p-2 rounded-md hover:bg-gray-300 cursor-pointer'>
        <Bell size={22}/>
      </div>
      <div className='flex flex-row justify-between items-center gap-2'>
        <div>
          <Image
            width={35}
            height={35}
            src={user && user.avatar ? user.avatar : "https://via.placeholder.com/150"}
            alt="Profile picture"
            className='rounded-lg'
          />
        </div>
        <div>
          <p className='text-lg font-semibold pr-2'>{user?.firstName + " " + user?.lastName}</p>
        </div>
      </div>
    </div>
  )
}

export default TopBar;