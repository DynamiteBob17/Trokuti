import {AxiosRequestConfig} from 'axios';

export default function makeConfig(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    route: string,
    token?: string,
    data?: object
): AxiosRequestConfig {
    return {
        method: method,
        url: import.meta.env.VITE_API_ORIGIN + route,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (typeof token !== 'undefined' ? token : '')
        },
        withCredentials: typeof token !== 'undefined',
        data: data
    };
}