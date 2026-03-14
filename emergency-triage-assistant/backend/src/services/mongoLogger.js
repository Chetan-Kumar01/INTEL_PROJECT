// Optional MongoDB integration
// Uncomment and configure when MongoDB is available

/*
const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  token_counts: {
    original: Number,
    compressed: Number,
    reduction_percent: Number
  },
  latency_metrics: {
    compression_ms: Number,
    recommendation_ms: Number,
    verification_ms: Number,
    confidence_ms: Number,
    total_ms: Number
  },
  confidence_score: String,
  verification_status: String,
  mode: String
});

const Analytics = mongoose.model('Analytics', AnalyticsSchema);

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

async function logToMongoDB(data) {
  try {
    const analytics = new Analytics({
      token_counts: {
        original: data.originalTokens,
        compressed: data.compressedTokens,
        reduction_percent: data.reductionPercent
      },
      latency_metrics: {
        compression_ms: data.compressionMs,
        recommendation_ms: data.recommendationMs,
        verification_ms: data.verificationMs,
        confidence_ms: data.confidenceMs,
        total_ms: data.totalMs
      },
      confidence_score: data.confidenceScore,
      verification_status: data.verificationStatus,
      mode: data.mode
    });
    
    await analytics.save();
  } catch (error) {
    console.error('MongoDB log error:', error);
  }
}

async function getLogsFromMongoDB(limit = 10) {
  try {
    return await Analytics.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
  } catch (error) {
    console.error('MongoDB fetch error:', error);
    return [];
  }
}

module.exports = { connectMongoDB, logToMongoDB, getLogsFromMongoDB };
*/

// To enable MongoDB:
// 1. Install: npm install mongoose
// 2. Add MONGODB_URI to .env
// 3. Uncomment code above
// 4. Import and call connectMongoDB() in server.js
// 5. Use logToMongoDB() in controllers

module.exports = {};
