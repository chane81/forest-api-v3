import { IResBase } from '~/entity/routes/common';
import Joi from 'joi';

const validateReq = (keys: Joi.SchemaMap<any> | undefined, method?: 'POST' | 'GET') => (
  req: any,
  res: any,
  next: any
) => {
  method = method ?? 'GET';
  const validateValue = method === 'GET' ? req.query : req.body;
  const schema = Joi.object().keys(keys);
  const vRes = schema.validate(validateValue);

  if (!vRes.error) {
    next();
  } else {
    const errField = vRes.error.details[0].context!.key;
    const errLabel = vRes.error.details[0].context!.label;
    const errMsg = vRes.error.details[0].message;

    const resVal: IResBase = {
      RESULT: false,
      RESULT_CODE: '01',
      RESULT_MSG: vRes.error.message
    };

    res.status(422).json(resVal);
  }
};

export { validateReq };
