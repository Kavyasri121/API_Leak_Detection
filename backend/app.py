from flask_mail import Mail, Message
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import render_template
import uuid, os

from scanner import scan_text, scan_repository
from modules.collector import get_paste_data, get_forum_data
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["keyshield"]

users_collection = db["users"]
history_collection = db["history"]
def home():
    return render_template('index.html')
app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'your_email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your_app_password'
app.config['MAIL_USE_TLS'] = True

mail = Mail(app)
CORS(app) # injected to ensure React connects successfully
def send_alert_email(to_email, findings):
    msg = Message(
        subject="🚨 API Key Leak Detected",
        sender=app.config['MAIL_USERNAME'],
        recipients=[to_email]
    )
    msg.body = f"""
    ALERT!
    We detected API key leaks.
    Total leaks: {len(findings)}
    Please secure your keys immediately.
    """
    mail.send(msg)
@app.route('/scan', methods=['POST'])
def scan():

    data = request.json or {}

    source = data.get("source")
    repo = data.get("repo")
    code = data.get("code")

    results = []

    try:
        # 🔹 1. Manual text
        if source == "manual":
            results = scan_text(code)

        # 🔹 2. GitHub repo
        elif source == "github" and repo:
            folder = "repo_" + str(uuid.uuid4())[:6]
            os.system(f"git clone {repo} {folder}")
            results = scan_repository(folder)

        # 🔹 3. Paste sites
        elif source == "paste":
            paste_data = get_paste_data()
            results = scan_text(paste_data)

        # 🔹 4. Public forums
        elif source == "forum":
            forum_data = get_forum_data()
            results = scan_text(forum_data)

        return jsonify({"results": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
