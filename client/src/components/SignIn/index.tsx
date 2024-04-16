import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosClient from '../../axios/axiosClient';
import { toast } from 'react-toastify';

const SignIn = () => {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (event: FormEvent):Promise<void> => {
    event.preventDefault();
  
    const formData = {
      email: (event.target as HTMLFormElement).email.value,
      password: (event.target as HTMLFormElement).password.value,
    } 

    try {
      const response = await axiosClient.post('/auth/login', formData);
      const { user_id, name, token, email} = response.data.data;
      localStorage.setItem('name', name);
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('email', email);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error:any) {
      const message = error.response.data.message || 'An Error Occured';
      toast.error(message);
    }
  }
  return (
    <div className='h-screen w-screen flex flex-row '>
      <div className=' hidden md:flex justify-center items-center h-full w-full'>
        <img src="/images/signin.png" alt="signin" className='h-[75%] aspect-auto' />
      </div>
      <div className='flex justify-center items-center h-full w-full m-2 sm:m-0'>
        <form className='flex flex-col border-2 border-gray-400/20 rounded-3xl p-6 sm:p-12  shadow-xl' onSubmit={handleSignIn}>
          <h3 className='font-bold text-3xl sm:text-5xl'>Fill what we know<span className='text-[#D72638]'>!</span></h3>
          <div className='flex flex-col gap-10 mt-16 mb-10'>
            <input type="email" name="email" placeholder='Email' className='focus:outline-none bg-transparent leading-loose text-xl font-semibold border-b-2 border-gray-400/50' required/>
            <div className='flex flex-row items-center justify-between border-b-2 border-gray-400/50'>
              <input type="password" name="password" placeholder='Password' className='focus:outline-none bg-transparent leading-loose text-xl font-semibold w-full pr-5' required/>
                {
                  showPassword 
                  ?
                  <FaEye className='cursor-pointer text-[#D72638] text-3xl mr-2' onClick={() => setShowPassword( item => !item)}/>
                  :
                  <FaEyeSlash className='cursor-pointer text-[#D72638] text-3xl mr-2' onClick={() => setShowPassword( item => !item)}/>
                }
            </div>
          </div>
          <div className='flex flex-col gap-5 mt-5'>
            <button type="submit" className='w-full py-5 bg-[#3A244A] rounded-2xl text-white text-xl sm:text-2xl font-semibold'>Sign In</button>
            <button type='button' className='w-full py-5 border border-[#3A244A] rounded-2xl text-[#3A244A] text-xl sm:text-2xl font-semibold' onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn