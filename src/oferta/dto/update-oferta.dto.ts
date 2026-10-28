import { PartialType } from '@nestjs/mapped-types';
import { CreateOfertaDto } from './create-oferta.dto.js';

export class UpdateOfertaDto extends PartialType(CreateOfertaDto) {}