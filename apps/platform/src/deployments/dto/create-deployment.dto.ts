export class CreateDeploymentDto {
  serviceId: string;
  version: string;
  status?: 'pending' | 'deploying' | 'success' | 'failed';
  deployedById?: string;
  logs?: string;
  tenantId?: string;
}
