import axios from 'axios';
import { LOCAL_URL, TOKEN_PATH } from './constants.js';
import inquirer from 'inquirer';
import { saveJson } from './functions.js';

const makeAuthenticateRequest = async (email, password) => {
    return await axios.post(`${LOCAL_URL}account/token/`, { email, password }).then(
        (response) => {
            return response.data.token;
        }
    ).catch((err) => {
        console.log(err);
    });
};

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
    const token = await makeAuthenticateRequest(answers.email, answers.password);
    saveJson(TOKEN_PATH, token);
    return token;
};
