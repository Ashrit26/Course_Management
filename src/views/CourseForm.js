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
  const [response, setResponse] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);


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

  const fetchRecommendations = (res) => {
    try{
      const newArray = []
      const responseData = res.map((entry) => {
        //const rArray = entry.recommendations;
        
        newArray.push(entry.recommendations);
        //return entry.recommendations
        //console.log(entry);
      })
    setResponse(newArray);
    //setResponse(responseData);
    console.log(response);
    }
    catch(error){
      console.error(`Error fetching response: ${error.message}`);

    }
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

    const submittedData = entries.map((entry, index) => {
      const courseName = getCourseName(entry.courseNumber);
      return {
        courseName,
        courseNumber: entry.courseNumber,
        selectedInstructor: entry.selectedInstructor,
      };
    });
    console.log('Form submitted:', submittedData);

    const response = await fetch('http://127.0.0.1:5000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submittedData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      const result = await response.json();
      console.log('API Response:', result);

    // Fetch risk levels for all entries
    await fetchRiskLevels();


    await fetchRecommendations(result);

    setShowRecommendations(true);

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
      <br />
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
            <p>{riskLevelData.riskLevel}</p>
          </div>
        ))}
        </div>

       { showRecommendations && ( <div className="risk-levels-container">
       {/* <h2>Recommendations</h2> */}
       
        {response.map((resArray, outerIndex) => (
          <ul> 
            <div key={outerIndex}>
              {resArray.map((element,innerIndex) => (
                <div key={innerIndex}>
                      <li key={innerIndex}>{element.course}<br />
                      {element.instructor}<br />
                      {element.risk_level}</li>
                      <br />
                      </div>
              ))}
            </div>
            </ul>
        ))} 
      </div> 
        )}

    </div>
  );
};

export default CourseForm;
