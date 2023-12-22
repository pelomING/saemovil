export class EventoSaeModel {

  id!: number;
  numero_ot!: string;
  despachador!: string;
  tipo_evento!: string;
  direccion!: string;
  
  trabajo_solicitado?: string;
  trabajo_realizado?: string;

  rut_maestro?: string;
  rut_ayudante?: string;
  codigo_brigada?: string;
  codigo_tipoturno?: string;
  patente_vehiculo?: string;
  fecha_hora_inicio_turno!: string;
  
  //codigo_turno?: string;
  //codigo_oficina?: string;
  codigo_comuna!: string;
  fecha_hora_ejecucion!: Date;
  hora_inicio!: string;
  hora_termino!: string;
  latitude?: string;
  longitude?: string;
  estadoEnvio?: number;

  constructor(data?: Partial<EventoSaeModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
