/* =========================================================
   THIỆP CƯỚI ONLINE - FILE CẤU HÌNH (NHÀ TRAI & NHÀ GÁI)
   ========================================================= */

const WEDDING = {
  couple: {
    groom: "Đinh Đức",
    bride: "Tuệ Tâm",
    short: "Đinh Đức & Tuệ Tâm",
    tagline: "We are getting married",
  },

  // THÔNG TIN NHÀ TRAI (150 CÁI)
  groomSide: {
    key: "groom",
    name: "Nhà Trai",
    subtitle: "Thiệp mời từ gia đình Nhà Trai",
    mainPerson: "Chú rể: Đinh Văn Đức",
    groomName: "Đinh Văn Đức",
    parents: {
      father: "Đinh Văn Đạt",
      mother: "Nguyễn Thị Toàn",
      label: "Ông: Đinh Văn Đạt — Bà: Nguyễn Thị Toàn",
      lines: ["Ông: Đinh Văn Đạt", "Bà: Nguyễn Thị Toàn"],
    },
    heroImage: "assets/images/groom-hero.JPG",
    heroPosition: "center 30%", // Căn vị trí ảnh bìa (center 20% để cân đối và thấy rõ mặt)
    avatar: "assets/images/groom-avatar.JPG",
    themeClass: "theme-groom",
    heroDateText: "11h00 Chủ Nhật, ngày 25 tháng 10 năm 2026",

    // 1. Mời cơm (Tiệc cưới)
    banquet: {
      tag: "THỜI GIAN, ĐỊA CHỈ MỜI CƠM",
      title: "Tiệc Cưới Nhà Trai",
      time: "16h30 ngày 24/10/2026",
      lunarDate: "(Tức ngày 15 tháng 9 năm Bính Ngọ)",
      venue: "Nhà Thờ giáo xứ Dũng Vy",
      address: "Thôn Giáo, xã Đại Đồng, tỉnh Bắc Ninh",
      mapsUrl: "https://maps.app.goo.gl/Cc2H3ob1dw5xK1dH9",
    },

    // 2. Lễ Thành Hôn
    ceremony: {
      tag: "LỄ THÀNH HÔN",
      title: "Lễ Thành Hôn",
      time: "11h00 ngày 25/10/2026",
      lunarDate: "(Tức ngày 16 tháng 09 năm Bính Ngọ)",
      venue: "Tư gia nhà trai",
      address: "Thôn Giáo, xã Đại Đồng, tỉnh Bắc Ninh",
      mapsUrl: "https://maps.app.goo.gl/mgD8j7eME1PnTivR8",
    },

    countdownDate: "2026-10-25T11:00:00+07:00",
  },

  // THÔNG TIN NHÀ GÁI (50 CÁI)
  brideSide: {
    key: "bride",
    name: "Nhà Gái",
    subtitle: "Thiệp mời từ gia đình Nhà Gái",
    mainPerson: "Cô dâu: Nguyễn Tuệ Tâm",
    brideName: "Nguyễn Tuệ Tâm",
    parents: {
      father: "Nguyễn Trường Đoàn",
      grandmother: "Nguyễn Thị Giang",
      label: "Ông: Nguyễn Trường Đoàn — Bà: Nguyễn Thị Giang",
      lines: ["Ông: Nguyễn Trường Đoàn", "Bà: Nguyễn Thị Giang"],
    },
    heroImage: "assets/images/bride-hero.JPG",
    heroPosition: "center 38%", // Căn vị trí ảnh bìa (center 20% để cân đối và thấy rõ mặt)
    avatar: "assets/images/bride-avatar.JPG",
    themeClass: "theme-bride",
    heroDateText: "10h00 Chủ Nhật, ngày 25 tháng 10 năm 2026",

    // 1. Mời cơm (Tiệc mừng)
    banquet: {
      tag: "THỜI GIAN, ĐỊA CHỈ MỜI CƠM",
      title: "Tiệc Mừng Nhà Gái",
      time: "16h00 ngày 24/10/2026",
      lunarDate: "(Tức ngày 15 tháng 9 năm Bính Ngọ)",
      venue: "Nhà văn hóa xóm Chùa",
      address: "Đại Thượng, xã Đại Đồng, tỉnh Bắc Ninh",
      mapsUrl: "https://maps.app.goo.gl/B1EEYL1X2joY5m8K7",
    },

    // 2. Lễ Vu Quy
    ceremony: {
      tag: "LỄ VU QUY",
      title: "Lễ Vu Quy",
      time: "10h00 ngày 25/10/2026",
      lunarDate: "(Tức ngày 16 tháng 09 năm Bính Ngọ)",
      venue: "Tư gia nhà gái",
      address: "Đại Thượng, xã Đại Đồng, tỉnh Bắc Ninh",
      mapsUrl: "https://maps.app.goo.gl/4SrrDLJJA2WyCTwu8",
    },

    countdownDate: "2026-10-25T10:00:00+07:00",
  },

  event: {
    dateTime: "2026-10-25T11:00:00+07:00",
    dateText: "Chủ nhật, ngày 25 tháng 10 năm 2026",
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
    rsvpUrl: "https://docs.google.com/forms/d/e/1FAIpQLScPKuD48be9dFI-pzjge0J-r25f4CoVIyyyBtB_Xcay_l_syg/viewform",
    bridePhone: "0900000000",
    groomPhone: "0900000000",
    zaloUrl: "https://zalo.me/0900000000",
  },

  gift: {
    // Thông tin mừng cưới Nhà Trai (Chú rể)
    groom: {
      name: "Đinh Văn Đức",
      bank: "Techcombank",
      account: "19035685409010",
      accountName: "ĐINH VĂN ĐỨC",
      qr: "assets/qr/qr_chu_re.jpg",
    },
  },

  gallery: [
    "assets/images/photo-1.JPG",
    "assets/images/photo-2.JPG",
    "assets/images/photo-3.JPG",
    "assets/images/photo-4.JPG",
    "assets/images/photo-5.JPG",
    "assets/images/photo-6.JPG",
  ],

  music: {
    url: "assets/music/wedding.mp3",
    title: "Wedding music",
  },
};
