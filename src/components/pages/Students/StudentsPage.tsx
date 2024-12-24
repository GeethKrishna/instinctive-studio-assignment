import React, { useState, useEffect } from "react";
import TopBar from "@/components/pages/Students/TopBar"
import Loader from "@/components/Loader";
import useStudentStore from "@/stores/StudentStore"
import StudentForm from "./StudentForm";
import { PlusIcon } from "lucide-react";
import { format } from 'date-fns';
import Image from "next/image";

const StudentsComponent: React.FC = () => {
  const { students, filteredStudents, isLoading, fetchStudents, filterStudents} = useStudentStore();
  const [addingStudent, setAddingStudent] = useState(false);
  const [cohortFilter, setCohortFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const uniqueCohorts = Array.from(new Set(students.map(student => student.cohort)));
  const uniqueCourses = Array.from(
    new Set(students.flatMap(student => student.courses.map(course => course.name)))
  );

  useEffect(() => {
    filterStudents(cohortFilter, courseFilter);
  }, [cohortFilter, courseFilter, filterStudents]);

  useEffect(() => {
    fetchStudents();
  }, []);

  if (isLoading) {
    return <Loader/>;
  }

  return (
    <div className={`w-full h-full flex flex-col justify-start items-center z-0 bg-gray-100 p-4 gap-3 overflow-auto`}>
      <div className="w-full">
        <TopBar />
      </div>
      <div className="container mx-auto p-4 bg-white rounded-lg">
      <div className="w-full flex flex-row justify-between mb-2">
      <div className="flex flex-row gap-4">
        {/* Cohort Filter Dropdown */}
        <div className="w-1/2">
          <select
            className="w-full p-2 border-0 bg-gray-200 text-gray-600 font-semibold rounded-lg focus:outline-none"
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value)}
          >
            <option value="">Select Cohort</option>
            {uniqueCohorts.map((cohort) => (
              <option key={cohort} value={cohort}>
                {cohort}
              </option>
            ))}
          </select>
        </div>

        {/* Course Filter Dropdown */}
        <div className="w-1/2">
          <select
            className="w-full p-2 border-0 bg-gray-200 text-gray-600 font-semibold rounded-lg focus:outline-none"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="">Select Course</option>
            {uniqueCourses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Student Button */}
      <div
        className="flex flex-row items-center bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-lg gap-2 cursor-pointer hover:bg-gray-300"
        onClick={() => setAddingStudent(!addingStudent)}
      >
        <PlusIcon size={22} />
        <p>Add new Student</p>
      </div>
    </div>
        <table className="table-auto w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-4 py-2 text-left max-w-40">Student Name</th>
              <th className="px-4 py-2 text-center max-w-20">Cohort</th>
              <th className="px-4 py-2 text-center min-w-14 max-w-20">Courses</th>
              <th className="px-4 py-2 text-center">Date Joined</th>
              <th className="px-4 py-2 text-center">Last Login</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          { filteredStudents.length === 0 ? <tbody><tr><td>No Students Found</td></tr></tbody> :
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="cursor-pointer border-b border-gray-300"
                >
                  <td className=" px-4 py-2 text-left max-w-20">{student.name}</td>
                  <td className=" px-4 py-2 text-center max-w-20">{student.cohort}</td>
                  <td className=" px-4 py-2 text-center">
                    <div className="flex flex-row gap-2 items-center justify-center">
                      {
                        student.courses.map((course) => (
                          <div key={course.id} className="flex flex-row gap-1 p-2 bg-gray-200 rounded-md items-center justify-center">
                            <Image src={course.avatar} width={25} height={25} alt={course.name} className="rounded-md"/>
                            <span>{course.name}</span>
                          </div>
                        ))
                      }
                    </div>
                  </td>
                  <td className=" px-4 py-2 text-center"><span>{format(student.dateJoined, 'dd. MMM. yyyy')}</span></td>
                  <td className=" px-4 py-2 text-center">{student.lastLogin ? format(student.lastLogin, 'dd. MMM. yyyy h:mm a') : "-"}</td>
                  <td className=" px-4 py-2 text-center">
                    <div className="w-full h-full flex justify-center items-center">
                      <p className={`w-4 h-4 rounded-full ${student.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}></p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          }
        </table>
      </div>
      {addingStudent && (
        <>
          {/* Background Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-70 z-40" onClick={() => setAddingStudent(false)}/>
           {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <StudentForm onClose={() => setAddingStudent(false)} />
            </div>
        </>
      )}
    </div>
  );
};

export default StudentsComponent;