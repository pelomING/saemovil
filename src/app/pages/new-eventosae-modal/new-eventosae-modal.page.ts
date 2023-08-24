import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

import { IDBPDatabase } from 'idb';
import { IndexdbService } from '../../services/indexdb.service';
import { Evento } from '../../interfaces/interfaces';

@Component({
  selector: 'app-new-eventosae-modal',
  templateUrl: './new-eventosae-modal.page.html',
  styleUrls: ['./new-eventosae-modal.page.scss'],
})


export class NewEventosaeModalPage implements OnInit {

  public listaTipoEventos: Evento[] = [];
  public formularioEventoSae: FormGroup;
  public db!: IDBPDatabase;


  constructor(
    private indexdbService: IndexdbService,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {

    this.formularioEventoSae = this.formBuilder.group({
      id: [''],
      tipo_evento: ['', Validators.required],
      numero_ot: ['', Validators.required],
      direccion: ['', Validators.required],
      requerimiento: ['', Validators.required]
    });

  }


  ngOnInit(): void {
    this.indexdbService.openDatabase()
      .then((dbIndex) => {
        this.db = dbIndex;
        this.loadItemsFromIndexDB();
      })
      .catch((error: any) => {
        console.error('Error al inicializar la base de datos:', error);
      });
  }


  async loadItemsFromIndexDB() {
    const items = await this.indexdbService.getAllFromIndex('eventos');
    this.listaTipoEventos = items;
  }


  dismissModal() {
    this.modalController.dismiss();
  }


  async guardarEventoSae() {

    if (this.formularioEventoSae?.valid) {

      // Aquí puedes agregar la lógica para guardar el evento
      const newEvent = this.formularioEventoSae.value;
      // Puedes emitir un evento para enviar los datos al componente padre
      this.modalController.dismiss(newEvent);

    } else {

      console.log('Formulario inválido. Por favor, complete todos los campos.');
      await this.presentToast('Formulario inválido. Por favor, complete todos los campos.');

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

}
