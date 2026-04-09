def analyze_risk(key, key_type):

    if key_type in ["AWS", "OpenAI", "Stripe"]:
        return "HIGH"

    elif key_type in ["GitHub", "GCP", "Slack", "Twilio"]:
        return "MEDIUM"

    else:
        return "LOW"
