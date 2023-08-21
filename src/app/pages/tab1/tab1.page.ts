import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastController } from '@ionic/angular';
import { IDBPDatabase } from 'idb';

import { IndexdbService } from '../../services/indexdb.service';
import { TurnoSaeIndexdbService } from '../../services/turno-sae.indexdb.service';
import { TurnoSaeModel } from '../../models/turno-sae.model';

import { Ayudante,Evento,Oficina,Vehiculo,Turno } from '../../interfaces/interfaces';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page {


  public listaEventos: Evento[] = [];


  public listaAyudantes: Ayudante[] = [];
  public listaOficinas: Oficina[] = [];
  public listaVehiculos: Vehiculo[] = [];
  public listaTurnos: Turno[] = [];
 
  // public ItemSelectAyudante: Ayudante | undefined;
  // public ItemSelectEvento: Evento | undefined;
  // public ItemSelectOficina: Oficina | undefined;
  // public ItemSelectVehiculo: Vehiculo | undefined;
  // public ItemSelectTurno: Turno | undefined;
  
  public turnosae: TurnoSaeModel = new TurnoSaeModel();
  public miFormulario: FormGroup;
  public db!: IDBPDatabase;

  constructor(
    private indexdbService: IndexdbService,
    private turnosaeIndexdbService: TurnoSaeIndexdbService,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {

    this.miFormulario = this.formBuilder.group({
      id: [''],
      codigo_oficina: ['', Validators.required],
      codigo_turno: ['', Validators.required],
      patente_vehiculo: ['', Validators.required],
      rut_ayudante: ['', Validators.required],
      km_inicia: ['', Validators.required],
    });

  }


  ngOnInit(): void {

    this.indexdbService.openDatabase()
      .then((dbIndex) => {
        this.db = dbIndex;
        console.log("INICIO BASE DE DATOS");
        this.ObtenerRegistrodeTurno();
        this.loadItemsFromIndexDB();
      })
      .catch((error: any) => {
        console.error('Error al inicializar la base de datos:', error);
      });

  }


  ObtenerRegistrodeTurno() {

    // Asumiendo que tienes el ID del turno que deseas obtener
    const turnoId = 1;

    this.turnosaeIndexdbService.getTurnosae(turnoId)
      .then((turno_sae) => {

        if (turno_sae) {
          this.miFormulario.patchValue({
            id: turno_sae.id,
            codigo_oficina: turno_sae.codigo_oficina,
            codigo_turno: turno_sae.codigo_turno,
            patente_vehiculo: turno_sae.patente_vehiculo,
            rut_ayudante: turno_sae.rut_ayudante,
            km_inicia: turno_sae.km_inicia
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


async loadItemsFromIndexDB() {
  const tableNames = ['ayudantes', 'oficinas', 'vehiculos', 'turnos'];

  for (const tableName of tableNames) {
    await this.loadItems(tableName);
  }
}

async loadItems(tableName: string) {
  try {
    
    const items = await this.indexdbService.getAllFromIndex(tableName);

    console.log("Items",items);

    this.assignItemsToList(tableName, items);
    console.log(`${tableName} obtenidos:`, items);
  } catch (error) {
    console.error(`Error al obtener ${tableName}:`, error);
  }
}

assignItemsToList(tableName: string, items: any[]) {
  switch (tableName) {
    case 'ayudantes':
      this.listaAyudantes = items;
      break;
    case 'oficinas':
      
      this.listaOficinas = items;
      console.log("cargar datos en oficina",this.listaOficinas);

      break;
    case 'vehiculos':
      this.listaVehiculos = items;
      break;
    case 'turnos':
      this.listaTurnos = items;
      break;
    // Agregar más casos según las tablas que necesites
  }
}



  // showSelectedItem() {
  //   if (this.ItemSelectAyudante !== null) {
  //     console.log('Selected Item:', this.ItemSelectAyudante);
  //   } else {
  //     console.log('No item selected.');
  //   }
  // }



  async guardarInicioTurno() {

    if (this.miFormulario?.valid) {

      const { id, codigo_oficina, codigo_turno, patente_vehiculo, rut_ayudante, km_inicia } = this.miFormulario.value;
      console.log("Id del registro creado : ", id);

      const turno_sae: TurnoSaeModel = new TurnoSaeModel({
        rut_maestro:'1',
        rut_ayudante,
        codigo_turno,
        patente_vehiculo,
        codigo_oficina,
        km_inicia,
        km_final:'1',
        fecha_hora_inicio: new Date(),
        fecha_hora_final: new Date(),
        fechaSistema: new Date(),
        estadoEnvio: 0
      });

      if (id > 0) {

        turno_sae.id = id;
        // this.db.put('jornada-sae', turno);
        // console.log('Datos Actualizados en IndexDB:', turno);
        this.turnosaeIndexdbService.actualizarTurnosae(turno_sae).then(() => {
          console.log('Datos Actualizados en IndexDB:', turno_sae);
        });

      } else {

        // this.db.add('jornada-sae', turno);
        // console.log('Datos guardados en IndexDB:', turno);
        this.turnosaeIndexdbService.guardarTurnosae(turno_sae).then(() => {
          console.log('Datos guardados en IndexDB:', turno_sae);
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
