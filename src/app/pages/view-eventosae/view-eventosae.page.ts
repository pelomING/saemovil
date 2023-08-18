import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';

import { IndexdbService } from '../../services/indexdb.service';
import { EventoSaeIndexdbService } from '../../services/evento-sae.indexdb.service';
import { EventoSaeModel } from '../../interfaces/eventosae.model'


@Component({
  selector: 'app-view-eventosae',
  templateUrl: './view-eventosae.page.html',
  styleUrls: ['./view-eventosae.page.scss'],
})

export class ViewEventosaePage implements OnInit {

  public eventosae!: EventoSaeModel;

  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  private indexDBService = inject(IndexdbService);
  private eventoSaeIndexdb = inject(EventoSaeIndexdbService);

  constructor() { }
  
  ngOnInit(): void {
    this.indexDBService.openDatabase()
      .then(() => this.buscarEventoforId())
      .catch((error: any) => {
        console.error('Error al inicializar la base de datos:', error);
      });
  }

  buscarEventoforId(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    console.log('Buscar : ', id);
      this.eventoSaeIndexdb.getEventoSae(parseInt(id, 10))
      .then(event => {
        this.eventosae = event;
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

}
