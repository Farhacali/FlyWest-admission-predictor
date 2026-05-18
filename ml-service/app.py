from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import json
import numpy as np
import os

app = Flask(__name__)
CORS(app) # Allow cross-origin requests

# Load model, scaler, and label mappings
try:
    model = joblib.load('admission_model.pkl')
    scaler = joblib.load('scaler.pkl')
    with open('label_mappings.json', 'r') as f:
        le_mappings = json.load(f)
    print("Model and preprocessors loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model, scaler, le_mappings = None, None, None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
        
    try:
        data = request.json
        
        # Extract fields
        gre = float(data.get('gre', 300))
        toefl = float(data.get('toefl', 100))
        cgpa = float(data.get('cgpa', 8.0))
        work_exp = float(data.get('work_exp', 0))
        country = data.get('country', 'USA')
        course = data.get('course', 'Computer Science')
        
        # Encode categorical
        country_encoded = le_mappings['Preferred_Country'].get(country, 0)
        course_encoded = le_mappings['Preferred_Course'].get(course, 0)
        
        # Create DataFrame for prediction
        input_data = pd.DataFrame([{
            'GRE_Score': gre,
            'TOEFL_Score': toefl,
            'CGPA': cgpa,
            'Work_Experience': work_exp,
            'Preferred_Country': country_encoded,
            'Preferred_Course': course_encoded
        }])
        
        # Scale features
        input_scaled = scaler.transform(input_data)
        
        # Predict
        chance = model.predict(input_scaled)[0]
        
        # Bound probability between 0.01 and 0.99 for realism
        chance = float(np.clip(chance, 0.01, 0.99))
        
        return jsonify({
            'success': True,
            'chance_of_admit': chance
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_DEBUG') == '1')
