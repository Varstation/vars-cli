export class User {
    constructor(email, token) {
        this.email = email;
        this.token = token;
    }

    addCredentials(accessKey, secretAccessKey, sessionToken, expiration) {
        this.accessKey = accessKey;
        this.secretAccessKey = secretAccessKey;
        this.sessionToken = sessionToken;
        this.expiration = expiration;
    }
}
