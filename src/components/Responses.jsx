import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, deleteDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { FaCheck, FaTimes, FaTrash, FaEye, FaTimesCircle } from 'react-icons/fa';
import { db } from '../config/firebase';
import Application from './Application';

const Responses = () => {
  const { id, title } = useParams();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' by default, can be 'new', 'shortlisted', or 'rejected'

  useEffect(() => {
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
          setApplications(applicationsData);
          setFilteredApplications(applicationsData);
        });

        return () => unsubscribe(); // Unsubscribe from snapshot listener when component unmounts
      } catch (error) {
        console.error('Error fetching applications:', error.message);
      }
    };

    fetchApplications();
  }, [id]);

  useEffect(() => {
    // Update filteredApplications based on the selected filter
    if (filter === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === filter));
    }
  }, [applications, filter]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const applicationDocRef = doc(db, 'job-applications', applicationId);

      // Update the status field of the application
      await updateDoc(applicationDocRef, {
        status: newStatus,
      });
    } catch (error) {
      console.error('Error updating application status:', error.message);
    }
  };

  const handleDelete = async (applicationId) => {
    try {
      const applicationDocRef = doc(db, 'job-applications', applicationId);

      // Delete the application
      await deleteDoc(applicationDocRef);
    } catch (error) {
      console.error('Error deleting application:', error.message);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return 'N/A'; // or any default value you prefer
    }

    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    return date.toLocaleString(); // Adjust the formatting based on your needs
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  const handleCloseDetails = () => {
    setSelectedApplication(null);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-blue-800 to-purple-800 flex flex-col text-center text-gray-200">
      <h2 className="text-4xl font-semibold mb-8 text-white">Responses for role: <span className='font-medium'>{title}</span></h2>

      <div className="flex justify-center mb-4">
        <label className="mr-2 text-white">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 rounded-md text-black"
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="w-full md:w-1/2 mx-auto">
        {filteredApplications.length === 0 ? (
          <p className="text-xl text-gray-400">No applications found.</p>
        ) : (
          filteredApplications.map((application) => (
            <div
              key={application.id}
              className="flex relative justify-between items-start text-left flex-col border-white rounded-md border p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-bold">{application.fullName}</p>
                <div className="flex space-x-4 absolute top-3 right-3">
                  <FaEye
                    className="cursor-pointer text-lg hover:text-blue-500"
                    onClick={() => handleViewDetails(application)}
                  />
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => handleDelete(application.id)}
                  />
                </div>
              </div>
              <p>Email: {application.email}</p>
              <p>Phone: {application.phone}</p>
              <p>Status: <span className={`${application.status === "rejected" ? "text-red-500" :application.status === "shortlisted" ? "text-green-400" :"text-white"}`}>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
              </p>
              <p>Submitted At: {formatDate(application.submittedAt)}</p>

              <div className="flex items-center mt-2">
                {application.status === 'new' && (
                  <>
                    <FaCheck
                      className="cursor-pointer text-green-400 mr-4"
                      onClick={() => handleStatusChange(application.id, 'shortlisted')}
                    />
                    <FaTimes
                      className="cursor-pointer text-red-400"
                      onClick={() => handleStatusChange(application.id, 'rejected')}
                    />
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedApplication && (
        <Application
          application={selectedApplication}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default Responses;