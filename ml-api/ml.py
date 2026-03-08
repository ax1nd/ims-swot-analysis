# -----------------------------------------------------------------------------
# Candidate Performance Analysis & Recommendation Tool
# -----------------------------------------------------------------------------
# This script provides a complete solution for the project requirements,
# including data loading, performance analysis, course recommendation,
# and an XGBoost model to predict student marks.
# -----------------------------------------------------------------------------

import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

# --- 1. Data Loading (Requirement ANAR1) ---

def load_data(filepath):
    """
    Loads performance data from a CSV or Excel file.
    Args:
        filepath (str): The path to the data file.
    Returns:
        pandas.DataFrame: The loaded data.
    """
    print("--- [ANAR1] Loading Data ---")
    try:
        if filepath.endswith('.csv'):
            df = pd.read_csv(filepath)
            print(f"Successfully loaded {len(df)} records from {filepath}\n")
        elif filepath.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(filepath)
            print(f"Successfully loaded {len(df)} records from {filepath}\n")
        else:
            raise ValueError("Unsupported file format. Please use CSV or Excel.")
        return df
    except FileNotFoundError:
        print(f"Error: The file '{filepath}' was not found.")
        return None

# --- 2. Strength and Weakness Analysis (Requirement ANAR2) ---

def analyze_strengths_weaknesses(df):
    """
    Analyzes and highlights the strengths and weaknesses of each candidate.
    Args:
        df (pandas.DataFrame): The performance data.
    """
    print("\n--- [ANAR2] Strength and Weakness Analysis ---")
    # Defining strength as Grade 'A' or 'B', weakness as 'D' or 'F'
    strength_grades = ['A', 'B']
    weakness_grades = ['D', 'F']
    
    # We only care about the latest attempt for this analysis
    latest_attempts = df.loc[df.groupby(['Candidate Email', 'Course Name'])['Date_of_Attempt'].idxmax()]

    for email in latest_attempts['Candidate Email'].unique():
        student_data = latest_attempts[latest_attempts['Candidate Email'] == email]
        student_name = student_data['Candidate Name'].iloc[0]
        
        strengths = student_data[student_data['Grade'].isin(strength_grades)]['Course Name'].tolist()
        weaknesses = student_data[student_data['Grade'].isin(weakness_grades)]['Course Name'].tolist()
        
        print(f"\nAnalysis for: {student_name} ({email})")
        if strengths:
            print(f"  Strengths: {', '.join(strengths)}")
        else:
            print("  Strengths: No specific strengths identified.")
            
        if weaknesses:
            print(f"  Weaknesses: {', '.join(weaknesses)}")
        else:
            print("  Weaknesses: No specific weaknesses identified.")
    print("\n")


# --- 3. Course Recommendation (Requirement ANAR3) ---

def recommend_courses(df):
    """
    Recommends a 'To-Do' course list for weak performers.
    Args:
        df (pandas.DataFrame): The performance data.
    """
    print("\n--- [ANAR3] To-Do Course Recommendations for Weak Performers ---")
    
    # Simple rule-based recommendation mapping
    recommendation_map = {
        'Python Programming': 'Advanced Python & Algorithms',
        'Data Structures': 'Complex Data Structures & Problem Solving',
        'Java Fundamentals': 'Object-Oriented Design in Java',
        'SQL Fundamentals': 'Advanced SQL & Database Management',
        'Web Development': 'Full-Stack Web Development Project',
        'Machine Learning Basics': 'Applied Machine Learning with Scikit-Learn'
    }
    
    weakness_grades = ['D', 'F']
    weak_performers = df[df['Grade'].isin(weakness_grades)]
    
    # Consider only the latest attempt for recommendations
    latest_weak_attempts = weak_performers.loc[weak_performers.groupby(['Candidate Email', 'Course Name'])['Date_of_Attempt'].idxmax()]

    recommended_students = latest_weak_attempts['Candidate Email'].unique()
    
    for email in recommended_students:
        student_data = latest_weak_attempts[latest_weak_attempts['Candidate Email'] == email]
        student_name = student_data['Candidate Name'].iloc[0]
        
        print(f"\nRecommendations for: {student_name} ({email})")
        for _, row in student_data.iterrows():
            weak_course = row['Course Name']
            recommended_course = recommendation_map.get(weak_course, "General Skills Improvement")
            print(f"  - Because of low performance in '{weak_course}', we recommend: '{recommended_course}'")
    print("\n")

# --- 4. Pair Good and Poor Performers (Requirement ANAR4) ---

