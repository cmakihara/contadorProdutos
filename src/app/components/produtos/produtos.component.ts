import { Component, EventEmitter, Injectable, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { Produto } from '../../models/produto';
import { of, switchMap } from 'rxjs';

@Component({
    selector: 'app-produtos',
    templateUrl: './produtos.component.html',
    styleUrls: ['./produtos.component.scss'],
    imports: [CommonModule, IonicModule, FormsModule],
    standalone: true,
})
export class ProdutosComponent implements OnInit, OnChanges {
    @Input() public mesSelected: string = '';

    public qtd: number = 0;
    novoProduto = ''
    produtos: Produto[] = []
    id_produto: number = 0;
    salvar: boolean = true;
    handlerMessage = '';
    roleMessage = '';

    constructor(private storage: StorageService,
        private alertController: AlertController,
        private toastController: ToastController
    ) { }
    ngOnChanges(changes: SimpleChanges): void {
        this.storage.getProdutos();
        this.salvar = true;
        this.novoProduto ='';
    }

    ngOnInit() {
        try {
            this.storage.produtoState().pipe(
                switchMap(res => {
                    if (res) {
                        return this.storage.fetchProdutos();
                    } else {
                        return of([]); // Retorna um array vazio quandp res é falso
                    }
                })
            ).subscribe(data => {
                //this.produtos = data; // Atualiza a lista de produtos quando a data muda                
                this.produtos = data.filter((item) => {
                    return (item.mes.indexOf(this.mesSelected) > -1);
                })
            });
        } catch (err) {
            throw new Error(`Error: ${err}`);
        }
    }

    async criarProduto() {
        let qtd = 0;

        await this.storage.addProduto(this.novoProduto, qtd, this.mesSelected)
        this.salvarToast();
        this.novoProduto = ''

    }

    public editar(id: number, nome: string) {
        this.novoProduto = nome;
        this.salvar = false;
        this.id_produto = id;
    }

    atualizarProduto() {
        this.storage.updateProdutoById(this.id_produto, this.novoProduto)
        this.salvarToast();
        this.salvar = true;
        this.novoProduto = '';
        this.id_produto = 0;

    }

    apagarProduto(produto: Produto) {
        this.storage.deleteProdutoById(produto.id.toString())
        this.deletarToast(produto.nome);
    }

    apagarTodosProdutos(mes: string) {
        this.storage.deleteProdutoByMes(mes)
        this.deletarPorMesToast(mes);
    }

    public decrementa(id: number, quantidade: number) {
        quantidade -= 1;
        this.storage.incrementaProduto(id.toString(), quantidade);
    }

    public incrementa(id: number, quantidade: number) {
        quantidade += 1;
        this.storage.incrementaProduto(id.toString(), quantidade);
    }

    async deletarAlert(produto: Produto) {
        const alert = await this.alertController.create({
            header: 'Deseja apagar o produto?',
            buttons: [
                {
                    text: 'Cancela',
                    role: 'cancel',
                    handler: () => {
                        this.handlerMessage = 'Alert canceled';
                    },
                },
                {
                    text: 'Confirma',
                    role: 'confirm',
                    handler: () => {
                        this.handlerMessage = 'Alert confirmed';
                        this.apagarProduto(produto)
                    },
                },
            ],
        });
        await alert.present();
        const { role } = await alert.onDidDismiss();
        this.roleMessage = `Dismissed with role: ${role}`;
    }

    async deletarAllAlert(mes: string) {
        
        const alert = await this.alertController.create({
            header: 'Deseja apagar todos as produtos de '+mes+'?' ,
            buttons: [
                {
                    text: 'Cancela',
                    role: 'cancel',
                    handler: () => {
                        this.handlerMessage = 'Alert canceled';
                    },
                },
                {
                    text: 'Confirma',
                    role: 'confirm',
                    handler: () => {
                        this.handlerMessage = 'Alert confirmed';
                        this.apagarTodosProdutos(mes);
                    },
                },
            ],
        });
        await alert.present();
        const { role } = await alert.onDidDismiss();
        this.roleMessage = `Dismissed with role: ${role}`;
    }

    async salvarToast() {
        const toast = await this.toastController.create({
            message: this.novoProduto + ' Salvo!',
            duration: 1500,
            position: 'middle',
        });
        await toast.present();
    }

    async deletarToast(produto: string) {
        const toast = await this.toastController.create({
            message: produto + ' Apagado!',
            duration: 1500,
            position: 'middle',
        });
        await toast.present();
    }

    async deletarPorMesToast(mes: string) {
        const toast = await this.toastController.create({
            message: mes + ' Apagado!',
            duration: 1500,
            position: 'middle',
        });
        await toast.present();
    }

}
