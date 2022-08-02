import AWS from 'aws-sdk';
import fs from 'fs';
import { AWS_BUCKET_NAME, UPLOAD_FOLDER_NAME } from './constants.js';
import cliProgress from 'cli-progress';

export class Uploader {
    constructor(credentials, routineName) {
        this.s3Client = new AWS.S3({
            accessKeyId: credentials['Credentials']['AccessKeyId'],
            secretAccessKey: credentials['Credentials']['SecretAccessKey'],
            sessionToken: credentials['Credentials']['SessionToken'],
            useAccelerateEndpoint: true
        });
        this.routineName = routineName;
        this.files = [];
    }

    readFilesFromDir(path) {
        fs.readdirSync(path).forEach((fileName) => {
            const fileStats = fs.statSync(`${path}/${fileName}`);
            this.files.push({
                name: fileName,
                content: fs.createReadStream(`${path}/${fileName}`),
                size: fileStats.size,
            });
        });
    }

    uploadFile(file) {
        const filePath = `${UPLOAD_FOLDER_NAME}/${this.routineName}/${file.name}`;
        const request = this.s3Client.upload({
            Bucket: AWS_BUCKET_NAME,
            Key: filePath,
            Body: file.content,
        });

        const progressBar = this.multiBar.create(100, 0, {
            filename: file.name,
        });

        request.on('httpUploadProgress', (progress) => {
            const uploadProgress = Math.round(1000 * progress.loaded / file.size) / 10;
            progressBar.update(uploadProgress);
        });

        return request.promise();

    }

    uploadFiles(path) {
        this.multiBar = new cliProgress.MultiBar({
            format: '{filename} [{bar}] {percentage}% | ETA: {eta}s | {value}% / {total}%',
            clearOnComplete: false,
            hideCursor: false,
        });

        this.readFilesFromDir(path);
        const filePromises = this.files.map(file => this.uploadFile(file));
        Promise.all(filePromises).then(() => {
            this.multiBar.stop();
        })
    }
}

export const uploadFiles = (credentials, routineName, path) => {
    const uploader = new Uploader(credentials, routineName);
    uploader.uploadFiles(path);
}
