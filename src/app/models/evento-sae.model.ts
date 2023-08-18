export class EventoSaeModel {

  id?: number;
  baseAsignada?: string;
  rutMaestro?: string;
  rutAyudante?: string;
  kmInicial?: number;
  patenteVehiculo?: string;
  fechaSistema?: Date;
  estadoEnvio?: number;

  constructor(data?: Partial<EventoSaeModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
