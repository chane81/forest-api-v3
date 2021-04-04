/** 어드민 휴양림 리스트 파라메터 */
export interface IAForestListParams {
  NAME?: string;
  CATEG1?: string;
  CATEG2?: string;
  MAIN_YN?: string;
  PAGE_NO?: number;
  PAGE_SIZE?: number;
}

/** 어드민 휴양림 삭제 파라메터 */
export interface IAForestDelParams {
  FOREST_SEQ_NO: number;
  SAVE_USER_SEQ_NO?: number;
}

/** 어드민 휴양림 INSERT/UPDATE파라메터 */
export interface IAForestSaveParams {
  FOREST_SEQ_NO?: number;
  NAME: string;
  ADDR1: string;
  ADDR2: string;
  BUSSINESS_NUMBER: string;
  DESCRIPT: string;
  SIMPLE_DESCRIPT: string;
  MAIN_YN: string;
  TEL_NO: string;
  MAP_IMG_URL: string;
  XML_FILE_DATA?: string;
  SAVE_USER_SEQ_NO: number;
}

/** 어드민 파일 업로드 데이터 */
export interface IAImgFile {
  IMG_URL: string;
  SORT: number;
}

/** 어드민 휴양림 정보 파라메터 */
export interface IAForestInfoParams {
  FOREST_SEQ_NO: number;
}

/** 어드민 체험 INSERT/UPDATE 파라메터 */
export interface IAExpSaveParams {
  FOREST_SEQ_NO?: number;
  EXP_SEQ_NO?: number;
  NAME: string;
  CATEG1: string;
  CATEG2: string;
  TITLE: string;
  DESCRIPT: string;
  MAP_X?: number;
  MAP_Y?: number;
  MAIN_YN: string;
  XML_FILE_DATA?: string;
  SAVE_USER_SEQ_NO?: number;
}

/** 어드민 체험 DELETE 파라메터 */
export interface IAExpDeleteParams {
  EXP_SEQ_NO: number;
  SAVE_USER_SEQ_NO?: number;
}

/** 어드민 동영상 INSERT/UPDATE 파라메터 */
export interface IAMovieSaveParams {
  FOREST_SEQ_NO?: number;
  MOVIE_SEQ_NO?: number;
  CATEG1: string;
  URL: string;
  XML_DETAIL_DATA?: string;
  SAVE_USER_SEQ_NO?: number;
}

/** 어드민 동영상 DELETE 파라메터 */
export interface IAMovieDeleteParams {
  MOVIE_SEQ_NO: number;
  SAVE_USER_SEQ_NO?: number;
}

/** 어드민 보드 리스트 파라메터 */
export interface IABoardListParams {
  PAGE_NO: number;
  PAGE_SIZE: number;
  CATEG: string;
}

/** 어드민 보드 상세 파라메터 */
export interface IABoardDetailParams {
  BOARD_SEQ_NO: number;
}

/** 어드민 보드 INSERT/UPDATE 파라메터 */
export interface IABoardSaveParams {
  BOARD_SEQ_NO: number;
  TITLE: string;
  CONTENTS: string;
  URL_1: string;
  URL_2: string;
  URL_3: string;
  USE_YN: string;
  CATEG: string;
  SAVE_USER_SEQ_NO: number;
}

/** 어드민 보드 DELETE 파라메터 */
export interface IABoardDeleteParams {
  BOARD_SEQ_NO: number;
  SAVE_USER_SEQ_NO?: number;
}
