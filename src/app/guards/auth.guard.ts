import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    try {
      await this.usuarioService.cargarToken();

      if (this.usuarioService.token) {
        console.log("Tenemos token en AuthGuard");
        return true; // Permitir la carga del módulo si hay un token
      } else {
        console.log("No tenemos token en AuthGuard");
        // Redirigir al inicio de sesión si no hay token
        //this.navCtrl.navigateRoot('/login', { animated: true });
        this.router.navigateByUrl('/login', { replaceUrl: true });

        return false;
      }
    } catch (error) {
      console.error('Error en AuthGuard:', error);
      return false;
    }
  }
}
