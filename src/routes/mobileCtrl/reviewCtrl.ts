import { Router } from 'express';
import { errResult } from '~/utils/errUtils';
import { validateReq as vReq } from '~/utils/validateReq';
import { setMakeIUDResult, setMakeListResult } from '~/utils/routerUtils';
import { getReviewList, setReviewInsert } from '~/src/repo/mobile';
import { IMReviewListParams, IMReviewInsertParams } from '~/entity/routes/mobile';

import Joi from 'joi';

/** 라우터 */
const router = Router();

/** 리뷰 리스트 */
router.get<any, any, any, IMReviewListParams>(
  '/getReviewList',
  vReq({
    PHONE_NO: Joi.string().optional(),
    FOREST_SEQ_NO: Joi.number().optional(),
    EXP_SEQ_NO: Joi.number().optional(),
    PAGE_NO: Joi.number().optional(),
    PAGE_SIZE: Joi.number().optional()
  }),
  async (req, res) => {
    try {
      const params = req.query;
      params.PAGE_NO = params.PAGE_NO ?? 1;
      params.PAGE_SIZE = params.PAGE_SIZE ?? 0;

      // db call
      const dbResult = await getReviewList(params);

      // result
      const result = setMakeListResult(dbResult);

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 리뷰 등록 */
router.get<any, any, any, IMReviewInsertParams>(
  '/setReviewInsert',
  vReq({
    EXP_SEQ_NO: Joi.number().required(),
    PHONE_NO: Joi.string().required(),
    SCORE: Joi.number().required(),
    REVIEW_TEXT: Joi.string().optional()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      // db call
      const dbResult = await setReviewInsert(params);

      // result
      const result = setMakeIUDResult(dbResult);

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

export default router;
