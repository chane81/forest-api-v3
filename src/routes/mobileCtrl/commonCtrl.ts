import { Router } from 'express';
import { errResult } from '~/utils/errUtils';
import { sessionDestory } from '~/utils/sessionUtils';
import { validateReq as vReq } from '~/utils/validateReq';
import { setMakeListResult, setMakeIUDResult } from '~/utils/routerUtils';
import { getImageInfo, getCodeList, getLoginCheck, setUserRegist } from '~/repo/common';
import {
  ICImageInfoParams,
  ICCodeParams,
  ICUserParams,
  ICLoginParams,
  IResBase,
  IResLoginInfo
} from '~/entity/routes/common';

import Joi from 'joi';

/** 라우터 */
const router = Router();

/** 로그인 */
router.get<any, any, any, ICLoginParams>(
  '/setLogin',
  vReq({
    PWD: Joi.string().required(),
    PHONE_NO: Joi.number().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;
      params.GUBUN = 'M';

      const { outParams, rows } = await getLoginCheck(params);
      let result: IResLoginInfo = {
        RESULT: outParams!.RET_CODE === '00',
        RESULT_CODE: outParams!.RET_CODE,
        RESULT_MSG: outParams!.RET_MSG
      };

      if (outParams?.RET_CODE === '00') {
        if (rows && rows.length > 0) {
          const loginInfo = rows[0];

          req.session!.userName = loginInfo.NAME;
          req.session!.userEmail = loginInfo.EMAIL;
          req.session!.userPhoneNo = loginInfo.PHONE_NO;
          req.session!.userSeqNo = loginInfo.USER_SEQ_NO.toString();
          req.session!.userGubun = loginInfo.GUBUN;
          req.session!.connectPath = 'mobile';

          result = {
            ...result,
            ...loginInfo
          };
        }
      }

      res.json({
        ...result
      });
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 로그아웃 */
router.get('/setLogout', async (req, res) => {
  try {
    const result: IResBase = {
      RESULT: true,
      RESULT_CODE: '00',
      RESULT_MSG: '정상'
    };

    // 세션 삭제
    sessionDestory(req, res);

    res.json(result);
  } catch (err) {
    errResult(res, err);
  }
});

/** 회원 등록 */
router.get<any, any, any, ICUserParams>(
  '/setUserRegist',
  vReq({
    EMAIL: Joi.string().email().required(),
    PWD: Joi.string().required(),
    NAME: Joi.string().required(),
    PHONE_NO: Joi.string().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;
      params.GUBUN = 'G';
      params.SAVE_USER_SEQ_NO = 1;

      // db call
      const dbResult = await setUserRegist(params);

      // result
      const result = {
        ...setMakeIUDResult(dbResult),
        RET_USER_SEQ_NO: dbResult.RET_USER_SEQ_NO
      };

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 이미지 정보 */
router.get<any, any, any, ICImageInfoParams>(
  '/getImageInfo',
  vReq({
    REF_SEQ_NO: Joi.number().optional(),
    CATEG: Joi.string().optional(),
    IMG_SEQ_NO: Joi.number().optional()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      // db call
      const dbResult = await getImageInfo(params);

      // result
      const result = setMakeListResult(dbResult);

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 코드정보 리스트 */
router.get<any, any, any, ICCodeParams>(
  '/getCodeList',
  vReq({
    GROUP_CD: Joi.string().required(),
    CD: Joi.string().optional()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      // db call
      const dbResult = await getCodeList(params);

      // result
      const result = setMakeListResult(dbResult);

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

export default router;
