import Options from './options'

export interface ColumnDefinition {
    udtName: string,
    nullable: boolean,
    comment: string | null,
    tsType?: string,
    iotsType?: string
}

export interface TableDefinition {
    [columnName: string]: ColumnDefinition
}

export interface Database {
    connectionString: string
    query (queryString: string): Promise<Object[]>
    getDefaultSchema (): string
    getEnumTypes (schema?: string): any
    getTableDefinition (tableName: string, tableSchema: string): Promise<TableDefinition>
    getTableTypes (tableName: string, tableSchema: string, options: Options): Promise<TableDefinition>
    getSchemaTables (schemaName: string): Promise<string[]>
}
