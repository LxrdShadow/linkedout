import OpenAI from "openai";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { ChatCompletion } from "openai/resources/index.mjs";

import { GITHUB_PERSONAL_ACCESS_TOKEN } from "../constants";

const endpoint = "https://models.github.ai/inference";
const model = "xai/grok-3";
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
                { role: "system", content: "Tu es un coach en interview." },
                {
                    role: "user",
                    content: `Vous êtes une IA qui génère des questions d'entretien au format JSON. Veuillez générer 5 questions d'entretien courtes et claires pour un entretien ${difficulty} pour un poste ${role}. Toutes les questions doivent être rédigées en français. ### Format de sortie : Renvoyer le résultat sous forme de tableau JSON valide avec la structure suivante : [ { "text": "Première question ?" }, { "text": "Deuxième question ?" }, ... ] N'incluez pas d'explications ni de commentaires. Affichez uniquement le JSON.`,
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
            text1: "Erreur",
            text1Style: { fontSize: 16, fontWeight: "bold" },
            text2: "Erreur lors de la génération des questions.",
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
                    content: `Tu es un coach en interview et tu a posé cette question à l'utilisateur qui travaille sur un interview en tant que ${role}: "${question}"`,
                },
                {
                    role: "user",
                    content: `Voici la réponse de l'utilisateur : "${answer}". Évaluez la réponse et renvoyez une réponse JSON structurée comprenant : - un bref « feedback » expliquant si la réponse est bonne ou ce qui lui manque, - un « score » compris entre 0 et 5, - un court champ « advice » avec des pistes d'amélioration (dans la même langue que la réponse), - et un « level » (niveau) qui peut être « faible », « moyen » ou « fort ». Renvoie uniquement du JSON valide, comme : { "feedback": "...", "score": 3, "advice": "...", "level": "moyen" }. N'expliquez pas votre raisonnement en dehors du JSON. Utilisez le langage de la réponse pour le feedback.`,
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
            text1: "Erreur",
            text1Style: { fontSize: 16, fontWeight: "bold" },
            text2: "Erreur lors de la génération des retours IA.",
            text2Style: { fontSize: 13 },
        });
        router.push("/interviewOptions");
    } finally {
        setIsLoading(false);
    }
}
