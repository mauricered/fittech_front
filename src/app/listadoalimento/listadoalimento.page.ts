import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NutricionService } from '../services/nutricion.service';
import { MensajesService } from '../services/mensajes.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-listadoalimento',
  templateUrl: './listadoalimento.page.html',
  styleUrls: ['./listadoalimento.page.scss'],
})
export class ListadoalimentoPage implements OnInit {
  dataRecibida:any
  alimentos:any
  datosUsuario:any = [];
  foods: string;

  constructor(private capturar:ActivatedRoute,
    private service: NutricionService,
    private utilities: MensajesService,
    private navCtrl: NavController) { }

ngOnInit() {
//  parametros del id
this.dataRecibida = this.capturar.snapshot.paramMap.get('id');
switch (this.dataRecibida) {
  case 'Desayuno':
  this.getFoods(0)
  this.foods = './assets/img/desayuno-grande.jpg'
  break
  case 'Almuerzo':
  this.getFoods(2)
  this.foods = './assets/img/almuerzo-grande.jpg'
  break
  case  'Snack':
  this.getFoods(1)
  this.foods = './assets/img/snack-grande.jpg'
  break
  default:
  this.getFoods(3)
  this.foods = './assets/img/cena-grande.jpg'
  break
  }
}
async getFoods(comida:any){
  const data = await this.service.ListadoComida(comida)
      if(data == false){
        this.utilities.notificacionUsuario('Disculpe, Ha ocurrido un error', 'danger')
      }else{
        this.alimentos = data['food']
        console.log(this.alimentos)
      }
}

  ucFirst(str) {
  /*   str = str.replace(/ /g, "."); */
  return str.substring(0, 1).toUpperCase() + str.substring(1); 
  }


}
