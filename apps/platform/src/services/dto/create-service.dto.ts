export class CreateServiceDto {
  name: string;
  description?: string;
  protocol: 'http' | 'grpc' | 'graphql';
  endpoints?: {
    path: string;
    method: string;
    timeout: number;
    retries: number;
  }[];
  healthCheckUrl?: string;
  metadata?: Record<string, any>;
}