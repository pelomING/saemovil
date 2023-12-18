import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/SharedService';


import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { format } from 'date-fns';
import { NavController } from '@ionic/angular';
import { UiServiceService } from '../../services/ui-service.service';

import { IndexdbService } from '../../services/indexdb.service';
import { EventoSaeIndexdbService } from '../../services/evento-sae.indexdb.service';

import { EventoSaeService } from '../../services/eventosae.service'
import { EventoSaeModel } from 'src/app/models/evento-sae.model';


import { TurnoSaeModel } from '../../models/turno-sae.model';
import { TurnoSaeService } from '../../services/turnosae.service'
import { TurnoSaeIndexdbService } from '../../services/turno-sae.indexdb.service';

import { UsuarioService } from '../../services/usuario.service';



@Component({
  selector: 'app-view-eventosae',
  templateUrl: './view-eventosae.page.html',
  styleUrls: ['./view-eventosae.page.scss'],
})

export class ViewEventosaePage implements OnInit {

  public eventosae!: EventoSaeModel;
  public tipo_evento: string | undefined;
  public comuna: string | undefined;
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  private indexDBService = inject(IndexdbService);
  private eventoSaeIndexdb = inject(EventoSaeIndexdbService);
  private eventoSaeService = inject(EventoSaeService);


  isIos() {
    return this.platform.is('ios')
  }


  constructor(
    public navCtrl: NavController,
    private uiService: UiServiceService,
    private sharedService: SharedService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private turnosaeIndexdbService: TurnoSaeIndexdbService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,) { }


  ngOnInit(): void {

    this.indexDBService.openDatabase()

      .then(() => this.buscarEventoforId())

      .catch((error: any) => {

        console.error('Error al inicializar la base de datos:', error);

      });

  }


  buscarTipoEvento(codigo: string): void {
    this.indexDBService.getTipoEventoByCodigo(codigo)
      .then(event => {
        this.tipo_evento = event!.codigo;
      })
      .catch(error => {
        console.error('Error al obtener los eventos:', error);
      });
  }


  buscarComuna(codigo: string): void {
    this.indexDBService.getComunaByCodigo(codigo)
      .then(event => {
        this.comuna = event!.nombre;
      })
      .catch(error => {
        console.error('Error al obtener los eventos:', error);
      });
  }


  buscarEventoforId(): void {

    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    
    console.log('buscarEventoforId : ', id);

    this.eventoSaeIndexdb.getEventoSae(parseInt(id, 10))
      .then(event => {

        this.eventosae = event;
        this.buscarTipoEvento(this.eventosae.tipo_evento);
        this.buscarComuna(this.eventosae.codigo_comuna);

        console.log('Registro encontrado :', this.eventosae);

      })
      .catch(error => {
        console.error('Error al obtener los eventos:', error);
      });
  }


  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return isIos ? 'Inbox' : '';
  }


  goToPaginaPrincipal() {
    this.sharedService.triggerUpdateCargarEventos();
  }


  formatearFecha(fecha: Date): string {
    return format(fecha, 'dd/MM/yyyy HH:mm'); // Puedes ajustar el formato según tus necesidades
  }



  async Reconectar() {

    console.log("RECONECTAR")

    try {

      await this.usuarioService.cargarRut_User();

      if (this.usuarioService.rut_user) 
      {

        console.log("Obtengo el Token");
        let loginUser = this.usuarioService.rut_user
        let loginPassword = this.usuarioService.rut_user

        const valido = await this.usuarioService.reconectar(loginUser, loginPassword);

        if (valido) {
          console.log("Reconectado con exito");
        } else {
          console.log("Error al reconectar");
        }

      }


    } catch (error) {
      // Manejar el error (puede mostrar un mensaje de error)
    } finally {
      // Cerrar el indicador de carga sin importar si se produjo un error o no
    }

  }



  async enviarEventoaMongoDb() {


    const loading = await this.loadingCtrl.create({
      message: 'Enviando...',
    });

    loading.present();

    try {

      this.Reconectar();

      console.log("Enviando Datos desde Evento");
      const valido = await this.eventoSaeService.EnviarEvento(this.eventosae);
      console.log("VALIDO", valido);

      if (valido) {

        await this.enviarTurnoNoEnviado();

      }


      if (valido) {
 
        //await this.uiService.alertaInformativa('Este registro ha sido enviado al servidor');

        const alert = await this.alertController.create({
          header: 'Aviso',
          message: 'Este registro ha sido enviado al servidor',
          backdropDismiss: false,
          buttons: [
            {
              text: 'OK',
              handler: () => {

                this.sharedService.triggerUpdateCargarEventos();
                // navegar al tabs
                this.navCtrl.navigateBack('/main/tabs/tab2', { animated: true });
          
              }
            }
          ]
        });
  
        await alert.present();

      }

      if (valido == false) {

        // mostrar alerta de usuario y contraseña no correctos
        this.uiService.alertaInformativa('No es posible conectar con el servidor intentar más tarde');

      }

    } catch (error) {
      // Manejar el error (puede mostrar un mensaje de error)
      console.error('Error al enviar el evento:', error);
    } finally {
      // Cerrar el indicador de carga sin importar si se produjo un error o no
      loading.dismiss();
    }

  }


  private turnoSaeService = inject(TurnoSaeService);
  public turnosae: TurnoSaeModel = new TurnoSaeModel();

  async enviarTurnoNoEnviado() {

    try {

      let data = this.turnosae;
      let valido: boolean = false;
      let estadoEnvio: number = 0;
      let nombreAyudante: string = "";

      await this.turnosaeIndexdbService.getTurnosae(1)
        .then((turno_sae) => {

          if (turno_sae) {

            data = {
              rut_maestro: turno_sae.rut_maestro,
              rut_ayudante: turno_sae.rut_ayudante,
              patente_vehiculo: turno_sae.patente_vehiculo,
              km_inicia: turno_sae.km_inicia.toString(),
              km_final: turno_sae.km_final,
              codigo_brigada: turno_sae.codigo_brigada,
              codigo_tipoturno: turno_sae.codigo_tipoturno,
              fecha_hora_inicio: turno_sae.fecha_hora_inicio,
              fecha_hora_final: turno_sae.fecha_hora_final,
              latitude: turno_sae.latitude,
              longitude: turno_sae.longitude
            };

            console.log("DATA TURNO", data);

            valido = true;

            estadoEnvio = turno_sae.estadoEnvio;

            nombreAyudante = turno_sae.nombre_ayudante;

            console.log("VALIDO", valido);


          } else {

            console.log(`No se encontró el turno`);

          }

        })
        .catch((error) => {
          console.error('Error al obtener el turno:', error);
        });



      if (valido) {

        // SOLO si el estado de envio es cero
        if (estadoEnvio == 0) {


          this.Reconectar();

          // enviar el turno
          let result = await this.turnoSaeService.EnviarTurno(data);

          // si el envio es exitoso se actualiza el estado de envio a uno
          if (result) {

            data.id = 1;
            data.estadoEnvio = 1;
            data.nombre_ayudante = nombreAyudante;

            this.turnosaeIndexdbService.actualizarTurnosae(data).then(() => {

              console.log('Datos Actualizados en IndexDB de TURNO:', data);

              this.sharedService.triggerUpdateCargarTurno();

            });

          }

        }

      }

    } catch (error) {
      // Manejar el error (puede mostrar un mensaje de error)
      console.error('Error al enviar el turno:', error);
    } finally {
      // Cerrar el indicador de carga sin importar si se produjo un error o no
    }



  }

}
