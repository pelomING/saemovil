import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastController } from '@ionic/angular';
import { IDBPDatabase } from 'idb';

import { IndexdbService } from '../../services/indexdb.service';
import { TurnoSaeIndexdbService } from '../../services/turno-sae.indexdb.service';
import { TurnoSaeModel } from '../../models/turno-sae.model';

import { EventoSaeModel } from '../../interfaces/eventosae.model';
import { Shift } from '../../interfaces/shift.model';
import { Base } from '../../interfaces/base.model';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page {

  events: EventoSaeModel[] = [];
  ItemSelect: EventoSaeModel | undefined; // Variable de tipo EventModel

  turnosae: TurnoSaeModel = new TurnoSaeModel();
  miFormulario: FormGroup;

  public db!: IDBPDatabase;

  constructor(
    private indexdbService: IndexdbService,
    private turnosaeIndexdbService: TurnoSaeIndexdbService,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {

    this.miFormulario = this.formBuilder.group({
      id: [''],
      baseAsignada: ['', Validators.required],
      rutMaestro: ['', Validators.required],
      rutAyudante: ['', Validators.required],
      kmInicial: ['', Validators.required],
      patenteVehiculo: ['', Validators.required],
    });

  }


  ngOnInit(): void {

    this.indexdbService.openDatabase()
      .then((dbIndex) => {
        this.db = dbIndex;
        console.log("INICIO BASE DE DATOS");
        this.ObtenerRegistrodeTurno();
      })
      .catch((error: any) => {
        console.error('Error al inicializar la base de datos:', error);
      });

  }


  ObtenerRegistrodeTurno() {

    // Asumiendo que tienes el ID del turno que deseas obtener
    const turnoId = 1;

    this.turnosaeIndexdbService.getTurnosae(turnoId)
      .then((turno) => {
        if (turno) {
          this.miFormulario.patchValue({
            id: turno.id,
            baseAsignada: turno.baseAsignada,
            rutMaestro: turno.rutMaestro,
            rutAyudante: turno.rutAyudante,
            kmInicial: turno.kmInicial,
            patenteVehiculo: turno.patenteVehiculo
          });
        } else {
          console.log(`No se encontró el turno con ID ${turnoId}`);
        }
      })
      .catch((error) => {
        console.error('Error al obtener el turno:', error);
      });

  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }


  // async loadItemsFromIndexDB() {
  //   this.indexdbService.getAllEvents()
  //   .then(events => {
  //     this.events = events;
  //     console.log('Eventos obtenidos:', events);
  //   })
  //   .catch(error => {
  //     console.error('Error al obtener los eventos:', error);
  //   });
  // }


  // showSelectedItem() {
  //   if (this.ItemSelect !== null) {
  //     console.log('Selected Item:', this.ItemSelect);
  //   } else {
  //     console.log('No item selected.');
  //   }
  // }



  async guardarInicioTurno() {

    if (this.miFormulario?.valid) {

      const { id, baseAsignada, rutMaestro, rutAyudante, kmInicial, patenteVehiculo } = this.miFormulario.value;

      console.log("Id del registro creado : ", id);

      const turno: TurnoSaeModel = new TurnoSaeModel({
        baseAsignada,
        rutMaestro,
        rutAyudante,
        kmInicial,
        patenteVehiculo,
        fechaSistema: new Date(),
        estadoEnvio: 0
      });


      if (id > 0) {

        turno.id = id;

        // this.db.put('jornada-sae', turno);
        // console.log('Datos Actualizados en IndexDB:', turno);

        this.turnosaeIndexdbService.actualizarTurnosae(turno).then(() => {
          console.log('Datos Actualizados en IndexDB:', turno);
        });

      } else {

        // this.db.add('jornada-sae', turno);
        // console.log('Datos guardados en IndexDB:', turno);

        this.turnosaeIndexdbService.guardarTurnosae(turno).then(() => {
          console.log('Datos guardados en IndexDB:', turno);
        });

      }

      this.ObtenerRegistrodeTurno();

      // Llamar a la función para mostrar el mensaje emergente
      await this.presentToast('Los datos se guardaron con éxito');


    } else {

      console.log('Formulario inválido. Por favor, complete todos los campos.');

      await this.presentToast('Formulario inválido. Por favor, complete todos los campos.');

    }
  }


}
