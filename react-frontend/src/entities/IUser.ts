export enum ERoleName {
    ADMIN = 'ROLE_ADMIN',
    USER = 'ROLE_USER'
}

export interface IRole {
    name: ERoleName
}

export interface IRoles extends Array<IRole> {}

export default interface IUser {
    id: number,
    username: string,
    roles: IRoles
}

export interface IUsers extends Array<IUser> {}
