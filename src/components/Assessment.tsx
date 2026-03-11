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
    const answer = responses[question.id];
    if (question.type === 'text') return textInput.trim().length > 0 || (typeof answer === 'string' && answer.trim().length > 0);
    return answer !== undefined && answer !== null;
  })();

  // Check if ALL questions are answered (for the complete button)
  const allAnswered = questions.every(q => {
    const ans = responses[q.id];
    return ans !== undefined && ans !== null;
  });

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
  if (question.type === 'ranking' && rankingItems.length > 0) {
     const isCurrentQuestion = rankingItems.some(i => i.id === currentOptions[0]?.id);
     if (!isCurrentQuestion) {
       setRankingItems(currentOptions);
     }
  }

  const handleRankingSubmit = () => {
    const rankedIds = rankingItems.map(item => item.id);
    setResponses(prev => ({ ...prev, [question.id]: rankedIds }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Câu hỏi {currentQuestionIndex + 1} / {questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Question dots for quick navigation */}
        <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => {
                setDirection(idx > currentQuestionIndex ? 'forward' : 'backward');
                setCurrentQuestionIndex(idx);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                idx === currentQuestionIndex
                  ? 'bg-indigo-600 scale-125 ring-2 ring-indigo-300'
                  : responses[q.id] !== undefined
                    ? 'bg-indigo-400 hover:bg-indigo-500'
                    : 'bg-gray-300 hover:bg-gray-400'
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
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col"
        >
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full mb-4 w-fit">
            {question.module}
          </span>
          
          <h2 className="text-2xl font-medium text-gray-900 mb-8 leading-relaxed">
            {question.text}
          </h2>

          <div className="flex-1">
            {question.type === 'single_choice' && (
              <div className="space-y-3">
                {question.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group
                      ${responses[question.id] === option.id 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
                  >
                    <span className="text-lg">{option.text}</span>
                    {responses[question.id] === option.id && (
                      <Check className="w-5 h-5 text-indigo-600" />
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
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleScaleSelect(num)}
                    className={`aspect-square rounded-lg border flex items-center justify-center text-lg font-medium transition-all
                      ${responses[question.id] === num
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'ranking' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-2">Kéo thả để sắp xếp thứ tự</p>
                <div className="bg-gray-50/50 p-2 rounded-2xl border border-gray-100 min-h-[400px]">
                  <Reorder.Group axis="y" values={rankingItems} onReorder={setRankingItems} className="space-y-2">
                    {rankingItems.map((item, idx) => (
                      <Reorder.Item 
                        key={item.id} 
                        value={item}
                        className="relative z-10 block"
                        dragListener={false}
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

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6 gap-4">
        {/* Previous Button */}
        <button
          onClick={goPrev}
          disabled={isFirstQuestion}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            isFirstQuestion
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Center: question number */}
        <span className="text-sm text-gray-400 hidden sm:block">
          {currentQuestionIndex + 1} / {questions.length}
        </span>

        {/* Next / Complete Button */}
        {isLastQuestion ? (
          <button
            onClick={handleComplete}
            disabled={!allAnswered}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
              allAnswered
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
            Hoàn thành
          </button>
        ) : (
          <button
            onClick={goNext}
            disabled={!isCurrentAnswered}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              isCurrentAnswered
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Tiếp theo
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
