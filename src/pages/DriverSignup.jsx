import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Lock, EyeOff, Eye, Car, CreditCard, ChevronRight, CheckCircle, Navigation, ShieldCheck, FileText, Camera, Check } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
import Button from '../components/Button';
import './Auth.css';

const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:'))
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_BACKEND_URL || 'https://hum-fleet-api.onrender.com');

const getBackendUrl = () => { return API_BASE; };

const DriverSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Personal, 2: Vehicle, 3: Photos, 4: Documents, 5: Face Verification, 6: Bank

  // Step 1: Personal Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isDriverOnly, setIsDriverOnly] = useState(false);
  const [languages, setLanguages] = useState([]);

  // Step 2: Vehicle Details
  const [manufacturer, setManufacturer] = useState('');
  const [customManufacturer, setCustomManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState('');
  const [modelsList, setModelsList] = useState([]);
  const [vehicleCatalog, setVehicleCatalog] = useState({});

  useEffect(() => {
    fetch(`${getBackendUrl()}/api/vehicles/catalog`)
      .then(res => res.json())
      .then(data => setVehicleCatalog(data))
      .catch(err => console.error("Error fetching vehicle catalog:", err));
  }, []);
  const [ratePerKm, setRatePerKm] = useState('15.00');
  const [ratePerHour, setRatePerHour] = useState('120.00');
  const [isPinkVehicle, setIsPinkVehicle] = useState(false);

  // Step 3: Photos (Base64 data)
  const [photos, setPhotos] = useState({
    front: null,
    rear: null,
    left: null,
    right: null,
    inside: null
  });

  // Step 4: Documents (Base64 data)
  const [docs, setDocs] = useState({
    pollution: null,
    rc: null,
    insurance: null,
    fitness: null,
    licenseFront: null,
    licenseBack: null,
    aadharFront: null,
    aadharBack: null
  });

  // Step 5: Live Face Verification (Camera Capture Base64 data)
  const [facePhoto, setFacePhoto] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Step 6: Indian Bank Details
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [holderName, setHolderName] = useState('');

  // Camera Management Helpers for Live Face Verification
  const startRegistrationCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      setCameraStream(stream);
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Could not access camera for live face verification. Please allow camera permissions.');
    }
  };

  const stopRegistrationCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureFaceSelfie = () => {
    const videoEl = document.getElementById('reg-face-video');
    if (!videoEl) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth || 640;
    canvas.height = videoEl.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setFacePhoto(dataUrl);
    stopRegistrationCamera();
  };

  // Populate models list based on manufacturer
  useEffect(() => {
    if (manufacturer && manufacturer !== 'Other') {
      setModelsList(vehicleCatalog[manufacturer] || []);
      setModel(''); // Reset model selection
    } else {
      setModelsList([]);
      setModel('');
    }
  }, [manufacturer, vehicleCatalog]);

  // Handle Photo selection and conversion to Base64
  const handlePhotoChange = async (side, file) => {
    if (file) {
      try {
        const base64 = await compressImage(file);
        setPhotos(prev => ({
          ...prev,
          [side]: base64
        }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Handle Document selection and conversion
  const handleDocChange = async (docType, file) => {
    if (file) {
      try {
        let base64 = '';
        if (file.type === 'application/pdf') {
          // Read PDF directly to Base64 without image compression
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
        } else {
          base64 = await compressImage(file);
        }
        setDocs(prev => ({
          ...prev,
          [docType]: base64
        }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (password !== confirmPassword) {
        setValidationError("Passwords do not match!");
        return;
      }
      setValidationError('');
      if (isDriverOnly) {
        setStep(4);
        return;
      }
    }

    if (step === 2) {
      // Step 2 validation logic if needed (e.g. check plate number)
      // Note: Rate validation has been removed from signup as drivers inherit category defaults.
    }

    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (step === 4 && isDriverOnly) {
      setStep(1);
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!facePhoto) {
      alert('Please complete Live Face Verification before submitting your application.');
      setStep(5);
      return;
    }

    const driverData = {
      name,
      email,
      phone: `+91 ${phone}`,
      password,
      manufacturer: customManufacturer || manufacturer,
      model: customModel || model,
      year,
      plate,
      vehicleCategory,
      ratePerKm,
      ratePerHour,
      isPinkVehicle,
      isDriverOnly,
      languages,
      licenseNumber,
      photos,
      docs,
      facePhoto,
      profilePic: facePhoto,
      bank: {
        bankName,
        accountNumber,
        ifscCode,
        holderName
      }
    };

    try {
      const response = await fetch(`${getBackendUrl()}/api/drivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(driverData)
      });
      if (response.ok) {
        localStorage.setItem('driverEmail', email);
        navigate('/driver');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit application.');
      }
    } catch (err) {
      console.error('Error submitting to backend:', err);
      alert('Failed to connect to registration server. Please verify the server is running.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card animate-fade-in" style={{ maxWidth: '550px' }}>
        <div className="auth-header">
          <h2>Apply to Drive</h2>
          <p>Step {step} of 6: {
            step === 1 ? 'Personal Info' : 
            step === 2 ? 'Vehicle Info' : 
            step === 3 ? 'Vehicle Photos' : 
            step === 4 ? 'Vehicle Documents' :
            step === 5 ? 'Face Verification' :
            'Bank Details'
          }</p>
          
          {/* Step indicator dots */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: step >= 1 ? 'var(--primary)' : 'var(--border)' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: step >= 2 ? 'var(--primary)' : 'var(--border)' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: step >= 3 ? 'var(--primary)' : 'var(--border)' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: step >= 4 ? 'var(--primary)' : 'var(--border)' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: step >= 5 ? 'var(--primary)' : 'var(--border)' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: step >= 6 ? 'var(--primary)' : 'var(--border)' }}></span>
          </div>
        </div>

        {step === 1 && (
          <form className="auth-form" onSubmit={handleNextStep}>
            {validationError && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.2)', 
                borderRadius: '8px', 
                padding: '10px 14px', 
                color: '#ef4444', 
                fontSize: '14px', 
                marginBottom: '14px' 
              }}>
                {validationError}
              </div>
            )}
            <div className="input-group">
              <div className="input-icon"><User size={18} /></div>
              <input 
                type="text" 
                className="input-field with-icon" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <div className="input-icon"><Mail size={18} /></div>
              <input 
                type="email" 
                className="input-field with-icon" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', height: '48px' }}>
                <span className="input-field" style={{ width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.05)', fontWeight: 'bold', padding: 0 }}>
                  +91
                </span>
                <div style={{ position: 'relative', flex: 1 }}>
                  <div className="input-icon"><Phone size={18} /></div>
                  <input 
                    type="tel" 
                    className="input-field with-icon" 
                    placeholder="98765 43210" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="input-group" style={{ position: 'relative' }}>
              <div className="input-icon"><Lock size={18} /></div>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field with-icon" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="input-group" style={{ position: 'relative' }}>
              <div className="input-icon"><Lock size={18} /></div>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field with-icon" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Languages Known</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                {['English', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Arabic'].map(lang => (
                  <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={languages.includes(lang)}
                      onChange={(e) => {
                        if (e.target.checked) setLanguages([...languages, lang]);
                        else setLanguages(languages.filter(l => l !== lang));
                      }}
                      style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px', background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', color: 'var(--primary)' }}>
                <input 
                  type="checkbox" 
                  checked={isDriverOnly} 
                  onChange={(e) => setIsDriverOnly(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <span>👨‍✈️ Register as Driver Only (No Vehicle)</span>
              </label>
              <p style={{ margin: '6px 0 0 28px', fontSize: '11px', color: 'var(--text-muted)' }}>
                Select this if you do not have your own vehicle and only wish to drive passenger's vehicles. You will skip vehicle registration steps.
              </p>
            </div>
            <Button variant="primary" type="submit" className="full-width" style={{ marginTop: '16px' }}>
              Continue
            </Button>
          </form>
        )}

        {step === 2 && (
          <form className="auth-form" onSubmit={handleNextStep}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Vehicle Category</label>
              <select 
                className="input-field" 
                value={vehicleCategory}
                onChange={(e) => setVehicleCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="🛺 Auto Rickshaw">🛺 Auto Rickshaw</option>
                <option value="🚙 Mini / Hatchback">🚙 Mini / Hatchback</option>
                <option value="🚘 Sedan (AC)">🚘 Sedan (AC)</option>
                <option value="🚐 SUV / XL (6 Seater)">🚐 SUV / XL (6 Seater)</option>
                <option value="⚡ EV Green Cab (Eco)">⚡ EV Green Cab (Eco)</option>
                <option value="💎 Premium / Luxury">💎 Premium / Luxury</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Manufacturer</label>
                <select 
                  className="input-field" 
                  value={manufacturer}
                  onChange={(e) => {
                    setManufacturer(e.target.value);
                    if (e.target.value === 'Other') {
                      setModel('Other');
                    } else {
                      setModel('');
                    }
                  }}
                  required
                >
                  <option value="">Select Brand</option>
                  {Object.keys(vehicleCatalog).map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {manufacturer === 'Other' && (
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter Manufacturer"
                    value={customManufacturer}
                    onChange={(e) => setCustomManufacturer(e.target.value)}
                    style={{ marginTop: '8px' }}
                    required
                  />
                )}
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Model</label>
                <select 
                  className="input-field" 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!manufacturer || manufacturer === 'Other'}
                  required
                >
                  <option value="">Select Model</option>
                  {modelsList.map(mod => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {model === 'Other' && (
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter Model"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    style={{ marginTop: '8px' }}
                    required
                  />
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Registration Plate No.</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. DL3CAY4567" 
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase().replace(/\s/g, ''))}
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Year of Manufacture</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="e.g. 2023" 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2010"
                  max="2026"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px', background: 'rgba(236, 72, 153, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', color: '#ec4899' }}>
                <input 
                  type="checkbox" 
                  checked={isPinkVehicle} 
                  onChange={(e) => setIsPinkVehicle(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ec4899' }}
                />
                <span>🌸 Register as a Pink Vehicle (Female Driver)</span>
              </label>
              <p style={{ margin: '6px 0 0 28px', fontSize: '11px', color: 'var(--text-muted)' }}>
                This allows female passengers to specifically request you for a safer and more comfortable ride experience.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <Button variant="outline" type="button" onClick={handlePrevStep} className="full-width">
                Back
              </Button>
              <Button variant="primary" type="submit" className="full-width">
                Continue
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form className="auth-form" onSubmit={handleNextStep}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Please upload high-quality photos of your vehicle. Photos must be clear and under 5MB.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {[
                { id: 'front', label: 'Front view' },
                { id: 'rear', label: 'Rear view' },
                { id: 'left', label: 'Left Side' },
                { id: 'right', label: 'Right Side' },
                { id: 'inside', label: 'Inside Cabin' }
              ].map((side) => (
                <div key={side.id} className="photo-upload-box" style={{ 
                  border: '2px dashed var(--border)', 
                  borderRadius: '12px', 
                  padding: photos[side.id] ? '8px' : '16px', 
                  textAlign: 'center', 
                  position: 'relative', 
                  cursor: 'pointer',
                  background: photos[side.id] ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                  borderColor: photos[side.id] ? 'var(--primary)' : 'var(--border)',
                  minHeight: '116px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    id={`photo-${side.id}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                    onChange={(e) => handlePhotoChange(side.id, e.target.files[0])}
                    required
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
                    {photos[side.id] ? (
                      <>
                        <img src={photos[side.id]} alt={side.label} style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>
                          {side.label} Loaded
                        </span>
                      </>
                    ) : (
                      <>
                        <Camera size={20} color="var(--text-muted)" />
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                          {side.label}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button variant="outline" type="button" onClick={handlePrevStep} className="full-width">
                Back
              </Button>
              <Button variant="primary" type="submit" className="full-width">
                Continue
              </Button>
            </div>
          </form>
        )}

        {step === 4 && (
          <form className="auth-form" onSubmit={handleNextStep}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Please enter your licence details and upload compliance documents. JPEG or PDF format is accepted.
            </p>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Driving Licence Number</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Enter DL number (e.g. DL1420110012345)"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {[
                { id: 'licenseFront', label: 'Licence (Front Side)' },
                { id: 'licenseBack', label: 'Licence (Back Side)' },
                ...(!isDriverOnly ? [
                  { id: 'rc', label: 'Registration (RC)' },
                  { id: 'pollution', label: 'Pollution (PUC)' },
                  { id: 'insurance', label: 'Insurance Policy' },
                  { id: 'fitness', label: 'Fitness Certificate' }
                ] : [])
              ].map((doc) => (
                <div key={doc.id} className="photo-upload-box" style={{ 
                  border: '2px dashed var(--border)', 
                  borderRadius: '12px', 
                  padding: docs[doc.id] ? '8px' : '16px', 
                  textAlign: 'center', 
                  position: 'relative', 
                  cursor: 'pointer',
                  background: docs[doc.id] ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                  borderColor: docs[doc.id] ? 'var(--primary)' : 'var(--border)',
                  minHeight: '116px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <input 
                    type="file" 
                    accept="image/*,application/pdf"
                    id={`doc-${doc.id}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                    onChange={(e) => handleDocChange(doc.id, e.target.files[0])}
                    required
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
                    {docs[doc.id] ? (
                      <>
                        {docs[doc.id].startsWith('data:image') ? (
                          <img src={docs[doc.id]} alt={doc.label} style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <Check size={20} color="var(--primary)" />
                        )}
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                          {doc.label} Loaded
                        </span>
                      </>
                    ) : (
                      <>
                        <FileText size={20} color="var(--text-muted)" />
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                          {doc.label}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <Button variant="outline" type="button" onClick={handlePrevStep} className="full-width">
                Back
              </Button>
              <Button variant="primary" type="submit" className="full-width">
                Continue
              </Button>
            </div>
          </form>
        )}

        {step === 5 && (
          <div className="auth-form">
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', textAlign: 'center' }}>
              Position your face clearly inside the oval guide frame and take a live verification selfie.
            </p>

            {/* Camera / Captured Face View Box */}
            <div style={{ position: 'relative', width: '240px', height: '240px', margin: '0 auto 20px auto', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--primary)', background: '#000', boxShadow: '0 4px 20px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {facePhoto ? (
                <img src={facePhoto} alt="Captured Face Selfie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : isCameraActive ? (
                <>
                  <video 
                    id="reg-face-video" 
                    autoPlay 
                    playsInline 
                    muted 
                    ref={(el) => { if (el && cameraStream) el.srcObject = cameraStream; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {/* Facial Alignment Guides */}
                  <div style={{ position: 'absolute', inset: '15px', border: '2px dashed #10b981', borderRadius: '50%', pointerEvents: 'none', opacity: 0.8 }}></div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <Camera size={44} color="var(--primary)" />
                  <span style={{ fontSize: '12px' }}>Camera Idle</span>
                </div>
              )}
            </div>

            {/* Camera Control Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
              {!isCameraActive && !facePhoto && (
                <Button variant="primary" type="button" onClick={startRegistrationCamera} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={18} /> Open Camera
                </Button>
              )}

              {isCameraActive && (
                <Button variant="primary" type="button" onClick={captureFaceSelfie} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={18} /> Capture Live Selfie
                </Button>
              )}

              {facePhoto && (
                <Button variant="outline" type="button" onClick={() => { setFacePhoto(null); startRegistrationCamera(); }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={18} /> Retake Photo
                </Button>
              )}
            </div>

            {facePhoto && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '10px', textAlign: 'center', color: '#10b981', fontSize: '13px', fontWeight: '700', marginBottom: '16px' }}>
                ✓ Live Face Selfie Verified & Loaded!
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" type="button" onClick={() => { stopRegistrationCamera(); handlePrevStep(); }} className="full-width">
                Back
              </Button>
              <Button 
                variant="primary" 
                type="button" 
                onClick={() => {
                  if (!facePhoto) {
                    alert('Please capture a live face verification selfie before continuing.');
                    return;
                  }
                  stopRegistrationCamera();
                  setStep(6);
                }} 
                className="full-width"
              >
                Continue to Bank Details
              </Button>
            </div>
          </div>
        )}

        {step === 6 && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Please enter your Indian bank account details to enable platform payouts.
            </p>
            
            <div className="input-group">
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Bank Name</span>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. State Bank of India" 
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Account Holder Name</span>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Name as in Bank Passbook" 
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1, margin: 0 }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Account Number</span>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="11 to 16 digits" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1, margin: 0 }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>IFSC Code</span>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. SBIN0001234" 
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase().slice(0, 11))}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button variant="outline" type="button" onClick={handlePrevStep} className="full-width">
                Back
              </Button>
              <Button variant="primary" type="submit" className="full-width">
                Submit Application
              </Button>
            </div>
          </form>
        )}

        {step === 1 && (
          <div className="auth-footer">
            Already registered? <Link to="/driver/login" className="auth-link">Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverSignup;
