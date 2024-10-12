export interface VistasRoles {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  vistaId: {                                 // Relación con Vista
    id: number;
    nombre: string;
  };
  roleId: {                                  // Relación con Role
    id: number;
    nombre: string;
  };
}
