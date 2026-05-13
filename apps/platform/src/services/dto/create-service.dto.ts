import { IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class ServiceEndpointDto {
  @IsString()
  path: string;

  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  timeout?: number;

  @IsOptional()
  retries?: number;
}

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['http', 'grpc', 'graphql'])
  protocol?: string;

  @IsOptional()
  @IsString()
  healthCheckUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceEndpointDto)
  endpoints?: ServiceEndpointDto[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}