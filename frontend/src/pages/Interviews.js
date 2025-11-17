import React, { useState, useEffect } from 'react';
import { interviewAPI, candidateAPI, jobAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiCalendar, FiClock, FiUser, FiMapPin, FiVideo, FiTrash2, FiEye, FiX, FiCheckCircle, FiXCircle, FiMessageSquare, FiBriefcase } from 'react-icons/fi';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [formData, setFormData] = useState({
    candidate: '',
    job: '',
    type: 'Video',
    scheduledDate: '',
    duration: 60,
    meetingLink: '',
    location: '',
    interviewers: [{ name: '', email: '', role: '' }],
    notes: ''
  });
  const [feedbackData, setFeedbackData] = useState({
    rating: 3,
    technicalSkills: 3,
    communication: 3,
    cultureFit: 3,
    comments: '',
    recommendation: 'Maybe'
  });

  useEffect(() => {
    fetchInterviews();
    fetchCandidates();
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await interviewAPI.getAll(params);
      setInterviews(response.data.data.interviews || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await candidateAPI.getAll({});
      setCandidates(response.data.data.candidates || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getAll({ status: 'Open' });
      setJobs(response.data.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty interviewers
      const validInterviewers = formData.interviewers.filter(
        i => i.name.trim() && i.email.trim()
      );

      const scheduleData = {
        ...formData,
        interviewers: validInterviewers,
        round: 1 // Default to round 1
      };

      await interviewAPI.schedule(scheduleData);
      toast.success('Interview scheduled successfully! Invitation email sent to candidate.');
      setShowScheduleModal(false);
      resetForm();
      fetchInterviews();
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const handleCancelInterview = async (id) => {
    if (window.confirm('Are you sure you want to cancel this interview?')) {
      try {
        await interviewAPI.cancel(id);
        toast.success('Interview cancelled successfully');
        fetchInterviews();
      } catch (error) {
        toast.error('Failed to cancel interview');
      }
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await interviewAPI.addFeedback(selectedInterview._id, feedbackData);
      toast.success('Feedback submitted successfully');
      setShowFeedbackModal(false);
      setSelectedInterview(null);
      resetFeedback();
      fetchInterviews();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

  const resetForm = () => {
    setFormData({
      candidate: '',
      job: '',
      type: 'Video',
      scheduledDate: '',
      duration: 60,
      meetingLink: '',
      location: '',
      interviewers: [{ name: '', email: '', role: '' }],
      notes: ''
    });
  };

  const resetFeedback = () => {
    setFeedbackData({
      rating: 3,
      technicalSkills: 3,
      communication: 3,
      cultureFit: 3,
      comments: '',
      recommendation: 'Maybe'
    });
  };

  const addInterviewer = () => {
    setFormData({
      ...formData,
      interviewers: [...formData.interviewers, { name: '', email: '', role: '' }]
    });
  };

  const removeInterviewer = (index) => {
    const newInterviewers = formData.interviewers.filter((_, i) => i !== index);
    setFormData({ ...formData, interviewers: newInterviewers });
  };

  const updateInterviewer = (index, field, value) => {
    const newInterviewers = [...formData.interviewers];
    newInterviewers[index][field] = value;
    setFormData({ ...formData, interviewers: newInterviewers });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Rescheduled': 'bg-yellow-100 text-yellow-800',
      'No Show': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Video': <FiVideo className="mr-2" />,
      'Phone Screen': <FiClock className="mr-2" />,
      'In-person': <FiMapPin className="mr-2" />,
      'Technical': <FiCheckCircle className="mr-2" />,
      'HR': <FiUser className="mr-2" />,
      'Final': <FiCheckCircle className="mr-2" />
    };
    return icons[type] || <FiCalendar className="mr-2" />;
  };

  const upcomingInterviews = interviews.filter(i =>
    new Date(i.scheduledDate) > new Date() && i.status === 'Scheduled'
  );

  const pastInterviews = interviews.filter(i =>
    new Date(i.scheduledDate) <= new Date() || i.status !== 'Scheduled'
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading interviews...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Interviews</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Schedule and manage candidate interviews</p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
        >
          <FiPlus className="mr-2" />
          Schedule Interview
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-4 border border-transparent dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Interviews</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{interviews.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-4 border border-transparent dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{upcomingInterviews.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-4 border border-transparent dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {interviews.filter(i => i.status === 'Completed').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-4 border border-transparent dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Cancelled</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {interviews.filter(i => i.status === 'Cancelled').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-4 border border-transparent dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="No Show">No Show</option>
          </select>
        </div>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 border border-transparent dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Upcoming Interviews</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingInterviews.map((interview) => (
              <div key={interview._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {interview.candidate?.firstName} {interview.candidate?.lastName}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <FiBriefcase className="mr-2" />
                        {interview.job?.title} - {interview.job?.department}
                      </div>
                      <div className="flex items-center">
                        {getTypeIcon(interview.type)}
                        {interview.type}
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="mr-2" />
                        {new Date(interview.scheduledDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {' at '}
                        {new Date(interview.scheduledDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-2" />
                        {interview.duration} minutes
                      </div>
                      {interview.meetingLink && (
                        <div className="flex items-center">
                          <FiVideo className="mr-2" />
                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                      {interview.location && (
                        <div className="flex items-center">
                          <FiMapPin className="mr-2" />
                          {interview.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedInterview(interview);
                        setShowDetailModal(true);
                      }}
                      className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-600 rounded transition-colors"
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() => handleCancelInterview(interview._id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Cancel Interview"
                    >
                      <FiXCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Interviews */}
      {pastInterviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 border border-transparent dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Past Interviews</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {pastInterviews.map((interview) => (
              <div key={interview._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {interview.candidate?.firstName} {interview.candidate?.lastName}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <FiBriefcase className="mr-2" />
                        {interview.job?.title}
                      </div>
                      <div className="flex items-center">
                        {getTypeIcon(interview.type)}
                        {interview.type}
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="mr-2" />
                        {new Date(interview.scheduledDate).toLocaleDateString()}
                      </div>
                      {interview.feedback?.recommendation && (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <FiCheckCircle className="mr-2" />
                          Feedback: {interview.feedback.recommendation}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedInterview(interview);
                        setShowDetailModal(true);
                      }}
                      className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-600 rounded transition-colors"
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </button>
                    {interview.status === 'Scheduled' && (
                      <button
                        onClick={() => {
                          setSelectedInterview(interview);
                          setShowFeedbackModal(true);
                        }}
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Add Feedback"
                      >
                        <FiMessageSquare size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {interviews.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-12 text-center border border-transparent dark:border-gray-700">
          <FiCalendar className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No interviews scheduled yet</p>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
          >
            Schedule First Interview
          </button>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Schedule Interview</h2>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  resetForm();
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Candidate Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Candidate *
                  </label>
                  <select
                    required
                    value={formData.candidate}
                    onChange={(e) => setFormData({ ...formData, candidate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Candidate</option>
                    {candidates.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.firstName} {c.lastName} - {c.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Position *
                  </label>
                  <select
                    required
                    value={formData.job}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Job</option>
                    {jobs.map(j => (
                      <option key={j._id} value={j._id}>
                        {j.title} - {j.department}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interview Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interview Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Video">Video</option>
                    <option value="Phone Screen">Phone Screen</option>
                    <option value="In-person">In-person</option>
                    <option value="Technical">Technical</option>
                    <option value="HR">HR Round</option>
                    <option value="Final">Final Round</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    max="240"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Scheduled Date & Time */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Meeting Link */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meeting Link {formData.type === 'Video' && '*'}
                  </label>
                  <input
                    type="url"
                    required={formData.type === 'Video'}
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location {formData.type === 'In-person' && '*'}
                  </label>
                  <input
                    type="text"
                    required={formData.type === 'In-person'}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Office address or room number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Interviewers */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interviewers</label>
                  <button
                    type="button"
                    onClick={addInterviewer}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    + Add Interviewer
                  </button>
                </div>
                {formData.interviewers.map((interviewer, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 mb-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={interviewer.name}
                      onChange={(e) => updateInterviewer(index, 'name', e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={interviewer.email}
                      onChange={(e) => updateInterviewer(index, 'email', e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Role"
                        value={interviewer.role}
                        onChange={(e) => updateInterviewer(index, 'role', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {formData.interviewers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInterviewer(index)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 rounded"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes for the interview..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interview Detail Modal */}
      {showDetailModal && selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Interview Details</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedInterview(null);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Candidate & Job Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Candidate</h3>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {selectedInterview.candidate?.firstName} {selectedInterview.candidate?.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedInterview.candidate?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Position</h3>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedInterview.job?.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedInterview.job?.department}</p>
                </div>
              </div>

              {/* Interview Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Interview Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{selectedInterview.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedInterview.status)}`}>
                      {selectedInterview.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {new Date(selectedInterview.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {new Date(selectedInterview.scheduledDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedInterview.duration} minutes</span>
                  </div>
                  {selectedInterview.meetingLink && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Meeting Link:</span>
                      <a
                        href={selectedInterview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}
                  {selectedInterview.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="text-gray-900 dark:text-gray-100">{selectedInterview.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Interviewers */}
              {selectedInterview.interviewers && selectedInterview.interviewers.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Interviewers</h3>
                  <div className="space-y-2">
                    {selectedInterview.interviewers.map((interviewer, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-900 dark:text-gray-100 font-medium">{interviewer.name}</p>
                          <p className="text-gray-600 dark:text-gray-400">{interviewer.role}</p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{interviewer.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {selectedInterview.feedback && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Feedback</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2 border border-transparent dark:border-gray-600">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Overall Rating:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {selectedInterview.feedback.rating}/5
                      </span>
                    </div>
                    {selectedInterview.feedback.recommendation && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Recommendation:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {selectedInterview.feedback.recommendation}
                        </span>
                      </div>
                    )}
                    {selectedInterview.feedback.comments && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Comments:</p>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{selectedInterview.feedback.comments}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedInterview.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedInterview.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedInterview(null);
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                {selectedInterview.status !== 'Completed' && selectedInterview.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowFeedbackModal(true);
                    }}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
                  >
                    Add Feedback
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Interview Feedback</h2>
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedInterview(null);
                  resetFeedback();
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="p-6 space-y-6">
              {/* Candidate Info */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-transparent dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400">Candidate</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedInterview.candidate?.firstName} {selectedInterview.candidate?.lastName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedInterview.job?.title}</p>
              </div>

              {/* Ratings */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Overall Rating *
                  </label>
                  <select
                    required
                    value={feedbackData.rating}
                    onChange={(e) => setFeedbackData({ ...feedbackData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Below Average</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technical Skills *
                  </label>
                  <select
                    required
                    value={feedbackData.technicalSkills}
                    onChange={(e) => setFeedbackData({ ...feedbackData, technicalSkills: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Below Average</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Communication *
                  </label>
                  <select
                    required
                    value={feedbackData.communication}
                    onChange={(e) => setFeedbackData({ ...feedbackData, communication: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Below Average</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Culture Fit *
                  </label>
                  <select
                    required
                    value={feedbackData.cultureFit}
                    onChange={(e) => setFeedbackData({ ...feedbackData, cultureFit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Below Average</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
              </div>

              {/* Recommendation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recommendation *
                </label>
                <select
                  required
                  value={feedbackData.recommendation}
                  onChange={(e) => setFeedbackData({ ...feedbackData, recommendation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Strong Yes">Strong Yes - Highly Recommend</option>
                  <option value="Yes">Yes - Recommend</option>
                  <option value="Maybe">Maybe - Neutral</option>
                  <option value="No">No - Do Not Recommend</option>
                  <option value="Strong No">Strong No - Strongly Against</option>
                </select>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comments *
                </label>
                <textarea
                  required
                  rows="4"
                  value={feedbackData.comments}
                  onChange={(e) => setFeedbackData({ ...feedbackData, comments: e.target.value })}
                  placeholder="Provide detailed feedback about the candidate's performance..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedInterview(null);
                    resetFeedback();
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;
