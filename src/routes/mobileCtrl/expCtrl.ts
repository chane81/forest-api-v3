import { Router } from 'express';
import { errResult } from '~/utils/errUtils';
import { getTotalCount } from '~/utils/dbUtils';
import { validateReq as vReq } from '~/utils/validateReq';
import { setMakeListResult, setRemoveTotalCount } from '~/utils/routerUtils';
import { getExpList, getExpDetail } from '~/src/repo/mobile';
import { IMExpListParams } from '~/entity/routes/mobile';

import Joi from 'joi';

/** 라우터 */
const router = Router();

/** 체험 리스트 */
router.get<any, any, any, IMExpListParams>(
  '/getExpList',
  vReq({
    FOREST_SEQ_NO: Joi.number().optional(),
    NAME: Joi.string().optional(),
    CATEG1: Joi.string().optional(),
    CATEG2: Joi.string().optional(),
    TITLE: Joi.string().optional(),
    PAGE_NO: Joi.number().optional(),
    PAGE_SIZE: Joi.number().optional()
  }),
  async (req, res) => {
    try {
      const params = req.query;
      params.PAGE_NO = params.PAGE_NO ?? 1;
      params.PAGE_SIZE = params.PAGE_SIZE ?? 0;

      // db call
      const dbResult = await getExpList(params);

      // result
      const result = setMakeListResult(dbResult);

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 체험 상세 정보 */
router.get(
  '/getExpDetail',
  vReq({
    EXP_SEQ_NO: Joi.number().required()
  }),
  async (req, res) => {
    try {
      const expSeqNo = Number(req.query.EXP_SEQ_NO);

      // db call
      const dbResult = await getExpDetail(expSeqNo);

      const expDetailList = dbResult?.length > 0 ? dbResult[0] : undefined;
      const expDetail = expDetailList ? expDetailList[0] : undefined;
      const reviewList = dbResult?.length > 1 ? dbResult[1] : undefined;

      // result
      const result = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상',
        EXP_DETAIL_COUNT: getTotalCount(expDetailList),
        REVIEW_COUNT: getTotalCount(reviewList),
        EXP_NAME: expDetail?.NAME,
        EXP_TITLE: expDetail?.TITLE,
        EXP_DESCRIPT: expDetail?.DESCRIPT,
        REVIEW_LIST: setRemoveTotalCount(reviewList, 'TOTAL_COUNT')
      };

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

export default router;
