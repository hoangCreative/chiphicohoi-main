
function createTieuHanhTinhForm() {
  const form = FormApp.create('Tiểu Hành Tinh - Khám Phá Bản Thân');
  form.setDescription('Bài trắc nghiệm chuyên sâu giúp bạn vẽ lại bản đồ nội tâm và định vị chính xác bạn đang ở đâu trong vũ trụ này.');
  form.setConfirmationMessage('Cảm ơn bạn đã hoàn thành bài trắc nghiệm. Vui lòng tải file CSV (Responses) và tải lên ứng dụng Tiểu Hành Tinh để xem báo cáo chi tiết.');
  form.setRequireLogin(false);
  
  // Add Name field
  form.addTextItem()
    .setTitle('Tên của bạn là gì?')
    .setRequired(true);

  // Add Email field (optional)
  form.addTextItem()
    .setTitle('Email của bạn (tuỳ chọn)')
    .setRequired(false);

  const questions = [
  {
    "id": "M1_Q01",
    "module": "M1",
    "category": "Decision Style",
    "type": "single_choice",
    "text": "Khi cần đưa ra quyết định quan trọng, bạn thường:",
    "options": [
      {
        "id": "A",
        "text": "Dựa vào trực giác và kinh nghiệm",
        "metadata": {
          "style": "intuitive",
          "archetype": "Wanderer"
        }
      },
      {
        "id": "B",
        "text": "Tìm hiểu SÂU một vài nguồn tin đáng tin",
        "metadata": {
          "style": "depth",
          "archetype": "Master"
        }
      },
      {
        "id": "C",
        "text": "Liệt kê ưu/nhược điểm, phân tích diện rộng",
        "metadata": {
          "style": "breadth",
          "archetype": "Builder"
        }
      },
      {
        "id": "D",
        "text": "Hỏi ý kiến nhiều người xung quanh",
        "metadata": {
          "style": "social",
          "archetype": "Connector"
        }
      }
    ]
  },
  {
    "id": "M1_Q06",
    "module": "M1",
    "category": "Decision Style",
    "type": "single_choice",
    "text": "Ý kiến của ai ẢNH HƯỞNG NHIỀU NHẤT đến quyết định của bạn?",
    "options": [
      {
        "id": "A",
        "text": "Chính bản thân tôi - tôi là người quyết định cuối cùng",
        "metadata": {
          "locus": "internal"
        }
      },
      {
        "id": "B",
        "text": "Gia đình/người thân",
        "metadata": {
          "locus": "external",
          "pillar": "relationships"
        }
      },
      {
        "id": "C",
        "text": "Mentor/expert trong lĩnh vực",
        "metadata": {
          "locus": "external",
          "pillar": "skills"
        }
      },
      {
        "id": "D",
        "text": "Bạn bè/Đồng nghiệp",
        "metadata": {
          "locus": "external",
          "pillar": "relationships"
        }
      }
    ]
  },
  {
    "id": "M1_Q09",
    "module": "M1",
    "category": "Motivation",
    "type": "single_choice",
    "text": "Điều gì THÚC ĐẨY bạn MẠNH NHẤT trong cuộc sống?",
    "options": [
      {
        "id": "A",
        "text": "⭐ Ảnh hưởng, được nhìn nhận, có tiếng nói",
        "metadata": {
          "archetype": "Leader",
          "pillar": "reputation"
        }
      },
      {
        "id": "B",
        "text": "💰 Tài chính, an toàn, ổn định",
        "metadata": {
          "archetype": "Builder",
          "pillar": "financial"
        }
      },
      {
        "id": "C",
        "text": "🦅 Tự do, không bị ràng buộc",
        "metadata": {
          "archetype": "Wanderer",
          "pillar": "freedom"
        }
      },
      {
        "id": "D",
        "text": "❤️ Kết nối, được yêu thương",
        "metadata": {
          "archetype": "Connector",
          "pillar": "relationships"
        }
      },
      {
        "id": "E",
        "text": "🎯 Giỏi giang, thành thạo, master",
        "metadata": {
          "archetype": "Master",
          "pillar": "skills"
        }
      },
      {
        "id": "F",
        "text": "🌟 Ý nghĩa, sống có mục đích",
        "metadata": {
          "archetype": "Seeker",
          "pillar": "meaning"
        }
      },
      {
        "id": "G",
        "text": "💚 Tâm thương, giúp đỡ, chữa lành",
        "metadata": {
          "archetype": "Healer",
          "pillar": "health"
        }
      }
    ]
  },
  {
    "id": "M1_Q13",
    "module": "M1",
    "category": "Fear",
    "type": "single_choice",
    "text": "Điều gì bạn SỢ NHẤT hoặc muốn TRÁNH NHẤT?",
    "options": [
      {
        "id": "A",
        "text": "🔒 Bị mắc kẹt, mất tự do",
        "metadata": {
          "archetype": "Wanderer"
        }
      },
      {
        "id": "B",
        "text": "💔 Bị bỏ rơi, mất kết nối",
        "metadata": {
          "archetype": "Connector"
        }
      },
      {
        "id": "C",
        "text": "📉 Tầm thường, không giỏi",
        "metadata": {
          "archetype": "Master"
        }
      },
      {
        "id": "D",
        "text": "💸 Nghèo, mất an toàn",
        "metadata": {
          "archetype": "Builder"
        }
      },
      {
        "id": "E",
        "text": "🌑 Sống vô nghĩa",
        "metadata": {
          "archetype": "Seeker"
        }
      },
      {
        "id": "F",
        "text": "🤕 Gây tổn thương cho người khác",
        "metadata": {
          "archetype": "Healer"
        }
      },
      {
        "id": "G",
        "text": "😶 Mờ nhạt, không có ảnh hưởng",
        "metadata": {
          "archetype": "Leader"
        }
      }
    ]
  },
  {
    "id": "M2_Q01",
    "module": "M2",
    "category": "Declared Priority",
    "type": "ranking",
    "text": "Sắp xếp 7 yếu tố sau theo độ QUAN TRỌNG với bạn (1 = quan trọng nhất):",
    "options": [
      {
        "id": "financial",
        "text": "💰 Tài chính"
      },
      {
        "id": "freedom",
        "text": "🕊️ Tự do (thời gian cho bản thân)"
      },
      {
        "id": "health",
        "text": "💪 Sức khỏe"
      },
      {
        "id": "relationships",
        "text": "❤️ Quan hệ"
      },
      {
        "id": "skills",
        "text": "🎯 Kỹ năng"
      },
      {
        "id": "reputation",
        "text": "⭐ Danh tiếng"
      },
      {
        "id": "meaning",
        "text": "🌟 Ý nghĩa"
      }
    ]
  },
  {
    "id": "M2_Q10",
    "module": "M2",
    "category": "Behavioral Recall",
    "type": "single_choice",
    "text": "Khi quá bận, hoạt động nào THƯỜNG BỊ CẮT ĐẦU TIÊN?",
    "options": [
      {
        "id": "A",
        "text": "Giải trí, nghỉ ngơi",
        "metadata": {
          "pillar": "freedom"
        }
      },
      {
        "id": "B",
        "text": "Tập luyện, ăn uống healthy",
        "metadata": {
          "pillar": "health"
        }
      },
      {
        "id": "C",
        "text": "Gặp gỡ bạn bè, gia đình",
        "metadata": {
          "pillar": "relationships"
        }
      },
      {
        "id": "D",
        "text": "Thời gian học hỏi",
        "metadata": {
          "pillar": "skills"
        }
      }
    ]
  },
  {
    "id": "M2_Q11",
    "module": "M2",
    "category": "Behavioral Recall",
    "type": "single_choice",
    "text": "Hoạt động nào bạn BẢO VỆ NHẤT, hiếm khi cho phép bị gián đoạn?",
    "options": [
      {
        "id": "A",
        "text": "Giờ làm việc kiếm tiền",
        "metadata": {
          "pillar": "financial"
        }
      },
      {
        "id": "B",
        "text": "Giờ cho gia đình/con cái",
        "metadata": {
          "pillar": "relationships"
        }
      },
      {
        "id": "C",
        "text": "Thời gian học/nghiên cứu",
        "metadata": {
          "pillar": "skills"
        }
      },
      {
        "id": "D",
        "text": "Giờ tập luyện/ngủ",
        "metadata": {
          "pillar": "health"
        }
      },
      {
        "id": "E",
        "text": "Thời gian riêng tư (me-time)",
        "metadata": {
          "pillar": "freedom"
        }
      }
    ]
  },
  {
    "id": "M2_Q09_Financial",
    "module": "M2",
    "category": "Time Allocation",
    "type": "scale",
    "text": "Đánh giá mức độ đầu tư THỜI GIAN & TÂM TRÍ thực tế cho: CÔNG VIỆC KIẾM TIỀN (1=Rất ít, 10=Rất nhiều)",
    "options": []
  },
  {
    "id": "M2_Q09_Health",
    "module": "M2",
    "category": "Time Allocation",
    "type": "scale",
    "text": "Đánh giá mức độ đầu tư THỜI GIAN & TÂM TRÍ thực tế cho: SỨC KHỎE (ngủ, tập, ăn)",
    "options": []
  },
  {
    "id": "M2_Q09_Relationships",
    "module": "M2",
    "category": "Time Allocation",
    "type": "scale",
    "text": "Đánh giá mức độ đầu tư THỜI GIAN & TÂM TRÍ thực tế cho: QUAN HỆ (gia đình, bạn bè)",
    "options": []
  },
  {
    "id": "M2_Q09_Skills",
    "module": "M2",
    "category": "Time Allocation",
    "type": "scale",
    "text": "Đánh giá mức độ đầu tư THỜI GIAN & TÂM TRÍ thực tế cho: HỌC HỎI & KỸ NĂNG",
    "options": []
  },
  {
    "id": "M2_Q09_Freedom",
    "module": "M2",
    "category": "Time Allocation",
    "type": "scale",
    "text": "Đánh giá mức độ đầu tư THỜI GIAN & TÂM TRÍ thực tế cho: SỰ THẢNH THƠI & TỰ DO",
    "options": []
  },
  {
    "id": "M2_Q09_Reputation",
    "module": "M2",
    "category": "Time Allocation",
    "type": "scale",
    "text": "Đánh giá mức độ đầu tư THỜI GIAN & TÂM TRÍ thực tế cho: XÂY DỰNG HÌNH ẢNH/DANH TIẾNG",
    "options": []
  },
  {
    "id": "M2_Q09_Meaning",
    "module": "M2",
    "category": "Time Allocation",
    "type": "scale",
    "text": "Đánh giá mức độ đầu tư THỜI GIAN & TÂM TRÍ thực tế cho: ĐÓNG GÓP Ý NGHĨA/CỘNG ĐỒNG",
    "options": []
  },
  {
    "id": "M3_Q01",
    "module": "M3",
    "category": "Alternative Recognition",
    "type": "single_choice",
    "text": "Nghĩ về QUYẾT ĐỊNH LỚN trong 6 tháng qua. Khi đó, bạn đã cân nhắc bao nhiêu lựa chọn?",
    "options": [
      {
        "id": "A",
        "text": "1-2 lựa chọn",
        "metadata": {
          "oca": 1
        }
      },
      {
        "id": "B",
        "text": "3-4 lựa chọn, đã so sánh cái tốt nhất",
        "metadata": {
          "oca": 2
        }
      },
      {
        "id": "C",
        "text": "5+ lựa chọn",
        "metadata": {
          "oca": 3
        }
      }
    ]
  },
  {
    "id": "M3_Q06",
    "module": "M3",
    "category": "Trade-off Articulation",
    "type": "single_choice",
    "text": "Nghĩ về CÔNG VIỆC HIỆN TẠI. Bạn có thể nói rõ đang ĐÁNH ĐỔI điều gì không?",
    "options": [
      {
        "id": "A",
        "text": "Có - thấy rõ NHIỀU trade-offs (thời gian, sức khỏe, cơ hội khác...)",
        "metadata": {
          "oca": 3
        }
      },
      {
        "id": "B",
        "text": "Có thể nêu một vài trade-offs",
        "metadata": {
          "oca": 2
        }
      },
      {
        "id": "C",
        "text": "Không rõ lắm / Không nghĩ nhiều",
        "metadata": {
          "oca": 1
        }
      }
    ]
  },
  {
    "id": "M3_Q11",
    "module": "M3",
    "category": "Consequence Anticipation",
    "type": "single_choice",
    "text": "Trước khi quyết định, bạn có hay hỏi: \"1 năm sau / 5 năm sau sẽ thế nào?\"",
    "options": [
      {
        "id": "A",
        "text": "Có - luôn nghĩ long-term",
        "metadata": {
          "oca": 3
        }
      },
      {
        "id": "B",
        "text": "Đôi khi",
        "metadata": {
          "oca": 2
        }
      },
      {
        "id": "C",
        "text": "Hiếm khi - focus hiện tại",
        "metadata": {
          "oca": 1
        }
      }
    ]
  },
  {
    "id": "M3_Q13",
    "module": "M3",
    "category": "Consequence Anticipation",
    "type": "single_choice",
    "text": "Nhìn lại 1 năm qua, bạn có hay BỊ BẤT NGỜ bởi hậu quả của quyết định mình không?",
    "options": [
      {
        "id": "A",
        "text": "Có - đôi khi hậu quả khác xa dự đoán",
        "metadata": {
          "oca": 1
        }
      },
      {
        "id": "B",
        "text": "Đôi khi - với quyết định lớn thì có",
        "metadata": {
          "oca": 2
        }
      },
      {
        "id": "C",
        "text": "Hiếm khi - tôi thường lường trước được",
        "metadata": {
          "oca": 3
        }
      }
    ]
  },
  {
    "id": "M4_Q01",
    "module": "M4",
    "category": "Ownership",
    "type": "single_choice",
    "text": "Nhìn lại các quyết định quan trọng trong cuộc đời bạn, bạn cảm thấy:",
    "options": [
      {
        "id": "A",
        "text": "Phần lớn là do TÔI chọn - tôi là người quyết định cuộc đời mình",
        "metadata": {
          "ctc": 3,
          "locus": "internal"
        }
      },
      {
        "id": "B",
        "text": "Mix - một số do tôi chọn, một số do hoàn cảnh đưa đẩy",
        "metadata": {
          "ctc": 2,
          "locus": "mixed"
        }
      },
      {
        "id": "C",
        "text": "Phần lớn là do HOÀN CẢNH - tôi không có nhiều lựa chọn",
        "metadata": {
          "ctc": 1,
          "locus": "external"
        }
      },
      {
        "id": "D",
        "text": "Tôi không chắc - chưa bao giờ nghĩ về điều này",
        "metadata": {
          "ctc": 1,
          "locus": "unexamined"
        }
      }
    ]
  },
  {
    "id": "M4_Q02",
    "module": "M4",
    "category": "Ownership",
    "type": "single_choice",
    "text": "Nghĩ về một quyết định KHÓ KHĂN bạn đã đưa ra và hậu quả KHÔNG như mong đợi. Bạn nghĩ gì?",
    "options": [
      {
        "id": "A",
        "text": "Đó là quyết định CỦA TÔI. Dù kết quả không tốt, tôi chịu trách nhiệm.",
        "metadata": {
          "ctc": 3,
          "agency": "full_ownership"
        }
      },
      {
        "id": "B",
        "text": "Tôi đã quyết định dựa trên thông tin lúc đó. Không ai có thể biết trước.",
        "metadata": {
          "ctc": 2.5,
          "agency": "contextual_ownership"
        }
      },
      {
        "id": "C",
        "text": "Nếu hoàn cảnh khác, tôi đã không chọn như vậy. Không hoàn toàn là lỗi của tôi.",
        "metadata": {
          "ctc": 1.5,
          "agency": "partial_external"
        }
      },
      {
        "id": "D",
        "text": "Tôi bị ép phải chọn như vậy. Không phải quyết định thực sự của tôi.",
        "metadata": {
          "ctc": 1,
          "agency": "no_ownership"
        }
      }
    ]
  },
  {
    "id": "M4_Q03",
    "module": "M4",
    "category": "Ownership",
    "type": "single_choice",
    "text": "Khi mọi thứ không như ý, bạn thường:",
    "options": [
      {
        "id": "A",
        "text": "Tự hỏi: \"Mình đã có thể làm gì khác?\" - Focus vào bản thân",
        "metadata": {
          "ctc": 3,
          "blame": "self_reflective"
        }
      },
      {
        "id": "B",
        "text": "Nhìn cả bản thân và yếu tố bên ngoài một cách cân bằng",
        "metadata": {
          "ctc": 2.5,
          "blame": "balanced"
        }
      },
      {
        "id": "C",
        "text": "Thường thấy nguyên nhân từ người khác hoặc hoàn cảnh",
        "metadata": {
          "ctc": 1.5,
          "blame": "external"
        }
      },
      {
        "id": "D",
        "text": "Tự trách mình quá mức, dù không phải lỗi của mình",
        "metadata": {
          "ctc": 2,
          "blame": "excessive_self"
        }
      }
    ]
  },
  {
    "id": "M4_Q04",
    "module": "M4",
    "category": "Acceptance",
    "type": "single_choice",
    "text": "Bạn biết rõ công việc hiện tại đang lấy đi thời gian với gia đình (trade-off đã BIẾT TRƯỚC). Bạn cảm thấy thế nào?",
    "options": [
      {
        "id": "A",
        "text": "Chấp nhận hoàn toàn - đây là giá tôi đã đồng ý trả",
        "metadata": {
          "ctc": 3,
          "acceptance": "full"
        }
      },
      {
        "id": "B",
        "text": "Chấp nhận nhưng vẫn thấy khó chịu - biết là phải nhưng không vui",
        "metadata": {
          "ctc": 2,
          "acceptance": "reluctant"
        }
      },
      {
        "id": "C",
        "text": "Không chấp nhận - tôi đang tìm cách thay đổi",
        "metadata": {
          "ctc": 1.5,
          "acceptance": "resisting"
        }
      },
      {
        "id": "D",
        "text": "Tôi không nhận ra đây là trade-off cho đến khi đọc câu này",
        "metadata": {
          "ctc": 1,
          "acceptance": "unaware"
        }
      }
    ]
  },
  {
    "id": "M4_Q05",
    "module": "M4",
    "category": "Acceptance",
    "type": "single_choice",
    "text": "Bạn quyết định X, và một hậu quả tiêu cực xảy ra mà bạn KHÔNG lường trước. Phản ứng thường thấy:",
    "options": [
      {
        "id": "A",
        "text": "Chấp nhận - đây là risk của mọi quyết định. Move on và adapt.",
        "metadata": {
          "ctc": 3,
          "response": "accepting_adaptive"
        }
      },
      {
        "id": "B",
        "text": "Khó chịu một thời gian, rồi chấp nhận và điều chỉnh",
        "metadata": {
          "ctc": 2.5,
          "response": "process_then_accept"
        }
      },
      {
        "id": "C",
        "text": "Tức giận hoặc buồn bã - tại sao lại xảy ra như vậy?",
        "metadata": {
          "ctc": 1.5,
          "response": "emotional_resistance"
        }
      },
      {
        "id": "D",
        "text": "Hối hận - đáng lẽ không nên quyết định như vậy",
        "metadata": {
          "ctc": 1,
          "response": "regret"
        }
      }
    ]
  },
  {
    "id": "M4_Q06",
    "module": "M4",
    "category": "Acceptance",
    "type": "single_choice",
    "text": "Bạn có hay nghĩ: \"Giá như lúc đó tôi...\", \"Nếu mà tôi đã...\", \"Đáng lẽ tôi nên...\"?",
    "options": [
      {
        "id": "A",
        "text": "Rất hiếm - quá khứ đã qua, tôi focus vào hiện tại",
        "metadata": {
          "ctc": 3,
          "frequency": "rarely"
        }
      },
      {
        "id": "B",
        "text": "Đôi khi - với những quyết định lớn thì có nghĩ lại",
        "metadata": {
          "ctc": 2,
          "frequency": "sometimes"
        }
      },
      {
        "id": "C",
        "text": "Khá thường xuyên - tôi hay suy nghĩ về các \"what if\"",
        "metadata": {
          "ctc": 1.5,
          "frequency": "often"
        }
      },
      {
        "id": "D",
        "text": "Rất thường xuyên - chiếm nhiều tâm trí",
        "metadata": {
          "ctc": 1,
          "frequency": "very_often"
        }
      }
    ]
  },
  {
    "id": "M4_Q07",
    "module": "M4",
    "category": "Acceptance",
    "type": "single_choice",
    "text": "Khi nghĩ về những gì bạn đã \"mất\" hoặc \"hy sinh\" cho các quyết định, bạn thấy đó là:",
    "options": [
      {
        "id": "A",
        "text": "GIÁ ĐÃ TRẢ - tôi chọn trả giá này để được điều tôi muốn",
        "metadata": {
          "ctc": 3,
          "framing": "price_paid"
        }
      },
      {
        "id": "B",
        "text": "SỰ ĐỔI CHÁC - có được có mất, đó là tự nhiên",
        "metadata": {
          "ctc": 2.5,
          "framing": "exchange"
        }
      },
      {
        "id": "C",
        "text": "MẤT MÁT - tôi đã mất những thứ quan trọng",
        "metadata": {
          "ctc": 1.5,
          "framing": "loss"
        }
      },
      {
        "id": "D",
        "text": "BỊ CƯỚP MẤT - hoàn cảnh hoặc người khác lấy đi của tôi",
        "metadata": {
          "ctc": 1,
          "framing": "victimhood"
        }
      }
    ]
  },
  {
    "id": "M4_Q08",
    "module": "M4",
    "category": "Non-Regret",
    "type": "single_choice",
    "text": "Khi một quyết định không ra kết quả tốt, bạn có HỐI HẬN không?",
    "options": [
      {
        "id": "A",
        "text": "Không hối hận nếu tôi đã quyết định kỹ. Tôi phân biệt \"quyết định tệ\" và \"kết quả tệ\".",
        "metadata": {
          "ctc": 3,
          "regret": "process_based"
        }
      },
      {
        "id": "B",
        "text": "Hơi hối hận, nhưng hiểu rằng không ai biết trước được tương lai.",
        "metadata": {
          "ctc": 2.5,
          "regret": "mild"
        }
      },
      {
        "id": "C",
        "text": "Hối hận khá nhiều - kết quả tệ = quyết định tệ.",
        "metadata": {
          "ctc": 1.5,
          "regret": "outcome_based"
        }
      },
      {
        "id": "D",
        "text": "Rất hối hận - tôi hay tự dằn vặt về các quyết định trong quá khứ.",
        "metadata": {
          "ctc": 1,
          "regret": "severe"
        }
      }
    ]
  },
  {
    "id": "M4_Q09",
    "module": "M4",
    "category": "Non-Regret",
    "type": "single_choice",
    "text": "Để biết một quyết định của mình là \"tốt\" hay \"không tốt\", bạn dựa vào đâu?",
    "options": [
      {
        "id": "A",
        "text": "Kết quả - nếu outcome tốt thì quyết định tốt",
        "metadata": {
          "ctc": 1,
          "criteria": "outcome_only"
        }
      },
      {
        "id": "B",
        "text": "Kết quả + Process - cả hai đều quan trọng",
        "metadata": {
          "ctc": 2,
          "criteria": "mixed"
        }
      },
      {
        "id": "C",
        "text": "Process - tôi đã suy nghĩ kỹ và quyết định đúng với giá trị chưa",
        "metadata": {
          "ctc": 3,
          "criteria": "process_focused"
        }
      },
      {
        "id": "D",
        "text": "Cảm giác bây giờ - tôi có hạnh phúc với quyết định đó không",
        "metadata": {
          "ctc": 1.5,
          "criteria": "feeling_based"
        }
      }
    ]
  },
  {
    "id": "M4_Q10",
    "module": "M4",
    "category": "Integration",
    "type": "single_choice",
    "text": "Nhìn lại toàn bộ bài test, câu nào mô tả bạn ĐÚNG NHẤT?",
    "options": [
      {
        "id": "A",
        "text": "Tôi BIẾT RÕ đang đánh đổi gì, TỰ CHỌN trade-offs, và CHẤP NHẬN hệ quả.",
        "metadata": {
          "ctc": 3,
          "integration": "conscious_integrated",
          "awareness": 1,
          "coherence": 1
        }
      },
      {
        "id": "B",
        "text": "Tôi BIẾT mình đang đánh đổi gì, nhưng đôi khi cảm thấy KHÔNG CÓ LỰA CHỌN KHÁC.",
        "metadata": {
          "ctc": 2,
          "integration": "aware_struggling",
          "awareness": 0.8,
          "coherence": 0.4
        }
      },
      {
        "id": "C",
        "text": "Tôi KHÔNG CHẮC mình đang đánh đổi gì. Cuộc sống cứ thế trôi đi.",
        "metadata": {
          "ctc": 1.5,
          "integration": "unaware_reactive",
          "awareness": 0.2,
          "coherence": 0.2
        }
      },
      {
        "id": "D",
        "text": "Tôi THƯỜNG HỐI HẬN về các quyết định và cảm thấy cuộc sống không đi theo ý muốn.",
        "metadata": {
          "ctc": 1,
          "integration": "regretful",
          "awareness": 0.5,
          "coherence": 0.1
        }
      }
    ]
  }
];
    // -------------------------------------------------------------------------------- //
  // PHẦN 1: BÀI VIẾT GIỚI THIỆU VÀ HƯỚNG DẪN 
  // -------------------------------------------------------------------------------- //

  const intro1 = form.addSectionHeaderItem();
  intro1.setTitle('🪐 HỌC THUYẾT CHI PHÍ CƠ HỘI & TIỂU HÀNH TINH')
    .setHelpText('"Cuốn sách này không vẽ ra quỹ đạo cho bạn. Nó chỉ giúp bạn nhìn thấy quỹ đạo của chính mình."\n\n' +
    '👇 [HƯỚNG DẪN DÀNH CHO ADMIN: Bấm "Thêm hình ảnh" ở thanh công cụ bên phải và tải lên ảnh public/images/cosmic_hero_cover.png vào ngay dưới mục này]');

  const intro2 = form.addSectionHeaderItem();
  intro2.setTitle('📖 Bi kịch của thế hệ chúng ta: Tự do nhưng Mất phương hướng')
    .setHelpText('Trích từ sách Tiểu Hành Tinh:\n\n' +
    'Chưa bao giờ trong lịch sử, con người có nhiều lựa chọn như bây giờ. Nhưng nghịch lý thay, sự dư thừa lựa chọn lại tạo ra "tê liệt". Chúng ta đứng trước ngã ba đường, sợ hãi rằng chọn con đường này đồng nghĩa với việc bỏ lỡ những con đường khác. Đó là nỗi đau của Học thuyết Chi phí Cơ hội.\n\n' +
    '"Chi phí cơ hội cuối cùng nhất là dành trọn cuộc đời trong ảo tưởng - tin rằng những thứ vô thường có thể mang lại sự thỏa mãn vĩnh viễn."\n\n' +
    'Mỗi quyết định bạn đưa ra đều có giá của nó. Bài test này được thiết kế dựa trên nội dung sách để giúp bạn lượng hóa cái giá đó.');

  const intro3 = form.addSectionHeaderItem();
  intro3.setTitle('⚓ Kịch bản 1: Chiếc Còng Tay Vàng')
    .setHelpText('Lương tháng 9 chữ số, check-in những nhà hàng sang trọng nhất. Bố mẹ tự hào, bạn bè ngưỡng mộ. Nhưng mỗi sáng thức dậy, bạn phải đấu tranh để rời khỏi giường. Cậu cảm thấy mình như một cỗ máy đang chạy mòn, đánh đổi toàn bộ thời gian tự do và sức khỏe để lấy những con số vô hồn trong tài khoản.\n' +
    'Bạn dư dả vật chất nhưng lại là một "người nghèo Tự Do".\n\n' +
    '👇 [ADMIN: Thêm hình ảnh public/images/golden_handcuffs.png]');

  const intro4 = form.addSectionHeaderItem();
  intro4.setTitle('🧭 Kịch bản 2: Sự Trôi Dạt Vô Định')
    .setHelpText('Từ chối sự gò bó công sở để "sống cuộc đời mình muốn". Nhưng đằng sau những bức ảnh lung linh trên mạng là nỗi lo âu triền miên về tương lai. "Tự do này... có phải là cái giá quá đắt?"\n' +
    'Rời bỏ quỹ đạo ổn định, bạn trở thành một phi hành gia trôi dạt vô định giữa vũ trụ bao la.\n\n' +
    '👇 [ADMIN: Thêm hình ảnh public/images/drifting_astronaut.png]');

  const intro5 = form.addSectionHeaderItem();
  intro5.setTitle('❤️ Kịch bản 3: Cái Bóng Của Kỳ Vọng')
    .setHelpText('Học ngành bố mẹ chọn, làm công việc họ hàng khen ngợi, yêu người mà gia đình ưng ý. Bạn đang sống cuộc đời của một diễn viên quần chúng trong chính bộ phim của mình.\n' +
    'Bạn mắc kẹt trong Hệ Mặt Trời của người khác, xoay quanh họ thay vì tìm ra lực hấp dẫn của chính mình.\n\n' +
    '👇 [ADMIN: Thêm hình ảnh public/images/shadow_of_expectations.png]');

  const intro6 = form.addSectionHeaderItem();
  intro6.setTitle('🌌 Giải Pháp: Học Thuyết Tiểu Hành Tinh')
    .setHelpText('Vũ trụ không vận hành theo một công thức chung. Mọi sự so sánh đều khập khiễng. Bạn là một Tiểu Hành Tinh độc nhất.\n\n' +
    '1. Trọng lực (Gravity): Hệ giá trị cốt lõi của bạn. Điều gì thực sự quan trọng với bạn khi không còn ai nhìn ngắm?\n' +
    '2. Quỹ đạo (Orbit): Con đường sống độc nhất của bạn. Không có quỹ đạo nào "tốt" hay "xấu", chỉ có quỹ đạo "phù hợp".\n' +
    '3. Sự va chạm (Collision): Những biến cố, thất bại và khủng hoảng. Là năng lượng để định hình lại bề mặt hành tinh của bạn.\n\n' +
    '👇 [ADMIN: Thêm hình ảnh public/images/three_pillars_concept.png]');

  const intro7 = form.addSectionHeaderItem();
  intro7.setTitle('📊 Hướng dẫn đọc Báo Cáo Cá Nhân')
    .setHelpText('Bài trắc nghiệm này KHÔNG trả về kết quả ngay lập tức trên màn hình Google Form.\n\n' +
    'Quy trình nhận Báo Cáo:\n' +
    'BƯỚC 1: Hoàn thành 28 câu hỏi và bấm Gửi form.\n' +
    'BƯỚC 2: Toàn bộ dữ liệu của bạn sẽ được lưu vào hệ thống an toàn.\n' +
    'BƯỚC 3: Admin (hoặc bạn) tải tệp dữ liệu CSV từ Responses của Form.\n' +
    'BƯỚC 4: Tải tệp CSV đó lên nền tảng ứng dụng Tiểu Hành Tinh (Website) -> Chọn tên của bạn -> Hệ thống tự động biên dịch một Báo Cáo Nội Tâm Độc Bản tuyệt đẹp.\n\n' +
    'Báo cáo sẽ phân tích 4 chiều sâu thẳm trong bạn:\n' +
    '- Mod 1: Mẫu hình Năng Lượng (Archetypes)\n' +
    '- Mod 2: Bản đồ 7 Trụ Cột (Kỳ vọng vs Thực tế)\n' +
    '- Mod 3: Ma trận Tỉnh Thức (OCA)\n' +
    '- Mod 4: Năng Lực Chuyển Hóa (CTC) và Khuyến nghị thiết kế lại quỹ đạo sống.\n\n' +
    'Hãy thư giãn, chuẩn bị một ly nước, và trả lời trung thực nhất có thể.');

  // -------------------------------------------------------------------------------- //
  // PHẦN 2: BẮT ĐẦU VÀO KHẢO SÁT -> SỬ DỤNG PAGE BREAK ITEM
  // -------------------------------------------------------------------------------- //

  // CHIA TRANG (PAGE BREAK)
  const pageBreak = form.addPageBreakItem();
  pageBreak.setTitle('PHẦN 2: BẮT ĐẦU BÀI KHẢO SÁT CHÍNH THỨC')
    .setHelpText('Hãy thả lỏng và điền thật trung thực. Dữ liệu của bạn được bảo mật tuyệt đối và chỉ dùng để tạo báo cáo cá nhân. 28 câu hỏi này sẽ giúp bạn vẽ lại bản đồ nội tâm và định vị chính xác bạn đang ở đâu trong vũ trụ này.');

  let currentModule = '';

  questions.forEach((q, index) => {
    // Add logic to insert sections and knowledge based on Module changes
    if (q.module !== currentModule) {
      if (q.module === 'M1') {
        const m1Section = form.addSectionHeaderItem();
        m1Section.setTitle('🪐 MOD 1: HỌC THUYẾT 7 ARCHETYPES (MẪU HÌNH NĂNG LƯỢNG)')
          .setHelpText('Mỗi chúng ta đều mang năng lượng của một hoặc nhiều Archetype. Việc nhận diện Archetype chủ đạo sẽ giúp bạn hiểu rõ điểm mạnh (Superpower) và vùng tối (Shadow) của mình.');
      } else if (q.module === 'M2') {
        const m2Section = form.addSectionHeaderItem();
        m2Section.setTitle('🗺️ MOD 2: BẢN ĐỒ 7 TRỤ CỘT (7 PILLARS)')
          .setHelpText('Sự va chạm: Khoảng cách giữa những gì bạn Tuyên Bố là quan trọng (Declared Value) và cách bạn Hành Động thực tế (Actual Behavior).');
      } else if (q.module === 'M3') {
        const m3Section = form.addSectionHeaderItem();
        m3Section.setTitle('👁️ MOD 3: MA TRẬN TỈNH THỨC (OCA)')
          .setHelpText('OCA (Overall Consciousness Awareness): Mức độ nhận thức về bản thân, cảm xúc và các lựa chọn trong cuộc sống.');
      } else if (q.module === 'M4') {
        const m4Section = form.addSectionHeaderItem();
        m4Section.setTitle('🔥 MOD 4: NĂNG LỰC CHUYỂN HÓA (CTC)')
          .setHelpText('CTC (Capacity to Change): Khả năng chuyển hóa nhận thức thành hành động cụ thể để thay đổi cuộc đời. Sự hối hận hay chấp nhận đánh đổi?');
      }
      currentModule = q.module;
    }

    if (q.type === 'single_choice') {
      const item = form.addMultipleChoiceItem();
      item.setTitle(q.id + ': ' + q.text);
      item.setChoiceValues(q.options.map(o => o.id + '. ' + o.text));
      item.setRequired(true);
    } else if (q.type === 'scale') {
      const item = form.addScaleItem();
      item.setTitle(q.id + ': ' + q.text);
      item.setBounds(1, 10);
      item.setLabels('Rất ít', 'Rất nhiều');
      item.setRequired(true);
    } else if (q.type === 'ranking') {
      const item = form.addGridItem();
      item.setTitle(q.id + ': ' + q.text);
      item.setRows(q.options.map(o => o.id + '. ' + o.text));
      
      // Số cột Hạng bẳng đúng số dòng (options)
      const columnLabels = q.options.map((_, index) => 'Hạng ' + (index + 1));
      item.setColumns(columnLabels);
      
      item.setRequired(true);
    }
  });

  Logger.log('Form URL: ' + form.getPublishedUrl());
  Logger.log('Edit URL: ' + form.getEditUrl());
}
