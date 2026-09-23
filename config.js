/* =========================================================
   THIỆP CƯỚI ONLINE - FILE CẤU HÌNH
   Chỉ cần sửa các thông tin trong object WEDDING.
   ========================================================= */

const WEDDING = {
  couple: {
    bride: "Văn Đức",
    groom: "Tuệ Tâm",
    short: "Văn Đức & Tuệ Tâm",
    tagline: "We are getting married",
  },

  event: {
    // ISO format. Ví dụ: 2026-10-25T16:00:00+07:00
    dateTime: "2026-10-25T16:00:00+07:00",
    dateText: "Chủ nhật, ngày 26 tháng 10 năm 2026",
    timeText: "16:00",
    receptionText: "17:30",
  },

  // 1. CỬ HÀNH LỄ THÀNH HÔN
  ceremony: {
    tag: "CỬ HÀNH HÔN LỄ",
    title: "Lễ Thành Hôn",
    time: "16:00",
    venue: "Tư gia nhà trai",
    address: "Thôn Giáo, xã Đại Đồng, Thành phố Bắc Ninh",
    mapsUrl: "https://maps.app.goo.gl/B6v59w9xT43mC5jK6",
  },

  // 2. TIỆC RƯỢU / TIỆC CƯỚI
  reception: {
    tag: "TIỆC RƯỢU CHUNG VUI",
    title: "Tiệc Cưới",
    time: "17:30",
    venue: "Nhà thờ giáo xứ Dũng Vy",
    address: "Thôn Giáo, xã Đại Đồng, Thành phố Bắc Ninh",
    mapsUrl: "https://maps.app.goo.gl/B6v59w9xT43mC5jK6",
  },

  venue: {
    ceremony: "TƯ GIA NHÀ TRAI",
    reception: "Nhà thờ giáo xứ Dũng Vy",
    address: "Thôn Giáo, xã Đại Đồng, Thành phố Bắc Ninh",
    mapsUrl: "https://maps.app.goo.gl/B6v59w9xT43mC5jK6",
  },

  story: {
    title: "Một câu chuyện bắt đầu từ một cuộc gặp",
    paragraphs: [
      "Chúng mình gặp nhau trong một ngày rất bình thường, nhưng rồi từ đó mọi thứ trở nên thật đặc biệt.",
      "Từ những cuộc trò chuyện nhỏ, những lần đồng hành và cả những ngày bận rộn, chúng mình nhận ra người bên cạnh chính là người mình muốn cùng đi thật lâu.",
      "Và ngày hôm nay, chúng mình muốn chia sẻ niềm vui ấy cùng gia đình, bạn bè và những người thân yêu.",
    ],
  },

  contact: {
    rsvpUrl: "https://forms.google.com/",
    bridePhone: "0900000000",
    groomPhone: "0900000000",
    zaloUrl: "https://zalo.me/0900000000",
  },

  gift: {
    bride: {
      name: "Tuệ Tâm",
      bank: "Tên ngân hàng",
      account: "0000000000",
      qr: "assets/qr/qr-co-dau.png",
    },
    groom: {
      name: "Văn Đức",
      bank: "Tên ngân hàng",
      account: "0000000000",
      qr: "assets/qr/qr-chu-re.png",
    },
  },

  gallery: [
    "assets/images/photo-1.svg",
    "assets/images/photo-2.svg",
    "assets/images/photo-3.svg",
    "assets/images/photo-4.svg",
    "assets/images/photo-5.svg",
    "assets/images/photo-6.svg",
  ],

  music: {
    // Đặt file MP3 của bạn tại assets/music/wedding.mp3
    url: "assets/music/wedding.mp3",
    title: "Wedding music",
  },
};
