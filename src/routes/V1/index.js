const express = require ('express')
const NewsRouter=require('./news-routes')
const authRoutes = require('./auth-routes')
const farmerRoutes = require('./farmer-routes')
const queryRoutes = require('./query-routes')
const cropReportRoutes = require('./crop-report-routes')

const router = express.Router();

router.use('/news',NewsRouter);
router.use('/auth', authRoutes);
router.use('/farmers', farmerRoutes);
router.use('/queries', queryRoutes);
router.use('/crop-reports', cropReportRoutes);

module.exports = router;