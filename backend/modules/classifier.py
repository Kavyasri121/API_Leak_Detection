def classify_key(key):

    if key.startswith("sk-"):
        return "OpenAI"
    elif key.startswith("AKIA"):
        return "AWS"
    elif key.startswith("ghp_"):
        return "GitHub"
    elif key.startswith("sk_live_"):
        return "Stripe"
    elif key.startswith("AIza"):
        return "GCP"
    elif key.startswith("xox"):
        return "Slack"
    elif key.startswith("SK"):
        return "Twilio"
    elif "firebaseio.com" in key:
        return "Firebase"
    else:
        return "Unknown"
