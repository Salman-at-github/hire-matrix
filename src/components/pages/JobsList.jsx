import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { auth } from '../../config/firebase';
import { FaBuilding, FaPlus } from 'react-icons/fa';
import { FaRegMessage } from "react-icons/fa6";
import { formatDate } from '../../utils/utilities';

const JobsList = () => {
    const [JobsListings, setJobsListings] = useState([]);
    const navigateTo = useNavigate();
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          navigateTo('/login');
        }
      });
  
      const fetchJobsListings = async () => {
        try {
          // Ensure there is a logged-in user
          if (!auth.currentUser) {
            navigateTo('/login');
            return;
          }
  
          // Get the logged-in user's UID
          const userId = auth.currentUser.uid;
  
          // Reference to the job listings collection in Firestore
          const JobsListingsRef = collection(db, 'job-listings');
  
          // Use 'where' to create a query
          const q = query(JobsListingsRef, where('createdBy', '==', userId));
  
          // Fetch job listings based on the user's UID
          const snapshot = await getDocs(q);
  
          // Process the snapshot data and update state
          const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setJobsListings(jobs);
        } catch (error) {
          console.error('Error fetching job listings:', error.message);
        }
      };
  
      fetchJobsListings();
      return ()=> unsubscribe();
    }, [auth]);
  
    return (
    <div className="min-h-screen p-8">
      <h2 className="text-4xl font-bold mb-8 md:my-8 md:ml-10 text-white">Job Listings</h2>

      {JobsListings.length > 0 ? (
        <ul className="space-y-4">
          {JobsListings.map((job) => (
            <li key={job.id} className="bg-slate-100 p-4 rounded-md shadow-md md:w-1/2 md:mx-auto">
              <h3 className="text-xl font-semibold mb-1 ">{job.title}</h3>
              <h4 className="text-base text-gray-600 mb-3 font-semibold flex justify-start items-center">
                {job.organization && (
                  <>
                    <FaBuilding />{job.organization}
                  </>
                )}
              </h4>
              <p className="flex items-center gap-1 my-1"><FaRegMessage/>{job.description}</p>
              <Link to={`/jobdetails/${job.id}`} className="text-green-400 hover:underline font-normal">
                View Details
              </Link>
              <p className='font-light text-sm mt-2'>{formatDate(job.createdAt)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white">No job listings found.</p>
      )}

      <div className="mt-8">
        <button
          onClick={() => navigateTo('/createjob')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-800 p-2  rounded-md text-white hover:scale-105 md:fixed bottom-10 left-10 border border-white font-bold flex justify-center items-center"
        >
          <span className='text-black flex justify-center items-center'><FaPlus />A</span>dd Job Listing
        </button>
      </div>
    </div>
  );
};

export default JobsList;
