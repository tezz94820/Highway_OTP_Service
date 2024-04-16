import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import NotFound from './components/NotFound';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { ToastContainer,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import SignUpComponent from './components/SignUp/SignUpComponent';
import OtpComponent from './components/SignUp/OtpComponent';

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={false}
        closeOnClick
        pauseOnHover
        transition={Slide}
        theme='colored'
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />}>
          <Route path="" index element={<SignUpComponent />} />
          <Route path="otp" element={<OtpComponent />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
