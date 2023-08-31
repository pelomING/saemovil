import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { UiServiceService } from '../services/ui-service.service';
import { TurnoSaeIndexdbService } from '../services/turno-sae.indexdb.service';

@Injectable({
    providedIn: 'root'
})

@Injectable()
export class Tab2Guard implements CanLoad {

    constructor(
        private navCtrl: NavController,
        private uiService: UiServiceService,
        private turnosaeIndexdbService: TurnoSaeIndexdbService,
    ) { }

    async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
        try {

            console.log("consulto desde guard Turno");
            let turno_sae = await this.turnosaeIndexdbService.getTurnosae(1)

            

            if (turno_sae) {
                console.log("enviar a tab desde guard");
                return true; // Permite la carga Tab
            } else {
                this.uiService.alertaInformativa('Es necesario iniciar el turno para agregar eventos');
                this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
                return false; // Evita la carga de Tab2Page
            }

        } catch (error) {

            console.error('Error en Tab2Guard:', error);
            return false;

        }
    }
}
