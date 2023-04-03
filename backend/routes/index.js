import express from "express";
import taskRoutes from './tasks.js';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import checkAuth from "../utils/checkAuth.js";


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks',checkAuth,  taskRoutes);
router.use('/users', checkAuth, userRoutes);


export default router;