import './CreateTriangle.scss';
import React, {ChangeEvent, useState} from 'react';
import ITriangle, {
    calculateArea,
    calculatePerimeter, determineTypeByAngles, determineTypeBySides,
    triangleTypeByAnglesDict, triangleTypeBySidesDict
} from '../../entities/ITriangle.ts';
import axios from 'axios';
import {IToken} from '../../entities/ICredentials.ts';
import makeConfig from '../../util/axiosConfig.ts';
import {TOKEN_COOKIE_NAME, useAuth} from '../authentication/AuthProvider.tsx';
import {useNavigate} from 'react-router-dom';
import './TriangleEditor.scss';

type TriangleEditorProps = {
    triangle: ITriangle,
    setTriangle: React.Dispatch<React.SetStateAction<ITriangle>>,
    method: 'POST' | 'PATCH',
    route: string,
    buttonText: string
};

function TriangleEditor({triangle, setTriangle, method, route, buttonText}: TriangleEditorProps) {
    const [saving, setSaving] = useState<boolean>(false);
    const {cookies} = useAuth();
    const navigate = useNavigate();

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 33) return;

        setTriangle(prevState => ({
            ...prevState,
            name: event.target.value
        }));
    }

    const handleCoordinateChange = (event: ChangeEvent<HTMLInputElement>) => {
        let {name, value} = event.target;
        const point: 'a' | 'b' | 'c' = name.split('.')[0] as 'a' | 'b' | 'c';
        const coord: 'x' | 'y' = name.split('.')[1] as 'x' | 'y';

        if (value === '') {
            value = '0';
        }

        setTriangle(prevState => ({
            ...prevState,
            [point]: {
                ...prevState[point],
                [coord]: parseInt(value)
            }
        }));
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (calculateArea(triangle) === 0 || !triangle.name) {
            return;
        }

        try {
            setSaving(true);

            await axios<IToken>(makeConfig(
                method, route, cookies[TOKEN_COOKIE_NAME], triangle)
            );

            navigate('/mojiTrokuti');
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    }

    const coords: string = `${triangle.a.x},${triangle.a.y} ${triangle.b.x},${triangle.b.y} ${triangle.c.x},${triangle.c.y}`;

    const area: number = calculateArea(triangle);
    let perimeter: number = -1, typeByAngles: string = '', typeBySides: string = '';
    if (area !== 0) {
        perimeter = calculatePerimeter(triangle);
        typeByAngles = triangleTypeByAnglesDict[determineTypeByAngles(triangle)];
        typeBySides = triangleTypeBySidesDict[determineTypeBySides(triangle)];
    }

    return (
        <div className={'triangle_editor'}>
            <form onSubmit={handleSubmit}>
                <input type={'text'} value={triangle.name} onChange={handleNameChange}
                       placeholder={'Ime trokuta (maks. 33 znakova)'}/>
                <div className={'coordinate_input'}>
                    <div>A</div>
                    <input name={'a.x'} value={triangle.a.x} onChange={handleCoordinateChange}/>
                    <input name={'a.y'} value={triangle.a.y} onChange={handleCoordinateChange}/>
                </div>
                <div className={'coordinate_input'}>
                    <div>B</div>
                    <input name={'b.x'} value={triangle.b.x} onChange={handleCoordinateChange}/>
                    <input name={'b.y'} value={triangle.b.y} onChange={handleCoordinateChange}/>
                </div>
                <div className={'coordinate_input'}>
                    <div>C</div>
                    <input name={'c.x'} value={triangle.c.x} onChange={handleCoordinateChange}/>
                    <input name={'c.y'} value={triangle.c.y} onChange={handleCoordinateChange}/>
                </div>
                <svg width={'33vw'} height={'33vh'}>
                    <polygon points={coords}></polygon>
                </svg>
                <p>Opseg = {perimeter.toFixed(2)}</p>
                <p style={{color: area === 0 ? 'red' : 'initial'}}>
                    Površina = {area.toFixed(2)} {area === 0 && 'NIJE TROKUT'}
                </p>
                <p>Vrsta po kutovima = {typeByAngles}</p>
                <p>Vrsta prema odnosu duljina stranica = {typeBySides}</p>
                <button type={'submit'} disabled={!triangle.name || area === 0 || saving}>{buttonText}</button>
            </form>
        </div>
    );
}

export default TriangleEditor;
