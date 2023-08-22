import {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from './AuthProvider.tsx';

const UserRoute = (props: {children: ReactNode}) => {
    return useAuth().user ? props.children : <Navigate to={'/'} replace={true}/>
}

export default UserRoute;
