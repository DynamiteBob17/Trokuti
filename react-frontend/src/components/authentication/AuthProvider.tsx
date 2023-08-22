import {createContext, ReactNode, useContext, useState} from 'react';
import {useCookies} from 'react-cookie';
import axios from 'axios';
import IUser, {ERoleName} from '../../entities/IUser.ts';
import makeConfig from '../../util/axiosConfig.ts';
import ICredentials, {IToken} from '../../entities/ICredentials.ts';

export const TOKEN_COOKIE_NAME: string = 'jwt';

const useValue = () => {
    const [user, setUser] = useState<IUser>();
    const [cookies, setCookies, removeCookie] = useCookies();

    const  authenticate = async () => {
        try {
            if (!cookies[TOKEN_COOKIE_NAME]) {
                return;
            }
            const {data} = await axios<IUser>(makeConfig('GET', '/api/user/me', cookies[TOKEN_COOKIE_NAME]));
            setUser(data);
        } catch (e) {
            console.error(e);
            logout();
        }
    }

    const localLogin = async (credentials: ICredentials) => {
        try {
            const {data} = await axios<IToken>(makeConfig('POST', '/auth/login', undefined, credentials));
            setCookies(TOKEN_COOKIE_NAME, data.token, {path: '/'});
            window.location.href = '/mojiTrokuti';
        } catch (e) {
            throw e; // :)
        }
    }

    const localSignup = async (credentials: ICredentials) => {
        try {
            const {data} = await axios<IToken>(makeConfig('POST', '/auth/signup', undefined, credentials));
            setCookies(TOKEN_COOKIE_NAME, data.token, {path: '/'});
            window.location.href = '/mojiTrokuti';
        } catch (e) {
            throw e; // :)
        }
    }

    const logout = () => {
        setUser(undefined);
        removeCookie(TOKEN_COOKIE_NAME, {path: '/'});
        window.location.href = '/';
    }

    const isAdmin = (): boolean => {
        return user?.roles.some(role => role.name === ERoleName.ADMIN) as boolean;
    }

    return {
        user,
        cookies,
        setCookies,
        authenticate,
        localLogin,
        localSignup,
        logout,
        isAdmin
    };
}

export const UserContext = createContext({} as ReturnType<typeof useValue>);
export const useAuth = () => useContext(UserContext);

export const UserProvider = (props: { children: ReactNode }) =>
    <UserContext.Provider value={useValue()}>
        {props.children}
    </UserContext.Provider>;
