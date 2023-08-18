import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { EventoSaeComponent } from './evento-sae.component';

@NgModule({
    imports: [ RouterLink, CommonModule, FormsModule, IonicModule ],
    declarations: [EventoSaeComponent],
    exports: [EventoSaeComponent]
  })

export class EventoSaeModule { }
