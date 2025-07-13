import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { booleanToNumber } from './helpers';
import { Condition } from '../types/variables';

class DatabaseFunctions {
  private table: string;
  private db: SQLiteDatabase;

  constructor(table: string, db: SQLiteDatabase) {
    this.table = table;
    this.db = db;
  }

  async insert(record: Record<string, any>, isTimestamp = true) {
    try {
      const createdAt = isTimestamp ? new Date().toISOString() : undefined;
      const updatedAt = isTimestamp ? createdAt : undefined;

      const valuesObj = { ...record };

      if (isTimestamp) {
        valuesObj.createdAt = createdAt;
        valuesObj.updatedAt = updatedAt;
      }

      const fields = Object.keys(valuesObj).filter(key => key !== "id");
      const placeholders = fields.map(() => '?').join(', ');
      const values = fields.map((key) => {
        const val = valuesObj[key];
        if (typeof val === 'boolean') return booleanToNumber(val);
        return val;
      });


      await this.db.executeSql(
        `INSERT INTO ${this.table} (${fields.join(', ')}) VALUES (${placeholders})`,
        values
      );
    } catch (error) {
      console.error(`[INSERT][${this.table}] Error:`, error);
      throw error;
    }
  }

  async findAll<T>(conditions: Condition[] = [], orderBy?: string): Promise<T[]> {
    try {
      let query = `SELECT * FROM ${this.table}`;
      const values: any[] = [];

      if (conditions.length) {
        const whereClauses = conditions.map(
          (cond) => `${cond.field} ${cond.operator ?? '='} ?`
        );
        query += ' WHERE ' + whereClauses.join(' AND ');
        values.push(...conditions.map((c) => c.value));
      }

      if (orderBy) {
        query += ` ORDER BY ${orderBy}`;
      }

      const [results] = await this.db.executeSql(query, values);
      const data: T[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        data.push(results.rows.item(i));
      }

      return data;
    } catch (error) {
      console.error(`[FIND_ALL][${this.table}] Error:`, error);
      throw error;
    }
  }

  async findOne<T>(conditions: Condition[]): Promise<T | null> {
    try {
      const results = await this.findAll<T>(conditions);
      return results[0] ?? null;
    } catch (error) {
      console.error(`[FIND_ONE][${this.table}] Error:`, error);
      throw error;
    }
  }

  async findByPk<T>(id: number): Promise<T | null> {
    return this.findOne<T>([{ field: 'id', value: id }]);
  }

  async deleteById(id: number) {
    try {
      await this.db.executeSql(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    } catch (error) {
      console.error(`[DELETE_BY_ID][${this.table}] Error:`, error);
      throw error;
    }
  }

  async delete(conditions: Condition[]) {
    try {
      if (!conditions.length) return;

      const where = conditions.map(
        (cond) => `${cond.field} ${cond.operator ?? '='} ?`
      ).join(' AND ');

      const values = conditions.map((c) => c.value);

      await this.db.executeSql(`DELETE FROM ${this.table} WHERE ${where}`, values);
    } catch (error) {
      console.error(`[DELETE][${this.table}] Error:`, error);
      throw error;
    }
  }

  async update(id: number, updates: Partial<any>) {
    try {
      const updatedAt = new Date().toISOString();

      const fields: string[] = [];
      const values: any[] = [];

      for (const key in updates) {
        fields.push(`${key} = ?`);
        values.push((updates as any)[key]);
      }

      fields.push('updatedAt = ?');
      values.push(updatedAt);
      values.push(id);

      await this.db.executeSql(
        `UPDATE ${this.table} SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    } catch (error) {
      console.error(`[UPDATE][${this.table}] Error:`, error);
      throw error;
    }
  }
}

const initializeTableFunctions = async (
  getDatabase: () => Promise<SQLiteDatabase>,
  tableName: string
): Promise<DatabaseFunctions> => {
  const db = await getDatabase();
  const obj = new DatabaseFunctions(tableName, db)

  return obj;
};

export default initializeTableFunctions;