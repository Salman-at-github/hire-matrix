import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { FaBriefcase, FaFileAlt, FaCheck, FaLink } from 'react-icons/fa';

const JobDetails = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const [jobDetails, setJobDetails] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigateTo('/login');
      }
    });

    const fetchJobDetails = async () => {
      try {
        // Reference to the job listing document in Firestore
        const jobDocRef = doc(db, 'job-listings', id);

        // Fetch job details based on the job ID
        const jobSnapshot = await getDoc(jobDocRef);

        // Check if the job exists
        if (jobSnapshot.exists()) {
          // Process the snapshot data and update state
          const jobData = { id: jobSnapshot.id, ...jobSnapshot.data() };
          setJobDetails(jobData);
        } else {
          console.log('Job not found');
        }
      } catch (error) {
        console.error('Error fetching job details:', error.message);
      }
    };

    fetchJobDetails();
    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [id]);

  const copyToClipboard = async () => {
    try {
      // Construct the job application link
      const jobLink = `${window.location.origin}/jobs/apply/${jobDetails.id}`;

      // Copy the link to the clipboard
      await navigator.clipboard.writeText(jobLink);
      setLinkCopied(true)

      console.log('Link copied to clipboard:', jobLink);
    } catch (error) {
      console.error('Error copying link to clipboard:', error.message);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-blue-800 to-purple-800 text-white flex md:justify-center items-center flex-col">
      <h2 className="text-4xl font-bold mb-8">Job Details</h2>
      {jobDetails ? (
        <div className="flex justify-center items-start flex-col border-white rounded-md border min-h-96 w-full md:w-1/2 p-5">
          <h3 className="text-3xl font-semibold mb-4">{jobDetails.title}</h3>
          <p className="mb-4">
            <FaBriefcase className="inline mr-2" />
            {jobDetails.description}
          </p>
          <p className="mb-4">
            <FaFileAlt className="inline mr-2" />
            {jobDetails.requirements}
          </p>
          <div className='self-center flex gap-8 items-center justify-between my-6'> 
            <Link to={`/jobs/apply/${jobDetails.id}`} className='border border-white rounded-md py-1 px-3 hover:scale-105'>Visit</Link>
          {
            !linkCopied ? (
          <button onClick={copyToClipboard} className="flex justify-center items-center  border border-white rounded-md py-1 px-3 hover:scale-105 w-36">
            <FaLink className="mr-2" />
            Copy Link
          </button>
            ) : (
                <button onClick={copyToClipboard} className="flex justify-center items-center border border-white rounded-md py-1 px-3 hover:scale-105 w-36">
            <FaCheck className="mr-2" />
            Link Copied
          </button>
            )
          }
          </div>
          <div>
            <Link to={`/jobs/response/${id}/${jobDetails.title}`}>Check Responses</Link>
          </div>
        </div>
      ) : (
        <p>No job details found.</p>
      )}
    </div>
  );
};

export default JobDetails;
