/* eslint-disable @typescript-eslint/no-unsafe-return */
import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (
  openai: OpenAI,
  { prompt, lang }: Options,
) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Traduce el siguiente texto al idioma ${lang}:${prompt}
        
        `,
      },
    ],
    // model: 'gpt-3.5-turbo-1106',
    temperature: 0.3,
    // max_tokens: 150,
  });

  return { message: response.choices[0].message.content };
};
