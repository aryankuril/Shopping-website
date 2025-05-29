import express from 'express';
import { getAllUsersController } from '../controllers/userController.js';

const router = express.Router();

// Route to get all users
router.get('/all-users', getAllUsersController);

export default router;
