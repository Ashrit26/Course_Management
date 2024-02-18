import React, { useState } from 'react';
import courseData from 'data/courseData';
import 'styles/CourseForm.css'; // Import the CSS file

const CourseForm = () => {
  const [entries, setEntries] = useState([
    { courseNumber: '', selectedInstructor: '' },
    { courseNumber: '', selectedInstructor: '' },
    { courseNumber: '', selectedInstructor: '' },
    { courseNumber: '', selectedInstructor: '' },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index][field] = value;
    setEntries(updatedEntries);
  };

  const getInstructorsForCourse = (courseNumber) => {
    const course = courseData.find((c) => c.courseNumber === courseNumber);
    return course ? course.instructors : [];
  };

  const getCourseName = (courseNumber) => {
    const course = courseData.find((c) => c.courseNumber === courseNumber);
    return course ? course.courseName[0] : 'Unknown Course';
  };

  const handleSubmit = () => {
    // Add your submission logic here

    const submittedData = entries.map((entry, index) => {
      const courseName = getCourseName(entry.courseNumber);
      return {
        courseName,
        courseNumber: entry.courseNumber,
        selectedInstructor: entry.selectedInstructor,
      };
    });
  
    console.log('Form submitted1:', submittedData);
  };

  return (
    <div className="content">

      {entries.map((entry, index) => (
        <div key={index} className="form-row">
          <div className="label-group">
            <label>
              Course Number:
              <input
                type="text"
                value={entry.courseNumber}
                onChange={(e) => handleInputChange(index, 'courseNumber', e.target.value)}
              />
            </label>
            <label>
              Instructors:
              <select
                value={entry.selectedInstructor}
                onChange={(e) =>
                  handleInputChange(index, 'selectedInstructor', e.target.value)
                }
              >
                <option value="">Select an Instructor</option>
                {getInstructorsForCourse(entry.courseNumber).map((instructor, i) => (
                  <option key={i} value={instructor}>
                    {instructor}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </div>
  );
};

export default CourseForm;
