import { creatableTables } from "../config/creatableTables";

export class IndexBd {
  private _storeName = "geo_db";
  private _version = 1;

  db: IDBDatabase;

  get version() {
    return this._version;
  }

  async openBd(): Promise<void> {
    let openRequest = indexedDB.open(this._storeName, this._version);

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      creatableTables.forEach((tb) => {
        if (!db.objectStoreNames.contains(tb.name)) {
          const table = db.createObjectStore(tb.name, tb.options);
          tb.rows.forEach((row) => {
            table.createIndex(row.name, row.keyPath, row.options);
          });
        }
      });
    };

    //TODO: Добавить алерт для предупреждения о неработающей бд
    openRequest.onerror = () => {
      console.error("Error", openRequest.error);
    };

    openRequest.onsuccess = () => {
      this.db = openRequest.result;
    };
  }

  async get(
    storeName: string,
    key: string,
    mode: IDBTransactionMode = "readonly",
  ): Promise<IDBRequest<any>> {
    const transaction = this.db?.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async add(storeName: string, data: any): Promise<void> {
    const transaction = this.db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const isHaveRow = await new Promise((resolve, reject) => {
      const getRequest = store.get(data.id);
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    });

    if (isHaveRow) {
      store.put(data);
    } else {
      store.add(data);
    }
  }
}

export const indexBd = new IndexBd();
