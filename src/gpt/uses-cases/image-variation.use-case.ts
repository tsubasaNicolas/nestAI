import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  options: Options,
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const { baseImage } = options;

  const pngImagePath = await downloadImageAsPng(baseImage, true);

  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImagePath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const imageUrl = response.data[0]?.url;

  if (!imageUrl) {
    throw new InternalServerErrorException(
      'No se recibió una URL válida de la imagen generada.',
    );
  }

  const fileName = await downloadImageAsPng(imageUrl);

  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;
  return {
    url: url,
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
