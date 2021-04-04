import { execProc, ParamUtil } from '~/utils/dbUtils';
import { IAForestInfoParams, IAMovieDeleteParams, IAMovieSaveParams } from '~/entity/routes/admin';
import { IDbOutResult } from '~/entity/db';

// 동영상 리스트
export const getMovieList = async (params: IAForestInfoParams) => {
  // 파라메터
  const dbParams = new ParamUtil().addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_A_MOVIE_LIST', dbParams);

  return execRes.rows!;
};

/**
 * 동영상 정보 INSERT/UPDATE
 */
export const setMovieSave = async (params: IAMovieSaveParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG')
    .addOutputParams('RET_MOVIE_SEQ_NO')
    .addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO)
    .addInputParams('MOVIE_SEQ_NO', params.MOVIE_SEQ_NO)
    .addInputParams('CATEG1', params.CATEG1)
    .addInputParams('URL', params.URL)
    .addInputParams('XML_DETAIL_DATA', params.XML_DETAIL_DATA)
    .addInputParams('SAVE_USER_SEQ_NO', params.SAVE_USER_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult & { RET_MOVIE_SEQ_NO: number }>(
    'DBO.PROC_SET_A_MOVIE_SAVE',
    dbParams
  );

  // 결과
  return execRes.outParams!;
};

/**
 * 동영상 정보 DELETE
 */
export const setMovieDelete = async (params: IAMovieDeleteParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG')
    .addInputParams('MOVIE_SEQ_NO', params.MOVIE_SEQ_NO)
    .addInputParams('SAVE_USER_SEQ_NO', params.SAVE_USER_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult>('DBO.PROC_SET_A_MOVIE_DELETE', dbParams);

  // 결과
  return execRes.outParams!;
};
