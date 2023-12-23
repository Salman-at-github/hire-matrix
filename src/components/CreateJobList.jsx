import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../config/firebase';

const CreateJobList = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [organization, setOrganization] = useState('');
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
      await addDoc(jobListingsRef, {
        title: jobTitle,
        organization: organization,
        description: description,
        requirements: requirements,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
      });

      // Clear the form fields
      setJobTitle('');
      setOrganization('')
      setDescription('');
      setRequirements('');
      navigateTo("/")

      console.log('Job listing added successfully!');
    } catch (error) {
      console.error('Error creating job listing:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gradient-to-r from-blue-300 to-indigo-300 p-8 rounded-md shadow-md flex flex-col items-center w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4 ">Create Job Post</h2>
        <form onSubmit={handleCreateJobListing} className="flex flex-col items-center w-full">
          <label htmlFor="jobTitle" className=" mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-2 mb-4 rounded-md"
          />

          <label htmlFor="jobTitle" className=" mb-2">
            Organization
          </label>
          <input
            type="text"
            id="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full p-2 mb-4 rounded-md"
          />

          <label htmlFor="description" className=" mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-4 rounded-md"
          />

          <label htmlFor="requirements" className=" mb-2">
            Requirements
          </label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full p-2 mb-4 rounded-md"
          />

          <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-800 font-bold p-2  rounded-md text-white hover:scale-105">
            Create Job Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJobList;
