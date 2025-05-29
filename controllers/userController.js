import User from '../models/userModel.js';

export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude password for security
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};
