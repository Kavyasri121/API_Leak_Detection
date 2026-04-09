import os
from modules.detector import detect_keys
from modules.classifier import classify_key
from modules.risk_analyzer import analyze_risk


# 🔹 COMMON FOR ALL SOURCES
def scan_text(data):

    detected = detect_keys(data)
    results = []

    for item in detected:
        key = item["key"]

        key_type = classify_key(key)
        risk = analyze_risk(key, key_type)

        results.append({
            "key": key,
            "type": key_type,
            "risk": risk
        })

    return results


# 🔹 GITHUB SCAN
def scan_repository(path):

    all_data = ""

    for root, dirs, files in os.walk(path):
        for file in files:
            try:
                with open(os.path.join(root, file), "r", errors="ignore") as f:
                    all_data += f.read()
            except:
                pass

    return scan_text(all_data)
