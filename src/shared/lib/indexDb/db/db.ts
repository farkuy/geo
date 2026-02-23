import { creatableTables } from "../config/creatableTables";

type ReturnData<T extends object> = T;

class IndexBd {
  // Использовать только целые числа для версии бд (читай доку), в том числе при миграции
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

  /**
   * Поиск записи по первичному ключу (ID).
   * @param tableName Имя objectStore (таблицы)
   * @param id Первичный ключ записи (ID строки)
   * @returns Найденную запись или undefined. Кидает ошибку, если произошла ошибка
   */
  async getById<R>(
    tableName: string,
    id: number,
  ): Promise<R | undefined | DOMException> {
    const transaction = await this.openTransaction(tableName, "readonly");
    const store = transaction.objectStore(tableName);

    const request = store.get(id);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(request.error);
    });
  }

  /**
   * Поиск записи по индексу (не primary key).
   * @param tableName Имя objectStore (таблицы)
   * @param indexName Имя индекса, созданного в onupgradeneeded (например, 'byEmail')
   * @param key Значение для поиска в индексированном поле (например, 'user@example.com')
   * @returns Найденную запись или undefined. Кидает ошибку, если произошла ошибка
   */
  async getByIndex<R>(
    tableName: string,
    indexName: string,
    key: string,
  ): Promise<R | undefined | DOMException> {
    const transaction = await this.openTransaction(tableName, "readonly");
    const store = transaction.objectStore(tableName);
    const index = store.index(indexName);

    const request = index.get(key);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Поиск записи по индексу (не primary key).
   * @param tableName Имя objectStore (таблицы)
   * @returns Найденные записи или пустой массив. Кидает ошибку, если произошла ошибка
   */
  async getAll<R>(tableName: string): Promise<R[] | DOMException> {
    const transaction = await this.openTransaction(tableName, "readonly");
    const store = transaction.objectStore(tableName);

    const request = store.getAll();
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(request.error);
    });
  }

  /**
   * Поиск всех записей по индексу (не primary key).
   * @param tableName Имя objectStore (таблицы)
   * @param indexName Имя индекса, созданного в onupgradeneeded (например, 'byEmail')
   * @param key Значение для поиска в индексированном поле (например, 'user@example.com')
   * @returns Найденные записи или пустой массив. Кидает ошибку, если произошла ошибка
   */
  async getAllByIndex<R>(
    tableName: string,
    indexName: string,
    key: string,
  ): Promise<R[] | DOMException> {
    const transaction = await this.openTransaction(tableName, "readonly");
    const store = transaction.objectStore(tableName);
    const index = store.index(indexName);

    const request = index.getAll(IDBKeyRange.only(key));
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(request.error);
    });
  }

  /**
   * Добавляет новую запись в objectStore.
   * @param tableName Имя objectStore (таблицы)
   * @param data Объект с `id` (или auto-increment) и данными
   * @returns Сгенерированная запись. Кидает ошибку, для записи с существующим ID
   */
  async add<D extends object>(
    tableName: string,
    data: ReturnData<D>,
  ): Promise<IDBValidKey | DOMException> {
    const transaction = await this.openTransaction(tableName);
    const store = transaction.objectStore(tableName);

    const request = store.add(data);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(request.error);
    });
  }

  /**
   * Добавляет несколько новых записей в objectStore.
   * @param tableName Имя objectStore (таблицы)
   * @param data Массив объектов с `id` (или auto-increment) и данными
   * @returns Массив сгенерированных записей или ошибку. Если **хоть одна** запись имеет дублирующийся ID, то вся транзакция откатывается
   */
  async addAll<D extends object>(
    tableName: string,
    data: ReturnData<D>[],
  ): Promise<IDBValidKey[] | DOMException> {
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

  /**
   * Обвновляет запись в objectStore. Если такой записи нет, то создает ее
   * @param tableName Имя objectStore (таблицы)
   * @param data Объект с `id` (или auto-increment) и данными
   * @returns Сгенерированная запись. Кидает ошибку, если произошла ошибка при транкзации
   */
  async put<D extends object>(
    tableName: string,
    data: ReturnData<D>,
  ): Promise<IDBValidKey | DOMException> {
    const transaction = await this.openTransaction(tableName);
    const store = transaction.objectStore(tableName);

    //В put не нужен второй аргумент, т.к в creatableTables указан keyPath (ну если он указан)
    const request = store.put(data);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(request.error);
    });
  }

  /**
   * Обвновляет записи в objectStore. Если записей/записи нет, то создает ее
   * @param tableName Имя objectStore (таблицы)
   * @param data Объект с `id` (или auto-increment) и данными
   * @returns Массив обновленных записе. Кидает ошибку, если произошла ошибка при транкзации
   */
  async putAll<D extends object>(
    tableName: string,
    data: ReturnData<D>[],
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

  /**
   * Удаление по первичному ключу (ID).
   * @param tableName Имя objectStore (таблицы)
   * @param id Первичный ключ записи (ID строки)
   * @returns undefined. Кидает ошибку, если запись не найдена или произошла ошибка
   */
  async delete(
    tableName: string,
    id: number,
  ): Promise<undefined | DOMException> {
    const transaction = await this.openTransaction(tableName);
    const store = transaction.objectStore(tableName);

    const request = store.delete(id);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(request.error);
    });
  }

  /**
   * Удаляет запись с соответствующим значением индекса.
   * @param tableName Имя objectStore (таблицы)
   * @param indexName Имя индекса (например, 'byEmail')
   * @param key Значение индекса (например, 'user@example.com')
   * @returns undefined. Кидает ошибку, если запись не найдена или произошла ошибка
   */
  async deleteByIndex(
    tableName: string,
    indexName: string,
    key: string,
  ): Promise<undefined | DOMException> {
    const transaction = await this.openTransaction(tableName, "readwrite");
    const store = transaction.objectStore(tableName);
    const index = store.index(indexName);
    const request = index.get(key);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const item = request.result;
        const deleteRequest = store.delete(item.id);

        transaction.oncomplete = () => resolve(deleteRequest.result);
        transaction.onerror = () => reject(transaction.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Удаляет все записи, соответствующие значению индекса.
   * @param tableName Имя objectStore (таблицы)
   * @param indexName Имя индекса (например, 'byEmail')
   * @param key Значение индекса (например, 'user@example.com')
   * @returns Количество удалённых записей или ошибку
   */
  async deleteAllByIndex(
    tableName: string,
    indexName: string,
    key: string,
  ): Promise<number | DOMException> {
    const transaction = await this.openTransaction(tableName, "readwrite");
    const store = transaction.objectStore(tableName);
    const index = store.index(indexName);
    const request = index.getAll(IDBKeyRange.only(key));

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const items = request.result;
        if (!items.length) {
          resolve(0);
          return;
        }

        let deletedCount = 0;
        items.forEach((item) => {
          const deleteRequest = store.delete(item.id);
          deleteRequest.onsuccess = () => deletedCount++;
        });

        transaction.oncomplete = () => resolve(deletedCount);
        transaction.onerror = () => reject(transaction.error);
      };
      request.onerror = () => reject(request.error);
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
