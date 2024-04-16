import { Outlet } from 'react-router-dom';

const SignUp = () => {

  return (
    <div className='h-auto min-h-screen w-screen flex flex-row items-center justify-center'>
      <div className=' hidden md:flex justify-center items-center h-screen w-full'>
        <img src="/images/signup.png" alt="signin" className='h-[75%] aspect-auto' />
      </div>
      <Outlet />
    </div>
  )
}

export default SignUp