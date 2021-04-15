import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('slidePrincipal') slides: IonSlides;

  usuario = { email: 'freiteseliesser@hotmail.com', password: '123456' };

  registroUser: Usuario = {
    email: 'test@test.com',
    password: '123456',
    nombre: 'test',
    avatar: 'av-1.png',
  };

  constructor(
    private usuarioService: UsuarioService,
    private navController: NavController,
    private uiServiceService: UiServiceService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.slides.lockSwipes(true);
  }

  async login(fLogin: NgForm) {
    if (fLogin.invalid) {
      return;
    }

    const valido = await this.usuarioService.login(
      this.usuario.email,
      this.usuario.password
    );

    if (valido) {
      this.navController.navigateRoot('/main/tabs/tab1', { animated: true });
    } else {
      this.uiServiceService.alertaInformativa(
        'Usuario / Contraseña no son correctos'
      );
    }
  }

  async registro(fRegistro) {
    if (fRegistro.invalid) {
      return;
    }

    const valido = await this.usuarioService.registro(this.registroUser);

    if (valido) {
      this.navController.navigateRoot('/main/tabs/tab1', { animated: true });
    } else {
      this.uiServiceService.alertaInformativa(
        'Ese Correo electronico ya existe'
      );
    }
  }

  mostrarRegistro() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
  }

  mostrarLogin() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
  }
}
