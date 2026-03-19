import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UserPlus } from 'lucide-react';

export default function AddPatientModal({ isOpen, onClose, onAddPatient }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    address: '',
    ecName: '',
    ecRelation: '',
    ecPhone: '',
    allergies: '',
    chronicConditions: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a new ID like P007
    const newId = `P${Math.floor(Math.random() * 900) + 100}`;
    
    const newPatient = {
      id: newId,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      address: formData.address,
      password: "pat123",
      role: "patient",
      medicalHistory: {
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
        chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(s => s.trim()) : [],
        currentMedications: [],
        pastSurgeries: [],
        familyHistory: []
      },
      emergencyContact: {
        name: formData.ecName,
        relation: formData.ecRelation,
        phone: formData.ecPhone
      },
      triageReports: [],
      labReports: []
    };

    onAddPatient(newPatient);
    onClose();
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    color: '#9ca3af',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '6px'
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1a1d29] rounded-2xl w-full max-w-2xl shadow-2xl border border-purple-500/20 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4 flex-none flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Add New Patient</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="add-patient-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-indigo-400 font-semibold text-sm border-b border-indigo-500/30 pb-2">Basic Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input required type="text" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label style={labelStyle}>Age</label>
                  <input required type="number" style={inputStyle} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="e.g. 35" />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select style={inputStyle} value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Blood Group</label>
                  <select style={inputStyle} value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>AB+</option><option>AB-</option>
                    <option>O+</option><option>O-</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label style={labelStyle}>Phone Number</label>
                  <input required type="text" style={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 90000 00000" />
                </div>
                <div className="col-span-2">
                  <label style={labelStyle}>Address</label>
                  <input required type="text" style={inputStyle} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Full residential address" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-indigo-400 font-semibold text-sm border-b border-indigo-500/30 pb-2">Medical Overview (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label style={labelStyle}>Allergies (comma separated)</label>
                  <input type="text" style={inputStyle} value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} placeholder="e.g. Peanuts, Penicillin" />
                </div>
                <div className="col-span-2">
                  <label style={labelStyle}>Chronic Conditions (comma separated)</label>
                  <input type="text" style={inputStyle} value={formData.chronicConditions} onChange={e => setFormData({...formData, chronicConditions: e.target.value})} placeholder="e.g. Hypertension, Diabetes" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-indigo-400 font-semibold text-sm border-b border-indigo-500/30 pb-2">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Contact Name</label>
                  <input required type="text" style={inputStyle} value={formData.ecName} onChange={e => setFormData({...formData, ecName: e.target.value})} placeholder="e.g. Jane Doe" />
                </div>
                <div>
                  <label style={labelStyle}>Relation</label>
                  <input required type="text" style={inputStyle} value={formData.ecRelation} onChange={e => setFormData({...formData, ecRelation: e.target.value})} placeholder="e.g. Wife" />
                </div>
                <div className="col-span-2">
                  <label style={labelStyle}>Contact Phone number</label>
                  <input required type="text" style={inputStyle} value={formData.ecPhone} onChange={e => setFormData({...formData, ecPhone: e.target.value})} placeholder="+91 90000 00000" />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex-none p-4 bg-[#0d0d1a] border-t border-[#2a2a3e] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:bg-white/5 border border-white/10 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-patient-form"
            className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition shadow-lg shadow-green-900/20"
          >
            ✓ Save Patient
          </button>
        </div>
      </motion.div>
    </div>
  );
}
