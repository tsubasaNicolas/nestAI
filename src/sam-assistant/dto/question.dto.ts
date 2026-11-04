// import { IsString } from 'class-validator';

// export class QuestionDto {
//   @IsString()
//   readonly threadId: string;

//   @IsString()
//   readonly question: string;
// }

import { IsString, IsOptional } from 'class-validator';

export class QuestionDto {
  @IsString()
  readonly question!: string;

  @IsOptional()
  @IsString()
  readonly previousResponseId?: string;
}