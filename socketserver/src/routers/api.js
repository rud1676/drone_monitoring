import express from 'express';

import devHealth from '../controller/api';
import area from '../controller/area';
import weather from '../controller/weather';

const router = express.Router({ mergeParams: true });

router.get('/health', devHealth);
router.get('/area', area);
router.get('/weather', weather);

module.exports = router;
