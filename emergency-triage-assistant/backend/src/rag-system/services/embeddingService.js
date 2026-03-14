const { spawn } = require('child_process');
const path = require('path');

class EmbeddingService {
  constructor() {
    this.pythonScript = path.join(__dirname, 'embedder.py');
  }

  async generateEmbeddings(texts) {
    return new Promise((resolve, reject) => {
      const python = spawn('python', [this.pythonScript, JSON.stringify(texts)]);
      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Embedding generation failed: ${error}`));
        } else {
          try {
            const embeddings = JSON.parse(output);
            resolve(embeddings);
          } catch (e) {
            reject(new Error(`Failed to parse embeddings: ${e.message}`));
          }
        }
      });
    });
  }
}

module.exports = new EmbeddingService();
