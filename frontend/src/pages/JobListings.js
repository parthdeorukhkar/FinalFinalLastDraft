import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiSearch, FiUpload, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { applicantAPI } from '../services/api';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchAppliedStatus();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await applicantAPI.getJobs();
      setJobs(response.data.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedStatus = async () => {
    try {
      const response = await applicantAPI.getStatus();
      if (response.data.data.appliedJob) {
        setAppliedJobs([response.data.data.appliedJob._id]);
      }
    } catch (error) {
      console.error('Error fetching applied status:', error);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
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

  const submitApplication = async () => {
    if (!selectedFile) {
      toast.error('Please upload your resume');
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      await applicantAPI.applyToJob(selectedJob._id, formData);
      toast.success('Application submitted successfully!');
      setAppliedJobs([...appliedJobs, selectedJob._id]);
      setShowApplyModal(false);
      setSelectedFile(null);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error applying:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Job Openings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Browse and apply to open positions
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by job title, department, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Job Listings */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <FiBriefcase className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No jobs found</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new openings'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div key={job._id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{job.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{job.department}</p>
                  </div>
                  {appliedJobs.includes(job._id) && (
                    <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm flex items-center">
                      <FiCheck className="mr-1" size={14} />
                      Applied
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FiMapPin className="mr-2" size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FiClock className="mr-2" size={16} />
                    <span>{job.employmentType}</span>
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FiDollarSign className="mr-2" size={16} />
                      <span>{job.salaryRange.min?.toLocaleString()} - {job.salaryRange.max?.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {job.description}
                </p>

                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                        >
                          {typeof skill === 'object' ? skill.name : skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 4 && (
                        <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                          +{job.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {job.experienceLevel || 'Entry'} Level
                  </span>
                  {appliedJobs.includes(job._id) ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                    >
                      Already Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(job)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Apply for {selectedJob.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedJob.department} • {selectedJob.location}
            </p>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center mb-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="apply-resume-upload"
              />
              <label htmlFor="apply-resume-upload" className="cursor-pointer">
                <FiUpload className="mx-auto text-gray-400 dark:text-gray-500 mb-2" size={32} />
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedFile ? selectedFile.name : 'Upload your resume'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">PDF only (max 5MB)</p>
              </label>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Requirements:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                {selectedJob.requirements?.map((req, index) => (
                  <li key={index}>• {req}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setSelectedFile(null);
                  setSelectedJob(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
                disabled={!selectedFile || applying}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListings;
