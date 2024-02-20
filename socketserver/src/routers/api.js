import express from 'express';

import devHealth from '../controller/api';
import area from '../controller/area';

const router = express.Router({ mergeParams: true });

router.get('/health', devHealth);
router.get('/area', area);

module.exports = router;
