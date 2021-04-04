import { Router } from 'express';
import { errResult } from '~/utils/errUtils';
import { validateReq as vReq } from '~/utils/validateReq';
import { setMakeIUDResult, setMakeListResult } from '~/utils/routerUtils';
import { getSurveySeqNo, setSurveyAnswerSave } from '~/src/repo/mobile';
import { IMSureySeqNoParams, IMSurveySaveParams } from '~/entity/routes/mobile';
import Joi from 'joi';

/** 라우터 */
const router = Router();

/** 설문 번호 가져오기 */
router.get<any, any, any, IMSureySeqNoParams>(
  '/getSurveySeqNo',
  vReq({
    FOREST_SEQ_NO: Joi.number().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      // db call
      const dbResult = await getSurveySeqNo(params);

      // result
      const result = setMakeListResult(dbResult);

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

/** 설문 응답 정보 INSERT/UPDATE */
router.get<any, any, any, IMSurveySaveParams>(
  '/setSurveyAnswerSave',
  vReq({
    SURVEY_SEQ_NO: Joi.number().required(),
    QUESTION_NO: Joi.number().required(),
    ANSWER: Joi.string().required(),
    USER_SEQ_NO: Joi.number().required()
  }),
  async (req, res) => {
    try {
      const params = req.query;

      // db call
      const dbResult = await setSurveyAnswerSave(params);

      // result
      const result = setMakeIUDResult(dbResult);

      res.json(result);
    } catch (err) {
      errResult(res, err);
    }
  }
);

export default router;
