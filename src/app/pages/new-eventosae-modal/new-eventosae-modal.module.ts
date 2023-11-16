import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'

import { NewEventosaeModalPage } from './new-eventosae-modal.page';
import { NewEventosaeModalPageRoutingModule } from './new-eventosae-modal-routing.module';


import { TypeaheadModule } from '../../components/typeahead/typeahead.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewEventosaeModalPageRoutingModule,
    ReactiveFormsModule,
    TypeaheadModule
  ],
  declarations: [NewEventosaeModalPage]
})
export class NewEventosaeModalPageModule {}
