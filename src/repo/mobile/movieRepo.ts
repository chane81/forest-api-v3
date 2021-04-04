import { execProc, ParamUtil } from '~/utils/dbUtils';
import { IMMovieInfoParams } from '~/entity/routes/mobile';

/** 모바일 동영상 정보, 좌표 정보 */
export const getMovieInfo = async (params: IMMovieInfoParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('FOREST_SEQ_NO', params.FOREST_SEQ_NO)
    .addInputParams('CATEG1', params.CATEG1).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_M_MOVIE_INFO', dbParams);

  // result
  return execRes.rows!;
};
