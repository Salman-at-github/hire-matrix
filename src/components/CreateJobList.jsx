import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../config/firebase';

const CreateJobList = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const navigateTo = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigateTo('/login');
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  const handleCreateJobListing = async (e) => {
    e.preventDefault();
    try {
      // Ensure user is logged in
      if (!auth.currentUser) {
        console.error('User is not logged in.');
        return;
      }

      // Reference to the job listings collection in Firestore
      const jobListingsRef = collection(db, 'job-listings');

      // Add the job listing to Firestore
      const newJobListing = await addDoc(jobListingsRef, {
        title: jobTitle,
        description: description,
        requirements: requirements,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
      });

      // Clear the form fields
      setJobTitle('');
      setDescription('');
      setRequirements('');
      navigateTo("/")

      console.log('Job listing added successfully!');
    } catch (error) {
      console.error('Error creating job listing:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-800 via-indigo-800 to-purple-800">
      <div className="bg-green-200 p-8 rounded-md shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Create Job Listing</h2>
        <form onSubmit={handleCreateJobListing} className="flex flex-col items-center w-full">
          <label htmlFor="jobTitle" className="text-white mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-2 mb-4 rounded-md"
          />

          <label htmlFor="description" className="text-white mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-4 rounded-md"
          />

          <label htmlFor="requirements" className="text-white mb-2">
            Requirements
          </label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full p-2 mb-4 rounded-md"
          />

          <button type="submit" className="bg-blue-400 p-2 rounded-md text-white">
            Create Job Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJobList;
