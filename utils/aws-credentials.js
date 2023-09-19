import axios from 'axios';
import { AWS_CREDENTIALS_PATH, API_URL, AUTH_PATH } from './constants.js';
import { getJson, saveJson } from './functions.js';

export const getAwsCredentialsRequest = async (duration) => {
    const token = getJson(AUTH_PATH)?.token;
    let url = `${API_URL}account/user/get_permission_to_upload_cli/`;
    url = duration ? `${url}?role_duration_seconds=${duration}` : url;
    return await axios.get(
        url,
        {
            headers: {
                'Authorization': `Token ${token}`
            },
        }).then(
        (response) => {
            saveJson(AWS_CREDENTIALS_PATH, response.data);
            return response.data;
        }
    );
};

export const isCredentialsValid = (credentials) => {
    return !!credentials
        && new Date(credentials['Credentials']['Expiration']) > new Date();
};
