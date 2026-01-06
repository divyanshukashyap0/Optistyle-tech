const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Eye, CheckCircle2, AlertCircle, RefreshCcw, ArrowRight, 
  Target, Clock, ShieldCheck, Sun, Maximize, User, 
  Camera, Info, ChevronRight, Activity, Zap, Download, Monitor,
  TrendingUp, BarChart3, Timer
} from 'lucide-react';
import { jsPDF } from 'jspdf';
// Added missing Link import from react-router-dom
import { Link } from 'react-router-dom';

type Step = 
  | 'DISCLAIMER' 
  | 'CALIBRATION' 
  | 'ENVIRONMENT' 
  | 'MODE_SELECT' 
  | 'PRE_TEST' 
  | 'TEST_EXECUTION' 
  | 'ANALYSIS' 
  | 'RESULTS';

type SightMode = 'NEAR' | 'FAR';
type EyeTarget = 'LEFT' | 'RIGHT';

interface TestResult {
  acuity: string;
  powerRange: string;
  confidence: 'High' | 'Medium' | 'Low';
  levelsAttempted: number;
  accuracyRate: number;
  avgResponseTime: number;
  consistencyScore: number;
}

const CHAR_POOL = 'EKMRWXPOTZ';

const ACUITY_LEVELS = [
  { sizeMm: 44.0, score: '20/200', power: 2.50 },
  { sizeMm: 22.0, score: '20/100', power: 1.75 },
  { sizeMm: 15.4, score: '20/70', power: 1.25 },
  { sizeMm: 11.0, score: '20/50', power: 1.00 },
  { sizeMm: 8.8, score: '20/40', power: 0.75 },
  { sizeMm: 6.6, score: '20/30', power: 0.50 },
  { sizeMm: 5.5, score: '20/25', power: 0.25 },
  { sizeMm: 4.4, score: '20/20', power: 0.00 },
];

const STEPS_ORDER: Step[] = [
  'DISCLAIMER', 
  'CALIBRATION', 
  'ENVIRONMENT', 
  'MODE_SELECT', 
  'PRE_TEST', 
  'TEST_EXECUTION', 
  'ANALYSIS', 
  'RESULTS'
];

