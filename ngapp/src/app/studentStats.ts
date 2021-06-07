export class StudentStats {
  _id: string;
  studentId: string;
  classroomId: string;
  studentUsername: string;
  grammarErrors: Map<string, number[]> = new Map();
  timeStamps: Map<string, Date[]> = new Map();
}