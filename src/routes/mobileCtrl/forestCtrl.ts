import { Router } from 'express';
import { errResult } from '~/utils/errUtils';
import { getTotalCount } from '~/utils/dbUtils';
import { validateReq as vReq } from '~/utils/validateReq';
import { setMakeListResult, setRemoveTotalCount } from '~/utils/routerUtils';
import { getForestList } from '~/src/repo/mobile';
import { IMForestDetailParams, IMForestListParams } from '~/entity/routes/mobile';
import { getForestDetail } from '~/repo/mobile/forestRepo';

import Joi from 'joi';

/** 라우터 */
const router = Router();

/** 휴양림 리스트 */
router.get<any, any, any, IMForestListParams>(
  '/getForestList',
  vReq({
    PAGE_NO: Joi.number().greater(0).required(),
    PAGE_SIZE: Joi.number().required(),
    REVIEW_YN: Joi.string().optional().allow(null, ''),
    SURVEY_YN: Joi.string().optional().allow(null, '')
  }),
  async (req, res) => {
    try {
      const params = req.query;
      params.PAGE_NO = params.PAGE_NO ?? 1;
      params.PAGE_SIZE = params.PAGE_SIZE ?? 0;

      // db call
      const dbResult = await getForestList(params);

      // result
      const result = setMakeListResult(dbResult);

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 휴양림 상세 정보 */
router.get<any, any, any, IMForestDetailParams>(
  '/getForestDetail',
  vReq({
    FOREST_SEQ_NO: Joi.number().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      // db call
      const dbResult = await getForestDetail(params);
      const forestDetail = dbResult?.length > 0 ? dbResult[0] : undefined;
      const imgList = dbResult?.length > 1 ? dbResult[1] : undefined;
      const movieList = dbResult?.length > 2 ? dbResult[2] : undefined;

      // result
      const result = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상',
        FOREST_DETAIL_COUNT: getTotalCount(forestDetail),
        IMG_LIST_COUNT: getTotalCount(imgList),
        MOVIE_LIST_COUNT: getTotalCount(movieList),
        FOREST_DETAIL: setRemoveTotalCount(forestDetail[0]),
        IMG_LIST: setRemoveTotalCount(imgList),
        MOVIE_LIST: setRemoveTotalCount(movieList)
      };

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

export default router;
