import {useAuth} from './authentication/AuthProvider.tsx';
import './NavBar.scss';
import {Button} from '@mui/material';

function NavBar() {
    const {user, isAdmin, logout} = useAuth();

    if (!user) return <></>;

    return (
        <div className={'navbar'}>
            <div className={'navbar_left'}>
                <Button href={'/mojiTrokuti'}>Moji trokuti</Button>
                { isAdmin() && <Button href={'/admin'}>Administrator</Button> }
            </div>
            <div className={'navbar_right'}>
                <Button variant={'contained'} disableElevation size={'small'} onClick={() => logout()}>
                    Odjava
                </Button>
            </div>
        </div>
    );
}

export default NavBar;
