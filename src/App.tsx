import { useState } from 'react';
import Assessment from './components/Assessment';
import Report from './components/Report';
import CsvUpload from './components/CsvUpload';
import GoogleFormSetup from './components/GoogleFormSetup';
import LandingPage from './components/LandingPage';
import { UserResponses, Scores } from './types';
import { calculateScores } from './lib/scoring';
import { SAMPLE_SCORES, SAMPLE_RESPONSES } from './data/sampleReport';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Star, Compass, Anchor, Target, Heart, Shield, Zap, BookOpen, ChevronDown, Users, Brain, Quote, Map, Clock, AlertTriangle, Home } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'assessment' | 'report' | 'csv_upload' | 'google_form_setup'>('landing');
  const [responses, setResponses] = useState<UserResponses>({});
  const [scores, setScores] = useState<Scores | null>(null);
  const [userName, setUserName] = useState<string>('');

  const handleStart = () => {
    setView('assessment');
  };

  const handleCsvUpload = () => {
    setView('csv_upload');
  };

  const handleGoogleFormSetup = () => {
    setView('google_form_setup');
  };

  const handleComplete = (userResponses: UserResponses) => {
    setResponses(userResponses);
    const calculatedScores = calculateScores(userResponses);
    setScores(calculatedScores);
    setView('report');
  };

  const handleCsvUserSelect = (userResponses: UserResponses, name: string) => {
    setUserName(name);
    handleComplete(userResponses);
  };

  const handleSampleReport = () => {
    setScores(SAMPLE_SCORES);
    setResponses(SAMPLE_RESPONSES);
    setView('report');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 relative">
      
      {/* Global Home Button */}
      {view !== 'landing' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setView('landing');
            window.scrollTo(0, 0);
          }}
          className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg text-indigo-600 hover:text-indigo-800 hover:bg-white rounded-full px-4 py-2 sm:px-5 sm:py-3 font-semibold transition-all hover:scale-105 active:scale-95 group min-h-[44px]"
        >
          <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="hidden sm:inline">Trang Chủ</span>
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage onStart={handleStart} onSampleReport={handleSampleReport} onCsvUpload={handleCsvUpload} onGoogleFormSetup={handleGoogleFormSetup} />
          </motion.div>
        )}

        {view === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen py-8 sm:py-12"
          >
            <Assessment onComplete={handleComplete} />
          </motion.div>
        )}

        {view === 'csv_upload' && (
          <motion.div
            key="csv_upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen py-12"
          >
            <CsvUpload 
              onUserSelect={handleCsvUserSelect} 
              onBack={() => setView('landing')} 
            />
          </motion.div>
        )}

        {view === 'google_form_setup' && (
          <motion.div
            key="google_form_setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen py-12"
          >
            <GoogleFormSetup onBack={() => setView('landing')} />
          </motion.div>
        )}

        {view === 'report' && scores && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen py-12 bg-white"
          >
            <Report scores={scores} responses={responses} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
