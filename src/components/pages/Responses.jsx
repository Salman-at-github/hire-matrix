import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, updateDoc, deleteDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { FaCheck, FaTimes, FaTrash, FaEye } from 'react-icons/fa';
import { auth, db } from '../../config/firebase';
import Application from '../Application';
import { formatDistanceToNow } from 'date-fns';
import CustomTooltip from '../CustomTooltip';
import toast from 'react-hot-toast';

const Responses = () => {
  const { id, title } = useParams();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' by default, can be 'new', 'shortlisted', or 'rejected'

  const navigateTo = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigateTo('/login');
      }
    });
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

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    // Update filteredApplications based on the selected filter
    if (filter === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter((app) => app.status === filter));
    }
  }, [applications, filter]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const applicationDocRef = doc(db, 'job-applications', applicationId);

      // Update the status field of the application
      await updateDoc(applicationDocRef, {
        status: newStatus,
      });

      toast.success(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating application status:', error.message);
      toast.error(`Error updating application status: ${error.message}`);
    }
  };

  const handleDelete = async (applicationId) => {
    try {
      const applicationDocRef = doc(db, 'job-applications', applicationId);

      // Delete the application
      await deleteDoc(applicationDocRef);

      toast.success('Application deleted successfully!');
    } catch (error) {
      console.error('Error deleting application:', error.message);
      toast.error(`Error deleting application: ${error.message}`);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return 'N/A'; // or any default value you prefer
    }

    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    return formatDistanceToNow(date, { addSuffix: true }); // Format the date as "time ago"
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  const handleCloseDetails = () => {
    setSelectedApplication(null);
  };

  const sortedFilteredApplications = filteredApplications.slice().sort((a, b) => b.submittedAt - a.submittedAt);

  return (
    <div className="min-h-screen p-8 flex flex-col text-center text-gray-200">
      <h2 className="text-4xl font-semibold mb-8 text-white">
        Applications for: <span className="font-medium">{title}</span>
      </h2>

      <div className="flex justify-center items-center mb-4">
        <label className="mr-4 text-white">Filter by:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 rounded-md bg-black"
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="w-full md:w-1/2 mx-auto">
        {sortedFilteredApplications.length === 0 ? (
          <p className="text-xl text-gray-400">No applications found.</p>
        ) : (
          sortedFilteredApplications.map((application) => (
            <div
              key={application.id}
              className="flex relative bg-gradient-to-r from-blue-800 to-purple-800 justify-between items-start text-left flex-col border-white rounded-md border p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-bold">{application.fullName}</p>
                <div className="flex space-x-4 absolute top-3 right-3">
                  <CustomTooltip text={'View Application'}>
                    <FaEye
                      className="cursor-pointer text-lg hover:text-blue-500 hover:scale-125"
                      onClick={() => handleViewDetails(application)}
                    />
                  </CustomTooltip>
                  <CustomTooltip text={'Delete Application'}>
                    <FaTrash
                      className="cursor-pointer hover:text-red-500 hover:scale-125"
                      onClick={() => handleDelete(application.id)}
                    />
                  </CustomTooltip>
                </div>
              </div>
              <p>
                <span className="text-black font-semibold">Email:</span> {application.email}
              </p>
              <p>
                <span className="text-black font-semibold">Phone:</span> {application.phone}
              </p>
              <p>
                <span className="text-black font-semibold">Status:</span>{' '}
                <span
                  className={`${
                    application.status === 'rejected'
                      ? 'text-red-500'
                      : application.status === 'shortlisted'
                      ? 'text-green-400'
                      : 'text-yellow-300'
                  }`}
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </p>
              <p>
                <span className="text-black font-semibold">Submitted at:</span>{' '}
                {formatDate(application.submittedAt)}
              </p>

              <div className="flex items-center mt-2">
                {application.status === 'new' && (
                  <>
                    <CustomTooltip text={'Shortlist application'}>
                      <FaCheck
                        className="cursor-pointer text-green-400 mr-4 hover:scale-125"
                        onClick={() => handleStatusChange(application.id, 'shortlisted')}
                      />
                    </CustomTooltip>
                    <CustomTooltip text={'Reject application'}>
                      <FaTimes
                        className="cursor-pointer text-red-400 hover:scale-125"
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                      />
                    </CustomTooltip>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedApplication && (
        <Application application={selectedApplication} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default Responses;
