import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug é obrigatório' })
  @MaxLength(255, { message: 'O slug deve ter no máximo 255 caracteres' })
  slug: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'A marca deve ter no máximo 100 caracteres' })
  marca?: string;

  @IsUrl({}, { message: 'A imagem deve ser uma URL válida' })
  @IsOptional()
  imagemUrl?: string;

  @IsInt({ message: 'O ID da categoria deve ser um número inteiro' })
  @IsPositive({ message: 'O ID da categoria deve ser um número positivo' })
  @IsOptional()
  categoriaId?: number;
}