import { ChangeDetectionStrategy, inject, Input, Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { EventoSaeModel } from '../../interfaces/eventosae.model'

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

  constructor() { }

  ngOnInit() {}

}
