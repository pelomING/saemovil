import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase, IDBPObjectStore } from 'idb';

import { TurnoSaeModel } from '../models/turno-sae.model';
import { EventoSaeModel } from '../interfaces/eventosae.model';
import { Shift } from '../interfaces/shift.model';
import { Base } from '../interfaces/base.model';


@Injectable({
  providedIn: 'root'
})

export class IndexdbService {

  private dbName = 'saemovil';
  private dbVersion = 1;
  public db!: IDBPDatabase;

  constructor() {  }

  ngOnInit(): void {
    this.openDatabase();
  }


  async openDatabase() {
    return await openDB(this.dbName, this.dbVersion, {
      upgrade(db, oldVersion, newVersion, transaction) {

        if (!db.objectStoreNames.contains('eventos-sae')) {
          const store = db.createObjectStore('eventos-sae', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('turnos-sae')) {
          const store = db.createObjectStore('turnos-sae', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('turnos')) {
          db.createObjectStore('turnos', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('eventos')) {
          db.createObjectStore('eventos', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('ayudantes')) {
          db.createObjectStore('ayudantes', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('vehiculos')) {
          db.createObjectStore('vehiculos', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('oficinas')) {
          db.createObjectStore('oficinas', { keyPath: 'id', autoIncrement: true });
        }

      },
    });
  }


  async clearTableInIndexedDB(tableName: string) {
    
    const db = await openDB('saemovil', 1);

    if (db.objectStoreNames.contains(tableName)) {

      const transaction = db.transaction(tableName, 'readwrite');
      
      const store = transaction.objectStore(tableName);

      store.clear();

      await transaction.commit;

      transaction.oncomplete = () => {
        console.log(`Tabla ${tableName} borrada exitosamente.`);
      };

    } else {
      console.log(`La tabla ${tableName} no existe en la base de datos.`);
    }
  }


  async getAllAyudantes(): Promise<any[]> {
    const db = await openDB('saemovil', 1);
    return await db.getAll('ayudantes');
  }

  async getAllEventos(): Promise<any[]> {
    return await this.db.getAll('eventos');
  }

  async getAllOficinas(): Promise<any[]> {
    return await this.db.getAll('oficinas');
  }

  async getAllTurnos(): Promise<any[]> {
    return await this.db.getAll('turnos');
  }

  async getAllVehiculos(): Promise<any[]> {
    return await this.db.getAll('vehiculos');
  }

  async getAllFromIndex(tableName: string): Promise<any[]> {
    try {
      const db = await openDB('saemovil', 1);
      const data = await db.getAll(tableName);
      return data ? Object.values(data) : [];
    } catch (error) {
      throw error;
    }
  }


}
