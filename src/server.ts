import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import routes from './routes';
import { createSession } from '~/utils/sessionUtils';
import env from '~/config/env';
import _ from 'lodash';
// import * as compression from 'compression';

const main = async () => {
  const app = express();
  // app.use(compression());

  app.use(urlencoded({ extended: false }));
  app.use(json());

  // cors 설정
  const originUrls = env.ORIGIN_URL;
  const whitelist = originUrls?.split(',');

  app.use(
    cors({
      origin: (reqOrigin, callback) => {
        if (!reqOrigin || _.includes(whitelist, reqOrigin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'), false);
        }
      },
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    })
  );

  app.use(createSession());

  // 라우터 바인딩
  app.use(routes);

  // aws eb 에서 healthCheck 호출용
  app.use('/healthCheck', (req, res) => {
    res.status(200).send('200');
  });

  // 서버 LISTEN
  app.listen(env.SERVER_PORT, () => {
    console.log(`server started on port: ${env.SERVER_PORT}`);
  });
};

main();
