import {Link} from 'react-router-dom';
import {useAuth} from './authentication/AuthProvider.tsx';
import './NavBar.scss';

function NavBar() {
    const {user, isAdmin, logout} = useAuth();

    if (!user) return <></>;

    return (
        <div className={'navbar'}>
            <div className={'navbar_left'}>
                <Link to={'/mojiTrokuti'}>Moji trokuti</Link>
                { isAdmin() && <Link to={'/admin'}>Administrator</Link> }
            </div>
            <div className={'navbar_right'}>
                <button onClick={() => logout()}>
                    Odjava
                </button>
            </div>
        </div>
    );
}

export default NavBar;
