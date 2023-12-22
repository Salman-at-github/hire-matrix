import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { auth } from '../config/firebase';
import { FaBuilding, FaPlus } from 'react-icons/fa';
import { FaRegMessage } from "react-icons/fa6";
import { formatDate } from '../utils/utilities';

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
      return unsubscribe;
    }, [auth]);
  
    return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-blue-950 to-slate-800">
      <h2 className="text-3xl font-bold mb-8 text-white md:my-8">Job Listings</h2>

      {JobsListings.length > 0 ? (
        <ul className="space-y-4">
          {JobsListings.map((job) => (
            <li key={job.id} className="bg-gradient-to-r from-cyan-700 to-blue-700 text-white p-4 rounded-md shadow-md md:w-1/2 md:mx-auto">
              <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
              <h4 className="text-base text-yellow-300 mb-2 font-semibold flex justify-start items-center">
                {job.organization && (
                  <>
                    <FaBuilding />{job.organization}
                  </>
                )}
              </h4>
              <p className="text-gray-100 flex items-center gap-1"><FaRegMessage/>{job.description}</p>
              <Link to={`/jobdetails/${job.id}`} className="text-green-300 hover:underline block mt-2">
                View Details
              </Link>
              <p className='font-light text-sm mt-2'>Posted on: {formatDate(job.createdAt)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white">No job listings found.</p>
      )}

      <div className="mt-8">
        <button
          onClick={() => navigateTo('/createjob')}
          className="bg-black p-2 rounded-md text-white flex justify-center items-center gap-2 hover:bg-slate-800 md:z-50 md:fixed bottom-10 left-10 border border-white"
        >
          <FaPlus/>Add Job Listing
        </button>
      </div>
    </div>
  );
};

export default JobsList;
