# HƯỚNG DẪN BÀI BẢN – THIỆP CƯỚI ONLINE RIÊNG

Bộ này là website tĩnh độc lập, không dùng mẫu thiệp của bên thứ ba. Không có cơ sở dữ liệu riêng và không cần máy chủ riêng.

## 1. Cấu trúc bộ thiệp

- `index.html`: nội dung giao diện.
- `style.css`: màu sắc, bố cục, hiệu ứng responsive.
- `script.js`: countdown, mở thiệp, nhạc, copy số tài khoản, chia sẻ, lịch.
- `config.js`: file quan trọng nhất; sửa thông tin đám cưới ở đây.
- `assets/images/`: ảnh bìa và album.
- `assets/qr/`: QR mừng cưới.
- `assets/music/`: nhạc nền.

## 2. Sửa thông tin cô dâu – chú rể

Mở `config.js` bằng Notepad hoặc VS Code.

Sửa các phần:

```js
couple: {
  bride: "Tên cô dâu",
  groom: "Tên chú rể",
  short: "Tên cô dâu & Tên chú rể",
  tagline: "We are getting married",
}
```

## 3. Sửa ngày giờ cưới

Dòng `dateTime` dùng chuẩn ISO và múi giờ Việt Nam:

```js
dateTime: "2027-01-16T16:00:00+07:00",
```

Ngày/giờ này được dùng cho countdown và nút thêm vào lịch.

Sửa thêm:

```js
dateText: "Thứ Bảy, ngày 16 tháng 01 năm 2027",
timeText: "16:00",
receptionText: "17:30",
```

## 4. Sửa địa điểm & chương trình cưới (Lễ thành hôn & Tiệc rượu)

Website chia rõ ràng thành 2 khu vực riêng biệt:

```js
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
```

Mỗi phần đều có thời gian, địa điểm, địa chỉ và nút **MỞ BẢN ĐỒ** (`mapsUrl`) riêng biệt để khách dễ dàng tìm đường.

## 5. Thay ảnh cưới

Có 2 nhóm ảnh:

### Ảnh bìa

Hiện tại giao diện dùng:

`assets/images/hero-placeholder.svg`

Bạn có thể đổi thành một ảnh JPG/PNG thật, ví dụ `hero.jpg`, rồi sửa dòng background trong `style.css`:

```css
background: linear-gradient(...), url("assets/images/hero.jpg") center/cover;
```

### Album ảnh

Trong `config.js`:

```js
gallery: [
  "assets/images/photo-1.jpg",
  "assets/images/photo-2.jpg",
  ...
]
```

Bạn có thể dùng JPG, JPEG, PNG hoặc WEBP.

Khuyến nghị ảnh điện thoại được nén xuống khoảng 500 KB – 1,5 MB/ảnh để thiệp tải nhanh.

## 6. Thêm nhạc

Đặt file nhạc MP3 tại:

`assets/music/wedding.mp3`

Giữ đúng tên này để không phải sửa code.

Lưu ý: trình duyệt điện thoại thường chặn tự động phát nhạc trước khi người dùng tương tác. Vì vậy thiệp có nút `MỞ THIỆP`; khi người dùng chạm mở thiệp, website sẽ cố gắng phát nhạc. Nút `♫` cho phép bật/tắt nhạc thủ công.

## 7. QR mừng cưới

Hiện tại QR trong bộ demo chỉ là QR mẫu, không dùng để chuyển tiền.

Bạn cần thay hai file:

- `assets/qr/qr-co-dau.png`
- `assets/qr/qr-chu-re.png`

Sau đó sửa thông tin tương ứng trong `config.js`:

```js
gift: {
  bride: {
    name: "NGỌC ANH",
    bank: "VIETCOMBANK",
    account: "1234567890",
    qr: "assets/qr/qr-co-dau.png",
  },
  groom: {
    name: "MINH CHUNG",
    bank: "MB BANK",
    account: "9876543210",
    qr: "assets/qr/qr-chu-re.png",
  },
}
```

KHÔNG đưa mật khẩu, mã OTP hoặc thông tin đăng nhập ngân hàng vào website.

## 8. Nút xác nhận tham dự (RSVP)

Website này là website tĩnh. Để thu danh sách khách, cách đơn giản và miễn phí là tạo Google Form.

Tạo form với các trường ví dụ:

- Họ và tên
- Số điện thoại (nếu cần)
- Bạn có tham dự không?
- Số người đi cùng
- Lời chúc

Sau khi tạo form, lấy link chia sẻ và thay:

```js
rsvpUrl: "https://forms.google.com/",
```

thành link thật.

Khi khách bấm `XÁC NHẬN THAM DỰ`, form sẽ mở ra. Dữ liệu RSVP sẽ do Google Form/Google Sheets lưu trữ, không phải do website này lưu.

## 9. Kiểm tra thiệp trước khi đưa lên Internet

Cách đơn giản nhất: mở `index.html` bằng Chrome.

Kiểm tra lần lượt:

1. Bấm MỞ THIỆP.
2. Countdown chạy đúng.
3. Ảnh hiển thị đủ.
4. Nhạc bật/tắt.
5. Bản đồ mở đúng.
6. RSVP mở đúng Google Form.
7. QR đúng người nhận.
8. Sao chép STK hoạt động.
9. Nút THÊM VÀO LỊCH tải file `wedding.ics`.
10. Chia sẻ thiệp hoạt động trên điện thoại.

