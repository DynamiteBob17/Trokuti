import {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from './AuthProvider.tsx';

const AdminRoute = (props: {children: ReactNode}) => {
    return useAuth().isAdmin()
        ? props.children
        : <Navigate to={'/mojiTrokuti'} replace={true}/>;
}

export default AdminRoute;
