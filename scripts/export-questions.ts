import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { questions } from '../src/data/questions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exportQuestions = () => {
  // 1. Export as JSON
  const jsonPath = path.join(__dirname, '../public/questions.json');
  fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2));
  console.log(`Exported JSON to ${jsonPath}`);

  // 2. Export as CSV
  const csvPath = path.join(__dirname, '../public/questions.csv');
  const csvHeader = 'ID,Module,Category,Type,Text,Options\n';
  
  const csvRows = questions.map(q => {
    const optionsStr = q.options ? q.options.map(o => `${o.id}. ${o.text}`).join(' | ') : '';
    
    // Escape quotes for CSV
    const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;
    
    return `${q.id},${q.module},${q.category},${q.type},${escapeCsv(q.text)},${escapeCsv(optionsStr)}`;
  });

  fs.writeFileSync(csvPath, csvHeader + csvRows.join('\n'));
  console.log(`Exported CSV to ${csvPath}`);
};

exportQuestions();