## 10. Đưa website lên Internet miễn phí – GitHub Pages

GitHub Pages có thể xuất trực tiếp các file HTML/CSS/JavaScript trong repository thành website. Với GitHub Free, site Pages của tài khoản miễn phí cần dùng public repository. GitHub cũng công bố giới hạn khuyến nghị 1 GB cho repository nguồn và 1 GB cho site được xuất bản, cùng soft bandwidth limit 100 GB/tháng. Vì vậy bộ thiệp cưới nhỏ như bộ này phù hợp cho nhu cầu thông thường. Xem tài liệu chính thức: https://docs.github.com/en/pages

### Bước A – Tạo tài khoản GitHub

Truy cập `https://github.com/` và đăng ký tài khoản.

### Bước B – Tạo repository

1. Chọn `New repository`.
2. Đặt tên, ví dụ: `thiep-cuoi`.
3. Chọn `Public` nếu đang dùng GitHub Free.
4. Chọn `Create repository`.

### Bước C – Upload bộ thiệp

Trong repository mới:

1. Chọn `Add file` → `Upload files`.
2. Upload toàn bộ nội dung bên trong thư mục `thiep-cuoi-online`.
3. Phải thấy `index.html` ngay ở thư mục gốc của repository.
4. Commit changes.

### Bước D – Bật GitHub Pages

1. Mở `Settings` của repository.
2. Vào `Pages`.
3. Trong `Build and deployment`, chọn `Deploy from a branch`.
4. Chọn branch `main` và thư mục `/(root)`.
5. Chọn `Save`.

Sau khi triển khai, GitHub sẽ hiển thị địa chỉ website. Site thường có dạng:

`https://<username>.github.io/thiep-cuoi/`

GitHub ghi rõ project site dùng dạng URL `<owner>.github.io/<repositoryname>`. Mỗi khi cập nhật source branch, nội dung được publish lại. Tài liệu chính thức: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 11. Phương án Cloudflare Pages

Cloudflare Pages cũng hỗ trợ website HTML tĩnh và có thể triển khai từ GitHub/GitLab. Tài liệu hiện tại của Cloudflare hướng dẫn kết nối repository và tự động deploy khi push thay đổi. Sau deployment, project nhận một subdomain dạng `*.pages.dev`.

Quy trình cơ bản:

1. Tạo tài khoản Cloudflare.
2. Vào Workers & Pages.
3. Chọn Create application → Pages.
4. Chọn Import an existing Git repository.
5. Chọn repository thiệp cưới.
6. Production branch: `main`.
7. Với site tĩnh không cần build: build command có thể dùng `exit 0`.
8. Chọn thư mục chứa `index.html` làm build output directory.
9. Deploy.

Tài liệu chính thức hiện tại của Cloudflare: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/ và https://developers.cloudflare.com/pages/get-started/git-integration/

## 12. Có cần mua tên miền không?

Không.

Bạn có thể dùng URL miễn phí do GitHub Pages hoặc Cloudflare Pages cấp.

Ví dụ GitHub:

`https://username.github.io/thiep-cuoi/`

Ví dụ Cloudflare:

`https://ten-du-an.pages.dev`

Chỉ phải trả tiền khi bạn muốn mua tên miền riêng, ví dụ `chungwedding.com`.

## 13. Gửi thiệp cho khách

Sau khi website chạy, bạn chỉ cần copy link và gửi qua Zalo, Messenger, Facebook, email hoặc tạo QR code cho đường link.

Có thể gửi một nội dung ngắn:

"Trân trọng mời bạn đến chung vui cùng chúng mình 💍\n
Thiệp cưới: [LINK]"

## 14. Sau này muốn sửa website

Không cần làm lại từ đầu.

Sửa `config.js` hoặc thay ảnh/nhạc/QR rồi upload/commit lại các file mới. GitHub Pages hoặc Cloudflare Pages sẽ cập nhật website theo cơ chế deploy tương ứng.

## 15. Lưu ý về quyền riêng tư

Website công khai nên bất kỳ ai có link cũng có thể xem được nội dung. Không đăng thông tin nhạy cảm không cần thiết. QR mừng cưới chỉ nên chứa thông tin cần thiết để nhận chuyển khoản; tuyệt đối không đăng mật khẩu, OTP, mã PIN hay thông tin đăng nhập.

## 16. Font chữ đám cưới Việt hóa đã tích hợp

Website đã được tích hợp bộ Google Fonts cao cấp hỗ trợ đầy đủ tiếng Việt (không bị lỗi dấu font):

1. **Font uốn lượn / Thư pháp cưới (Script)**:
   - `Great Vibes`, `Alex Brush`: Dành cho tên cô dâu chú rể ở màn hình Mở Thiệp, Hero chính và chữ ký cuối thiệp.
2. **Font sang trọng / Cổ điển (Serif)**:
   - `Playfair Display`, `Cormorant Garamond`: Dành cho các tiêu đề chính (H1, H2, H3), Lời ngỏ, Ngày cưới, Đồng hồ đếm ngược.
3. **Font hiện đại / Rõ nét (Sans-serif)**:
   - `Montserrat`: Dành cho nội dung chi tiết, nút bấm, thông tin sự kiện, STK ngân hàng.

*Để thay đổi font, bạn có thể chỉnh sửa các biến CSS tại đầu file `style.css` (`--script`, `--serif`, `--sans`).*

