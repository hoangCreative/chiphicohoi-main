import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { questions } from '../src/data/questions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateGasScript = () => {
  const gasCode = `
function createTieuHanhTinhForm() {
  const form = FormApp.create('Tiểu Hành Tinh - Khám Phá Bản Thân');
  form.setDescription('Bài trắc nghiệm chuyên sâu giúp bạn vẽ lại bản đồ nội tâm và định vị chính xác bạn đang ở đâu trong vũ trụ này.');
  form.setConfirmationMessage('Cảm ơn bạn đã hoàn thành bài trắc nghiệm. Vui lòng tải file CSV (Responses) và tải lên ứng dụng Tiểu Hành Tinh để xem báo cáo chi tiết.');
  form.setRequireLogin(false);
  
  // Add Name field
  form.addTextItem()
    .setTitle('Tên của bạn là gì?')
    .setRequired(true);

  // Add Email field (optional)
  form.addTextItem()
    .setTitle('Email của bạn (tuỳ chọn)')
    .setRequired(false);

  const questions = ${JSON.stringify(questions, null, 2)};

  questions.forEach(q => {
    if (q.type === 'single_choice') {
      const item = form.addMultipleChoiceItem();
      item.setTitle(q.id + ': ' + q.text);
      item.setChoiceValues(q.options.map(o => o.id + '. ' + o.text));
      item.setRequired(true);
    } else if (q.type === 'scale') {
      const item = form.addScaleItem();
      item.setTitle(q.id + ': ' + q.text);
      item.setBounds(1, 5);
      item.setLabels('Hoàn toàn không đồng ý', 'Hoàn toàn đồng ý');
      item.setRequired(true);
    } else if (q.type === 'ranking') {
      const item = form.addGridItem();
      item.setTitle(q.id + ': ' + q.text);
      item.setRows(q.options.map(o => o.id + '. ' + o.text));
      item.setColumns(['Hạng 1', 'Hạng 2', 'Hạng 3', 'Hạng 4', 'Hạng 5', 'Hạng 6', 'Hạng 7', 'Hạng 8']);
      item.setRequired(true);
    }
  });

  Logger.log('Form URL: ' + form.getPublishedUrl());
  Logger.log('Edit URL: ' + form.getEditUrl());
}
`;

  fs.writeFileSync(path.join(__dirname, 'google_form_script.gs'), gasCode);
  console.log('Generated scripts/google_form_script.gs');
};

generateGasScript();
