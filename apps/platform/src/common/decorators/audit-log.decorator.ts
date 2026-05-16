import { SetMetadata } from '@nestjs/common';

export interface AuditLogOptions {
  action: string;
  resourceType: string;
  param?: string;
}

export const AUDIT_LOG_KEY = 'audit_log';
export const AuditLog = (options: AuditLogOptions) => SetMetadata(AUDIT_LOG_KEY, options);