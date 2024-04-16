import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import axiosClient from '../../axios/axiosClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OtpComponent = () => {

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpInitialState = ['', '', '', '', '', ''];
  const [otp, setOtp] = useState(otpInitialState);
  const [verifyPasswordLoading, setVerifyPasswordLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (index: number, value: string, nextInputIndex: string) => {
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  const resendHandler = async () => {
    try {
      const check = sessionStorage.getItem('check');
      const otpRes = await axiosClient.post('auth/otp/email', { email: check });
      const { verification_code } = otpRes.data.data;
      sessionStorage.setItem('verification_code', verification_code);
      setOtp(otpInitialState);
      inputRefs.current[0]?.focus();
      toast.success("OTP sent successfully");
    }
    catch (error: any) {
      //toast error message
      const errorMessage = error.response.data.message || "An error occurred";
      toast.error(errorMessage);
    }
  }

  const handleFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setVerifyPasswordLoading(prev => !prev);
    const completeOtp = otp.join('');
    const check = sessionStorage.getItem('check');
    const verificationCode = sessionStorage.getItem('verification_code');
    const reqBody = {
      verification_code: verificationCode,
      otp: completeOtp,
      check: check
    }

    try {
      const res = await axiosClient.post('auth/otp/verify', reqBody)
      const { otp_verified, name, token, email, user_id } = res.data.data;
      if (otp_verified) {
        toast.success("OTP verified successfully");
        navigate('/');
        localStorage.setItem('name', name);
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', user_id);
      }
      setVerifyPasswordLoading(prev => !prev);

    } catch (error: any) {
      const errorMessage = error.response.data.message || "An error occurred";
      toast.error(errorMessage);
      setVerifyPasswordLoading(prev => !prev);
      setOtp(otpInitialState);
      inputRefs.current[0]?.focus();
    }
  }


  // Ensure refs are updated when components mount
  useEffect(() => {
    //focusing on the 1st otp block
    inputRefs.current = inputRefs.current.slice(0, 6);
    inputRefs.current[0]?.focus();
  }, []);


  return (
    <div className='flex flex-col justify-center items-center h-screen w-full my-auto'>
      <div className='w-full h-max flex flex-col justify-center items-center'>
        <h3 className='font-bold mb-1 text-base md:text-2xl'>Verification Code</h3>
        <p className='px-3 md:px-0 text-sm md:text-base'>Please Enter Verification Code sent to your mobile</p>
      </div>

      <div className='w-full h-max mt-5'>
        <form action="" method="post" onSubmit={handleFormSubmit}>
          <div className="flex flex-col">
            <div className='flex align-center justify-center gap-4'>
              {
                [0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    className="h-12 w-12 rounded-lg outline-none ring-4 ring-[#3A244A] focus:ring-[#D72638] text-[#3A244A] text-center align-middle font-bold remove-numberInput-default"
                    type="number"
                    maxLength={1}
                    min={0}
                    max={9}
                    name={`otp_${index}`}
                    onInput={(evt: ChangeEvent<HTMLInputElement>) => handleInputChange(index, evt.target.value, `otp_${index + 1}`)}
                    autoFocus={index === 0}
                    value={otp[index]}
                    onChange={(evt) => setOtp([...otp.slice(0, index), evt.target.value, ...otp.slice(index + 1)])}
                  />
                ))
              }
            </div>
            <button type="submit" className="w-4/5 bg-[#D72638] text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-5 py-2.5 text-center mt-6 mx-auto">
              Verify Account
            </button>
          </div>
        </form>
      </div>


      <p className='mx-auto mt-3'>
        Didn&apos;t recieve code?
        <button className='text-blue-700 font-bold cursor-pointer ml-2 hover:text-[#D72638]' onClick={resendHandler}>Resend OTP</button>
      </p>


    </div>
  )
}

export default OtpComponent