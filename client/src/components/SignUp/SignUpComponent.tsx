import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosClient from '../../axios/axiosClient';
import { toast } from 'react-toastify';


const SignUpComponent = () => {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showRetypePassword, setShowRetypePassword] = useState<boolean>(false);
    const [ signUpLoading, setSignUpLoading ] = useState<boolean>(false);

    const handleSignUp = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        setSignUpLoading( prev => !prev)
        const formData = {
            first_name: (event.target as HTMLFormElement).first_name.value,
            last_name: (event.target as HTMLFormElement).last_name.value,
            email: (event.target as HTMLFormElement).email.value,
            password: (event.target as HTMLFormElement).password.value,
            confirm_password: (event.target as HTMLFormElement).retype_password.value,
            phone: (event.target as HTMLFormElement).phone.value
        }

        try {
            const response = await axiosClient.post('/auth/register', formData);
            const email = response.data.data.email;
            sessionStorage.setItem('email',email);
            const otpResponse = await axiosClient.post('/auth/otp/email', {email: email});
            const { check, verification_code }  = otpResponse.data.data;
            sessionStorage.setItem('check', check);
            sessionStorage.setItem('verification_code', verification_code);
            setSignUpLoading( prev => !prev);
            navigate('/signup/otp');
            toast.success('OTP sent successfully');
        } catch (error: any) {
            const message = error.response.data.message || 'An Error Occured';
            setSignUpLoading( prev => !prev);
            toast.error(message);
        }

    }


    return (
        <div className='flex justify-center items-center h-full w-full md:my-10'>
            <form className='flex flex-col border-2 border-gray-400/20 rounded-3xl p-6 sm:p-12 shadow-xl w-full sm:w-auto m-2' onSubmit={handleSignUp}>
                <div className='flex flex-row justify-between items-end gap-16 '>
                    <h3 className='font-bold text-3xl sm:text-5xl'>Let us know<span className='text-[#D72638]'>!</span></h3>
                    <h3 className='font-bold text-xl cursor-pointer' onClick={() => navigate('/signin')}>Sign <span className='text-[#D72638]'>In</span></h3>
                </div>
                <div className='flex flex-col gap-10 mt-16 mb-10'>
                    {/* first name */}
                    <input type="text" name="first_name" placeholder='First Name' className='focus:outline-none bg-transparent leading-loose text-xl font-semibold border-b-2 border-gray-400/50' required />
                    {/* last name */}
                    <input type="text" name="last_name" placeholder='Last Name' className='focus:outline-none bg-transparent leading-loose text-xl font-semibold border-b-2 border-gray-400/50' required />
                    {/* password */}
                    <div className='flex flex-row items-center justify-between border-b-2 border-gray-400/50'>
                        <input type={showPassword ? 'text' : 'password'} name="password" placeholder='Set Password' className='focus:outline-none bg-transparent leading-loose text-xl font-semibold w-full pr-5' required autoComplete='off' />
                        {
                            showPassword
                                ?
                                <FaEye className='cursor-pointer text-[#D72638] text-3xl mr-2' onClick={() => setShowPassword(item => !item)} />
                                :
                                <FaEyeSlash className='cursor-pointer text-[#D72638] text-3xl mr-2' onClick={() => setShowPassword(item => !item)} />
                        }
                    </div>
                    {/* retype password */}
                    <div className='flex flex-row items-center justify-between border-b-2 border-gray-400/50'>
                        <input type={showRetypePassword ? 'text' : 'password'} name="retype_password" placeholder='Retype Password' className='focus:outline-none bg-transparent leading-loose text-xl font-semibold w-full pr-5' required autoComplete='off' />
                        {
                            showRetypePassword
                                ?
                                <FaEye className='cursor-pointer text-[#D72638] text-3xl mr-2' onClick={() => setShowRetypePassword(item => !item)} />
                                :
                                <FaEyeSlash className='cursor-pointer text-[#D72638] text-3xl mr-2' onClick={() => setShowRetypePassword(item => !item)} />
                        }
                    </div>
                    {/* Phone */}
                    <input type="tel" name="phone" placeholder='Phone Number' pattern="[0-9]{10}" className='focus:outline-none bg-transparent leading-loose text-xl font-semibold border-b-2 border-gray-400/50' title="Please enter correct phone number" required />
                    {/* email */}
                    <input type="email" name="email" placeholder='Email' className='focus:outline-none bg-transparent leading-loose text-xl font-semibold border-b-2 border-gray-400/50' required />
                </div>
                <div className='flex flex-col gap-5 '>
                    <button type="submit" className='w-full py-5 bg-[#3A244A] rounded-2xl text-white text-xl sm:text-2xl font-semibold'>
                        {
                            signUpLoading 
                            ?
                            <span className="loading loading-spinner loading-lg"></span>
                            :
                            <p>Sign Up</p>
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SignUpComponent