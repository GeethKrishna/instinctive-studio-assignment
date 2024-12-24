// stores/StudentStore.ts
import { create } from "zustand";

interface Course {
  id: string;
  name: string;
  code: string;
  avatar: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  cohort: string;
  dateJoined: Date;
  lastLogin: Date | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "GRADUATED";
  courses: Course[]; // Updated to handle multiple courses
}

type NewStudent = Omit<Student, "id" | "dateJoined" | "courses" | "lastLogin"> & {
  courseIds: string[];
};

interface StudentState {
  students: Student[];
  filteredStudents: Student[];
  isLoading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  addStudent: ( newStudent: NewStudent ) => Promise<void>;
  searchOnStudents: (query: string) => void;
  filterStudents: (cohort: string, courseId: string) => void;
  setError: (error: string | null) => void;
}

const useStudentStore = create<StudentState>((set) => ({
  students: [],
  filteredStudents: [],
  isLoading: false,
  error: null,

  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/students");
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      set({ students: data, filteredStudents: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },

  addStudent: async (newStudent) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newStudent,
          courseIds: newStudent.courseIds, // Send course IDs array
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      const createdStudent = await response.json();
      set((state) => ({
        students: [...state.students, createdStudent],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },

  searchOnStudents: (query) => {
    set((state) => ({
      filteredStudents: state.filteredStudents.filter((student) =>
        student.name.toLowerCase().startsWith(query.toLowerCase()) // Case-insensitive prefix match
      ),
    }));
  },

  filterStudents: (cohort: string, courseName: string) => {
    set((state) => {
      const filtered = state.students.filter((student) => {
        const matchesCohort = cohort ? student.cohort === cohort : true;
        const matchesCourse = courseName
          ? student.courses.some((course) => course.name === courseName)
          : true;
        return matchesCohort && matchesCourse;
      });
      return { filteredStudents: filtered };
    });
  },

  setError: (error) => set({ error }),
}));

export default useStudentStore;