def pair_performers(df):
    """
    Identifies poor performers and pairs them with good performers.
    Args:
        df (pandas.DataFrame): The performance data.
    """
    print("\n--- [ANAR4] Pairing High and Low Performers for Knowledge Sharing ---")
    
    # Calculate average mark for each student
    avg_marks = df.groupby(['Candidate Email', 'Candidate Name'])['Mark'].mean().reset_index()
    
    # Define thresholds for good and poor performers
    poor_threshold = 60
    good_threshold = 85
    
    poor_performers = avg_marks[avg_marks['Mark'] < poor_threshold].copy()
    good_performers = avg_marks[avg_marks['Mark'] >= good_threshold].copy()
    
    print(f"\nFound {len(poor_performers)} poor performers (Avg Mark < {poor_threshold})")
    print(f"Found {len(good_performers)} good performers (Avg Mark >= {good_threshold})")
    
    # Simple pairing logic
    poor_performers['pair_idx'] = range(len(poor_performers))
    good_performers['pair_idx'] = range(len(good_performers))

    # Merge for pairing, handling cases with unequal numbers
    paired_df = pd.merge(poor_performers, good_performers, on='pair_idx', suffixes=('_poor', '_good'))

    print("\nSuggested Pairs:")
    for _, row in paired_df.iterrows():
        print(f"  - Mentor: {row['Candidate Name_good']} ({row['Mark_good']:.1f} avg) | Mentee: {row['Candidate Name_poor']} ({row['Mark_poor']:.1f} avg)")
    print("\n")

# --- 5. Improvement Analysis (Requirement ANAR5) ---

def analyze_improvement(df):
    """
    Highlights candidates who are improving based on multiple attempts.
    Args:
        df (pandas.DataFrame): The performance data.
    """
    print("\n--- [ANAR5] Analysis of Candidate Improvement Over Attempts ---")
    
    # Filter for students with more than one attempt in any course
    multi_attempts = df.groupby(['Candidate Email', 'Course Name']).filter(lambda x: len(x) > 1)
    
    improved_candidates = []
    
    for (email, course), group in multi_attempts.groupby(['Candidate Email', 'Course Name']):
        sorted_group = group.sort_values('Date_of_Attempt')
        first_mark = sorted_group['Mark'].iloc[0]
        last_mark = sorted_group['Mark'].iloc[-1]
        
        if last_mark > first_mark:
            student_name = sorted_group['Candidate Name'].iloc[0]
            improvement = {
                'Name': student_name,
                'Email': email,
                'Course': course,
                'Improvement': f"{first_mark} -> {last_mark} (+{last_mark - first_mark} points)"
            }
            improved_candidates.append(improvement)
            
    if improved_candidates:
        improvement_df = pd.DataFrame(improved_candidates)
        print("\nCandidates showing improvement:")
        print(improvement_df.to_string(index=False))
    else:
        print("No candidates with multiple attempts showed clear improvement.")
    print("\n")


# --- 6. Dashboard Data Generation (Requirement ANAR6) ---

def generate_dashboard_data(df):
    """
    Generates summary data for a performance dashboard without visualizations.
    Args:
        df (pandas.DataFrame): The performance data.
    """
    print("\n--- [ANAR6] Generating Dashboard Data Summary ---")
    
    # 1. Overall Grade Distribution Summary
    grade_distribution = df['Grade'].value_counts().sort_index()
    print("\nOverall Grade Distribution:")
    for grade in ['A', 'B', 'C', 'D', 'F']:
        count = grade_distribution.get(grade, 0)
        print(f"  Grade {grade}: {count} attempts")

    # 2. Average Marks per Course
    avg_course_marks = df.groupby('Course Name')['Mark'].mean().sort_values(ascending=False)
    print("\nAverage Marks per Course:")
    for course, avg_mark in avg_course_marks.items():
        print(f"  {course}: {avg_mark:.1f}")
    
    print("\nDashboard data summary generated successfully.\n")

# --- 7. Predictive Model using XGBoost (AI/ML Component) ---

