import { execProc, ParamUtil } from '~/utils/dbUtils';
import { IAExpSaveParams, IAForestInfoParams, IAExpDeleteParams } from '~/entity/routes/admin';
import { IDbOutResult } from '~/entity/db';

// 체험 리스트 (체험정보 수정 및 저장 페이지용, 휴양림에 속해있는 체험들 리스트 모두 나옴)
export const getExpList = async (params: IAForestInfoParams) => {
  // 파라메터
  const dbParams = new ParamUtil().addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_A_EXP_LIST', dbParams);

  return execRes.rows!;
};

/**
 * 체험 정보 INSERT/UPDATE
 */
export const setExpSave = async (params: IAExpSaveParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG')
    .addOutputParams('RET_EXP_SEQ_NO')
    .addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO)
    .addInputParams('EXP_SEQ_NO', params.EXP_SEQ_NO)
    .addInputParams('NAME', params.NAME)
    .addInputParams('CATEG1', params.CATEG1)
    .addInputParams('CATEG2', params.CATEG2)
    .addInputParams('TITLE', params.TITLE)
    .addInputParams('DESCRIPT', params.DESCRIPT)
    .addInputParams('MAP_X', params.MAP_X)
    .addInputParams('MAP_Y', params.MAP_Y)
    .addInputParams('MAIN_YN', params.MAIN_YN)
    .addInputParams('XML_FILE_DATA', params.XML_FILE_DATA)
    .addInputParams('SAVE_USER_SEQ_NO', params.SAVE_USER_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult & { RET_EXP_SEQ_NO: number }>(
    'DBO.PROC_SET_A_EXP_SAVE',
    dbParams
  );

  // 결과
  return execRes.outParams!;
};

/**
 * 체험 정보 DELETE
 */
export const setExpDelete = async (params: IAExpDeleteParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG')
    .addInputParams('EXP_SEQ_NO', params.EXP_SEQ_NO)
    .addInputParams('SAVE_USER_SEQ_NO', params.SAVE_USER_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult>('DBO.PROC_SET_A_EXP_DELETE', dbParams);

  // 결과
  return execRes.outParams!;
};
