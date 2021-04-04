import { IDbOutResult } from '~/entity/db';
import { execProc, ParamUtil } from '~/utils/dbUtils';
import { IMSureySeqNoParams, IMSurveySaveParams } from '~/entity/routes/mobile';

/** 설문 번호 가져오기 */
export const getSurveySeqNo = async (params: IMSureySeqNoParams) => {
  // 파라메터
  const dbParams = new ParamUtil().addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_M_SURVEY_SEQ_NO', dbParams);

  // result
  return execRes.rows!;
};

/**
 * 설문 응답 정보 INSERT/UPDATE
 */
export const setSurveyAnswerSave = async (params: IMSurveySaveParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG')
    .addInputParams('SURVEY_SEQ_NO', params.SURVEY_SEQ_NO)
    .addInputParams('QUESTION_NO', params.QUESTION_NO)
    .addInputParams('ANSWER', params.ANSWER)
    .addInputParams('USER_SEQ_NO', params.USER_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult>('DBO.PROC_SET_M_SURVEY_ANSWER_SAVE', dbParams);

  // 결과
  return execRes.outParams!;
};
