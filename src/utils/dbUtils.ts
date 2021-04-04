import {
  ParameterOptions,
  TediousType,
  TYPES,
  ConnectionConfig,
  Connection,
  Request
} from 'tedious';
import env from '~/config/env';
import _ from 'lodash';

/**
 * DB 설정
 */
const conConfig: ConnectionConfig = {
  server: env.DB_SERVER,
  authentication: {
    type: 'default',
    options: {
      userName: env.DB_USER,
      password: env.DB_PASSWORD
    }
  },
  options: {
    encrypt: false,
    database: env.DB_NAME,
    rowCollectionOnDone: true
  }
};

export interface IParamsType {
  name: string;
  type?: TediousType;
  value?: any;
  options?: ParameterOptions;
  direction?: 'input' | 'output';
}

interface IParamUtil {
  params: IParamsType[];
  addInputParams: (name: string, value: any, type?: TediousType) => IParamUtil;
  addOutputParams: (name: string, type?: TediousType) => IParamUtil;
  clear: () => void;
}

/**
 * 파라메터 생성 유틸
 * 그냥 VarChar 은 한글이 깨져서 DB 에 들어간다. 한글일 경우 NVarChar로 할 것
 */
export class ParamUtil {
  public params: IParamsType[] = [];

  addInputParams(name: string, value?: any, type?: TediousType) {
    this.params.push({
      name,
      value,
      type: type ?? TYPES.NVarChar,
      direction: 'input'
    });

    return this;
  }

  addOutputParams(name: string, type?: TediousType) {
    this.params.push({
      name,
      type,
      direction: 'output'
    });

    return this;
  }
}

/**
 * 프로시저 결과 타입
 * rows 의 경우 multi table return 의 경우가 있으므로 any[] 타입
 * K: OUTPUT 파라메터 타입
 */
export interface IProcResult<K> {
  rows?: any[];
  outParams?: K;
}

/**
 * 리스트 결과의 TOTAL_COUNT 컬럼값을 가져옴
 * @param listResult 총 카운트
 */
export const getTotalCount = (listResult: any[]) => {
  if (!listResult) return 0;

  const totalCount = _.reduce(
    listResult,
    (acc, val) => {
      // 멀티 쿼리 결과 일 경우
      if (val.length > 0) {
        return acc + val[0].TOTAL_COUNT;

        // 단일 쿼리 결과 일 경우
      } else {
        return val.TOTAL_COUNT;
      }
    },
    0
  );

  return totalCount;
};

/**
 * 프로시저 실행
 * K: OUTPUT 파라메터 타입
 * @param procName 프로시저명
 * @param params DB 파라메터
 */
export const execProc = <K = {}>(
  procName: string,
  params?: IParamsType[]
): Promise<IProcResult<K>> => {
  return new Promise((resolve, reject) => {
    const connection = new Connection(conConfig);
    const procResult: IProcResult<K> = {};

    connection.on('connect', (err) => {
      if (err) {
        console.error('execProc db connection error!', err.message);

        connection.close();

        reject(err);
      } else {
        const req = new Request(procName, (reqErr, rowCount) => {
          if (reqErr) {
            console.error('exec proc error', reqErr.message);

            reject(reqErr);
          }

          connection.close();
        });

        if (params && params.length > 0) {
          params.forEach((p) => {
            const pType = p.type ?? TYPES.VarChar;

            if (!p.direction || p.direction === 'input') {
              req.addParameter(p.name, pType, p.value);
            } else {
              req.addOutputParameter(p.name, pType);
            }
          });
        }

        // 멀티 테이블 결과를 저장하기 위해선 doneInProc 를 써야한다. req.on('row') 를 써서는 해결되지 않는다.
        req.on('doneInProc', (rowCount, more, rows) => {
          // 프로시저에서 SET NOCOUNT ON 을 하지 않으면
          // 여러개의 빈 rows 값(rows[])을 반환한다.
          // 코드에서 rows.length > 0 를 하는게 아닌 DB에서 SET NOCOUNT ON 처리하여 이슈 처리
          const rtnRows: any[] = [];

          _.forEach(rows, (record) => {
            const item: any = {};

            _.forEach(record, (val) => {
              item[val.metadata.colName] = val.value;
            });

            rtnRows.push(item);
          });

          if (rtnRows && !procResult.rows) {
            procResult.rows = [];
          }

          procResult.rows?.push(rtnRows);
        });

        // output params return
        const outValue: any = {};
        req.on('returnValue', (paramName: string, value, metadata) => {
          if (paramName && procResult.outParams) {
            outValue[paramName] = value;
          }
        });

        procResult.outParams = outValue;

        req.on('doneProc', (rowCnt, more, rows) => {
          // 만약 멀티 쿼리 결과가 아니라면 rows[0] 을 바로 리턴하게 해준다.

          if (procResult.rows?.length === 1) {
            procResult.rows = procResult.rows[0];
          }

          resolve(procResult);
        });

        connection.callProcedure(req);
      }
    });
  });
};
