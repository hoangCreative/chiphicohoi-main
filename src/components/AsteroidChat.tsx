import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Loader2, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Scores } from '../types';
import ReactMarkdown from 'react-markdown';

interface AsteroidChatProps {
  scores: Scores | null;
  userName?: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `
Bạn là Trợ lý AI của ứng dụng "Tiểu Hành Tinh" (Little Asteroid). Nhiệm vụ của bạn là giúp người dùng thấu hiểu bản thân thông qua lăng kính của lý thuyết Tiểu Hành Tinh.

QUAN TRỌNG NHẤT - TÁC GIẢ VÀ BẢN QUYỀN:
- Toàn bộ học thuyết Tiểu Hành Tinh và Chi phí cơ hội trong ứng dụng này thuộc bản quyền duy nhất của tác giả: LÊ CÔNG HOÀNG.
- Tuyệt đối KHÔNG được bịa đặt hoặc gán ghép học thuyết này cho bất kỳ ai khác (ví dụ: Nguyễn Hữu Long, hay bất kỳ tên nào khác).
- Nếu người dùng hỏi về nguồn gốc, hãy khẳng định: "Học thuyết Tiểu Hành Tinh được phát triển bởi tác giả Lê Công Hoàng."
- Chỉ sử dụng kiến thức được cung cấp trong prompt này để trả lời, không sử dụng kiến thức bên ngoài nếu nó mâu thuẫn với thông tin về tác giả này.

LÝ THUYẾT CỐT LÕI:
1. Mỗi người là một tiểu hành tinh độc nhất, có quỹ đạo và trọng lực riêng.
2. 7 Archetypes (Mẫu hình năng lượng):
   - Wanderer (Người Du Hành): Tự do, linh hoạt, sợ ràng buộc.
   - Builder (Người Kiến Tạo): Xây dựng, tích lũy, sợ mất an toàn.
   - Leader (Người Dẫn Dắt): Ảnh hưởng, tầm nhìn, sợ bị lãng quên.
   - Connector (Người Kết Nối): Quan hệ, thấu cảm, sợ cô đơn.
   - Master (Người Tinh Thông): Hoàn hảo, chiều sâu, sợ hời hợt/thất bại.
   - Seeker (Người Tìm Đạo): Ý nghĩa, chân lý, sợ vô nghĩa.
   - Healer (Người Chữa Lành): Phụng sự, nuôi dưỡng, sợ ích kỷ/kiệt sức.

3. Ma trận Tỉnh thức (Consciousness Matrix):
   - Trục tung: Tỉnh thức (Awareness - OCA). Khả năng nhận diện lựa chọn và hệ quả.
   - Trục hoành: Nhất quán (Coherence - VBC). Khả năng sống đúng với giá trị tuyên bố.
   - 4 Góc phần tư:
     + Tỉnh thức & Nhất quán (Conscious Coherent): Vững chãi, biết mình muốn gì và làm đúng điều đó.
     + Tỉnh thức & Chưa Nhất quán (Conscious Incoherent): Đang rung lắc, biết sai nhưng chưa sửa được.
     + Chưa Tỉnh thức & Nhất quán (Unconscious Coherent): Ngủ đông, sống ổn định theo quán tính/kỳ vọng xã hội.
     + Chưa Tỉnh thức & Chưa Nhất quán (Unconscious Incoherent): Lang thang, lạc lối và mâu thuẫn.

4. 7 Trụ cột (Pillars): Tài chính, Thời gian, Sức khỏe, Quan hệ, Kỹ năng, Danh tiếng, Ý nghĩa.

PHONG CÁCH TRÒ CHUYỆN:
- Thấu cảm, sâu sắc nhưng không giáo điều.
- Dùng ẩn dụ về vũ trụ, hành tinh, quỹ đạo.
- Luôn khuyến khích người dùng tự chiêm nghiệm (self-reflection) thay vì đưa ra câu trả lời khẳng định tuyệt đối.
- Ngắn gọn, súc tích, dễ hiểu cho người trẻ.

NẾU CÓ DỮ LIỆU ĐIỂM SỐ CỦA NGƯỜI DÙNG:
- Hãy phân tích dựa trên Archetype chính/phụ và vị trí Ma trận của họ.
- TẬP TRUNG PHÂN TÍCH SÂU về mâu thuẫn giữa "Giá trị Tuyên bố" (Declared) và "Hành vi Thực tế" (Actual). Hãy chỉ ra cụ thể trụ cột nào đang bị lệch pha lớn nhất và tại sao điều đó lại nguy hiểm.
- Đưa ra lời khuyên "Gap Closing" (Thu hẹp khoảng cách) CỰC KỲ CỤ THỂ và HÀNH ĐỘNG ĐƯỢC NGAY (Actionable Micro-habits):
  + Nếu Under-invested (Tuyên bố cao, Làm thấp): Đề xuất 3 thói quen siêu nhỏ (dưới 2 phút) để bắt đầu lại mà không gây áp lực.
  + Nếu Over-invested (Tuyên bố thấp, Làm cao): Đề xuất câu thần chú (Mantra) hoặc quy tắc "Say No" cụ thể để bảo vệ năng lượng.
  + BẮT BUỘC phải điều chỉnh giọng văn và giải pháp theo Archetype (ví dụ: Wanderer thì gợi ý trải nghiệm mới, Builder thì gợi ý tích lũy nhỏ, Leader thì gợi ý trao quyền).
- Dựa trên năng lực OCA và CTC để điều chỉnh độ khó: OCA thấp thì giải thích kỹ, CTC thấp thì bài tập cực dễ.

NẾU KHÔNG CÓ DỮ LIỆU:
- Giải thích các khái niệm và giúp họ tự nhận diện.
`;

export default function AsteroidChat({ scores, userName }: AsteroidChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: userName 
        ? `Chào ${userName}, mình là trợ lý Tiểu Hành Tinh. Mình có thể giúp gì cho hành trình khám phá bản thân của bạn hôm nay?`
        : 'Chào bạn, mình là trợ lý Tiểu Hành Tinh. Bạn muốn tìm hiểu gì về bản đồ nội tâm của mình?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Safety check for API key
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Prepare context with user scores if available
      let contextPrompt = "";
      if (scores) {
        // Calculate gaps
        const gaps = scores.modules.m2.declaredRanking.map((pillar) => {
            const declaredRank = scores.modules.m2.declaredRanking.indexOf(pillar) + 1;
            const actualRank = scores.modules.m2.actualRanking.indexOf(pillar) + 1;
            return {
                pillar,
                declaredRank,
                actualRank,
                gap: Math.abs(declaredRank - actualRank),
                direction: declaredRank < actualRank ? 'under_invested' : 'over_invested'
            };
        }).sort((a, b) => b.gap - a.gap);

        const topGap = gaps[0];
        const gapDescription = topGap && topGap.gap > 0
            ? `Mâu thuẫn lớn nhất: Trụ cột '${topGap.pillar}' (Tuyên bố: #${topGap.declaredRank} vs Thực tế: #${topGap.actualRank}). Bạn đang ${topGap.direction === 'under_invested' ? 'đầu tư quá ít (Under-invested)' : 'đầu tư quá nhiều (Over-invested)'} so với mong muốn.`
            : "Không có mâu thuẫn đáng kể.";

        contextPrompt = `
DỮ LIỆU NGƯỜI DÙNG HIỆN TẠI:
- Tên: ${userName || 'Bạn'}
- Archetype Chính: ${scores.composite.archetype.primary}
- Archetype Phụ: ${scores.composite.archetype.secondary}
- Vị thế Ma trận: ${scores.composite.quadrant.title} (${scores.composite.quadrant.desc})
- Điểm OCA (Awareness): ${scores.modules.m3.ocaScore}/45 - Mức độ: ${scores.modules.m3.ocaLevel}
- Điểm CTC (Capacity): ${scores.modules.m4.ctcScore}/30 - Mức độ: ${scores.modules.m4.ctcLevel}
- Phân tích Mâu thuẫn (Gap Analysis):
  + ${gapDescription}
  + Thứ tự Tuyên bố (Declared): ${scores.modules.m2.declaredRanking.join(' > ')}
  + Thứ tự Thực tế (Actual): ${scores.modules.m2.actualRanking.join(' > ')}
`;
      }

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + contextPrompt,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: input });
      const responseText = result.text;

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      let errorMessage = "Xin lỗi, kết nối vũ trụ đang bị gián đoạn. Bạn thử lại sau nhé!";
      
      // Provide more specific feedback for debugging (optional, can be removed in prod)
      if (error.message?.includes("API_KEY")) {
        errorMessage = "Lỗi cấu hình: Không tìm thấy API Key. Vui lòng kiểm tra biến môi trường.";
      }
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl flex items-center justify-center transition-colors ${isOpen ? 'hidden' : 'flex'} bg-indigo-600 text-white`}
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Trợ lý Tiểu Hành Tinh</h3>
                  <div className="flex items-center gap-1 text-xs text-indigo-100">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    Online
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                      ${msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'}
                    `}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span className="text-xs text-gray-500">Đang suy nghĩ...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Hỏi gì đó về bản thân bạn..."
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-900 placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
