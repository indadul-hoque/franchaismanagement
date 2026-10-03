import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';

const CourseTable = () => {
  const courses = [
    { id: 1, name: 'Java', professor: 'John Kery', fees: '130$' },
    { id: 2, name: 'Php', professor: 'Johnson', fees: '150$' },
    { id: 3, name: 'Angular', professor: 'Kevin Owens', fees: '120$' },
    { id: 4, name: 'React JS', professor: 'Kety Perey', fees: '170$' },
  ];

  return (
    <div className="course-table">
      <div className="card-header">
        <h3>Course Table</h3>
        <button className="btn-icon"><FaEllipsisV /></button>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Courses</th>
              <th>Professors</th>
              <th>Fees</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.professor}</td>
                <td>{course.fees}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;