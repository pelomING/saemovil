import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IDBPDatabase } from 'idb';

import { environment } from '../../environments/environment';
import { Usuario, Ayudante, Evento, Oficina, Turno, Vehiculo } from '../interfaces/interfaces';
import { IndexdbService } from './indexdb.service'

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

 token: string = '';
 rut_user: string = '';

 public db!: IDBPDatabase;
 
 private usuario: Usuario = {};

//  private ayudante: Ayudante = {};
//  private evento: Evento = {};
//  private oficina: Oficina = {};
//  private turno: Turno = {};
//  private vehiculo: Vehiculo = {};

 
  constructor( private http: HttpClient,
               private storage: Storage,
               private navCtrl: NavController,
               private indexdbService: IndexdbService 
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


  private async initStorage() {
      
      this.storage.create().then(() => {
        console.log('Base de datos creada');
      }).catch((error) => {
        console.error('Error al crear la base de datos:', error);
      });

  }
              
              

  login( rut: string, password: string ) {

    const data = { rut, password };

    return new Promise( resolve => {

      this.http.post(`${ URL }/auth/login`, data , { observe: 'response' }).subscribe( 
        async (response: any) => {
          
          console.log('Tipo de respuesta:', typeof response.body);
          console.log('Contenido de la respuesta:', response.body);
          const resp = response.body;

          if ( resp.token ) {
            
            this.initStorage();

            await this.guardarToken( resp.token );

            await this.guardarUser( resp.user.rut );
            
            await this.getObjetoParaSelects('ayudantes');
            await this.getObjetoParaSelects('eventos');
            await this.getObjetoParaSelects('oficinas');
            await this.getObjetoParaSelects('turnos');
            await this.getObjetoParaSelects('vehiculos');
             
            resolve(true);
          } else {
            this.token = '';
            this.storage.clear();
            resolve(false);
          }

        },
        (error) => {
          console.error('Error en la solicitud HTTP:', error);
          resolve(false);
        }
      );

    });

  }


  logout() {
    this.token   = '';
    this.usuario = {};
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', { animated: true });
  }


  // registro( usuario: Usuario ) {
  //   return new Promise( resolve => {
  //     this.http.post(`${ URL }/user/create`, usuario )
  //         .subscribe( async resp => {
  //           console.log(resp);
  //           if ( resp['ok'] ) {
  //             await this.guardarToken( resp['token'] );
  //             resolve(true);
  //           } else {
  //             this.token = null;
  //             this.storage.clear();
  //             resolve(false);
  //           }
  //         });
  //   });
  // }


  async guardarUser(user_rut: string) {
    this.rut_user = user_rut;
    await this.storage.set('rut_user',this.rut_user);
  }


  async guardarToken( token: string ) {
    this.token = token;
    await this.storage.set('token', token);
  }


  async cargarToken() {
    try {
      this.initStorage();
      this.token = await this.storage.get('token') || null;
      console.log("cargarToken:", this.token);
    } catch (error) {
      console.error('Error al cargar el token:', error);
    }
  }
  

  async cargarRut_User() {
    try {
      this.initStorage();
      this.rut_user = await this.storage.get('rut_user') || null;
      console.log("cargarUser:", this.rut_user);
    } catch (error) {
      console.error('Error al cargar el user:', error);
    }
  }



  // async validaToken(): Promise<boolean> {

  //   await this.cargarToken();

  //   if ( !this.token ) {
  //     this.navCtrl.navigateRoot('/login');
  //     return Promise.resolve(false);
  //   }

  //   return new Promise<boolean>( resolve => {

  //     const headers = new HttpHeaders({
  //       'x-token': this.token
  //     });

  //     this.http.get(`${ URL }/user/`, { headers })
  //       .subscribe( resp => {

  //         if ( resp['ok'] ) {
  //           this.usuario = resp['usuario'];
  //           resolve(true);
  //         } else {
  //           this.navCtrl.navigateRoot('/login');
  //           resolve(false);
  //         }

  //       });

  //   });

  // }



  async getObjetoParaSelects(tablaApi: string): Promise<boolean> {

    await this.cargarToken();

    if ( !this.token ) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>( resolve => {

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      this.http.get(`${URL}/${tablaApi}/find-all`, { observe: 'response',headers }).subscribe( 
        async (response: any) => {

          console.log('Trabajando en la tabla:', tablaApi);

          console.log('Contenido de la respuesta:', response.body);

          const resp = response.body;

          if ( response ) 
          {

           await this.indexdbService.clearTableInIndexedDB(tablaApi);
            
            for (const objeto of resp) 
            {

              let dataToAdd: any;

              if (tablaApi === 'ayudantes') {
                dataToAdd = {
                  nombre: objeto.nombre,
                  rut_ayudante: objeto.rut_ayudante
                };
              } else if (tablaApi === 'eventos') {
                dataToAdd = {
                  codigo: objeto.codigo,
                  descripcion: objeto.descripcion
                };
              } else if (tablaApi === 'oficinas') {
                dataToAdd = {
                  codigo: objeto.codigo,
                  nombre: objeto.nombre
                };
              } else if (tablaApi === 'turnos') {
                dataToAdd = {
                  codigo: objeto.codigo,
                  horario: objeto.horario
                };
              } else if (tablaApi === 'vehiculos') {
                dataToAdd = {
                  marca: objeto.marca,
                  patente: objeto.patente
                };
              }

              if (dataToAdd) {
                await this.db.add(tablaApi, dataToAdd);
                console.log(`Objeto agregado a la tabla ${tablaApi}:`, dataToAdd);
              } else {
                console.log(`No se pudo agregar el objeto a la tabla ${tablaApi}`);
              }
              
            }

            resolve(true);

          } else {
            //this.token = '';
            //this.storage.clear();
            resolve(false);
          }

        });

    });

  }



  actualizarUsuario( _usuario: Usuario ) {

    // const headers = new HttpHeaders({
    //   'x-token': this.token
    // });

    // return new Promise( resolve => {

    //   this.http.post(`${ URL }/user/update`, usuario, { headers })
    //     .subscribe( resp => {

    //       if ( resp['ok'] ) {
    //         this.guardarToken( resp['token'] );
    //         resolve(true);
    //       } else {
    //         resolve(false);
    //       }

    //     });

    // });

  }


}
