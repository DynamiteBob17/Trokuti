import {useEffect, useState} from 'react';
import ITriangle from '../../entities/ITriangle.ts';
import TriangleEditor from './TriangleEditor.tsx';
import {initialTriangle} from './CreateTriangle.tsx';
import Loading from '../Loading.tsx';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import makeConfig from '../../util/axiosConfig.ts';
import {TOKEN_COOKIE_NAME, useAuth} from '../authentication/AuthProvider.tsx';
import {AxiosError} from 'axios';
import IError from '../../entities/IError.ts';
import './ModifyTriangle.scss';

function ModifyTriangle() {
    const [triangle, setTriangle] = useState<ITriangle>(Object.assign({}, initialTriangle));
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>();
    const {cookies} = useAuth();
    const routeParams = useParams();

    useEffect(() => {
        (async () => {
            try {
                const {data} = await axios<ITriangle>(makeConfig(
                   'GET', '/api/user/triangle/' + routeParams.id, cookies[TOKEN_COOKIE_NAME]
                ));

                setTriangle(data);
            } catch (e) {
                if (axios.isAxiosError(e)) {
                    const error: AxiosError = e as AxiosError;
                    const resError: IError = error.response?.data as IError;
                    setErrorMessage(resError.message);
                } else {
                    console.error(e);
                    setErrorMessage('Nešto je pošlo po krivu');
                }
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <Loading message={'Učitavanje trokuta ' + routeParams.id} spinner={'hourglass'} />;
    }

    return (
        <div className={'triangle_modify'}>
            {
                errorMessage
                    ? <p style={{color: 'red', textAlign: 'center'}}>{errorMessage}</p>
                    : <TriangleEditor
                        triangle={triangle}
                        setTriangle={setTriangle}
                        method={'PATCH'}
                        route={'/api/user/updateTriangle/' + routeParams.id}
                        buttonText={'Spremi'}
                    />
            }
        </div>
    );
}

export default ModifyTriangle;
