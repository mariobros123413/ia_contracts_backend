import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService {
    private readonly openAiApiKey = process.env.OPENAI_API_KEY;
    private openai: OpenAI;
    constructor() {
        this.openai = new OpenAI({
            apiKey: this.openAiApiKey,
        });
    }
    async generateDocument(type: string, data: string): Promise<string> {
        try {
            const prompt = this.buildPrompt(type, data);
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        "role": "system",
                        "content": "You will be a professional lawyer who generates formal contracts for a hotel, who will receive the type of contract and contract data, and you will generate a formal contract for these"
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_completion_tokens: 1000,
                temperature: 0.2
            });
            //console.log("response : ", response);

            const rawDocument = response.choices[0]?.message?.content.trim() || '';
            //console.log("rawDocument : ", rawDocument);
            return this.formatDocument(rawDocument);
        } catch (error) {
            throw new HttpException(
                'Error al generar el documento',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private buildPrompt(type: string, data: string): string {
        // return `Por favor, genera un documento formal de tipo "${type}" con los siguientes datos imprescindibles:\n${data}`;
        return `Please generate a formal document for a legal contract of type "${type}" with the following essential data:\n${data}`;
    }

    private formatDocument(rawDocument: string): string {

        try {
            const parsedResponse = rawDocument.replace(/\*\*/g, '');
            return parsedResponse;
        } catch (error) {
            // En caso de no ser JSON, devuelve el texto tal como se recibió
            return rawDocument;
        }
    }
}
