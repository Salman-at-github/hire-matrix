import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import { getDoc, doc, where, query, collection, onSnapshot } from 'firebase/firestore';
import { FaBriefcase, FaFileAlt, FaCheck, FaLink, FaBell } from 'react-icons/fa';
import CustomTooltip from '../CustomTooltip';

const JobDetails = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const [jobDetails, setJobDetails] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [responseCount, setResponseCount] = useState(0)

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
    //Notification sound
    const playBellSound = () => {
      const audio = new Audio('/sounds/BellSound.mp3');
      audio.volume =0.8;
      audio.play();
    };
    const fetchApplications = async () => {
      try {
        // Reference to the job applications collection
        const jobApplicationsRef = collection(db, 'job-applications');

        // Query applications for the specific job listing
        const q = query(jobApplicationsRef, where('job', '==', id));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const applicationsData = [];
          querySnapshot.forEach((doc) => {
            applicationsData.push({ id: doc.id, ...doc.data() });
          });
          const newApplications = applicationsData?.filter((application)=>application.status === "new")
          if(newApplications.length > 0){
            playBellSound();
          }
          setResponseCount(newApplications?.length);
        });

        return () => unsubscribe(); // Unsubscribe from snapshot listener when component unmounts
      } catch (error) {
        console.error('Error fetching applications:', error.message);
      }
    };

    fetchJobDetails();
    fetchApplications();
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
    <div className="min-h-screen p-8  flex md:justify-center items-center flex-col text-white">
      <h2 className="text-4xl font-bold mb-8 md:my-8">Job Details</h2>
      {jobDetails ? (
        <div className="relative flex justify-center items-start flex-col border-white rounded-md border min-h-96 w-full md:w-1/2 p-5 bg-gradient-to-r from-blue-800 to-indigo-800 ">
          <h3 className="text-3xl font-semibold mb-4">{jobDetails.title}</h3>
          <p className="mb-4 flex justify-center items-center">
            <FaBriefcase className="inline mr-2" />
            <span className=''>{jobDetails.description}</span>
          </p>
          <p className="mb-4 flex justify-center items-center">
            <FaFileAlt className="inline mr-2" />
            <span className='mr-2'>Requirements:</span>
            {jobDetails.requirements}
          </p>
          <div className='self-center flex gap-8 items-center justify-between my-6'> 
            <Link to={`/jobs/apply/${jobDetails.id}`} className='border hover:bg-blue-900 border-white rounded-md py-2 px-3 hover:scale-105'>Apply</Link>
          {
            !linkCopied ? (
          <button onClick={copyToClipboard} className="flex justify-center hover:bg-blue-900 items-center  border border-white rounded-md py-2 px-3 hover:scale-105 w-[10rem]">
            <FaLink className="mr-2" />
            Copy Job Link
          </button>
            ) : (
                <button onClick={copyToClipboard} className="flex hover:bg-blue-900 justify-center items-center border border-white rounded-md py-2 px-3 hover:scale-105 w-[10rem]">
            <FaCheck className="mr-2" />
            Link Copied
          </button>
            )
          }
          </div>
          <div className='absolute top-6 right-6'>
            <CustomTooltip text={"View Responses"} width={10}>

          <div className='relative hover:scale-110'>
            <Link to={`/jobs/response/${id}/${jobDetails.title}`}><FaBell className='text-3xl'/> <span className={`rounded-full bg-red-700 px-2 py-[2px] absolute -top-4 -right-4 text-center ${responseCount <=0? "hidden": ""}`}>{responseCount}</span></Link>
          </div>
            </CustomTooltip>
          </div>
        </div>
      ) : (
        <p>No job details found.</p>
      )}
    </div>
  );
};

export default JobDetails;
