import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { TypeaheadComponent } from './typeahead.component';

@NgModule({
    imports: [ RouterLink, CommonModule, FormsModule, IonicModule ],
    declarations: [TypeaheadComponent],
    exports: [TypeaheadComponent]
  })

export class TypeaheadModule { }