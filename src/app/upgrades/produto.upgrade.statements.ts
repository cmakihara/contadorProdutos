export class ProdutoUpgradeStatements {
  produtoUpgrades = [
      {
      toVersion: 1,
      statements: [
          `CREATE TABLE IF NOT EXISTS produtos(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          quantidade integer,
          mes text
          );`
      ]
      },
      /* add new statements below for next database version when required*/
      /*
      {
      toVersion: 2,
      statements: [
          `ALTER TABLE users ADD COLUMN email TEXT;`,
      ]
      },
      */
  ]
}
