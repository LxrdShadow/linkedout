import json
import os
from random import choice


def get_questions_from_json() -> list[dict]:
    path = "./assets/questions.json"
    question_list: list[dict] = []
    if os.path.exists(path):
        with open(path, "r") as file:
            questions = json.load(file)

        for i in range(5):
            question_list.append(choice(questions))

    return question_list
