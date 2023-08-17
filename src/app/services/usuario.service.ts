import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//import { Storage } from '@ionic/storage';

import { Storage } from '@ionic/storage-angular';

import { environment } from '../../environments/environment';
import { Usuario } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

 token: string = '';
 private usuario: Usuario = {};

  constructor( private http: HttpClient,
               private storage: Storage,
               private navCtrl: NavController ) { 

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


  getUsuario() {

    if ( !this.usuario._id ) {
      //this.validaToken();
    }

    return { ...this.usuario };

  }


  async guardarToken( token: string ) {
    this.token = token;
    await this.storage.set('token', token);
    //await this.validaToken();
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



  async getAyudantes(): Promise<boolean> {

    await this.cargarToken();

    if ( !this.token ) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>( resolve => {

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });


      //https://backend-saemovil-production.up.railway.app/ayudantes/find-all


      this.http.get(`${ URL }/ayudantes/find-all`, { observe: 'response',headers }).subscribe( 
        async (response: any) => {

          console.log("listado ayudantes");

          console.log('Tipo de respuesta:', typeof response.body);
          console.log('Contenido de la respuesta:', response.body);
          const resp = response.body;

          if ( response ) {
            //await this.guardarToken( resp.token );
            resolve(true);
          } else {
            //this.token = '';
            //this.storage.clear();
            resolve(false);
          }

        });

    });

  }



  actualizarUsuario( usuario: Usuario ) {

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
