/** 모바일 체험 리스트 파라메터 */
export interface IMExpListParams {
  FOREST_SEQ_NO?: number;
  NAME?: string;
  CATEG1?: string;
  CATEG2?: string;
  TITLE?: string;
  PAGE_NO?: number;
  PAGE_SIZE?: number;
}

/** 모바일 동영상 정보 파라메터 */
export interface IMMovieInfoParams {
  FOREST_SEQ_NO?: number;
  CATEG1?: string;
}

/** 모바일 리뷰 리스트 파라메터 */
export interface IMReviewListParams {
  PHONE_NO?: string;
  FOREST_SEQ_NO?: number;
  EXP_SEQ_NO?: number;
  PAGE_NO?: number;
  PAGE_SIZE?: number;
}

/** 모바일 리뷰 정보 INSERT 파라메터 */
export interface IMReviewInsertParams {
  EXP_SEQ_NO: number;
  PHONE_NO: string;
  SCORE: number;
  REVIEW_TEXT?: string;
}

/** 설문 번호가져오기 파라메터 */
export interface IMSureySeqNoParams {
  FOREST_SEQ_NO: number;
}

/** 설문 응답 정보 INSERT/UPDATE 파라메터 */
export interface IMSurveySaveParams {
  SURVEY_SEQ_NO: number;
  QUESTION_NO: number;
  ANSWER: string;
  USER_SEQ_NO: number;
}

/** 휴양림 리스트 파라메터 */
export interface IMForestListParams {
  PAGE_NO: number;
  PAGE_SIZE: number;
  REVIEW_YN: string;
  SURVEY_YN: string;
}

/** 휴양림 상세 파라메터 */
export interface IMForestDetailParams {
  FOREST_SEQ_NO: number;
}

/** 공지글 상세 파라메터 */
export interface IMNotiDetailParams {
  BOARD_SEQ_NO: number;
}
