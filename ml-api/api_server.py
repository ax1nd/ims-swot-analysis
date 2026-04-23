# -----------------------------------------------------------------------------
# Flask API for SWOT/ML analysis - Admin runs analysis, Students fetch results
# Run from project root: cd ml-api && pip install -r requirements.txt && python api_server.py
# -----------------------------------------------------------------------------

import os
import json
from datetime import datetime
from io import BytesIO
from flask import Flask, request, jsonify, send_file # type: ignore
from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)

# In-memory store for analysis results (keyed by student email)
SWOT_RESULTS = {}
SWOT_SUMMARY = None
DATA_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_CSV = os.path.join(DATA_DIR, 'data.csv')
CACHE_FILE = os.path.join(DATA_DIR, 'swot_cache.json')
SWOT_CACHE_UPDATED_AT = None
IMS_SECURITY_V2 = {
    'blockchain_layer': {
        'technology': 'Hyperledger Fabric / Private Ethereum',
        'consensus': 'Proof of Authority (PoA)',
        'core_function': 'Immutable Audit Logging',
        'data_to_chain': [
            'User_Access_Logs',
            'Record_Modifications',
            'Data_Exfiltration_Attempts',
        ],
    },
    'prevention_system': {
        'mechanism': 'Honeypot & Smart Contract Validation',
        'features': {
            'integrity_check': 'Every data request compares DB Hash vs. Blockchain Hash',
            'access_control': 'Multi-signature approval for bulk data exports',
            'honey_tokens': 'Decoy data records that trigger alarms if accessed',
        },
    },
    'attacking_system_simulator': {
        'purpose': 'Security Validation & Stress Testing',
        'attack_vectors': [
            'SQL_Injection_Simulation',
            'Brute_Force_Attempt',
            'Unauthorized_API_Fetch',
        ],
        'detection_logic': 'AI-based Anomaly Detection (GSAP/Three.js visualized)',
    },
    'admin_dashboard_integration': {
        'visuals': {
            'blockchain_health': 'Live node status and block height',
            'prevention_map': 'Real-time globe showing blocked IP origins',
            'threat_level': 'Dynamic meter based on failed hash validations',
        },
        'actions': [
            'Rollback to last verified Block',
            'Revoke compromised node credentials',
            'Export tamper-proof audit reports',
        ],
    },
}
EXPO_OPTIMIZATION_V1 = {
    'rendering_strategy': {
        'list_management': 'Replace ScrollView with FlashList (Shopify) for memory efficiency',
        'memoization': 'Implement React.memo and useMemo for heavy UI components',
        'image_handling': {
            'library': 'expo-image',
            'features': ['Disk caching', 'Blurhash placeholders', 'WebP support'],
        },
    },
    'runtime_performance': {
        'js_engine': 'Hermes (Enabled)',
        'animation_engine': 'Reanimated 3 (GPU-accelerated transforms)',
        'interaction_manager': 'Delay heavy tasks until interactions finish',
    },
    'asset_management': {
        'compression': 'expo-optimize for local assets',
        'font_loading': 'Font.loadAsync with splash screen prevention',
        'icon_sets': 'Vector icons mapping to avoid large PNG overhead',
    },
    'bundle_analysis': {
        'tool': 'react-native-bundle-visualizer',
        'goal': "Reduce 'Main' bundle size below 2MB",
        'tree_shaking': 'Ensure lodash/ramda are used with specific imports',
    },
    'native_polish': {
        'haptics': 'expo-haptics for tactile feedback on button press',
        'safe_area': 'react-native-safe-area-context for notch/dynamic island handling',
        'keyboard_avoidance': "KeyboardAvoidingView with 'padding' behavior for iOS",
    },
}


def _utc_now_iso():
    return datetime.utcnow().replace(microsecond=0).isoformat() + 'Z'


def _save_cache():
    payload = {
        'summary': SWOT_SUMMARY,
        'results': SWOT_RESULTS,
        'updatedAt': SWOT_CACHE_UPDATED_AT or _utc_now_iso(),
    }
    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=True, indent=2)


def _load_cache():
    global SWOT_RESULTS, SWOT_SUMMARY, SWOT_CACHE_UPDATED_AT
    if not os.path.exists(CACHE_FILE):
        return
    try:
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            payload = json.load(f)
        SWOT_SUMMARY = payload.get('summary')
        SWOT_RESULTS = payload.get('results', {}) or {}
        SWOT_CACHE_UPDATED_AT = payload.get('updatedAt')
    except Exception as e:
        print(f'Failed to load cache file: {e}')


def _student_name(email):
    student = SWOT_RESULTS.get(email, {}) if isinstance(SWOT_RESULTS, dict) else {}
    return student.get('name') or email