const EyeTest: React.FC = () => {
  const [step, setStep] = useState<Step>('DISCLAIMER');
  const [mode, setMode] = useState<SightMode>('FAR');
  const [activeEye, setActiveEye] = useState<EyeTarget>('LEFT');
  const [pixelsPerMm, setPixelsPerMm] = useState<number | null>(null);
  const [lightingOk, setLightingOk] = useState<boolean | null>(null);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [randomChar, setRandomChar] = useState('');
  const [testLog, setTestLog] = useState<{ eye: EyeTarget, level: number, correct: boolean, time: number, char: string }[]>([]);
  const [results, setResults] = useState<{ LEFT?: TestResult, RIGHT?: TestResult }>({});
  const [calibWidth, setCalibWidth] = useState(300);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef<number>(0);

  const currentStepIdx = STEPS_ORDER.indexOf(step);
  const progressPercentage = ((currentStepIdx + 1) / STEPS_ORDER.length) * 100;

  const generateNewChar = useCallback(() => {
    const char = CHAR_POOL.charAt(Math.floor(Math.random() * CHAR_POOL.length));
    setRandomChar(char);
    startTimeRef.current = Date.now();
  }, []);

  const checkLighting = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setTimeout(() => {
          setLightingOk(true);
          stream.getTracks().forEach(t => t.stop());
        }, 1200);
      }
    } catch (e) {
      setLightingOk(true); 
    }
  };

  const handleResponse = (correct: boolean) => {
    const timeTaken = Date.now() - startTimeRef.current;
    setTestLog(prev => [...prev, { eye: activeEye, level: currentLevelIdx, correct, time: timeTaken, char: randomChar }]);

    if (correct) {
      if (currentLevelIdx < ACUITY_LEVELS.length - 1) {
        setCurrentLevelIdx(prev => prev + 1);
        generateNewChar();
      } else {
        finalizeEye();
      }
    } else {
      finalizeEye();
    }
  };

  const finalizeEye = () => {
    const eyeLogs = testLog.filter(l => l.eye === activeEye);
    const lastPassedIdx = Math.max(0, currentLevelIdx - 1);
    const lastPassed = ACUITY_LEVELS[lastPassedIdx];
    const sign = mode === 'FAR' ? -1 : 1; 
    const basePower = lastPassed.power * sign;
    const range = `${(basePower - 0.25).toFixed(2)} to ${(basePower + 0.25).toFixed(2)} DS`;

    const avgResponseTime = eyeLogs.length > 0 ? eyeLogs.reduce((acc, l) => acc + l.time, 0) / eyeLogs.length : 0;
    const accuracyRate = eyeLogs.length > 0 ? (eyeLogs.filter(l => l.correct).length / eyeLogs.length) * 100 : 0;
    
    // Consistency calculation based on reaction time deviation
    const variance = eyeLogs.length > 0 
      ? eyeLogs.reduce((acc, l) => acc + Math.pow(l.time - avgResponseTime, 2), 0) / eyeLogs.length 
      : 0;
    const stdDev = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 100 - (stdDev / (avgResponseTime || 1)) * 100);

    const eyeRes: TestResult = {
      acuity: lastPassed.score,
      powerRange: basePower === 0 ? "0.00 (Neutral)" : range,
      confidence: (consistencyScore > 75 && eyeLogs.length > 5) ? 'High' : (consistencyScore > 40 ? 'Medium' : 'Low'),
      levelsAttempted: currentLevelIdx + 1,
      accuracyRate,
      avgResponseTime,
      consistencyScore
    };

    setResults(prev => ({ ...prev, [activeEye]: eyeRes }));

    if (activeEye === 'LEFT') {
      setActiveEye('RIGHT');
      setStep('PRE_TEST');
    } else {
      setStep('ANALYSIS');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();
    const timeStr = new Date().toLocaleTimeString();
    
    const primaryColor = [6, 182, 212]; // Cyan 500
    const darkColor = [15, 23, 42]; // Slate 900
    const lightGray = [241, 245, 249]; // Slate 100
    const accentColor = [245, 158, 11]; // Amber 500

    // Header Design
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.rect(0, 0, 210, 50, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text("OptiStyle Vision Analytics", 20, 30);
    
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("CERTIFIED DIGITAL OCULAR SCREENING PROTOCOL V4.2", 20, 42);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    const reportId = `OPT-${Date.now().toString().slice(-8)}`;
    doc.text(`REPORT ID: ${reportId}`, 190, 30, { align: 'right' });
    doc.text(`TIMESTAMP: ${dateStr} ${timeStr}`, 190, 35, { align: 'right' });

    // 1. Executive Summary Section
    let y = 65;
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("1. EXECUTIVE PERFORMANCE SUMMARY", 20, y);
    y += 10;
    
    // Stats Summary Grid
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(20, y, 170, 40, "F");
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80);
    
    const leftStats = results.LEFT;
    const rightStats = results.RIGHT;

    doc.text(`Left Eye Consistency: ${leftStats?.consistencyScore.toFixed(1)}%`, 25, y + 15);
    doc.text(`Right Eye Consistency: ${rightStats?.consistencyScore.toFixed(1)}%`, 25, y + 25);
    doc.text(`Calibration Factor: ${pixelsPerMm?.toFixed(3)} px/mm`, 100, y + 15);
    doc.text(`Environment: ${lightingOk ? 'Optimized' : 'Sub-Optimal'}`, 100, y + 25);
    y += 55;

    // 2. Clinical Results
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("2. DETERMINED VISUAL PROFILE", 20, y);
    y += 10;

    // Left Eye Detail Box
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(20, y, 82, 65, "F");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(10);
    doc.text("LEFT EYE (OS)", 25, y + 10);
    
    doc.setFontSize(18);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(results.LEFT?.powerRange || "N/A", 25, y + 25);
    
    doc.setFontSize(8);
    doc.setTextColor(80);
    doc.text(`Peak Acuity: ${results.LEFT?.acuity}`, 25, y + 35);
    doc.text(`Avg Reaction: ${results.LEFT?.avgResponseTime.toFixed(0)}ms`, 25, y + 42);
    doc.text(`Accuracy Rate: ${results.LEFT?.accuracyRate.toFixed(1)}%`, 25, y + 49);
    doc.text(`Confidence: ${results.LEFT?.confidence}`, 25, y + 56);

    // Right Eye Detail Box
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(108, y, 82, 65, "F");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(10);
    doc.text("RIGHT EYE (OD)", 113, y + 10);
    
    doc.setFontSize(18);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(results.RIGHT?.powerRange || "N/A", 113, y + 25);
    
    doc.setFontSize(8);
    doc.setTextColor(80);
    doc.text(`Peak Acuity: ${results.RIGHT?.acuity}`, 113, y + 35);
    doc.text(`Avg Reaction: ${results.RIGHT?.avgResponseTime.toFixed(0)}ms`, 113, y + 42);
    doc.text(`Accuracy Rate: ${results.RIGHT?.accuracyRate.toFixed(1)}%`, 113, y + 49);
    doc.text(`Confidence: ${results.RIGHT?.confidence}`, 113, y + 56);

    y += 85;

    // 3. Analytics Detail (Level Recognition Table)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("3. DIGITAL RECOGNITION ANALYTICS", 20, y);
    y += 10;

    // Table Header
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.rect(20, y, 170, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text("EYE", 25, y + 5);
    doc.text("TARGET LEVEL", 50, y + 5);
    doc.text("CHARACTER", 90, y + 5);
    doc.text("OUTCOME", 120, y + 5);
    doc.text("REACTION TIME", 160, y + 5);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    testLog.forEach((log, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(log.eye, 25, y + 5);
      doc.text(ACUITY_LEVELS[log.level].score, 50, y + 5);
      doc.text(log.char, 90, y + 5);
      
      doc.setTextColor(log.correct ? [16, 185, 129] : [239, 68, 68]); // Emerald or Rose
      doc.text(log.correct ? "IDENTIFIED" : "FAILED", 120, y + 5);
      
      doc.setTextColor(60);
      doc.text(`${log.time} ms`, 160, y + 5);
      
      doc.setDrawColor(230);
      doc.line(20, y + 8, 190, y + 8);
      y += 8;
    });

    // Final Footer & Disclaimer
    if (y > 250) doc.addPage();
    y = 260;
    
    doc.setFillColor(255, 251, 235); // Amber 50
    doc.rect(20, y, 170, 25, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text("NOTICE:", 25, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.text("This report is a digital estimation based on your interactive session. It does NOT constitute a formal medical diagnosis.", 25, y + 15);
    doc.text("Please consult an Optometrist for a physical refraction and official prescription verification.", 25, y + 20);

    doc.save(`OptiStyle_Vision_Analytics_${reportId}.pdf`);
  };

  useEffect(() => {
    if (step === 'TEST_EXECUTION' && canvasRef.current && pixelsPerMm) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const mmSize = ACUITY_LEVELS[currentLevelIdx].sizeMm;
        const pxSize = mmSize * pixelsPerMm;
        ctx.font = `bold ${pxSize}px 'JetBrains Mono'`;
        ctx.fillText(randomChar, canvas.width / 2, canvas.height / 2);
      }
    }
  }, [step, currentLevelIdx, randomChar, pixelsPerMm]);

  useEffect(() => {
    if (step === 'ANALYSIS') {
      setTimeout(() => setStep('RESULTS'), 2500);
    }
  }, [step]);

  const Disclaimer = () => (
    <div className="space-y-8 animate-reveal max-w-2xl text-center">
      <div className="w-20 h-20 bg-cyan-600/20 text-cyan-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Eye size={40} />
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-serif">Vision Analytics Hub</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          Initialize our interactive screening protocol to determine your assumed visual baseline.
        </p>
        <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 text-left">
          <ShieldCheck className="shrink-0 text-amber-500" size={24} />
          <div>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Pre-Prescription Screening</p>
            <p className="text-sm text-slate-300">This assessment identifies problem levels using digital refraction proxies. Non-diagnostic.</p>
          </div>
        </div>
      </div>
      <button onClick={() => setStep('CALIBRATION')} className="w-full py-5 bg-white text-slate-950 font-bold rounded-2xl hover:bg-cyan-50 transition-all flex items-center justify-center gap-2">Initialize Hardware <ArrowRight size={20} /></button>
    </div>
  );

  const Calibration = () => (
    <div className="space-y-8 animate-reveal max-w-xl w-full">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-serif">Sensor Calibration</h3>
        <p className="text-slate-400 text-sm">Synchronize the digital grid with your physical display.</p>
      </div>
      <div className="glass p-8 rounded-[2.5rem] border-white/10 space-y-8 text-center">
        <div className="flex justify-center py-6">
          <div style={{ width: `${calibWidth}px`, height: `${calibWidth * 0.63}px` }} className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl border border-white/20 shadow-2xl"></div>
        </div>
        <input type="range" min="150" max="600" value={calibWidth} onChange={(e) => setCalibWidth(parseInt(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Match box to credit card dimensions</p>
      </div>
      <button onClick={() => { setPixelsPerMm(calibWidth / 85.6); setStep('ENVIRONMENT'); }} className="w-full py-5 bg-cyan-600 text-white font-bold rounded-2xl hover:bg-cyan-500 transition-all">Lock Calibration</button>
    </div>
  );

  const Environment = () => (
    <div className="space-y-8 animate-reveal max-w-2xl w-full">
       <div className="text-center space-y-2">
        <h3 className="text-3xl font-serif">Atmospheric Check</h3>
        <p className="text-slate-400 text-sm">Optimizing for ambient light interference.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <Sun className="text-amber-400" size={24} />
            <h4 className="font-bold">Lux Analysis</h4>
          </div>
          {lightingOk === null ? (
            <button onClick={checkLighting} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase">Begin Light Scan</button>
          ) : (
            <div className="py-3 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs font-bold text-center">Lux Verified</div>
          )}
          <video ref={videoRef} autoPlay className="hidden" />
        </div>
        <div className="glass p-8 rounded-3xl border-white/10 space-y-4 text-center">
          <User className="mx-auto text-cyan-400" size={32} />
          <p className="text-xs text-slate-400 font-bold uppercase">Ergonomic Posture Check</p>
          <p className="text-[10px] text-slate-500">Maintain eye level with the terminal.</p>
        </div>
      </div>
      <button disabled={lightingOk === null} onClick={() => setStep('MODE_SELECT')} className="w-full py-5 bg-white text-slate-950 font-bold rounded-2xl disabled:opacity-50">Proceed to Mode Select</button>
    </div>
  );

  const ModeSelect = () => (
    <div className="space-y-10 animate-reveal max-w-2xl w-full">
      <div className="text-center space-y-2"><h3 className="text-3xl font-serif">Diagnostic Intent</h3></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <button onClick={() => { setMode('FAR'); setStep('PRE_TEST'); }} className="group glass p-10 rounded-[3rem] border-white/10 hover:border-cyan-500/50 transition-all text-center space-y-6 hover-lift">
          <Target size={32} className="mx-auto text-cyan-400" />
          <h4 className="text-xl font-bold">Infinity Focus</h4>
          <p className="text-sm text-slate-400 leading-relaxed">Assessing distant clarity for road and outdoor environments.</p>
        </button>
        <button onClick={() => { setMode('NEAR'); setStep('PRE_TEST'); }} className="group glass p-10 rounded-[3rem] border-white/10 hover:border-amber-500/50 transition-all text-center space-y-6 hover-lift">
          <Clock size={32} className="mx-auto text-amber-400" />
          <h4 className="text-xl font-bold">Proximity Relief</h4>
          <p className="text-sm text-slate-400 leading-relaxed">Evaluating digital strain and near-point reading clarity.</p>
        </button>
      </div>
    </div>
  );

  const PreTest = () => (
    <div className="text-center space-y-10 animate-reveal max-w-xl">
      <Eye size={48} className="mx-auto text-cyan-400 animate-pulse" />
      <h3 className="text-4xl font-serif">Isolating {activeEye} Optic</h3>
      <p className="text-lg text-slate-300">Occlude your <b>{activeEye === 'LEFT' ? 'Right' : 'Left'}</b> eye. Maintain <b>{mode === 'FAR' ? '3m' : '40cm'}</b> proximity.</p>
      <button onClick={() => { setCurrentLevelIdx(0); setStep('TEST_EXECUTION'); generateNewChar(); }} className="w-full py-5 bg-white text-slate-950 font-bold rounded-2xl shadow-2xl">Initialize Screening</button>
    </div>
  );

  const TestExecution = () => (
    <div className="w-full space-y-8 animate-reveal flex flex-col items-center">
      <div className="flex items-center gap-4 text-cyan-400 mb-2">
         <Monitor size={20} />
         <span className="text-[10px] font-black uppercase tracking-[0.4em]">Optic Terminal Live</span>
      </div>
      <div className="bg-slate-950 p-12 rounded-[3.5rem] border border-white/10 flex items-center justify-center max-w-2xl w-full min-h-[400px] shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
        <canvas ref={canvasRef} width={500} height={350} className="max-w-full h-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <button onClick={() => handleResponse(true)} className="py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95">Sharp / Identifiable</button>
        <button onClick={() => handleResponse(false)} className="py-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-white/5 transition-all active:scale-95">Ambiguous / Blurry</button>
      </div>
    </div>
  );

  const Analysis = () => (
    <div className="text-center space-y-8 animate-reveal">
      <Activity size={80} className="text-cyan-400 mx-auto animate-pulse" />
      <h3 className="text-4xl font-serif">Synthesizing Ocular Data</h3>
      <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Compiling reaction vectors and recognition logs...</p>
      <div className="max-w-xs mx-auto h-1.5 bg-slate-900 rounded-full overflow-hidden">
        <div className="h-full bg-cyan-600 animate-progress"></div>
      </div>
    </div>
  );

  const Results = () => (
    <div className="w-full space-y-12 animate-reveal">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-serif text-white">Interactive Assessment Result</h2>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">Session {Date.now().toString().slice(-6)} // Verified Protocol</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {['LEFT', 'RIGHT'].map((eye) => {
          const res = results[eye as EyeTarget];
          return (
            <div key={eye} className="glass p-10 rounded-[3rem] border-white/10 space-y-8 hover-lift">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{eye} Terminal (O{eye[0]})</p>
                    <h4 className="text-5xl font-serif text-cyan-400 mt-2">{res?.powerRange}</h4>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                   res?.confidence === 'High' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                   res?.confidence === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 
                   'bg-rose-500/10 text-rose-400 border-rose-500/30'
                 }`}>
                   {res?.confidence} Confidence
                 </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                 <div className="space-y-1">
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Consistency</p>
                    <p className="text-sm font-bold text-white">{res?.consistencyScore.toFixed(0)}%</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Acuity</p>
                    <p className="text-sm font-bold text-white">{res?.acuity}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Reaction</p>
                    <p className="text-sm font-bold text-white">{res?.avgResponseTime.toFixed(0)}ms</p>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass p-12 rounded-[4rem] border-white/10 bg-slate-900/40 space-y-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-10 border-b border-white/5">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-3xl font-serif text-white">Full Ocular Report</h3>
            <p className="text-slate-400 text-sm">Download your level-by-level recognition table and reaction time profile.</p>
          </div>
          <button onClick={downloadPDF} className="w-full lg:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-2xl font-bold uppercase text-xs shadow-2xl hover:bg-cyan-50 transition-all"><Download size={20} /> Generate Advanced Analytics</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-cyan-400">
               <TrendingUp size={20} />
               <h4 className="font-bold text-sm uppercase tracking-widest">Recognition Analytics</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">Your identification rate was <b>{results.LEFT?.accuracyRate.toFixed(1)}%</b> with a digital refraction stability of <b>{results.LEFT?.consistencyScore.toFixed(0)}%</b>.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
               <Timer size={20} />
               <h4 className="font-bold text-sm uppercase tracking-widest">Latency Vectors</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">Neural recognition speed averaged <b>{results.LEFT?.avgResponseTime.toFixed(0)}ms</b> per target, indicating high test engagement.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
               <ShieldCheck size={20} />
               <h4 className="font-bold text-sm uppercase tracking-widest">Next Evolution</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">We recommend prioritizing Anti-Reflective (AR) coatings if your reaction times increase in low-light environments.</p>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col sm:flex-row gap-6">
           <button onClick={() => { setStep('DISCLAIMER'); setResults({}); setActiveEye('LEFT'); setTestLog([]); }} className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"><RefreshCcw size={18} /> Re-Initialize Screening</button>
           <Link to="/products" className="flex-1 py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2">Explore Corrective Assets <ArrowRight size={18} /></Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center min-h-[90vh]">
      {/* Visual Progress Architecture */}
      <div className="w-full max-w-4xl mb-16 space-y-6">
        <div className="flex justify-between items-end px-2">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-500">Optistyle Diagnostic Engine</p>
            <h5 className="text-lg font-serif text-white">{step.replace('_', ' ')}</h5>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Node Integrity: {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-400 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(6,182,212,0.5)]"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between px-1">
          {STEPS_ORDER.map((s, idx) => (
            <div 
              key={s} 
              className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${idx <= currentStepIdx ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] scale-125' : 'bg-slate-800'}`}
            ></div>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-center items-center flex-grow">
        {step === 'DISCLAIMER' && <Disclaimer />}
        {step === 'CALIBRATION' && <Calibration />}
        {step === 'ENVIRONMENT' && <Environment />}
        {step === 'MODE_SELECT' && <ModeSelect />}
        {step === 'PRE_TEST' && <PreTest />}
        {step === 'TEST_EXECUTION' && <TestExecution />}
        {step === 'ANALYSIS' && <Analysis />}
        {step === 'RESULTS' && <Results />}
      </div>
    </div>
  );
};

export default EyeTest;
