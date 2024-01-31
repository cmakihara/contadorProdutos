import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable} from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { DbnameVersionService } from './dbname-version.service';
import { ProdutoUpgradeStatements } from '../upgrades/produto.upgrade.statements';
import { Produto } from '../models/produto';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class StorageService {
    public produtoList: BehaviorSubject<Produto[]> =
                                new BehaviorSubject<Produto[]>([]);
    private databaseName: string = "";
    private uUpdStmts: ProdutoUpgradeStatements = new ProdutoUpgradeStatements();
    private versionUpgrades;
    private loadToVersion;
    private db!: SQLiteDBConnection;
    private isProdutoReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private sqliteService: SQLiteService,
                private dbVerService: DbnameVersionService) {
        this.versionUpgrades = this.uUpdStmts.produtoUpgrades;
        this.loadToVersion = this.versionUpgrades[this.versionUpgrades.length-1].toVersion;
    }
    async initializeDatabase(dbName: string) {
        this.databaseName = dbName;
        // criar atualização statements
        await this.sqliteService
        .addUpgradeStatement({  database: this.databaseName,
                                upgrade: this.versionUpgrades});
        // criar/abrir database
        this.db = await this.sqliteService.openDatabase(
                                            this.databaseName,
                                            false,
                                            'no-encryption',
                                            this.loadToVersion,
                                            false
        );
        this.dbVerService.set(this.databaseName,this.loadToVersion);

        await this.getProdutos();
    }
    // Atual state da database
    produtoState() {
        return this.isProdutoReady.asObservable();
    }
    fetchProdutos(): Observable<Produto[]> {
        return this.produtoList.asObservable();
    }

    async loadProdutos() {
        const produtos: Produto[]= (await this.db.query('SELECT * FROM produtos;')).values as Produto[];
        this.produtoList.next(produtos);
    }
    // CRUD 
    async getProdutos() {
        await this.loadProdutos();
        this.isProdutoReady.next(true);
    }
    async addProduto(nome: string,qtd: number, ms: string) {
        const sql = `INSERT INTO produtos (nome,quantidade,mes) VALUES (?,?,?);`;
        await this.db.run(sql,[nome,qtd,ms]);
        await this.getProdutos();
    }

    async updateProdutoById(id: number, novoNome: string) {
        const sql = `UPDATE produtos set nome = (?) WHERE id=${id}`;

        await this.db.run(sql,[novoNome]);
        await this.getProdutos();
    }

    async deleteProdutoById(id: string) {
        const sql = `DELETE FROM produtos WHERE id=(${id})`;
        await this.db.run(sql);
        await this.getProdutos();
    }

    async deleteProdutoByMes(mes: string) {
        const sql = `DELETE FROM produtos WHERE mes=(?)`;
        await this.db.run(sql,[mes]);
        await this.getProdutos();
    }

    async decrementaProduto(id: string, quantidade: number) {
        const sql = `UPDATE produtos set quantidade = ${quantidade} WHERE id=${id}`;
        await this.db.run(sql);
        await this.getProdutos();
    }

    async incrementaProduto(id: string, quantidade: number) {
        const sql = `UPDATE produtos set quantidade = ${quantidade} WHERE id=${id}`;
        await this.db.run(sql);
        await this.getProdutos();
    }

    
}
