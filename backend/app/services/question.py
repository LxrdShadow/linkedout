import json
import os
import re
from random import choice

from openai import OpenAI
from openai.types.chat import ChatCompletion

from app.core.config import GITHUB_PERSONAL_ACCESS_TOKEN

endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1"
client = OpenAI(api_key=GITHUB_PERSONAL_ACCESS_TOKEN, base_url=endpoint)


def get_questions_from_json() -> list[dict]:
    path = "./assets/questions.json"
    question_list: list[dict] = []
    if os.path.exists(path):
        with open(path, "r") as file:
            questions = json.load(file)

        for i in range(5):
            question_list.append(choice(questions))

    return question_list


def get_questions_from_ai(role: str, difficulty: str) -> list[dict]:
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are an interview coach."},
            {
                "role": "user",
                "content": f'You are an AI that generates interview questions in JSON format. Please generate 5 short and clear interview questions for a {difficulty} interview for a {role} position. All questions must be written in English. ### Output format: Return the result as a valid JSON array with the following structure: [ {{ "text": "First question?" }}, {{ "text": "Second question?" }}, ... ] Do not include explanations or comments. Display only the JSON.',
            },
        ],
        temperature=1.0,
        top_p=1.0,
        model=model,
    )

    return parse_response(response)


def get_feedback(role: str, question: str, answer: str) -> list[dict]:
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": f'You are an interview coach and you asked this question to the user who is working on an interview as {role}: "{question}"',
            },
            {
                "role": "user",
                "content": f'Here is the user\'s answer: "{answer}". Evaluate the answer and return a structured JSON response including: - a short "feedback" explaining whether the answer is correct or what is missing, - a "score" between 0 and 5, - a short "advice" field with suggestions for improvement (in the same language as the answer), - and a "level" which can be "weak", "medium", or "strong". Return only valid JSON, such as: {{ "feedback": "...", "score": 3, "advice": "...", "level": "medium" }}. Do not explain your reasoning outside of the JSON. Use English for the feedback.',
            },
        ],
        temperature=1.0,
        top_p=1.0,
        model=model,
    )

    return parse_response(response)


def parse_response(response: ChatCompletion):
    raw = None
    if response and response.choices and len(response.choices) > 0:
        raw = response.choices[0].message.content

    cleaned = None
    if raw is not None:
        cleaned = re.sub(r"```json|```", "", raw).strip()

    if cleaned:
        return json.loads(cleaned)
    else:
        raise ValueError("No parsable JSON content found in the response.")
