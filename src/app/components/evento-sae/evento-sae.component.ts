import { ChangeDetectionStrategy, inject, Input, Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { EventoSaeModel } from 'src/app/models/evento-sae.model';
import { format } from 'date-fns';
import { SharedService } from '../../services/SharedService';


@Component({
  selector: 'app-evento-sae',
  templateUrl: './evento-sae.component.html',
  styleUrls: ['./evento-sae.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EventoSaeComponent  implements OnInit {

  private platform = inject(Platform);
  
  @Input() eventosae?: EventoSaeModel;

  isIos() {
    return this.platform.is('ios')
  }

  constructor(private sharedService: SharedService) {}

  ngOnInit() {}

  formatearFecha(fecha: Date): string {
    return format(fecha, 'dd/MM/yyyy HH:mm'); // Puedes ajustar el formato según tus necesidades
  }

  goToEnviarParametro(id:number) {
    this.sharedService.selectEventosae(id);
  }

}
