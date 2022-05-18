import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> => {

  const defaultOptions = await getConnectionOptions();

  const banco = process.env.NODE_ENV === 'test' ? "rentx_test" : defaultOptions.database;
  console.log("--> Banco PostGres selecionado: " + banco);

  return createConnection(

    Object.assign(defaultOptions, {

      //host: (process.env.NODE_ENV) === 'test' ? "127.0.0.1" : host,

      database: (process.env.NODE_ENV) === 'test'
        ? "rentx_test" : defaultOptions.database

    })

  );

}
