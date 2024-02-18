import React, { useState, useEffect } from 'react';
import courseData from 'data/courseData';
import 'styles/CourseForm.css'; // Import the CSS file
import combinedData from 'data/combinedData';

const CourseForm = () => {
  const [entries, setEntries] = useState([
    { courseNumber: '', selectedInstructor: '' },
    { courseNumber: '', selectedInstructor: '' },
    { courseNumber: '', selectedInstructor: '' },
    { courseNumber: '', selectedInstructor: '' },
  ]);

  const [riskLevels, setRiskLevels] = useState([]);

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

  const fetchRiskLevels = () => {
    try {
      const riskLevelsData = entries.map((entry) => {
        const courseName = getCourseName(entry.courseNumber);
        const instructorName = entry.selectedInstructor;


        //console.log('Fetching risk level for:', { courseName, instructorName });

        const matchingRow = combinedData.find(
          (row) => row['Course'] === courseName && row['Instructor'] === instructorName
        );

        if (matchingRow) {
          return { courseName, instructorName, riskLevel: matchingRow['Risk Level'] };
        } else {
          console.log('No matching record found for:', { courseName, instructorName });
          throw new Error('No matching record found');
        }
      });

      setRiskLevels(riskLevelsData);
    } catch (error) {
      console.error(`Error fetching risk levels: ${error.message}`);
    }
  };


  const handleSubmit = async () => {
    console.log('Form submitted:', entries);

    // Fetch risk levels for all entries
    await fetchRiskLevels();
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
                onChange={(e) => handleInputChange(index, 'selectedInstructor', e.target.value)}
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
      <button onClick={handleSubmit} className="submit-button" style={{ display: 'block', margin: 'auto' }}
      >
        Submit
      </button>
        {/* Display risk levels */}
        {/* <h2>Risk Levels</h2> */}
        <div className="risk-levels-container">
        {riskLevels.map((riskLevelData, index) => (
          <div key={index} className="risk-level-card">
            <h4>{riskLevelData.courseName}</h4>
            <p>{riskLevelData.instructorName}</p>
            <p>Risk Level: {riskLevelData.riskLevel}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseForm;
