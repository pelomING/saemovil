import { Injectable } from '@angular/core';
import { IDBPDatabase } from 'idb';
import { TurnoSaeModel } from '../models/turno-sae.model';
import { IndexdbService } from './indexdb.service'

@Injectable({
  providedIn: 'root'
})

export class TurnoSaeIndexdbService {

  public db!: IDBPDatabase;

  constructor(
    private indexdbService: IndexdbService,
  ) {

    this.indexdbService.openDatabase()
      .then((dbIndex) => {
        this.db = dbIndex;
        console.log("INICIO BASE DE DATOS EN TURNOS");
      })
      .catch((error: any) => {
        console.error('Error al inicializar la base de datos:', error);
      });

  }

  ngOnInit(): void { }

  async guardarTurnosae(turnosae: TurnoSaeModel): Promise<void> {
    await this.db.add('turnos-sae', turnosae);
  }

  async actualizarTurnosae(turno: TurnoSaeModel): Promise<void> {
    await this.db.put('turnos-sae', turno);
  }

  async deleteTurnosae(id: number): Promise<void> {
    await this.db.delete('turnos-sae', id);
  }

  async getAllTurnosae(): Promise<TurnoSaeModel[]> {
    return await this.db.getAll('turnos-sae');
  }

  async getTurnosae(id: number): Promise<TurnoSaeModel | undefined> {
    return await this.db.get('turnos-sae', id);
  }

  async getTurnosaeById(id: number): Promise<any> {
    return this.db.getFromIndex('turnos-sae', 'idIndex', id)
  }


  // async recuperarUltimoTurnoNoEnviado(): Promise<TurnosaeModel | undefined> {
  //     const tx = this.db.transaction('turno-sae', 'readonly');
  //     const store = tx.objectStore('turno-sae');
  //     const index = store.index('estadoEnvio');
  //     const request = index.openCursor(null, 'prev'); // Obtener el último registro en el índice
  //     return new Promise((resolve, reject) => {
  //       request.onsuccess = (event: any) => {
  //         const cursor = event.target.result;
  //         if (cursor) {
  //           const turno = cursor.value;
  //           if (turno.estadoEnvio === 0) {
  //             resolve(turno);
  //           } else {
  //             cursor.continue(); // Continuar buscando
  //           }
  //         } else {
  //           resolve(undefined); // No se encontraron registros no enviados
  //         }
  //       };
  //       request.onerror = (event: any) => {
  //         reject(event.target.error);
  //       };
  //     });
  //   }


}