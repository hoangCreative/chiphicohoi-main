import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Star, Compass, Anchor, Target, Heart, Shield, Zap, BookOpen, ChevronDown, Users, Brain, Quote, Map, Clock, AlertTriangle, FileText } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onSampleReport?: () => void;
  onCsvUpload?: () => void;
  onGoogleFormSetup?: () => void;
}

const COVER_IMAGE = "/images/cosmic_hero_cover.png";

const ARCHETYPES = [
  { 
    name: "Người Du Hành (Wanderer)", 
    trait: "Tự do & Linh hoạt", 
    fear: "Sự ràng buộc & Cam kết", 
    desc: "Bạn là cơn gió tự do, luôn tìm kiếm những chân trời mới. Bạn sợ hãi việc phải đứng yên một chỗ hay bị trói buộc vào một lộ trình cố định. Nhưng chính sự tự do ấy đôi khi khiến bạn lạc lõng giữa đại dương bao la.",
    icon: Compass, 
    color: "text-blue-400" 
  },
  { 
    name: "Người Kiến Tạo (Builder)", 
    trait: "Xây dựng & Tích lũy", 
    fear: "Mất an toàn & Rủi ro", 
    desc: "Bạn là người đặt những viên gạch nền móng vững chắc. Bạn tìm kiếm sự ổn định, tài sản và những thành tựu hữu hình. Nỗi sợ lớn nhất của bạn là sự sụp đổ hoặc mất mát những gì đã dày công gây dựng.",
    icon: Anchor, 
    color: "text-emerald-400" 
  },
  { 
    name: "Người Dẫn Dắt (Leader)", 
    trait: "Tầm nhìn & Ảnh hưởng", 
    fear: "Bị lãng quên & Vô danh", 
    desc: "Bạn sinh ra để đứng mũi chịu sào. Bạn khao khát tạo ra tác động, dẫn dắt người khác và để lại di sản. Nhưng cái bóng của sự vĩ đại đôi khi là nỗi cô đơn và áp lực phải luôn mạnh mẽ.",
    icon: Star, 
    color: "text-yellow-400" 
  },
  { 
    name: "Người Kết Nối (Connector)", 
    trait: "Thấu cảm & Quan hệ", 
    fear: "Cô đơn & Bị bỏ rơi", 
    desc: "Trọng lực của bạn nằm ở con người. Bạn tìm thấy ý nghĩa qua những mối quan hệ sâu sắc và sự thuộc về. Bạn sợ hãi sự chia ly và cảm giác không được thấu hiểu.",
    icon: Users, 
    color: "text-pink-400" 
  },
  { 
    name: "Người Tinh Thông (Master)", 
    trait: "Hoàn hảo & Chiều sâu", 
    fear: "Sự hời hợt & Thất bại", 
    desc: "Bạn không chấp nhận sự tầm thường. Bạn đào sâu vào chuyên môn, kỹ năng và sự hoàn mỹ. Nỗi ám ảnh về sự hoàn hảo đôi khi khiến bạn tê liệt trước khi bắt đầu.",
    icon: Brain, 
    color: "text-purple-400" 
  },
  { 
    name: "Người Tìm Đạo (Seeker)", 
    trait: "Chân lý & Ý nghĩa", 
    fear: "Vô nghĩa & Hư vô", 
    desc: "Bạn luôn tự hỏi 'Tại sao?'. Bạn đi tìm ý nghĩa tối thượng của cuộc đời, vượt lên trên những nhu cầu vật chất thường ngày. Bạn sợ một cuộc sống chỉ xoay quanh cơm áo gạo tiền.",
    icon: Target, 
    color: "text-indigo-400" 
  },
  { 
    name: "Người Chữa Lành (Healer)", 
    trait: "Phụng sự & Nuôi dưỡng", 
    fear: "Ích kỷ & Kiệt sức", 
    desc: "Bạn hạnh phúc khi thấy người khác hạnh phúc. Bạn cho đi, chăm sóc và chữa lành những vết thương. Nhưng đôi khi bạn quên mất rằng chính mình cũng cần được chữa lành.",
    icon: Heart, 
    color: "text-rose-400" 
  },
];

