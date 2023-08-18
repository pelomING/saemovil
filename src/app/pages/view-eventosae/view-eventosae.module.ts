import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewEventosaePageRoutingModule } from './view-eventosae-routing.module';

import { ViewEventosaePage } from './view-eventosae.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewEventosaePageRoutingModule
  ],
  declarations: [ViewEventosaePage]
})
export class ViewEventosaePageModule {}
