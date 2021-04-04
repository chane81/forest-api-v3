import { execProc } from '~/utils/dbUtils';

// 모바일 메인 정보
export const getMainInfo = async () => {
  // 프로시저 콜
  const execRes = await execProc('DBO.PROC_GET_M_MAIN_INFO');

  // result
  return execRes.rows!;
};
