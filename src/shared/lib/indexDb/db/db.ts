import { creatableTables } from "../config/creatableTables";

type WithIdData<T extends Record<string, any>> = T & {
  id: string;
};

/* TODO: + 1) добавить атомарность (все или ничего для all методов, для консистентности данных)
 *       2) ПОдумать над возвращаемыми ошибками
 *       3) Подумать над типизацией WithIdData и ошибок
 *       4) Подмуть над передачей уникального ключа
 * */

class IndexBd {
  // Использовать только целые числа для версии бд (читай доку)
  private _storeName = "geo_db";
  private _version = 1;
  private _db: IDBDatabase | null = null;

  async openBd(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(this._storeName, this._version);

      openRequest.onupgradeneeded = () => {
        const db = openRequest.result;

        creatableTables.forEach((tb) => {
          if (!db.objectStoreNames.contains(tb.name)) {
            console.log(`инициализация таблицы ${tb.name}`);

            const table = db.createObjectStore(tb.name, tb.options);
            tb.rows.forEach((row) => {
              table.createIndex(row.name, row.keyPath, row.options);
            });
          }
        });

        db.onversionchange = () => {
          db?.close();
          alert(
            "Пожалуйста, обновите страницу, для синхронизации с новой версией приложения",
          );
        };
      };

      openRequest.onerror = () => {
        alert("Произошла ошибка открытя базы данных");
        console.error("Error", openRequest.error);
        reject(openRequest.error);
      };

      openRequest.onsuccess = () => {
        this._db = openRequest.result;
        console.log("бд открыта");
        resolve(this._db);
      };

      openRequest.onblocked = () => {
        alert(
          "Происходит обновнеие приложения. Пожалуйста, закройте другие вкладки сайта, если они у вас открыты",
        );
      };
    });
  }

  async get<R>(tableName: string, key: string): Promise<R> {
    const transaction = await this.openTransaction(tableName, "readonly");
    const store = transaction.objectStore(tableName);

    const request = store.get(key);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(request.error);
    });
  }

  async getAll<R>(tableName: string): Promise<R[]> {
    const transaction = await this.openTransaction(tableName, "readonly");
    const store = transaction.objectStore(tableName);

    const request = store.getAll();
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(request.error);
    });
  }

  async add<D extends object>(
    tableName: string,
    data: WithIdData<D>,
  ): Promise<IDBValidKey> {
    const transaction = await this.openTransaction(tableName);
    const store = transaction.objectStore(tableName);

    const request = store.add(data);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(request.error);
    });
  }

  async addAll<D extends object>(
    tableName: string,
    data: WithIdData<D>[],
  ): Promise<IDBValidKey[]> {
    const transaction = await this.openTransaction(tableName);
    const store = transaction.objectStore(tableName);

    const result: IDBValidKey[] = [];
    data.forEach((item) => {
      const request = store.add(item);
      request.onsuccess = () => result.push(request.result);
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = (eventInfo) => reject(eventInfo);
    });
  }

  async put<D extends object>(
    tableName: string,
    data: WithIdData<D>,
  ): Promise<IDBValidKey> {
    const transaction = await this.openTransaction(tableName);
    const store = transaction.objectStore(tableName);

    //В put не нужен второй аргумент, т.к в creatableTables указан keyPath (ну если он указан)
    const request = store.put(data);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(request.error);
    });
  }

  async putAll<D extends object>(
    tableName: string,
    data: WithIdData<D>[],
  ): Promise<IDBValidKey[]> {
    const transaction = await this.openTransaction(tableName);
    const store = transaction.objectStore(tableName);

    const result: IDBValidKey[] = [];
    data.forEach((item) => {
      const request = store.put(item);
      request.onsuccess = () => result.push(request.result);
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = (eventInfo) => reject(eventInfo);
    });
  }

  async delete(tableName: string, key: string): Promise<void> {
    const transaction = await this.openTransaction(tableName);
    const store = transaction.objectStore(tableName);

    const request = store.delete(key);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(request.error);
    });
  }

  private async ensureDbOpen(): Promise<void> {
    if (!this._db) await this.openBd();
  }

  private async openTransaction(
    tableName: string,
    mode: IDBTransactionMode = "readwrite",
    durability: IDBTransactionDurability = "strict",
  ): Promise<IDBTransaction> {
    await this.ensureDbOpen();
    return this._db!.transaction(tableName, mode, { durability });
  }
}

export const indexBd = new IndexBd();
