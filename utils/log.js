export const logFailedRequest = () => {
    console.log('The request failed. Please, try again later. If the error processed to keep happening, please contact our support.');
}

export const handleRequestError = (error) => {
    if (error.response.status === 401) {
        console.log('You must authenticate to your Varstation account before using this command. Run `vars-cli auth` to authenticate.');
        process.exit();
    } else {
        logFailedRequest();
    }
}
