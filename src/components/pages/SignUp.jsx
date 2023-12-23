import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigateTo = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up successfully!');
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const googleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing up with Google:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gradient-to-r from-blue-300 to-indigo-300 p-8 rounded-md shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSignUp} className="flex flex-col items-center w-full">
          <label htmlFor="email" className="mb-2">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 rounded-md"
          />
          <label htmlFor="password" className="mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 rounded-md"
          />
          <button type="submit" className="bg-gradient-to-r my-2 from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-800 font-bold p-2  rounded-md text-white hover:scale-105">
            Sign Up
          </button>
        </form>
        <button onClick={googleSignup} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-800 font-bold p-2  rounded-md text-white flex justify-center items-center gap-2 my-2 hover:scale-105">
          
            <FaGoogle className='text-black text-xl'/>Sign Up
        </button>
        <button onClick={() => navigateTo('/login')} className='mt-4'>
          Have an account? <span className="text-blue-600">Login Now</span>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
