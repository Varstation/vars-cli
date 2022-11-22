import fs from 'fs';
import axios from 'axios';
import { DATA_FOLDER_PATH } from './constants.js';
import { AUTH_PATH, API_URL } from './constants.js';

export const getJson = (filename) => {
    const path = `${DATA_FOLDER_PATH}/${filename}`;
    const data = fs.existsSync(path) ? fs.readFileSync(path) : undefined;
    try {
        return JSON.parse(data);
    } catch (e) {
        return undefined;
    }
};

export const saveJson = (filename, data) => {
    createDataDirectoryIfDoesntExists();
    fs.writeFileSync(`${DATA_FOLDER_PATH}/${filename}`, JSON.stringify(data, null, '\t'));
};

const createDataDirectoryIfDoesntExists = () => {
    if (!fs.existsSync(DATA_FOLDER_PATH)) {
        fs.mkdirSync(DATA_FOLDER_PATH);
    }
};

export const isCsvFile = (filePath) => {
    return filePath.split('.').pop() === 'csv'
}

export const start_process = async (filePath, token) => {
    const csvFile = fs.readFileSync(filePath)
    try {
        await axios.post(
            `${API_URL}sample/teste/`,
            {data: csvFile},
            {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            }).then(
            (response) => {
                return response.data
            })
    } catch (error) {
        const err = error
        if (err.response) {
           console.log(err.response.status, err.response.statusText, err.response.data)
        }
     }
}
