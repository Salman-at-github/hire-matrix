import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login starts

    try {
      await toast.promise(
        signInWithEmailAndPassword(auth, email, password),
        {
          loading: 'Logging in...',
          success: () => {
            setLoading(false); // Set loading to false when login is successful
            return 'Logged in successfully!';
          },
          error: (error) => {
            setLoading(false); // Set loading to false on error
            const errorMessage = error.message;
            const lastPart = errorMessage.split(':').pop().trim();
            return lastPart;
          },
        }
      );
      
    } catch (error) {
      setLoading(false); // Set loading to false on error
    }
  };

  const googleLogin = async () => {
    setLoading(true); // Set loading to true when login starts
  
    try {
      await toast.promise(
        signInWithRedirect(auth, googleProvider)
          .then(() => {
            setLoading(false); // Set loading to false when login is successful
          }),
        {
          loading: 'Logging in with Google...',
          success: 'Logged in with Google successfully!',
          error: (error) => `Error logging in with Google: ${error.message}`,
        }
      );
      navigateTo('/');

    } catch (error) {
      setLoading(false); // Set loading to false on error
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950">
      <div className="bg-gradient-to-r from-blue-300 to-indigo-300 p-8 rounded-md shadow-md flex flex-col items-center w-full md:w-[23rem]">
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
            className="w-full p-2 mb-4 rounded-md border-[1.5px] border-black"
            autoComplete="true"
            placeholder='Email address'
            required
          />
          <label htmlFor="password" className="mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-10 rounded-md border-[1.5px] border-black"
            autoComplete="true"
            placeholder='Password'
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-800 font-bold p-2  rounded-md text-white hover:scale-105 w-full disabled:bg-gradient-to-r disabled:from-black disabled:to-gray-400 disabled:hover:scale-100 disabled:cursor-not-allowed"
            disabled={loading} // Disable the button when loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <button
  onClick={googleLogin}
  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-800 flex justify-center items-center font-bold p-2 rounded-md text-white gap-2 mt-3 hover:scale-105 w-full"
  disabled={loading} // Disable the button when loading
>
  <img src='google.svg' alt='Google' className="h-6" />
  <span>Login with Google</span>
</button>

        <button onClick={() => navigateTo('/signup')} className="mt-4">
          Don't have an account? <span className="text-blue-600">Sign up now</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
