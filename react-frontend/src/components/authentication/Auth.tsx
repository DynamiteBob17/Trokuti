import React, {useState} from 'react';
import ICredentials, {areInvalidCredentials} from '../../entities/ICredentials.ts';
import {useAuth} from './AuthProvider.tsx';
import axios, {AxiosError} from 'axios';
import IError, {IErrors} from '../../entities/IError.ts';
import Loading from '../Loading.tsx';
import './Auth.scss';

function Auth() {
    const [credentials, setCredentials] = useState<ICredentials>({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [loggingIn, setLoggingIn] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>();
    const {localLogin, localSignup} = useAuth();

    const defaultErrMsg: string = 'Nešto je pošlo po krivu';

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (areInvalidCredentials(credentials)) {
            return;
        }

        setLoading(true);
        try {
            await localLogin(credentials);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error: AxiosError = e as AxiosError;

                if (error.response?.status === 401) {
                    setErrorMessage('Netočna lozinka');
                } else {
                    const resError: IError = error.response?.data as IError;
                    setErrorMessage(resError.message);
                }
            } else {
                console.error(e);
                setErrorMessage(defaultErrMsg);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (areInvalidCredentials(credentials)) {
            return;
        }

        setLoading(true);
        try {
            await localSignup(credentials);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error: AxiosError = e as AxiosError;

                if (error.response?.status === 401) {
                    setErrorMessage(defaultErrMsg);
                } else {
                    // @ts-ignore :)
                    if (typeof error.response?.data?.errors === 'undefined') {
                        const resError: IError = error.response?.data as IError;
                        setErrorMessage(resError.message);
                    } else {
                        const resErrors: IErrors = error.response.data as IErrors;

                        let newErrorMessage: string = '';
                        resErrors.errors.forEach(validationError => {
                            newErrorMessage += `${validationError.field} ${validationError.defaultMessage}\n`;
                        });

                        setErrorMessage(newErrorMessage);
                    }
                }
            } else {
                console.error(e);
                setErrorMessage(defaultErrMsg);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;

        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (typeof errorMessage !== 'undefined') {
            setErrorMessage(undefined);
        }
    }

    if (loading) {
        return (
            <Loading message={'Prijava u tijeku...'} spinner={'spinner'} />
        );
    }

    const loginSlashSignupMessage = loggingIn
        ? <p>Nemaš račun? <button onClick={() => {setLoggingIn(false); setErrorMessage(undefined);}}>Registriraj se</button></p>
        : <p>Već imaš račun? <button onClick={() => {setLoggingIn(true); setErrorMessage(undefined);}}>Prijavi se</button></p>;

    return (
        <div className={'login'}>
            <form onSubmit={loggingIn ? handleLoginSubmit : handleSignupSubmit}>
                <input
                    type='text'
                    placeholder='Korisničko ime'
                    value={credentials.username}
                    name={'username'}
                    onChange={handleChange}
                />
                <input
                    type='password'
                    placeholder='Zaporka'
                    value={credentials.password}
                    name={'password'}
                    onChange={handleChange}
                />
                <button type='submit' disabled={areInvalidCredentials(credentials)}>
                    {loggingIn ? 'Prijava' : 'Registracija'}
                </button>
            </form>
            {
                typeof errorMessage !== 'undefined' &&
                <p style={{color: 'red', fontSize: '14px', fontWeight: 'bold', fontStyle: 'italic'}}>{errorMessage}</p>
            }
            <div className={'lss_msg'}>
                {loginSlashSignupMessage}
            </div>
        </div>
    );
}

export default Auth;
