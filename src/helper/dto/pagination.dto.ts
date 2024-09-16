import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationSearchDto {
  @ApiPropertyOptional({
    title: 'Page Number',
    description: 'The page number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    title: 'Limit',
    description: 'The number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    title: 'Search Keyword',
    description: 'The keyword to search for data',
  })
  @IsOptional()
  @IsString()
  searchKey?: string;
}
