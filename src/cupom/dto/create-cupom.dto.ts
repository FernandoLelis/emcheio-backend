import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateCupomDto {
  @IsString()
  @IsNotEmpty({ message: 'A loja é obrigatória' })
  @MaxLength(50, { message: 'A loja deve ter no máximo 50 caracteres' })
  loja: string;

  @IsString()
  @IsNotEmpty({ message: 'O código é obrigatório' })
  @MaxLength(50, { message: 'O código deve ter no máximo 50 caracteres' })
  codigo: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  descricao?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'O desconto deve ter no máximo 50 caracteres' })
  descontoTexto?: string;

  @IsUrl({}, { message: 'A URL de afiliado deve ser válida' })
  @IsOptional()
  urlAfiliado?: string;

  @IsDateString(
    {},
    { message: 'A data de início deve estar no formato ISO (YYYY-MM-DD)' },
  )
  @IsOptional()
  validadeInicio?: string;

  @IsDateString(
    {},
    { message: 'A data de fim deve estar no formato ISO (YYYY-MM-DD)' },
  )
  @IsOptional()
  validadeFim?: string;

  @IsBoolean()
  @IsOptional()
  destaque?: boolean;
}