import { PartialType } from '@nestjs/mapped-types';
import { CreateCupomDto } from './create-cupom.dto.js';

export class UpdateCupomDto extends PartialType(CreateCupomDto) {}