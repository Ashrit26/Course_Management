from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

df = pd.read_csv("Combined.csv")
df.drop(columns=['Course Number', 'Semester', 'Year', 'Seats Remaining', 'Sem'], inplace=True)
df['Course'] = df['Course'].astype('category')
df['Instructor'] = df['Instructor'].astype('category')
df['Risk Level'] = df['Risk Level'].astype('category')
df_course = pd.read_csv("courses.csv")

df_course['Instructors'] = df_course['Instructors'].apply(lambda x: x.split('; '))
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(df_course['Description'])

def recommend_courses(course, instructor, n=5):
    selected_course = df_course[(df_course['Course'] == course) & (df_course['Instructors'].apply(lambda x: instructor in x))]
    if len(selected_course) == 0:
        return []
      
    course_index = selected_course.index[0]
    similarities = cosine_similarity(tfidf_matrix[course_index], tfidf_matrix)
    similar_course_indices = similarities.argsort()[0][-n-1:-1][::-1]

    recommendations = []
    for idx in similar_course_indices:
        rec_course = df_course.iloc[idx]['Course']
        rec_instructor = df_course.iloc[idx]['Instructors'][0]
        rec_risk = df[(df['Course'] == rec_course) & (df['Instructor'] == rec_instructor)]['Risk Level'].values[0]
        recommendations.append({"course": rec_course, "instructor": rec_instructor, "risk_level": rec_risk})

    return recommendations
  
@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.json
    results = []
    for item in data:
        course_name = item['courseName']
        instructor = item['selectedInstructor']
        recommendations = recommend_courses(course_name, instructor)
        results.append({"courseName": course_name, "selectedInstructor": instructor, "recommendations": recommendations})
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
