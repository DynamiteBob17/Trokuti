import {useEffect, useState} from 'react';
import ITriangle, {ITriangles, triangleTypeByAnglesDict, triangleTypeBySidesDict} from '../../entities/ITriangle.ts';
import Loading from '../Loading.tsx';
import makeConfig from '../../util/axiosConfig.ts';
import axios from 'axios';
import {Link} from 'react-router-dom';
import IGenericApiResponse from '../../entities/IGenericApiResponse.ts';
import {TOKEN_COOKIE_NAME, useAuth} from '../authentication/AuthProvider.tsx';
import './Triangles.scss';
import jsPDF from 'jspdf';

function Triangles() {
    const [triangles, setTriangles] = useState<ITriangles>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const {cookies} = useAuth();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios<ITriangles>(makeConfig(
                    'GET', '/api/user/triangles', cookies[TOKEN_COOKIE_NAME]
                ));

                setTriangles(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleDelete = async (triangle: ITriangle) => {
        if (!window.confirm('Jeste li sigurni da želite trajno izbrisati trokut?')) {
            return;
        }

        try {
            setDeleting(true);

            const { data } = await axios<IGenericApiResponse>(makeConfig(
                'DELETE', '/api/user/deleteTriangle/' + triangle.id, cookies[TOKEN_COOKIE_NAME]
            ));

            console.log(data.message);

            setTriangles(triangles.filter(t => t.id !== triangle.id));
        } catch (e) {
            console.error(e);
        } finally {
            setDeleting(false);
        }
    }

    const generatePDF = (triangle: ITriangle) => {
        const doc = new jsPDF();
        doc.text('Podaci o trokutu:', 10, 10);
        doc.text(`- Naziv: ${triangle.name}`, 10, 30);
        doc.text(`- Opseg: ${triangle.perimeter}`, 10, 40);
        doc.text(`- Povrsina: ${triangle.area}`, 10, 50);
        doc.text(`- Vrsta po kutovima: ${triangleTypeByAnglesDict[triangle.typeByAngles]}`, 10, 60);
        doc.text(`- Vrsta prema odnosu duljina stranica: ${triangleTypeBySidesDict[triangle.typeBySides]}`, 10, 70);
        doc.text('Vizualni prikaz trokuta:', 10, 90);
        doc.triangle(
            triangle.a.x * 0.2 + 10,
            triangle.a.y * 0.2 + 100,
            triangle.b.x * 0.2 + 10,
            triangle.b.y * 0.2 + 100,
            triangle.c.x * 0.2 + 10,
            triangle.b.y * 0.2 + 100
        );
        doc.save(`trokut - ${triangle.name}.pdf`);
    };

    if (loading) {
        return <Loading message={'Učitavanje trokuta...'} spinner={'hourglass'} />;
    }

    return (
        <div className={'triangles'}>
            <Link to={'/kreirajTrokut'}>Kreiraj novi trokut</Link>
            <p>Moji trokuti:</p>
            <table>
                <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Opseg</th>
                    <th>Površina</th>
                    <th>Vrsta po kutovima</th>
                    <th>Vrsta po stranicama</th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {
                    triangles.map(triangle =>
                        <tr key={triangle.id}>
                            <td>{triangle.name}</td>
                            <td>{triangle.perimeter.toFixed(2)}</td>
                            <td>{triangle.area.toFixed(2)}</td>
                            <td>{triangleTypeByAnglesDict[triangle.typeByAngles]}</td>
                            <td>{triangleTypeBySidesDict[triangle.typeBySides]}</td>
                            <td>
                                <Link className={'triangle_edit_link'} to={'/urediTrokut/' + triangle.id}>
                                    Uredi
                                </Link>
                            </td>
                            <td>
                                <button onClick={() => generatePDF(triangle)}>
                                    Preuzmi
                                </button>
                            </td>
                            <td>
                                <button
                                    className={'delete_button'}
                                    onClick={() => handleDelete(triangle)}
                                    disabled={deleting}
                                >
                                    Izbriši
                                </button>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    );
}

export default Triangles;
