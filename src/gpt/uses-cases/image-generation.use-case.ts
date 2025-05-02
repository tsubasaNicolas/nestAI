import * as fs from 'fs';
import { InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers';
import { toFile } from 'openai/uploads'; // ✅ IMPORTANTE

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  // Generación normal sin imagen original ni máscara
  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt: prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
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
      url,
      openAIUrl: imageUrl,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  // Variación con imagen y máscara (ambas en formato PNG ya convertidas con sharp)
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadImageAsPng(maskImage, true);

  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt: prompt,
    image: await toFile(fs.createReadStream(pngImagePath), null, {
      type: 'image/png',
    }),
    mask: await toFile(fs.createReadStream(maskPath), null, {
      type: 'image/png',
    }),
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
    url,
    openAIUrl: imageUrl,
    revised_prompt: response.data[0].revised_prompt,
  };
};
