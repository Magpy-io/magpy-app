export class ErrorBackendUnreachable extends Error {
    constructor() {
        super();
        this.message = 'Backend server is unreachable';
    }
}

export class ErrorNoUserToken extends Error {
    constructor() {
        super();
        this.message = 'You need to log in first to get a user token';
    }
}
