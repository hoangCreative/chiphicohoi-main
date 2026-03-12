import { Scores, Pillar, Archetype, Question } from '../types';
import { questions } from '../data/questions';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Sparkles, ArrowRight, Shield, Zap, Heart, Target, Anchor, Compass, Star, AlertTriangle, CheckCircle, BookOpen, Download, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface ReportProps {
  scores: Scores;
  responses: any;
}

const COVER_IMAGE = "/images/cosmic_hero_cover.png";

const pillarNames: Record<Pillar, string> = {
  financial: 'Tài chính',
  freedom: 'Tự do',
  health: 'Sức khỏe',
  relationships: 'Quan hệ',
  skills: 'Kỹ năng',
  reputation: 'Danh tiếng',
  meaning: 'Ý nghĩa',
};

// Helper to get text from response
const getResponseText = (responses: any, questionId: string) => {
  const answerId = responses[questionId];
  if (!answerId) return null;
  const question = questions.find(q => q.id === questionId);
  const option = question?.options?.find(o => o.id === answerId);
  return option ? option.text : null;
};

// Expanded Content Dictionaries
const archetypeDetails: Record<Archetype, {
  title: string;
  tagline: string;
  superpower: string;
  shadow: string;
  description: string;
  advice: string;
  icon: any;
  // New fields for extended report
  story?: string;
  philosophy?: string;
  blindspot?: string;
  growthPath?: string;
  image: string;
}> = {
  Wanderer: {
    title: 'Người Du Hành',
    tagline: 'Tự do là tối thượng',
    superpower: 'Khả năng thích nghi và sự linh hoạt tuyệt đối.',
    shadow: 'Sự thiếu cam kết và cảm giác lạc lõng vô định.',
    description: 'Bạn giống như một ngôi sao chổi rực rỡ, không chịu bị trói buộc bởi quỹ đạo cố định. Bạn khao khát trải nghiệm mới và sợ hãi sự nhàm chán hơn cả cái chết.',
    advice: 'Tự do không có nghĩa là vô kỷ luật. Hãy xây dựng những "trạm dừng chân" ổn định để bạn có thể bay xa hơn mà không bị kiệt sức.',
    icon: Compass,
    story: "Hãy tưởng tượng bạn đang đứng trước một cánh đồng hoa bất tận. Mỗi bông hoa là một cơ hội, một trải nghiệm mới. Bạn muốn hái tất cả, ngửi tất cả, nhưng bạn sợ rằng nếu dừng lại ở một bông hoa quá lâu, bạn sẽ bỏ lỡ cả cánh đồng phía trước. Cuộc đời bạn là chuỗi những chuyến đi không hồi kết, những dự án dang dở và những mối quan hệ nồng nhiệt nhưng ngắn ngủi.",
    philosophy: "Triết lý của Người Du Hành là 'Dịch chuyển'. Bạn tin rằng sự sống nằm ở sự vận động. Tuy nhiên, nghịch lý là khi di chuyển quá nhanh, mọi thứ xung quanh bạn trở nên nhạt nhòa. Bạn đi nhiều nơi nhưng không thực sự 'ở' đâu cả.",
    blindspot: "Bạn thường nhầm lẫn giữa 'Tự do' (Freedom) và 'Trốn chạy' (Escapism). Đôi khi bạn rời đi không phải vì nơi đó hết thú vị, mà vì bạn sợ phải đối diện với trách nhiệm và sự gắn kết sâu sắc.",
    growthPath: "Học cách 'Cam kết có thời hạn'. Thay vì sợ hãi sự ràng buộc cả đời, hãy thử cam kết trọn vẹn với một mục tiêu trong 3 tháng, 6 tháng. Tìm sự tự do trong chiều sâu (Depth), không chỉ là chiều rộng (Breadth).",
    image: "/images/archetypes/Wanderer.png"
  },
  Builder: {
    title: 'Người Kiến Tạo',
    tagline: 'Xây dựng di sản bền vững',
    superpower: 'Biến ý tưởng trừu tượng thành kết quả hữu hình.',
    shadow: 'Nỗi sợ mất mát và sự ám ảnh về an toàn.',
    description: 'Bạn là hành tinh có trọng lực mạnh mẽ, thu hút tài nguyên để xây dựng những cấu trúc bền vững. Bạn tìm thấy niềm vui trong sự tích lũy và trật tự.',
    advice: 'Đừng để việc xây dựng nền móng chiếm hết thời gian tận hưởng ngôi nhà. Hãy nhớ rằng sự an toàn thực sự đến từ năng lực bên trong, không phải số dư tài khoản.',
    icon: Anchor,
    story: "Bạn giống như một kiến trúc sư đang xây dựng tòa lâu đài của đời mình. Từng viên gạch được đặt xuống đều có tính toán kỹ lưỡng. Bạn làm việc chăm chỉ, tích lũy tài sản, xây dựng danh tiếng. Nhưng đôi khi, bạn quá mải mê xây tường bao quanh lâu đài đến mức quên mất việc mở cửa sổ để đón ánh nắng mặt trời. Bạn sợ rằng nếu dừng lại nghỉ ngơi, mọi thứ sẽ sụp đổ.",
    philosophy: "Triết lý của Người Kiến Tạo là 'Tích lũy'. Bạn tin rằng giá trị được đo đếm bằng những gì bạn sở hữu và để lại. Tuy nhiên, cái bẫy là bạn dễ trở thành nô lệ cho chính những gì mình tạo ra. Bạn sở hữu đồ vật, hay đồ vật sở hữu bạn?",
    blindspot: "Bạn thường đánh đồng 'An toàn' (Security) với 'Kiểm soát' (Control). Bạn cố gắng kiểm soát mọi biến số trong cuộc sống để tránh rủi ro, nhưng điều này khiến bạn trở nên cứng nhắc và thiếu linh hoạt trước những thay đổi bất ngờ của vũ trụ.",
    growthPath: "Học cách 'Buông bỏ kiểm soát'. Hãy chấp nhận rằng có những thứ nằm ngoài tầm tay của bạn. Xây dựng sự an toàn từ bên trong (năng lực, tâm thức) thay vì chỉ dựa vào bên ngoài (tài sản, địa vị). Hãy để cho tòa lâu đài của bạn có những khoảng trống để thở.",
    image: "/images/archetypes/Builder.png"
  },
  Leader: {
    title: 'Người Dẫn Dắt',
    tagline: 'Tạo ảnh hưởng, dẫn lối',
    superpower: 'Tầm nhìn xa và khả năng truyền cảm hứng.',
    shadow: 'Cái tôi lớn và nỗi sợ bị lãng quên.',
    description: 'Bạn tỏa sáng như một mặt trời nhỏ, thu hút các vệ tinh quay quanh mình. Bạn sinh ra để đứng mũi chịu sào và tạo ra tác động lớn.',
    advice: 'Ánh hào quang có thể thiêu đốt chính bạn. Hãy học cách trao quyền và lùi lại phía sau để người khác cũng được tỏa sáng.',
    icon: Star,
    story: "Bạn đứng trên đỉnh núi, nhìn thấy những vùng đất hứa mà người khác chưa thấy. Bạn khao khát dẫn dắt mọi người cùng đi đến đó. Tiếng nói của bạn có trọng lượng, sự hiện diện của bạn có sức hút. Nhưng trên đỉnh núi cao thường rất lạnh và cô đơn. Đôi khi bạn tự hỏi: Họ đi theo mình vì tầm nhìn của mình, hay chỉ vì ánh hào quang mình tỏa ra?",
    philosophy: "Triết lý của Người Dẫn Dắt là 'Ảnh hưởng'. Bạn tin rằng ý nghĩa cuộc đời nằm ở sự tác động lên người khác. Tuy nhiên, ranh giới giữa 'Dẫn dắt' (Leading) và 'Thao túng' (Manipulating) rất mong manh. Bạn đang phục vụ cộng đồng hay đang phục vụ cái tôi của chính mình?",
    blindspot: "Bạn dễ bị mắc kẹt trong 'Cái bẫy của sự vĩ đại'. Bạn sợ sự bình thường, sợ bị lãng quên. Điều này khiến bạn luôn phải gồng mình lên để tỏ ra mạnh mẽ, hoàn hảo, và không dám bộc lộ sự yếu đuối hay cần giúp đỡ.",
    growthPath: "Học cách 'Lãnh đạo từ phía sau' (Leading from behind). Hãy tìm thấy niềm vui khi thấy người khác thành công mà không cần bạn phải là trung tâm của sự chú ý. Chấp nhận sự dễ bị tổn thương (Vulnerability) như một sức mạnh, không phải điểm yếu.",
    image: "/images/archetypes/Leader.png"
  },
  Connector: {
    title: 'Người Kết Nối',
    tagline: 'Mạng lưới là sức mạnh',
    superpower: 'Sự thấu cảm và khả năng hàn gắn mối quan hệ.',
    shadow: 'Sự phụ thuộc cảm xúc và nỗi sợ bị bỏ rơi.',
    description: 'Hành tinh của bạn không cô đơn, nó luôn nằm trong một hệ sao đôi hoặc cụm sao. Bạn định nghĩa bản thân thông qua những người bạn yêu thương.',
    advice: 'Đừng đánh mất bản sắc riêng khi hòa mình vào tập thể. Hãy nhớ rằng bạn cần phải là một hành tinh trọn vẹn trước khi trở thành vệ tinh của ai đó.',
    icon: Heart,
    story: "Cuộc sống của bạn là một mạng lưới chằng chịt những sợi dây tình cảm. Bạn là người đầu tiên bạn bè gọi khi gặp chuyện buồn, là người luôn nhớ sinh nhật của mọi người. Bạn hạnh phúc khi thấy mọi người kết nối với nhau. Nhưng đôi khi, bạn cảm thấy mình như một trạm trung chuyển cảm xúc, nhận lấy nỗi buồn của người khác và quên mất nỗi buồn của chính mình.",
    philosophy: "Triết lý của Người Kết Nối là 'Hòa hợp'. Bạn tin rằng không ai là một hòn đảo. Tuy nhiên, nguy cơ là bạn dễ đánh mất ranh giới cá nhân (Boundaries). Bạn định nghĩa giá trị bản thân dựa trên sự cần thiết của người khác đối với bạn.",
    blindspot: "Bạn thường nhầm lẫn giữa 'Yêu thương' (Loving) và 'Làm hài lòng' (Pleasing). Bạn sợ nói 'Không' vì sợ làm người khác thất vọng, sợ bị từ chối. Điều này dẫn đến sự kiệt sức và cảm giác bị lợi dụng ngầm.",
    growthPath: "Học cách 'Thiết lập ranh giới'. Hãy hiểu rằng nói 'Không' với người khác đôi khi là nói 'Có' với chính mình. Xây dựng mối quan hệ dựa trên sự tôn trọng lẫn nhau, không phải dựa trên sự phụ thuộc hay hy sinh đơn phương.",
    image: "/images/archetypes/Connector.png"
  },
  Master: {
    title: 'Người Tinh Thông',
    tagline: 'Sự hoàn hảo là đích đến',
    superpower: 'Sự tập trung sâu sắc và tiêu chuẩn cao.',
    shadow: 'Sự cầu toàn thái quá và nỗi sợ thất bại.',
    description: 'Bạn giống như một hành tinh kim cương, được mài giũa tỉ mỉ qua áp lực. Bạn không chấp nhận sự hời hợt và luôn đào sâu đến tận cùng vấn đề.',
    advice: 'Hoàn hảo là kẻ thù của hoàn thành. Đôi khi, "đủ tốt" là tất cả những gì bạn cần để tiến về phía trước.',
    icon: Target,
    story: "Bạn là nghệ nhân đang tạc nên kiệt tác của đời mình. Bạn nhìn thấy những chi tiết sai sót mà người khác bỏ qua. Bạn không chấp nhận sự tầm thường. Bạn có thể dành hàng giờ, hàng ngày để tinh chỉnh một chi tiết nhỏ. Nhưng chính sự cầu toàn đó đôi khi trở thành chiếc lồng giam cầm bạn. Bạn sợ đưa tác phẩm ra ánh sáng vì sợ nó chưa đủ hoàn hảo, sợ bị phán xét.",
    philosophy: "Triết lý của Người Tinh Thông là 'Chất lượng'. Bạn tin rằng giá trị nằm ở chiều sâu và sự tinh tế. Tuy nhiên, cái bẫy là 'Sự tê liệt phân tích' (Analysis Paralysis). Bạn chuẩn bị quá kỹ mà quên mất việc hành động.",
    blindspot: "Bạn thường đánh đồng 'Thành tích' (Performance) với 'Giá trị bản thân' (Self-worth). Bạn nghĩ rằng mình chỉ đáng được yêu thương khi mình xuất sắc. Điều này tạo ra áp lực vô hình khổng lồ lên vai bạn.",
    growthPath: "Học cách 'Chấp nhận sự không hoàn hảo' (Wabi-sabi). Hãy nhìn nhận sai lầm như một phần tất yếu của quá trình học hỏi, không phải là bằng chứng của sự kém cỏi. Đặt ra giới hạn thời gian cho sự hoàn hảo và tập trung vào việc 'Hoàn thành' (Done is better than perfect).",
    image: "/images/archetypes/Master.png"
  },
  Seeker: {
    title: 'Người Tìm Đạo',
    tagline: 'Đi tìm ý nghĩa cuộc đời',
    superpower: 'Trực giác nhạy bén và tư duy triết học.',
    shadow: 'Sự xa rời thực tế và cảm giác vỡ mộng.',
    description: 'Bạn là hành tinh bí ẩn, luôn phát ra những tín hiệu tìm kiếm sự thật. Bạn không thỏa mãn với những câu trả lời bề mặt của xã hội.',
    advice: 'Đừng để việc tìm kiếm ý nghĩa khiến bạn quên mất việc sống. Ý nghĩa thường được tìm thấy trong những hành động nhỏ bé đời thường, không phải trên đỉnh núi cao.',
    icon: Sparkles,
    story: "Bạn luôn cảm thấy mình là người lạ trong thế giới này. Trong khi mọi người mải mê kiếm tiền, mua sắm, bạn tự hỏi: 'Ý nghĩa của tất cả những điều này là gì?'. Bạn đi tìm câu trả lời trong sách vở, tôn giáo, triết học. Bạn khao khát một sự thật tối thượng. Nhưng đôi khi, bạn bay quá cao đến mức quên mất đôi chân mình vẫn cần chạm đất. Bạn thấy cuộc sống đời thường thật tẻ nhạt và vô nghĩa.",
    philosophy: "Triết lý của Người Tìm Đạo là 'Chân lý'. Bạn tin rằng có một trật tự ngầm vận hành vũ trụ và bạn muốn thấu hiểu nó. Tuy nhiên, nguy cơ là 'Sự trốn tránh tâm linh' (Spiritual Bypassing) - dùng tâm linh để né tránh những vấn đề thực tế của cuộc sống.",
    blindspot: "Bạn dễ rơi vào trạng thái 'Vỡ mộng' (Disillusionment). Khi thực tế không đẹp như lý tưởng bạn vẽ ra, bạn dễ trở nên yếm thế, xa lánh xã hội hoặc rơi vào trầm cảm hiện sinh.",
    growthPath: "Học cách 'Thiền trong hành động'. Hãy tìm thấy sự linh thiêng ngay trong việc rửa bát, quét nhà, làm việc công sở. Kết nối lý tưởng cao đẹp với thực tế đời sống. Hãy nhớ: 'Trước khi giác ngộ, gánh nước bổ củi. Sau khi giác ngộ, gánh nước bổ củi'.",
    image: "/images/archetypes/Seeker.png"
  },
  Healer: {
    title: 'Người Chữa Lành',
    tagline: 'Phụng sự để hạnh phúc',
    superpower: 'Lòng trắc ẩn và khả năng nuôi dưỡng.',
    shadow: 'Sự hy sinh bản thân quá mức và kiệt sức.',
    description: 'Hành tinh của bạn xanh tươi và đầy sức sống, là nơi trú ẩn cho những linh hồn mệt mỏi. Bạn tìm thấy niềm vui khi giúp đỡ người khác.',
    advice: 'Bạn không thể rót nước từ một chiếc ly rỗng. Hãy chăm sóc khu vườn của chính mình trước khi đi tưới tắm cho khu vườn của người khác.',
    icon: Shield,
    story: "Bạn có một trái tim nhạy cảm, dễ rung động trước nỗi đau của người khác. Bạn muốn xoa dịu, chữa lành, mang lại bình yên cho thế giới. Bạn là người lắng nghe tuyệt vời. Nhưng đôi khi, bạn gánh vác quá nhiều nỗi đau không phải của mình. Bạn cho đi đến mức cạn kiệt, để rồi tự hỏi: 'Ai sẽ chữa lành cho người chữa lành?'.",
    philosophy: "Triết lý của Người Chữa Lành là 'Phụng sự'. Bạn tin rằng cho đi là còn mãi. Tuy nhiên, cái bẫy là 'Hội chứng Đấng Cứu Thế' (Savior Complex). Bạn nghĩ rằng mình có trách nhiệm phải cứu vớt người khác, và cảm thấy tội lỗi khi không làm được điều đó.",
    blindspot: "Bạn thường bỏ bê nhu cầu của chính mình. Bạn cảm thấy ích kỷ khi dành thời gian chăm sóc bản thân. Điều này dẫn đến sự oán giận ngầm (Resentment) khi sự hy sinh của bạn không được ghi nhận xứng đáng.",
    growthPath: "Học cách 'Yêu thương bản thân triệt để'. Hãy hiểu rằng chăm sóc bản thân là điều kiện tiên quyết để chăm sóc người khác hiệu quả. Thực hành 'Lòng trắc ẩn có ranh giới'. Giúp đỡ nhưng không làm thay, thấu cảm nhưng không đồng nhất.",
    image: "/images/archetypes/Healer.png"
  },
};


