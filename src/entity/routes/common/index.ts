/**
 * 기본 express res 엔티티
 */
export interface IResBase {
  RESULT: boolean;
  RESULT_CODE: string;
  RESULT_MSG: string;
}

/**
 * route 에서 리스트형 반환 엔티티
 */
export interface IResList extends IResBase {
  TOTAL_COUNT?: number;
  LIST: object[];
}

/** 로그인 반환 엔티티 */
export interface IResLoginInfo extends IResBase {
  USER_SEQ_NO?: number;
  EMAIL?: string;
  NAME?: string;
  PHONE_NO?: string;
  GUBUN?: string;
}

/**
 * request paging 파라메터
 */
export interface ICPagingParams {
  PAGE_NO: number;
  PAGE_SIZE: number;
}

/**
 * 이미지정보 호출 파라메터
 */
export interface ICImageInfoParams {
  REF_SEQ_NO?: number;
  CATEG?: string;
  IMG_SEQ_NO?: number;
}

/**
 * user 파라메터
 */
export interface ICUserParams {
  EMAIL: string;
  PWD: string;
  NAME: string;
  GUBUN?: string;
  PHONE_NO: string;
  SAVE_USER_SEQ_NO?: number;
}

/**
 * 로그인 파라메터
 */
export interface ICLoginParams {
  EMAIL?: string;
  PHONE_NO?: string;
  PWD: string;
  GUBUN?: string;
}

/**
 * 코드정보 파라메터
 */
export interface ICCodeParams {
  GROUP_CD: string;
  CD?: string;
}
