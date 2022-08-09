#!/usr/bin/env node

import { program } from 'commander';
import { authenticate } from '../utils/authentication.js';
import { getAwsCredentialsRequest, isCredentialsValid } from '../utils/aws-credentials.js';
import { uploadFiles } from '../utils/upload-files.js';
import { handleAuthenticationError, handleDefaultRequestError } from '../utils/log.js';
import { getJson } from '../utils/functions.js';
import { AUTH_PATH, AWS_CREDENTIALS_PATH } from '../utils/constants.js';
import { changeEnvironment } from '../utils/environment.js';

program
    .command('auth')
    .description('Authenticate to Varstation system')
    .action(async () => {
        authenticate().catch(handleAuthenticationError);
    });

program
    .command('env')
    .description('Change Varstation environment')
    .action(() => {
        changeEnvironment().then(() => {
            console.log('Environment set with success.');
        });
    });


program
    .command('upload_routine')
    .description('Upload the files of a routine into AWS bucket')
    .argument('Path', 'Path of the directory with the routine')
    .argument('Routine name', 'Name of the routine')
    .option('-e, --exclude [string...]', 'Files inside routine folder to exclude', [])
    .action((path, routineName, options) => {
        const authInfo = getJson(AUTH_PATH);
        let credentials = getJson(AWS_CREDENTIALS_PATH);
            if (isCredentialsValid(credentials)) {
                uploadFiles(credentials, routineName, path, authInfo?.user?.organization?.name, options['exclude']);
            } else {
                getAwsCredentialsRequest().then((credentials) => {
                    uploadFiles(credentials, routineName, path, authInfo?.user?.organization?.name, options['exclude']);
                }).catch(handleDefaultRequestError);
            }

        }
    );


program.version('1.0.1').parse(program.argv);
