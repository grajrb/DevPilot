export class UpsertSettingDto {
  key: string;
  value: string;
  scope?: 'tenant' | 'user' | 'system';
  tenantId?: string;
  userId?: string;
}
