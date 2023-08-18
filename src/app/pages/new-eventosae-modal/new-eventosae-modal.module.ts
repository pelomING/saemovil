import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewEventosaeModalPageRoutingModule } from './new-eventosae-modal-routing.module';

import { NewEventosaeModalPage } from './new-eventosae-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewEventosaeModalPageRoutingModule
  ],
  declarations: [NewEventosaeModalPage]
})
export class NewEventosaeModalPageModule {}
