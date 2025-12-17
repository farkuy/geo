interface Row {
  name: string;
  keyPath: string | Iterable<string>;
  options?: IDBIndexParameters;
}

interface Table {
  name: string;
  options?: IDBObjectStoreParameters;
  rows: Row[];
}

export const creatableTables: Table[] = [
  {
    name: "breweries",
    options: { keyPath: "id" },
    rows: [
      { name: "name", keyPath: "name", options: { unique: false } },
      {
        name: "brewery_type",
        keyPath: "brewery_type",
        options: { unique: false },
      },
      { name: "address_1", keyPath: "address_1", options: { unique: false } },
      { name: "address_2", keyPath: "address_2", options: { unique: false } },
      { name: "address_3", keyPath: "address_3", options: { unique: false } },
      { name: "city", keyPath: "city", options: { unique: false } },
      {
        name: "state_province",
        keyPath: "state_province",
        options: { unique: false },
      },
      {
        name: "postal_code",
        keyPath: "postal_code",
        options: { unique: false },
      },
      { name: "country", keyPath: "country", options: { unique: false } },
      { name: "longitude", keyPath: "longitude", options: { unique: false } },
      { name: "latitude", keyPath: "latitude", options: { unique: false } },
      { name: "phone", keyPath: "phone", options: { unique: false } },
      {
        name: "website_url",
        keyPath: "website_url",
        options: { unique: false },
      },
      { name: "state", keyPath: "state", options: { unique: false } },
      { name: "street", keyPath: "street", options: { unique: false } },
    ],
  },
];

/*export const creatableTables: Table[] = [
  {
    name: "profile",
    options: { keyPath: "id" },
    rows: [
      {
        name: "company",
        keyPath: "company",
        options: { unique: false },
      },
      {
        name: "company",
        keyPath: "company",
        options: { unique: false },
      },
      {
        name: "company_name",
        keyPath: "company_name",
        options: { unique: false },
      },
      {
        name: "date_joined",
        keyPath: "date_joined",
        options: { unique: false },
      },
      {
        name: "email",
        keyPath: "email",
        options: { unique: false },
      },
      {
        name: "id",
        keyPath: "id",
        options: { unique: false },
      },
      {
        name: "is_admin",
        keyPath: "is_admin",
        options: { unique: false },
      },
      {
        name: "last_login",
        keyPath: "last_login",
        options: { unique: false },
      },
      {
        name: "last_name",
        keyPath: "last_name",
        options: { unique: false },
      },
      {
        name: "position",
        keyPath: "position",
        options: { unique: false },
      },
      {
        name: "position_name",
        keyPath: "position_name",
        options: { unique: false },
      },
      {
        name: "role",
        keyPath: "role",
        options: { unique: false },
      },
      {
        name: "role_id",
        keyPath: "role_id",
        options: { unique: false },
      },
      {
        name: "short_name",
        keyPath: "short_name",
        options: { unique: false },
      },
      {
        name: "username",
        keyPath: "username",
        options: { unique: false },
      },
    ],
  },
];*/
