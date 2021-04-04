import { Router } from 'express';
import Joi from 'joi';
import { validateReq as vReq } from '~/utils/validateReq';
import { errResult } from '~/utils/errUtils';
import { getExpList, setExpSave, setExpDelete } from '~/repo/admin';
import { IResBase } from '~/entity/routes/common';
import { IAForestInfoParams, IAExpSaveParams, IAExpDeleteParams } from '~/entity/routes/admin';
import { setMakeIUDResult } from '~/utils/routerUtils';
import _ from 'lodash';

/** 라우터 */
const router = Router();

/** 체험 리스트 (with 체험에 해당하는 이미지리스트) */
router.get<any, any, any, IAForestInfoParams>(
  '/getExpList',
  vReq({
    FOREST_SEQ_NO: Joi.number().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      //  db call
      const dbResult = await getExpList(params);

      const expList = dbResult?.length > 0 ? dbResult[0] : undefined;
      const imgList = dbResult?.length > 1 ? dbResult[1] : undefined;

      // 각 체험에 맞는 이미지들로 결과 나오게 convert
      const LIST = _.map(expList, (val) => ({
        ...val,
        IMG_LIST: [..._.filter(imgList, { REF_SEQ_NO: val.EXP_SEQ_NO })]
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

/** 체험 정보 INSERT/UPDATE */
router.post<any, any, IAExpSaveParams, any>(
  '/setExpSave',
  vReq(
    {
      FOREST_SEQ_NO: Joi.number().required(),
      EXP_SEQ_NO: Joi.number().optional().allow(0),
      NAME: Joi.string().required(),
      CATEG1: Joi.string().required(),
      CATEG2: Joi.string().required(),
      TITLE: Joi.string().required(),
      DESCRIPT: Joi.string().optional().allow(null, ''),
      MAP_X: Joi.number().optional().allow(0),
      MAP_Y: Joi.number().optional().allow(0),
      MAIN_YN: Joi.string().required(),
      XML_FILE_DATA: Joi.string().optional()
    },
    'POST'
  ),
  async (req, res) => {
    try {
      const userSeqNo = req.session!.userSeqNo;
      const userGubun = req.session!.userGubun;

      // result init
      let result: IResBase & { RET_EXP_SEQ_NO?: number } = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상',
        RET_EXP_SEQ_NO: undefined
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
        const dbResult = await setExpSave(params);

        // result
        result = {
          ...setMakeIUDResult(dbResult),
          RET_EXP_SEQ_NO: dbResult.RET_EXP_SEQ_NO
        };
      }

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 체험 정보 DELETE */
router.get<any, any, IAExpDeleteParams, any>(
  '/setExpDelete',
  vReq({
    EXP_SEQ_NO: Joi.number().required()
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
        const dbResult = await setExpDelete(params);

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
