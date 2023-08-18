export class TurnoSaeModel {

  id?: number;
  baseAsignada?: string;
  rutMaestro?: string;
  rutAyudante?: string;
  kmInicial?: number;
  patenteVehiculo?: string;
  fechaSistema?: Date;
  estadoEnvio?: number;

  constructor(data?: Partial<TurnoSaeModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