def build_and_evaluate_model(df):
    """
    Builds an optimized XGBoost model to predict student marks and evaluates it.
    Args:
        df (pandas.DataFrame): The performance data.
    Returns:
        (model, encoders): The trained model and label encoders for deployment.
    """
    print("\n--- [AI/ML] Building Optimized XGBoost Model to Predict Performance ---")
    
    # 1. Optimized Preprocessing
    df_model = df.copy()
    
    # Create Label Encoders for categorical features
    email_encoder = LabelEncoder()
    course_encoder = LabelEncoder()
    
    df_model['Candidate Email Encoded'] = email_encoder.fit_transform(df_model['Candidate Email'])
    df_model['Course ID Encoded'] = course_encoder.fit_transform(df_model['Course ID'])
    
    # 2. Enhanced Feature Engineering
    # Add student performance history features
    df_model['Student_Avg_Mark'] = df_model.groupby('Candidate Email')['Mark'].transform('mean')
    df_model['Student_Attempt_Count'] = df_model.groupby('Candidate Email')['Attempt ID'].transform('max')
    
    # Add course difficulty features
    df_model['Course_Avg_Mark'] = df_model.groupby('Course ID')['Mark'].transform('mean')
    df_model['Course_Attempt_Count'] = df_model.groupby('Course ID')['Attempt ID'].transform('max')
    
    # Add time-based features
    df_model['Date_of_Attempt'] = pd.to_datetime(df_model['Date_of_Attempt'])
    df_model['Day_of_Week'] = df_model['Date_of_Attempt'].dt.dayofweek
    df_model['Month'] = df_model['Date_of_Attempt'].dt.month
    
    # 3. Enhanced Feature Selection
    features = [
        'Candidate Email Encoded', 'Course ID Encoded', 'Attempt ID',
        'Student_Avg_Mark', 'Student_Attempt_Count',
        'Course_Avg_Mark', 'Course_Attempt_Count',
        'Day_of_Week', 'Month'
    ]
    target = 'Mark'
    
    X = df_model[features]
    y = df_model[target]
    
    # 4. Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 5. Optimized Model Training with better parameters
    print("\nTraining Optimized XGBoost Regressor...")
    xgbr = xgb.XGBRegressor(
        objective='reg:squarederror', 
        n_estimators=150,  # Increased for better performance
        learning_rate=0.05,  # Lower learning rate for stability
        max_depth=6,  # Slightly deeper
        subsample=0.9,  # Add subsampling
        colsample_bytree=0.9,  # Add column sampling
        reg_alpha=0.1,  # L1 regularization
        reg_lambda=0.1,  # L2 regularization
        random_state=42,
        n_jobs=-1  # Use all available cores
    )
    xgbr.fit(X_train, y_train)
    print("Model training complete.")
    
    # 6. Enhanced Model Evaluation
    print("\nEvaluating model performance...")
    y_pred = xgbr.predict(X_test)
    
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    print(f"  Mean Squared Error (MSE): {mse:.2f}")
    print(f"  Mean Absolute Error (MAE): {mae:.2f}")
    print(f"  R-squared (R2 Score): {r2:.2f}")
    print("  (An R2 score closer to 1.0 indicates a better model fit)")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': xgbr.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n  Top 5 Most Important Features:")
    for _, row in feature_importance.head().iterrows():
        print(f"    {row['feature']}: {row['importance']:.3f}")
    
    # Return model and encoders for future use
    return xgbr, {'email': email_encoder, 'course': course_encoder}

def predict_future_performance(model, encoders):
    """
    Example of how to use the trained model to predict future performance.
    """
    print("\n--- Example Prediction ---")
    
    # Let's predict the performance for a student in a new attempt
    # We'll use an existing student and course for this example
    student_email = 'rohan.joshi@example.com'
    course_id = 'CS103' # Java Fundamentals
    attempt_id = 2 # Their second attempt at this course
    
    # Encode the inputs using the saved encoders
    try:
        email_encoded = encoders['email'].transform([student_email])[0]
        course_encoded = encoders['course'].transform([course_id])[0]

        # Create a DataFrame for prediction
        prediction_data = pd.DataFrame([[email_encoded, course_encoded, attempt_id]], 
                                       columns=['Candidate Email Encoded', 'Course ID Encoded', 'Attempt ID'])
        
        predicted_mark = model.predict(prediction_data)[0]
        
        print(f"Predicted mark for {student_email} in course {course_id} on attempt {attempt_id}: {predicted_mark:.1f}")
        if predicted_mark < 60:
            print("  -> Prediction indicates potential for poor performance. A 'To-Do-Course' is recommended.")
    
    except ValueError as e:
        print(f"Could not make prediction. New student or course? Error: {e}")
        print("  -> The model can only predict on students and courses it was trained on.")


# --- Main Execution ---

if __name__ == "__main__":
    # Specify the path to your dataset
    DATA_FILEPATH = 'data.csv'
    
    # --- Execute All Project Requirements ---
    
    # ANAR1
    performance_df = load_data(DATA_FILEPATH)
    
    if performance_df is not None:
        # Convert date column for proper sorting
        performance_df['Date_of_Attempt'] = pd.to_datetime(performance_df['Date_of_Attempt'])

        # ANAR2
        analyze_strengths_weaknesses(performance_df)
        
        # ANAR3
        recommend_courses(performance_df)
        
        # ANAR4
        pair_performers(performance_df)

        # ANAR5
        analyze_improvement(performance_df)

        # ANAR6
        generate_dashboard_data(performance_df)

        # ANAR7 (This script is structured as a deployable backend component)
        print("\n--- [ANAR7] Deployable Component Information ---")
        print("This script is structured with functions for each requirement.")
        print("These functions can be imported and used in a web framework like Flask or Django to create a web component.")
        
        # Build, evaluate, and demonstrate the XGBoost model
        model, encoders = build_and_evaluate_model(performance_df)
        predict_future_performance(model, encoders)
