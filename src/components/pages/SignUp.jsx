import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
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

  const extractLastErrorMessagePart = (error) => {
    const errorMessage = error.message;
    const lastPart = errorMessage.split(':').pop().trim();
    return lastPart;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await toast.promise(
        createUserWithEmailAndPassword(auth, email, password),
        {
          loading: 'Signing up...',
          success: () => {
            setLoading(false);
            return 'User signed up successfully!';
          },
          error: (error) => {
            setLoading(false);
            return `${extractLastErrorMessagePart(error)}`;
          },
        }
      );
    } catch (error) {
      setLoading(false);
    }
  };
  
  const googleSignup = async () => {
    setLoading(true);
  
    try {
      await toast.promise(
        signInWithPopup(auth, googleProvider),
        {
          loading: 'Signing up with Google...',
          success: () => {
            setLoading(false);
            return 'User signed up with Google successfully!';
          },
          error: (error) => {
            setLoading(false);
            return `${extractLastErrorMessagePart(error)}`;
          },
        }
      );
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gradient-to-r from-blue-300 to-indigo-300 p-8 rounded-md shadow-md flex flex-col items-center w-full md:w-[23rem]">
        <h2 className="text-2xl font-bold mb-10">Sign Up</h2>
        <form onSubmit={handleSignUp} className="flex flex-col items-center w-full">
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 rounded-md border-[1.5px] border-black"
            autoComplete="true"
            required
            placeholder='Email address'
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 rounded-md border-[1.5px] border-black"
            autoComplete="true"
            placeholder='Create Password'
            required
          />
          <input
            type="password"
            value={cpassword}
            onChange={(e) => setCPassword(e.target.value)}
            className="w-full p-2 mb-10 rounded-md border-[1.5px] border-black"
            autoComplete="true"
            placeholder='Confirm Password'
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r my-2 from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-800 font-bold p-2  rounded-md text-white hover:scale-105 disabled:bg-gradient-to-r disabled:from-black disabled:to-gray-400 disabled:hover:scale-100 disabled:cursor-not-allowed"
            disabled={loading || password.trim() !== cpassword.trim()} // Disable the button when loading
            
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <button
          onClick={googleSignup}
          className=" w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-800 font-bold p-2  rounded-md text-white flex justify-center items-center gap-2 my-2 hover:scale-105"
          disabled={loading} // Disable the button when loading
        >
          <img src='google.svg' alt='Google' className="h-6" /><span className=''>Sign Up with Google</span>
        </button>
        <button onClick={() => navigateTo('/login')} className="mt-4">
          Have an account? <span className="text-blue-600">Login Now</span>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
