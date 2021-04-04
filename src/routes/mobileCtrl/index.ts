import { Router } from 'express';
import mainCtrl from './mainCtrl';
import forestCtrl from './forestCtrl';
import commonCtrl from './commonCtrl';
import expCtrl from './expCtrl';
import movieCtrl from './movieCtrl';
import reviewCtrl from './reviewCtrl';
import surveyCtrl from './surveyCtrl';
import notiCtrl from './notiCtrl';

const router = Router();

// auth 라우터
router.use([
  mainCtrl,
  forestCtrl,
  commonCtrl,
  expCtrl,
  movieCtrl,
  reviewCtrl,
  surveyCtrl,
  notiCtrl
]);

export default router;
