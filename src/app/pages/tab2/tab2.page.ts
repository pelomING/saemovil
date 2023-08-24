import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';


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

  constructor(
    private modalController: ModalController,
    private indexDBService: IndexdbService,
    private alertController: AlertController,
    private eventoSaeIndexdb: EventoSaeIndexdbService,
    private turnoSaeIndexdbService: TurnoSaeIndexdbService,
    private navCtrl: NavController,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {

    this.sharedService.eventosaeSelected$.subscribe(eventosaeId => {
      // Aquí decides qué hacer con la información, por ejemplo, recargar la lista

      console.log("AQUI 23443334");

      this.goToEventosaeDetail(eventosaeId);


    });

  }



  
    
  ionViewWillLeave(){

    console.log("ionViewWillLeave");

  }

  
  ionViewDidLeave(){

    console.log("ionViewDidLeave");

  }


  ionViewDidEnter() {

    console.log("ionViewDidEnter");
    setInterval(() => {
      this.cargarEventos();
    }, 5000);
  }



  ngOnInit(): void {
    this.indexDBService.openDatabase()
      .then(() => this.cargarEventos())
      .catch((error: any) => {
        console.error('Error al inicializar la base de datos:', error);
      });
  }


  cargarEventos(): void {
    this.eventoSaeIndexdb.getAllEventoSae()
      .then(events => {
        this.eventos_sae = events;
        console.log('Eventos obtenidos:', events);
      })
      .catch(error => {
        console.error('Error al obtener los eventos:', error);
      });
  }


 async refresh(ev:any) {
    setTimeout(() => {
      ev.detail.complete();
      this.cargarEventos();
    }, 3000);
  }



  ionViewWillEnter() {

    console.log("INICIO ionViewWillEnter");

    this.route.queryParams.subscribe(params => {
      if (params) {
        // Forzar la detección de cambios manualmente
        this.cdr.detectChanges();
      }
    });

    console.log("$$$$$$$$$$$$$$$$$$$$$$$");

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
          this.turnoSaeModel.codigo_turno = turno_sae.codigo_turno;
          this.turnoSaeModel.codigo_oficina = turno_sae.codigo_oficina;
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

        await this.ObtenerRegistrodeTurno();

        const { numero_ot, direccion, requerimiento, tipo_evento } = result.data;

        const evento_sae: EventoSaeModel = new EventoSaeModel({
          numero_ot,
          tipo_evento,
          direccion,
          requerimiento,
          rut_maestro: this.turnoSaeModel.rut_maestro,
          rut_ayudante: this.turnoSaeModel.rut_ayudante,
          codigo_turno: this.turnoSaeModel.codigo_turno,
          codigo_oficina: this.turnoSaeModel.codigo_oficina,
          fecha_hora_ejecucion: new Date(),
          estadoEnvio: 0
        });

        this.eventoSaeIndexdb.guardarEventoSae(evento_sae);
        this.cargarEventos();

      }
    });

    return await modal.present();

  }


  deleteItem(messageId: number): void {
    console.log("ELIMINAR : ", messageId);
    this.confirmDelete(messageId);
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


}
