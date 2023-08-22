import {useEffect, useState} from 'react';
import {IUsers} from '../../entities/IUser.ts';
import Loading from '../Loading.tsx';
import axios from 'axios';
import makeConfig from '../../util/axiosConfig.ts';
import {TOKEN_COOKIE_NAME, useAuth} from '../authentication/AuthProvider.tsx';
import './Admin.scss';

function Admin() {
    const [users, setUsers] = useState<IUsers>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {cookies} = useAuth();

    useEffect(() => {
        (async () => {
            try {
                const {data} = await axios<IUsers>(makeConfig(
                    'GET', '/api/admin/users', cookies[TOKEN_COOKIE_NAME]
                ));

                setUsers(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <Loading message={'Učitavanje korisnika...'} spinner={'ring'} />;
    }

    return (
        <div className={'admin'}>
            <p>Korisnici:</p>
            <ol>
                {
                    users.map(user => <li key={user.id}>{user.username}</li>)
                }
            </ol>
        </div>
    );
}

export default Admin;
