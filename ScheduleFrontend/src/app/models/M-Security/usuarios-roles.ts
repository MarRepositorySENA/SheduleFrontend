export interface UsuariosRoles {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  usuarioId: {                                // Relación con Usuario
    id: number;
    usuarioName: string;
  };
  roleId: {                                   // Relación con Role
    id: number;
    nombre: string;
  };
}
