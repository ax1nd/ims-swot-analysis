# -----------------------------------------------------------------------------
# SWOT/ANAR ML API - Returns JSON-serializable analysis results
# Uses logic from ml.py; only essential imports.
# -----------------------------------------------------------------------------

import pandas as pd # type: ignore
import numpy as np # type: ignore
import os
from typing import Dict, Any

# Optional: use ml.py for load and model build
try:
    from ml import load_data, build_and_evaluate_model # type: ignore
except Exception:
    load_data = None
    build_and_evaluate_model = None

# --- Data loading ---
def load_data_api(filepath):
    if load_data:
        return load_data(filepath)
    if not filepath or not os.path.exists(filepath):
        return None
    if filepath.endswith('.csv'):
        return pd.read_csv(filepath)
    if filepath.endswith(('.xls', '.xlsx')):
        return pd.read_excel(filepath)
    return None

# --- Strength & Weakness (return dict) ---
def analyze_strengths_weaknesses_json(df):
    strength_grades = ['A', 'B']
    weakness_grades = ['D', 'F']
    df = df.copy()
    df['Date_of_Attempt'] = pd.to_datetime(df['Date_of_Attempt'], errors='coerce')
    latest_attempts = df.loc[df.groupby(['Candidate Email', 'Course Name'])['Date_of_Attempt'].idxmax()]
    result = []
    for email in latest_attempts['Candidate Email'].unique():
        student_data = latest_attempts[latest_attempts['Candidate Email'] == email]
        name = student_data['Candidate Name'].iloc[0]
        strengths = student_data[student_data['Grade'].isin(strength_grades)]['Course Name'].tolist()
        weaknesses = student_data[student_data['Grade'].isin(weakness_grades)]['Course Name'].tolist()
        result.append({
            'email': str(email),
            'name': str(name),
            'strengths': [str(s) for s in strengths],
            'weaknesses': [str(w) for w in weaknesses],
        })
    return result

# --- Course recommendations (return dict) ---
RECOMMENDATION_MAP = {
    'Python Programming': 'Advanced Python & Algorithms',
    'Data Structures': 'Complex Data Structures & Problem Solving',
    'Java Fundamentals': 'Object-Oriented Design in Java',
    'SQL Fundamentals': 'Advanced SQL & Database Management',
    'Web Development': 'Full-Stack Web Development Project',
    'Machine Learning Basics': 'Applied Machine Learning with Scikit-Learn',
    'Machine Learning Techniques': 'Advanced Deep Learning & Neural Networks',
    'Operating Systems': 'Advanced OS & Systems Programming',
    'Database Management Systems': 'Advanced Database Design & Optimization',
    'Theory of Computation': 'Formal Languages & Automata',
    'Software Development Practices': 'Agile & DevOps Engineering',
    'Design and Analysis of Algorithms': 'Competitive Programming & Advanced Algorithms',
}

def recommend_courses_json(df):
    weakness_grades = ['D', 'F']
    df = df.copy()
    df['Date_of_Attempt'] = pd.to_datetime(df['Date_of_Attempt'], errors='coerce')
    weak = df[df['Grade'].isin(weakness_grades)]
    if weak.empty:
        return []
    latest_weak = weak.loc[weak.groupby(['Candidate Email', 'Course Name'])['Date_of_Attempt'].idxmax()]
    result = []
    for email in latest_weak['Candidate Email'].unique():
        student_data = latest_weak[latest_weak['Candidate Email'] == email]
        name = student_data['Candidate Name'].iloc[0]
        recs = []
        for _, row in student_data.iterrows():
            weak_course = row['Course Name']
            if 'Course Suggestion' in row and pd.notna(row['Course Suggestion']):
                rec_course = row['Course Suggestion']
            else:
                rec_course = RECOMMENDATION_MAP.get(weak_course, 'General Skills Improvement')
            recs.append({'weakCourse': str(weak_course), 'recommendedCourse': rec_course})
        result.append({'email': str(email), 'name': str(name), 'recommendations': recs})
    return result

