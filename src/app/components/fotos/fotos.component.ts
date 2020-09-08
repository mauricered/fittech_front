import { Component, OnInit } from '@angular/core';
import { ApiFitechService } from 'src/app/services/api-fitech.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.scss'],
})
export class FotosComponent implements OnInit {
  form: FormGroup;  
  perfil:any;
  frente:any;
  espalda:any;
  
  constructor(private service: ApiFitechService, private utilities: MensajesService,
              private usuarioService: UsuarioService,
              private apiService:ApiFitechService,
              private fb: FormBuilder,
              private camera: Camera, 
              private alertCtrl: AlertController,
              public loadingController: LoadingController,) {

    this.form = this.fb.group({
      weight:[null],
      stature:[null],
      min_waist:[null],
      max_waist:[null],
      hip:[null],
      neck:[null],
      right_thigh:[null],
      left_thigh:[null],
      right_arm:[null],
      left_arm:[null],
      right_arm_flexed:[null],
      left_arm_flexed:[null],
      right_calf:[null],
      left_calf:[null],
      torax:[null],
      waist_hip:[null],
      profile_photo:[null],
      front_photo:[null],
      back_photo:[null],
    });
     
  }
  
  ngOnInit() {
    this.getData()
  }

  async getData(){
    this.presentLoading()
    const valor:any = await this.service.obtenerUsuario()
    console.log(valor)
    this.loadingController.dismiss()
      if(valor == false){
      this.utilities.notificacionUsuario('Disculpe, Ha ocurrido un error', 'danger')
      }else{
        console.log(valor['measurement_record'])
         this.perfil =  valor.measurement_record === null ? null  : 'http://fittech247.com/fittech/fotos/grasa/' + valor['measurement_record'].profile_photo
         this.espalda = valor.measurement_record === null ? null  :'http://fittech247.com/fittech/fotos/grasa/' + valor['measurement_record'].back_photo
         this.frente =  valor.measurement_record === null ? null  :'http://fittech247.com/fittech/fotos/grasa/' + valor['measurement_record'].front_photo
          
         this.form.controls.stature.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].stature)
         this.form.controls.weight.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].weight)
         this.form.controls.min_waist.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].min_waist)
         this.form.controls.max_waist.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].max_waist)
         this.form.controls.hip.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].hip)
         this.form.controls.neck.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].neck)
         this.form.controls.right_thigh.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].right_thigh)
         this.form.controls.left_thigh.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].left_thigh)
         this.form.controls.right_arm.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].right_arm)
         this.form.controls.left_arm.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].left_arm)
         this.form.controls.right_arm_flexed.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].right_arm_flexed)
         this.form.controls.left_arm_flexed.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].left_arm_flexed)
         this.form.controls.right_calf.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].right_calf)
         this.form.controls.left_calf.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].left_calf)
         this.form.controls.torax.setValue(valor.measurement_record === null ? null  : valor['measurement_record'].torax)
         this.form.controls.profile_photo.setValue(this.perfil)
         this.form.controls.front_photo.setValue(this.frente)
         this.form.controls.back_photo.setValue(this.espalda)
      }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
      cssClass: 'my-loading',
    });
    await loading.present();
  }

  async update(){

    this.presentLoading()
    const data = await this.usuarioService.measurement_record(this.form.value)
    this.loadingController.dismiss()
    console.log(data)
    if(data){
      this.utilities.notificacionUsuario('Fotos actualizado' , "dark")
    }else{
      this.utilities.notificacionUsuario('Disculpe, Ha ocurrido un error', 'danger')
    }

  }


  async captureImage(index) {
    let st = this.camera.PictureSourceType.CAMERA;
    await this.seleccionarFuente().then((result: boolean) => {
      if (result) {
        st = this.camera.PictureSourceType.CAMERA;
      } else {
        st = this.camera.PictureSourceType.PHOTOLIBRARY;
      }
    });

    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: st,
      allowEdit: true,
    }

    this.camera.getPicture(options).then((imageData) => {

      if(index == 1){//frente
        this.frente = null
        this.frente = 'data:image/jpeg;base64,' + imageData;
        // 'data:image/jpeg;base64'
        this.form.controls.front_photo.setValue(imageData)
        console.log("imagen" , imageData)
        console.log("image frente",this.form.controls.front_photo.value)

      }
      if(index == 2){//perfil
        this.perfil = null;
        this.perfil = 'data:image/jpeg;base64,' + imageData;
        this.form.controls.profile_photo.setValue(imageData)
        console.log("imagen" , imageData)
        console.log("image perfil",this.form.controls.profile_photo.value)
      }

      if(index == 3){//espalda
        this.espalda = null;
        this.espalda = 'data:image/jpeg;base64,' + imageData;
        this.form.controls.back_photo.setValue(imageData)
        console.log("imagen" , imageData)
        console.log("image espalda",this.form.controls.back_photo.value)
      }
      // this.form.controls['fotoPerfil'].setValue(imageData);
     }, (err) => {
      // Handle error
      console.log("cameraE", err);
     });
  }

  seleccionarFuente() {
    return new Promise(async resolve => {

      const alert = await this.alertCtrl.create({
        header: 'Seleccionar Imágen',
        cssClass: 'uploadmessage',
        message: '¿Qué desea hacer?',
        buttons: [
          {
            text: "Tomar Foto",
            cssClass: 'btn_alert',
            handler: () => {
              resolve(true);
            }
          },
          {
            text: "Buscar en Galería",
            cssClass: 'btn_alert',
            handler: () => {
              resolve(false);
            }
          }
        ]
      });

      await alert.present();
    });
  }

}