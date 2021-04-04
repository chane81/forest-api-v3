import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import env from '~/config/env';
import path from 'path';
import { IResBase } from '~/entity/routes/common';

// aws s3 auth 설정
const s3 = new aws.S3({
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY
  },
  region: env.S3_REGION
});

// s3 upload 설정
const storage = (savePathCb: (req: any) => string) =>
  multerS3({
    s3,
    bucket: env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read-write',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      // savePath example: images/exp

      const savePath = savePathCb(req);
      cb(null, `${savePath}/${Date.now()}_${file.originalname}`);
    }
  });

/** 테스트용 - 로컬 upload 테스트를 위한 storage */
const localStorage = (savePathCb: (req: any) => string) =>
  multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      console.log('file', file);

      const savePath = savePathCb(req);
      cb(null, getFile(savePath, file));
    }
  });

/** 테스트용 - 로컬 upload 파일명 */
const getFile = (savePath: string, file: any) => {
  const oriFile = file.originalname;
  const ext = path.extname(oriFile);
  const name = path.basename(oriFile, ext);
  const rnd = Math.floor(Math.random() * 90) + 10; // 10 ~ 99 랜덤 숫자

  return savePath + '/' + Date.now() + '-' + rnd + '-' + name + ext;
};

// multer storage 설정;
const upload = (savePathCb: (req: any) => string) => multer({ storage: storage(savePathCb) });
const localUpload = (savePathCb: (req: any) => string) =>
  multer({ storage: localStorage(savePathCb) });
const deleteFile = (req: any, fileName: string, savePathCb: (req: any) => string) => {
  const savePath = savePathCb(req);
  const params: aws.S3.DeleteObjectRequest = {
    Bucket: env.S3_BUCKET,
    Key: savePath + '/' + fileName
  };

  let result: IResBase = {
    RESULT: true,
    RESULT_CODE: '00',
    RESULT_MSG: '정상'
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      result = {
        RESULT: false,
        RESULT_CODE: '99',
        RESULT_MSG: err.stack ?? ''
      };
    }
  });

  return result;
};

export { upload, localUpload, deleteFile };
