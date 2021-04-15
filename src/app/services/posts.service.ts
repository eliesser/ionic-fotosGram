import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';

import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';

import { environment } from '../../environments/environment';

import { Post, RespuestaPosts } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  paginaPost = 0;

  nuevoPost = new EventEmitter<Post>();

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private fileTransfer: FileTransfer
  ) {}

  getPosts(pull: boolean = false) {
    if (pull) {
      this.paginaPost = 0;
    }
    this.paginaPost++;
    return this.http.get<RespuestaPosts>(
      `${URL}/post?pagina=${this.paginaPost}`
    );
  }

  crearPost(post: Post) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token,
    });

    return new Promise<boolean>((resolve) => {
      this.http.post(`${URL}/post`, post, { headers }).subscribe((resp) => {
        if (resp['ok']) {
          this.nuevoPost.emit(resp['post']);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  subirImagen(img: string) {
    const options: FileUploadOptions = {
      fileKey: 'image',
      headers: {
        'x-token': this.usuarioService.token,
      },
    };

    const fileTrasfer: FileTransferObject = this.fileTransfer.create();

    fileTrasfer
      .upload(img, `${URL}/post/upload`, options)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
