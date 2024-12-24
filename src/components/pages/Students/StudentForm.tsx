import React, { useState, useEffect } from "react";
import { X, UserPlus, BookOpen, Tag } from "lucide-react";
import useStudentStore from "@/stores/StudentStore";

interface Course {
  id: string;
  name: string;
  code: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  cohort: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "GRADUATED";
  courses: Course[]; // Updated to handle multiple courses
}

interface StudentFormProps {
  onClose: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onClose }) => {
  const { addStudent, isLoading, error } = useStudentStore();
  const [student, setStudent] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    cohort: "",
    status: "ACTIVE",
    courses: [],
  });
  const [courses, setCourses] = useState<Course[]>([]);

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseSelect = (courseId: string) => {
    const selectedCourse = courses.find((course) => course.id === courseId);

    if (selectedCourse) {
      setStudent((prev) => ({
        ...prev,
        courses: prev.courses.some((c) => c.id === courseId)
          ? prev.courses // Prevent duplicates
          : [...prev.courses, selectedCourse],
      }));
    }
  };

  const handleCourseRemove = (courseId: string) => {
    setStudent((prev) => ({
      ...prev,
      courses: prev.courses.filter((course) => course.id !== courseId),
    }));
  };

  const handleSubmit = async () => {
    const newStudent = {
      ...student,
      courseIds: student.courses.map((course) => course.id), // Send course IDs to the backend
    };

    try {
      await addStudent(newStudent);
      onClose(); // Close the form on success
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <div className="max-w-[60%] rounded-xl bg-white absolute z-20 mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {/* Header */}
      <div className="relative bg-gray-500 p-6 rounded-t-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <UserPlus className="w-6 h-6 text-white animate-pulse" />
            <h2 className="text-2xl font-bold text-white">Register New Student</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 space-y-6">
        {error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-md">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name
            </label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={(e) => setStudent({ ...student, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter student name..."
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={(e) => setStudent({ ...student, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter email..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cohort
          </label>
          <input
            type="text"
            name="cohort"
            value={student.cohort}
            onChange={(e) => setStudent({ ...student, cohort: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none"
            placeholder="Enter cohort (e.g., 2024)..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Courses
          </label>
          <select
            onChange={(e) => handleCourseSelect(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none"
          >
            <option value="">Select a course...</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap mt-3 space-x-2">
            {student.courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-300"
              >
                <span>{course.name}</span>
                <button onClick={() => handleCourseRemove(course.id)}>
                  <Tag className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 bg-white rounded-xl">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-500 text-white hover:bg-gray-600 transform transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:outline-none"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>{isLoading ? "Registering..." : "Register Student"}</span>
        </button>
      </div>
    </div>
  );
};

export default StudentForm;
