export type Role = 'admin' | 'member' | 'viewer' ;
export interface Invitation {
    projectId: string;
    invitedBy: string;
    email: string;
    role: Role;
}