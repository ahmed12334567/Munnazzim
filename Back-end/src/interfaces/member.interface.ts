export type MemberRole = 'admin' | 'member' | 'viewer' | 'owner';

export interface Member {
    userId?: string;
    projectId: string;
    role: MemberRole;
}