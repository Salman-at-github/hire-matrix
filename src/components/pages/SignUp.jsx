import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when sign up starts

    try {
      await toast.promise(
        createUserWithEmailAndPassword(auth, email, password),
        {
          loading: 'Signing up...',
          success: () => {
            setLoading(false); // Set loading to false when sign up is successful
            return 'User signed up successfully!';
          },
          error: (error) => {
            setLoading(false); // Set loading to false on error
            return `Error signing up: ${error.message}`;
          },
        }
      );
    } catch (error) {
      setLoading(false); // Set loading to false on error
    }
  };

  const googleSignup = async () => {
    setLoading(true); // Set loading to true when sign up starts

    try {
      await toast.promise(
        signInWithPopup(auth, googleProvider),
        {
          loading: 'Signing up with Google...',
          success: () => {
            setLoading(false); // Set loading to false when sign up is successful
            return 'User signed up with Google successfully!';
          },
          error: (error) => {
            setLoading(false); // Set loading to false on error
            return `Error signing up with Google: ${error.message}`;
          },
        }
      );
    } catch (error) {
      setLoading(false); // Set loading to false on error
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
            autoComplete
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
            autoComplete
          />
          <button
            type="submit"
            className="bg-gradient-to-r my-2 from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-800 font-bold p-2  rounded-md text-white hover:scale-105"
            disabled={loading} // Disable the button when loading
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <button
          onClick={googleSignup}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-800 font-bold p-2  rounded-md text-white flex justify-center items-center gap-2 my-2 hover:scale-105"
          disabled={loading} // Disable the button when loading
        >
          <FaGoogle className="text-black text-xl" />Sign Up with Google
        </button>
        <button onClick={() => navigateTo('/login')} className="mt-4">
          Have an account? <span className="text-blue-600">Login Now</span>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
