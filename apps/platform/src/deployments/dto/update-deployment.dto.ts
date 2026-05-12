export class UpdateDeploymentDto {
  status?: 'pending' | 'deploying' | 'success' | 'failed';
  logs?: string;
}