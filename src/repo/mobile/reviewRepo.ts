import { IDbOutResult } from '~/entity/db';
import { execProc, ParamUtil } from '~/utils/dbUtils';
import { IMReviewListParams, IMReviewInsertParams } from '~/entity/routes/mobile';

/** 모바일 리뷰 리스트 */
export const getReviewList = async (params: IMReviewListParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('PAGE_NO', 1)
    .addInputParams('PAGE_SIZE', 0)
    .addInputParams('PHONE_NO', params.PHONE_NO)
    .addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO)
    .addInputParams('EXP_SEQ_NO', params.EXP_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_M_REVIEW_LIST', dbParams);

  // result
  return execRes.rows!;
};

/**
 * 리뷰 정보 INSERT
 */
export const setReviewInsert = async (params: IMReviewInsertParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('EXP_SEQ_NO', params.EXP_SEQ_NO)
    .addInputParams('PHONE_NO', params.PHONE_NO)
    .addInputParams('SCORE', params.SCORE)
    .addInputParams('REVIEW_TEXT', params.REVIEW_TEXT)
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG').params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult>('DBO.PROC_SET_M_REVIEW_INSERT', dbParams);

  // 결과
  return execRes.outParams!;
};
