import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { IndexdbService } from '../../services/indexdb.service';
import { EventoSaeIndexdbService } from '../../services/evento-sae.indexdb.service';
import { EventoSaeModel } from '../../interfaces/eventosae.model'

import { NewEventosaeModalPage } from '../../pages/new-eventosae-modal/new-eventosae-modal.page';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {

  eventos_sae: EventoSaeModel[] = [];

  constructor(
    private modalController: ModalController,
    private indexDBService: IndexdbService,
    private alertController: AlertController,
    private eventoSaeIndexdb: EventoSaeIndexdbService,
  ) { }


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


  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }


  async openNewMessageForm() {
    
    const modal = await this.modalController.create({
      component: NewEventosaeModalPage, // Debes crear este componente modal
      cssClass: 'new-eventosae-modal'
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {

        console.log(result.data);
        this.eventoSaeIndexdb.guardarEventoSae(result.data);
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
