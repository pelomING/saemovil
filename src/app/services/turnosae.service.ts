import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IDBPDatabase } from 'idb';
import { format } from 'date-fns';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EMPTY } from 'rxjs';
import { environment } from '../../environments/environment';

import { TurnoSaeModel } from '../models/turno-sae.model';
import { IndexdbService } from './indexdb.service';
import { TurnoSaeIndexdbService } from '../services/turno-sae.indexdb.service';
import { UsuarioService } from './usuario.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TurnoSaeService {


  token: string = '';

  public db!: IDBPDatabase;
  private eventoSaeModel: TurnoSaeModel = new TurnoSaeModel();

  constructor(
    private http: HttpClient,
    private indexdbService: IndexdbService,
    private usuarioService: UsuarioService,
    private turnoSaeIndexdbService: TurnoSaeIndexdbService
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


  formatearFecha(fecha: Date): string {
    return format(fecha, 'dd/MM/yyyy HH:mm'); // Puedes ajustar el formato según tus necesidades
  }


  async EnviarTurno(turData: TurnoSaeModel) {

    await this.usuarioService.cargarToken();
    this.token = this.usuarioService.token;

    return new Promise<boolean>(resolve => {

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}` // Agregar el token en el encabezado
      });

      console.log("DATOS TURNOS SAE:", turData);

      this.http.post(`${URL}/turnos-sae`, turData, { headers, observe: 'response' })
        .pipe(
          catchError(error => {

            resolve(false);
            console.error('Error en la solicitud HTTP turnos-sae:', error.error.message);
            return EMPTY;

          })
        )
        .subscribe(
          async (response: any) => {

            // Acceder a diferentes partes de la respuesta
            const responseBody = response.body; // Cuerpo de la respuesta
            const status = response.status; // Código de estado HTTP
            const headers = response.headers; // Encabezados de la respuesta

            console.log('responseBody:', responseBody);
            console.log('status:', status);
            console.log('headers:', headers);

            if (response) {

              // ev.estadoEnvio = 1;

              // this.eventoSaeIndexdb.actualizarEventoSae(ev).then(() => {
              //   console.log('Datos Actualizados en IndexDB:', ev);
              // });

              resolve(true);

            } else {

              resolve(false);

            }

          }

        );

    });

  }


}
