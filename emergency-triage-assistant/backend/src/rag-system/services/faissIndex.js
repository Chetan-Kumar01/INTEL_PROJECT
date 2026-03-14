const fs = require('fs');
const path = require('path');

class FAISSIndexManager {
  constructor() {
    this.indexDir = path.join(__dirname, '../../data/faiss-indexes');
    this.indexes = new Map();
    this.ensureIndexDir();
  }

  ensureIndexDir() {
    if (!fs.existsSync(this.indexDir)) {
      fs.mkdirSync(this.indexDir, { recursive: true });
    }
  }

  async createIndex(patientId, chunks, embeddings) {
    const index = {
      patientId,
      chunks: chunks.map((chunk, i) => ({
        ...chunk,
        embedding: embeddings[i],
        id: i
      })),
      createdAt: new Date().toISOString()
    };

    this.indexes.set(patientId, index);
    
    const indexPath = path.join(this.indexDir, `${patientId}.json`);
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    
    return index;
  }

  loadIndex(patientId) {
    if (this.indexes.has(patientId)) {
      return this.indexes.get(patientId);
    }

    const indexPath = path.join(this.indexDir, `${patientId}.json`);
    if (fs.existsSync(indexPath)) {
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      this.indexes.set(patientId, index);
      return index;
    }

    return null;
  }

  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async search(patientId, queryEmbedding, topK = 5) {
    const index = this.loadIndex(patientId);
    if (!index) {
      throw new Error(`Index not found for patient: ${patientId}`);
    }

    const results = index.chunks.map(chunk => ({
      ...chunk,
      similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    results.sort((a, b) => b.similarity - a.similarity);
    
    return results.slice(0, topK);
  }

  deleteIndex(patientId) {
    this.indexes.delete(patientId);
    const indexPath = path.join(this.indexDir, `${patientId}.json`);
    if (fs.existsSync(indexPath)) {
      fs.unlinkSync(indexPath);
    }
  }
}

module.exports = new FAISSIndexManager();
