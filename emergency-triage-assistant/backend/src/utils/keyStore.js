class ApiKeyStore {
  constructor() {
    this.keys = new Map();
  }

  setKeys(sessionId, scaleDownKey, llmKey, groqKey = null) {
    this.keys.set(sessionId, {
      scaleDown: scaleDownKey,
      llm: llmKey,
      groq: groqKey,
      timestamp: Date.now()
    });
    
    setTimeout(() => this.keys.delete(sessionId), 3600000);
  }

  getKeys(sessionId) {
    return this.keys.get(sessionId) || null;
  }

  deleteKeys(sessionId) {
    this.keys.delete(sessionId);
  }

  cleanup() {
    const now = Date.now();
    for (const [sessionId, data] of this.keys.entries()) {
      if (now - data.timestamp > 3600000) {
        this.keys.delete(sessionId);
      }
    }
  }
}

const keyStore = new ApiKeyStore();

setInterval(() => keyStore.cleanup(), 600000);

module.exports = keyStore;
