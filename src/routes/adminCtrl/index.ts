import { Router } from 'express';
import commonCtrl from './commonCtrl';
import uploadCtrl from './uploadCtrl';
import forestCtrl from './forestCtrl';
import movieCtrl from './movieCtrl';
import expCtrl from './expCtrl';
import boardCtrl from './boardCtrl';

const router = Router();

// 라우터
router.use([commonCtrl, uploadCtrl, forestCtrl, movieCtrl, expCtrl, boardCtrl]);

export default router;
