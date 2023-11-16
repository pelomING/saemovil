

export interface Item {
  text: string;
  value: string;
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
  codigo: string;
  descripcion: string;
}

export interface Comuna {
  codigo: string;
  nombre: string;
  oficina: string;
}

export interface Oficina {
  codigo?: string;
  nombre?: string;
  id_zonal?:string;
}

export interface Turno {
  codigo?: string;
  horario?: string;
}

export interface TiposTurnos {
  codigo_tipoturno?: string;
  nombre_tipoturno?: string;
}
 
export interface SaeBrigadas {
  codigo_brigada?: string;
  nombre_brigada?: string;
}

export interface Vehiculo {
  marca?: string;
  patente?: string;
}

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






