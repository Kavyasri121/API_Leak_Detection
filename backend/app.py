from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import uuid, os
from datetime import datetime

from scanner import scan_text, scan_repository
from modules.collector import get_paste_data, get_forum_data

# ============================================================
# 🚀 INIT APP
# ============================================================
app = Flask(__name__)
CORS(app)

# ============================================================
# 🗄️ DATABASE CONNECTION
# ============================================================
client = MongoClient("mongodb://localhost:27017/")
db = client["keyshield"]

users_collection = db["users"]
history_collection = db["history"]

import re
from werkzeug.security import generate_password_hash, check_password_hash

# ============================================================
# 🔐 SIGNUP API
# ============================================================
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Password strength validation
    # Min 8 characters, at least one letter, one number, and one special character
    if len(password) < 8 or not re.search(r"[A-Za-z]", password) or not re.search(r"\d", password) or not re.search(r"[@$!%*#?&]", password):
        return jsonify({"error": "Password must be at least 8 characters long, and include at least one letter, one number, and one special character (@$!%*#?&)."}), 400

    # check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(password)

    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password
    })

    return jsonify({"message": "Signup successful"})


# ============================================================
# 🔐 LOGIN API
# ============================================================
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = users_collection.find_one({"email": email})

    if user and check_password_hash(user["password"], password):
        return jsonify({
            "message": "Login successful",
            "name": user["name"],
            "email": user["email"]
        })
    else:
        return jsonify({"error": "Invalid credentials"}), 401


# ============================================================
# 🔍 SCAN API (MAIN FEATURE)
# ============================================================
@app.route('/scan', methods=['POST'])
def scan():

    data = request.json or {}

    source = data.get("source")
    repo = data.get("repo")
    code = data.get("code")
    user_email = data.get("email")

    results = []

    try:
        # 🔹 Manual text
        if source == "manual":
            results = scan_text(code)

        # 🔹 GitHub repo
        elif source == "github" and repo:
            folder = "repo_" + str(uuid.uuid4())[:6]
            os.system(f"git clone {repo} {folder}")
            results = scan_repository(folder)

        # 🔹 Paste sites
        elif source == "paste":
            paste_data = get_paste_data()
            results = scan_text(paste_data)

        # 🔹 Forums
        elif source == "forum":
            forum_data = get_forum_data()
            results = scan_text(forum_data)

        # ====================================================
        # 📜 SAVE USER HISTORY & SEND EMAIL ALERT
        # ====================================================
        if user_email:
            history_collection.insert_one({
                "email": user_email,
                "source": source,
                "total_findings": len(results),
                "date": str(datetime.now())
            })



        return jsonify({"results": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# 🚀 RUN SERVER
# ============================================================
if __name__ == "__main__":
    app.run(debug=True, port=5000)