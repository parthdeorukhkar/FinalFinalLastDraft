import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiFileText, FiUpload, FiEdit2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { applicantAPI } from '../services/api';

const ApplicantProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await applicantAPI.getProfile();
      setProfile(response.data.data.candidate);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
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
      fetchProfile();
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-full">
              <FiUser className="text-primary-600 dark:text-primary-400" size={32} />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FiUpload className="mr-2" size={16} />
            {profile?.resumeUrl ? 'Update Resume' : 'Upload Resume'}
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Information</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <FiMail className="text-gray-400 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-gray-900 dark:text-gray-100">{profile?.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FiPhone className="text-gray-400 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p className="text-gray-900 dark:text-gray-100">{profile?.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resume</h3>
        </div>
        <div className="p-6">
          {profile?.resumeUrl ? (
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <FiFileText className="text-green-600 dark:text-green-400 mr-3" size={24} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Resume Uploaded</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your resume has been uploaded and is being processed</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                <FiEdit2 size={20} />
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <FiFileText className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No Resume Uploaded</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">
                Upload your resume to apply for jobs
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Upload Resume
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      {profile?.skills && profile.skills.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Skills</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Experience */}
      {profile?.experience && profile.experience.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Experience</h3>
          </div>
          <div className="p-6 space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-primary-500 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{exp.title || exp}</h4>
                {exp.company && <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>}
                {exp.duration && <p className="text-sm text-gray-500 dark:text-gray-500">{exp.duration}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {profile?.education && profile.education.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Education</h3>
          </div>
          <div className="p-6 space-y-4">
            {profile.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{edu.degree || edu}</h4>
                {edu.institution && <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>}
                {edu.year && <p className="text-sm text-gray-500 dark:text-gray-500">{edu.year}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applied Job */}
      {profile?.appliedFor && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Applied Position</h3>
          </div>
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{profile.appliedFor.title}</h4>
            <p className="text-gray-600 dark:text-gray-400">
              {profile.appliedFor.department} • {profile.appliedFor.location}
            </p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
              profile.appliedFor.status === 'Open'
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}>
              {profile.appliedFor.status}
            </span>
          </div>
        </div>
      )}

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
                id="profile-resume-upload"
              />
              <label htmlFor="profile-resume-upload" className="cursor-pointer">
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

export default ApplicantProfile;
