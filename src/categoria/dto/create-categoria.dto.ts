import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug é obrigatório' })
  @MaxLength(100, { message: 'O slug deve ter no máximo 100 caracteres' })
  slug: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'O ícone deve ter no máximo 50 caracteres' })
  icone?: string;
}