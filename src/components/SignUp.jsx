import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-800 via-indigo-800 to-purple-800 text-white">
      <div className="bg-green-200 p-8 rounded-md shadow-md flex flex-col items-center">
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
          <button type="submit" className="bg-blue-400 p-2 rounded-md">
            Sign Up
          </button>
        </form>
        <button onClick={googleSignup} className="bg-blue-400 p-2 mt-4 flex items-center rounded-md">
          <FaGoogle className="mr-2" />
          Sign Up with Google
        </button>
        <button onClick={() => navigateTo('/login')} className="text-blue-400 mt-4">
          Already have an account? Login now
        </button>
      </div>
    </div>
  );
};

export default SignUp;
