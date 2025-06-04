import { PartialType } from '@nestjs/swagger';
import { CreateOpportunityDto } from './create-opportunity.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateOpportunityDto extends PartialType(CreateOpportunityDto) {
  @ApiPropertyOptional({ description: 'Reason if the opportunity was lost. Required if stage is Closed Lost.' })
  @IsOptional()
  @IsString({ message: 'Lost reason must be a string.' })
  @MaxLength(500, { message: 'Lost reason must not exceed 500 characters.' })
  lostReason?: string;
}
