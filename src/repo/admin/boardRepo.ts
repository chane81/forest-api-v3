import { execProc, ParamUtil } from '~/utils/dbUtils';
import {
  IABoardListParams,
  IABoardSaveParams,
  IABoardDeleteParams,
  IABoardDetailParams
} from '~/entity/routes/admin';
import { IDbOutResult } from '~/entity/db';

// 어드민 보드 리스트
export const getBoardList = async (params: IABoardListParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('PAGE_NO', params.PAGE_NO)
    .addInputParams('PAGE_SIZE', params.PAGE_SIZE)
    .addInputParams('CATEG', params.CATEG).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_A_BOARD_LIST', dbParams);

  return execRes.rows!;
};

/** 어드민 보드 상세 */
export const getBoardDetail = async (params: IABoardDetailParams) => {
  // 파라메터
  const dbParams = new ParamUtil().addInputParams('BOARD_SEQ_NO', params.BOARD_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_A_BOARD_DETAIL', dbParams);

  return execRes.rows!;
};

/**
 * 어드민 보드 INSERT/UPDATE
 */
export const setBoardSave = async (params: IABoardSaveParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG')
    .addOutputParams('RET_BOARD_SEQ_NO')
    .addInputParams('BOARD_SEQ_NO', params.BOARD_SEQ_NO)
    .addInputParams('TITLE', params.TITLE)
    .addInputParams('CONTENTS', params.CONTENTS)
    .addInputParams('CATEG', params.CATEG)
    .addInputParams('URL_1', params.URL_1)
    .addInputParams('URL_2', params.URL_2)
    .addInputParams('URL_3', params.URL_3)
    .addInputParams('USE_YN', params.USE_YN)
    .addInputParams('SAVE_USER_SEQ_NO', params.SAVE_USER_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult & { RET_BOARD_SEQ_NO: number }>(
    'DBO.PROC_SET_A_BOARD_SAVE',
    dbParams
  );

  // 결과
  return execRes.outParams!;
};

/**
 * 보드 정보 삭제
 */
export const setBoardDelete = async (params: IABoardDeleteParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('BOARD_SEQ_NO', params.BOARD_SEQ_NO)
    .addInputParams('SAVE_USER_SEQ_NO', params.SAVE_USER_SEQ_NO)
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG').params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult>('DBO.PROC_SET_A_BOARD_DELETE', dbParams);

  // 결과
  return execRes.outParams!;
};
