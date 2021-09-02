import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import { ConfigService } from './../../modules/config';
let config: ConfigService;

aws.config.update({
    secretAccessKey: config.get('AWS_SECRET_KEY'),
    accessKeyId: config.get('AWS_ACCESS_KEY'),
    signatureVersion: 'v4',
});
const s3Conf = new aws.S3();
export const fileUploadOptions = {
    storage: multerS3({
        s3: s3Conf,
        acl: 'public-read',
        bucket: config.get('AWS_BUCKET_NAME'),
        metadata: (req, file, cb) => {
            cb(undefined, {fieldName: file.fieldname});
          },
        key: (req: any, file, cb) => {
            let cbStore = '';
            if (req.params.cId !== undefined) {
                cbStore = 'Courses/courseId-' + req.params.cId + '/' + Date.now() + '-' + file.originalname;
             } else if (req.params.lecId !== undefined) {
                cbStore = 'Lectures/lectureId-' + req.params.lecId + '/' + Date.now() + '-' + file.originalname;
             } else if (req.params.catId !== undefined) {
                cbStore = 'Categories/categoryId-' + req.params.catId + '/' + Date.now() + '-' + file.originalname;
             } else if (req.params.goalId !== undefined) {
                cbStore = 'Goals/goalId-' + req.params.goalId + '/' + Date.now() + '-' + file.originalname;
             }
            cb( undefined , cbStore);
        },
    }),
};
