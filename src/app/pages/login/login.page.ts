import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { UiServiceService } from '../../services/ui-service.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/interfaces';

import { environment } from '../../../environments/environment';

const VERSION = environment.version;


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  loginUser = {
    rut: '',
    password: ''
  };


  version = VERSION;
  

  constructor(
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private uiService: UiServiceService,
    private loadingCtrl: LoadingController) {

    this.initialize();

  }


  ionViewWillLeave() {
    console.log("ionViewWillLeave");
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave");
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter");
    this.initialize();
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
  }

  async initialize() {

    console.log("Inicio login");
    await this.usuarioService.cargarToken();

    if (this.usuarioService.token) {
      console.log("Obtengo el Token");
      this.navCtrl.navigateRoot('/main/tabs/tab1');
    }
  }


  showPassword = false;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  async login(fLogin: NgForm) {

    if (fLogin.invalid) { return; }


    const loading = await this.loadingCtrl.create({
      message: 'Ingresando...',
    });

    loading.present();

    try {

      const valido = await this.usuarioService.login(this.loginUser.rut, this.loginUser.password);

      if (valido) {

        //await this.usuarioService.cargarToken();
        //const ayudantes = await this.usuarioService.getAyudantes();
        // navegar al tabs
        this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });

      } else {

        // mostrar alerta de usuario y contraseña no correctos
        this.uiService.alertaInformativa('Usuario y contraseña no son correctos. o no es posible conectar con el servidor');

      }

    } catch (error) {
      // Manejar el error (puede mostrar un mensaje de error)
    } finally {
      // Cerrar el indicador de carga sin importar si se produjo un error o no
      loading.dismiss();
    }

  }

}
