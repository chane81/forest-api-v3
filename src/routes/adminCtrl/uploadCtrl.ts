import { Router } from 'express';
import { errResult } from '~/utils/errUtils';
import { upload, localUpload, deleteFile } from '~/utils/upload';
import { IResBase } from '~/entity/routes/common';
import _ from 'lodash';

/** 라우터 */
const router = Router();

/** 로컬 업로드 */
router.post('/local-upload', (req, res, next) => {
  const savePathCb = (req: any) => 'images/exp';
  const upd = localUpload(savePathCb).array('img');

  upd(req, res, (err: any) => {
    console.log('req.file', req.files);
    res.send('ok');
  });
});

/** 업로드 예제 1 */
// router.post('/upload', upload('images/exp').array('img'), async (req, res) => {
// 	try {
// 		console.log('test', req.body.test);
// 		console.log('test', req.files);
// 		res.json('ok');
// 	} catch (err) {
// 		errResult(res, err);
// 	}
// });

/** S3 Req File type */
interface IS3ReqFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  cntentType: string;
  storageClass: string;
  metadata: any;
  location: string;
  etag: string;
}

router.post('/deleteFile', async (req, res) => {
  try {
    // multer 의 저장경로 설정 콜백함수
    const savePathCb = (rq: any) => {
      const categ = rq.body.CATEG;
      const imgPath =
        categ === 'F'
          ? 'images/forest'
          : categ === 'E'
          ? 'images/exp'
          : categ === 'M'
          ? 'images/map'
          : 'video';

      return imgPath;
    };

    // aws 에서 삭제처리
    const delResult = await deleteFile(req, req.body.FILE, savePathCb);

    res.json(delResult);
  } catch (err) {
    errResult(res, err);
  }
});

/** 업로드 */
router.post('/upload', async (req, res) => {
  try {
    // result init
    const result: IResBase = {
      RESULT: true,
      RESULT_CODE: '00',
      RESULT_MSG: '정상'
    };

    // multer 의 저장경로 설정 콜백함수
    const savePathCb = (rq: any) => {
      const categ = rq.body.CATEG;
      const imgPath =
        categ === 'F'
          ? 'images/forest'
          : categ === 'E'
          ? 'images/exp'
          : categ === 'M'
          ? 'images/map'
          : 'video';

      return imgPath;
    };

    // upload 객체
    const upd = upload(savePathCb).array('FILE');

    // upload callback
    upd(req, res, (err: any) => {
      // const reqFile = (req.file as any) as IS3ReqFile;
      // const s3Url = reqFile.location;
      // const s3FileName = s3Url.substring(s3Url.lastIndexOf('/') + 1);
      const fileInfo: any = [];
      _.map(req.files, (val) => {
        const reqFile = (val as any) as IS3ReqFile;
        const s3Url = reqFile.location;
        const s3FileName = s3Url.substring(s3Url.lastIndexOf('/') + 1);

        fileInfo.push({
          S3_URL: s3Url,
          S3_FILE_NAME: s3FileName
        });
      });

      // console.log('req.file', reqFile);
      // console.log('s3 url', s3Url);
      // console.log('s3 file name', s3FileName);

      res.json({
        ...result,
        FILE_INFO: fileInfo
      });
    });
  } catch (err) {
    errResult(res, err);
  }
});

export default router;
