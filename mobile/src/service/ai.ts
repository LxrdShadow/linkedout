import OpenAI from "openai";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { ChatCompletion } from "openai/resources/index.mjs";

import { GITHUB_PERSONAL_ACCESS_TOKEN } from "../constants";

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";
const client = new OpenAI({
    baseURL: endpoint,
    apiKey: GITHUB_PERSONAL_ACCESS_TOKEN,
});

function parseResponse(response: ChatCompletion) {
    const raw = response.choices[0].message.content;
    const cleaned = raw?.replace(/```json|```/g, "").trim();
    return JSON.parse(String(cleaned));
}

export async function getQuestions(
    role: string,
    difficulty: string,
    setIsLoading: (value: boolean) => void,
) {
    setIsLoading(true);
    try {
        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are an interview coach." },
                {
                    role: "user",
                    content: `You are an AI that generates interview questions in JSON format. Please generate 5 short and clear interview questions for a ${difficulty} interview for a ${role} position. All questions must be written in English. ### Output format: Return the result as a valid JSON array with the following structure: [ { "text": "First question?" }, { "text": "Second question?" }, ... ] Do not include explanations or comments. Display only the JSON.`,
                },
            ],
            model: model,
            temperature: 1,
            max_tokens: 4096,
            top_p: 1,
        });
        const cleaned = parseResponse(response);

        return cleaned;
    } catch (err) {
        console.log(err);
        Toast.show({
            type: "error",
            text1: "Error",
            text1Style: { fontSize: 16, fontWeight: "bold" },
            text2: "Failed to generate questions.",
            text2Style: { fontSize: 13 },
        });
        router.push("/interviewOptions");
    } finally {
        setIsLoading(false);
    }
}

export async function getFeedback(
    role: string,
    question: string,
    answer: string,
    setIsLoading: (value: boolean) => void,
) {
    setIsLoading(true);
    try {
        const response = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an interview coach and you asked this question to the user who is working on an interview as ${role}: "${question}"`,
                },
                {
                    role: "user",
                    content: `Here is the user's answer: "${answer}". Evaluate the answer and return a structured JSON response including: - a short "feedback" explaining whether the answer is correct or what is missing, - a "score" between 0 and 5, - a short "advice" field with suggestions for improvement (in the same language as the answer), - and a "level" which can be "weak", "medium", or "strong". Return only valid JSON, such as: { "feedback": "...", "score": 3, "advice": "...", "level": "medium" }. Do not explain your reasoning outside of the JSON. Use the language in the answer for feedback.`,
                },
            ],
            model: model,
            temperature: 1,
            max_tokens: 4096,
            top_p: 1,
        });
        const cleaned = parseResponse(response);

        return cleaned;
    } catch (err) {
        console.log(err);
        Toast.show({
            type: "error",
            text1: "Error",
            text1Style: { fontSize: 16, fontWeight: "bold" },
            text2: "Failed to generate IA feedback.",
            text2Style: { fontSize: 13 },
        });
        router.push("/interviewOptions");
    } finally {
        setIsLoading(false);
    }
}
