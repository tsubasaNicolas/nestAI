/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId, runId } = options;
  
  // En las versiones recientes, se le pasa un objeto con los IDs o se hace el cast correcto
  const runStatus = await openai.beta.threads.runs.retrieve(
    runId,
    { thread_id: threadId } as any,
  );

  console.log({ status: (runStatus as any).status });

  if ((runStatus as any).status === 'completed') {
    return runStatus;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return await checkCompleteStatusUseCase(openai, options);
};