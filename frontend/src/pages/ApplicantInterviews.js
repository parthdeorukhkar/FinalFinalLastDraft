import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiVideo } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { applicantAPI } from '../services/api';

const ApplicantInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await applicantAPI.getInterviews();
      setInterviews(response.data.data.interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      'Completed': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'Cancelled': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    };
    return colors[status] || colors['Scheduled'];
  };

  const getTypeIcon = (type) => {
    if (type === 'Video' || type === 'Virtual') {
      return <FiVideo size={20} />;
    }
    return <FiMapPin size={20} />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const upcomingInterviews = interviews.filter(
    i => new Date(i.scheduledDate) >= new Date() && i.status === 'Scheduled'
  );
  const pastInterviews = interviews.filter(
    i => new Date(i.scheduledDate) < new Date() || i.status !== 'Scheduled'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Interviews</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View your scheduled and past interviews
        </p>
      </div>

      {/* Upcoming Interviews */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Upcoming Interviews ({upcomingInterviews.length})
          </h3>
        </div>
        <div className="p-6">
          {upcomingInterviews.length === 0 ? (
            <div className="text-center py-8">
              <FiCalendar className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                No Upcoming Interviews
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                You don't have any scheduled interviews at the moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {interview.job?.title || 'Interview'}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {interview.job?.department}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FiCalendar className="mr-2" size={16} />
                      <span>{formatDate(interview.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FiClock className="mr-2" size={16} />
                      <span>{formatTime(interview.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      {getTypeIcon(interview.type)}
                      <span className="ml-2">{interview.type || 'In-Person'}</span>
                    </div>
                  </div>

                  {interview.location && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Location:</span> {interview.location}
                      </p>
                    </div>
                  )}

                  {interview.notes && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <span className="font-medium">Notes:</span> {interview.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Past Interviews */}
      {pastInterviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Past Interviews ({pastInterviews.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pastInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="border dark:border-gray-700 rounded-lg p-4 opacity-75"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {interview.job?.title || 'Interview'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(interview.scheduledDate)} at {formatTime(interview.scheduledDate)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>

                  {interview.feedback && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Feedback:</span> {interview.feedback.notes || 'No feedback provided'}
                      </p>
                      {interview.feedback.rating && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-medium">Rating:</span> {interview.feedback.rating}/5
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantInterviews;
