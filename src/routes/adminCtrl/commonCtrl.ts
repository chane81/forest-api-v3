import { Router } from 'express';
import Joi from 'joi';
import { validateReq as vReq } from '~/utils/validateReq';
import { errResult } from '~/utils/errUtils';
import { sessionDestory } from '~/utils/sessionUtils';
import {
  ICLoginParams,
  ICUserParams,
  IResBase,
  IResLoginInfo,
  ICCodeParams
} from '~/entity/routes/common';
import { getLoginCheck, setUserRegist, getCodeList } from '~/repo/common';
import { setMakeIUDResult, setMakeListResult } from '~/utils/routerUtils';

/** 라우터 */
const router = Router();

/** 로그인 */
router.get<any, any, any, ICLoginParams>(
  '/setLogin',
  vReq({
    PWD: Joi.string().required(),
    EMAIL: Joi.string().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;
      params.GUBUN = 'A';

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
          req.session!.connectPath = 'admin';

          result = {
            ...result,
            ...loginInfo
          };
        }
      }

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 세션 유지 API (세션연결 유지를 위한 API, 아무 API 호출하여도 세션 ROLLING 은 된다.)
 *  프론트 엔드 Next.js 에서 서버사이드 API 호출만 있는경우 세션 maxAge 가 갱신되지 않는다.
 *  클라이언트 사이드에서 API 호출시에는 세션 maxAge 가 갱신이 된다.
 *  프론트엔드에서 서버사이드에서의 api 호출만 있는 페이지의 경우 아래 api를 호출하여 세션 유지를 하게 함
 */
router.get('/setSessionPersist', (req, res) => {
  res.sendStatus(200);
});

/** 로그인 세션 체크 */
router.get<any, any, any, ICLoginParams>('/getSessionCheck', async (req, res) => {
  try {
    let result: IResLoginInfo = {
      RESULT: true,
      RESULT_CODE: '00',
      RESULT_MSG: '정상'
    };

    if (!req.session || !req.session.userSeqNo) {
      result = {
        RESULT: false,
        RESULT_CODE: '99',
        RESULT_MSG: 'session not found'
      };
    } else {
      result = {
        ...result,
        USER_SEQ_NO: req.session.userSeqNo,
        NAME: req.session.userName,
        EMAIL: req.session.userEmail,
        PHONE_NO: req.session.userPhoneNo,
        GUBUN: req.session.userGubun
      };
    }

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
      const userSeqNo = req.session!.userSeqNo;
      const params = req.query;
      params.GUBUN = 'A';
      params.SAVE_USER_SEQ_NO = userSeqNo ?? 1;

      // db call
      const dbResult = await setUserRegist(params);

      // result
      const result = setMakeIUDResult(dbResult);

      res.json(result);
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
