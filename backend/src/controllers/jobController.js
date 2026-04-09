const Job = require('../models/Job');

exports.getAllJobs = async (req, res, next) => {
  try {
    const { status = 'Open', page = 1, limit = 10 } = req.query;

    // Filter by admin who posted them
    const query = { postedBy: req.user.id };
    if (status) query.status = status;
    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort({ postedDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: jobs.length,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
      data: { jobs }
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user.id
    }).populate('postedBy shortlistedCandidates');
    if (!job) {
      return res.status(404).json({ status: 'error', message: 'Job not found' });
    }
    res.status(200).json({ status: 'success', data: { job } });
  } catch (error) {
    next(error);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const jobData = { ...req.body, postedBy: req.user.id };
    const job = await Job.create(jobData);
    res.status(201).json({ status: 'success', data: { job } });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      return res.status(404).json({ status: 'error', message: 'Job not found' });
    }
    res.status(200).json({ status: 'success', data: { job } });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user.id
    });
    if (!job) {
      return res.status(404).json({ status: 'error', message: 'Job not found' });
    }
    res.status(200).json({ status: 'success', message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};
