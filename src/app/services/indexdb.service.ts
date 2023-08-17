import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase, IDBPObjectStore } from 'idb';

import { TurnosaeModel } from '../models/turnosae.model';
import { EventModel } from '../interfaces/event.model';
import { Shift } from '../interfaces/shift.model';
import { Base } from '../interfaces/base.model';


@Injectable({
  providedIn: 'root'
})

export class IndexdbService {

  private dbName = 'saemovil';
  private dbVersion = 1;
  public db!: IDBPDatabase;

  constructor() {}

  ngOnInit(): void {
    this.openDatabase();
  }

  async openDatabase() {
    return await openDB(this.dbName, this.dbVersion, {
      upgrade(db, oldVersion, newVersion, transaction) {
        
        if (!db.objectStoreNames.contains('eventos-sae')) {
          const store = db.createObjectStore('eventos-sae', { keyPath: 'id', autoIncrement: true });
        } 

        if (!db.objectStoreNames.contains('jornada-sae')) {
          const store = db.createObjectStore('jornada-sae', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('turnos')) {
          db.createObjectStore('turnos', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('tipo-eventos')) {
          db.createObjectStore('tipo-eventos', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('ayudantes')) {
          db.createObjectStore('ayudantes', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('camionetas')) {
          db.createObjectStore('camionetas', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('oficinas')) {
          db.createObjectStore('oficinas', { keyPath: 'id', autoIncrement: true });
        }
        
      },
    });
  }


    // Ejemplo de cómo agregar registros
    // const newEvent1: EventModel = { id: 1, name: 'Evento 1', date: '2023-07-01' };
    // const newEvent2: EventModel = { id: 2, name: 'Evento 2', date: '2023-07-02' };
    // const newEvent3: EventModel = { id: 3, name: 'Evento 3', date: '2023-07-03' };

    // this.indexdbService.addEvent(newEvent1);
    // this.indexdbService.addEvent(newEvent2);
    // this.indexdbService.addEvent(newEvent3);

    // const newShift: Shift = { id: 1, startTime: '09:00 AM', endTime: '05:00 PM' };
    // this.indexdbService.addShift(newShift);

    // const newBase: Base = { id: 1, name: 'Base A', location: 'Ubicación A' };
    // this.indexdbService.addBase(newBase);
  
    //this.loadItemsFromIndexDB();


  async addEvent(event: EventModel): Promise<void> {
    await this.db.add('events', event);
  }

  async addShift(shift: Shift): Promise<void> {
    await this.db.add('shifts', shift);
  }

  async addBase(base: Base): Promise<void> {
    await this.db.add('bases', base);
  }

  async getAllEvents(): Promise<EventModel[]> {
    return await this.db.getAll('events');
  }

  async getAllShifts(): Promise<any[]> {
    return await this.db.getAll('shifts');
  }

  async getAllBases(): Promise<any[]> {
    return await this.db.getAll('bases');
  }

}
