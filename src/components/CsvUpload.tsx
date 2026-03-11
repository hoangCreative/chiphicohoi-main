import { useState } from 'react';
import React from 'react';
import Papa from 'papaparse';
import { mapCsvRowToResponses } from '../utils/csvMapper';
import { UserResponses } from '../types';
import { Upload, FileText, User, ChevronRight, Loader2, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CsvUploadProps {
  onUserSelect: (responses: UserResponses, userName: string) => void;
  onBack: () => void;
}

type CsvRow = Record<string, string>;

interface ProcessedRow {
  id: number;
  original: CsvRow;
  responses: UserResponses;
  isValid: boolean;
  userName: string;
  timestamp: string;
  validationError?: string;
}

export default function CsvUpload({ onUserSelect, onBack }: CsvUploadProps) {
  const [processedRows, setProcessedRows] = useState<ProcessedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInvalid, setShowInvalid] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError(null);
    setProcessedRows([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const fields = results.meta.fields || [];
        setHeaders(fields);
        const rawData = results.data as CsvRow[];

        const processed = rawData.map((row, index) => {
          const responses = mapCsvRowToResponses(row);
          const responseCount = Object.keys(responses).length;
          
          // Validation logic:
          // A row is valid if it maps to at least 1 question.
          // We can make this stricter (e.g., > 5) if needed.
          const isValid = responseCount > 0;

          // Identify user name
          const nameCol = fields.find(h => h.toLowerCase().includes('tên') || h.toLowerCase().includes('name') || h.toLowerCase().includes('email'));
          const userName = nameCol ? row[nameCol] : `User ${index + 1}`;
          
          const timestampCol = fields.find(h => h.toLowerCase().includes('time') || h.toLowerCase().includes('dấu thời gian'));
          const timestamp = timestampCol ? row[timestampCol] : '';

          return {
            id: index,
            original: row,
            responses,
            isValid,
            userName,
            timestamp,
            validationError: isValid ? undefined : 'Không tìm thấy dữ liệu phù hợp với câu hỏi nào.'
          };
        });

        setProcessedRows(processed);
        setLoading(false);
      },
      error: (err) => {
        setError('Lỗi khi đọc file CSV: ' + err.message);
        setLoading(false);
      }
    });
  };

  const handleSelectUser = (row: ProcessedRow) => {
    onUserSelect(row.responses, row.userName);
  };

  const validRows = processedRows.filter(r => r.isValid);
  const invalidRows = processedRows.filter(r => !r.isValid);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={onBack}
        className="mb-6 text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors"
      >
        ← Quay lại
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-600" />
          Tải lên dữ liệu CSV
        </h2>

        {/* Upload Area */}
        <div className="mb-8">
          <label 
            htmlFor="csv-upload" 
            className={`
              flex flex-col items-center justify-center w-full h-48 
              border-2 border-dashed rounded-2xl cursor-pointer 
              transition-all duration-200
              ${fileName 
                ? 'border-indigo-200 bg-indigo-50' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {loading ? (
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
              ) : (
                <Upload className={`w-10 h-10 mb-3 ${fileName ? 'text-indigo-600' : 'text-gray-400'}`} />
              )}
              <p className="mb-2 text-sm text-gray-500 font-medium">
                {fileName ? fileName : 'Nhấn để tải lên hoặc kéo thả file CSV'}
              </p>
              <p className="text-xs text-gray-400">CSV (Comma delimited)</p>
            </div>
            <input 
              id="csv-upload" 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {/* Invalid Rows Warning */}
        {invalidRows.length > 0 && (
          <div className="mb-6">
            <button 
              onClick={() => setShowInvalid(!showInvalid)}
              className="w-full flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-medium">
                  Phát hiện {invalidRows.length} dòng không hợp lệ
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${showInvalid ? 'rotate-90' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showInvalid && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {invalidRows.map((row) => (
                      <div key={row.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Dòng {row.id + 1}: {row.userName}</div>
                          <div className="text-xs text-red-600 mt-1">{row.validationError}</div>
                          <div className="text-xs text-gray-400 mt-1 font-mono truncate max-w-md">
                            {JSON.stringify(row.original)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Valid User List */}
        {validRows.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Danh sách hợp lệ ({validRows.length})
            </h3>
            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {validRows.map((row) => (
                <motion.button
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleSelectUser(row)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {row.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{row.userName}</div>
                      {row.timestamp && <div className="text-xs text-gray-500">{row.timestamp}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-indigo-600">
                    <span className="text-sm font-medium">Xem báo cáo</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Summary Footer */}
        {(validRows.length > 0 || invalidRows.length > 0) && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
            <div>
              Tổng số dòng: <span className="font-medium text-gray-900">{processedRows.length}</span>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Hợp lệ: <span className="font-medium text-emerald-600">{validRows.length}</span>
              </span>
              {invalidRows.length > 0 && (
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Không hợp lệ: <span className="font-medium text-amber-600">{invalidRows.length}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
