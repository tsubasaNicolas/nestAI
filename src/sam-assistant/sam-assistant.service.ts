// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { Injectable } from '@nestjs/common';
// import OpenAI from 'openai';
// import { createThreadUseCase } from './use-cases/create-thread.use-case';
// import { QuestionDto } from './dto/question.dto';
// import {
//   checkCompleteStatusUseCase,
//   createmessageUseCase,
//   createRunUseCase,
//   getMessageListUseCase,
// } from './use-cases';

// @Injectable()
// export class SamAssistantService {
//   private openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });

//   async createThread() {
//     return await createThreadUseCase(this.openai);
//   }

//   async userQuestion(questionDto: QuestionDto) {
//     const { threadId, question } = questionDto;

//     const message = await createmessageUseCase(this.openai, {
//       threadId,
//       question,
//     });

//     const run = await createRunUseCase(this.openai, { threadId });

//     await checkCompleteStatusUseCase(this.openai, {
//       runId: run.id,
//       threadId: threadId,
//     });

//     const messages = await getMessageListUseCase(this.openai, { threadId });
//     return messages.reverse();
//   }
// }

import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { QuestionDto } from './dto/question.dto';

@Injectable()
export class SamAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async userQuestion(questionDto: QuestionDto) {
    const { question, previousResponseId } = questionDto;

    const response = await this.openai.responses.create({
      model: 'gpt-6-luna', // ajusta al modelo que tengas disponible
       instructions: `Eres Sam, el asistente oficial de AllMyFootball, la red del fútbol mundial.
Tu trabajo es responder preguntas sobre la plataforma basándote EXCLUSIVAMENTE en el documento oficial de AllMyFootball.
Sé amable, cordial y conversacional. Las respuestas deben ser cortas simulando un chat.
Al iniciar la conversación, preséntate y pregunta: "¿Qué te gustaría saber sobre AllMyFootball? Puedo contarte sobre equipos, partidos, estadísticas o cómo funciona la plataforma".
Si no sabes la respuesta, di: "Esa información no está documentada en la base de conocimiento actual".
Cuando te pregunten por pasos, usa listas numeradas.`,
      input: question,
      tools: [
        {
          type: 'file_search',
          vector_store_ids: [
            'vs_6aeabeab10388191ac455b05b3398c59', // AMF Knowledge Base v1
            // 'vs_allmyfootball_xxx', // descomenta cuando lo crees
          ],
        },
      ],
      ...(previousResponseId && { previous_response_id: previousResponseId }),
    });

    return {
      text: response.output_text,
      responseId: response.id,
    };
  }
}