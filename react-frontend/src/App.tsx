import './App.scss';
import {Navigate, Route, Routes} from 'react-router-dom';
import Auth from './components/authentication/Auth.tsx';
import {useAuth} from './components/authentication/AuthProvider.tsx';
import UserRoute from './components/authentication/UserRoute.tsx';
import Admin from './components/admin/Admin.tsx';
import {useEffect, useState} from 'react';
import Loading from './components/Loading.tsx';
import AdminRoute from './components/authentication/AdminRoute.tsx';
import NavBar from './components/NavBar.tsx';
import Triangles from './components/triangles/Triangles.tsx';
import CreateTriangle from './components/triangles/CreateTriangle.tsx';
import ModifyTriangle from './components/triangles/ModifyTriangle.tsx';

function App() {
    const [authenticating, setAuthenticating] = useState<boolean>(true);
    const {user, authenticate} = useAuth();

    useEffect(() => {
        if (!user) {
            (async () => {
                await authenticate();
                setAuthenticating(false);
            })();
        } else {
            setAuthenticating(false);
        }
    }, []);

    if (authenticating) {
        return (
            <Loading message={'Autentifikacija u tijeku...'} spinner={'ring'} />
        );
    }

    return (
        <>
            <NavBar />
            <Routes>
                <Route index element={user ? <Navigate to={'mojiTrokuti'}/> : <Auth/>} />
                <Route path={'mojiTrokuti'} element={<UserRoute><Triangles /></UserRoute>} />
                <Route path={'kreirajTrokut'} element={<UserRoute><CreateTriangle /></UserRoute>} />
                <Route path={'urediTrokut/:id'} element={<UserRoute><ModifyTriangle /></UserRoute>} />
                <Route path={'admin'} element={<AdminRoute><Admin /></AdminRoute>} />
                <Route path={'*'} element={<>Ovdje nema ništa.</>} />
            </Routes>
        </>
    );
}

export default App;
