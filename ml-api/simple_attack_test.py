import urllib.parse
import urllib.request
import urllib.error


API_BASE = "http://127.0.0.1:5001"

# Very simple SQLi-style probe (non-destructive)
payload_email = "test@example.com' OR '1'='1"
query = urllib.parse.urlencode({"email": payload_email})
url = f"{API_BASE}/api/swot/result?{query}"

print("Testing:", url)

try:
    with urllib.request.urlopen(url, timeout=8) as resp:
        body = resp.read().decode("utf-8", errors="replace")
        print("Status:", resp.status)
        print("Body:", body[:300])
        if resp.status == 200:
            print("WARNING: endpoint accepted suspicious input.")
        else:
            print("Looks okay.")
except urllib.error.HTTPError as e:
    body = e.read().decode("utf-8", errors="replace")
    print("Status:", e.code)
    print("Body:", body[:300])
    if e.code in (400, 404):
        print("GOOD: suspicious input was not accepted.")
    else:
        print("Check this response.")
except Exception as e:
    print("Request failed:", e)