# --- Dashboard data (grade dist + avg per course) ---
def dashboard_data_json(df):
    grade_dist = df['Grade'].value_counts().sort_index()
    grade_distribution = {str(k): int(v) for k, v in grade_dist.items()}
    avg_per_course = df.groupby('Course Name')['Mark'].mean().sort_values(ascending=False)
    avg_marks_per_course = [{'course': str(k), 'avgMark': int(float(v) * 10) / 10.0} for k, v in avg_per_course.items()]
    return {'gradeDistribution': grade_distribution, 'avgMarksPerCourse': avg_marks_per_course}

# --- Per-student course-level detail ---
def student_courses_json(df, email):
    """Get per-course marks for a student."""
    student_df = df[df['Candidate Email'] == email]
    courses = []
    for _, row in student_df.iterrows():
        courses.append({
            'courseId': str(row.get('Course ID', '')),
            'courseName': str(row.get('Course Name', '')),
            'mark': int(row.get('Mark', 0)),
            'grade': str(row.get('Grade', '')),
        })
    return courses

def compute_overall_grade(avg_mark):
    if avg_mark >= 80: return 'A'
    if avg_mark >= 70: return 'B'
    if avg_mark >= 60: return 'C'
    if avg_mark >= 50: return 'D'
    return 'F'

# --- Model metrics + feature importance ---
def build_model_and_metrics(df):
    if build_and_evaluate_model is None:
        return None
    try:
        model, encoders = build_and_evaluate_model(df)
        # Feature importance from the trained model
        features = [
            'Candidate Email Encoded', 'Course ID Encoded', 'Attempt ID',
            'Student_Avg_Mark', 'Student_Attempt_Count',
            'Course_Avg_Mark', 'Course_Attempt_Count',
            'Day_of_Week', 'Month'
        ]
        importance = list(model.feature_importances_)
        feature_importance = [{'feature': f, 'importance': int(float(v) * 10000) / 10000.0} for f, v in zip(features, importance)]
        return {'featureImportance': feature_importance, 'model': model, 'encoders': encoders}
    except Exception as e:
        print(f'Model build error: {e}')
        return {'error': str(e)}

# --- Run full analysis and return everything for API ---
def run_full_analysis(filepath='data.csv'):
    df = load_data_api(filepath)
    if df is None:
        return {'error': 'Dataframe is empty'}
    
    df['Date_of_Attempt'] = pd.to_datetime(df['Date_of_Attempt'], errors='coerce')

    strengths_weaknesses = analyze_strengths_weaknesses_json(df)
    recommendations = recommend_courses_json(df)
    dashboard = dashboard_data_json(df)
    model_result = build_model_and_metrics(df)

    # Per-student summary for frontend
    by_email: Dict[str, Any] = {}
    for s in strengths_weaknesses:
        email = str(s['email'])
        # Compute per-student metrics
        courses = student_courses_json(df, email)
        student_marks = [c['mark'] for c in courses]
        avg_mark = int(float(sum([float(x) for x in student_marks]) / len(student_marks)) * 10) / 10.0 if student_marks else 0.0
        overall_grade = compute_overall_grade(avg_mark)

        by_email[email] = {
            'name': s.get('name', ''),
            'email': s.get('email', ''),
            'strengths': s.get('strengths', []),
            'weaknesses': s.get('weaknesses', []),
            'recommendations': [],
            'gradeDistribution': dashboard.get('gradeDistribution', {}),
            'avgMarksPerCourse': dashboard.get('avgMarksPerCourse', []),
            'courses': courses,
            'avgMark': avg_mark,
            'totalCourses': len(courses),
            'overallGrade': overall_grade,
        }
    for r in recommendations:
        ek = r.get('email')
        recs_list = r.get('recommendations', [])
        if ek and (str(ek) in by_email):
            # Update recommendations safely
            target_student = by_email.get(str(ek))
            if isinstance(target_student, dict):
                target_student['recommendations'] = recs_list # type: ignore

    out = {
        'success': True,
        'summary': {
            'totalRecords': int(len(df)),
            'gradeDistribution': dashboard.get('gradeDistribution', {}),
            'avgMarksPerCourse': dashboard.get('avgMarksPerCourse', []),
            'featureImportance': model_result.get('featureImportance', []) if (model_result and isinstance(model_result, dict)) else [],
        },
        'byStudent': by_email,
    }
    return out
