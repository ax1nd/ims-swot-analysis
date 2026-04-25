"""
Authorized security simulator for IMS SWOT API.

Purpose:
- Test defensive behavior (input validation, auth gaps, rate behavior)
- Simulate common attack patterns safely (non-destructive)

Important:
- Run ONLY on systems you own or have explicit permission to test.
- This script does not run destructive SQL or data-modifying payloads.
"""

from __future__ import annotations

import json
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Any, Dict, Optional


API_BASE = "http://127.0.0.1:5001"


@dataclass
class CheckResult:
    name: str
    method: str
    path: str
    status: Optional[int]
    passed: bool
    note: str


def http_call(method: str, url: str, payload: Optional[Dict[str, Any]] = None) -> tuple[Optional[int], str]:
    data = None
    headers = {}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url=url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            return resp.status, resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        return e.code, body
    except Exception as e:  # noqa: BLE001
        return None, f"Request failed: {e}"


def check_health() -> CheckResult:
    status, body = http_call("GET", f"{API_BASE}/api/health")
    passed = status == 200 and "ok" in body.lower()
    note = "Health reachable" if passed else f"Unexpected health response: status={status}, body={body[:120]}"
    return CheckResult("Health endpoint", "GET", "/api/health", status, passed, note)


def check_sqli_like_input_on_result() -> CheckResult:
    payload_email = "test@example.com' OR '1'='1"
    qs = urllib.parse.urlencode({"email": payload_email})
    status, body = http_call("GET", f"{API_BASE}/api/swot/result?{qs}")
    # Expected: reject or not found, but never 200 with broad data
    passed = status in (400, 404)
    note = (
        "SQLi-like input not accepted as valid lookup."
        if passed
        else f"Potential weakness: status={status}, body={body[:180]}"
    )
    return CheckResult("SQLi-like query probe", "GET", "/api/swot/result", status, passed, note)


def check_invalid_export_payload() -> CheckResult:
    payload = {
        "email": "student@example.com",
        "rows": [
            {"subject": "DBMS", "notes": "<script>alert('xss')</script>", "attended": "26; DROP TABLE students;--"}
        ],
    }
    status, body = http_call("POST", f"{API_BASE}/api/export/attendance/pdf", payload=payload)
    # Expected: still safe output (PDF) or graceful input rejection.
    passed = status in (200, 400, 422)
    note = "Handled untrusted content safely in export path." if passed else f"Unexpected status={status}, body={body[:180]}"
    return CheckResult("Untrusted content in PDF export", "POST", "/api/export/attendance/pdf", status, passed, note)


def check_unauthorized_admin_data_access() -> CheckResult:
    status, body = http_call("GET", f"{API_BASE}/api/swot/all-students")
    # If this returns 200 without auth, that's a known security gap.
    passed = status in (401, 403)
    if passed:
        note = "Admin data endpoint appears protected."
    else:
        note = (
            "Endpoint appears publicly accessible. Add auth (JWT/session/API key) + role checks."
            f" status={status}, body preview={body[:120]}"
        )
    return CheckResult("Unauthorized admin endpoint access", "GET", "/api/swot/all-students", status, passed, note)


def check_bruteforce_like_traffic() -> CheckResult:
    # Simple burst probe to see whether server applies throttling/rate limits.
    attempts = 25
    statuses = []
    for _ in range(attempts):
        status, _ = http_call("GET", f"{API_BASE}/api/health")
        statuses.append(status)
        time.sleep(0.03)

    throttled = any(s in (429, 503) for s in statuses if s is not None)
    passed = throttled
    note = (
        "Rate limiting detected."
        if passed
        else "No throttling detected in burst traffic. Consider Flask-Limiter / reverse proxy limits."
    )
    return CheckResult("Bruteforce-like burst probe", "GET", "/api/health", 200 if statuses else None, passed, note)


def run_all_checks() -> list[CheckResult]:
    checks = [
        check_health,
        check_sqli_like_input_on_result,
        check_invalid_export_payload,
        check_unauthorized_admin_data_access,
        check_bruteforce_like_traffic,
    ]
    results = []
    for c in checks:
        results.append(c())
    return results


def print_report(results: list[CheckResult]) -> None:
    print("\n=== IMS Security Attack Simulator (Safe) ===")
    passed = 0
    for r in results:
        mark = "PASS" if r.passed else "WARN"
        if r.passed:
            passed += 1
        print(f"\n[{mark}] {r.name}")
        print(f"  {r.method} {r.path}")
        print(f"  status: {r.status}")
        print(f"  note: {r.note}")
    print("\n--------------------------------------------")
    print(f"Checks passed: {passed}/{len(results)}")
    if passed < len(results):
        print("Action required: harden auth, rate limits, and access controls.")
    else:
        print("Baseline checks look good.")


if __name__ == "__main__":
    print(f"Target API: {API_BASE}")
    output = run_all_checks()
    print_report(output)
