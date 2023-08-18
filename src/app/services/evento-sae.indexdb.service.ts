import { Injectable } from '@angular/core';
import { IDBPDatabase } from 'idb';

//import { EventoSaeModel } from '../models/evento-sae.model';
import { EventoSaeModel } from '../interfaces/eventosae.model'

import { IndexdbService } from './indexdb.service'

@Injectable({
  providedIn: 'root'
})

export class EventoSaeIndexdbService {

  public db!: IDBPDatabase;

  constructor(
    private indexdbService: IndexdbService,
  ) {

    this.indexdbService.openDatabase()
      .then((dbIndex) => {
        this.db = dbIndex;
        console.log("INICIO BASE DE DATOS EN EVENTOS-SAE");
      })
      .catch((error: any) => {
        console.error('Error al inicializar la base de datos:', error);
      });

  }

  async guardarEventoSae(turnosae: EventoSaeModel): Promise<void> {
    await this.db.add('eventos-sae', turnosae);
  }

  async actualizarEventoSae(turno: EventoSaeModel): Promise<void> {
    await this.db.put('eventos-sae', turno);
  }

  async deleteEventoSae(id: number): Promise<void> {
    await this.db.delete('eventos-sae', id);
  }

  async getAllEventoSae(): Promise<EventoSaeModel[]> {
    return await this.db.getAll('eventos-sae');
  }

  async getEventoSae(id: number): Promise<EventoSaeModel> {
    return await this.db.get('eventos-sae', id);
  }

}