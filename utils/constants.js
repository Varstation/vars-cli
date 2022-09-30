import { getConstants } from './environment.js';

export const DATA_FOLDER_PATH = './data/'
export const AUTH_PATH = '.auth.json';
export const AWS_CREDENTIALS_PATH = '.temp_credentials.json';
export const ENVIRONMENT_SELECTION_PATH = '.environment.json';

export const UPLOAD_FOLDER_NAME = 'vars-cli-uploads';

export const [API_URL, AWS_BUCKET_NAME] = getConstants();
