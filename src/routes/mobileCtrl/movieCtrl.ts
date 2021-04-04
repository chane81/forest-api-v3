import { Router } from 'express';
import { errResult } from '~/utils/errUtils';
import { getTotalCount } from '~/utils/dbUtils';
import { validateReq as vReq } from '~/utils/validateReq';
import { setRemoveTotalCount } from '~/utils/routerUtils';
import { getMovieInfo } from '~/src/repo/mobile';

import Joi from 'joi';

/** 라우터 */
const router = Router();

/** 동영상 정보 */
router.get(
  '/getMovieInfo',
  vReq({
    FOREST_SEQ_NO: Joi.number().required(),
    CATEG1: Joi.string().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      // db call
      const dbResult = await getMovieInfo(params);

      const movieList = dbResult?.length > 0 ? dbResult[0] : undefined;
      const movieInfo = movieList ? movieList[0] : undefined;
      const xyList = dbResult?.length > 1 ? dbResult[1] : undefined;

      // result
      const result = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상',
        MOVIE_INFO_COUNT: getTotalCount(movieList),
        MOVIE_URL: movieInfo?.URL,
        MOVIE_CATEG_NAME: movieInfo?.CATEG_NAME,
        XY_LIST_COUNT: getTotalCount(xyList),
        XY_LIST: setRemoveTotalCount(xyList, 'TOTAL_COUNT')
      };

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

export default router;
