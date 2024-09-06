"use strict";
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
const prisma_1 = __importDefault(require("../lib/prisma"));
const json2csv_1 = require("json2csv");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function exportTransactionToCSV() {
    return __awaiter(this, void 0, void 0, function* () {
        // Query selected fields from the transaction collection
        const data = yield prisma_1.default.transaction.findMany({
            select: {
                transaction_id: true,
                wallet_id: true,
                destination_id: true,
                amount: true,
            },
        });
        // Convert JSON to CSV
        const parser = new json2csv_1.Parser();
        const csv = parser.parse(data);
        // Define the file path
        const filePath = path_1.default.join(__dirname, 'transaction.csv');
        // Write the CSV file
        fs_1.default.writeFileSync(filePath, csv);
        console.log('transaction.csv saved successfully!');
    });
}
exportTransactionToCSV()
    .then(() => console.log('Database export complete!'))
    .catch((err) => console.error('Error exporting database:', err))
    .finally(() => prisma_1.default.$disconnect());
