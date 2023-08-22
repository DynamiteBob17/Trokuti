export interface IPoint {
    x: number,
    y: number
}

export enum ETriangleTypeByAngles {
    RIGHT = 'RIGHT', ACUTE = 'ACUTE', OBTUSE = 'OBTUSE'
}

export const triangleTypeByAnglesDict = {
    [ETriangleTypeByAngles.RIGHT]: 'pravokutan',
    [ETriangleTypeByAngles.ACUTE]: 'siljastokutan',
    [ETriangleTypeByAngles.OBTUSE]: 'tupokutan',
}

export enum ETriangleTypeBySides {
    EQUILATERAL = 'EQUILATERAL', ISOSCELES = 'ISOSCELES', SCALENE = 'SCALENE'
}

export const triangleTypeBySidesDict = {
    [ETriangleTypeBySides.EQUILATERAL]: 'jednakostranican',
    [ETriangleTypeBySides.ISOSCELES]: 'jednakokracan',
    [ETriangleTypeBySides.SCALENE]: 'raznostranican',
}

export default interface ITriangle {
    id?: number,
    name: string,
    a: IPoint,
    b: IPoint,
    c: IPoint,
    perimeter: number,
    area: number,
    typeByAngles: ETriangleTypeByAngles,
    typeBySides: ETriangleTypeBySides
}

export interface ITriangles extends Array<ITriangle> {}

export const calculatePerimeter = (triangle: ITriangle): number => {
    return Math.sqrt(euclidDistSquare(triangle.a, triangle.b))
        + Math.sqrt(euclidDistSquare(triangle.b, triangle.c))
        + Math.sqrt(euclidDistSquare(triangle.c, triangle.a));
}

export const calculateArea = (triangle: ITriangle): number => {
    return (1. / 2) * Math.abs(
        triangle.a.x * (triangle.b.y - triangle.c.y)
        + triangle.b.x * (triangle.c.y - triangle.a.y)
        + triangle.c.x * (triangle.a.y - triangle.b.y)
    );
}

export const determineTypeByAngles = (triangle: ITriangle): ETriangleTypeByAngles => {
    const ab2: number = euclidDistSquare(triangle.a, triangle.b),
        bc2: number = euclidDistSquare(triangle.b, triangle.c),
        ca2: number = euclidDistSquare(triangle.c, triangle.a);

    const sorted: Array<number> = [ab2, bc2, ca2].sort();
    const sideA: number = sorted[0];
    const sideB: number = sorted[1];
    const sideC: number = sorted[2];

    if (sideA + sideB > sideC) {
        return ETriangleTypeByAngles.ACUTE;
    } else if (sideA + sideB === sideC) {
        return ETriangleTypeByAngles.RIGHT;
    } else {
        return ETriangleTypeByAngles.OBTUSE;
    }
}

export const determineTypeBySides = (triangle: ITriangle): ETriangleTypeBySides => {
    const ab: number = Math.sqrt(euclidDistSquare(triangle.a, triangle.b)),
        bc: number = Math.sqrt(euclidDistSquare(triangle.b, triangle.c)),
        ca: number = Math.sqrt(euclidDistSquare(triangle.c, triangle.a));

    if (ab === bc && bc === ca) {
        return ETriangleTypeBySides.EQUILATERAL;
    } else if (ab === bc || bc === ca) {
        return ETriangleTypeBySides.ISOSCELES;
    } else {
        return ETriangleTypeBySides.SCALENE;
    }
}

export const euclidDistSquare = (p: IPoint, q: IPoint): number => {
    return Math.pow(q.x - p.x, 2)
        + Math.pow(q.y - p.y, 2);
}
