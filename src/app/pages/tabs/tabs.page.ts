import { Component } from '@angular/core';
import { SharedService } from '../../services/SharedService';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})

export class TabsPage {

  constructor(
    private sharedService: SharedService,
    private navCtrl: NavController
  ) { }

  openTab1() {
    //this.navCtrl.navigateRoot('/tabs/tab1');
  }

  openTab2() {
    //this.navCtrl.navigateRoot('/tabs/tab2');
  }

  openTab3() {
    this.sharedService.triggerUpdateList();
  }

}
