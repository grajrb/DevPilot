export class CreateTeamDto {
  name: string;
  description?: string;
  ownerId: string;
  memberIds?: string[];
  tenantId?: string;
}
