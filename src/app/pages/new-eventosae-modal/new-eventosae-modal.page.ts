import { Component, OnInit } from '@angular/core';

import { ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

import { IDBPDatabase } from 'idb';
import { IndexdbService } from '../../services/indexdb.service';
import { TurnoSaeIndexdbService } from '../../services/turno-sae.indexdb.service';
import { TurnoSaeModel } from '../../models/turno-sae.model';

import { Evento, Comuna, Item } from '../../interfaces/interfaces';

@Component({
  selector: 'app-new-eventosae-modal',
  templateUrl: './new-eventosae-modal.page.html',
  styleUrls: ['./new-eventosae-modal.page.scss'],
})


export class NewEventosaeModalPage implements OnInit {

  @ViewChild('idmodalcomuna', { static: true }) idmodalcomuna!: IonModal;
  selectedComunas: string[] = [];
  ItemsComunas: Item[] = [];

  comunasSelectionChanged(objeto : string[]) {
    const comuna = this.listaComunas.find((comuna) => comuna.codigo === objeto[0]);
    this.formularioEventoSae.get('nombre_comuna').setValue(comuna.nombre);
    this.formularioEventoSae.get('codigo_comuna').setValue(comuna.codigo);
    this.idmodalcomuna.dismiss();
  }

  public listaTipoEventos: Evento[] = [];
  public listaComunas: Comuna[] = [];
  public turnoSaeModel: TurnoSaeModel | undefined;

  public formularioEventoSae: FormGroup;
  public db!: IDBPDatabase;


  constructor(
    private indexdbService: IndexdbService,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private turnoSaeIndexdbService: TurnoSaeIndexdbService,
  ) {

    this.formularioEventoSae = this.formBuilder.group({
      id: [''],
      numero_ot: ['', Validators.required],
      despachador: ['', Validators.required],
      direccion: ['', Validators.required],
      trabajo_solicitado: ['', Validators.required],
      trabajo_realizado: ['', Validators.required],
      tipo_evento: ['', Validators.required],
      nombre_comuna: ['', Validators.required],
      codigo_comuna: ['', Validators.required],
      hora_inicio: ['', [Validators.required, Validators.pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)],],
      hora_termino: ['', [Validators.required, Validators.pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)],],
    });
    
  }


  // Getter para acceder al control del formulario
  get f() {
    return this.formularioEventoSae.controls;
  }


  ngOnInit(): void {
    this.indexdbService.openDatabase()
      .then(async (dbIndex) => {
        
        this.db = dbIndex;

        this.ObtenerRegistrodeTurno();
        
        await this.loadItemsFromIndexDB();

        this.ItemsComunas = this.listaComunas.map(comuna => ({
          text: comuna.nombre || '',
          value: comuna.codigo || ''
        }));

      })
      .catch((error: any) => {
        console.error('Error al inicializar la base de datos:', error);
      });
  }


  async loadItemsFromIndexDB() {

    const itemsEventos = await this.indexdbService.getAllFromIndex('eventos');
    this.listaTipoEventos = itemsEventos;

    const itemsComunas = await this.indexdbService.getAllFromIndex('comunas');
    this.listaComunas = itemsComunas;
    
  }


  async ObtenerRegistrodeTurno() {
    // Asumiendo que tienes el ID del turno que deseas obtener
    const turnoId = 1;
    await this.turnoSaeIndexdbService.getTurnosae(turnoId)
      .then((turno_sae) => {
        if (turno_sae) {
          this.turnoSaeModel = turno_sae;
        } else {
          console.log(`No se encontró el turno con ID ${turnoId}`);
        }
      })
      .catch((error) => {
        console.error('Error al obtener el turno:', error);
      });
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
