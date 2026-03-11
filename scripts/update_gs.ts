import fs from 'fs';
import { questions } from '../src/data/questions';

const gsPath = './public/google_form_script.gs';
let gsContent = fs.readFileSync(gsPath, 'utf8');

const questionsJson = JSON.stringify(questions, null, 2);

// Replace the questions array
gsContent = gsContent.replace(/const questions = \[[\s\S]*?\];\n  \/\/ --/, `const questions = ${questionsJson};\n  // --`);

// Update the text to match LandingPage exactly
gsContent = gsContent.replace(
  /intro2\.setTitle\('Tại Sao Tôi Lạc Lối\?'\)\n\s*\.setHelpText\([\s\S]*?\);/,
  `intro2.setTitle('Bi kịch của thế hệ chúng ta: Tự do nhưng Mất phương hướng')
    .setHelpText('Chưa bao giờ trong lịch sử, con người có nhiều lựa chọn như bây giờ. Nhưng nghịch lý thay, sự dư thừa lựa chọn lại tạo ra "tê liệt".\\n\\n' +
    'Chúng ta đứng trước ngã ba đường, sợ hãi rằng chọn con đường này đồng nghĩa với việc bỏ lỡ những con đường khác. Đó là nỗi đau của Học thuyết Chi phí Cơ hội.\\n\\n' +
    '"Chi phí cơ hội cuối cùng nhất là dành trọn cuộc đời trong ảo tưởng - tin rằng những thứ vô thường có thể mang lại sự thỏa mãn vĩnh viễn."');`
);

gsContent = gsContent.replace(
  /intro3\.setTitle\('Bạn Có Thấy Mình Trong Những Câu Chuyện Này\?'\)\n\s*\.setHelpText\([\s\S]*?\);/,
  `intro3.setTitle('Bạn Có Thấy Mình Trong Những Câu Chuyện Này?')
    .setHelpText(
    '⚓ Chiếc Còng Tay Vàng:\\n' +
    'Lương tháng 9 chữ số, check-in những nhà hàng sang trọng nhất. Bố mẹ tự hào, bạn bè ngưỡng mộ. Nhưng mỗi sáng thức dậy, bạn phải đấu tranh để rời khỏi giường. Cậu cảm thấy mình như một cỗ máy đang chạy mòn, đánh đổi toàn bộ thời gian tự do và sức khỏe để lấy những con số vô hồn trong tài khoản.\\n\\n' +
    
    '🧭 Sự Trôi Dạt Vô Định:\\n' +
    'Từ chối sự gò bó công sở để "sống cuộc đời mình muốn". Nhưng đằng sau những bức ảnh lung linh là nỗi lo âu triền miên về tương lai. "Tự do này... có phải là cái giá quá đắt?"\\n\\n' +

    '❤️ Cái Bóng Của Kỳ Vọng:\\n' +
    'Học ngành bố mẹ chọn, làm công việc họ hàng khen ngợi, yêu người mà gia đình ưng ý. Bạn đang sống cuộc đời của một diễn viên quần chúng trong chính bộ phim của mình.');`
);

gsContent = gsContent.replace(
  /intro4\.setTitle\('3 Loại "Nghèo" Hiện Đại'\)\n\s*\.setHelpText\([\s\S]*?\);/,
  `intro4.setTitle('3 Loại "Nghèo" Hiện Đại')
    .setHelpText(
    '1. Nghèo Tự Do: Bạn bị trói buộc vào guồng quay kiếm tiền hoặc công việc, không bao giờ cảm thấy đủ. Mặc dù có thể dư dả vật chất nhưng bạn lại khánh kiệt sự thảnh thơi dành cho chính mình.\\n' +
    '2. Nghèo Ý Nghĩa: Bạn có tất cả công việc ổn định, thu nhập tốt, gia đình êm ấm. Nhưng mỗi sáng thức dậy, bạn vẫn cảm thấy trống rỗng.\\n' +
    '3. Nghèo Kết Nối: Bạn có hàng ngàn bạn bè trên mạng xã hội, nhưng không có ai để nói chuyện chân thật khi gục ngã.');`
);

gsContent = gsContent.replace(
  /pageBreak\.setTitle\('PHẦN 2: BẮT ĐẦU BÀI KHẢO SÁT CHÍNH THỨC'\)\n\s*\.setHelpText\([\s\S]*?\);/,
  `pageBreak.setTitle('PHẦN 2: BẮT ĐẦU BÀI KHẢO SÁT CHÍNH THỨC')
    .setHelpText('Hãy thả lỏng và điền thật trung thực. Dữ liệu của bạn được bảo mật tuyệt đối và chỉ dùng để tạo báo cáo cá nhân. 28 câu hỏi này sẽ giúp bạn vẽ lại bản đồ nội tâm và định vị chính xác bạn đang ở đâu trong vũ trụ này.');`
);

fs.writeFileSync(gsPath, gsContent, 'utf8');
console.log('google_form_script.gs updated dynamically!');
