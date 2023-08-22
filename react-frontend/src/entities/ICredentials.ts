export default interface ICredentials {
    username: string,
    password: string
}

export interface IToken {
    token: string
}

export const areInvalidCredentials = (credentials: ICredentials): boolean => {
    return isInvalidUsername(credentials.username) || isInvalidPassword(credentials.password);
}

export const isInvalidUsername = (username: string): boolean => {
    return username.length <= 0 || username.length > 39;
}

export const isInvalidPassword = (password: string): boolean => {
    return password.length <= 0 || password.length > 100;
}
