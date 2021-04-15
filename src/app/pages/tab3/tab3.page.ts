import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/interfaces/interfaces';
import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { UiServiceService } from '../../services/ui-service.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  usuario: Usuario = {};
  constructor(
    private usuarioService: UsuarioService,
    private uiServiceService: UiServiceService,
    private postsService: PostsService
  ) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
  }

  async actualizarUsuario(fActualizar: NgForm) {
    if (fActualizar.invalid) {
      return;
    }

    const actualizado = await this.usuarioService.actualizarUsuario(
      this.usuario
    );

    if (actualizado) {
      this.uiServiceService.presentToast('Usuario actualizado');
    } else {
      this.uiServiceService.presentToast('No se pudo actualizar el usuario');
    }
  }

  logout() {
    this.postsService.paginaPost = 0;
    this.usuarioService.logout();
  }
}
