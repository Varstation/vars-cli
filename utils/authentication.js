import axios from 'axios';
import { API_URL, AUTH_PATH } from './constants.js';
import inquirer from 'inquirer';
import { saveJson } from './functions.js';

const makeAuthenticateRequest = async (email, password) => {
    return await axios.post(`${API_URL}account/token/`, { email, password }).then(
        (response) => {
            return response.data;
        }
    );
};

const makeUserDetailRequest = async (userId, token) => {
    return await axios.get(`${API_URL}account/user/${userId}`,
        {
            headers: {
                'Authorization': `Token ${token}`
            }
        }).then(
        (response) => {
            return response.data;
        }
    );
}


export const authenticate = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'email',
            message: 'Type your email:'
        },
        {
            type: 'password',
            name: 'password',
            mask: true,
            message: 'Type your password:'
        }
    ]);
    const data = await makeAuthenticateRequest(answers.email, answers.password);
    const user = await makeUserDetailRequest(data.user.id, data.token);
    const authInfo = {
        token: data.token,
        user,
    };
    saveJson(AUTH_PATH, authInfo);
    return authInfo;
};
