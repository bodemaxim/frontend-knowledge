import initSqlJs from 'sql.js'
import type ISqlJsConfig from '@/interfaces/ISqlJsConfig'

// Функция для инициализации базы данных
export default async function initDb() {
  const config: ISqlJsConfig = {
    locateFile: () => 'sql-wasm.wasm'
  }

  const SQL = await initSqlJs(config)

  let db
  try {
    const dbFile = await fetch('frontend-knowledge.db')
    const dbArray = new Uint8Array(await dbFile.arrayBuffer())
    db = new SQL.Database(dbArray)
  } catch (error) {
    console.log('error', error)
    db = new SQL.Database()
  }

  const results = db.exec('SELECT * FROM `frontend-knowledge`')

  db.close()

  return results
}
