import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewEventosaeModalPage } from './new-eventosae-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NewEventosaeModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewEventosaeModalPageRoutingModule {}
