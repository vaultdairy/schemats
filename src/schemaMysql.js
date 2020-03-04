"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var lodash_1 = require("lodash");
var url_1 = require("url");
var schemaBase_1 = require("./schemaBase");
var MysqlDatabase = /** @class */ (function (_super) {
    __extends(MysqlDatabase, _super);
    function MysqlDatabase(connectionString) {
        var _this = _super.call(this) || this;
        _this.connectionString = connectionString;
        _this.db = mysql.createConnection(connectionString);
        var url = url_1.parse(connectionString, true);
        if (url && url.pathname) {
            var database = url.pathname.substr(1);
            _this.defaultSchema = database;
        }
        else {
            _this.defaultSchema = 'public';
        }
        return _this;
    }
    // uses the type mappings from https://github.com/mysqljs/ where sensible
    MysqlDatabase.mapTableTypeToNativeType = function (tableType) {
        switch (tableType) {
            case 'char':
            case 'varchar':
            case 'text':
            case 'tinytext':
            case 'mediumtext':
            case 'longtext':
            case 'time':
            case 'geometry':
            case 'set':
            case 'enum':
                // keep set and enum defaulted to string if custom type not mapped
                return 'string';
            case 'integer':
            case 'int':
            case 'smallint':
            case 'mediumint':
            case 'bigint':
            case 'double':
            case 'decimal':
            case 'numeric':
            case 'float':
            case 'year':
                return 'number';
            case 'tinyint':
                return 'boolean';
            case 'json':
                return 'Object';
            case 'date':
            case 'datetime':
            case 'timestamp':
                return 'Date';
            case 'tinyblob':
            case 'mediumblob':
            case 'longblob':
            case 'blob':
            case 'binary':
            case 'varbinary':
            case 'bit':
                return 'Buffer';
            default:
                return 'any';
        }
    };
    MysqlDatabase.parseMysqlEnumeration = function (mysqlEnum) {
        return mysqlEnum.replace(/(^(enum|set)\('|'\)$)/gi, '').split("','");
    };
    MysqlDatabase.getEnumNameFromColumn = function (dataType, columnName) {
        return dataType + "_" + columnName;
    };
    MysqlDatabase.prototype.query = function (queryString) {
        return this.queryAsync(queryString);
    };
    MysqlDatabase.prototype.getEnumTypes = function (schema) {
        return __awaiter(this, void 0, void 0, function () {
            var enums, enumSchemaWhereClause, params, rawEnumRecords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enums = {};
                        if (schema) {
                            enumSchemaWhereClause = "and table_schema = ?";
                            params = [schema];
                        }
                        else {
                            enumSchemaWhereClause = '';
                            params = [];
                        }
                        return [4 /*yield*/, this.queryAsync('SELECT column_name AS column_name, column_type AS column_type, data_type AS data_type ' +
                                'FROM information_schema.columns ' +
                                ("WHERE data_type IN ('enum', 'set') " + enumSchemaWhereClause), params)];
                    case 1:
                        rawEnumRecords = _a.sent();
                        rawEnumRecords.forEach(function (enumItem) {
                            var enumName = MysqlDatabase.getEnumNameFromColumn(enumItem.data_type, enumItem.column_name);
                            var enumValues = MysqlDatabase.parseMysqlEnumeration(enumItem.column_type);
                            if (enums[enumName] && !lodash_1.isEqual(enums[enumName], enumValues)) {
                                var errorMsg = "Multiple enums with the same name and contradicting types were found: " +
                                    (enumItem.column_name + ": " + JSON.stringify(enums[enumName]) + " and " + JSON.stringify(enumValues));
                                throw new Error(errorMsg);
                            }
                            enums[enumName] = enumValues;
                        });
                        return [2 /*return*/, enums];
                }
            });
        });
    };
    MysqlDatabase.prototype.getTableDefinition = function (tableName, tableSchema) {
        return __awaiter(this, void 0, void 0, function () {
            var tableDefinition, tableColumns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableDefinition = {};
                        return [4 /*yield*/, this.queryAsync("\n            SELECT\n                column_name AS column_name,\n                data_type AS data_type,\n                is_nullable AS is_nullable,\n                column_comment AS column_comment\n            FROM information_schema.columns\n            WHERE table_name = ? AND table_schema = ?", [tableName, tableSchema])];
                    case 1:
                        tableColumns = _a.sent();
                        tableColumns.map(function (schemaItem) {
                            var columnName = schemaItem.column_name;
                            var dataType = schemaItem.data_type;
                            tableDefinition[columnName] = {
                                udtName: /^(enum|set)$/i.test(dataType) ? MysqlDatabase.getEnumNameFromColumn(dataType, columnName) : dataType,
                                nullable: schemaItem.is_nullable === 'YES',
                                comment: schemaItem.column_comment
                            };
                        });
                        return [2 /*return*/, tableDefinition];
                }
            });
        });
    };
    MysqlDatabase.prototype.getTableTypes = function (tableName, tableSchema, options) {
        return __awaiter(this, void 0, void 0, function () {
            var enumTypes, customTypes, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getEnumTypes(tableSchema)];
                    case 1:
                        enumTypes = _c.sent();
                        customTypes = lodash_1.keys(enumTypes);
                        _b = (_a = MysqlDatabase).mapTableDefinitionToType;
                        return [4 /*yield*/, this.getTableDefinition(tableName, tableSchema)];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent(), customTypes, options])];
                }
            });
        });
    };
    MysqlDatabase.prototype.getSchemaTables = function (schemaName) {
        return __awaiter(this, void 0, void 0, function () {
            var schemaTables;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryAsync('SELECT table_name ' +
                            'FROM information_schema.columns ' +
                            'WHERE table_schema = ? ' +
                            'GROUP BY table_name', [schemaName])];
                    case 1:
                        schemaTables = _a.sent();
                        return [2 /*return*/, schemaTables.map(function (schemaItem) { return schemaItem.table_name; })];
                }
            });
        });
    };
    MysqlDatabase.prototype.queryAsync = function (queryString, escapedValues) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.query(queryString, escapedValues, function (error, results) {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };
    MysqlDatabase.prototype.getDefaultSchema = function () {
        return this.defaultSchema;
    };
    return MysqlDatabase;
}(schemaBase_1.DatabaseBase));
exports.MysqlDatabase = MysqlDatabase;
//# sourceMappingURL=schemaMysql.js.map