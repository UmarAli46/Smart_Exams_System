export interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  department: string;
  semester: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Teacher {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
  subjectsCount: number;
  createdAt: string;
}

export interface Subject {
  id: number;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  teachersCount?: number;
  examsCount?: number;
  createdAt: string;
}