const quadrantDetails: Record<string, { title: string; desc: string; advice: string; color: string }> = {
  conscious_coherent: { 
    title: 'Tỉnh Thức & Nhất Quán', 
    desc: 'Bạn là một "Hành Tinh Vững Chãi". Bạn biết rõ mình muốn gì và hành động của bạn phản ánh đúng điều đó. Quỹ đạo của bạn ổn định và tràn đầy năng lượng.',
    advice: 'Thử thách tiếp theo: Làm thế nào để mở rộng quỹ đạo của bạn để tạo tác động lớn hơn? Đừng ngủ quên trên chiến thắng.',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  conscious_incoherent: { 
    title: 'Tỉnh Thức nhưng Chưa Nhất Quán', 
    desc: 'Bạn là một "Hành Tinh Đang Rung Lắc". Bạn nhận ra sự mâu thuẫn giữa giá trị bên trong và hành động bên ngoài. Bạn đang ở giai đoạn chuyển đổi đau đớn nhưng cần thiết.',
    advice: 'Đừng tự trách mình. Nhận thức là bước đầu tiên. Hãy chọn MỘT thay đổi nhỏ nhất để thu hẹp khoảng cách này ngay tuần tới.',
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  unconscious_coherent: { 
    title: 'Chưa Tỉnh Thức nhưng Nhất Quán', 
    desc: 'Bạn là một "Hành Tinh Ngủ Đông". Cuộc sống của bạn có vẻ ổn định, nhưng nó vận hành theo quán tính hoặc kỳ vọng của người khác, không phải từ lựa chọn chủ động của bạn.',
    advice: 'Hãy đặt câu hỏi "Tại sao?" cho những thói quen hàng ngày. Có thể bạn đang sống cuộc đời của ai đó chứ không phải của mình.',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  unconscious_incoherent: { 
    title: 'Chưa Tỉnh Thức & Chưa Nhất Quán', 
    desc: 'Bạn là một "Hành Tinh Lang Thang". Bạn cảm thấy lạc lõng, mâu thuẫn và không rõ nguyên nhân. Bạn đang trôi dạt theo các lực hấp dẫn bên ngoài.',
    advice: 'Dừng lại. Đừng cố chạy nhanh hơn. Hãy dành thời gian tĩnh lặng để lắng nghe tiếng nói nhỏ bé bên trong mình. Bạn cần tìm lại trọng tâm.',
    color: 'text-rose-600 bg-rose-50 border-rose-200'
  },
};

export default function Report({ scores, responses }: ReportProps) {
  const archetype = archetypeDetails[scores.composite.archetype.primary];
  const secondaryArchetype = archetypeDetails[scores.composite.archetype.secondary];
  const quadrant = quadrantDetails[scores.composite.quadrant.position];
  const ArchetypeIcon = archetype.icon;
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      // Inline all computed styles on SVG elements so html-to-image can capture them
      const svgElements = reportRef.current.querySelectorAll('svg');
      svgElements.forEach(svg => {
        const allElements = svg.querySelectorAll('*');
        allElements.forEach(el => {
          const computedStyle = window.getComputedStyle(el);
          const importantProps = ['fill', 'stroke', 'stroke-width', 'opacity', 'font-size', 'font-family', 'font-weight', 'text-anchor', 'dominant-baseline'];
          importantProps.forEach(prop => {
            const value = computedStyle.getPropertyValue(prop);
            if (value && value !== 'none' && value !== '') {
              (el as HTMLElement).style.setProperty(prop, value);
            }
          });
        });
      });

      const imgData = await toPng(reportRef.current, {
        quality: 0.8,
        pixelRatio: 1.5,
        backgroundColor: '#f9fafb',
        cacheBust: true,
        skipAutoScale: true,
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Multi-page: split the image across pages if it exceeds one A4 page
      let heightLeft = pdfImgHeight;
      let position = 0;
      
      // First page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImgHeight);
      heightLeft -= pdfPageHeight;
      
      // Additional pages
      while (heightLeft > 0) {
        position -= pdfPageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImgHeight);
        heightLeft -= pdfPageHeight;
      }
      
      pdf.save(`Tieu_Hanh_Tinh_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Radar Data
  const radarData = scores.modules.m2.declaredRanking.map((pillar) => {
    const declaredRank = scores.modules.m2.declaredRanking.indexOf(pillar);
    const declaredScore = (7 - declaredRank) * 10 + 10;
    const actualRank = scores.modules.m2.actualRanking.indexOf(pillar);
    const actualScore = (7 - actualRank) * 10 + 10;
    return {
      subject: pillarNames[pillar],
      A: declaredScore,
      B: actualScore,
      fullMark: 80,
    };
  });

  // Calculate top gap
  const gapData = scores.modules.m2.declaredRanking.length > 0 ? scores.modules.m2.declaredRanking.map(p => {
    const dRank = scores.modules.m2.declaredRanking.indexOf(p);
    const aRank = scores.modules.m2.actualRanking.indexOf(p);
    return { pillar: p, gap: Math.abs(dRank - aRank), direction: dRank < aRank ? 'under' : 'over' };
  }).sort((a, b) => b.gap - a.gap)[0] : { pillar: 'freedom' as Pillar, gap: 0, direction: 'under' };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 pb-20 overflow-x-hidden" ref={reportRef}>
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[700px] overflow-hidden bg-indigo-950">
        <div className="absolute inset-0 bg-[url('/images/stardust.png')] opacity-30 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10"></div>
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2 }}
          src={COVER_IMAGE} 
          alt="Cosmic Cover" 
          className="w-full h-full object-cover absolute inset-0 mix-blend-overlay"
        />
        
        {/* Top Navigation / Branding */}
        <div className="absolute top-0 left-0 right-0 z-30 p-8 flex justify-between items-center text-white/90">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-indigo-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-widest uppercase leading-none">Tiểu Hành Tinh</span>
                  <span className="text-[10px] text-indigo-300 tracking-wider uppercase">Little Asteroid</span>
                </div>
            </div>
            <div className="text-right hidden md:block">
                <div className="text-xs text-indigo-300 uppercase tracking-widest mb-1">Author</div>
                <div className="text-sm italic text-white">Lê Công Hoàng</div>
            </div>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-5xl"
          >
            <div className="mb-8 flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-400"></div>
                <span className="text-sm md:text-base font-medium tracking-[0.3em] uppercase text-indigo-200 text-shadow-sm">
                  Báo cáo Giải mã Bản thân
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-indigo-400"></div>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-9xl font-bold mb-6 sm:mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 drop-shadow-2xl">
              {archetype.title}
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-4xl text-indigo-100 italic max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              "{archetype.tagline}"
            </p>

             <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="mt-8 sm:mt-12 px-6 py-4 sm:px-10 sm:py-5 bg-white text-indigo-950 hover:bg-indigo-50 rounded-full font-bold text-base sm:text-lg flex items-center gap-3 transition-all mx-auto shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)]"
            >
              {isDownloading ? (
                <span className="animate-pulse">Đang tạo PDF...</span>
              ) : (
                <>
                  <Download className="w-6 h-6" /> Tải Báo Cáo (PDF)
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-white/40"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em]">Khám phá</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0"></div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-30 space-y-16">
        
        {/* 2. INTRO CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
        >
          <div className="flex items-start gap-6">
            <div className="text-6xl text-indigo-200 hidden md:block">❝</div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Chào bạn,</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Mỗi chúng ta là một tiểu hành tinh độc nhất trong vũ trụ bao la này. Không có quỹ đạo nào là "đúng" hay "sai", chỉ có quỹ đạo phù hợp với trọng lực riêng của bạn.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Báo cáo này không phải là một bản án, mà là một tấm bản đồ. Nó cho thấy nơi bạn đang đứng, những nguồn lực bạn đang có, và những mâu thuẫn bạn đang mang theo.
              </p>
              
              {/* Insight from M2_Q10 (Cut First) */}
              {getResponseText(responses, 'M2_Q10') && (
                <div className="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-500 italic text-indigo-800">
                  "Khi áp lực ập đến, điều đầu tiên bạn hy sinh là: <strong>{getResponseText(responses, 'M2_Q10')}</strong>." 
                  <br/>
                  <span className="text-sm not-italic mt-2 block text-indigo-600">— Đây chính là "vùng đệm" (buffer) của bạn, nhưng nếu lạm dụng, nó sẽ trở thành điểm yếu chí mạng.</span>
                </div>
              )}

              {/* Insight from M2_Q11 (Protect Most) */}
              {getResponseText(responses, 'M2_Q11') && (
                <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500 italic text-purple-800 mt-4">
                  "Ngược lại, bạn bảo vệ quyết liệt nhất: <strong>{getResponseText(responses, 'M2_Q11')}</strong>."
                  <br/>
                  <span className="text-sm not-italic mt-2 block text-purple-600">— Đây là trọng tâm hấp dẫn (gravity center) của cuộc đời bạn hiện tại.</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 3. ARCHETYPE DEEP DIVE */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-300 flex-1"></div>
            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">Hồ Sơ Năng Lực</h2>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Primary Archetype */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl text-white shadow-lg relative overflow-hidden"
            >
              <div className="h-64 w-full relative">
                <img src={archetype.image} alt={archetype.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-transparent"></div>
              </div>
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 p-8 pt-0">
                <div className="flex items-center gap-4 mb-6 -mt-12">
                  <div className="p-3 bg-indigo-900/50 rounded-2xl backdrop-blur-md shadow-lg border border-white/20">
                    <ArchetypeIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="drop-shadow-md">
                    <div className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Archetype Chính</div>
                    <h3 className="text-3xl font-bold">{archetype.title}</h3>
                  </div>
                </div>

                <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                  {archetype.description}
                </p>

                <div className="space-y-6 mb-8">
                  <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3 mb-2 text-emerald-300 font-bold uppercase text-sm tracking-wide">
                      <Zap className="w-4 h-4" /> Vũ Khí Bí Mật
                    </div>
                    <p className="text-white/90">{archetype.superpower}</p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3 mb-2 text-rose-300 font-bold uppercase text-sm tracking-wide">
                      <AlertTriangle className="w-4 h-4" /> Vùng Tối (Shadow)
                    </div>
                    <p className="text-white/90">{archetype.shadow}</p>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/20 pt-8">
                  {/* Extended Content for Sample Report or Full Report */}
                  {archetype.story && (
                    <div className="mb-8 space-y-6">
                      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-300" /> Câu chuyện của bạn
                        </h4>
                        <p className="text-indigo-50 italic leading-relaxed text-sm">
                          "{archetype.story}"
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">Triết lý sống</div>
                          <p className="text-sm text-white/90">{archetype.philosophy}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                          <div className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-2">Điểm mù chí mạng</div>
                          <p className="text-sm text-white/90">{archetype.blindspot}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {archetype.growthPath && (
                       <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-5 border border-white/10">
                          <div className="flex items-center gap-3 mb-2 text-amber-300 font-bold uppercase text-sm tracking-wide">
                            <Target className="w-4 h-4" /> Lộ trình phát triển
                          </div>
                          <p className="text-white/90 font-medium">{archetype.growthPath}</p>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Secondary Archetype */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-start overflow-hidden relative"
            >
              <div className="h-48 w-full relative">
                <img src={secondaryArchetype.image} alt={secondaryArchetype.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
              </div>
              <div className="p-8 pt-0 relative z-10">
                <div className="mb-6 -mt-8 relative">
                  <div className="text-indigo-600 text-sm font-bold uppercase tracking-wider mb-1 drop-shadow-sm">Archetype Phụ</div>
                  <h3 className="text-3xl font-bold text-gray-900 drop-shadow-sm">{secondaryArchetype.title}</h3>
                  <p className="text-gray-600 italic font-medium mt-1">{secondaryArchetype.tagline}</p>
                </div>
              
              <p className="text-gray-600 mb-8">
                {secondaryArchetype.description}
              </p>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Sự kết hợp độc đáo
                </h4>
                <p className="text-gray-600 text-sm">
                  Sự pha trộn giữa <strong>{archetype.title}</strong> và <strong>{secondaryArchetype.title}</strong> tạo nên một con người vừa có tầm nhìn xa, vừa có khả năng thực thi chi tiết. Bạn có mâu thuẫn nội tâm giữa <em>{archetype.tagline}</em> và <em>{secondaryArchetype.tagline}</em>, nhưng đó cũng chính là động lực phát triển của bạn.
                </p>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="pt-6 space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center gap-2 mb-1 text-emerald-700 font-bold uppercase text-xs tracking-wide">
                        <Zap className="w-3 h-3" /> Siêu năng lực
                      </div>
                      <p className="text-gray-700 text-sm">{secondaryArchetype.superpower}</p>
                    </div>
                    <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                      <div className="flex items-center gap-2 mb-1 text-rose-700 font-bold uppercase text-xs tracking-wide">
                        <AlertTriangle className="w-3 h-3" /> Vùng tối
                      </div>
                      <p className="text-gray-700 text-sm">{secondaryArchetype.shadow}</p>
                    </div>
                  </div>

                  {/* Extended Info */}
                  {secondaryArchetype.story && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                          <BookOpen className="w-4 h-4 text-indigo-500" /> Câu chuyện
                        </h4>
                        <p className="text-gray-600 italic text-sm leading-relaxed">
                          "{secondaryArchetype.story}"
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Triết lý</div>
                            <p className="text-sm text-gray-700">{secondaryArchetype.philosophy}</p>
                         </div>
                         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">Điểm mù</div>
                            <p className="text-sm text-gray-700">{secondaryArchetype.blindspot}</p>
                         </div>
                      </div>

                      {secondaryArchetype.growthPath && (
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                           <div className="flex items-center gap-2 mb-1 text-indigo-700 font-bold uppercase text-xs tracking-wide">
                             <Target className="w-3 h-3" /> Lời khuyên phát triển
                           </div>
                           <p className="text-gray-700 text-sm font-medium">{secondaryArchetype.growthPath}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. THE 7 PILLARS & RADAR CHART */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-300 flex-1"></div>
            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">Bản Đồ 7 Trụ Cột</h2>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center justify-center gap-2 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Giá trị Tuyên bố vs. Hành vi Thực tế</h3>
                <div className="group relative">
                  <Info className="w-5 h-5 text-gray-400 cursor-help hover:text-indigo-500 transition-colors" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="space-y-2">
                      <p><strong className="text-indigo-300">Giá trị Tuyên bố (Xanh):</strong> Những gì bạn nghĩ là quan trọng.</p>
                      <p><strong className="text-rose-300">Hành vi Thực tế (Đỏ):</strong> Những gì bạn thực sự làm.</p>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[280px] sm:h-[350px] md:h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={(props: any) => {
                        const { payload, x, y, textAnchor, stroke, radius } = props;
                        const isMaxGap = payload.value === pillarNames[gapData.pillar as Pillar];
                        return (
                          <g className="recharts-layer recharts-polar-angle-axis-tick">
                            <text
                              radius={radius}
                              stroke={stroke}
                              x={x}
                              y={y}
                              className="recharts-text recharts-polar-angle-axis-tick-value"
                              textAnchor={textAnchor}
                            >
                              <tspan x={x} dy="0.355em" fill={isMaxGap ? '#e11d48' : '#4b5563'} fontWeight={isMaxGap ? 800 : 600} fontSize={isMaxGap ? 13 : 12}>
                                {payload.value}
                              </tspan>
                              {isMaxGap && <tspan x={x} dy="1.2em" fill="#e11d48" fontSize={10} fontWeight="bold">⚠ Mâu thuẫn</tspan>}
                            </text>
                          </g>
                        );
                      }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 80]} tick={false} axisLine={false} />
                    <Radar
                      name="Tuyên bố (Lời bạn nói)"
                      dataKey="A"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="#8b5cf6"
                      fillOpacity={0.1}
                    />
                    <Radar
                      name="Thực tế (Việc bạn làm)"
                      dataKey="B"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 mt-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-600">Điều bạn NÓI là quan trọng</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-gray-600">Điều bạn LÀM thực tế</span>
                </div>
              </div>
            </div>

            {/* Insights Area */}
            <div className="space-y-6">
              <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                <div className="flex items-center gap-3 mb-3 text-rose-700 font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  Vùng Mâu Thuẫn Lớn Nhất
                </div>
                <p className="text-gray-700 mb-4">
                  {gapData.direction === 'under' ? (
                    <>Bạn tuyên bố <strong>{pillarNames[gapData.pillar as Pillar]}</strong> rất quan trọng, nhưng hành vi thực tế lại đang xếp nó ở mức thấp.</>
                  ) : (
                    <>Bạn tuyên bố <strong>{pillarNames[gapData.pillar as Pillar]}</strong> ít quan trọng, nhưng thực tế bạn đang dành quá nhiều nguồn lực cho nó.</>
                  )}
                </p>
                <div className="bg-white p-4 rounded-xl text-sm text-gray-600 italic border border-rose-100">
                  "Khoảng cách giữa lời nói và hành động chính là nơi sự thất vọng nảy sinh. Bạn đang tự lừa dối mình hay đang gặp rào cản thực sự?"
                </div>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <div className="flex items-center gap-3 mb-3 text-indigo-700 font-bold">
                  <CheckCircle className="w-5 h-5" />
                  Điểm Sáng Nhất Quán
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-700 font-medium">Chỉ số VBC (Nhất quán):</span>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-indigo-400 cursor-help hover:text-indigo-600 transition-colors" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="space-y-2">
                        <p><strong className="text-indigo-300">VBC (Value-Behavior Consistency):</strong> Đo lường mức độ khớp nhau giữa giá trị bạn tuyên bố và hành động thực tế.</p>
                        <p>Điểm càng cao, bạn càng sống thật với chính mình.</p>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  <strong>{Math.round(scores.modules.m2.vbcScore * 100)}%</strong>.
                  {scores.modules.m2.vbcScore > 0.7 
                    ? " Bạn sống rất thật với giá trị của mình. Hãy duy trì điều này!" 
                    : " Có vẻ như cuộc sống hiện tại đang cuốn bạn đi xa khỏi những gì bạn thực sự trân trọng."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. THE MATRIX & DIAGNOSIS */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-300 flex-1"></div>
            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">Ma Trận Tỉnh Thức</h2>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <div className={`rounded-3xl p-8 md:p-12 border-2 ${quadrant.color.replace('text-', 'border-').split(' ')[2]} ${quadrant.color.split(' ')[1]}`}>
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-block px-4 py-1 bg-white rounded-full text-sm font-bold shadow-sm uppercase tracking-wide">
                  Vị trí của bạn
                </div>
                <h3 className={`text-4xl font-bold ${quadrant.color.split(' ')[0]}`}>
                  {quadrant.title}
                </h3>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {quadrant.desc}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {/* Trục Tung - Awareness */}
                  <div className="bg-white/60 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm text-gray-500 font-bold">Trục Tung (Awareness)</div>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help hover:text-blue-500 transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          <p><strong className="text-blue-300">Nhận thức (Awareness):</strong> Tổng hợp từ bài đánh giá OCA (60%) và Tự đánh giá (40%). Đo lường độ sâu sắc trong việc hiểu rõ bản thân và các tác động từ quyết định của bạn.</p>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    {/* Tính phần trăm hiển thị (lấy từ selfReportAwareness và oca) - Do không get được biến awareness ở đây, tạm tính qua OCA thô */}
                    <div className="text-2xl font-bold text-gray-900">{Math.round((scores.modules.m3.ocaScore / 12) * 100)}%</div>
                    <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(scores.modules.m3.ocaScore / 12) * 100}%` }}></div>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">Dựa trên Chỉ số Tỉnh thức OCA ({scores.modules.m3.ocaScore}/12)</div>
                  </div>

                  {/* Trục Hoành - Coherence */}
                  <div className="bg-white/60 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm text-gray-500 font-bold">Trục Hoành (Coherence)</div>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help hover:text-green-500 transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          <p><strong className="text-green-300">Nhất quán (Coherence):</strong> Tổng hợp từ độ lệch 7 Trụ cột (60%) và Tự đánh giá (40%). Hành động thực tế của bạn có đang khớp với những gì bạn nói hay không.</p>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    {/* Tính phần trăm hiển thị VBC */}
                    <div className="text-2xl font-bold text-gray-900">{Math.round(scores.modules.m2.vbcScore * 100)}%</div>
                    <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${scores.modules.m2.vbcScore * 100}%` }}></div>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">Dựa trên Độ nhất quán 7 Trụ Cột VBC</div>
                  </div>
                </div>

                {/* 2D Quadrant Matrix */}
                <div className="mt-8 bg-white/60 p-6 md:p-12 rounded-3xl relative shadow-sm border border-gray-100 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-4 justify-center w-full">
                     <Compass className="w-5 h-5 text-indigo-500" />
                     <h4 className="font-bold text-gray-900 text-xl">Bản đồ Định vị Chi tiết</h4>
                  </div>
                  <p className="text-gray-500 text-sm mb-12 text-center max-w-md">Vị trí chẩn đoán dựa trên mức độ Nhận thức thấu đáo và tính Nhất quán trong hành động của bạn.</p>
                  
                  <div className="relative w-full max-w-[280px] md:max-w-[340px] mx-auto mb-8 mt-4">
                    {/* Top Label */}
                    <div className="absolute -top-10 left-0 right-0 text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      Nhận thức Cao (Awareness)
                    </div>
                    {/* Bottom Label */}
                    <div className="absolute -bottom-10 left-0 right-0 text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      Nhận thức Thấp
                    </div>
                    {/* Left Label - hidden on small mobile */}
                    <div className="absolute top-0 bottom-0 -left-12 md:-left-16 hidden sm:flex items-center justify-center">
                      <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase -rotate-90 whitespace-nowrap tracking-widest">
                        Nhất quán Thấp
                      </div>
                    </div>
                    {/* Right Label - hidden on small mobile */}
                    <div className="absolute top-0 bottom-0 -right-12 md:-right-16 hidden sm:flex items-center justify-center">
                      <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase rotate-90 whitespace-nowrap tracking-widest">
                        Nhất quán Cao
                      </div>
                    </div>

                    {/* Matrix Grid Box */}
                    <div className="relative w-full aspect-square border-2 border-gray-200 rounded-xl bg-white shadow-inner">
                      {/* Inner Layer for quadrant backgrounds (clips to rounded corners) */}
                      <div className="absolute inset-0 rounded-[10px] overflow-hidden">
                        {/* 03. Rung lắc (Top-Left) */}
                        <div className="absolute top-0 left-0 w-[55%] h-[45%] bg-yellow-50 flex items-center justify-center">
                          <span className="text-yellow-600/30 font-bold uppercase text-xs md:text-sm tracking-widest">03. Rung lắc</span>
                        </div>
                        {/* 04. Vững chãi (Top-Right) */}
                        <div className="absolute top-0 right-0 w-[45%] h-[45%] bg-emerald-50 flex items-center justify-center">
                          <span className="text-emerald-600/30 font-bold uppercase text-xs md:text-sm tracking-widest">04. Vững chãi</span>
                        </div>
                        {/* 02. Mâu thuẫn (Bottom-Left) */}
                        <div className="absolute bottom-0 left-0 w-[55%] h-[55%] bg-gray-50 flex items-center justify-center">
                          <span className="text-gray-500/30 font-bold uppercase text-xs md:text-sm tracking-widest">02. Mâu thuẫn</span>
                        </div>
                        {/* 01. Ngủ đông (Bottom-Right) */}
                        <div className="absolute bottom-0 right-0 w-[45%] h-[55%] bg-blue-50 flex items-center justify-center">
                          <span className="text-blue-600/30 font-bold uppercase text-xs md:text-sm tracking-widest">01. Ngủ đông</span>
                        </div>
                        
                        {/* Axes lines */}
                        <div className="absolute top-0 bottom-0 w-px bg-gray-300 z-10" style={{ left: '55%' }}></div>
                        <div className="absolute left-0 right-0 h-px bg-gray-300 z-10" style={{ top: '45%' }}></div>
                        <div className="absolute w-2 h-2 rounded-full bg-gray-400 z-10" style={{ left: 'calc(55% - 4px)', top: 'calc(45% - 4px)' }}></div>
                      </div>

                      {/* Data Point Layer - Overflow Visible to prevent tooltip clipping */}
                      <div className="absolute inset-0 z-30 pointer-events-none">
                        <div 
                          className="absolute w-5 h-5 -ml-2.5 mb-2.5 rounded-full bg-indigo-600 border-[3px] border-white shadow-[0_0_10px_rgba(79,70,229,0.5)] flex items-center justify-center"
                          style={{ 
                            left: `${Math.max(2, Math.min(98, scores.composite.coherence * 100))}%`, 
                            bottom: `${Math.max(2, Math.min(98, scores.composite.awareness * 100))}%`,
                            transition: 'left 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.5s, bottom 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.5s'
                          }}
                        >
                          {/* Pulse Effect */}
                          <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-75"></div>
                          
                          {/* Dynamic Tooltip Position */}
                          {scores.composite.awareness > 0.8 ? (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] md:text-xs py-1 px-2.5 rounded whitespace-nowrap shadow-md font-medium">
                              Bạn ở đây
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                          ) : (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] md:text-xs py-1 px-2.5 rounded whitespace-nowrap shadow-md font-medium">
                              Bạn ở đây
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="w-full md:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Lời khuyên thoát hiểm
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {quadrant.advice}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. ACTION PLAN */}
        <section className="space-y-8 pb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-300 flex-1"></div>
            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">Hành Động Ngay</h2>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mb-4">1</div>
              <h4 className="font-bold text-gray-900 mb-2">Thí nghiệm 7 ngày</h4>
              <p className="text-gray-600 text-sm">
                Chọn một hoạt động thuộc trụ cột <strong>{pillarNames[gapData.pillar as Pillar]}</strong> và dành đúng 30 phút mỗi ngày cho nó. Không hơn, không kém. Ghi lại cảm xúc của bạn.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mb-4">2</div>
              <h4 className="font-bold text-gray-900 mb-2">Đối thoại với Nỗi sợ</h4>
              <p className="text-gray-600 text-sm">
                Viết xuống giấy nỗi sợ lớn nhất của bạn: "Tôi sợ <strong>{archetype.shadow.toLowerCase()}</strong>". Sau đó tự hỏi: "Nếu điều đó xảy ra, mình có chết không?".
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold mb-4">3</div>
              <h4 className="font-bold text-gray-900 mb-2">Định nghĩa lại Thành công</h4>
              <p className="text-gray-600 text-sm">
                Thay vì nhìn vào kết quả, hãy đánh giá tuần tới dựa trên sự "Nhất quán". Bạn có làm những gì bạn nói không? Đó là thước đo duy nhất quan trọng lúc này.
              </p>
            </div>
          </div>
        </section>

        {/* 7. EXPLORE OTHER ARCHETYPES */}
        <section className="space-y-8 pb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-300 flex-1"></div>
            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">Khám Phá Các Archetype Khác</h2>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(archetypeDetails) as Archetype[]).filter(a => a !== scores.composite.archetype.primary).map((key) => {
              const arch = archetypeDetails[key];
              const Icon = arch.icon;

              return (
                <div 
                  key={key}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-gray-100 text-gray-600">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{arch.title}</h4>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{arch.tagline}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {arch.description}
                    </p>

                    <div className="pt-4 border-t border-gray-100 space-y-4 mt-auto">
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <div className="text-xs font-bold uppercase text-emerald-600 mb-1">Siêu năng lực</div>
                              <p className="text-sm text-gray-700">{arch.superpower}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <div className="text-xs font-bold uppercase text-rose-600 mb-1">Vùng tối</div>
                              <p className="text-sm text-gray-700">{arch.shadow}</p>
                            </div>
                         </div>
                         <div className="bg-indigo-50 p-4 rounded-xl">
                            <div className="text-xs font-bold uppercase text-indigo-600 mb-1">Lời khuyên</div>
                            <p className="text-sm text-indigo-800 italic">"{arch.advice}"</p>
                         </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. ABOUT AUTHOR & METHODOLOGY */}
        <section className="space-y-8 pb-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                  Nguồn gốc Học thuyết
                </div>
                <h3 className="text-3xl font-bold text-white">
                  Về Tác Giả & Phương Pháp Luận
                </h3>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    Hệ thống phân tích <strong>Tiểu Hành Tinh (Little Asteroid)</strong> và lý thuyết <strong>Chi phí cơ hội (Opportunity Cost)</strong> trong ứng dụng này được nghiên cứu và phát triển độc quyền bởi tác giả <strong>Lê Công Hoàng</strong>.
                  </p>
                  <p>
                    Phương pháp này kết hợp giữa <em>Tâm lý học hành vi</em>, <em>Kinh tế học</em> và <em>Triết học phương Đông</em> để giúp mỗi cá nhân nhận diện "trọng lực" riêng của mình, từ đó đưa ra những quyết định cuộc đời ít hối tiếc nhất.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400 italic">
                    "Cuốn sách này không vẽ ra quỹ đạo cho bạn. Nó chỉ giúp bạn nhìn thấy quỹ đạo của chính mình."
                  </p>
                  <p className="text-sm font-bold text-white mt-1 mb-6">— Lê Công Hoàng</p>
                  
                  <a 
                    href="/TieuHanhTinh_LeCongHoang.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/50 hover:shadow-indigo-500/50 font-sans"
                  >
                    <BookOpen className="w-4 h-4" />
                    Tải Ebook Tiểu Hành Tinh
                  </a>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="w-40 h-40 bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-sm relative">
                  <div className="absolute inset-0 border border-white/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">©</div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mt-1">Copyright</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm pt-12 border-t border-gray-200">
          <p className="mb-2">Tiểu Hành Tinh © 2026. Hành trình vạn dặm bắt đầu từ một bước chân tỉnh thức.</p>
          <p className="font-medium text-gray-500">Bản quyền và học thuyết Tiểu Hành Tinh thuộc về tác giả Lê Công Hoàng.</p>
          <div className="mt-4 max-w-2xl mx-auto text-xs text-gray-400 leading-relaxed">
            <p className="font-semibold mb-1">Miễn trừ trách nhiệm:</p>
            <p>
              Báo cáo này được tạo ra dựa trên các câu trả lời của bạn và mô hình lý thuyết Tiểu Hành Tinh. 
              Nó chỉ mang tính chất tham khảo và hỗ trợ khám phá bản thân, không thay thế cho lời khuyên chuyên môn về tâm lý, tài chính hay y tế. 
              Tác giả và đội ngũ phát triển không chịu trách nhiệm về các quyết định cá nhân được đưa ra dựa trên thông tin này.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
