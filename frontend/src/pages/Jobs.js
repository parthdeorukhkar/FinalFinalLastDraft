import React, { useState, useEffect } from 'react';
import { jobAPI, candidateAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiSearch, FiBriefcase, FiEdit, FiTrash2, FiMapPin, FiDollarSign, FiClock, FiUsers, FiX, FiCheckCircle, FiMail, FiPhone } from 'react-icons/fi';
import JobForm from '../components/JobForm';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, departmentFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        ...(statusFilter && { status: statusFilter }),
        ...(departmentFilter && { department: departmentFilter })
      };
      const response = await jobAPI.getAll(params);
      setJobs(response.data.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job? All associated candidate applications will be affected.')) {
      try {
        await jobAPI.delete(id);
        toast.success('Job deleted successfully');
        fetchJobs();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setShowCreateModal(true);
  };

  const handleViewApplicants = async (job) => {
    try {
      setSelectedJob(job);
      const response = await candidateAPI.getByJob(job._id);
      setApplicants(response.data.data.candidates || []);
      setShowApplicantsModal(true);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      toast.error('Failed to load applicants');
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Helper function to format salary range
  const formatSalaryRange = (salaryRange) => {
    if (!salaryRange) return 'Not specified';
    if (typeof salaryRange === 'string') return salaryRange;
    const { min, max, currency = 'USD' } = salaryRange;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Not specified';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-green-100 text-green-800',
      'Closed': 'bg-red-100 text-red-800',
      'On Hold': 'bg-yellow-100 text-yellow-800',
      'Draft': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Full-time': 'bg-blue-100 text-blue-800',
      'Part-time': 'bg-purple-100 text-purple-800',
      'Contract': 'bg-orange-100 text-orange-800',
      'Internship': 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique departments for filter
  const departments = [...new Set(jobs.map(job => job.department))].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Job Postings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage job openings</p>
        </div>
        <button
          onClick={() => {
            setSelectedJob(null);
            setShowCreateModal(true);
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Create Job
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="On Hold">On Hold</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center p-12">
            <FiBriefcase className="mx-auto text-gray-400 dark:text-gray-500 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No jobs found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by creating your first job posting</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="mr-2" />
              Create Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:bg-gray-700 transition-all cursor-pointer bg-white dark:bg-gray-800"
                onClick={() => handleViewDetails(job)}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{job.department}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {job.location && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FiMapPin className="mr-2 dark:text-gray-500" size={14} />
                      {job.location}
                    </div>
                  )}
                  {job.employmentType && (
                    <div className="flex items-center text-sm">
                      <FiClock className="mr-2 text-gray-400 dark:text-gray-500" size={14} />
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(job.employmentType)}`}>
                        {job.employmentType}
                      </span>
                    </div>
                  )}
                  {job.salaryRange && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FiDollarSign className="mr-2 dark:text-gray-500" size={14} />
                      {formatSalaryRange(job.salaryRange)}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
                  <button
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewApplicants(job);
                    }}
                    title="View applicants"
                  >
                    <FiUsers className="mr-1" size={14} />
                    <span>{job.totalApplications || 0} applicants</span>
                  </button>
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Edit"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{jobs.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Open Positions</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {jobs.filter(j => j.status === 'Open').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Applicants</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {jobs.reduce((sum, j) => sum + (j.totalApplications || 0), 0)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Departments</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {departments.length}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <JobForm
          job={selectedJob}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchJobs}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedJob.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedJob.department}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedJob.status)}`}>
                    {selectedJob.status}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedJob.employmentType)}`}>
                    {selectedJob.employmentType}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</div>
                  <div className="flex items-center font-semibold text-gray-900 dark:text-gray-100">
                    <FiMapPin className="mr-2 text-gray-400 dark:text-gray-500" size={16} />
                    {selectedJob.location}
                  </div>
                </div>
                {selectedJob.salaryRange && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Salary Range</div>
                    <div className="flex items-center font-semibold text-gray-900 dark:text-gray-100">
                      <FiDollarSign className="mr-2 text-gray-400 dark:text-gray-500" size={16} />
                      {formatSalaryRange(selectedJob.salaryRange)}
                    </div>
                  </div>
                )}
                <button
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left w-full"
                  onClick={() => handleViewApplicants(selectedJob)}
                  title="Click to view applicants"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Applicants</div>
                  <div className="flex items-center font-semibold text-gray-900 dark:text-gray-100">
                    <FiUsers className="mr-2 text-gray-400 dark:text-gray-500" size={16} />
                    {selectedJob.totalApplications || 0} candidates
                  </div>
                </button>
              </div>

              {/* Description */}
              {selectedJob.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedJob.description}</p>
                </div>
              )}

              {/* Responsibilities */}
              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div className="border-t dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Responsibilities</h3>
                  <ul className="space-y-2">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheckCircle className="text-green-500 dark:text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                        <span className="text-gray-700 dark:text-gray-300">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div className="border-t dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheckCircle className="text-blue-500 dark:text-blue-400 mr-2 mt-1 flex-shrink-0" size={16} />
                        <span className="text-gray-700 dark:text-gray-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills & Experience */}
              <div className="border-t dark:border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {typeof skill === 'string' ? skill : skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  {selectedJob.experienceLevel && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Experience Level</h4>
                      <p className="text-gray-900 dark:text-gray-100">{selectedJob.experienceLevel}</p>
                    </div>
                  )}
                  {selectedJob.educationLevel && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Education Level</h4>
                      <p className="text-gray-900 dark:text-gray-100">{selectedJob.educationLevel}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t dark:border-gray-700 pt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedJob);
                  }}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  <FiEdit className="mr-2" />
                  Edit Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicantsModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Applicants for {selectedJob.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'} (sorted by match score)</p>
              </div>
              <button
                onClick={() => setShowApplicantsModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {applicants.length === 0 ? (
                <div className="text-center py-12">
                  <FiUsers className="mx-auto text-gray-300 dark:text-gray-600" size={48} />
                  <p className="text-gray-500 dark:text-gray-400 mt-4">No applicants yet for this position</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map((applicant, index) => (
                    <div
                      key={applicant._id}
                      className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-700 transition-all bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {applicant.firstName} {applicant.lastName}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center">
                                <FiMail className="mr-1 dark:text-gray-500" size={14} />
                                {applicant.email}
                              </div>
                              {applicant.phone && (
                                <div className="flex items-center">
                                  <FiPhone className="mr-1 dark:text-gray-500" size={14} />
                                  {applicant.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {applicant.matchScore ? (
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getMatchScoreColor(applicant.matchScore)}`}>
                            {applicant.matchScore}% Match
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-sm text-gray-400 bg-gray-100 dark:bg-gray-700 dark:text-gray-500 rounded-full">
                            Not analyzed
                          </span>
                        )}
                      </div>

                      {/* Brief Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{applicant.status || 'New'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Applied:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                            {new Date(applicant.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* AI Summary if available */}
                      {applicant.aiSummary && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{applicant.aiSummary}</p>
                        </div>
                      )}

                      {/* Strengths if available */}
                      {applicant.strengths && applicant.strengths.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Strengths:</p>
                          <div className="flex flex-wrap gap-2">
                            {applicant.strengths.slice(0, 3).map((strength, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                                {strength}
                              </span>
                            ))}
                            {applicant.strengths.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                +{applicant.strengths.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
