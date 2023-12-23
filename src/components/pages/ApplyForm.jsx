import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, where, query, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaPhone, FaLaptop, FaCity, FaGlobe, FaCheck } from 'react-icons/fa';

const ApplyForm = () => {
  const { id } = useParams();

  const [jobDetails, setJobDetails] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    city: '',
    country: '',
    job: id, // Automatically set the job field with the job ID from params
    status: 'new',
    submittedAt: null, // Will be set to server timestamp upon submission
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    let unsubscribe; // Declare a variable to hold the unsubscribe function

    const fetchJobDetails = async () => {
      try {
        const jobDocRef = doc(db, 'job-listings', id);
        const jobSnapshot = await getDoc(jobDocRef);

        if (jobSnapshot.exists()) {
          const jobData = { id: jobSnapshot.id, ...jobSnapshot.data() };
          setJobDetails(jobData);

          // Subscribe to snapshot changes (listener)
          unsubscribe = onSnapshot(jobDocRef, (doc) => {
            const updatedJobData = { id: doc.id, ...doc.data() };
            setJobDetails(updatedJobData);
          });
        } else {
          console.log('Job not found');
        }
      } catch (error) {
        console.error('Error fetching job details:', error.message);
      }
    };

    fetchJobDetails();

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Reference to the job applications collection
      const jobApplicationsRef = collection(db, 'job-applications');
  
      // Check if the same email exists for the given job
      const existingApplicationQuery = query(
        jobApplicationsRef,
        where('email', '==', formData.email),
        where('job', '==', id)
      );
  
      const existingApplicationsSnapshot = await getDocs(existingApplicationQuery);
  
      if (!existingApplicationsSnapshot.empty) {
        // If an application with the same email for the same job already exists, throw an error
        throw new Error('You have already applied for this job.');
      }
  
      // If no existing application found, proceed with adding a new document for the application
      const newApplicationRef = await addDoc(jobApplicationsRef, {
        ...formData,
        submittedAt: serverTimestamp(), // Set submittedAt to server timestamp
      });
  
      // Update the job document to include the new application
      const jobDocRef = doc(db, 'job-listings', id);
      await updateDoc(jobDocRef, {
        applications: newApplicationRef.id,
      });
  
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error.message);
      // Handle the error, e.g., display an error message to the user
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-blue-800 to-purple-800 flex justify-center items-center flex-col text-white">
      <h2 className="text-4xl font-bold mb-8">Apply for {jobDetails?.title}</h2>

      {formSubmitted ? (
        <div className="mb-4 w-full flex justify-center items-center flex-col">
          <FaCheck className="text-6xl text-green-400 mb-4" />
          <p className="text-xl">Your application has been submitted successfully!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center flex-col border-white rounded-md border min-h-96 w-full md:w-1/2 p-5 "
        >

          <div className="mb-4 w-full relative">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded-md pl-8 bg-slate-900"
              placeholder="Full Name"
            />
            <FaUser className="absolute left-2 top-2 text-gray-500" />
          </div>

          <div className="mb-4 w-full relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded-md pl-8 bg-slate-900"
              placeholder="Email"
            />
            <FaEnvelope className="absolute left-2 top-2 text-gray-500" />
          </div>

          <div className="mb-4 w-full relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded-md pl-8 bg-slate-900"
              placeholder="Phone"
            />
            <FaPhone className="absolute left-2 top-2 text-gray-500" />
          </div>

          <div className="mb-4 w-full relative">
            <textarea
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded-md pl-8 bg-slate-900"
              placeholder="Skills"
            />
            <FaLaptop className="absolute left-2 top-2 text-gray-500" />
          </div>

          <div className="mb-4 w-full relative">
            <textarea
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded-md pl-8 bg-slate-900"
              placeholder="Experience"
            />
            <FaLaptop className="absolute left-2 top-2 text-gray-500" />
          </div>

          <div className="mb-4 w-full relative">
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded-md pl-8 bg-slate-900"
              placeholder="City"
            />
            <FaCity className="absolute left-2 top-2 text-gray-500" />
          </div>

          <div className="mb-4 w-full relative">
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded-md pl-8 bg-slate-900"
              placeholder="Country"
            />
            <FaGlobe className="absolute left-2 top-2 text-gray-500" />
          </div>

          <button type="submit" className="bg-blue-400 p-2 rounded-md text-white hover:bg-blue-500">
            Submit Application
          </button>
        </form>
      )}
    </div>
  );
};

export default ApplyForm;
