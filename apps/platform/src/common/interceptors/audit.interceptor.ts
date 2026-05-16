import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { AUDIT_LOG_KEY, AuditLogOptions } from '../decorators/audit-log.decorator';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditOptions = this.reflector.getAllAndOverride<AuditLogOptions>(
      AUDIT_LOG_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!auditOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramValue = auditOptions.param
      ? request.params[auditOptions.param]
      : undefined;

    return next.handle().pipe(
      tap(() => {
        this.auditService.log({
          tenantId: user?.tenantId || 'unknown',
          userId: user?.id || 'system',
          action: auditOptions.action,
          resourceType: auditOptions.resourceType,
          resourceId: paramValue || request.params?.id || 'unknown',
          ipAddress: request.ip || request.connection?.remoteAddress || '',
          userAgent: request.headers['user-agent'] || '',
          metadata: {
            method: request.method,
            path: request.route?.path,
          },
        }).catch((err) => console.error('Audit log failed:', err));
      }),
    );
  }
}