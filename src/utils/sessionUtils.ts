import session from 'express-session';
import connectMssql from 'connect-mssql';
import env from '~/config/env';
import { Request, Response } from 'express';

/** config */
const config = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  server: env.DB_SERVER,
  database: env.DB_NAME,

  options: {
    encrypt: false,
    enableArithAbort: true
  }
};

/** 세션 생성 */
const createSession = () => {
  const mssqlSession = connectMssql(session);

  const store = new mssqlSession(config, {
    table: env.SESSION_TABLE
    // ttl: 1000 * 60		// 24시간
    // autoRemove: true,
    // autoRemoveInterval: 1000 * 60 * 10,		// 10분
  });

  store.on('connect', () => {
    console.log('session connect');
  });

  store.on('sessionError', (err: any, classMethod: any) => {
    console.log('session error', err);
  });

  const rtnSession = session({
    store,

    name: env.SESSION_NAME,

    secret: env.SESSION_SECRET || '',

    resave: false,

    // true 로 세팅해야 rolling 가 유효함
    saveUninitialized: true,

    // 세션 갱신을 위해 true set
    rolling: true,

    cookie: {
      httpOnly: true,

      domain: env.SESSION_DOMAIN,

      path: '/',

      // SSL 통신 채널 연결 시에만 쿠키를 전송하도록 설정
      secure: false,

      //  기본 24시간 (1000 * 60 * 60 * 24)=86400000
      maxAge: env.SESSION_EXPIRES,

      sameSite: false
    }
  });

  return rtnSession;
};

/** destroy session */
const sessionDestory = (req: Request, res: Response) => {
  req.session?.destroy((err) => {
    if (err) {
      throw err;
    }
  });

  res.clearCookie('ssid', { path: '/' });
};

export { createSession, sessionDestory };
