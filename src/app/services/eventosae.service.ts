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


import { EventoSaeModel } from '../models/evento-sae.model';
import { IndexdbService } from './indexdb.service';
import { EventoSaeIndexdbService } from '../services/evento-sae.indexdb.service';
import { UsuarioService } from './usuario.service';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})

export class EventoSaeService {

  token: string = '';

  public db!: IDBPDatabase;
  private eventoSaeModel: EventoSaeModel = new EventoSaeModel();

  constructor(private http: HttpClient,
    private storage: Storage,
    private indexdbService: IndexdbService,
    private usuarioService: UsuarioService,
    private eventoSaeIndexdb: EventoSaeIndexdbService
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


  async EnviarEvento(ev: EventoSaeModel) {

    const data = {
      num_ot: ev.numero_ot.toString(),
      tipo_evento: ev.tipo_evento.toString(),
      rut_maestro: ev.rut_maestro,
      rut_ayudante: ev.rut_ayudante,
      codigo_turno: ev.codigo_turno,
      codigo_oficina: ev.codigo_oficina,
      requerimiento: ev.requerimiento,
      direccion: ev.direccion,
      fecha_hora_ejecucion: this.formatearFecha(ev.fecha_hora_ejecucion)
    };

    await this.usuarioService.cargarToken();
    this.token = this.usuarioService.token;

    return new Promise<boolean>(resolve => {

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}` // Agregar el token en el encabezado
      });


      console.log("DATOS EVENTOS SAE:",data);
       


      this.http.post(`${URL}/eventos-sae`, data, { headers, observe: 'response' })
        .pipe(
          catchError(error => {

            resolve(false);
            console.error('Error en la solicitud HTTP eventos-sae:', error.error.message);
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

              ev.estadoEnvio = 1;

              this.eventoSaeIndexdb.actualizarEventoSae(ev).then(() => {
                console.log('Datos Actualizados en IndexDB:', ev);
              });

              resolve(true);

            } else {

              resolve(false);

            }

          }

        );

    });

  }


}
