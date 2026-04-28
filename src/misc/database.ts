import { getDatabase } from '../api/db';
import { initializeDatabase } from '../api/schema';
import { booleanToNumber } from '../misc/helpers';
import { Condition, ColumnSelection, JoinInput, Pagination } from '../types/variables';
import { QuickSQLiteConnection } from 'react-native-quick-sqlite';

class DatabaseFunctions {
  private table: string;
  private db: QuickSQLiteConnection;

  constructor(table: string, db: QuickSQLiteConnection) {
    this.table = table;
    this.db = db;
  }

  async insert<T>(record: Record<string, any>, isTimestamp = true): Promise<T> {
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
      const values = fields.map(key => {
        let val = valuesObj[key];
        if (typeof val === 'boolean') return booleanToNumber(val);
        if (val === undefined || val === '') return null;
        return val;
      });

      const result = await this.db.executeAsync(
        `INSERT INTO ${this.table} (${fields.join(', ')}) VALUES (${placeholders})`,
        values
      );

      const insertId = result?.insertId;

      if (!insertId) {
        throw new Error('Insert succeeded but insertId is missing');
      }

      const selectResult = await this.db.executeAsync(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        [insertId]
      );

      if (!selectResult?.rows || selectResult.rows.length === 0) {
        throw new Error('Failed to fetch inserted row');
      }

      return selectResult.rows.item(0) as T;
    } catch (error) {
      console.error(`[INSERT][${this.table}] Error:`, error);
      throw error;
    }
  }

  private buildJoinClause(joins?: JoinInput[]): string {
    if (!joins?.length) return '';
    return joins.map(join => {
      const tableName = join.as ? `${join.through} AS ${join.as}` : join.through;
      return ` ${join.type ?? 'LEFT'} JOIN ${tableName} ON ${join.on}`;
    }).join('');
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
        const tableName = join.as ?? join.through;
        if (!join.columns?.length) {
          selections.push(`${tableName}.*`);
        } else {
          selections.push(
            ...join.columns.map(
              col => `${tableName}.${col.column} AS ${col.alias ?? `${tableName}_${col.column}`}`
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
    columns?: ColumnSelection[],
    pagination?: Pagination
  ): Promise<T[]> {
    try {
      const selectClause = this.buildSelectClause(columns, joins);
      const joinClause = this.buildJoinClause(joins);

      let query = `SELECT ${selectClause} FROM ${this.table}${joinClause}`;
      const values: any[] = [];

      if (conditions.length) {
        const whereClause = conditions
          .map(cond => {
            if (cond.operator === 'IN' && Array.isArray(cond.value)) {
              const placeholders = cond.value.map(() => '?').join(', ');
              return `${cond.table ?? this.table}.${cond.field} IN (${placeholders})`;
            }
            return `${cond.table ?? this.table}.${cond.field} ${cond.operator ?? '='} ?`;
          })
          .join(' AND ');
        query += ` WHERE ${whereClause}`;
        conditions.forEach(cond => {
          if (cond.operator === 'IN' && Array.isArray(cond.value)) {
            values.push(...cond.value);
          } else {
            values.push(cond.value);
          }
        });

      }

      if (orderBy) query += ` ORDER BY ${orderBy}`;

      if (pagination?.limit !== undefined) {
        query += ` LIMIT ?`;
        values.push(pagination.limit);

        if (pagination.offsetUnit !== undefined) {
          query += ` OFFSET ?`;
          values.push(pagination.offsetUnit);
        }
      }

      const results = await this.db.executeAsync(query, values) || [];
      const data: T[] = [];

      if (!results.rows) return []


      for (let i = 0; i < results.rows.length || 0; i++) {
        data.push(results.rows.item(i));
      }

      return data;
    } catch (error) {
      console.error(`[FIND_ALL][${this.table}] Error:`, error);
      throw error;
    }
  }

  async findAllWithCount<T>(
    conditions: Condition[] = [],
    orderBy?: string,
    joins?: JoinInput[],
    columns?: ColumnSelection[],
    pagination?: Pagination
  ): Promise<{ data: T[]; count: number }> {
    try {
      const joinClause = this.buildJoinClause(joins);
      const values: any[] = [];
      let whereClause = '';

      if (conditions.length) {
        whereClause = ' WHERE ' + conditions
          .map(cond => {
            if (cond.operator === 'IN' && Array.isArray(cond.value)) {
              const placeholders = cond.value.map(() => '?').join(', ');
              return `${cond.table ?? this.table}.${cond.field} IN (${placeholders})`;
            }
            return `${cond.table ?? this.table}.${cond.field} ${cond.operator ?? '='} ?`;
          })
          .join(' AND ');
        conditions.forEach(cond => {
          if (cond.operator === 'IN' && Array.isArray(cond.value)) {
            values.push(...cond.value);
          } else {
            values.push(cond.value);
          }
        });

      }

      const countQuery = `SELECT COUNT(*) as count FROM ${this.table} ${joinClause} ${whereClause}`;

      const countResult = await this.db.executeAsync(countQuery, values);
      const count =
        (countResult?.rows && countResult?.rows?.length > 0)
          ? countResult?.rows?.item(0).count
          : 0;

      const selectClause = this.buildSelectClause(columns, joins);
      let dataQuery = `SELECT ${selectClause} FROM ${this.table}${joinClause} ${whereClause}`;

      const dataValues = [...values];

      if (orderBy) dataQuery += ` ORDER BY ${orderBy}`;

      if (pagination?.limit !== undefined) {
        dataQuery += ` LIMIT ?`;
        dataValues.push(pagination.limit);

        if (pagination.offsetUnit !== undefined) {
          dataQuery += ` OFFSET ?`;
          dataValues.push(pagination.offsetUnit);
        }
      }

      const results = await this.db.executeAsync(dataQuery, dataValues);
      const data: T[] = [];

      if (results?.rows) {
        for (let i = 0; i < results.rows.length; i++) {
          data.push(results.rows.item(i));
        }
      }

      return { data, count };
    } catch (error) {
      console.error(`[FIND_ALL_WITH_COUNT][${this.table}] Error:`, error);
      throw error;
    }
  }

  async findOne<T>(
    conditions: Condition[],
    joins?: JoinInput[],
    columns?: ColumnSelection[]
  ): Promise<T | null> {
    try {
      const selectClause = this.buildSelectClause(columns, joins);
      const joinClause = this.buildJoinClause(joins);

      let query = `SELECT ${selectClause} FROM ${this.table}${joinClause}`;
      const values: any[] = [];

      if (conditions.length) {
        const whereClause = conditions
          .map(cond => `${cond.table ?? this.table}.${cond.field} ${cond.operator ?? '='} ?`)
          .join(' AND ');
        query += ` WHERE ${whereClause}`;
        values.push(...conditions.map(cond => cond.value));
      }

      query += ' LIMIT 1';

      const results = await this.db.executeAsync(query, values);
      if (!results || !results.rows || !results.rows.length) return null;

      return results.rows.item(0) as T;
    } catch (error) {
      console.error(`[FIND_ONE][${this.table}] Error:`, error);
      throw error;
    }
  }

  async findByPk<T>(id: number, columns?: ColumnSelection[]): Promise<T | null> {
    return this.findOne<T>([{ field: 'id', value: id }], undefined, columns);
  }

  async update<T>(id: number, updates: Partial<any>, isTimestamp = true): Promise<T> {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      for (const key in updates) {
        let val = (updates as any)[key];

        if (typeof val === 'boolean') val = booleanToNumber(val);
        if (val === undefined || val === '') val = null;

        fields.push(`${key} = ?`);
        values.push(val);
      }

      if (isTimestamp) {
        const updatedAt = new Date().toISOString();
        fields.push('updatedAt = ?');
        values.push(updatedAt);
      }

      if (!fields.length) {
        throw new Error('No fields provided for update');
      }

      values.push(id);

      const query = `UPDATE ${this.table} SET ${fields.join(', ')} WHERE id = ?`;

      await this.db.executeAsync(query, values);

      const selectResult = await this.db.executeAsync(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        [id]
      );

      if (!selectResult?.rows || selectResult.rows.length === 0) {
        throw new Error('Failed to fetch updated row');
      }

      return selectResult.rows.item(0) as T;
    } catch (error) {
      console.error(`[UPDATE][${this.table}] Error:`, error);
      throw error;
    }
  }

  async delete(conditions: Condition[]): Promise<number[]> {
    try {
      if (!conditions.length) return [];

      const where = conditions
        .map(cond => `${cond.table ?? this.table}.${cond.field} ${cond.operator ?? '='} ?`)
        .join(' AND ');
      const values = conditions.map(cond => cond.value);

      const selectResult = await this.db.executeAsync(
        `SELECT id FROM ${this.table} WHERE ${where}`,
        values
      );

      const ids: number[] = [];

      if (selectResult?.rows) {
        for (let i = 0; i < selectResult.rows.length; i++) {
          ids.push(selectResult.rows.item(i).id);
        }
      }

      if (!ids.length) return [];

      await this.db.executeAsync(`DELETE FROM ${this.table} WHERE ${where}`, values);

      return ids;
    } catch (error) {
      console.error(`[DELETE][${this.table}] Error:`, error);
      throw error;
    }
  }

  async deleteOne<T>(conditions: Condition[]): Promise<T | null> {
    try {
      if (!conditions.length) return null;

      const where = conditions
        .map(cond => `${cond.table ?? this.table}.${cond.field} ${cond.operator ?? '='} ?`)
        .join(' AND ');

      const values = conditions.map(cond => cond.value);

      const selectResult = await this.db.executeAsync(
        `SELECT * FROM ${this.table} WHERE ${where} LIMIT 1`,
        values
      );

      if (!selectResult?.rows || selectResult.rows.length === 0) {
        return null;
      }

      const deletedItem = selectResult.rows.item(0);

      await this.db.executeAsync(
        `DELETE FROM ${this.table} WHERE id = ?`,
        [deletedItem.id]
      );

      return deletedItem;
    } catch (error) {
      console.error(`[DELETE_ONE][${this.table}] Error:`, error);
      throw error;
    }
  }

}

let dbInstances: Record<string, DatabaseFunctions> = {};
let dbInitialized = false;

export const initializeTableFunctions = async (tableName: string): Promise<DatabaseFunctions> => {
  if (dbInstances[tableName]) return dbInstances[tableName];

  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }

  const db = await getDatabase();

  const instance = new DatabaseFunctions(tableName, db);
  dbInstances[tableName] = instance;

  return instance;
};