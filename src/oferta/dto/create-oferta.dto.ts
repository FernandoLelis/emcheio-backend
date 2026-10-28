import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateOfertaDto {
  @IsInt({ message: 'O ID do produto deve ser um número inteiro' })
  @IsPositive({ message: 'O ID do produto deve ser positivo' })
  @IsNotEmpty({ message: 'O ID do produto é obrigatório' })
  produtoId: number;

  @IsString()
  @IsNotEmpty({ message: 'A loja é obrigatória' })
  @MaxLength(50, { message: 'A loja deve ter no máximo 50 caracteres' })
  loja: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O preço deve ter no máximo 2 casas decimais' },
  )
  @IsPositive({ message: 'O preço atual deve ser positivo' })
  precoAtual: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  precoOriginal?: number;

  @IsUrl({}, { message: 'A URL de afiliado deve ser válida' })
  @IsNotEmpty({ message: 'A URL de afiliado é obrigatória' })
  urlAfiliado: string;

  @IsBoolean()
  @IsOptional()
  disponivel?: boolean;

  @IsBoolean()
  @IsOptional()
  destaque?: boolean;
}