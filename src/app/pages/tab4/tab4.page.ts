import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../services/SharedService';
import { AlertController, LoadingController } from '@ionic/angular';

import { ToastController } from '@ionic/angular';
import { IDBPDatabase } from 'idb';

import { UiServiceService } from '../../services/ui-service.service';
import { NavController } from '@ionic/angular';

import { UsuarioService } from '../../services/usuario.service';
import { IndexdbService } from '../../services/indexdb.service';

import { TurnoSaeIndexdbService } from '../../services/turno-sae.indexdb.service';

import { EventoSaeIndexdbService } from '../../services/evento-sae.indexdb.service';


import { TurnoSaeService } from '../../services/turnosae.service'
import { TurnoSaeModel } from '../../models/turno-sae.model';
import { EventoSaeModel } from '../../models/evento-sae.model';

import { Ayudante, Oficina, Vehiculo, Turno } from '../../interfaces/interfaces';
import { empty } from 'rxjs';


import { environment } from '../../../environments/environment';

const VERSION = environment.version;


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})

export class Tab4Page {


  version = VERSION;


  public listaAyudantes: Ayudante[] = [];
  public listaOficinas: Oficina[] = [];
  public listaVehiculos: Vehiculo[] = [];
  public listaTurnos: Turno[] = [];

  public eventosEnviados: EventoSaeModel[] = [];

  public kmfinal: string = '';

  public turnosae: TurnoSaeModel = new TurnoSaeModel();
  public miFormulario: FormGroup;
  public db!: IDBPDatabase;

  private turnoSaeService = inject(TurnoSaeService);

  constructor(
    private sharedService: SharedService,
    private indexdbService: IndexdbService,
    public navCtrl: NavController,
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private turnosaeIndexdbService: TurnoSaeIndexdbService,
    private eventoSaeIndexdbService: EventoSaeIndexdbService,
    private uiService: UiServiceService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastController: ToastController) {

    this.miFormulario = this.formBuilder.group({
      id: [''],
      codigo_oficina: ['', Validators.required],
      codigo_turno: ['', Validators.required],
      patente_vehiculo: ['', Validators.required],
      rut_ayudante: ['', Validators.required],
      km_inicia: ['', Validators.required],
      km_final: ['', Validators.required]
    });

  }



  async cerrarApp(): Promise<void> {
    this.confirmCerrar();
  }


  async confirmCerrar() {

    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Está seguro de que desea cerrar? Esto borrará todos los registros.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar',
          handler: async () => {


            const loading = await this.loadingCtrl.create({
              message: 'Cerrando...',
            });

            loading.present();

            try {

              console.log("Cerrar APP");
              this.usuarioService.logout();

            } catch (error) {

              this.uiService.alertaInformativa('No hay conexión con el servidor');

            } finally {
              // Cerrar el indicador de carga sin importar si se produjo un error o no
              loading.dismiss();
            }


          }
        }
      ]
    });
    await alert.present();
  }



  async actualizarBasedeDatos(): Promise<void> {

    const loading = await this.loadingCtrl.create({
      message: 'Actualizando...',
    });

    loading.present();

    try {

      console.log("ACTUALIZAR BASE DE DATOS");

      await this.usuarioService.getObjetoParaSelects('ayudantes');

      await this.usuarioService.getObjetoParaSelects('eventos');

      await this.usuarioService.getObjetoParaSelects('oficinas');

      await this.usuarioService.getObjetoParaSelects('turnos');

      await this.usuarioService.getObjetoParaSelects('vehiculos');

      await this.usuarioService.getObjetoParaSelects('comunas');

      await this.presentToast('Los datos se guardaron con éxito');

      window.location.reload(); // Recarga

    } catch (error) {

      this.uiService.alertaInformativa('No hay conexión con el servidor');

    } finally {
      // Cerrar el indicador de carga sin importar si se produjo un error o no
      loading.dismiss();
    }

  }


  async recargaApp() {

    const loading = await this.loadingCtrl.create({
      message: 'Recargando...',
    });

    loading.present();

    try {

      window.location.reload();

    } catch (error) {

      this.uiService.alertaInformativa('No hay conexión con el servidor');

    } finally {
      // Cerrar el indicador de carga sin importar si se produjo un error o no
      loading.dismiss();
    }

  }


  async enviarTodo() {
    console.log("ENVIAR TODO")
  }


  async Reconectar() {

    console.log("RECONECTAR")

    const loading = await this.loadingCtrl.create({
      message: 'Ingresando...',
    });

    loading.present();

    try {

      await this.usuarioService.cargarRut_User();

      if (this.usuarioService.rut_user) {

        console.log("Obtengo el Token");
        let loginUser = this.usuarioService.rut_user
        let loginPassword = this.usuarioService.rut_user

        const valido = await this.usuarioService.reconectar(loginUser, loginPassword);

        if (valido) {

          await this.presentToast('Reconectado con éxito');

        } else {

          this.uiService.alertaInformativa('No hay conexión con el servidor');

        }

      }


    } catch (error) {
      // Manejar el error (puede mostrar un mensaje de error)
    } finally {
      // Cerrar el indicador de carga sin importar si se produjo un error o no
      loading.dismiss();
    }

  }





  async presentToast(message: string) {

    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }



  async ObtenerEstadoEnvioEventos() {
    await this.eventoSaeIndexdbService.getEventosByEstadoEnvio(0).then((eventos) => {
      this.eventosEnviados = eventos;
      const cantidadElementos = this.eventosEnviados.length;
      console.log("Eventos No Enviados", cantidadElementos);
    })
      .catch((error) => {
        console.error('Error al obtener el turno:', error);
      });
  }



}
function ngOnInit() {
  throw new Error('Function not implemented.');
}

function presentToast(message: any, string: any) {
  throw new Error('Function not implemented.');
}

function ObtenerEstadoEnvioEventos() {
  throw new Error('Function not implemented.');
}

