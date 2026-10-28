import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateInscritoDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome?: string;

  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @MaxLength(255, { message: 'O e-mail deve ter no máximo 255 caracteres' })
  email: string;

  @IsString()
  @IsOptional()
  @Matches(/^(\+?55)?[\s(]*\d{2}[\s)]*\d{4,5}[-.\s]?\d{4}$/, {
    message:
      'O WhatsApp deve estar em um formato brasileiro válido. Ex: 11999999999, 1199999-9999, (11) 99999-9999',
  })
  whatsapp?: string;

  @IsBoolean()
  @IsOptional()
  aceitaEmail?: boolean;

  @IsBoolean()
  @IsOptional()
  aceitaWhatsapp?: boolean;
}