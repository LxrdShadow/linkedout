import OpenAI from "openai";
import { GITHUB_PERSONAL_ACCESS_TOKEN } from "../constants";
import { handleApiError } from "../lib/errors";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: GITHUB_PERSONAL_ACCESS_TOKEN,
});

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
            model: "openai/gpt-4o",
            temperature: 1,
            max_tokens: 4096,
            top_p: 1,
        });
        const raw = response.choices[0].message.content;
        const cleaned = raw?.replace(/```json|```/g, "").trim();

        return JSON.parse(String(cleaned));
    } catch (err) {
        const newErr = handleApiError(err);
        Toast.show({
            type: "error",
            text1: "Erreur",
            text1Style: { fontSize: 16, fontWeight: "bold" },
            text2: String(newErr),
            text2Style: { fontSize: 13 },
        });
        router.push("/interviewOptions");
    } finally {
        setIsLoading(false);
    }
}
