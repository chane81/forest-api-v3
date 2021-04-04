import { execProc, ParamUtil } from '~/utils/dbUtils';
import {
  ICUserParams,
  ICLoginParams,
  ICImageInfoParams,
  ICCodeParams
} from '~/entity/routes/common';
import { IDbOutResult } from '~/entity/db';

/**
 * 사용자정보 INSERT
 */
export const setUserRegist = async (params: ICUserParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG')
    .addOutputParams('RET_USER_SEQ_NO')
    .addInputParams('EMAIL', params.EMAIL)
    .addInputParams('PWD', params.PWD)
    .addInputParams('NAME', params.NAME)
    .addInputParams('GUBUN', params.GUBUN)
    .addInputParams('PHONE_NO', params.PHONE_NO)
    .addInputParams('SAVE_USER_SEQ_NO', params.SAVE_USER_SEQ_NO ?? 1).params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult & { RET_USER_SEQ_NO: number }>(
    'DBO.PROC_SET_USER_REGIST',
    dbParams
  );

  // 결과
  return execRes.outParams!;
};

/**
 * 로그인 체크
 */
export const getLoginCheck = async (params: ICLoginParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('GUBUN', params.GUBUN)
    .addInputParams('EMAIL', params.EMAIL)
    .addInputParams('PHONE_NO', params.PHONE_NO)
    .addInputParams('PWD', params.PWD)
    .addOutputParams('RET_CODE')
    .addOutputParams('RET_MSG').params;

  // 프로시저 콜
  const execRes = await execProc<IDbOutResult>('DBO.PROC_GET_LOGIN_CHECK', dbParams);

  // 결과
  return execRes;
};

/**
 *  이미지 정보
 * @param params
 */
export const getImageInfo = async (params: ICImageInfoParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('REF_SEQ_NO', params.REF_SEQ_NO)
    .addInputParams('CATEG', params.CATEG)
    .addInputParams('IMG_SEQ_NO', params.IMG_SEQ_NO).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_IMAGE_INFO', dbParams);

  // result
  return execRes.rows!;
};

/**
 *  코드 정보
 * @param params
 */
export const getCodeList = async (params: ICCodeParams) => {
  // 파라메터
  const dbParams = new ParamUtil()
    .addInputParams('GROUP_CD', params.GROUP_CD)
    .addInputParams('CD', params.CD).params;

  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_CODE_LIST', dbParams);

  // result
  return execRes.rows!;
};
