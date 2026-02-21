import { creatableTables } from "../config/creatableTables";

type WithIdData<T extends object> = T & { id: string };

/* TODO: 1) добавить атомарность (все или ничего для all методов, для консистентности данных)
 *       2) ПОдумать над возвращаемыми ошибками
 * */

class IndexBd {
  // Использовать только целые числа для версии бд (читай доку)
  private _storeName = "geo_db";
  private _version = 1;
  db: IDBDatabase | null = null;

  async openBd(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(this._storeName, this._version);

      openRequest.onupgradeneeded = () => {
        console.log("инициализация таблиц");
        const db = openRequest.result;
        creatableTables.forEach((tb) => {
          if (!db.objectStoreNames.contains(tb.name)) {
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
        this.db = openRequest.result;
        console.log("бд открыта");
        resolve(this.db);
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
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<R>(tableName: string): Promise<R[]> {
    const transaction = await this.openTransaction(tableName, "readonly");
    const store = transaction.objectStore(tableName);

    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
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
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addAll<D extends object>(
    tableName: string,
    data: WithIdData<D>[],
  ): Promise<IDBValidKey[]> {
    const transaction = await this.openTransaction(tableName);
    const store = transaction.objectStore(tableName);

    return await Promise.all(
      data.map(
        (item) =>
          new Promise<IDBValidKey>((resolve, reject) => {
            const request = store.add(item);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          }),
      ),
    );
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
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async putAll<D extends object>(
    tableName: string,
    data: WithIdData<D>[],
  ): Promise<PromiseSettledResult<IDBValidKey>[]> {
    const transaction = await this.openTransaction(tableName);
    const store = transaction.objectStore(tableName);

    //TODO: Если вдруг будут проблемы со старыми браузерами - добавить полифил для allSettled
    return await Promise.allSettled(
      data.map(
        (item) =>
          new Promise<IDBValidKey>((resolve, reject) => {
            const request = store.put(item);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          }),
      ),
    );
  }

  async delete(tableName: string, key: string): Promise<void> {
    const transaction = await this.openTransaction(tableName);
    const store = transaction.objectStore(tableName);

    const request = store.delete(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async ensureDbOpen(): Promise<void> {
    if (!this.db) await this.openBd();
  }

  private async openTransaction(
    tableName: string,
    mode: IDBTransactionMode = "readwrite",
    durability: IDBTransactionDurability = "strict",
  ): Promise<IDBTransaction> {
    await this.ensureDbOpen();
    return this.db!.transaction(tableName, mode, { durability });
  }
}

export const indexBd = new IndexBd();
