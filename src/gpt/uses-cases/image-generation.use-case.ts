/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* import * as fs from 'fs';
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
 */

import * as fs from 'fs';
import { InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { downloadImageAsPng, downloadBase64ImageAsPng } from 'src/helpers';
import { toFile } from 'openai/uploads';

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

  // 1. Generación normal sin imagen original ni máscara
  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt: prompt,
      model: 'gpt-image-2.5-sunburst' as any,
      n: 1,
      size: '1024x1024',
      // ¡Quitamos 'response_format' porque este modelo no lo soporta!
    } as any);

    if (!response.data || response.data.length === 0) {
      throw new InternalServerErrorException(
        'No se recibieron datos en la respuesta de la imagen generada.',
      );
    }

    const imageData = response.data[0] as any;
    const base64Image = imageData.b64_json;
    const imageUrl = imageData.url;

    let fileName = '';

    if (base64Image) {
      // Guardamos usando nuestro helper de base64
      fileName = await downloadBase64ImageAsPng(base64Image, false);
    } else if (imageUrl) {
      fileName = await downloadImageAsPng(imageUrl);
    } else {
      throw new InternalServerErrorException(
        'No se recibió una imagen válida de OpenAI.',
      );
    }

    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url,
      openAIUrl: imageUrl || 'base64-format',
      revised_prompt: imageData.revised_prompt,
    };
  }

  // 2. Edición / Variación con imagen y máscara
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadImageAsPng(maskImage, true);

  const response = await openai.images.edit({
    model: 'gpt-image-2.5-sunburst' as any,
    prompt: prompt,
    image: await toFile(fs.createReadStream(pngImagePath), null, {
      type: 'image/png',
    }),
    mask: await toFile(fs.createReadStream(maskPath), null, {
      type: 'image/png',
    }),
    n: 1,
    size: '1024x1024',
  } as any);

  if (!response.data || response.data.length === 0) {
    throw new InternalServerErrorException(
      'No se recibieron datos en la respuesta de la edición de imagen.',
    );
  }

  const imageData = response.data[0] as any;
  const base64Image = imageData.b64_json;
  const imageUrl = imageData.url;

  let fileName = '';

  if (base64Image) {
    fileName = await downloadBase64ImageAsPng(base64Image, false);
  } else if (imageUrl) {
    fileName = await downloadImageAsPng(imageUrl);
  } else {
    throw new InternalServerErrorException(
      'No se recibió una imagen válida en la edición.',
    );
  }

  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    openAIUrl: imageUrl || 'base64-format',
    revised_prompt: imageData.revised_prompt,
  };
};