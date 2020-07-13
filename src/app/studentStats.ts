export class StudentStats {
  _id: string;
  studentId: string;
  classroomId: string;
  studentUsername: string;
  grammarErrors: Map<string, number> = new Map();
}