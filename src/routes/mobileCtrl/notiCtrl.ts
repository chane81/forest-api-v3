import { Router } from 'express';
import { errResult } from '~/utils/errUtils';
import { getTotalCount } from '~/utils/dbUtils';
import { validateReq as vReq } from '~/utils/validateReq';
import { setMakeListResult, setRemoveTotalCount } from '~/utils/routerUtils';
import { ICPagingParams } from '~/entity/routes/common';
import { IMNotiDetailParams } from '~/entity/routes/mobile';
import { getNotiList, getNotiDetail } from '~/repo/mobile/notiRepo';

import Joi from 'joi';

/** 라우터 */
const router = Router();

/** 공지 리스트 */
router.get<any, any, any, ICPagingParams>(
  '/getNotiList',
  vReq({
    PAGE_NO: Joi.number().optional(),
    PAGE_SIZE: Joi.number().optional()
  }),
  async (req, res) => {
    try {
      const params = req.query;
      params.PAGE_NO = params.PAGE_NO ?? 1;
      params.PAGE_SIZE = params.PAGE_SIZE ?? 0;

      // db call
      const dbResult = await getNotiList(params);

      // result
      const result = setMakeListResult(dbResult);

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 공지 상세 정보 */
router.get<any, any, any, IMNotiDetailParams>(
  '/getNotiDetail',
  vReq({
    BOARD_SEQ_NO: Joi.number().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      // db call
      const dbResult = await getNotiDetail(params);
      const notiDetail = dbResult?.length > 0 ? dbResult[0] : undefined;

      // result
      const result = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상',
        TOTAL_COUNT: getTotalCount(dbResult),
        ...setRemoveTotalCount(notiDetail)
      };

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

export default router;
