import { Router } from 'express';
import mobileCtrl from './mobileCtrl';
import adminCtrl from './adminCtrl';

const router = Router();

// 휴양림 라우터
router.use('/m', mobileCtrl);

// 어드민 웹 라우터
router.use('/adm', adminCtrl);

export default router;
