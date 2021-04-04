import { IResBase } from '~/src/entity/routes/common';
import { Response } from 'express';

const errResult = (res: Response, err: Error) => {
  let result: IResBase = {
    RESULT: true,
    RESULT_CODE: '00',
    RESULT_MSG: '정상'
  };

  if (err) {
    result = {
      RESULT: false,
      RESULT_CODE: '99',
      RESULT_MSG: err.message
    };
  }

  res.json(result);
};

export { errResult };
