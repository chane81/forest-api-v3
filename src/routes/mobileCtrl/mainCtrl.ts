import { Router } from 'express';
import { errResult } from '~/utils/errUtils';
import { getTotalCount } from '~/utils/dbUtils';
import { getMainInfo } from '~/src/repo/mobile';
import { setRemoveTotalCount } from '~/utils/routerUtils';

/** 라우터 */
const router = Router();

/** 메인 정보 */
router.get('/getMainInfo', async (req, res) => {
  try {
    // db call
    const dbResult = await getMainInfo();

    // result
    const result = {
      RESULT: true,
      RESULT_CODE: '00',
      RESULT_MSG: '정상',
      FOREST_COUNT: getTotalCount(dbResult[0]),
      EXP_CATEG_COUNT: getTotalCount(dbResult[1]),
      FOREST_LIST: setRemoveTotalCount(dbResult[0], 'TOTAL_COUNT'),
      EXP_CATEG_LIST: setRemoveTotalCount(dbResult[1], 'TOTAL_COUNT')
    };

    res.json(result);
  } catch (err) {
    errResult(res, err);
  }
});

export default router;
