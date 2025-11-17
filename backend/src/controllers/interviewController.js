const Interview = require('../models/Interview');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const { sendInterviewInvite } = require('../services/emailService');

exports.getAllInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find()
      .populate('candidate', 'firstName lastName email')
      .populate('job', 'title department')
      .sort({ scheduledDate: 1 });

    res.status(200).json({ status: 'success', results: interviews.length, data: { interviews } });
  } catch (error) {
    next(error);
  }
};

exports.getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidate')
      .populate('job');

    if (!interview) {
      return res.status(404).json({ status: 'error', message: 'Interview not found' });
    }

    res.status(200).json({ status: 'success', data: { interview } });
  } catch (error) {
    next(error);
  }
};

exports.scheduleInterview = async (req, res, next) => {
  try {
    // Create the interview
    const interview = await Interview.create(req.body);

    // Populate the interview with candidate and job details
    await interview.populate('candidate job');

    // Update candidate status
    await Candidate.findByIdAndUpdate(req.body.candidate, {
      status: 'Interview Scheduled'
    });

    // Send interview invitation email
    try {
      const interviewDate = new Date(interview.scheduledDate);
      const interviewDetails = {
        date: interviewDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: interviewDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        }),
        duration: interview.duration || 60,
        type: interview.type || 'Video',
        meetingLink: interview.meetingLink,
        location: interview.location,
        interviewers: interview.interviewers && interview.interviewers.length > 0
          ? interview.interviewers.map(i => i.name).join(', ')
          : null
      };

      await sendInterviewInvite(
        interview.candidate.email,
        `${interview.candidate.firstName} ${interview.candidate.lastName}`,
        interview.job.title,
        interviewDetails
      );

      console.log(`✅ Interview invitation sent to ${interview.candidate.email}`);
    } catch (emailError) {
      console.error('⚠️ Failed to send interview email:', emailError.message);
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({
      status: 'success',
      message: 'Interview scheduled successfully and invitation sent',
      data: { interview }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!interview) {
      return res.status(404).json({ status: 'error', message: 'Interview not found' });
    }

    res.status(200).json({ status: 'success', data: { interview } });
  } catch (error) {
    next(error);
  }
};

exports.cancelInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ status: 'error', message: 'Interview not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Interview cancelled successfully',
      data: { interview }
    });
  } catch (error) {
    next(error);
  }
};

exports.addFeedback = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ status: 'error', message: 'Interview not found' });
    }

    interview.feedback = req.body;
    interview.status = 'Completed';
    await interview.save();

    // Update candidate status
    await Candidate.findByIdAndUpdate(interview.candidate, { status: 'Interviewed' });

    res.status(200).json({
      status: 'success',
      message: 'Feedback added successfully',
      data: { interview }
    });
  } catch (error) {
    next(error);
  }
};
