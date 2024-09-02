import prisma from "../lib/prisma";
import {Parser} from "json2csv";
import fs from 'fs';
import path from 'path';

async function exportTransactionToCSV() {
  // Query selected fields from the transaction collection
  const data = await prisma.transaction.findMany({
    select: {
      transaction_id: true,
      wallet_id: true,
      destination_id: true,
      amount: true,
    },
  });

  // Convert JSON to CSV
  const parser = new Parser();
  const csv = parser.parse(data);

  // Define the file path
  const filePath = path.join(__dirname, 'transaction.csv');

  // Write the CSV file
  fs.writeFileSync(filePath, csv);

  console.log('transaction.csv saved successfully!');
}

exportTransactionToCSV()
  .then(() => console.log('Database export complete!'))
  .catch((err) => console.error('Error exporting database:', err))
  .finally(() => prisma.$disconnect());