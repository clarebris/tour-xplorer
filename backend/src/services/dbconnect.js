"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.query = void 0;
const sql = __importStar(require("mssql"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../config/config");
dotenv_1.default.config();
const pool = new sql.ConnectionPool(config_1.sqlConfig);
// console.log(pool);
const poolConnect = pool.connect();
function query(queryString) {
    return __awaiter(this, void 0, void 0, function* () {
        yield poolConnect;
        try {
            const request = new sql.Request(pool);
            const result = yield request.query(queryString);
            return result;
        }
        catch (error) {
            throw new Error(`Error executing SQL query: ${error}`);
        }
    });
}
exports.query = query;
const execute = (procedureName, params = {}) => __awaiter(void 0, void 0, void 0, function* () {
    yield poolConnect;
    try {
        const request = new sql.Request(pool);
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                request.input(key, params[key]);
            }
        }
        const result = yield request.execute(procedureName);
        return result;
    }
    catch (error) {
        throw new Error(`Error executing stored procedure: ${error}`);
    }
});
exports.execute = execute;
// `EXEC ${procedureName}` use when runiing stored procedure without params
// to use with params
// const procedureName = 'MyProcedureWithParams'; // Replace with your actual procedure name
//   const params = {
//     Param1: 'Value1',
//     Param2: 'Value2',
//     // Add more parameters as needed
//   };
//     const result = await execute(procedureName, params);
