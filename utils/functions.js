import FormData from 'form-data';
import fs from 'fs';
import {DATA_FOLDER_PATH} from './constants.js';
import {API_URL} from './constants.js';
import {handleGenericError} from './log.js';

export const getJson = (filename) => {
    const path = `${DATA_FOLDER_PATH}/${filename}`;
    const data = fs.existsSync(path) ? fs.readFileSync(path) : undefined;
    try {
        return JSON.parse(data);
    } catch (e) {
        return undefined;
    }
};

export const appendStringToFile = (filename, data) => {
    createDataDirectoryIfDoesntExists();
    fs.appendFileSync(`${DATA_FOLDER_PATH}/${filename}`, data);
}


export const saveJson = (filename, data) => {
    createDataDirectoryIfDoesntExists();
    fs.writeFileSync(`${DATA_FOLDER_PATH}/${filename}`, parseJson(data));
};


export const parseJson = (data) => {
    return JSON.stringify(data, null, '\t');
}


const createDataDirectoryIfDoesntExists = () => {
    if (!fs.existsSync(DATA_FOLDER_PATH)) {
        fs.mkdirSync(DATA_FOLDER_PATH);
    }
};

export const isCsvFile = (filePath) => {
    return filePath.split('.').pop() === 'csv';
}

export const startProcess = (filePath, token) => {
    const csvFile = fs.createReadStream(filePath);

    const formData = new FormData();
    formData.append('file', csvFile, 'routines_to_create_samplesheet.csv');

    const params = new URL(`${API_URL}routine/csv/create_and_execute/`);

    formData.submit({
        port: params.port,
        path: params.pathname,
        host: params.hostname,
        protocol: params.protocol,
        headers: {'Authorization': `Token ${token}`}
    }, (err, response) => {
        logResponse(response);
    });
}

const logResponse = (response) => {
    let body = '';
    response.on('data', (chunk) => {
        body += chunk;
    });
    response.on('end', () => {
        console.log(body);
    });
}
