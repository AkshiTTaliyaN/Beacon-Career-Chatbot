import os
import sys
from fastapi.testclient import TestClient

# Ensure the script directory is in path
sys.path.append(os.path.dirname(__file__))

from main import app
from database import get_db

client = TestClient(app)

def test_chatbot_e2e():
    print("--- Starting Chatbot Integration Test ---")
    
    # 1. Guest Login
    print("\n[Step 1] Requesting Guest Login...")
    login_resp = client.post("/auth/guest")
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    login_data = login_resp.json()
    token = login_data["access_token"]
    student_id = login_data["student_id"]
    print(f"Guest login successful. Student ID: {student_id}")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Save Student Profile
    print("\n[Step 2] Saving Student Profile...")
    profile_data = {
        "name": "Integration Test Student",
        "current_class": 11,
        "board": "CBSE",
        "stream": "pcm",
        "city": "New Delhi",
        "state": "Delhi",
        "school_name": "Manzil Public School",
        "performance_band": "75-90",
        "strongest_subject": "Mathematics",
        "weakest_subject": "Chemistry",
        "enjoyed_subjects": ["Mathematics", "Physics"],
        "study_hours": "2to4",
        "coaching_status": "self",
        "career_clarity": "some_idea",
        "learning_style": "practical",
        "target_sector": "private",
        "relocation_pref": "yes",
        "cost_constraint": "no"
    }
    profile_resp = client.post("/profile/save", json=profile_data, headers=headers)
    assert profile_resp.status_code == 200, f"Saving profile failed: {profile_resp.text}"
    print("Profile saved successfully.")
    
    # 3. Start Chat
    print("\n[Step 3] Starting Chat...")
    start_resp = client.post("/chat/start", headers=headers)
    assert start_resp.status_code == 200, f"Starting chat failed: {start_resp.text}"
    start_data = start_resp.json()
    session_id = start_data["session_id"]
    question_id = start_data["question_id"]
    question_text = start_data["question"]
    print(f"Chat started. Session ID: {session_id}")
    print(f"Initial Question (ID: {question_id}): '{question_text}'")
    assert "Integration Test Student" in question_text or "Student" in question_text, "Should welcome by name"
    
    # 4. Continue Chat - Select option
    print("\n[Step 4] Sending choice 'A' (Career Guidance)...")
    chat_resp = client.post("/chat", json={
        "session_id": session_id,
        "choice": "A"
    }, headers=headers)
    assert chat_resp.status_code == 200, f"Continuing chat failed: {chat_resp.text}"
    chat_data = chat_resp.json()
    print(f"Next Question (ID: {chat_data['question_id']}): '{chat_data['question']}'")
    print(f"Skipped profile questions: {chat_data.get('skipped_profile_questions')}")
    
    # 5. Send Free-Text message to check Gemini Integration
    print("\n[Step 5] Sending free-text query: 'What is JEE and what does it lead to?'...")
    text_resp = client.post("/chat", json={
        "session_id": session_id,
        "message": "What is JEE and what does it lead to?"
    }, headers=headers)
    assert text_resp.status_code == 200, f"Sending free-text failed: {text_resp.text}"
    text_data = text_resp.json()
    print(f"Counsellor Response (ID: {text_data['question_id']}):")
    print(text_data["question"])
    
    print("\n--- Integration Test Completed Successfully! ---")

if __name__ == "__main__":
    test_chatbot_e2e()
