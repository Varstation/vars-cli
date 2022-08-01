#!/usr/bin/env node

import { program } from 'commander';
import { authenticate } from '../utils/authentication.js';
import { getAwsCredentialsRequest, isCredentialsValid } from '../utils/aws-credentials.js';
import { Uploader } from '../utils/upload-files.js';
import { handleRequestError, logFailedRequest } from '../utils/log.js';

program
    .command('auth')
    .description('Authenticate to Varstation system')
    .action(async () => {
        authenticate().catch((error) => {

        });
    });

program
    .command('upload_routine')
    .description('Upload the files of a routine into AWS bucket')
    .argument('Path', 'Path of the directory with the routine')
    .argument('Routine name', 'Name of the routine')
    .option('-e, --exclude <string>', 'File to exclude')
    .action((path, routineName, options) => {
            let credentials = null; //getJson(AWS_CREDENTIALS_PATH);
            if (!isCredentialsValid(credentials)) {
                getAwsCredentialsRequest().then((credentials) => {
                    const uploader = new Uploader(credentials, routineName);
                    uploader.uploadFiles(path);
                }).catch(handleRequestError);
            } else {
                const uploader = new Uploader(credentials, routineName);
                uploader.uploadFiles(path);
            }

        }
    );


program.version('1.0.1').parse(program.argv);
