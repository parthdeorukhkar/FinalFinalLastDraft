import React, { useState, useEffect } from 'react';
import { FiFileText, FiBriefcase, FiCalendar, FiCheckCircle, FiClock, FiAlertCircle, FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applicantAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await applicantAPI.getStatus();
      setStatusData(response.data.data);
    } catch (error) {
      console.error('Error fetching status:', error);
      toast.error('Failed to load application status');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      await applicantAPI.uploadResume(formData);
      toast.success('Resume uploaded successfully!');
      setShowUploadModal(false);
      setSelectedFile(null);
      fetchStatus(); // Refresh status
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
      'Applied': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      'Screening': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      'Shortlisted': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'Interview': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      'Offered': 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
      'Hired': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'Rejected': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    };
    return colors[status] || colors['New'];
  };

  const getStatusIcon = (status) => {
    const icons = {
      'New': FiClock,
      'Applied': FiFileText,
      'Screening': FiClock,
      'Shortlisted': FiCheckCircle,
      'Interview': FiCalendar,
      'Offered': FiCheckCircle,
      'Hired': FiCheckCircle,
      'Rejected': FiAlertCircle
    };
    return icons[status] || FiClock;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const StatusIcon = statusData ? getStatusIcon(statusData.status) : FiClock;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Welcome, {user?.name || 'Applicant'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your application status and manage your profile
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Application Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Application Status</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {statusData?.status || 'New'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${getStatusColor(statusData?.status)}`}>
              <StatusIcon size={24} />
            </div>
          </div>
        </div>

        {/* Match Score */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Match Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {statusData?.matchScore ? `${statusData.matchScore}%` : 'N/A'}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <FiCheckCircle className="text-white" size={24} />
            </div>
          </div>
        </div>

        {/* Resume Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resume</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {statusData?.hasResume ? 'Uploaded' : 'Not Uploaded'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${statusData?.hasResume ? 'bg-green-500' : 'bg-yellow-500'}`}>
              <FiFileText className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Applied Job */}
      {statusData?.appliedJob && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Applied Position</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {statusData.appliedJob.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {statusData.appliedJob.department} • {statusData.appliedJob.location}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                statusData.appliedJob.status === 'Open'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                {statusData.appliedJob.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Interviews */}
      {statusData?.upcomingInterviews && statusData.upcomingInterviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upcoming Interviews</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {statusData.upcomingInterviews.map((interview) => (
                <div key={interview._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {interview.job?.title || 'Interview'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(interview.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm">
                    {interview.type || 'Interview'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-primary-600 text-white p-6 rounded-lg hover:bg-primary-700 transition-colors text-left"
        >
          <FiUpload size={32} className="mb-2" />
          <h4 className="font-semibold">{statusData?.hasResume ? 'Update Resume' : 'Upload Resume'}</h4>
          <p className="text-sm opacity-90 mt-1">
            {statusData?.hasResume ? 'Upload a new version of your resume' : 'Upload your resume to get started'}
          </p>
        </button>
        <button
          onClick={() => navigate('/applicant/jobs')}
          className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors text-left"
        >
          <FiBriefcase size={32} className="mb-2" />
          <h4 className="font-semibold">Browse Jobs</h4>
          <p className="text-sm opacity-90 mt-1">View and apply to open positions</p>
        </button>
      </div>

      {/* Upload Resume Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Upload Resume
            </h3>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <FiUpload className="mx-auto text-gray-400 dark:text-gray-500 mb-2" size={32} />
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">PDF only (max 5MB)</p>
              </label>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadResume}
                disabled={!selectedFile || uploading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;
