import inquirer from 'inquirer';
import { getJson, saveJson } from './functions.js';
import { ENVIRONMENT_SELECTION_PATH } from './constants.js';

export const ENVIRONMENTS_OPTIONS = Object.freeze({
    PRODUCTION:   1,
    HOMOLOG:  2,
    LOCAL_DEVELOPMENT: 3,
});

const ENVIRONMENTS_DISPLAY = Object.freeze({
    [ENVIRONMENTS_OPTIONS.PRODUCTION]: '[Default] Production',
    [ENVIRONMENTS_OPTIONS.HOMOLOG]:  'Homolog',
    [ENVIRONMENTS_OPTIONS.LOCAL_DEVELOPMENT]: 'Local Development',
});

const ENVIRONMENTS_VALUES = Object.freeze({
    '[Default] Production': ENVIRONMENTS_OPTIONS.PRODUCTION,
    'Homolog': ENVIRONMENTS_OPTIONS.HOMOLOG,
    'Local Development': ENVIRONMENTS_OPTIONS.LOCAL_DEVELOPMENT,
});

const LOCAL_URL = 'http://localhost:8000/api/';
const HOMOLOG_URL = 'https://zbtbwrvqf4.execute-api.us-east-1.amazonaws.com/api';
const PRODUCTION_URL = 'https://zbtbwrvqf4.execute-api.us-east-1.amazonaws.com/api';

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
                ENVIRONMENTS_DISPLAY[ENVIRONMENTS_OPTIONS.PRODUCTION],
                ENVIRONMENTS_DISPLAY[ENVIRONMENTS_OPTIONS.HOMOLOG],
                ENVIRONMENTS_DISPLAY[ENVIRONMENTS_OPTIONS.LOCAL_DEVELOPMENT],
            ],
            default: ENVIRONMENTS_DISPLAY[ENVIRONMENTS_OPTIONS.PRODUCTION],
        }
    ]);
    saveJson(ENVIRONMENT_SELECTION_PATH, ENVIRONMENTS_VALUES[environment]);
};
