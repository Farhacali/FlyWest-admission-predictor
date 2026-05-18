import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import json

# Set random seed for reproducibility
np.random.seed(42)

# 1. Synthesize Dataset
n_samples = 1500

# Continuous features (mimicking Kaggle Graduate Admission)
gre_scores = np.random.randint(280, 340, n_samples)
toefl_scores = np.random.randint(90, 120, n_samples)
cgpa = np.random.uniform(6.5, 10.0, n_samples)
work_exp = np.random.randint(0, 60, n_samples) # months

# Categorical features
countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany']
courses = ['Computer Science', 'Data Science', 'Business Analytics', 'Engineering', 'MBA']

preferred_country = np.random.choice(countries, n_samples)
preferred_course = np.random.choice(courses, n_samples)

# Create DataFrame
df = pd.DataFrame({
    'GRE_Score': gre_scores,
    'TOEFL_Score': toefl_scores,
    'CGPA': cgpa,
    'Work_Experience': work_exp,
    'Preferred_Country': preferred_country,
    'Preferred_Course': preferred_course
})

# Calculate Chance of Admit based on a weighted sum + some noise
# Normalize scores to 0-1 for the calculation
norm_gre = (df['GRE_Score'] - 280) / (340 - 280)
norm_toefl = (df['TOEFL_Score'] - 90) / (120 - 90)
norm_cgpa = (df['CGPA'] - 6.5) / (10.0 - 6.5)
norm_work = (df['Work_Experience']) / 60.0

# Base chance calculation
chance = (0.4 * norm_cgpa) + (0.3 * norm_gre) + (0.15 * norm_toefl) + (0.15 * norm_work)

# Add some randomness
chance += np.random.normal(0, 0.05, n_samples)

# Cap between 0.1 and 0.99
chance = np.clip(chance, 0.1, 0.99)
df['Chance_of_Admit'] = chance

# Save the dataset for reference
df.to_csv('synthetic_admissions.csv', index=False)

# 2. Preprocess Data
# Encode categorical variables
label_encoders = {}
for col in ['Preferred_Country', 'Preferred_Course']:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Extract features and target
X = df.drop('Chance_of_Admit', axis=1)
y = df['Chance_of_Admit']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 3. Train Model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

score = model.score(X_test_scaled, y_test)
print(f"Model trained with R^2 score: {score:.4f}")

# 4. Save Model and Preprocessors
joblib.dump(model, 'admission_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

# Save label encoders mapping for the Flask app to use
le_mappings = {}
for col, le in label_encoders.items():
    le_mappings[col] = {cl: int(val) for cl, val in zip(le.classes_, le.transform(le.classes_))}

with open('label_mappings.json', 'w') as f:
    json.dump(le_mappings, f)

print("Model, scaler, and label mappings saved successfully.")
