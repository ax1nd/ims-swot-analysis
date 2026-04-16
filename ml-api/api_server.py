# -----------------------------------------------------------------------------
# Flask API for SWOT/ML analysis - Admin runs analysis, Students fetch results
# Run from project root: cd ml-api && pip install -r requirements.txt && python api_server.py
# -----------------------------------------------------------------------------

import os
import json
from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)

# In-memory store for analysis results (keyed by student email)
SWOT_RESULTS = {}
SWOT_SUMMARY = None
DATA_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_CSV = os.path.join(DATA_DIR, 'data.csv')


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@app.route('/api/swot/run', methods=['POST'])
def run_swot():
    global SWOT_RESULTS, SWOT_SUMMARY
    filepath = DEFAULT_CSV
    if request.files:
        f = request.files.get('file')
        if f and f.filename and f.filename.endswith('.csv'):
            filepath = os.path.join(DATA_DIR, 'uploaded_data.csv')
            f.save(filepath)
    elif request.get_json(silent=True):
        body = request.get_json()
        if body.get('useDefault'):
            filepath = DEFAULT_CSV

    if not os.path.exists(filepath):
        return jsonify({'error': 'No data file found', 'filepath': filepath}), 400

    try:
        from ml_api import run_full_analysis # type: ignore
        result = run_full_analysis(filepath)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

    if result.get('error'):
        return jsonify(result), 400

    SWOT_SUMMARY = result.get('summary', {})
    SWOT_RESULTS = result.get('byStudent', {})
    return jsonify({
        'success': True,
        'message': 'SWOT analysis complete',
        'summary': SWOT_SUMMARY,
        'studentCount': len(SWOT_RESULTS),
    })


@app.route('/api/swot/result', methods=['GET'])
@app.route('/api/swot/result/<email>', methods=['GET'])
def get_result(email=None):
    if not email:
        email = request.args.get('email') or request.args.get('studentId')
    if not email:
        return jsonify({'error': 'Missing email or studentId'}), 400
    email = email.strip()
    if email not in SWOT_RESULTS:
        return jsonify({'error': 'No result for this student', 'email': email}), 404
    return jsonify(SWOT_RESULTS[email])


@app.route('/api/swot/summary', methods=['GET'])
def get_summary():
    if SWOT_SUMMARY is None:
        return jsonify({'error': 'No analysis run yet'}), 404
    return jsonify(SWOT_SUMMARY)

@app.route('/api/swot/predict', methods=['POST'])
def run_predict_mechanics():
    body = request.get_json(silent=True) or {}
    email = body.get('email')
    course_id = body.get('courseId')
    if not email or not course_id:
        return jsonify({'error': 'Missing email or courseId'}), 400
    
    try:
        from ml_api import trigger_predict_mechanics # type: ignore
        result = trigger_predict_mechanics(email, course_id)
        if result.get('error'):
            return jsonify(result), 400
        return jsonify(result)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/swot/all-students', methods=['GET'])
def get_all_students():
    """Returns list of all analysed students with their data (admin only)."""
    if not SWOT_RESULTS:
        return jsonify({'error': 'No analysis run yet'}), 404
    students = []
    for email, data in SWOT_RESULTS.items():
        students.append({
            'email': email,
            'name': data.get('name', email),
            'avgMark': data.get('avgMark', 0),
            'totalCourses': data.get('totalCourses', 0),
            'strengths': data.get('strengths', []),
            'weaknesses': data.get('weaknesses', []),
            'recommendations': data.get('recommendations', []),
            'courses': data.get('courses', []),
            'grade': data.get('overallGrade', 'N/A'),
        })
    return jsonify({
        'students': students,
        'summary': SWOT_SUMMARY,
        'totalStudents': len(students),
    })


@app.route('/api/swot/class-dashboard', methods=['GET'])
def class_dashboard():
    """Returns class-level aggregated performance data for admin dashboard."""
    if not SWOT_RESULTS or SWOT_SUMMARY is None:
        return jsonify({'error': 'No analysis run yet'}), 404

    total_students = len(SWOT_RESULTS)
    all_avg_marks = []
    grade_counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0}
    top_performers = []
    at_risk = []

    for email, data in SWOT_RESULTS.items():
        avg = data.get('avgMark', 0)
        all_avg_marks.append(avg)
        grade = data.get('overallGrade', 'N/A')
        if grade in grade_counts:
            grade_counts[grade] += 1

        entry = {
            'email': email,
            'name': data.get('name', email),
            'avgMark': avg,
            'grade': grade,
            'strengths': len(data.get('strengths', [])),
            'weaknesses': len(data.get('weaknesses', [])),
        }
        if avg >= 80:
            top_performers.append(entry)
        if avg < 60:
            at_risk.append(entry)

    class_avg = sum(all_avg_marks) / len(all_avg_marks) if all_avg_marks else 0.0
    highest = max(all_avg_marks) if all_avg_marks else 0
    lowest = min(all_avg_marks) if all_avg_marks else 0
    pass_rate = sum(1 for m in all_avg_marks if m >= 50) / total_students * 100 if total_students else 0

    return jsonify({
        'classAverage': int(float(class_avg) * 10) / 10.0,
        'highest': int(float(highest) * 10) / 10.0,
        'lowest': int(float(lowest) * 10) / 10.0,
        'passRate': int(float(pass_rate) * 10) / 10.0,
        'totalStudents': total_students,
        'gradeDistribution': grade_counts,
        'topPerformers': sorted(top_performers, key=lambda x: -x['avgMark']),
        'atRisk': sorted(at_risk, key=lambda x: x['avgMark']),
        'summary': SWOT_SUMMARY,
    })


if __name__ == '__main__':
    print('SWOT ML API: http://127.0.0.1:5001')
    print('Endpoints: POST /api/swot/run, GET /api/swot/result/<email>, GET /api/swot/summary')
    print('           GET /api/swot/all-students, GET /api/swot/class-dashboard')
    app.run(host='0.0.0.0', port=5001, debug=True)
