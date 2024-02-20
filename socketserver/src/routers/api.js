import express from 'express';
import devHealth from '../controller/api';
import area from '../controller/area';
import test from '../controller/test';
import weather from '../controller/weather';

const router = express.Router({ mergeParams: true });

router.get('/area', area);
router.get('/test', test);
router.get('/health', devHealth);
router.get('/weather', weather);

module.exports = router;
