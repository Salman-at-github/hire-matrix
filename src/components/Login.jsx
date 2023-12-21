import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigateTo = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigateTo('/');
      } 
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully!');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950">
      <div className="bg-green-200 p-8 rounded-md shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
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
            Login
          </button>
        </form>
        <button onClick={googleLogin} className="bg-blue-400 p-2 mt-4 flex items-center rounded-md">
          <FaGoogle className="mr-2" />
          Login with Google
        </button>
        <button onClick={() => navigateTo('/signup')} className="text-blue-400 mt-4">
          Don't have an account? Sign up now
        </button>
      </div>
    </div>
  );
};

export default Login;
