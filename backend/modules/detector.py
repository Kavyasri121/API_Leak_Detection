import re

def detect_keys(data):

    if not data:
        return []
    
    # added to prevent crash from empty values
    data = str(data)

    patterns = {
        "AWS": r'AKIA[0-9A-Z]{8,}',
        "OpenAI": r'sk-[A-Za-z0-9]{8,}',
        "GitHub": r'ghp_[A-Za-z0-9]{8,}',
        "Stripe": r'sk_live_[A-Za-z0-9]{8,}',
        "GCP": r'AIza[0-9A-Za-z\-_]{10,}',
        "Slack": r'xox[baprs]-[0-9a-zA-Z]{10,}',
        "Twilio": r'SK[0-9a-fA-F]{10,}',
        "Firebase": r'firebaseio\.com',
        "Generic": r'api[_-]?key\s*=\s*["\']?([A-Za-z0-9\-_]{8,})'
    }

    results = []

    for key_type, pattern in patterns.items():
        matches = re.findall(pattern, data)

        for m in matches:
            if isinstance(m, tuple):
                m = m[0]
            results.append({"key": m, "type": key_type})

    # remove duplicates
    seen = set()
    unique = []

    for r in results:
        if r["key"] not in seen:
            seen.add(r["key"])
            unique.append(r)

    return unique
