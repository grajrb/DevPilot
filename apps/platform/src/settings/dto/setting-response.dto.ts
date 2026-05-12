export class SettingResponseDto {
  id: string;
  key: string;
  value: string;
  scope: 'tenant' | 'user' | 'system';
  tenantId?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}