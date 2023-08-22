export default interface IError {
    message: string
}

export interface IValidationError {
    defaultMessage: string,
    field: string
}

export interface IValidationErrors extends Array<IValidationError> {}

export interface IErrors {
    errors: IValidationErrors
}
