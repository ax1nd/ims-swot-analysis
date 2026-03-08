# -----------------------------------------------------------------------------
# SWOT/ANAR ML API - Returns JSON-serializable analysis results
# Uses logic from ml.py; only essential imports.
# -----------------------------------------------------------------------------

import pandas as pd
import numpy as np
import os

# Optional: use ml.py for load and model build
try:
    from ml import load_data, build_and_evaluate_model
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
}

def recommend_courses_json(df):
    weakness_grades = ['D', 'F']
    df = df.copy()
    df['Date_of_Attempt'] = pd.to_datetime(df['Date_of_Attempt'], errors='coerce')
    weak = df[df['Grade'].isin(weakness_grades)]
    latest_weak = weak.loc[weak.groupby(['Candidate Email', 'Course Name'])['Date_of_Attempt'].idxmax()]
    result = []
    for email in latest_weak['Candidate Email'].unique():
        student_data = latest_weak[latest_weak['Candidate Email'] == email]
        name = student_data['Candidate Name'].iloc[0]
        recs = []
        for _, row in student_data.iterrows():
            weak_course = row['Course Name']
            rec_course = RECOMMENDATION_MAP.get(weak_course, 'General Skills Improvement')
            recs.append({'weakCourse': str(weak_course), 'recommendedCourse': rec_course})
        result.append({'email': str(email), 'name': str(name), 'recommendations': recs})
    return result

# --- Dashboard data (grade dist + avg per course) ---
def dashboard_data_json(df):
    grade_dist = df['Grade'].value_counts().sort_index()
    grade_distribution = {str(k): int(v) for k, v in grade_dist.items()}
    avg_per_course = df.groupby('Course Name')['Mark'].mean().sort_values(ascending=False)
    avg_marks_per_course = [{'course': str(k), 'avgMark': round(float(v), 1)} for k, v in avg_per_course.items()]
    return {'gradeDistribution': grade_distribution, 'avgMarksPerCourse': avg_marks_per_course}

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
        feature_importance = [{'feature': f, 'importance': round(float(v), 4)} for f, v in zip(features, importance)]
        return {'featureImportance': feature_importance, 'model': model, 'encoders': encoders}
    except Exception as e:
        return {'error': str(e)}

# --- Run full analysis and return everything for API ---
def run_full_analysis(filepath='data.csv'):
    df = load_data_api(filepath)
    if df is None or df.empty:
        return {'error': 'Could not load data', 'filepath': filepath}

    df['Date_of_Attempt'] = pd.to_datetime(df['Date_of_Attempt'], errors='coerce')

    strengths_weaknesses = analyze_strengths_weaknesses_json(df)
    recommendations = recommend_courses_json(df)
    dashboard = dashboard_data_json(df)
    model_result = build_model_and_metrics(df)

    # Per-student summary for frontend
    by_email = {}
    for s in strengths_weaknesses:
        by_email[s['email']] = {
            'name': s['name'],
            'email': s['email'],
            'strengths': s['strengths'],
            'weaknesses': s['weaknesses'],
            'recommendations': [],
            'gradeDistribution': dashboard['gradeDistribution'],
            'avgMarksPerCourse': dashboard['avgMarksPerCourse'],
        }
    for r in recommendations:
        if r['email'] in by_email:
            by_email[r['email']]['recommendations'] = r['recommendations']

    out = {
        'success': True,
        'summary': {
            'totalRecords': int(len(df)),
            'gradeDistribution': dashboard['gradeDistribution'],
            'avgMarksPerCourse': dashboard['avgMarksPerCourse'],
            'featureImportance': model_result.get('featureImportance', []) if model_result and isinstance(model_result, dict) else [],
        },
        'byStudent': by_email,
    }
    return out
