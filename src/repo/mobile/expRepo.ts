import { execProc, ParamUtil } from '~/utils/dbUtils';
import { IMExpListParams } from '~/entity/routes/mobile';

/** 모바일 체험 리스트 */
export const getExpList = async (params: IMExpListParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO)
    .addInputParams('NAME', params.NAME)
    .addInputParams('CATEG1', params.CATEG1)
    .addInputParams('CATEG2', params.CATEG2)
    .addInputParams('TITLE', params.TITLE)
    .addInputParams('PAGE_NO', params.PAGE_NO)
    .addInputParams('PAGE_SIZE', params.PAGE_SIZE).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_M_EXP_LIST', dbParams);

  // result
  return execRes.rows!;
};

/** 모바일 체험 상세 정보, 리뷰 정보(TOP 3개) */
export const getExpDetail = async (EXP_SEQ_NO: number) => {
  // 파라메터
  const dbParams = new ParamUtil().addInputParams('EXP_SEQ_NO', EXP_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_M_EXP_DETAIL', dbParams);

  // result
  return execRes.rows!;
};
