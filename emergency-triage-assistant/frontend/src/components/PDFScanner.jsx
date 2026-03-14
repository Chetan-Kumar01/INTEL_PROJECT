import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PDFScanner({ onExtractedText }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [status, setStatus] = useState('');
  const [fileInfo, setFileInfo] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        modified: new Date(file.lastModified).toLocaleDateString()
      });
      setStatus('✓ PDF selected');
    } else {
      setStatus('❌ Please select a valid PDF file');
      setPdfFile(null);
    }
  };

  const extractPDFText = async () => {
    if (!pdfFile) {
      setStatus('❌ No PDF file selected');
      return;
    }

    setLoading(true);
    setStatus('⏳ Extracting text from PDF...');
    
    try {
      // Using PDF.js to extract text from PDF
      const formData = new FormData();
      formData.append('file', pdfFile);

      const response = await fetch('http://localhost:8000/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(`✅ Successfully extracted and indexed ${data.chunks_created} text chunks`);
        
        // Call the callback function to populate parent component
        if (onExtractedText) {
          onExtractedText(pdfFile.name);
        }
      } else {
        const error = await response.json();
        setStatus(`❌ Extraction failed: ${error.detail || 'Unknown error'}`);
      }
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!pdfFile) {
      setStatus('❌ No PDF file selected');
      return;
    }

    setLoading(true);
    setStatus('⏳ Analyzing medical document...');

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      const response = await fetch('http://localhost:8000/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(`✅ Document analyzed and indexed (${data.chunks_created} sections)`);
        setExtractedText(`Medical document "${pdfFile.name}" has been processed and indexed for analysis.`);
        
        if (onExtractedText) {
          onExtractedText(pdfFile.name);
        }
      } else {
        const error = await response.json();
        setStatus(`❌ Analysis failed: ${error.detail}`);
      }
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setPdfFile(null);
    setExtractedText('');
    setStatus('');
    setFileInfo(null);
  };

  return (
    <motion.div
      className="dash-card mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📄</span> PDF Scanner & Document Extraction
          </h3>
          <p className="text-xs text-slate-500 mt-1">Upload and analyze medical documents (PDFs)</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* File Upload Area */}
        <div className="relative">
          <label className="block">
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-800 transition-all duration-200">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="text-3xl mb-2">📤</div>
              <p className="text-sm text-slate-400">Click to upload or drag PDF files</p>
              <p className="text-xs text-slate-500 mt-1">Max file size: 10 MB</p>
            </div>
          </label>
        </div>

        {/* File Info */}
        {fileInfo && (
          <motion.div
            className="bg-slate-800 rounded-lg p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-white">📄 {fileInfo.name}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Size: {fileInfo.size} | Modified: {fileInfo.modified}
                  </p>
                </div>
                <button
                  onClick={clearFile}
                  className="text-slate-400 hover:text-white text-lg"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Status Message */}
        {status && (
          <motion.div
            className={`p-3 rounded-lg text-sm ${
              status.includes('✅')
                ? 'bg-emerald-900 text-emerald-200'
                : status.includes('⏳')
                ? 'bg-blue-900 text-blue-200'
                : 'bg-rose-900 text-rose-200'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {status}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            onClick={extractPDFText}
            disabled={!pdfFile || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Processing...' : '🔍 Extract Text'}
          </motion.button>

          <motion.button
            type="button"
            onClick={uploadAndAnalyze}
            disabled={!pdfFile || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            {loading ? '⏳ Analyzing...' : '📊 Analyze & Index'}
          </motion.button>
        </div>

        {/* Extracted Content Preview */}
        {extractedText && (
          <motion.div
            className="bg-slate-800 rounded-lg p-4 max-h-48 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xs font-medium text-slate-400 mb-2">📋 Processing Result:</p>
            <p className="text-sm text-slate-300">{extractedText}</p>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="border-t border-slate-700 pt-4 mt-4">
          <p className="text-xs text-slate-500 mb-3">📌 Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded transition">
              📚 View Uploaded Files
            </button>
            <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded transition">
              ⚙️ Extraction Settings
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
