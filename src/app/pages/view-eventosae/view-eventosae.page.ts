import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/SharedService';

import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { format } from 'date-fns';
import { NavController } from '@ionic/angular';
import { UiServiceService } from '../../services/ui-service.service';

import { IndexdbService } from '../../services/indexdb.service';
import { EventoSaeIndexdbService } from '../../services/evento-sae.indexdb.service';

import { EventoSaeService } from '../../services/eventosae.service'
import { EventoSaeModel } from 'src/app/models/evento-sae.model';

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
        console.log('Registro encontrado :', event);
        
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


  async enviarEventoaMongoDb() {

    console.log("Enviando Datos desde Evento");
    const valido = await this.eventoSaeService.EnviarEvento(this.eventosae);
    console.log("VALIDO", valido);

    if (valido) {

      this.uiService.alertaInformativa('Este registro ha sido enviado al servidor');

      this.sharedService.triggerUpdateCargarEventos();
      
      // navegar al tabs
      this.navCtrl.navigateBack('/main/tabs/tab2', { animated: true });

    }

    if (valido == false) {

      // mostrar alerta de usuario y contraseña no correctos
      this.uiService.alertaInformativa('No es posible conectar con el servidor intentar más tarde');

    }

  }

}
