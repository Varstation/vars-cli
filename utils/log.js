export const logFailedRequest = (errorRequest) => {
    console.log('The request failed. Please, try again later. If the error processed to keep happening, please contact our support.');
};

export const handleDefaultRequestError = (errorRequest) => {
    if (errorRequest?.response?.status === 401) {
        console.log('You must authenticate to your Varstation account before using this command. Run `vars-cli auth` to authenticate.');
        process.exit();
    } else {
        logFailedRequest(errorRequest);
        process.exit();
    }
};

export const handleAuthenticationError = (errorRequest) => {
    if (errorRequest.response?.data?.nonFieldErrors) {
        console.log('Unable to authenticate. Check your email and password.');
    } else {
        logFailedRequest(errorRequest);
        process.exit();
    }
};

export const handleGenericError = (error) => {
    logFailedRequest(error);
    process.exit();
}
