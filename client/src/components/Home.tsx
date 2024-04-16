import React, { useState } from 'react'
import { FaHandHolding } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axiosClient from '../axios/axiosClient';
import { toast } from 'react-toastify';

const Home = () => {
    const [getPersonalDataClicked, setPersonalDataClicked] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const handleGetPersonalData = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axiosClient.get('/protectedApi/protectedapi', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const name = response.data.data.name;
            setName(name);
            setPersonalDataClicked(true);
        } catch (error: any) {
            const message = error.response.data.message || 'An Error Occured';
            toast.error(message);
        }
    }


    const handleLogout = () => {
        localStorage.clear();
        setPersonalDataClicked(false);
        toast.success('Logged out successfully');
    }


    return (
        <div className='h-screen w-screen '>
            <h1 className='text-center text-5xl text-[#D72638] font-bold'>Home Page </h1>
            <div className='flex flex-row justify-center gap-5 mt-10'>
                <Link to={"/signup"} className='text-lg font-semibold px-4 py-2 text-[#3A244A] border border-[#D72638] rounded-xl hover:bg-[#D72638] hover:text-white'>Sign Up</Link>
                <Link to={"/signin"} className='text-lg font-semibold px-4 py-2 text-[#3A244A] border border-[#D72638] rounded-xl hover:bg-[#D72638] hover:text-white'>Sign In</Link>
                <button onClick={handleLogout} className='text-lg font-semibold px-4 py-2 text-[#3A244A] border border-[#D72638] rounded-xl hover:bg-[#D72638] hover:text-white'>LogOut</button>
            </div>
            <div className='flex flex-col items-center justify-center gap-5 mt-10'>
                <button onClick={handleGetPersonalData} className='w-fit  text-lg font-semibold px-4 py-2 text-[#3A244A] border border-[#D72638] rounded-xl hover:bg-[#D72638] hover:text-white '>
                    GET PERSONAL DATA
                </button>
                {
                    getPersonalDataClicked && 
                    <p>
                        <span className='font-semibold text-[#3A244A] text-xl'>Name:-</span> &nbsp;
                        <span className='font-semibold text-[#D72638] text-xl'>{name}</span>
                    </p>
                }
            </div>
        </div>
    )
}

export default Home