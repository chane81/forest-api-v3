import { Router } from 'express';
import Joi from 'joi';
import { validateReq as vReq } from '~/utils/validateReq';
import { errResult } from '~/utils/errUtils';
import { IResBase } from '~/entity/routes/common';
import { getForestList, setForestDelete, setForestSave, getForestInfo } from '~/repo/admin';
import {
  IAForestInfoParams,
  IAForestListParams,
  IAForestDelParams,
  IAForestSaveParams
} from '~/entity/routes/admin';
import { setMakeIUDResult, setMakeListResult } from '~/utils/routerUtils';

/** 라우터 */
const router = Router();

/** 휴양림 리스트 */
router.get<any, any, any, IAForestListParams>(
  '/getForestList',
  vReq({
    NAME: Joi.string().optional().allow(null, ''),
    CATEG1: Joi.string().optional().allow(null, ''),
    CATEG2: Joi.string().optional().allow(null, ''),
    MAIN_YN: Joi.string().optional().allow(null, ''),
    PAGE_NO: Joi.number().optional().allow(1),
    PAGE_SIZE: Joi.number().optional().allow(0)
  }),
  async (req, res) => {
    try {
      const params = req.query;
      params.PAGE_NO = params.PAGE_NO ?? 1;
      params.PAGE_SIZE = params.PAGE_SIZE ?? 0;

      //  db call
      const dbResult = await getForestList(params);

      // result
      const result = setMakeListResult(dbResult);

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 휴양림 정보 삭제*/
router.get<any, any, any, IAForestDelParams>(
  '/setForestDelete',
  vReq({
    FOREST_SEQ_NO: Joi.number().required()
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
        const dbResult = await setForestDelete(params);

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
router.post<any, any, IAForestSaveParams, any>(
  '/setForestSave',
  vReq(
    {
      FOREST_SEQ_NO: Joi.number().optional().allow(0),
      NAME: Joi.string().required(),
      ADDR1: Joi.string().required(),
      ADDR2: Joi.string().required(),
      BUSSINESS_NUMBER: Joi.string().required(),
      DESCRIPT: Joi.string().required(),
      SIMPLE_DESCRIPT: Joi.string().required(),
      MAIN_YN: Joi.string().required(),
      MAP_IMG_URL: Joi.string().optional().allow(null, ''),
      TEL_NO: Joi.string().required(),
      XML_FILE_DATA: Joi.string().optional().allow(null, '')
    },
    'POST'
  ),
  async (req, res) => {
    try {
      const userSeqNo = req.session!.userSeqNo;
      const userGubun = req.session!.userGubun;

      // result init
      let result: IResBase & { RET_FOREST_SEQ_NO?: number } = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상',
        RET_FOREST_SEQ_NO: undefined
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
        const dbResult = await setForestSave(params);

        // result
        result = {
          ...setMakeIUDResult(dbResult),
          RET_FOREST_SEQ_NO: dbResult.RET_FOREST_SEQ_NO
        };
      }

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 휴양림 정보 */
router.get<any, any, IAForestInfoParams, any>(
  '/getForestInfo',
  vReq({
    FOREST_SEQ_NO: Joi.number().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      // db call
      const dbResult = await getForestInfo(params);
      const forestResult = dbResult?.length > 0 ? dbResult[0] : undefined;
      const forestInfo = forestResult?.length > 0 ? forestResult[0] : undefined;
      const imgList = dbResult?.length > 1 && dbResult[1].length > 0 ? dbResult[1] : undefined;
      const mapImg = dbResult?.length > 2 && dbResult[2].length > 0 ? dbResult[2][0] : undefined;

      // result
      const result = {
        RESULT: true,
        RESULT_CODE: '00',
        RESULT_MSG: '정상',
        NAME: forestInfo?.NAME,
        ADDR1: forestInfo?.ADDR1,
        ADDR2: forestInfo?.ADDR2,
        BUSSINESS_NUMBER: forestInfo?.BUSSINESS_NUMBER,
        DESCRIPT: forestInfo?.DESCRIPT,
        SIMPLE_DESCRIPT: forestInfo?.SIMPLE_DESCRIPT,
        MAIN_YN: forestInfo?.MAIN_YN,
        TEL_NO: forestInfo?.TEL_NO,
        IMG_LIST: imgList,
        MAP_IMG: mapImg
      };

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

export default router;
