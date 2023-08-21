export class TurnoSaeModel {

  id?: number;
  rut_maestro?: string;
  rut_ayudante?: string;
  codigo_turno?: string;
  patente_vehiculo?: string;
  codigo_oficina?: string;
  km_inicia?: string;
  km_final?: string;
  fecha_hora_inicio?: Date;
  fecha_hora_final?: Date;
  fechaSistema?: Date;
  estadoEnvio?: number;

  constructor(data?: Partial<TurnoSaeModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
