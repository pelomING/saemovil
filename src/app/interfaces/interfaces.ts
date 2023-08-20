
export interface RespuestaPosts {
  ok: boolean;
  pagina: number;
  posts: Post[];
}

export interface Post {
  imgs?: string[];
  _id?: string;
  mensaje?: string;
  coords?: string;
  usuario?: Usuario;
  created?: string;
}

export interface Usuario {
  avatar?: string;
  _id?: string;
  nombre?: string;
  email?: string;
  password?: string;
  rut?: string;
}

export interface Ayudante {
  rut_ayudante?: string;
  nombre?: string;
}


export interface Evento {
  codigo?: string;
  descripcion?: string;
}


export interface Oficina {
  codigo?: string;
  nombre?: string;
}


export interface Turno {
  codigo?: string;
  horario?: string;
}


export interface Vehiculo {
  marca?: string;
  patente?: string;
}








