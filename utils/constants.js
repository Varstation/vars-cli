import { getConstants } from './environment.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const DATA_FOLDER_PATH = `${dirname(__dirname)}/data`;
export const AUTH_PATH = '.auth.json';
export const AWS_CREDENTIALS_PATH = '.temp_credentials.json';
export const ENVIRONMENT_SELECTION_PATH = '.environment.json';

export const UPLOAD_FOLDER_NAME = 'vars-cli-uploads';

export const [API_URL, AWS_BUCKET_NAME] = getConstants();
