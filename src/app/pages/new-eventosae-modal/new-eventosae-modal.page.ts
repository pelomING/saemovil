import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-new-eventosae-modal',
  templateUrl: './new-eventosae-modal.page.html',
  styleUrls: ['./new-eventosae-modal.page.scss'],
})


export class NewEventosaeModalPage implements OnInit {

  eventName: string = '';
  eventOT: string = '';
  eventDireccion: string = '';
  eventMotivo: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  saveEvent() {
    // Aquí puedes agregar la lógica para guardar el evento
    const newEvent = {
      name: this.eventName,
      ot: this.eventOT,
      direccion: this.eventDireccion,
      motivo: this.eventMotivo
    };

    // Puedes emitir un evento para enviar los datos al componente padre
    this.modalController.dismiss(newEvent);
  }

}
