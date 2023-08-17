import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { UiServiceService } from '../../services/ui-service.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/interfaces';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {

  loginUser = {
    rut: '14620209-8',
    password: '14620209-8'
  };

  constructor(private usuarioService: UsuarioService,
              private navCtrl: NavController,
              private uiService: UiServiceService) { 

                this.initialize();

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



  async login( fLogin: NgForm ) {

    if ( fLogin.invalid ) { return; }

    const valido = await this.usuarioService.login( this.loginUser.rut, this.loginUser.password );

    if ( valido ) {

      //await this.usuarioService.cargarToken();
      //const ayudantes = await this.usuarioService.getAyudantes();
      // navegar al tabs
      this.navCtrl.navigateRoot( '/main/tabs/tab1', { animated: true } );

    } else {

      // mostrar alerta de usuario y contraseña no correctos
      this.uiService.alertaInformativa('Usuario y contraseña no son correctos.');
    
    }

  }

}
