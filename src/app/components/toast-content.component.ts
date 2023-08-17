import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-toast-content',
  template: `<ion-icon name="checkmark-circle" class="my-icon"></ion-icon> {{ message }}`,
})
export class ToastContentComponent {
  @Input() message?: string;
}
