import express from 'express';

import devHealth from '../controller/api';

const router = express.Router({ mergeParams: true });

router.get('/health', devHealth);

module.exports = router;
