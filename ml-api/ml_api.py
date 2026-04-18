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

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

# --- Data loading ---
def load_data_api(filepath):
    # Try database first
    db_host = os.environ.get('DB_HOST')
    if db_host:
        db_user = os.environ.get('DB_USER', 'root')
        db_password = os.environ.get('DB_PASSWORD', '')
        db_name = os.environ.get('DB_NAME', 'ims_db')
        db_port = os.environ.get('DB_PORT', '3306')
        connection_url = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        try:
            engine = create_engine(connection_url)
            query = \"\"\"
            SELECT
              c.course_code   AS 'Course ID',
              c.course_name   AS 'Course Name',
              1               AS 'Attempt ID',
              s.name          AS 'Candidate Name',
              s.email         AS 'Candidate Email',
              CAST(ROUND((m.cat1_total + m.cat2_total + m.cat3_total) * 100.0 / 125, 0) AS SIGNED) AS 'Mark',
              CASE
                WHEN (m.cat1_total + m.cat2_total + m.cat3_total) * 100.0 / 125 >= 80 THEN 'A'
                WHEN (m.cat1_total + m.cat2_total + m.cat3_total) * 100.0 / 125 >= 70 THEN 'B'
                WHEN (m.cat1_total + m.cat2_total + m.cat3_total) * 100.0 / 125 >= 60 THEN 'C'
                WHEN (m.cat1_total + m.cat2_total + m.cat3_total) * 100.0 / 125 >= 50 THEN 'D'
                ELSE 'F'
              END AS 'Grade',
              CURDATE()       AS 'Date_of_Attempt'
            FROM cat_marks m
            JOIN students s ON s.id = m.student_id
            JOIN courses c  ON c.id = m.course_id
            WHERE m.cat1_total IS NOT NULL AND m.cat2_total IS NOT NULL AND m.cat3_total IS NOT NULL
            ORDER BY s.email, c.course_code;
            \"\"\"
            df = pd.read_sql(query, engine)
            if not df.empty:
                print("Successfully loaded data from MySQL database.")
                return df
        except SQLAlchemyError as e:
            print(f"Database connection or query failed: {e}")
            print("Falling back to local file if available.")

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

ACTIVE_ML_CONTEXT = {}

# --- Run full analysis and return everything for API ---
def run_full_analysis(filepath='data.csv'):
    global ACTIVE_ML_CONTEXT
    df = load_data_api(filepath)
    if df is None:
        return {'error': 'Dataframe is empty'}
    
    df['Date_of_Attempt'] = pd.to_datetime(df['Date_of_Attempt'], errors='coerce')

    strengths_weaknesses = analyze_strengths_weaknesses_json(df)
    recommendations = recommend_courses_json(df)
    dashboard = dashboard_data_json(df)
    model_result = build_model_and_metrics(df)

    ACTIVE_ML_CONTEXT['df'] = df.copy()
    if model_result and 'model' in model_result:
        ACTIVE_ML_CONTEXT['model'] = model_result['model']
        ACTIVE_ML_CONTEXT['encoders'] = model_result['encoders']

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

def trigger_predict_mechanics(email, course_id):
    """Mechanically predict the performance of a student using the active model."""
    if 'model' not in ACTIVE_ML_CONTEXT or 'df' not in ACTIVE_ML_CONTEXT:
        return {'error': 'Model not trained yet. Run analysis first.'}
    
    df = ACTIVE_ML_CONTEXT['df']
    model = ACTIVE_ML_CONTEXT['model']
    encoders = ACTIVE_ML_CONTEXT['encoders']
    
    try:
        email_encoded = encoders['email'].transform([email])[0]
        course_encoded = encoders['course'].transform([course_id])[0]
        
        # Calculate dynamic features
        student_data = df[df['Candidate Email'] == email]
        course_data = df[df['Course ID'] == course_id]
        
        student_avg_mark = student_data['Mark'].mean() if not student_data.empty else 50.0
        student_attempt_count = student_data['Attempt ID'].max() + 1 if not student_data.empty else 1
        course_avg_mark = course_data['Mark'].mean() if not course_data.empty else 50.0
        course_attempt_count = course_data['Attempt ID'].max() + 1 if not course_data.empty else 1
        
        import datetime
        now = datetime.datetime.now()
        
        prediction_data = pd.DataFrame([{
            'Candidate Email Encoded': email_encoded,
            'Course ID Encoded': course_encoded,
            'Attempt ID': student_attempt_count,
            'Student_Avg_Mark': student_avg_mark,
            'Student_Attempt_Count': student_attempt_count,
            'Course_Avg_Mark': course_avg_mark,
            'Course_Attempt_Count': course_attempt_count,
            'Day_of_Week': now.weekday(),
            'Month': now.month
        }])
        
        predicted_mark = float(model.predict(prediction_data)[0])
        return {
            'success': True,
            'predictedMark': int(predicted_mark * 10) / 10.0,
            'email': email,
            'courseId': course_id
        }
    except Exception as e:
        return {'error': f'Prediction failed: {str(e)}'}
