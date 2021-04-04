import { Router } from 'express';
import Joi from 'joi';
import { validateReq as vReq } from '~/utils/validateReq';
import { errResult } from '~/utils/errUtils';
import { IResBase } from '~/entity/routes/common';
import { getBoardList, setBoardSave, setBoardDelete, getBoardDetail } from '~/repo/admin';
import {
  IABoardListParams,
  IABoardSaveParams,
  IABoardDeleteParams,
  IABoardDetailParams
} from '~/entity/routes/admin';
import { setMakeIUDResult, setMakeListResult } from '~/utils/routerUtils';

/** 라우터 */
const router = Router();

/** 보드 리스트 */
router.get<any, any, any, IABoardListParams>(
  '/getBoardList',
  vReq({
    CATEG: Joi.string().required(),
    PAGE_NO: Joi.number().optional().allow(1),
    PAGE_SIZE: Joi.number().optional().allow(0)
  }),
  async (req, res) => {
    try {
      const params = req.query;
      params.PAGE_NO = params.PAGE_NO ?? 1;
      params.PAGE_SIZE = params.PAGE_SIZE ?? 0;

      //  db call
      const dbResult = await getBoardList(params);

      // result
      const result = setMakeListResult(dbResult);

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 보드 상세 */
router.get<any, any, any, IABoardDetailParams>(
  '/getBoardDetail',
  vReq({
    BOARD_SEQ_NO: Joi.number().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      //  db call
      const dbResult = await getBoardDetail(params);
      const boardResult = dbResult?.length > 0 ? dbResult[0] : undefined;

      // result
      const result = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상',
        ...boardResult
      };

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 보드 정보 삭제*/
router.get<any, any, any, IABoardDeleteParams>(
  '/setBoardDelete',
  vReq({
    BOARD_SEQ_NO: Joi.number().required()
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

      // 어드민이 권한 체크
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
        const dbResult = await setBoardDelete(params);

        // result
        result = setMakeIUDResult(dbResult);
      }

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 휴양림 정보 INSERT/UPDATE */
router.post<any, any, IABoardSaveParams, any>(
  '/setBoardSave',
  vReq(
    {
      BOARD_SEQ_NO: Joi.number().optional().allow(0),
      TITLE: Joi.string().required(),
      CONTENTS: Joi.string().required(),
      CATEG: Joi.string().required(),
      URL_1: Joi.string().optional().allow(null, ''),
      URL_2: Joi.string().optional().allow(null, ''),
      URL_3: Joi.string().optional().allow(null, ''),
      USE_YN: Joi.string().required()
    },
    'POST'
  ),
  async (req, res) => {
    try {
      const userSeqNo = req.session!.userSeqNo;
      const userGubun = req.session!.userGubun;

      // result init
      let result: IResBase & { RET_BOARD_SEQ_NO?: number } = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상',
        RET_BOARD_SEQ_NO: undefined
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
        const dbResult = await setBoardSave(params);

        // result
        result = {
          ...setMakeIUDResult(dbResult),
          RET_BOARD_SEQ_NO: dbResult.RET_BOARD_SEQ_NO
        };
      }

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

export default router;
