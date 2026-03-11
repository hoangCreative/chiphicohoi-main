import fs from 'fs';

const gsPath = './public/google_form_script.gs';
let gsContent = fs.readFileSync(gsPath, 'utf8');

const newIntroCode = `  // -------------------------------------------------------------------------------- //
  // PHẦN 1: BÀI VIẾT GIỚI THIỆU VÀ HƯỚNG DẪN 
  // -------------------------------------------------------------------------------- //

  const intro1 = form.addSectionHeaderItem();
  intro1.setTitle('🪐 HỌC THUYẾT CHI PHÍ CƠ HỘI & TIỂU HÀNH TINH')
    .setHelpText('"Cuốn sách này không vẽ ra quỹ đạo cho bạn. Nó chỉ giúp bạn nhìn thấy quỹ đạo của chính mình."\\n\\n' +
    '👇 [HƯỚNG DẪN DÀNH CHO ADMIN: Bấm "Thêm hình ảnh" ở thanh công cụ bên phải và tải lên ảnh public/images/cosmic_hero_cover.png vào ngay dưới mục này]');

  const intro2 = form.addSectionHeaderItem();
  intro2.setTitle('📖 Bi kịch của thế hệ chúng ta: Tự do nhưng Mất phương hướng')
    .setHelpText('Trích từ sách Tiểu Hành Tinh:\\n\\n' +
    'Chưa bao giờ trong lịch sử, con người có nhiều lựa chọn như bây giờ. Nhưng nghịch lý thay, sự dư thừa lựa chọn lại tạo ra "tê liệt". Chúng ta đứng trước ngã ba đường, sợ hãi rằng chọn con đường này đồng nghĩa với việc bỏ lỡ những con đường khác. Đó là nỗi đau của Học thuyết Chi phí Cơ hội.\\n\\n' +
    '"Chi phí cơ hội cuối cùng nhất là dành trọn cuộc đời trong ảo tưởng - tin rằng những thứ vô thường có thể mang lại sự thỏa mãn vĩnh viễn."\\n\\n' +
    'Mỗi quyết định bạn đưa ra đều có giá của nó. Bài test này được thiết kế dựa trên nội dung sách để giúp bạn lượng hóa cái giá đó.');

  const intro3 = form.addSectionHeaderItem();
  intro3.setTitle('⚓ Kịch bản 1: Chiếc Còng Tay Vàng')
    .setHelpText('Lương tháng 9 chữ số, check-in những nhà hàng sang trọng nhất. Bố mẹ tự hào, bạn bè ngưỡng mộ. Nhưng mỗi sáng thức dậy, bạn phải đấu tranh để rời khỏi giường. Cậu cảm thấy mình như một cỗ máy đang chạy mòn, đánh đổi toàn bộ thời gian tự do và sức khỏe để lấy những con số vô hồn trong tài khoản.\\n' +
    'Bạn dư dả vật chất nhưng lại là một "người nghèo Tự Do".\\n\\n' +
    '👇 [ADMIN: Thêm hình ảnh public/images/golden_handcuffs.png]');

  const intro4 = form.addSectionHeaderItem();
  intro4.setTitle('🧭 Kịch bản 2: Sự Trôi Dạt Vô Định')
    .setHelpText('Từ chối sự gò bó công sở để "sống cuộc đời mình muốn". Nhưng đằng sau những bức ảnh lung linh trên mạng là nỗi lo âu triền miên về tương lai. "Tự do này... có phải là cái giá quá đắt?"\\n' +
    'Rời bỏ quỹ đạo ổn định, bạn trở thành một phi hành gia trôi dạt vô định giữa vũ trụ bao la.\\n\\n' +
    '👇 [ADMIN: Thêm hình ảnh public/images/drifting_astronaut.png]');

  const intro5 = form.addSectionHeaderItem();
  intro5.setTitle('❤️ Kịch bản 3: Cái Bóng Của Kỳ Vọng')
    .setHelpText('Học ngành bố mẹ chọn, làm công việc họ hàng khen ngợi, yêu người mà gia đình ưng ý. Bạn đang sống cuộc đời của một diễn viên quần chúng trong chính bộ phim của mình.\\n' +
    'Bạn mắc kẹt trong Hệ Mặt Trời của người khác, xoay quanh họ thay vì tìm ra lực hấp dẫn của chính mình.\\n\\n' +
    '👇 [ADMIN: Thêm hình ảnh public/images/shadow_of_expectations.png]');

  const intro6 = form.addSectionHeaderItem();
  intro6.setTitle('🌌 Giải Pháp: Học Thuyết Tiểu Hành Tinh')
    .setHelpText('Vũ trụ không vận hành theo một công thức chung. Mọi sự so sánh đều khập khiễng. Bạn là một Tiểu Hành Tinh độc nhất.\\n\\n' +
    '1. Trọng lực (Gravity): Hệ giá trị cốt lõi của bạn. Điều gì thực sự quan trọng với bạn khi không còn ai nhìn ngắm?\\n' +
    '2. Quỹ đạo (Orbit): Con đường sống độc nhất của bạn. Không có quỹ đạo nào "tốt" hay "xấu", chỉ có quỹ đạo "phù hợp".\\n' +
    '3. Sự va chạm (Collision): Những biến cố, thất bại và khủng hoảng. Là năng lượng để định hình lại bề mặt hành tinh của bạn.\\n\\n' +
    '👇 [ADMIN: Thêm hình ảnh public/images/three_pillars_concept.png]');

  const intro7 = form.addSectionHeaderItem();
  intro7.setTitle('📊 Hướng dẫn đọc Báo Cáo Cá Nhân')
    .setHelpText('Bài trắc nghiệm này KHÔNG trả về kết quả ngay lập tức trên màn hình Google Form.\\n\\n' +
    'Quy trình nhận Báo Cáo:\\n' +
    'BƯỚC 1: Hoàn thành 28 câu hỏi và bấm Gửi form.\\n' +
    'BƯỚC 2: Toàn bộ dữ liệu của bạn sẽ được lưu vào hệ thống an toàn.\\n' +
    'BƯỚC 3: Admin (hoặc bạn) tải tệp dữ liệu CSV từ Responses của Form.\\n' +
    'BƯỚC 4: Tải tệp CSV đó lên nền tảng ứng dụng Tiểu Hành Tinh (Website) -> Chọn tên của bạn -> Hệ thống tự động biên dịch một Báo Cáo Nội Tâm Độc Bản tuyệt đẹp.\\n\\n' +
    'Báo cáo sẽ phân tích 4 chiều sâu thẳm trong bạn:\\n' +
    '- Mod 1: Mẫu hình Năng Lượng (Archetypes)\\n' +
    '- Mod 2: Bản đồ 7 Trụ Cột (Kỳ vọng vs Thực tế)\\n' +
    '- Mod 3: Ma trận Tỉnh Thức (OCA)\\n' +
    '- Mod 4: Năng Lực Chuyển Hóa (CTC) và Khuyến nghị thiết kế lại quỹ đạo sống.\\n\\n' +
    'Hãy thư giãn, chuẩn bị một ly nước, và trả lời trung thực nhất có thể.');
`;

const regex = /\/\/ -------------------------------------------------------------------------------- \/\/\n  \/\/ PHẦN 1: BÀI VIẾT GIỚI THIỆU.*\n[\s\S]*?\/\/ -------------------------------------------------------------------------------- \/\/\n  \/\/ PHẦN 2: BẮT ĐẦU VÀO KHẢO SÁT -> SỬ DỤNG PAGE BREAK ITEM/g;

if(regex.test(gsContent)) {
  gsContent = gsContent.replace(regex, newIntroCode + "\n  // -------------------------------------------------------------------------------- //\n  // PHẦN 2: BẮT ĐẦU VÀO KHẢO SÁT -> SỬ DỤNG PAGE BREAK ITEM");
  fs.writeFileSync(gsPath, gsContent, 'utf8');
  console.log('google_form_script.gs enhanced!');
} else {
  console.log('Regex did not match. Check file content manually.');
}
