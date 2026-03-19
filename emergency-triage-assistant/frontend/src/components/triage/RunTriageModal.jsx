import React, { useState } from 'react';
import { X, Sparkles, AlertTriangle } from 'lucide-react';
import VitalsInput from './VitalsInput';
import SymptomChecklist from './SymptomChecklist';
import TriageResults from './TriageResults';

const analyzeTriageData = (vitals, symptoms, chiefComplaint) => {
  // STEP 1: Check if form is empty
  const vitalsEntered = [
    vitals.systolic, vitals.diastolic, vitals.pulse,
    vitals.temperature, vitals.spo2, vitals.respRate
  ].filter(v => v !== '' && v !== null && v !== undefined && !isNaN(v))
  
  const symptomsChecked = Object.values(symptoms || {}).some(v => v === true)
  const hasComplaint = chiefComplaint && chiefComplaint.trim().length > 3
  
  // EMPTY FORM = LOW, never HIGH
  if (vitalsEntered.length === 0 && !symptomsChecked && !hasComplaint) {
    return {
      severity: 'LOW',
      severityReason: 'No clinical data entered. Routine assessment.',
      immediateActions: ['Standard check-in', 'Routine vitals'],
      probableDiagnosis: { primary: 'Insufficient data for assessment', differentials: [] },
      vitalsAlert: 'No vitals recorded',
      allergyWarning: 'NONE',
      treatmentProtocol: { immediate: 'N/A', shortTerm: 'N/A', medications: [], monitoring: 'Routine' },
      specialistReferral: 'None',
      estimatedDisposition: 'Routine Care',
      vitals: vitals
    }
  }

  let priority = 'LOW'
  let reasons = []

  // STEP 2: HIGH priority RED FLAGS - only if value actually entered
  const sys = Number(vitals.systolic)
  const dia = Number(vitals.diastolic)
  const pulse = Number(vitals.pulse)
  const temp = Number(vitals.temperature)
  const spo2 = Number(vitals.spo2)
  const rr = Number(vitals.respRate)
  const gcs = Number(vitals.gcs)
  const pain = Number(vitals.painScale)

  if (vitals.spo2 !== '' && spo2 > 0 && spo2 < 92) {
    priority = 'HIGH'
    reasons.push(`SpO2 critically low: ${spo2}%`)
  }
  if (vitals.systolic !== '' && sys > 0 && (sys > 180 || sys < 90)) {
    priority = 'HIGH'
    reasons.push(`BP critical: ${sys}/${dia} mmHg`)
  }
  if (vitals.pulse !== '' && pulse > 0 && (pulse > 130 || pulse < 40)) {
    priority = 'HIGH'
    reasons.push(`Heart rate critical: ${pulse} bpm`)
  }
  if (vitals.temperature !== '' && temp > 0 && (temp > 103.5 || temp < 95)) {
    priority = 'HIGH'
    reasons.push(`Temperature critical: ${temp}°F`)
  }
  if (vitals.gcs !== '' && gcs > 0 && gcs < 13) {
    priority = 'HIGH'
    reasons.push(`GCS dangerously low: ${gcs}`)
  }
  if (vitals.respRate !== '' && rr > 0 && (rr > 30 || rr < 8)) {
    priority = 'HIGH'
    reasons.push(`Respiratory rate critical: ${rr}/min`)
  }
  if (vitals.painScale !== '' && pain >= 8) {
    priority = 'HIGH'
    reasons.push(`Severe pain: ${pain}/10`)
  }

  // High-risk symptoms
  const criticalSymptoms = {
    chestPain: 'Chest pain',
    shortnessOfBreath: 'Shortness of breath',
    difficultyBreathing: 'Difficulty breathing',
    slurredSpeech: 'Slurred speech',
    confusion: 'Confusion',
    syncope: 'Syncope/fainting',
    coughingBlood: 'Coughing blood',
    armPain: 'Arm pain with cardiac symptoms'
  }
  const foundCritical = Object.entries(criticalSymptoms)
    .filter(([key]) => symptoms.includes && symptoms.includes(key)) // adapting Array usage if symptoms is array, wait - it's array in RunTriageModal!
    .map(([, label]) => label)
  if (foundCritical.length > 0) {
    priority = 'HIGH'
    reasons.push(`Critical symptoms: ${foundCritical.join(', ')}`)
  }

  // STEP 3: MEDIUM priority - only if not already HIGH
  if (priority !== 'HIGH') {
    const medVitals = []
    if (vitals.spo2 !== '' && spo2 > 0 && spo2 >= 92 && spo2 < 95) medVitals.push(`SpO2 low: ${spo2}%`)
    if (vitals.systolic !== '' && sys > 0 && sys >= 140 && sys <= 180) medVitals.push(`BP elevated: ${sys}/${dia}`)
    if (vitals.pulse !== '' && pulse > 0 && (pulse >= 100 && pulse <= 130)) medVitals.push(`Tachycardia: ${pulse}bpm`)
    if (vitals.temperature !== '' && temp > 0 && temp >= 100.4 && temp <= 103.5) medVitals.push(`Fever: ${temp}°F`)
    if (vitals.painScale !== '' && pain >= 4 && pain < 8) medVitals.push(`Moderate pain: ${pain}/10`)
    if (medVitals.length > 0) {
      priority = 'MEDIUM'
      reasons.push(...medVitals)
    }

    const moderateSymptoms = ['dizziness','nausea','vomiting','abdominalPain','wheezing','fever','headache','palpitations','sweating','weakness']
    const foundModerate = moderateSymptoms.filter(s => symptoms.includes && symptoms.includes(s))
    if (foundModerate.length >= 2) {
      priority = priority === 'LOW' ? 'MEDIUM' : priority
      reasons.push(`Moderate symptoms: ${foundModerate.join(', ')}`)
    }
  }

  // STEP 4: LOW - stable presentation
  if (priority === 'LOW' && reasons.length === 0) {
    if (vitalsEntered.length > 0) {
      reasons.push('All recorded vitals within normal limits')
    }
  }

  return {
    severity: priority, // TriageResults expects `severity`
    severityReason: reasons.length ? reasons.join('. ') : 'Stable presentation with no acute concerns',
    immediateActions: priority === 'HIGH'
      ? ['Immediate physician assessment', 'Continuous monitoring', 'IV access', 'Emergency protocols']
      : priority === 'MEDIUM'
      ? ['Nurse assessment within 30 mins', 'Repeat vitals in 15 mins', 'Doctor review needed']
      : ['Routine assessment', 'Standard vitals check', 'Schedule follow-up if needed'],
    probableDiagnosis: { primary: 'Clinical correlation required', differentials: [] },
    vitalsAlert: reasons.find(r => r.includes('BP') || r.includes('SpO2') || r.includes('Pulse')) || 'NONE',
    allergyWarning: 'NONE',
    treatmentProtocol: { immediate: 'Based on priority', shortTerm: 'Observe', medications: [], monitoring: 'Standard' },
    specialistReferral: 'ED Physician',
    estimatedDisposition: priority === 'HIGH' ? 'Admit' : 'Discharge likely',
    vitals: vitals
  }
}


