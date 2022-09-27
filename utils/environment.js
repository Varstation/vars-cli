import fs from 'fs';
import inquirer from 'inquirer';
import { getJson, saveJson } from './functions.js';
import { AUTH_PATH, AWS_CREDENTIALS_PATH, DATA_FOLDER_PATH, ENVIRONMENT_SELECTION_PATH } from './constants.js';

const LOCAL_URL = 'http://localhost:8000/api/';
const HOMOLOG_URL = 'https://zbtbwrvqf4.execute-api.us-east-1.amazonaws.com/api/';
const PRODUCTION_URL = 'https://nikjpbtd5h.execute-api.us-east-1.amazonaws.com/api/';

export const ENVIRONMENTS_OPTIONS = Object.freeze({
    PRODUCTION: '[Default] Production',
    HOMOLOG:  'Homolog',
    LOCAL_DEVELOPMENT: 'Local Development',
});

export const getApiUrl = () => {
    const environment = getJson(ENVIRONMENT_SELECTION_PATH);
    switch (environment) {
        case ENVIRONMENTS_OPTIONS.PRODUCTION:
            return PRODUCTION_URL;
        case ENVIRONMENTS_OPTIONS.HOMOLOG:
            return HOMOLOG_URL;
        case ENVIRONMENTS_OPTIONS.LOCAL_DEVELOPMENT:
            return LOCAL_URL;
        default:
            return PRODUCTION_URL;
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
