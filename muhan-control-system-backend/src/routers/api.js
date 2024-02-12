import express from 'express';
import { devHealth } from '../controllers/api';
// import asyncHandler from 'express-async-handler';

const router = express.Router({ mergeParams: true });

router.get('/health', devHealth);

module.exports = router;
