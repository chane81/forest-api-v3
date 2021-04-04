import { execProc, ParamUtil } from '~/utils/dbUtils';
import { ICPagingParams } from '~/entity/routes/common';
import { IMNotiDetailParams } from '~/entity/routes/mobile';

// 공지 글 리스트
export const getNotiList = async (params: ICPagingParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('PAGE_NO', params.PAGE_NO)
    .addInputParams('PAGE_SIZE', params.PAGE_SIZE).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_M_NOTI_LIST', dbParams);

  // result
  return execRes.rows!;
};

// 공지 글 상세 상세
export const getNotiDetail = async (params: IMNotiDetailParams) => {
  // 파라메터
  const dbParams = new ParamUtil().addInputParams('BOARD_SEQ_NO', params.BOARD_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_M_NOTI_DETAIL', dbParams);

  // result
  return execRes.rows!;
};