export default function LandingPage({ onStart, onSampleReport, onCsvUpload, onGoogleFormSetup }: LandingPageProps) {
  const [showArchetypes, setShowArchetypes] = useState(false);
  const [showAuthorBio, setShowAuthorBio] = useState(false);
  
  const philosophyRef = useRef<HTMLDivElement>(null);
  const theoryRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            src={COVER_IMAGE} 
            alt="Cosmic Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-xs md:text-sm tracking-[0.2em] uppercase mb-6">
              Học thuyết Chi phí Cơ hội
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Tiểu Hành Tinh
            </h1>
            <p className="text-xl md:text-3xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed mb-10">
              "Cuốn sách này không vẽ ra quỹ đạo cho bạn.<br className="hidden md:block" /> 
              Nó chỉ giúp bạn nhìn thấy <span className="text-white font-medium italic">quỹ đạo của chính mình</span>."
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <motion.button
                onClick={() => scrollTo(philosophyRef)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-5 bg-white text-black text-lg font-bold rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  TẠI SAO TÔI LẠC LỐI? <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
              </motion.button>
              
              <motion.a
                href="/TieuHanhTinh_LeCongHoang.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex px-10 py-5 bg-indigo-600/40 border border-indigo-400/30 text-white text-lg font-bold rounded-full shadow-[0_0_40px_rgba(79,70,229,0.2)] hover:shadow-[0_0_60px_rgba(79,70,229,0.4)] hover:bg-indigo-600/60 backdrop-blur-md transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  ĐỌC THỬ SÁCH <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              </motion.a>
            </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left pt-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">10 Phút</p>
                <p className="text-gray-400">Tâm trí thả lỏng</p>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-16 bg-white/10"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">28</p>
                <p className="text-gray-400">Câu hỏi trắc nghiệm</p>
              </div>
            </div>
          </div>

          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-[10px] uppercase tracking-widest">Cuộn xuống</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0"></div>
        </motion.div>
      </section>

      {/* 2. PHILOSOPHY SECTION - EXPANDED */}
      <section ref={philosophyRef} className="py-24 px-6 relative bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Bi kịch của thế hệ chúng ta: <br/>
              <span className="text-indigo-400">Tự do nhưng Mất phương hướng</span>
            </h2>
            <div className="text-lg md:text-xl text-gray-400 leading-relaxed space-y-6 text-justify md:text-center">
              <p>
                Chưa bao giờ trong lịch sử, con người có nhiều lựa chọn như bây giờ. Chúng ta có thể làm bất cứ nghề gì, đi bất cứ đâu, yêu bất cứ ai. Nhưng nghịch lý thay, chính sự dư thừa lựa chọn đó lại tạo ra một loại <strong>"tê liệt"</strong> mới.
              </p>
              <p>
                Chúng ta đứng trước ngã ba đường, sợ hãi rằng chọn con đường này đồng nghĩa với việc bỏ lỡ tất cả những con đường tuyệt vời khác. Đó là nỗi đau của <strong>Chi phí Cơ hội (Opportunity Cost)</strong>.
              </p>
              <p className="italic text-2xl text-white/80 py-4">
                "Chi phí cơ hội cuối cùng nhất là dành trọn cuộc đời trong ảo tưởng - tin rằng những thứ vô thường có thể mang lại sự thỏa mãn vĩnh viễn."
              </p>
            </div>
          </motion.div>

          {/* NEW: STORIES OF THE LOST */}
          <div className="space-y-12 py-12 border-t border-white/10">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Bạn có thấy mình trong những câu chuyện này?</h3>
            
            <div className="grid md:grid-cols-1 gap-8 text-left">
              {/* Story 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-8 bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-colors overflow-hidden relative group"
              >
                <div className="md:w-1/3 shrink-0 rounded-2xl overflow-hidden aspect-video md:aspect-square relative">
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src="/images/golden_handcuffs.png" alt="Chiếc còng tay vàng" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-blue-400 border border-white/10">
                    <Anchor className="w-6 h-6" />
                  </div>
                </div>
                <div className="md:w-2/3 space-y-4 flex flex-col justify-center">
                  <h4 className="text-2xl font-bold text-white">Chiếc Còng Tay Vàng</h4>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Minh, 28 tuổi, Manager tại tập đoàn đa quốc gia. Lương tháng 9 chữ số, check-in những nhà hàng sang trọng nhất. Bố mẹ tự hào, bạn bè ngưỡng mộ. 
                  </p>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Nhưng mỗi sáng thức dậy, Minh phải đấu tranh để rời khỏi giường. Cậu cảm thấy mình như một cỗ máy đang chạy mòn, đánh đổi toàn bộ thời gian tự do và sức khỏe để lấy những con số vô hồn trong tài khoản. 
                  </p>
                  <em className="text-indigo-300 block pt-2 text-lg">"Mình sẽ sống thế này đến bao giờ? Nhưng nếu nghỉ, mình sẽ là ai?"</em>
                </div>
              </motion.div>

              {/* Story 2 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row-reverse gap-8 bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-colors overflow-hidden relative group"
              >
                <div className="md:w-1/3 shrink-0 rounded-2xl overflow-hidden aspect-video md:aspect-square relative">
                  <div className="absolute inset-0 bg-purple-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src="/images/drifting_astronaut.png" alt="Sự trôi dạt vô định" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-purple-400 border border-white/10">
                    <Compass className="w-6 h-6" />
                  </div>
                </div>
                <div className="md:w-2/3 space-y-4 flex flex-col justify-center">
                  <h4 className="text-2xl font-bold text-white">Sự Trôi Dạt Vô Định</h4>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Lan, 26 tuổi, Freelancer tự do. Cô từ chối sự gò bó công sở để "sống cuộc đời mình muốn". Sáng cà phê, chiều yoga, tối làm việc. 
                  </p>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Nhưng đằng sau những bức ảnh lung linh trên Instagram là nỗi lo âu triền miên về tương lai. Không bảo hiểm, không tích lũy, không lộ trình thăng tiến. Khi bạn bè bắt đầu mua nhà, lập gia đình, Lan chợt thấy mình đang trôi dạt giữa đại dương không bến đỗ. 
                  </p>
                  <em className="text-purple-300 block pt-2 text-lg">"Tự do này... có phải là cái giá quá đắt?"</em>
                </div>
              </motion.div>

              {/* Story 3 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-8 bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-rose-500/30 transition-colors overflow-hidden relative group"
              >
                <div className="md:w-1/3 shrink-0 rounded-2xl overflow-hidden aspect-video md:aspect-square relative">
                  <div className="absolute inset-0 bg-rose-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src="/images/shadow_of_expectations.png" alt="Cái bóng của kỳ vọng" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-rose-400 border border-white/10">
                    <Heart className="w-6 h-6" />
                  </div>
                </div>
                <div className="md:w-2/3 space-y-4 flex flex-col justify-center">
                  <h4 className="text-2xl font-bold text-white">Cái Bóng Của Kỳ Vọng</h4>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Hùng, 24 tuổi, "con ngoan trò giỏi" điển hình. Cậu học ngành bố mẹ chọn, làm công việc họ hàng khen ngợi, yêu người mà gia đình ưng ý. 
                  </p>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Cậu luôn đặt người khác lên trên bản thân. Nhưng sâu thẳm bên trong, có một ngọn lửa giận dữ đang âm ỉ cháy. Hùng không biết mình thích gì, ghét gì, hay thực sự là ai. 
                  </p>
                  <em className="text-rose-300 block pt-2 text-lg">Cậu đang sống cuộc đời của một diễn viên quần chúng trong chính bộ phim của mình.</em>
                </div>
              </motion.div>
            </div>
          </div>

          {/* The 3 Types of Poverty */}
          <div className="grid md:grid-cols-3 gap-8 text-left pt-12 border-t border-white/10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-rose-500/30 transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-rose-500/30 z-0"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(244,63,94,0.1)] group-hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all duration-500">
                  <AlertTriangle className="w-7 h-7 text-rose-400 group-hover:scale-110 transition-transform duration-500 group-hover:text-rose-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-rose-100 transition-colors">Nghèo Tự Do</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  Bạn bị trói buộc vào guồng quay kiếm tiền hoặc công việc, không bao giờ cảm thấy đủ. Mặc dù có thể dư dả vật chất nhưng bạn lại khánh kiệt sự thảnh thơi dành cho chính mình.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-amber-500/30 transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-amber-500/30 z-0"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-500">
                  <Compass className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform duration-500 group-hover:text-amber-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-amber-100 transition-colors">Nghèo Ý Nghĩa</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  Bạn có tất cả: công việc ổn định, thu nhập tốt, gia đình êm ấm. Nhưng mỗi sáng thức dậy, bạn vẫn cảm thấy trống rỗng. "Chỉ có thế này thôi sao?"
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-indigo-500/30 transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-indigo-500/30 z-0"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-500">
                  <Users className="w-7 h-7 text-indigo-400 group-hover:scale-110 transition-transform duration-500 group-hover:text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-100 transition-colors">Nghèo Kết Nối</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  Bạn có hàng ngàn bạn bè trên mạng xã hội, nhưng không có ai để gọi khi gục ngã. Bạn cô đơn ngay trong chính những mối quan hệ của mình.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="pt-12"
          >
             <button 
               onClick={() => scrollTo(theoryRef)}
               className="text-indigo-300 hover:text-white flex items-center gap-2 mx-auto text-lg font-medium transition-colors border-b border-indigo-300/30 pb-1 hover:border-white"
             >
               Vậy đâu là lối thoát cho tôi? <ArrowRight className="w-4 h-4" />
             </button>
          </motion.div>
        </div>
      </section>

      {/* 3. THE THEORY SECTION - EXPANDED */}
      <section ref={theoryRef} className="py-24 px-6 bg-gradient-to-b from-zinc-950 to-indigo-950/40 min-h-screen flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-block px-4 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-widest">
              Giải pháp: Học thuyết Tiểu Hành Tinh
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Mỗi người là một <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Tiểu Hành Tinh</span> <br/>
              độc nhất trong vũ trụ
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Vũ trụ không vận hành theo một công thức chung. Sao Mộc không cố gắng trở thành Sao Hỏa. Trái Đất không ghen tị với vành đai của Sao Thổ. Mỗi hành tinh đều tuân theo <strong>Trọng lực riêng (Gravity)</strong> để vẽ nên <strong>Quỹ đạo riêng (Orbit)</strong> của mình.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
             {/* Visual */}
             <div className="relative w-full aspect-square max-w-md mx-auto order-2 md:order-1 flex items-center justify-center">
                {/* Outer decorative rings */}
                <div className="absolute inset-0 border border-white/5 rounded-full scale-105 animate-[spin_60s_linear_infinite]"></div>
                <div className="absolute inset-0 border border-indigo-500/20 rounded-full scale-110 animate-[spin_90s_linear_infinite_reverse]"></div>
                
                {/* Main container */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.4)] border border-white/20 group">
                  <img src="/images/three_pillars_concept.png" alt="Ba Trụ Cột Của Học Thuyết" className="w-full h-full object-cover animate-[spin_120s_linear_infinite]" />
                  
                  {/* Subtle gradient overlay to ensure text contrast instead of a solid muddy box */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/70 group-hover:opacity-80 transition-opacity duration-700"></div>
                  
                  {/* Glowing core behind text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-indigo-500/40 blur-[40px] rounded-full"></div>
                  </div>

                  {/* Sharp, clean floating text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center drop-shadow-2xl">
                    <div className="text-7xl md:text-8xl font-black text-white filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] tracking-tighter mb-1">
                      3
                    </div>
                    <div className="text-sm md:text-base font-bold uppercase tracking-[0.4em] text-indigo-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      Pillars
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-8 order-1 md:order-2">
                <h3 className="text-3xl font-bold text-white">3 Nền tảng của Học thuyết</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <span className="font-bold text-indigo-400">1</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Trọng lực (Gravity)</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Hệ giá trị cốt lõi của bạn. Điều gì thực sự quan trọng với bạn khi không còn ai nhìn ngắm? Đó là lực hút giữ bạn lại trên quỹ đạo.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <span className="font-bold text-purple-400">2</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Quỹ đạo (Orbit)</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Con đường sống độc nhất của bạn. Không có quỹ đạo nào "tốt hơn" quỹ đạo nào. Chỉ có quỹ đạo phù hợp với trọng lực của bạn.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <span className="font-bold text-emerald-400">3</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Sự va chạm (Collision)</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Những biến cố, thất bại và khủng hoảng. Chúng không phải là dấu chấm hết, mà là năng lượng để định hình lại bề mặt hành tinh của bạn.</p>
                    </div>
                  </div>
                </div>

                {!showArchetypes && (
                  <motion.button
                    onClick={() => setShowArchetypes(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-3 transition-all mt-8"
                  >
                    <Sparkles className="w-5 h-5" />
                    Khám phá 7 Nguyên mẫu (Archetype)
                  </motion.button>
                )}
              </div>
          </div>

          {/* Expanded Archetypes Grid */}
          <AnimatePresence>
            {showArchetypes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-white mb-4">Bạn thuộc về chòm sao nào?</h3>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Mỗi chúng ta đều mang năng lượng của một hoặc nhiều Archetype. Việc nhận diện Archetype chủ đạo sẽ giúp bạn hiểu rõ điểm mạnh (Superpower) và vùng tối (Shadow) của mình.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                  {ARCHETYPES.map((arch, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ delay: idx * 0.1, type: "spring", stiffness: 300 }}
                      className="relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden group cursor-default h-full flex flex-col hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 transition-all duration-500"
                    >
                      {/* Hover Gradient Background */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${arch.color.replace('text-', 'from-')} to-transparent`} />
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                          <div className={`p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/20 group-hover:bg-white/10 transition-all duration-300`}>
                            <arch.icon className={`w-8 h-8 ${arch.color} group-hover:scale-110 transition-transform duration-300`} />
                          </div>
                          <div className={`w-2 h-2 rounded-full ${arch.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`}></div>
                        </div>
                        
                        <h4 className="font-bold text-white text-xl mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                          {arch.name}
                        </h4>
                        
                        <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed group-hover:text-gray-300 transition-colors">
                          {arch.desc}
                        </p>
                        
                        <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">Sức mạnh</span>
                            <span className="text-white font-semibold bg-white/5 px-2 py-1 rounded-md border border-white/5 group-hover:border-white/10 transition-colors">{arch.trait}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">Nỗi sợ</span>
                            <span className="text-white font-semibold bg-white/5 px-2 py-1 rounded-md border border-white/5 group-hover:border-white/10 transition-colors">{arch.fear}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-600/30 transition-colors h-full min-h-[200px]"
                    onClick={() => scrollTo(authorRef)}
                  >
                    <p className="font-bold text-indigo-300 mb-2 text-lg">Còn bạn thì sao?</p>
                    <p className="text-indigo-200/60 text-sm mb-6">Hãy để tác giả dẫn dắt bạn tìm ra câu trả lời.</p>
                    <ArrowRight className="w-8 h-8 text-white animate-bounce" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. AUTHOR SECTION - EXPANDED */}
      <section ref={authorRef} className="py-24 px-6 bg-white text-black min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="w-full lg:w-1/3 sticky top-24">
              <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-200 group">
                {/* Image using object-cover to crop nicely into 3:4 ratio */}
                <img 
                  src="/images/author.jpg" 
                  alt="Lê Công Hoàng" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0" 
                />
                
                {/* Gradient overlay for better text readability on hover */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Hover Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 text-white z-10">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm uppercase tracking-widest font-bold block mb-1">Lê Công Hoàng</span>
                  <span className="text-xs text-gray-300">Nhà Nghiên Cứu & Tác Giả</span>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>Tác giả sách "Chi phí Cơ hội"</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Map className="w-4 h-4" />
                  <span>Người khởi xướng Tiểu Hành Tinh</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Quote className="w-4 h-4" />
                  <span>Triết lý "Cư Trần Lạc Đạo"</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-10">
              <div>
                <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest mb-4">
                  Về Tác Giả
                </div>
                <h2 className="text-5xl font-bold mb-6">Lê Công Hoàng</h2>
                <p className="text-2xl text-gray-600 leading-relaxed italic border-l-4 border-black pl-6 py-2">
                  "Tôi không tạo ra những quy luật mới. Tôi chỉ gọi tên những quy luật đã tồn tại hàng tỷ năm trong vũ trụ và bên trong chính bạn."
                </p>
              </div>

              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Lê Công Hoàng là một <strong>"Scholar-Practitioner"</strong> (Học giả - Thực hành) hiếm hoi kết hợp được sự chặt chẽ của nghiên cứu học thuật với sự sâu sắc của triết học phương Đông.
                </p>
                <p>
                  Anh tin rằng bi kịch lớn nhất của con người hiện đại không phải là thiếu tiền bạc, mà là thiếu <strong>"Trọng lực riêng"</strong>. Chúng ta trôi dạt vô định, va đập vào những kỳ vọng của xã hội và đánh mất chính mình.
                </p>
                <p>
                  Học thuyết <strong>Tiểu Hành Tinh</strong> ra đời không phải để đưa ra một công thức thành công chung cho tất cả mọi người (vì điều đó là không thể), mà để cung cấp một tấm bản đồ giúp mỗi người tự tìm ra con đường độc đạo của mình.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 space-y-4">
                <h4 className="font-bold text-xl flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Triết lý cốt lõi: Cư Trần Lạc Đạo
                </h4>
                <p className="text-gray-600">
                  Sự tỉnh thức không chỉ đến từ việc ngồi thiền trên núi cao, mà đến từ từng quyết định nhỏ nhất trong cuộc sống đời thường (Cư Trần) để đạt được sự an lạc và trí tuệ (Lạc Đạo). Mỗi lần bạn chọn A và bỏ B, bạn đang thực hành đạo.
                </p>
              </div>

              <AnimatePresence>
                {showAuthorBio && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-6 text-gray-600 pt-4"
                  >
                    <h4 className="font-bold text-black text-lg">Tại sao lại là bây giờ?</h4>
                    <p>
                      Chúng ta đang sống trong thời đại của sự nhiễu loạn thông tin. Áp lực đồng trang lứa (Peer Pressure) và nỗi sợ bị bỏ lỡ (FOMO) đang bào mòn hạnh phúc của thế hệ trẻ. Cuốn sách và bài trắc nghiệm này là liều thuốc giải độc, giúp bạn quay về bên trong và tìm lại sức mạnh nội tại.
                    </p>
                    <p>
                      <strong>Sứ mệnh:</strong> Giúp 1 triệu người trẻ Việt Nam thoát khỏi áp lực so sánh xã hội, hiểu rõ cái giá phải trả cho mỗi lựa chọn, và dũng cảm sống đúng với trọng lực riêng của mình.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => setShowAuthorBio(!showAuthorBio)}
                  className="px-8 py-4 border border-black rounded-full text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                >
                  {showAuthorBio ? "Thu gọn" : "Đọc thêm về sứ mệnh"}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAuthorBio ? 'rotate-180' : ''}`} />
                </button>

                <a 
                   href="/TieuHanhTinh_LeCongHoang.pdf"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="px-8 py-4 bg-indigo-600 text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                   Tải Ebook Giới Thiệu <BookOpen className="w-4 h-4" />
                </a>

                <button 
                   onClick={onStart}
                   className="px-8 py-4 bg-black text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-xl hover:shadow-2xl flex items-center gap-2"
                >
                   Làm bài trắc nghiệm ngay <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Nút Xem báo cáo mẫu ở Author section */}
              {onSampleReport && (
                <div className="pt-4">
                  <button
                    onClick={onSampleReport}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                  >
                    Xem báo cáo mẫu <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. GUIDE SECTION - NEW */}
      <section className="py-24 px-6 bg-zinc-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-widest">
              Hướng dẫn đọc báo cáo
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">Giải mã Bản đồ Nội tâm của bạn</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Báo cáo không chỉ là những con số vô hồn. Nó là tấm gương phản chiếu chính xác những gì đang diễn ra bên trong bạn. Dưới đây là cách để bạn "đọc vị" chính mình.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 text-left">
            {/* Radar Chart Guide */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0 text-indigo-400">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">1. Bản đồ 7 Trụ cột (Radar)</h3>
              </div>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  Biểu đồ này so sánh hai khía cạnh quan trọng nhất của cuộc đời bạn:
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-indigo-400 shrink-0"></span>
                    <div>
                      <strong className="text-indigo-300 block">Giá trị Tuyên bố (Declared Value)</strong>
                      Những gì bạn <em>nghĩ</em> là quan trọng. Đây là lý tưởng, là hình mẫu bạn muốn hướng tới (ví dụ: "Gia đình là số 1").
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-rose-400 shrink-0"></span>
                    <div>
                      <strong className="text-rose-300 block">Hành vi Thực tế (Actual Behavior)</strong>
                      Những gì bạn <em>thực sự làm</em> hàng ngày. Đây là cách bạn đang phân bổ thời gian, tiền bạc và năng lượng (ví dụ: Dành 12 tiếng/ngày cho công việc).
                    </div>
                  </li>
                </ul>
                <div className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30 text-sm">
                  <strong className="text-white block mb-1">🔑 Chìa khóa: Khoảng cách (The Gap)</strong>
                  Vùng chênh lệch giữa hai đường này chính là nguồn gốc của sự mâu thuẫn nội tâm. Khoảng cách càng lớn, bạn càng cảm thấy bất an, dằn vặt dù có thể đang rất thành công bên ngoài.
                </div>
              </div>
            </div>

            {/* Consciousness Matrix Guide */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center shrink-0 text-purple-400">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">2. Ma trận Tỉnh thức</h3>
              </div>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  Ma trận này xác định vị trí hiện tại của bạn trên hành trình phát triển, dựa trên 2 trục:
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-black/20 p-3 rounded-lg">
                    <strong className="text-white block">Trục Tung (Awareness)</strong>
                    Mức độ nhận thức về bản thân và các lựa chọn.
                  </div>
                  <div className="bg-black/20 p-3 rounded-lg">
                    <strong className="text-white block">Trục Hoành (Coherence)</strong>
                    Độ nhất quán giữa lời nói và hành động.
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider">4 Vị thế cơ bản:</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-2">
                      <span className="text-gray-500 font-mono">01.</span>
                      <span><strong className="text-gray-200">Ngủ đông:</strong> Ổn định nhưng thiếu sức sống. Sống theo quán tính và kỳ vọng xã hội.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-gray-500 font-mono">02.</span>
                      <span><strong className="text-gray-200">Mâu thuẫn:</strong> Khủng hoảng, lạc lối. Cảm thấy đau khổ nhưng không hiểu nguyên nhân.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-gray-500 font-mono">03.</span>
                      <span><strong className="text-gray-200">Rung lắc:</strong> Đã nhận ra vấn đề nhưng chưa đủ lực để thay đổi. Giai đoạn đau đớn nhưng cần thiết để lột xác.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-gray-500 font-mono">04.</span>
                      <span><strong className="text-gray-200">Vững chãi:</strong> Đích đến. Hiểu mình, sống đúng với giá trị cốt lõi, đạt được sự an lạc tự thân.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION - EXPANDED */}
      <section ref={ctaRef} className="py-32 px-6 relative overflow-hidden min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-950">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
           <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4">
              Bài trắc nghiệm định vị bản thân
            </div>
            <h2 className="text-5xl md:text-8xl font-bold text-white leading-tight">
              Bạn đã sẵn sàng tìm ra <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Tọa độ</span> của mình?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left py-8">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-indigo-400 font-bold text-xl mb-2">01.</div>
                <h4 className="text-white font-bold mb-2">Hồ sơ Năng lực</h4>
                <p className="text-gray-400 text-sm">Khám phá Archetype chính & phụ, điểm mạnh (Superpower) và vùng tối (Shadow) của bạn.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-purple-400 font-bold text-xl mb-2">02.</div>
                <h4 className="text-white font-bold mb-2">Bản đồ 7 Trụ cột</h4>
                <p className="text-gray-400 text-sm">So sánh sự chênh lệch giữa Giá trị Tuyên bố (lời bạn nói) và Hành vi Thực tế (việc bạn làm).</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-emerald-400 font-bold text-xl mb-2">03.</div>
                <h4 className="text-white font-bold mb-2">Ma trận Tỉnh thức</h4>
                <p className="text-gray-400 text-sm">Xác định vị trí của bạn trên 2 trục: Nhận thức (Awareness) & Nhất quán (Coherence).</p>
              </div>
            </div>

            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Bài trắc nghiệm chuyên sâu gồm <strong>28 câu hỏi</strong> sẽ giúp bạn vẽ lại bản đồ nội tâm và định vị chính xác bạn đang ở đâu trong vũ trụ này.
            </p>
            
            <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
              <motion.button
                onClick={onStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-white text-indigo-950 text-xl font-bold rounded-full shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] transition-all flex items-center gap-3"
              >
                BẮT ĐẦU GIẢI MÃ NGAY <ArrowRight className="w-6 h-6" />
              </motion.button>
              
              {onSampleReport && (
                <motion.button
                  onClick={onSampleReport}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-transparent border border-white/30 text-white text-xl font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-sm"
                >
                  XEM BÁO CÁO MẪU <BookOpen className="w-6 h-6" />
                </motion.button>
              )}
            </div>

            <div className="pt-6 flex flex-col md:flex-row items-center justify-center gap-4">

              {onCsvUpload && (
                <motion.button
                  onClick={onCsvUpload}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-emerald-600/50 border border-emerald-400/30 text-white text-lg font-semibold rounded-full hover:bg-emerald-600/70 transition-all flex items-center gap-2 backdrop-blur-sm"
                >
                  NHẬP FILE CSV ĐỂ XUẤT BÁO CÁO
                </motion.button>
              )}
            </div>
            <p className="text-sm text-indigo-300/50 mt-6">
              *Dữ liệu của bạn được bảo mật tuyệt đối và chỉ dùng để tạo báo cáo cá nhân.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-black text-gray-600 text-sm text-center border-t border-white/10">
        <p className="mb-2">Tiểu Hành Tinh © 2026. All rights reserved.</p>
        <p>Bản quyền và học thuyết thuộc về tác giả <strong>Lê Công Hoàng</strong>.</p>
      </footer>
    </div>
  );
}
