import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * @description Data Transfer Object (DTO) for handling pagination query parameters.
 * Provides standardized way to request paginated data from API endpoints.
 * Includes validation for page number and limit.
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination. Defaults to 1.',
    type: Number,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number) // Transform query param string to number
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page. Defaults to 10, Max 100.',
    type: Number,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number) // Transform query param string to number
  @IsInt()
  @Min(1)
  @Max(100) // To prevent excessively large requests
  limit?: number = 10;
}
