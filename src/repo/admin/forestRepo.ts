import { execProc, ParamUtil } from '~/utils/dbUtils';
import {
  IAForestListParams,
  IAForestSaveParams,
  IAForestDelParams,
  IAForestInfoParams
} from '~/entity/routes/admin';
import { IDbOutResult } from '~/entity/db';

// 어드민 휴양림 리스트
export const getForestList = async (params: IAForestListParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('NAME', params.NAME)
    .addInputParams('CATEG1', params.CATEG1)
    .addInputParams('CATEG2', params.CATEG2)
    .addInputParams('MAIN_YN', params.MAIN_YN)
    .addInputParams('PAGE_NO', params.PAGE_NO)
    .addInputParams('PAGE_SIZE', params.PAGE_SIZE).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_A_FOREST_LIST', dbParams);

  return execRes.rows!;
};

/**
 * 휴양림 정보 INSERT/UPDATE
 */
export const setForestSave = async (params: IAForestSaveParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG')
    .addOutputParams('RET_FOREST_SEQ_NO')
    .addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO)
    .addInputParams('NAME', params.NAME)
    .addInputParams('ADDR1', params.ADDR1)
    .addInputParams('ADDR2', params.ADDR2)
    .addInputParams('BUSSINESS_NUMBER', params.BUSSINESS_NUMBER)
    .addInputParams('DESCRIPT', params.DESCRIPT)
    .addInputParams('SIMPLE_DESCRIPT', params.SIMPLE_DESCRIPT)
    .addInputParams('MAIN_YN', params.MAIN_YN)
    .addInputParams('MAP_IMG_URL', params.MAP_IMG_URL)
    .addInputParams('TEL_NO', params.TEL_NO)
    .addInputParams('XML_FILE_DATA', params.XML_FILE_DATA)
    .addInputParams('SAVE_USER_SEQ_NO', params.SAVE_USER_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult & { RET_FOREST_SEQ_NO: number }>(
    'DBO.PROC_SET_A_FOREST_SAVE',
    dbParams
  );

  // 결과
  return execRes.outParams!;
};

/**
 * 휴양림 정보 삭제
 */
export const setForestDelete = async (params: IAForestDelParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO)
    .addInputParams('SAVE_USER_SEQ_NO', params.SAVE_USER_SEQ_NO)
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG').params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult>('DBO.PROC_SET_A_FOREST_DELETE', dbParams);

  // 결과
  return execRes.outParams!;
};

/** 휴양림 정보 */
export const getForestInfo = async (params: IAForestInfoParams) => {
  // 파라메터
  const dbParams = new ParamUtil().addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_A_FOREST_INFO', dbParams);

  // result
  return execRes.rows!;
};
