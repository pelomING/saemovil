export class EventoSaeModel {

  id!: number;
  numero_ot!: string;
  tipo_evento!: string;
  direccion!: string;
  requerimiento!: number;
  rut_maestro?: string;
  rut_ayudante?: string;
  codigo_turno?: string;
  codigo_oficina?: string;
  fecha_hora_ejecucion!: Date;
  estadoEnvio?: number;

  constructor(data?: Partial<EventoSaeModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
