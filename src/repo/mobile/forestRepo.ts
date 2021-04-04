import { execProc, ParamUtil } from '~/utils/dbUtils';
import { ICPagingParams } from '~/entity/routes/common';
import { IMForestDetailParams, IMForestListParams } from '~/entity/routes/mobile';

// 모바일 휴양림 리스트
export const getForestList = async (params: IMForestListParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('PAGE_NO', params.PAGE_NO)
    .addInputParams('PAGE_SIZE', params.PAGE_SIZE)
    .addInputParams('REVIEW_YN', params.REVIEW_YN)
    .addInputParams('SURVEY_YN', params.SURVEY_YN).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_M_FOREST_LIST', dbParams);

  // result
  return execRes.rows!;
};

// 모바일 휴양림 상세
export const getForestDetail = async (params: IMForestDetailParams) => {
  // 파라메터
  const dbParams = new ParamUtil().addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_M_FOREST_DETAIL', dbParams);

  // result
  return execRes.rows!;
};
