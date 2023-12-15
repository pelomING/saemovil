import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

import { IndexdbService } from '../../services/indexdb.service';
import { EventoSaeIndexdbService } from '../../services/evento-sae.indexdb.service';
import { TurnoSaeIndexdbService } from '../../services/turno-sae.indexdb.service';

import { NewEventosaeModalPage } from '../../pages/new-eventosae-modal/new-eventosae-modal.page';
import { EventoSaeModel } from '../../models/evento-sae.model';
import { TurnoSaeModel } from '../../models/turno-sae.model';

import { SharedService } from '../../services/SharedService';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page {

  eventos_sae: EventoSaeModel[] = [];
  turnoSaeModel: TurnoSaeModel = {};

  public latitude: string;
  public longitude: string;

  constructor(
    private modalController: ModalController,
    private indexDBService: IndexdbService,
    private alertController: AlertController,
    private eventoSaeIndexdb: EventoSaeIndexdbService,
    private turnoSaeIndexdbService: TurnoSaeIndexdbService,
    private navCtrl: NavController,
    private sharedService: SharedService,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {

    this.sharedService.eventosaeSelected$.subscribe(eventosaeId => {
      // Aquí decides qué hacer con la información, por ejemplo, recargar la lista
      console.log("sharedService envio id : ", eventosaeId);
      this.goToEventosaeDetail(eventosaeId);
    });

    this.sharedService.updateCargarEventos$.subscribe(() => {
      // Actualizar la lista aquí
      console.log("sharedService.updateCargarEventos");
      this.cargarEventos();
    });

  }


  ionViewWillLeave() {
    console.log("ionViewWillLeave");
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave");
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter");
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
  }


  ngOnInit(): void {
    console.log("ngOnInit tab2");
    this.indexDBService.openDatabase()
      .then(() => this.cargarEventos())
      .catch((error: any) => {
        console.error('Error al inicializar la base de datos:', error);
      });
  }


  cargarEventos(): void {
    this.eventoSaeIndexdb.getAllEventoSae()
      .then(async events => {
        if (events.length > 0) {
          this.eventos_sae = events;

          console.log('Eventos obtenidos:', events);

          // Filtrar eventos con estado de envío en 0
          const eventosEstadoCero = this.eventos_sae.filter(evento => evento.estadoEnvio === 0);

          if (eventosEstadoCero.length === 0) {
            
            this.confirmCerrar();

          }

          console.log('Eventos con estado de envío en 0:', eventosEstadoCero.length);

        } else {
          console.log('No hay eventos disponibles.');
        }
      })
      .catch(error => {
        console.error('Error al obtener los eventos:', error);
      });
  }





  async confirmCerrar() {

    const alert = await this.alertController.create({
      header: 'Aviso',
      message: 'Todos los eventos han sido enviados al servidor, ¿desea cerrar la app?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Si',
          handler: async () => {

            this.navCtrl.navigateRoot('/main/tabs/tab4', { animated: true });

          }
        }
      ]
    });
    await alert.present();
  }




  async refresh(ev: any) {
    setTimeout(() => {
      ev.detail.complete();
      this.cargarEventos();
    }, 3000);
  }


  goToEventosaeDetail(id: number) {
    this.navCtrl.navigateForward('/eventosae/' + id); // Cambia por la ruta correcta
  }


  async ObtenerRegistrodeTurno() {
    // Asumiendo que tienes el ID del turno que deseas obtener
    const turnoId = 1;
    await this.turnoSaeIndexdbService.getTurnosae(turnoId)
      .then((turno_sae) => {
        if (turno_sae) {
          this.turnoSaeModel.rut_maestro = turno_sae.rut_maestro;
          this.turnoSaeModel.rut_ayudante = turno_sae.rut_ayudante;
          this.turnoSaeModel.codigo_brigada = turno_sae.codigo_brigada;
          this.turnoSaeModel.codigo_tipoturno = turno_sae.codigo_tipoturno;
          this.turnoSaeModel.patente_vehiculo = turno_sae.patente_vehiculo;
          this.turnoSaeModel.fecha_hora_inicio = turno_sae.fecha_hora_inicio;
        } else {
          console.log(`No se encontró el turno con ID ${turnoId}`);
        }
      })
      .catch((error) => {
        console.error('Error al obtener el turno:', error);
      });
  }


  async openNewEventoSaeForm() {

    const modal = await this.modalController.create({
      component: NewEventosaeModalPage, // Debes crear este componente modal
      cssClass: 'new-eventosae-modal'
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {


        const loading = await this.loadingCtrl.create({
          message: 'Guardando...',
        });

        loading.present();

        try {

          await this.ObtenerRegistrodeTurno();

          const { numero_ot, despachador, direccion, requerimiento, tipo_evento, codigo_comuna, hora_inicio, hora_termino } = result.data;

          await this.obtenerUbicacion();

          const evento_sae: EventoSaeModel = new EventoSaeModel({
            numero_ot,
            despachador,
            tipo_evento,
            direccion,
            requerimiento,

            rut_maestro: this.turnoSaeModel.rut_maestro,
            rut_ayudante: this.turnoSaeModel.rut_ayudante,
            codigo_brigada: this.turnoSaeModel.codigo_brigada,
            codigo_tipoturno: this.turnoSaeModel.codigo_tipoturno,
            patente_vehiculo: this.turnoSaeModel.patente_vehiculo,
            fecha_hora_inicio_turno: this.turnoSaeModel.fecha_hora_inicio,

            //codigo_turno: this.turnoSaeModel.codigo_turno,
            //codigo_oficina: this.turnoSaeModel.codigo_oficina,
            codigo_comuna,
            latitude: this.latitude,
            longitude: this.longitude,
            fecha_hora_ejecucion: new Date(),
            hora_inicio,
            hora_termino,
            estadoEnvio: 0
          });

          this.eventoSaeIndexdb.guardarEventoSae(evento_sae);
          this.cargarEventos();


        } catch (error) {
          // Manejar el error (puede mostrar un mensaje de error)
        } finally {
          // Cerrar el indicador de carga sin importar si se produjo un error o no
          loading.dismiss();
        }


      }
    });

    return await modal.present();

  }


  async deleteItem(messageId: number, estadoEnvio: number): Promise<void> {

    console.log("ELIMINAR : ", messageId);

    console.log("ESTADO ENVIO : ", estadoEnvio);

    if (estadoEnvio == 1) {
      this.confirmDelete(messageId);
    }
    else {
      await this.mostrarMensaje('El evento no puede ser eliminado. ya que no ha sido enviado al servidor');

    }

  }



  mostrarMensaje(mensaje: string): void {
    this.alertController.create({
      header: 'Aviso',
      message: mensaje,
      backdropDismiss: false,
      buttons: ['OK']
    }).then(alert => alert.present());
  }



  async confirmDelete(messageId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este elemento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {

            this.eventoSaeIndexdb.deleteEventoSae(messageId);
            this.cargarEventos();

          }
        }
      ]
    });

    await alert.present();
  }



  async solicitarPermisosDeGeolocalizacion() {
    if (this.platform.is('hybrid')) {
      try {
        const status = await Geolocation.requestPermissions();
        if (status.location === 'granted') {
          // El usuario otorgó permisos, puedes usar Geolocation.getCurrentPosition aquí.
        } else {
          // El usuario no otorgó permisos, muestra un mensaje o realiza otras acciones.
        }
      } catch (error) {
        // Maneja cualquier error que pueda ocurrir al solicitar los permisos.
        console.error('Error al solicitar permisos de geolocalización:', error);
      }
    } else {
      // Maneja el caso de que la aplicación se esté ejecutando en una plataforma web.
      console.warn('La geolocalización no está disponible en la plataforma web.');
    }
  }



  async obtenerUbicacion() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitude = coordinates.coords.latitude.toString();
      this.longitude = coordinates.coords.longitude.toString();
      console.log('Ubicación obtenida:', coordinates);
      // Realiza las acciones necesarias con las coordenadas obtenidas aquí.
    } catch (error) {
      // Maneja la excepción generada cuando no se otorgan los permisos de geolocalización.
      console.error('Error al obtener la ubicación:', error);
      // Aquí puedes mostrar un mensaje al usuario o realizar otras acciones según tus necesidades.
    }
  }



}
