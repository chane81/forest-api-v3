import { Router } from 'express';
import Joi from 'joi';
import { validateReq as vReq } from '~/utils/validateReq';
import { errResult } from '~/utils/errUtils';
import { getMovieList, setMovieDelete, setMovieSave } from '~/repo/admin';
import { IResBase } from '~/entity/routes/common';
import { IAForestInfoParams, IAMovieDeleteParams, IAMovieSaveParams } from '~/entity/routes/admin';
import { setMakeIUDResult } from '~/utils/routerUtils';
import _ from 'lodash';

/** 라우터 */
const router = Router();

/** 동영상 리스트 */
router.get<any, any, any, IAForestInfoParams>(
  '/getMovieList',
  vReq({
    FOREST_SEQ_NO: Joi.number().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      //  db call
      const dbResult = await getMovieList(params);

      const movieList = dbResult?.length > 0 ? dbResult[0] : undefined;
      const movieDetailList = dbResult?.length > 1 ? dbResult[1] : undefined;

      // 각 체험에 맞는 이미지들로 결과 나오게 convert
      const LIST = _.map(movieList, (val) => ({
        ...val,
        MOVIE_DETAIL_LIST: [..._.filter(movieDetailList, { MOVIE_SEQ_NO: val.MOVIE_SEQ_NO })]
      }));

      // result
      const result = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상',
        LIST
      };

      // result
      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 동영상 정보 INSERT/UPDATE */
router.post<any, any, IAMovieSaveParams, any>(
  '/setMovieSave',
  vReq(
    {
      FOREST_SEQ_NO: Joi.number().required(),
      MOVIE_SEQ_NO: Joi.number().optional().allow(0),
      CATEG1: Joi.string().required(),
      URL: Joi.string().required(),
      XML_DETAIL_DATA: Joi.string().optional()
    },
    'POST'
  ),
  async (req, res) => {
    try {
      const userSeqNo = req.session!.userSeqNo;
      const userGubun = req.session!.userGubun;

      // result init
      let result: IResBase & { RET_MOVIE_SEQ_NO?: number } = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상',
        RET_MOVIE_SEQ_NO: undefined
      };

      // 어드민 권한 체크
      if (!userSeqNo || userGubun !== 'A') {
        result = {
          RESULT: false,
          RESULT_CODE: '71',
          RESULT_MSG: '권한이 없습니다.'
        };
      } else {
        const params = req.body;
        params.SAVE_USER_SEQ_NO = parseInt(userSeqNo, 10);

        // db call
        const dbResult = await setMovieSave(params);

        // result
        result = {
          ...setMakeIUDResult(dbResult),
          RET_MOVIE_SEQ_NO: dbResult.RET_MOVIE_SEQ_NO
        };
      }

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 동영상 정보 DELETE */
router.get<any, any, IAMovieDeleteParams, any>(
  '/setMovieDelete',
  vReq({
    MOVIE_SEQ_NO: Joi.number().required()
  }),
  async (req, res) => {
    try {
      const userSeqNo = req.session!.userSeqNo;
      const userGubun = req.session!.userGubun;

      // result init
      let result: IResBase = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상'
      };

      // 어드민 권한 체크
      if (!userSeqNo || userGubun !== 'A') {
        result = {
          RESULT: false,
          RESULT_CODE: '71',
          RESULT_MSG: '권한이 없습니다.'
        };
      } else {
        const params = req.query;
        params.SAVE_USER_SEQ_NO = parseInt(userSeqNo, 10);

        // db call
        const dbResult = await setMovieDelete(params);

        // result
        result = setMakeIUDResult(dbResult);
      }

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

export default router;
