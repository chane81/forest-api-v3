import { IResBase, IResList } from '~/entity/routes/common';
import { getTotalCount, IProcResult } from '~/utils/dbUtils';
import { IDbOutResult } from '~/entity/db';
import _ from 'lodash';

/** router 에서 사용할 유틸 */

export const setRemoveTotalCount = (list: any[], removeField?: string): any[] | any => {
  const omitField = (arg) => _.omit(arg, removeField || 'TOTAL_COUNT');

  if (Array.isArray(list)) {
    return _.map(list, (val) => omitField(val));
  } else {
    return omitField(list);
  }
};

/** 리스트형 DB 결과를 가져와 라우터 RESPONSE 객체로 만듬 */
export const setMakeListResult = (dbResult: any[]): IResList => {
  const result: IResList = {
    RESULT: true,
    RESULT_CODE: '00',
    RESULT_MSG: '정상',
    TOTAL_COUNT: getTotalCount(dbResult),
    // LIST: dbResult
    LIST: setRemoveTotalCount(dbResult)
  };

  return result;
};

/** INSERT/UPDATE/DELETE DB 결과를 가져와 라우터 RESPONSE 객체로 만듬 */
export const setMakeIUDResult = (dbResult: IDbOutResult): IResBase => {
  const result: IResBase = {
    RESULT: dbResult.RET_CODE === '00',
    RESULT_CODE: dbResult.RET_CODE,
    RESULT_MSG: dbResult.RET_MSG
  };

  return result;
};
