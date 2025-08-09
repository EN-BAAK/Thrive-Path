import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { booleanToNumber } from './helpers';
import { Condition, ColumnSelection, JoinInput } from '../types/variables';

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

      const fields = Object.keys(valuesObj).filter(key => key !== 'id');
      const placeholders = fields.map(() => '?').join(', ');
      const values = fields.map((key) => {
        const val = valuesObj[key];
        return typeof val === 'boolean' ? booleanToNumber(val) : val;
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

  private buildJoinClause(joins?: JoinInput[]): string {
    if (!joins?.length) return '';
    return joins.map(
      join => ` ${join.type ?? 'LEFT'} JOIN ${join.through} ON ${join.on}`
    ).join('');
  }

  private buildSelectClause(
    mainColumns?: ColumnSelection[],
    joins?: JoinInput[]
  ): string {
    const selections: string[] = [];

    if (!mainColumns?.length) {
      selections.push(`${this.table}.*`);
    } else {
      selections.push(
        ...mainColumns.map(
          col => `${this.table}.${col.column} AS ${col.alias ?? `${this.table}_${col.column}`}`
        )
      );
    }

    if (joins?.length) {
      for (const join of joins) {
        if (!join.columns?.length) {
          selections.push(`${join.through}.*`);
        } else {
          selections.push(
            ...join.columns.map(
              col => `${join.through}.${col.column} AS ${col.alias ?? `${join.through}_${col.column}`}`
            )
          );
        }
      }
    }

    return selections.join(', ');
  }

  async findAll<T>(
    conditions: Condition[] = [],
    orderBy?: string,
    joins?: JoinInput[],
    columns?: ColumnSelection[]
  ): Promise<T[]> {
    try {
      const selectClause = this.buildSelectClause(columns, joins);
      const joinClause = this.buildJoinClause(joins);

      let query = `SELECT ${selectClause} FROM ${this.table}${joinClause}`;
      const values: any[] = [];

      if (conditions.length) {
        const whereClause = conditions.map(
          cond => `${cond.table ?? this.table}.${cond.field} ${cond.operator ?? '='} ?`
        ).join(' AND ');
        query += ` WHERE ${whereClause}`;
        values.push(...conditions.map(cond => cond.value));
      }

      if (orderBy) query += ` ORDER BY ${orderBy}`;

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

  async findOne<T>(
    conditions: Condition[],
    joins?: JoinInput[],
    columns?: ColumnSelection[]
  ): Promise<T | null> {
    const result = await this.findAll<T>(conditions, undefined, joins, columns);
    return result[0] ?? null;
  }

  async findByPk<T>(id: number): Promise<T | null> {
    return this.findOne<T>([{ field: 'id', value: id }]);
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

      const query = `UPDATE ${this.table} SET ${fields.join(', ')} WHERE id = ?`;
      await this.db.executeSql(query, values);
    } catch (error) {
      console.error(`[UPDATE][${this.table}] Error:`, error);
      throw error;
    }
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
        cond => `${cond.field} ${cond.operator ?? '='} ?`
      ).join(' AND ');
      const values = conditions.map(cond => cond.value);
      await this.db.executeSql(`DELETE FROM ${this.table} WHERE ${where}`, values);
    } catch (error) {
      console.error(`[DELETE][${this.table}] Error:`, error);
      throw error;
    }
  }
}

const initializeTableFunctions = async (
  getDatabase: () => Promise<SQLiteDatabase>,
  tableName: string
): Promise<DatabaseFunctions> => {
  const db = await getDatabase();
  return new DatabaseFunctions(tableName, db);
};

export default initializeTableFunctions;
