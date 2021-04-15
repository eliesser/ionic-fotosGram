import { Component } from '@angular/core';
import { Post } from '../../interfaces/interfaces';
import { PostsService } from '../../services/posts.service';
import { NavController } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare var window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  tempImages: string[] = [];
  cargandoGeo = false;

  post: Post = {
    mensaje: '',
    coords: null,
    posicion: false,
  };

  constructor(
    private postsService: PostsService,
    private navController: NavController,
    private geolocation: Geolocation,
    private camera: Camera
  ) {}

  async crearPost() {
    const creado = await this.postsService.crearPost(this.post);
    this.post = {
      mensaje: '',
      coords: null,
      posicion: false,
    };
    this.tempImages = [];
    this.navController.navigateRoot('/main/tabs/tab1');
  }

  getGeo() {
    if (!this.post.posicion) {
      this.post.coords = null;
    }

    this.cargandoGeo = true;

    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.cargandoGeo = false;

        const coords = `${resp.coords.latitude},${resp.coords.longitude}`;

        this.post.coords = coords;
      })
      .catch((error) => {
        this.cargandoGeo = false;
      });
  }

  camara() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
    };

    this.procesarImagen(options);
  }

  libreria() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    };

    this.procesarImagen(options);
  }

  procesarImagen(options: CameraOptions) {
    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        const img = window.Ionic.WebView.convertFileSrc(imageData);

        this.postsService.subirImagen(imageData);

        this.tempImages.push(img);
      },
      (err) => {
        // Handle error
      }
    );
  }
}
