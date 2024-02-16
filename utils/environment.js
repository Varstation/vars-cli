import fs from 'fs';
import inquirer from 'inquirer';
import { getJson, saveJson } from './functions.js';
import { AUTH_PATH, AWS_CREDENTIALS_PATH, DATA_FOLDER_PATH, ENVIRONMENT_SELECTION_PATH } from './constants.js';

const LOCAL_URL = 'http://localhost:8000/api/';
const DEVELOPMENT_URL = 'https://api.development.varstation.varsomics-sandbox.com/api/';
const OLD_HOMOLOG_URL = 'https://zbtbwrvqf4.execute-api.us-east-1.amazonaws.com/api/';
const HOMOLOG_URL = 'https://api.homologation.varstation.varsomics-sandbox.com/api/';
const PRODUCTION_URL = 'https://nikjpbtd5h.execute-api.us-east-1.amazonaws.com/api/';
const AWS_PRODUCTION_BUCKET_NAME = 'vars-production-landing';
const AWS_OLD_HOMOLOG_BUCKET_NAME = 'vars-static-homolog';
const AWS_HOMOLOG_BUCKET_NAME = 'varstation-homologation-landing';
const AWS_DEVELOPMENT_BUCKET_NAME = 'varstation-development-landings';
const AWS_LOCAL_DEVELOPMENT_BUCKET_NAME = 'varstation-static-development';


export const ENVIRONMENTS_OPTIONS = Object.freeze({
    PRODUCTION: '[Default] Production',
    OLD_HOMOLOG:  'Homologation (old)',
    HOMOLOG:  'Homologation',
    DEVELOPMENT: 'Development',
    LOCAL_DEVELOPMENT: 'Local Development',
});

export const getConstants = () => {
    const environment = getJson(ENVIRONMENT_SELECTION_PATH);
    switch (environment) {
        case ENVIRONMENTS_OPTIONS.PRODUCTION:
            return [PRODUCTION_URL, AWS_PRODUCTION_BUCKET_NAME];
        case ENVIRONMENTS_OPTIONS.HOMOLOG:
            return [HOMOLOG_URL, AWS_HOMOLOG_BUCKET_NAME];
        case ENVIRONMENTS_OPTIONS.OLD_HOMOLOG:
            return [OLD_HOMOLOG_URL, AWS_OLD_HOMOLOG_BUCKET_NAME];
        case ENVIRONMENTS_OPTIONS.DEVELOPMENT:
            return [DEVELOPMENT_URL, AWS_DEVELOPMENT_BUCKET_NAME];
        case ENVIRONMENTS_OPTIONS.LOCAL_DEVELOPMENT:
            return [LOCAL_URL, AWS_LOCAL_DEVELOPMENT_BUCKET_NAME];
        default:
            return [PRODUCTION_URL, AWS_PRODUCTION_BUCKET_NAME];
    }
}

export const changeEnvironment = async () => {
    const { environment } = await inquirer.prompt([
        {
            type: 'list',
            name: 'environment',
            message: 'Select the environment you want to work on:',
            choices: [
                ENVIRONMENTS_OPTIONS.PRODUCTION,
                ENVIRONMENTS_OPTIONS.HOMOLOG,
                ENVIRONMENTS_OPTIONS.OLD_HOMOLOG,
                ENVIRONMENTS_OPTIONS.DEVELOPMENT,
                ENVIRONMENTS_OPTIONS.LOCAL_DEVELOPMENT,
            ],
            default: ENVIRONMENTS_OPTIONS.PRODUCTION,
        }
    ]);
    saveJson(ENVIRONMENT_SELECTION_PATH, environment);
    clearFile(AWS_CREDENTIALS_PATH);
    clearFile(AUTH_PATH);
};

const clearFile = (fileName) => {
    if (fs.existsSync(`${DATA_FOLDER_PATH}/${fileName}`)) {
        fs.unlinkSync(`${DATA_FOLDER_PATH}/${fileName}`);
    }
}
