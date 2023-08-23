import {useEffect, useState} from 'react';
import ITriangle, {ITriangles, triangleTypeByAnglesDict, triangleTypeBySidesDict} from '../../entities/ITriangle.ts';
import Loading from '../Loading.tsx';
import makeConfig from '../../util/axiosConfig.ts';
import axios from 'axios';
import IGenericApiResponse from '../../entities/IGenericApiResponse.ts';
import {TOKEN_COOKIE_NAME, useAuth} from '../authentication/AuthProvider.tsx';
import './Triangles.scss';
import jsPDF from 'jspdf';
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

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
            <Button variant={'outlined'} color={'info'} style={{textTransform: 'none'}} href={'/kreirajTrokut'}>Kreiraj novi trokut</Button>
            <h2 style={{fontStyle: 'italic'}}>Moji trokuti:</h2>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <th>Naziv</th>
                            <th>Opseg</th>
                            <th>Površina</th>
                            <th>Vrsta po kutovima</th>
                            <th>Vrsta po stranicama</th>
                            <th>Opcije</th>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            triangles.map(triangle =>
                                <TableRow key={triangle.id}>
                                    <TableCell>{triangle.name}</TableCell>
                                    <TableCell>{triangle.perimeter.toFixed(2)}</TableCell>
                                    <TableCell>{triangle.area.toFixed(2)}</TableCell>
                                    <TableCell>{triangleTypeByAnglesDict[triangle.typeByAngles]}</TableCell>
                                    <TableCell>{triangleTypeBySidesDict[triangle.typeBySides]}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant={'contained'}
                                            color={'info'}
                                            size={'small'}
                                            onClick={() => generatePDF(triangle)}
                                        >
                                            Preuzmi
                                        </Button>
                                        <Button
                                            variant={'contained'}
                                            color={'warning'}
                                            size={'small'}
                                            className={'triangle_edit_link'}
                                            href={'/urediTrokut/' + triangle.id}
                                        >
                                            Uredi
                                        </Button>
                                        <Button
                                            variant={'contained'}
                                            color={'error'}
                                            size={'small'}
                                            className={'delete_button'}
                                            onClick={() => handleDelete(triangle)}
                                            disabled={deleting}
                                        >
                                            Izbriši
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Triangles;
