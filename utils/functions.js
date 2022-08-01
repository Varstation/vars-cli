import fs from 'fs';
import { DATA_FOLDER_PATH } from './constants.js';

export const getJson = (path) => {
    const data = fs.existsSync(path) ? fs.readFileSync(path) : undefined;
    try {
        return JSON.parse(data);
    } catch (e) {
        return undefined;
    }
};

export const saveJson = (filename, data) => {
    createDataDirectoryIfNotExists();
    fs.writeFileSync(`${DATA_FOLDER_PATH}/${filename}`, JSON.stringify(data, null, '\t'));
};

const createDataDirectoryIfNotExists = () => {
    if (!fs.existsSync(DATA_FOLDER_PATH)) {
        fs.mkdirSync(DATA_FOLDER_PATH);
    }
};
