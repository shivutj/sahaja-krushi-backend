const express = require ('express')

const v1Routes = require('./V1')

const router = express.Router();

router.use('/V1',v1Routes);


module.exports = router