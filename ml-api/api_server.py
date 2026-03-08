# -----------------------------------------------------------------------------
# Flask API for SWOT/ML analysis - Admin runs analysis, Students fetch results
# Run from project root: cd ml-api && pip install -r requirements.txt && python api_server.py
# -----------------------------------------------------------------------------

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'])

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
        from ml_api import run_full_analysis
        result = run_full_analysis(filepath)
    except Exception as e:
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


if __name__ == '__main__':
    print('SWOT ML API: http://127.0.0.1:5000')
    print('Endpoints: POST /api/swot/run, GET /api/swot/result/<email>, GET /api/swot/summary')
    app.run(host='0.0.0.0', port=5000, debug=True)