def _escape_pdf_text(value):
    return str(value).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')


def _generate_simple_pdf(lines):
    if not lines:
        lines = ['No data available']

    max_chars = 110
    wrapped = []
    for line in lines:
        text = str(line)
        while len(text) > max_chars:
            wrapped.append(text[:max_chars])
            text = text[max_chars:]
        wrapped.append(text)

    pages = []
    chunk_size = 44
    for i in range(0, len(wrapped), chunk_size):
        pages.append(wrapped[i:i + chunk_size])

    objects = []

    def add_object(data):
        objects.append(data)
        return len(objects)

    font_obj = add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    page_obj_ids = []

    for page_lines in pages:
        stream_lines = ["BT", "/F1 11 Tf", "50 790 Td", "14 TL"]
        for idx, line in enumerate(page_lines):
            escaped = _escape_pdf_text(line)
            if idx == 0:
                stream_lines.append(f"({escaped}) Tj")
            else:
                stream_lines.append(f"T* ({escaped}) Tj")
        stream_lines.append("ET")
        stream_data = "\n".join(stream_lines)
        content_obj = add_object(f"<< /Length {len(stream_data.encode('utf-8'))} >>\nstream\n{stream_data}\nendstream")
        page_obj = add_object(
            f"<< /Type /Page /Parent {{PAGES_REF}} 0 R /MediaBox [0 0 612 792] "
            f"/Resources << /Font << /F1 {font_obj} 0 R >> >> /Contents {content_obj} 0 R >>"
        )
        page_obj_ids.append(page_obj)

    kids = " ".join(f"{pid} 0 R" for pid in page_obj_ids)
    pages_obj = add_object(f"<< /Type /Pages /Kids [{kids}] /Count {len(page_obj_ids)} >>")

    for idx, obj in enumerate(objects):
        if "{PAGES_REF}" in obj:
            objects[idx] = obj.replace("{PAGES_REF}", str(pages_obj))

    catalog_obj = add_object(f"<< /Type /Catalog /Pages {pages_obj} 0 R >>")

    out = BytesIO()
    out.write(b"%PDF-1.4\n")
    offsets = [0]
    for i, obj in enumerate(objects, start=1):
        offsets.append(out.tell())
        out.write(f"{i} 0 obj\n{obj}\nendobj\n".encode('utf-8'))

    xref_start = out.tell()
    out.write(f"xref\n0 {len(objects) + 1}\n".encode('utf-8'))
    out.write(b"0000000000 65535 f \n")
    for i in range(1, len(objects) + 1):
        out.write(f"{offsets[i]:010d} 00000 n \n".encode('utf-8'))
    out.write(
        (
            f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_obj} 0 R >>\n"
            f"startxref\n{xref_start}\n%%EOF"
        ).encode('utf-8')
    )
    out.seek(0)
    return out


def _student_report_lines(email):
    student = SWOT_RESULTS.get(email, {})
    lines = [
        'Student SWOT Analysis Report',
        f'Generated at: {_utc_now_iso()}',
        f'Cache updated at: {SWOT_CACHE_UPDATED_AT or "N/A"}',
        '',
        f'Name: {student.get("name", email)}',
        f'Email: {email}',
        f'Overall Grade: {student.get("overallGrade", "N/A")}',
        f'Average Mark: {student.get("avgMark", 0)}',
        f'Total Courses: {student.get("totalCourses", 0)}',
        '',
        'Strengths:',
    ]
    strengths = student.get('strengths', []) or []
    lines.extend([f'- {item}' for item in strengths] or ['- None'])
    lines.append('')
    lines.append('Weaknesses:')
    weaknesses = student.get('weaknesses', []) or []
    lines.extend([f'- {item}' for item in weaknesses] or ['- None'])
    lines.append('')
    lines.append('Recommendations:')
    recs = student.get('recommendations', []) or []
    if recs:
        for rec in recs:
            lines.append(f'- {rec.get("weakCourse", "N/A")} -> {rec.get("recommendedCourse", "N/A")}')
    else:
        lines.append('- None')
    lines.append('')
    lines.append('Course Performance:')
    courses = student.get('courses', []) or []
    if courses:
        for c in courses:
            lines.append(f'- {c.get("courseName", "N/A")} ({c.get("courseId", "N/A")}): {c.get("mark", 0)} [{c.get("grade", "N/A")}]')
    else:
        lines.append('- No course data')
    return lines


