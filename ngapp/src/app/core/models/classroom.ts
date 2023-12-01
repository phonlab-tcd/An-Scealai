export class Classroom {
    _id: string;
    studentIds: string[];
    teacherId: string;
    createdAt?: Date;
    updatedAt?: Date;
    title: string;
    code: string;
    grammarCheckers: string[];
}