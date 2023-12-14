import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../services/SharedService';
import { LoadingController } from '@ionic/angular';

import { ToastController } from '@ionic/angular';
import { IDBPDatabase } from 'idb';

import { UiServiceService } from '../../services/ui-service.service';
import { NavController } from '@ionic/angular';

import { UsuarioService } from '../../services/usuario.service';
import { IndexdbService } from '../../services/indexdb.service';

import { TurnoSaeIndexdbService } from '../../services/turno-sae.indexdb.service';

import { EventoSaeIndexdbService } from '../../services/evento-sae.indexdb.service';


import { TurnoSaeService } from '../../services/turnosae.service'
import { TurnoSaeModel } from '../../models/turno-sae.model';
import { EventoSaeModel } from '../../models/evento-sae.model';

import { Ayudante, Oficina, Vehiculo, Turno, TiposTurnos, SaeBrigadas } from '../../interfaces/interfaces';
import { empty } from 'rxjs';

import { format, toDate } from 'date-fns-tz';


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
  public listaTiposTurnos: TiposTurnos[] = [];
  public listaSaeBrigadas: SaeBrigadas[] = [];

  public eventosEnviados: EventoSaeModel[] = [];

  public kmfinal: string = '';

  public turnosae: TurnoSaeModel = new TurnoSaeModel();
  public miFormulario: FormGroup;
  public db!: IDBPDatabase;

  private turnoSaeService = inject(TurnoSaeService);

  constructor(
    private sharedService: SharedService,
    private indexdbService: IndexdbService,
    public navCtrl: NavController,
    private usuarioService: UsuarioService,
    private turnosaeIndexdbService: TurnoSaeIndexdbService,
    private eventoSaeIndexdbService: EventoSaeIndexdbService,
    private uiService: UiServiceService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastController: ToastController) {

    this.miFormulario = this.formBuilder.group({
      id: [''],
      codigo_brigada: ['', Validators.required],
      codigo_tipoturno: ['', Validators.required],
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
        this.ObtenerEstadoEnvioEventos();

      })
      .catch((error: any) => {
        console.error('Error al inicializar la base de datos:', error);
      });


    this.sharedService.updateList$.subscribe(() => {
      // Actualizar la lista aquí
      console.log("sharedService.updateList");
      this.ObtenerRegistrodeTurno();
    });

  }


  ionViewWillLeave() {
    console.log("ionViewWillLeave");
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave");
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter 1");
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    
    this.indexdbService.openDatabase()
    .then((dbIndex) => {

      this.db = dbIndex;
      console.log("Cargar turno sae");
      this.loadItemsFromIndexDB();
      this.ObtenerRegistrodeTurno();
      this.ObtenerEstadoEnvioEventos();

    })
    .catch((error: any) => {
      console.error('Error al inicializar la base de datos:', error);
    });

  }



  async ObtenerEstadoEnvioEventos() {
    await this.eventoSaeIndexdbService.getEventosByEstadoEnvio(0).then((eventos) => {
      this.eventosEnviados = eventos;
      const cantidadElementos = this.eventosEnviados.length;
      console.log("Eventos No Enviados", cantidadElementos);
    })
      .catch((error) => {
        console.error('Error al obtener el turno:', error);
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
            codigo_brigada: turno_sae.codigo_brigada,
            codigo_tipoturno: turno_sae.codigo_tipoturno,
            patente_vehiculo: turno_sae.patente_vehiculo,
            rut_ayudante: turno_sae.rut_ayudante,
            km_inicia: turno_sae.km_inicia,
            km_final: ""
          });

          if(turno_sae.km_final)
          {
            this.kmfinal = turno_sae.km_final!.toString();
          }

        } else {
          console.log(`No se encontró el turno con ID ${turnoId}`);
        }

      })
      .catch((error) => {
        console.error('Error al obtener el turno:', error);
      });

      // Los controles también pueden habilitarse/deshabilitarse después de la creación:
      this.miFormulario.get('codigo_brigada')?.disable();
      this.miFormulario.get('codigo_tipoturno')?.disable();
      this.miFormulario.get('patente_vehiculo')?.disable();
      this.miFormulario.get('rut_ayudante')?.disable();
      this.miFormulario.get('km_inicia')?.disable();

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



  formatearFecha(fecha: Date): string {
    return format(fecha, 'dd/MM/yyyy HH:mm:ss'); // Puedes ajustar el formato según tus necesidades
  }


  async guardarFinTurno() {


        // Utiliza las funciones según sea necesario
        const date = toDate(new Date());
        const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/New_York' });
        console.log("FORMATIADA DATE", formattedDate);
    
        console.log("DATE ", new Date());

    if (this.miFormulario?.valid) {

      const { id, km_final } = this.miFormulario.value;

      console.log("Id del registro creado : ", id);

      const loading = await this.loadingCtrl.create({
        message: 'Guardando...',
      });

      loading.present();

      try {

        let turnosae = await this.turnosaeIndexdbService.getTurnosae(id);

        console.log("Turno", turnosae);

        turnosae!.km_final = km_final;
        turnosae!.fecha_hora_final = this.formatearFecha(new Date());

        if (turnosae) {

          console.log('Datos Actualizados en IndexDB:', turnosae);

          this.turnosaeIndexdbService.actualizarTurnosae(turnosae).then(() => {
            console.log('Datos Actualizados en IndexDB:', turnosae);
          });

        }

        this.ObtenerRegistrodeTurno();
        // Llamar a la función para mostrar el mensaje emergente
        await this.presentToast('Los datos fueron actualizados');


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



  async enviarTurnoaMongoDb() {

    let data = this.turnosae;

    if (this.miFormulario?.valid) {

      const { id } = this.miFormulario.value;

      console.log("Id del registro creado turno : ", id);

      const loading = await this.loadingCtrl.create({
        message: 'Enviando...',
      });

      loading.present();

      try {

        await this.turnosaeIndexdbService.getTurnosae(id)
          .then((turno_sae) => {

            if (turno_sae) {

              data = {
                rut_maestro: turno_sae.rut_maestro,
                rut_ayudante: turno_sae.rut_ayudante,
                patente_vehiculo: turno_sae.patente_vehiculo,
                km_inicia: turno_sae.km_inicia!.toString(),
                km_final: turno_sae.km_final!.toString(),
                codigo_brigada: turno_sae.codigo_brigada,
                codigo_tipoturno: turno_sae.codigo_tipoturno,
                fecha_hora_inicio: turno_sae.fecha_hora_inicio,
                fecha_hora_final: turno_sae.fecha_hora_final,
                latitude: turno_sae.latitude,
                longitude: turno_sae.longitude
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


      } catch (error) {
        // Manejar el error (puede mostrar un mensaje de error)
      } finally {
        // Cerrar el indicador de carga sin importar si se produjo un error o no
        loading.dismiss();
      }

    } else {

      console.log('Formulario inválido. Por favor, complete todos los campos.');
      await this.presentToast('Formulario inválido.');

    }

  }

}
