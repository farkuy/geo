import { creatableTables } from "../config/creatableTables";

class IndexBd {
  private _storeName = "geo_db";

  //Использовать только целые числа (читай доку)
  private _version = 1;

  // @ts-ignore
  db: IDBDatabase;

  async openBd(): Promise<void> {
    const openRequest = indexedDB.open(this._storeName, this._version);

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

      db.onversionchange = () => {
        db?.close();
        alert(
          "Пожалуйста, обновите страницу, для синхронизации с новой версией приложения",
        );
      };
    };

    openRequest.onerror = () => {
      alert(
        "Произошла ошибка открытя базы данных, пожалуйста напишите разработчику",
      );
      console.error("Error", openRequest.error);
    };

    openRequest.onsuccess = () => {
      this.db = openRequest.result;
    };

    openRequest.onblocked = () => {
      alert(
        "Происходит обновнеие приложения. Пожалуйста, закройте другие вкладки сайта, если они у вас открыты",
      );
    };
  }

  async get(tableName: string, key: string): Promise<IDBRequest<unknown>> {
    const transaction = this.db?.transaction(tableName, "readonly");
    const store = transaction.objectStore(tableName);

    const request = store.get(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async add<T extends { id: string }>(
    tableName: string,
    data: T,
  ): Promise<unknown> {
    const transaction = this.db.transaction(tableName, "readwrite");
    const store = transaction.objectStore(tableName);

    const request = store.add(data);
    return await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update<T extends { id: string }>(
    tableName: string,
    data: T,
  ): Promise<unknown> {
    const transaction = this.db.transaction(tableName, "readwrite");
    const store = transaction.objectStore(tableName);

    const request = store.put(data);
    return await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(tableName: string, key: string): Promise<unknown> {
    const transaction = this.db?.transaction(tableName, "readwrite");
    const store = transaction.objectStore(tableName);

    const request = store.delete(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}

export const indexBd = new IndexBd();
