import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastController } from '@ionic/angular';
import { IDBPDatabase } from 'idb';

import { UiServiceService } from '../../services/ui-service.service';
import { NavController } from '@ionic/angular';

import { UsuarioService } from '../../services/usuario.service';
import { IndexdbService } from '../../services/indexdb.service';
import { TurnoSaeIndexdbService } from '../../services/turno-sae.indexdb.service';

import { TurnoSaeService } from '../../services/turnosae.service'
import { TurnoSaeModel } from '../../models/turno-sae.model';

import { Ayudante, Oficina, Vehiculo, Turno } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

  public listaAyudantes: Ayudante[] = [];
  public listaOficinas: Oficina[] = [];
  public listaVehiculos: Vehiculo[] = [];
  public listaTurnos: Turno[] = [];

  public turnosae: TurnoSaeModel = new TurnoSaeModel();
  public miFormulario: FormGroup;
  public db!: IDBPDatabase;

  private turnoSaeService = inject(TurnoSaeService);

  constructor(private indexdbService: IndexdbService,
    public navCtrl: NavController,
    private usuarioService: UsuarioService,
    private turnosaeIndexdbService: TurnoSaeIndexdbService,
    private uiService: UiServiceService,
    private formBuilder: FormBuilder,
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

  ngOnInit(): void {

    this.indexdbService.openDatabase()
      .then((dbIndex) => {
        this.db = dbIndex;
        console.log("Cargar turno sae");

        this.loadItemsFromIndexDB();

        this.ObtenerRegistrodeTurno();

      })
      .catch((error: any) => {
        console.error('Error al inicializar la base de datos:', error);
      });

  }


  async ObtenerRegistrodeTurno() {

    // Asumiendo que tienes el ID del turno que deseas obtener
    const turnoId = 1;

    await this.turnosaeIndexdbService.getTurnosae(turnoId)
      .then((turno_sae) => {

        if (turno_sae) {
          this.miFormulario.patchValue({
            id: turno_sae.id,
            codigo_oficina: turno_sae.codigo_oficina,
            codigo_turno: turno_sae.codigo_turno,
            patente_vehiculo: turno_sae.patente_vehiculo,
            rut_ayudante: turno_sae.rut_ayudante,
            km_inicia: turno_sae.km_inicia,
            km_final: turno_sae.km_final
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


  async guardarFinTurno() {

    if (this.miFormulario?.valid) {

      const { id, km_final } = this.miFormulario.value;

      console.log("Id del registro creado : ", id);

      let turnosae = await this.turnosaeIndexdbService.getTurnosae(id);

      console.log("Turno", turnosae);

      turnosae!.km_final = km_final;
      turnosae!.fecha_hora_final = new Date();

      if (turnosae) {

        console.log('Datos Actualizados en IndexDB:', turnosae);

        this.turnosaeIndexdbService.actualizarTurnosae(turnosae).then(() => {
          console.log('Datos Actualizados en IndexDB:', turnosae);
        });

      }

      this.ObtenerRegistrodeTurno();
      // Llamar a la función para mostrar el mensaje emergente
      await this.presentToast('Los datos fueron actualizados');

    } else {

      console.log('Formulario inválido. Por favor, complete todos los campos.');
      await this.presentToast('Formulario inválido. Por favor, complete todos los campos.');

    }
  }



  async enviarTurnoaMongoDb() {

    let data = this.turnosae;

    if (this.miFormulario?.valid) {

      const { id } = this.miFormulario.value;

      console.log("Id del registro creado turno : ", id);

      await this.turnosaeIndexdbService.getTurnosae(id)
        .then((turno_sae) => {

          if (turno_sae) {

            data = {
              rut_maestro: turno_sae.rut_maestro,
              codigo_turno: turno_sae.codigo_turno,
              rut_ayudante: turno_sae.rut_ayudante,
              patente_vehiculo: turno_sae.patente_vehiculo,
              km_inicia: turno_sae.km_inicia!.toString(),
              km_final: turno_sae.km_final!.toString(),
              codigo_oficina: turno_sae.codigo_oficina,
              fecha_hora_inicio: turno_sae.fecha_hora_inicio,
              fecha_hora_final: turno_sae.fecha_hora_final
            };

          } else {
            console.log(`No se encontró el turno con ID ${id}`);
          }

        })
        .catch((error) => {
          console.error('Error al obtener el turno:', error);
        });

      console.log("DATA", data);
      console.log("Enviando Datos desde Turno");

      const valido = await this.turnoSaeService.EnviarTurno(data);

      console.log("VALIDO", valido);

      if (valido) {
        
        this.uiService.alertaInformativa('Este registro ha sido enviado al servidor');
        this.usuarioService.logout();

      }

      if (valido == false) {
        // mostrar alerta de usuario y contraseña no correctos
        this.uiService.alertaInformativa('No es posible conectar con el servidor intentar más tarde');
      }

    } else {

      console.log('Formulario inválido. Por favor, complete todos los campos.');
      await this.presentToast('Formulario inválido.');

    }

  }

}
