import { Component, Input, OnInit, Output } from '@angular/core';
import { IonicModule, MenuController, Platform } from '@ionic/angular';
import { ProdutosComponent } from '../components/produtos/produtos.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ProdutosComponent,
    CommonModule,
    FormsModule
     
  ],
})
export class HomePage implements OnInit{

  @Output() mesSelected ='';

  mesOK='';
  show=false;
  meses =[
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]
  constructor(private menu: MenuController, private platform: Platform) {}
  ngOnInit(): void {
    this.menu.open('menu');
   
  }

  initializeApp() {
    this.platform.ready().then(() => {
        this.menu.open('menu');
    });
}
  mesSelecionado(mes: string){
    this.show = true;
    this.mesOK = mes;
    this.menu.close();
  }
}
