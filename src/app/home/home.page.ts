import { Component, Input, OnInit, Output } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
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
  constructor(private menu: MenuController) {}
  ngOnInit(): void {
    this.menu.open();
   
  }

  mesSelecionado(mes: string){
    this.show = true;
    this.mesOK = mes;
    this.menu.close();
  }
}
