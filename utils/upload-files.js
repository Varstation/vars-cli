import AWS from 'aws-sdk';
import fs from 'fs';
import { AWS_BUCKET_NAME, UPLOAD_FOLDER_NAME } from './constants.js';
import cliProgress from 'cli-progress';
import { merge, defer } from 'rxjs';
import {handleGenericError} from './log.js';

const MAX_CONCURRENCY_FILES = 4;

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

    readFilesFromDir(path, filesToExclude) {
        try {
            fs.readdirSync(path).filter(
                (fileName) => !filesToExclude.includes(fileName),
            ).forEach((fileName) => {
                const fileStats = fs.statSync(`${path}/${fileName}`);
                this.files.push({
                    name: fileName,
                    content: fs.createReadStream(`${path}/${fileName}`),
                    size: fileStats.size
                });
            });
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log('Could not find files. Please check you path.');
                console.log(err.message);
            } else {
                throw err;
            }
        }

    }

    uploadFile(file, organizationName) {
        const filePath = `${UPLOAD_FOLDER_NAME}/${organizationName}/${this.routineName}/${file.name}`;
        const request = this.s3Client.upload({
            Bucket: AWS_BUCKET_NAME,
            Key: filePath,
            Body: file.content
        });

        const progressBar = this.multiBar.create(100, 0, {
            filename: file.name
        });

        request.on('httpUploadProgress', (progress) => {
            const uploadProgress = Math.round(1000 * progress.loaded / file.size) / 10;
            progressBar.update(uploadProgress);
        });

        return defer(() => request.promise());

    }

    uploadFiles(path, organizationName, filesToExclude) {
        this.multiBar = new cliProgress.MultiBar({
            format: '{filename} [{bar}] {percentage}% | ETA: {eta}s | {value}% / {total}%',
            clearOnComplete: false,
            hideCursor: false
        });

        this.readFilesFromDir(path, filesToExclude);
        const fileObservables = this.files.map(file => this.uploadFile(file, organizationName));
        merge(...fileObservables, MAX_CONCURRENCY_FILES).subscribe({
            complete: () => {
                this.multiBar.stop();
            }
        });
    }
}

export const uploadFiles = (credentials, routineName, path, organizationName, filesToExclude) => {
    try {
        const uploader = new Uploader(credentials, routineName);
        uploader.uploadFiles(path, organizationName, filesToExclude);
    } catch (error) {
        handleGenericError(error);
    }
};
