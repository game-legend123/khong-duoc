'use server';
/**
 * @fileOverview Generates diverse and humorous 'Không Được!' (Refused!) responses using AI.
 *
 * - generateRefusalResponse - A function that generates the refusal response.
 * - GenerateRefusalResponseInput - The input type for the generateRefusalResponse function.
 * - GenerateRefusalResponseOutput - The return type for the generateRefusalResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRefusalResponseInputSchema = z.object({
  action: z.string().describe('The action the player attempted.'),
  previousResponses: z.array(z.string()).optional().describe('Previous refusal responses to avoid repetition.'),
});
export type GenerateRefusalResponseInput = z.infer<typeof GenerateRefusalResponseInputSchema>;

const GenerateRefusalResponseOutputSchema = z.object({
  response: z.string().describe('The generated refusal response.'),
});
export type GenerateRefusalResponseOutput = z.infer<typeof GenerateRefusalResponseOutputSchema>;

export async function generateRefusalResponse(input: GenerateRefusalResponseInput): Promise<GenerateRefusalResponseOutput> {
  return generateRefusalResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRefusalResponsePrompt',
  input: {schema: GenerateRefusalResponseInputSchema},
  output: {schema: GenerateRefusalResponseOutputSchema},
  prompt: `You are a humorous game master who is in charge of refusing player actions in creative ways. The game is called "Không Được!" which translates to "Refused!".

  The player attempted the following action: {{{action}}}

  Come up with a funny and unexpected refusal, different from the previous responses (if any): {{#each previousResponses}} - {{this}}{{/each}}

  Respond in Vietnamese.
  Do not include any preamble or explanation, just the refusal.
  The refusal must be short, no more than 20 words.
  Always respond with "Không Được!".
  Do not make up new rules, or explain why the action was refused.
`,
});

const generateRefusalResponseFlow = ai.defineFlow(
  {
    name: 'generateRefusalResponseFlow',
    inputSchema: GenerateRefusalResponseInputSchema,
    outputSchema: GenerateRefusalResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
