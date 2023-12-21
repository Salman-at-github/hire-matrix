import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';

const Application = ({ application, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md w-96">
        <div className="flex justify-end">
          <FaTimesCircle
            className="cursor-pointer text-gray-500 hover:text-red-500"
            onClick={onClose}
          />
        </div>
        <p className="text-lg font-bold mb-2">{application.fullName}</p>
        <div className="mb-2">
          <p>Email: {application.email}</p>
          <p>Phone: {application.phone}</p>
        </div>
        <div className="mb-2">
          <p>Skills: {application.skills || 'N/A'}</p>
          <p>Experience: {application.experience || 'N/A'}</p>
        </div>
        <div className="mb-2">
          <p>Location: {application.city}, {application.country}</p>
        </div>
        <div className="mb-2">
          <p>Status: {application.status}</p>
          <p>Submitted At: {application.submittedAt.toDate().toLocaleString()}</p>
        </div>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default Application;
