import { Component, OnInit } from '@angular/core';

import { ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { IDBPDatabase } from 'idb';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

import { UsuarioService } from '../../services/usuario.service';
import { IndexdbService } from '../../services/indexdb.service';
import { TurnoSaeIndexdbService } from '../../services/turno-sae.indexdb.service';
import { TurnoSaeModel } from '../../models/turno-sae.model';

import { Ayudante, Oficina, Vehiculo, Turno, TiposTurnos, SaeBrigadas, Item  } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {

  @ViewChild('idmodalpatente', { static: true }) idmodalpatente!: IonModal;
  @ViewChild('idmodalayudante', { static: true }) idmodalayudante!: IonModal;

  selectedFruitsText = '';
  selectedFruits: string[] = [];

  selectedAyudantes: string[] = [];
  selectedPatentes: string[] = [];

  ItemsAyudantes: Item[] = [];
  ItemsPatentes: Item[] = [];

  // private formatData(data: string[]) {
  //   if (data.length === 1) {
  //     const ayudante = this.listaAyudantes.find((ayudante) => ayudante.rut_ayudante === data[0]);
  //     return ayudante;
  //   }
  //   return `${data.length} items`;
  // }

  ayudanteSelectionChanged(objeto : string[]) {
    const ayudante = this.listaAyudantes.find((ayudante) => ayudante.rut_ayudante === objeto[0]);
    this.miFormulario.get('nombre_ayudante').setValue(ayudante.nombre);
    this.miFormulario.get('rut_ayudante').setValue(ayudante.rut_ayudante);
    this.idmodalayudante.dismiss();
  }

  patenteSelectionChanged(objeto : string[]) {
    const vehiculo = this.listaVehiculos.find((vehiculo) => vehiculo.patente === objeto[0]);
    this.miFormulario.get('patente_vehiculo').setValue(vehiculo.patente);
    this.idmodalpatente.dismiss();
  }
  
  public listaAyudantes: Ayudante[] = [];
  public listaOficinas: Oficina[] = [];
  public listaVehiculos: Vehiculo[] = [];
  public listaTurnos: Turno[] = [];
  public listaTiposTurnos: TiposTurnos[] = [];
  public listaSaeBrigadas: SaeBrigadas[] = [];
  
  public turnosae: TurnoSaeModel = new TurnoSaeModel();
  public miFormulario: FormGroup;
  public db!: IDBPDatabase;

  public latitude: string;
  public longitude: string;

  constructor(
    private indexdbService: IndexdbService,
    private usuarioService: UsuarioService,
    private turnosaeIndexdbService: TurnoSaeIndexdbService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {

    this.miFormulario = this.formBuilder.group({
      id: [''],
      codigo_brigada: ['', Validators.required],
      codigo_tipoturno: ['', Validators.required],
      patente_vehiculo: ['', Validators.required],
      rut_ayudante: ['',Validators.required],
      nombre_ayudante: ['',Validators.required],
      km_inicia: ['', Validators.required],
    });

  }


  ngOnInit(): void {

    this.indexdbService.openDatabase()
      .then(async (dbIndex) => {
        this.db = dbIndex;

        this.ObtenerRegistrodeTurno();
        await this.loadItemsFromIndexDB();

        this.ItemsAyudantes = this.listaAyudantes.map(ayudante => ({
          text: ayudante.nombre || '',
          value: ayudante.rut_ayudante || ''
        }));

        this.ItemsPatentes = this.listaVehiculos.map(patente => ({
          text: patente.patente || '',
          value: patente.patente || ''
        }));

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
            codigo_brigada: turno_sae.codigo_brigada,
            codigo_tipoturno: turno_sae.codigo_tipoturno,
            //codigo_oficina: turno_sae.codigo_oficina,
            //codigo_turno: turno_sae.codigo_turno,
            patente_vehiculo: turno_sae.patente_vehiculo,
            rut_ayudante: turno_sae.rut_ayudante,
            nombre_ayudante: turno_sae.nombre_ayudante,
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
    const tableNames = ['ayudantes', 'vehiculos', 'tiposturnos','saebrigadas'];

    for (const tableName of tableNames) {
      await this.loadItems(tableName);
    }
  }

  async loadItems(tableName: string) {
    try {
      const items = await this.indexdbService.getAllFromIndex(tableName);
      console.log("Items", items);
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
      case 'vehiculos':
        this.listaVehiculos = items;
        break;
      case 'tiposturnos':
        this.listaTiposTurnos = items;
        break;
      case 'saebrigadas':
        this.listaSaeBrigadas = items;
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

      const loading = await this.loadingCtrl.create({
        message: 'Guardando...',
      });

      loading.present();

      try {

        await this.obtenerUbicacion();

        //codigo_oficina, codigo_turno, 

        const { id, codigo_brigada, codigo_tipoturno,patente_vehiculo, rut_ayudante,nombre_ayudante, km_inicia } = this.miFormulario.value;

        console.log("RUT AYUDANTE : ", rut_ayudante);

        console.log("Id del registro creado : ", id);

        await this.usuarioService.cargarRut_User();
        let RUT_USER = this.usuarioService.rut_user;

        const turno_sae: TurnoSaeModel = new TurnoSaeModel({
          rut_maestro: RUT_USER,
          rut_ayudante,
          nombre_ayudante,
          codigo_brigada,
          codigo_tipoturno,
          //codigo_turno,
          //codigo_oficina,
          patente_vehiculo,
          km_inicia,
          fecha_hora_inicio: new Date(),
          fecha_hora_final: new Date(),
          fechaSistema: new Date(),
          estadoEnvio: 0,
          latitude: this.latitude,
          longitude: this.longitude
        });

        if (id > 0) {

          turno_sae.id = id;
          // this.db.put('jornada-sae', turno);
          // console.log('Datos Actualizados en IndexDB:', turno);

          let turno = this.turnosaeIndexdbService.getTurnosae(turno_sae.id);

          turno_sae.km_final = (await turno).km_final;

          this.turnosaeIndexdbService.actualizarTurnosae(turno_sae).then(() => {
            console.log('Datos Actualizados en IndexDB:', turno_sae);
          });

        } else {

          turno_sae.id = 1;
          // this.db.add('jornada-sae', turno);
          // console.log('Datos guardados en IndexDB:', turno);
          this.turnosaeIndexdbService.guardarTurnosae(turno_sae).then(() => {
            console.log('Datos guardados en IndexDB:', turno_sae);
          });

        }

        this.ObtenerRegistrodeTurno();

        // Llamar a la función para mostrar el mensaje emergente
        await this.presentToast('Los datos se guardaron con éxito');


      } catch (error) {
        // Manejar el error (puede mostrar un mensaje de error)
      } finally {
        // Cerrar el indicador de carga sin importar si se produjo un error o no
        loading.dismiss();
      }

    } else {

      console.log('Formulario inválido. Por favor, complete todos los campos.');
      await this.presentToast('Formulario inválido. Por favor, complete todos los campos.');

    }
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
