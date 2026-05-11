import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantsService } from '../../tenants/tenants.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantsService: TenantsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant from subdomain, header, or JWT
    const tenantId = this.extractTenantId(req);
    if (!tenantId) {
      throw new UnauthorizedException('Tenant not identified');
    }

    // Verify tenant exists
    const tenant = await this.tenantsService.findOne(tenantId);
    if (!tenant) {
      throw new UnauthorizedException('Invalid tenant');
    }

    // Set tenant context for the request
    (req as any).tenant = tenant;
    (req as any).tenantId = tenantId;

    next();
  }

  private extractTenantId(req: Request): string | null {
    // Check header first (for API calls)
    const header = req.headers['x-tenant-id'];
    if (header) {
      return Array.isArray(header) ? header[0] : header;
    }

    // For JWT-authenticated requests, tenant comes from user
    if ((req as any).user?.tenantId) {
      return (req as any).user.tenantId;
    }

    // For web requests, could extract from subdomain
    const host = req.headers.host || '';
    const subdomain = host.split('.')[0];
    return subdomain === 'www' || subdomain === 'app' ? null : subdomain;
  }
}