def _tabular_lines(title, subtitle, rows):
    lines = [
        title,
        f'Generated at: {_utc_now_iso()}',
    ]
    if subtitle:
        lines.append(subtitle)
    lines.append('')
    if not rows:
        lines.append('No rows provided.')
        return lines
    for idx, row in enumerate(rows, start=1):
        if isinstance(row, dict):
            kv = " | ".join([f'{k}: {v}' for k, v in row.items()])
            lines.append(f'{idx}. {kv}')
        else:
            lines.append(f'{idx}. {row}')
    return lines


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/security/ims-v2', methods=['GET'])
def get_ims_security_v2():
    return jsonify({'ims_security_v2': IMS_SECURITY_V2})

@app.route('/api/mobile/expo-optimization-v1', methods=['GET'])
def get_expo_optimization_v1():
    return jsonify({'expo_optimization_v1': EXPO_OPTIMIZATION_V1})


@app.route('/api/swot/run', methods=['POST'])
def run_swot():
    global SWOT_RESULTS, SWOT_SUMMARY, SWOT_CACHE_UPDATED_AT
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

    # Allow proceeding without a file if DB_HOST is configured
    if not os.path.exists(filepath) and not os.environ.get('DB_HOST'):
        return jsonify({'error': 'No data file found and no DB connected', 'filepath': filepath}), 400

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
    SWOT_CACHE_UPDATED_AT = _utc_now_iso()
    _save_cache()
    return jsonify({
        'success': True,
        'message': 'SWOT analysis complete',
        'summary': SWOT_SUMMARY,
        'studentCount': len(SWOT_RESULTS),
        'cacheUpdatedAt': SWOT_CACHE_UPDATED_AT,
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
    result = dict(SWOT_RESULTS[email])
    result['cacheUpdatedAt'] = SWOT_CACHE_UPDATED_AT
    return jsonify(result)


@app.route('/api/swot/summary', methods=['GET'])
def get_summary():
    if SWOT_SUMMARY is None:
        return jsonify({'error': 'No analysis run yet'}), 404
    return jsonify({
        'summary': SWOT_SUMMARY,
        'cacheUpdatedAt': SWOT_CACHE_UPDATED_AT,
    })


@app.route('/api/swot/cache-status', methods=['GET'])
def cache_status():
    return jsonify({
        'hasCache': bool(SWOT_RESULTS),
        'studentCount': len(SWOT_RESULTS),
        'cacheUpdatedAt': SWOT_CACHE_UPDATED_AT,
        'cacheFile': CACHE_FILE,
    })

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
        'cacheUpdatedAt': SWOT_CACHE_UPDATED_AT,
    })


@app.route('/api/export/report/pdf', methods=['GET'])
def export_report_pdf():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Missing email'}), 400
    email = email.strip()
    if email not in SWOT_RESULTS:
        return jsonify({'error': 'No cached report for this student', 'email': email}), 404

    pdf_data = _generate_simple_pdf(_student_report_lines(email))
    filename = f'swot-report-{_student_name(email).replace(" ", "_")}.pdf'
    return send_file(
        pdf_data,
        as_attachment=True,
        download_name=filename,
        mimetype='application/pdf',
    )


@app.route('/api/export/attendance/pdf', methods=['POST'])
def export_attendance_pdf():
    body = request.get_json(silent=True) or {}
    email = (body.get('email') or '').strip()
    rows = body.get('rows', [])
    subtitle = f'Student: {_student_name(email)} ({email})' if email else None
    pdf_data = _generate_simple_pdf(_tabular_lines('Attendance Report', subtitle, rows))
    return send_file(
        pdf_data,
        as_attachment=True,
        download_name='attendance-report.pdf',
        mimetype='application/pdf',
    )


@app.route('/api/export/timetable/pdf', methods=['POST'])
def export_timetable_pdf():
    body = request.get_json(silent=True) or {}
    email = (body.get('email') or '').strip()
    rows = body.get('rows', [])
    subtitle = f'Student: {_student_name(email)} ({email})' if email else None
    pdf_data = _generate_simple_pdf(_tabular_lines('Timetable Report', subtitle, rows))
    return send_file(
        pdf_data,
        as_attachment=True,
        download_name='timetable-report.pdf',
        mimetype='application/pdf',
    )


_load_cache()


if __name__ == '__main__':
    from waitress import serve  # type: ignore
    host = os.environ.get('API_HOST', '0.0.0.0')
    port = int(os.environ.get('API_PORT', '5001'))
    print(f'SWOT ML API: http://127.0.0.1:{port}')
    print('Endpoints: POST /api/swot/run, GET /api/swot/result/<email>, GET /api/swot/summary')
    print('           GET /api/swot/all-students, GET /api/swot/class-dashboard')
    print('           GET /api/swot/cache-status')
    print('           GET /api/export/report/pdf?email=..., POST /api/export/attendance/pdf, POST /api/export/timetable/pdf')
    print('           GET /api/security/ims-v2, GET /api/mobile/expo-optimization-v1')
    serve(app, host=host, port=port, threads=8)
