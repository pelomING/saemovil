export class TurnoSaeModel {

  id?: number;
  rut_maestro?: string;
  rut_ayudante?: string;
  nombre_ayudante?: string;
  
  codigo_brigada?: string;
  codigo_tipoturno?: string;

  codigo_oficina?: string;
  codigo_turno?: string;
  
  patente_vehiculo?: string;
  km_inicia?: string;
  km_final?: string;
  fecha_hora_inicio?: Date;
  fecha_hora_final?: Date;
  latitude?: string;
  longitude?: string;

  fechaSistema?: Date;
  estadoEnvio?: number;

  constructor(data?: Partial<TurnoSaeModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
