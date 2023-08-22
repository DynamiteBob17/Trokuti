import ITriangle, {ETriangleTypeByAngles, ETriangleTypeBySides} from '../../entities/ITriangle.ts';
import TriangleEditor from './TriangleEditor.tsx';
import {useState} from 'react';

import './CreateTriangle.scss';

export const initialTriangle: ITriangle = {
    name: '',
    a: {
        x: 200,
        y: 10
    },
    b: {
        x: 200,
        y: 200
    },
    c: {
        x: 10,
        y: 200
    },
    perimeter: -1,
    area: -1,
    typeByAngles: ETriangleTypeByAngles.RIGHT,
    typeBySides: ETriangleTypeBySides.ISOSCELES
}

function CreateTriangle() {
    const [triangle, setTriangle] = useState<ITriangle>(Object.assign({}, initialTriangle));

    return (
        <div className={'triangle_create'}>
            <TriangleEditor
                triangle={triangle}
                setTriangle={setTriangle}
                method={'POST'}
                route={'/api/user/createTriangle'}
                buttonText={'Kreiraj'}
            />
        </div>
    );
}

export default CreateTriangle;
