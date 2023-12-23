import React, { useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const Application = ({ application, onClose }) => {

  const navigateTo = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigateTo('/login');
      }
    });
  
    return () => unsubscribe();
  }, [application]); // Use an empty dependency array
  

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 pb-4 w-96 text-black relative flex justify-center items-start flex-col font-light">
        <div className="absolute top-2 right-2">
          <FaTimesCircle
            className="cursor-pointer text-gray-500 hover:text-red-500"
            onClick={onClose}
          />
        </div>
        <p className="text-lg font-bold mb-4 w-full bg-cyan-200 py-4">{application.fullName}</p>
        <div className="mb-4">
          <p>Email: {application.email}</p>
        </div>
        <div className="mb-4">
          <p>Phone: {application.phone}</p>
        </div>
        <div className="mb-4">
          <p>Skills: {application.skills || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <p>Experience: {application.experience || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <p>City: {application.city}</p>
        </div>
        <div className="mb-4">
          <p>Country: {application.country}</p>
        </div>
        <div className="mb-4">
          <p>Status: {application?.status[0].toUpperCase()+application?.status.slice(1)}</p>
        </div>
        <div className="self-center text-sm mt-4 italic">
          <p>Submitted at: {application.submittedAt.toDate().toLocaleString()}</p>
        </div>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default Application;
