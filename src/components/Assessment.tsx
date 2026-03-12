import { useState } from 'react';
import { questions } from '../data/questions';
import { UserResponses, Question, Pillar } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, GripVertical, Send } from 'lucide-react';
import { Reorder } from 'motion/react';

interface AssessmentProps {
  onComplete: (responses: UserResponses) => void;
}

export default function Assessment({ onComplete }: AssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponses>({});
  const [textInput, setTextInput] = useState('');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const question = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Check if current question has been answered
  const isCurrentAnswered = (() => {
    if (question.type === 'ranking') return true; // Always can proceed from ranking (default is accepted)
    const answer = responses[question.id];
    if (question.type === 'text') return textInput.trim().length > 0 || (typeof answer === 'string' && answer.trim().length > 0);
    return answer !== undefined && answer !== null;
  })();

  // Check if ALL questions are answered (for the complete button)
  const answeredCount = questions.filter(q => {
    const ans = responses[q.id];
    if (q.type === 'ranking') return true;
    if (q.type === 'text') return typeof ans === 'string' && ans.trim().length > 0;
    return ans !== undefined && ans !== null;
  }).length;
  
  const allAnswered = answeredCount === questions.length;

  const handleOptionSelect = (optionId: string) => {
    setResponses(prev => ({ ...prev, [question.id]: optionId }));
    // No auto-advance — user controls navigation with buttons
  };

  const handleScaleSelect = (value: number) => {
    setResponses(prev => ({ ...prev, [question.id]: value }));
    // No auto-advance
  };

  const goNext = () => {
    // Save text input if applicable
    if (question.type === 'text' && textInput.trim()) {
      setResponses(prev => ({ ...prev, [question.id]: textInput }));
      setTextInput('');
    }
    // Auto-save ranking if user just accepted default
    if (question.type === 'ranking' && !responses[question.id]) {
      setResponses(prev => ({ ...prev, [question.id]: rankingItems.map(item => item.id) }));
    }
    
    if (!isLastQuestion) {
      setDirection('forward');
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (!isFirstQuestion) {
      setDirection('backward');
      setCurrentQuestionIndex(prev => prev - 1);
      // Restore text input if going back to a text question
      const prevQuestion = questions[currentQuestionIndex - 1];
      if (prevQuestion.type === 'text' && responses[prevQuestion.id]) {
        setTextInput(responses[prevQuestion.id] as string);
      }
    }
  };

  const handleComplete = () => {
    // Save any unsaved text input
    let finalResponses = { ...responses };
    if (question.type === 'text' && textInput.trim()) {
      finalResponses[question.id] = textInput;
    }
    onComplete(finalResponses);
  };

  // Create a separate component/memoized block just for ranking 
  // to avoid issues with parent re-renders mid-drag
  const currentOptions = question.type === 'ranking' ? question.options || [] : [];
  const [rankingItems, setRankingItems] = useState(currentOptions);

  // Sync state when entirely new question arrives
  if (question.type === 'ranking') {
     const isCurrentQuestion = rankingItems.length > 0 && rankingItems.some(i => i.id === currentOptions[0]?.id);
     if (!isCurrentQuestion) {
       setRankingItems(currentOptions);
     }
  }

  const handleRankingSubmit = () => {
    const rankedIds = rankingItems.map(item => item.id);
    setResponses(prev => ({ ...prev, [question.id]: rankedIds }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-0 pb-24 sm:pb-8">
      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Câu hỏi {currentQuestionIndex + 1} / {questions.length}</span>
          <span>{Math.round((answeredCount / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600 relative"
            initial={{ width: 0 }}
            animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Question dots for quick navigation */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-2 scrollbar-hide snap-x items-center">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => {
                setDirection(idx > currentQuestionIndex ? 'forward' : 'backward');
                setCurrentQuestionIndex(idx);
              }}
              className={`flex-shrink-0 w-3 h-3 rounded-full transition-all duration-200 ${
                idx === currentQuestionIndex
                  ? 'bg-indigo-600 scale-125 ring-2 ring-indigo-300 mx-1 snap-center'
                  : responses[q.id] !== undefined
                    ? 'bg-indigo-400 hover:bg-indigo-500 snap-center'
                    : 'bg-gray-300 hover:bg-gray-400 snap-center'
              }`}
              title={`Câu ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: direction === 'forward' ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 'forward' ? -30 : 30 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 min-h-[400px] flex flex-col"
        >
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full mb-4 w-fit">
            {question.module}
          </span>
          
          <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-6 sm:mb-8 leading-relaxed">
            {question.text}
          </h2>

          <div className="flex-1">
            {question.type === 'single_choice' && (
              <div className="space-y-2 sm:space-y-3">
                {question.options?.map((option) => (
                  <button
                    key={`${question.id}-${option.id}`}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group min-h-[52px] cursor-pointer
                      ${responses[question.id] === option.id 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'border-gray-200 hover:border-indigo-300 active:bg-gray-50'}`}
                  >
                    <span className="text-base sm:text-lg leading-snug">{option.text}</span>
                    {responses[question.id] === option.id && (
                      <Check className="w-5 h-5 text-indigo-600 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'text' && (
              <div className="space-y-4">
                <textarea
                  value={textInput || (responses[question.id] as string || '')}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Nhập câu trả lời của bạn..."
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none min-h-[150px] text-lg resize-none"
                />
              </div>
            )}

            {question.type === 'scale' && (
              <div className="grid grid-cols-5 gap-2 sm:gap-2 sm:grid-cols-10">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={`${question.id}-${num}`}
                    onClick={() => handleScaleSelect(num)}
                    className={`min-h-[52px] rounded-lg border flex items-center justify-center text-base font-medium transition-all touch-manipulation cursor-pointer
                      ${responses[question.id] === num
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                        : 'border-gray-200 hover:border-indigo-400 active:bg-indigo-50 text-gray-700'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'ranking' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-2">
                  <span className="hidden sm:inline">Kéo thả để sắp xếp thứ tự</span>
                  <span className="sm:hidden">Chạm và giữ, rồi kéo để sắp xếp thứ tự</span>
                </p>
                <div className="bg-gray-50/50 p-2 rounded-2xl border border-gray-100 min-h-[400px]">
                  <Reorder.Group axis="y" values={rankingItems} onReorder={setRankingItems} className="space-y-2">
                    {rankingItems.map((item, idx) => (
                      <Reorder.Item 
                        key={item.id} 
                        value={item}
                        className="relative z-10 block"
                      >
                       <div className="relative group">
                          {/* Invisible larger drag target for easier dragging */}
                          <div className="absolute inset-x-0 -inset-y-2 z-0"></div>
                          <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-indigo-300 hover:shadow-md transition-shadow relative z-10 w-full select-none cursor-grab active:cursor-grabbing">
                            <span className="text-sm font-bold text-indigo-400 w-6 flex-shrink-0 text-center">{idx + 1}</span>
                            <div className="w-10 h-10 flex items-center justify-center -ml-2 hover:bg-gray-100 rounded-xl">
                              <GripVertical className="text-gray-400 flex-shrink-0 cursor-grab active:cursor-grabbing pointer-events-none" />
                            </div>
                            <span className="text-lg font-medium text-gray-700 pointer-events-none">{item.text}</span>
                          </div>
                       </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
                <button
                  onClick={handleRankingSubmit}
                  className={`w-full mt-4 py-3 rounded-xl font-medium transition-colors ${
                    responses[question.id]
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {responses[question.id] ? '✓ Đã lưu thứ tự' : 'Xác nhận thứ tự'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons — fixed at bottom on mobile */}
      <div className="fixed sm:relative bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto bg-white/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t sm:border-t-0 border-gray-200 sm:border-0 px-4 sm:px-0 py-3 sm:py-0 mt-0 sm:mt-6 flex items-center justify-between gap-3 z-50">
        {/* Previous Button */}
        <button
          onClick={goPrev}
          disabled={isFirstQuestion}
          className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all min-h-[48px] flex-1 sm:flex-none ${
            isFirstQuestion
              ? 'text-gray-300 pointer-events-none'
              : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="inline">Quay lại</span>
        </button>

        {/* Center: question number */}
        <span className="text-sm text-gray-400 hidden sm:block font-medium">
          {currentQuestionIndex + 1} / {questions.length}
        </span>

        {/* Next / Complete Button */}
        {isLastQuestion ? (
          <button
            onClick={handleComplete}
            disabled={!allAnswered}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all flex-1 sm:flex-none min-h-[48px] ${
              allAnswered
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 active:scale-95 shadow-lg'
                : 'bg-gray-200 text-gray-400 pointer-events-none'
            }`}
          >
            <Send className="w-5 h-5" />
            {allAnswered ? 'Hoàn thành' : `Còn ${questions.length - answeredCount} câu nữa`}
          </button>
        ) : (
          <button
            onClick={goNext}
            disabled={!isCurrentAnswered}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all min-h-[48px] flex-1 sm:flex-none ${
              isCurrentAnswered
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-md transform hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-gray-200 text-gray-400 pointer-events-none'
            }`}
          >
            Tiếp theo <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
}
