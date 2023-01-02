import {saveJson, appendStringToFile, parseJson} from './functions.js';
import {ERROR_PATH} from './constants.js';


export const handleDefaultRequestError = (errorRequest) => {
    if (errorRequest?.response?.status === 401) {
        console.log('You must authenticate to your Varstation account before using this command. Run `vars-cli auth` to authenticate.');
        process.exit();
    } else {
        handleGenericError(errorRequest);
    }
};

export const handleAuthenticationError = (errorRequest) => {
    if (errorRequest.response?.data?.nonFieldErrors) {
        console.log('Unable to authenticate. Check your email and password.');
    } else {
        handleGenericError(errorRequest);
    }
};

export const handleGenericError = (error) => {
    const timestamp = new Date();
    appendStringToFile(ERROR_PATH, `\n---------------------------- ${timestamp} --------------------------\n`);
    appendStringToFile(ERROR_PATH, parseErrorMessage(error));
    console.log('The request failed. Please, try again later. If the error processed to keep happening, please contact our support.');
    process.exit();
}

const parseErrorMessage = (error) => {
    if (error.stack) {
        return error.stack;
    }
    if (typeof error === 'object') {
        return parseJson(error)
    }
    return error;
}
