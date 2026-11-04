import { IsString, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class CreateCupomDto {
  @IsString()
  loja: string;

  @IsString()
  codigo: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  descontoTexto?: string;

  @IsString()
  @IsOptional()
  urlAfiliado?: string;

  @IsString()
  @IsOptional()
  validadeInicio?: string;

  @IsString()
  @IsOptional()
  validadeFim?: string;

  @IsBoolean()
  @IsOptional()
  destaque?: boolean;

  @IsBoolean()
  @IsOptional()
  aplicarEmTodoSite?: boolean;

  @IsString()
  @IsOptional()
  condicoes?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  categoriaIds?: number[];
}