const RunTriageModal = ({ isOpen, onClose, patient, onSaveReport }) => {
  const [step, setStep] = useState('input'); // 'input', 'analyzing', 'results'
  const [loadingMessage, setLoadingMessage] = useState('');
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    vitals: {
      systolic: '',
      diastolic: '',
      pulse: '',
      temperature: '',
      spo2: '',
      respRate: '',
      gcs: '15',
      painScale: 0
    },
    symptoms: [],
    onsetTime: '',
    additionalNotes: ''
  });
  const [analysisResults, setAnalysisResults] = useState(null);

  const loadingMessages = [
    'Analyzing patient history...',
    'Evaluating current vitals...',
    'Checking drug interactions...',
    'Assessing emergency severity...',
    'Generating treatment protocol...'
  ];

  if (!isOpen) return null;

  const handleVitalsChange = (vitals) => {
    setFormData(prev => ({ ...prev, vitals }));
  };

  const handleSymptomsChange = (symptoms) => {
    setFormData(prev => ({ ...prev, symptoms }));
  };

  const validateForm = () => {
    const { chiefComplaint, vitals, onsetTime } = formData;
    if (!chiefComplaint.trim()) return 'Chief complaint is required';
    if (!vitals.systolic || !vitals.diastolic) return 'Blood pressure is required';
    if (!vitals.pulse) return 'Pulse rate is required';
    if (!vitals.temperature) return 'Temperature is required';
    if (!vitals.spo2) return 'SpO2 is required';
    if (!vitals.respRate) return 'Respiratory rate is required';
    if (!onsetTime) return 'Onset time is required';
    return null;
  };

  const handleAnalyze = async () => {
    setStep('analyzing');
    setAnalysisResults(null);
    let messageIndex = 0;
    setLoadingMessage(loadingMessages[0]);

    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 1500);

    try {
      const response = await fetch('http://localhost:5001/api/triage/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientContext: {
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            bloodGroup: patient.bloodGroup,
            allergies: patient.allergies || [],
            chronicConditions: patient.chronicConditions || [],
            currentMedications: patient.currentMedications || [],
            pastTriageReports: (patient.triageReports || []).slice(0, 2).map(r => ({
              date: r.date,
              complaint: r.chiefComplaint,
              severity: r.severity,
              diagnosis: r.probableDiagnosis
            }))
          },
          currentVisit: formData
        })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const results = await response.json();
      setAnalysisResults(results);
      setStep('results');
    } catch (error) {
      console.error('API failed, falling back to rules engine:', error);
      const fallbackResults = analyzeTriageData(formData.vitals, formData.symptoms, formData.chiefComplaint);
      setAnalysisResults({
        ...fallbackResults,
        rawResponse: 'Generated by Rules Engine Fallback'
      });
      setStep('results');
    } finally {
      clearInterval(messageInterval);
    }
  };

  const handleSave = () => {
    const report = {
      reportId: 'R' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      chiefComplaint: formData.chiefComplaint,
      severity: analysisResults.severity,
      severityColor: getSeverityColor(analysisResults.severity),
      vitals: {
        bp: `${formData.vitals.systolic}/${formData.vitals.diastolic}`,
        pulse: formData.vitals.pulse,
        temp: formData.vitals.temperature,
        spo2: formData.vitals.spo2,
        respRate: formData.vitals.respRate,
        gcs: formData.vitals.gcs,
        painScale: formData.vitals.painScale
      },
      symptoms: formData.symptoms,
      onsetTime: formData.onsetTime,
      aiAssessment: analysisResults.rawResponse,
      probableDiagnosis: analysisResults.diagnosis?.primary || 'Pending',
      treatment: analysisResults.treatmentProtocol?.immediate || analysisResults.treatment || 'N/A',
      allergyWarning: analysisResults.allergyWarning,
      immediateActions: analysisResults.immediateActions,
      disposition: analysisResults.estimatedDisposition || analysisResults.disposition,
      specialistReferral: analysisResults.specialistReferral,
      doctorAssigned: 'Dr. Current User',
      doctorId: 'D001',
      status: 'Under Observation',
      savedAt: new Date().toISOString()
    };

    // 1) Trigger Download to Computer
    const dataStr = JSON.stringify(report, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Triage_Report_${patient.name.replace(/\s+/g, '_')}_${report.date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // 2) Callback and Close
    onSaveReport(report);
    handleClose();
  };

  const handleClose = () => {
    setStep('input');
    setFormData({
      chiefComplaint: '',
      vitals: {
        systolic: '',
        diastolic: '',
        pulse: '',
        temperature: '',
        spo2: '',
        respRate: '',
        gcs: '15',
        painScale: 0
      },
      symptoms: [],
      onsetTime: '',
      additionalNotes: ''
    });
    setAnalysisResults(null);
    onClose();
  };

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: '#ef4444',
      HIGH: '#f97316',
      MEDIUM: '#eab308',
      LOW: '#22c55e'
    };
    return colors[severity] || '#6b7280';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1d29] rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl border border-purple-500/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4 flex-none flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">
              {step === 'input' && 'Live Triage Analysis'}
              {step === 'analyzing' && 'AI Analysis in Progress'}
              {step === 'results' && 'Triage Assessment Results'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 'input' && (
            <div className="grid grid-cols-2 gap-6 p-6">
              {/* LEFT SIDE - Patient Context */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Patient Context (Read-Only)</h3>

                <div className="bg-[#0f1117] rounded-lg p-4 border border-gray-700">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-400">Name:</span> <span className="text-white font-medium">{patient.name}</span></div>
                    <div><span className="text-gray-400">ID:</span> <span className="text-white font-medium">{patient.id}</span></div>
                    <div><span className="text-gray-400">Age:</span> <span className="text-white font-medium">{patient.age}</span></div>
                    <div><span className="text-gray-400">Gender:</span> <span className="text-white font-medium">{patient.gender}</span></div>
                    <div><span className="text-gray-400">Blood Group:</span> <span className="text-white font-medium">{patient.bloodGroup}</span></div>
                  </div>
                </div>

                {patient.allergies && patient.allergies.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <h4 className="text-red-500 font-semibold">Known Allergies</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((allergy, idx) => (
                        <span key={idx} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <h4 className="text-orange-500 font-semibold mb-2">Chronic Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.chronicConditions.map((condition, idx) => (
                        <span key={idx} className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {patient.currentMedications && patient.currentMedications.length > 0 && (
                  <div className="bg-[#0f1117] rounded-lg p-4 border border-gray-700">
                    <h4 className="text-white font-semibold mb-2">Current Medications</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {patient.currentMedications.map((med, idx) => (
                        <li key={idx}>• {med}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {patient.triageReports && patient.triageReports.length > 0 && (
                  <div className="bg-[#0f1117] rounded-lg p-4 border border-gray-700">
                    <h4 className="text-white font-semibold mb-2">Last 2 Triage Reports</h4>
                    <div className="space-y-2">
                      {patient.triageReports.slice(0, 2).map((report, idx) => (
                        <div key={idx} className="text-sm border-l-2 border-purple-500 pl-3 py-1">
                          <div className="text-gray-400">{report.date}</div>
                          <div className="text-white">{report.chiefComplaint}</div>
                          <div className="text-gray-500">Severity: {report.severity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE - Current Visit Input */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Current Visit Input</h3>

                <div>
                  <label className="block text-white font-medium mb-2">Chief Complaint *</label>
                  <textarea
                    value={formData.chiefComplaint}
                    onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                    placeholder="Describe what brought patient in today..."
                    className="w-full bg-[#0f1117] text-white border border-gray-700 rounded-lg p-3 h-24 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <VitalsInput vitals={formData.vitals} onChange={handleVitalsChange} />

                <SymptomChecklist symptoms={formData.symptoms} onChange={handleSymptomsChange} />

                <div>
                  <label className="block text-white font-medium mb-2">Onset Time *</label>
                  <select
                    value={formData.onsetTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, onsetTime: e.target.value }))}
                    className="w-full bg-[#0f1117] text-white border border-gray-700 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select onset time...</option>
                    <option value="Just now">Just now</option>
                    <option value="< 1 hour">&lt; 1 hour</option>
                    <option value="1-6 hours">1-6 hours</option>
                    <option value="6-24 hours">6-24 hours</option>
                    <option value="> 24 hours">&gt; 24 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Additional Notes</label>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    placeholder="Any other observations, trauma history, recent travel..."
                    className="w-full bg-[#0f1117] text-white border border-gray-700 rounded-lg p-3 h-20 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="relative mb-8">
                <div className="w-32 h-32 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <Sparkles className="w-16 h-16 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>

              <div className="w-full max-w-md mb-6">
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
                </div>
              </div>

              <p className="text-2xl text-white font-semibold mb-2 animate-pulse">{loadingMessage}</p>
              <p className="text-gray-400">Please wait while AI analyzes the case...</p>
            </div>
          )}

          {step === 'results' && analysisResults && (
            <TriageResults
              results={analysisResults}
              patient={patient}
              formData={formData}
              onSave={handleSave}
              onReAnalyze={() => setStep('input')}
              onClose={handleClose}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-none" style={{
          background: '#0d0d1a',
          padding: '16px 24px',
          borderTop: '1px solid #2a2a3e',
          display: 'flex', gap: '12px'
        }}>
          {step === 'input' && (
            <button
              onClick={handleClose}
              style={{
                padding: '14px 24px',
                background: '#1a2a1a',
                color: '#9ca3af',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                fontSize: '14px', fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}

          {step !== 'results' && (
            <button
              onClick={handleAnalyze}
              disabled={step === 'analyzing'}
              style={{
                flex: 1, padding: '14px',
                background: step === 'analyzing' ? '#3a3a5e' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', border: 'none',
                borderRadius: '10px', fontSize: '16px',
                fontWeight: '700', cursor: step === 'analyzing' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px'
              }}
            >
              {step === 'analyzing' ? (
                <><span className="animate-spin">⟳</span> Analyzing...</>
              ) : (
                <> Analyze Patient</>
              )}
            </button>
          )}
          
          {step === 'results' && (
            <>
              <button
                onClick={() => setStep('input')}
                style={{
                  padding: '14px 24px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#9ca3af',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🔄 Re-Analyze
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '14px 24px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#9ca3af',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🖨️ Print
              </button>
              <button
                onClick={handleSave}
                disabled={!analysisResults}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: analysisResults ? '#059669' : '#1a2a1a',
                  color: analysisResults ? 'white' : '#4a6a4a',
                  border: 'none', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600',
                  cursor: analysisResults ? 'pointer' : 'not-allowed'
                }}
              >
                💾 Save Report & Download
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RunTriageModal;
