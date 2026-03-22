# Portfolio Website Context

## 1. Thông Tin Chung
- **Chủ sở hữu:** Nguyễn Mạnh Cường (Nam, sinh ngày 13/04/1998, 16:00, tuổi Mậu Dần, bản mệnh "Thành Đầu Thổ" - Đất đắp thành).
- **Mục tiêu:** Website cá nhân (Portfolio) kết hợp với trang quản trị (Admin Dashboard) cá nhân để quản lý dự án và blog.

## 2. Ý Tưởng Thiết Kế (Phong Thủy - Mệnh Thổ)
- **Màu sắc chủ đạo (Thổ):** Vàng, Nâu Đất, Ochre (`#D4A373`, `#BC6C25`).
- **Màu sắc điểm nhấn (Hỏa - tương sinh):** Đỏ nhạt, Cam, Tím.
- **Màu cấm kỵ (Mộc - tương khắc):** Tuyệt đối tránh sử dụng các sắc xanh lá.
- **Bố cục (Layout):** Mạnh mẽ, vững chãi, cấu trúc hiện đại. Ưu tiên các khối hình học sắc nét vuông vức (loại bỏ hoàn toàn bo góc `border-radius: 0`).

## 3. Công Nghệ Sử Dụng (Tech Stack)
- **Frontend:** React.js bootstrapped bằng Vite (tốc độ cao).
- **Styling:** Tailwind CSS (Custom theme với bảng màu Thổ/Hỏa và phông chữ **Be Vietnam Pro** — hỗ trợ tiếng Việt tối ưu).
- **Routing:** React Router DOM.
- **Backend/BaaS:** Supabase (Auth, PostgreSQL Database, Object Storage).
- **Icons & Animation:** `lucide-react` cho icons, `framer-motion` cho transition mượt mà.

## 4. Cấu Trúc Database (Supabase)

### Bảng `projects` (Dự án)
| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | UUID (PK) | Primary key tự sinh |
| `title` | Text | Tên dự án |
| `description` | Text | Mô tả chi tiết |
| `image_url` | Text | Đường dẫn ảnh từ Supabase Storage |
| `tech_tags` | Text[] | Mảng công nghệ, ví dụ: `[React, Supabase]` |
| `created_at` | Timestamptz | Thời gian tạo |

### Bảng `blog_posts` (Bài viết Blog)
| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | UUID (PK) | Primary key tự sinh |
| `title` | Text | Tiêu đề bài viết |
| `excerpt` | Text | Đoạn tóm tắt ngắn |
| `content` | Text | Nội dung đầy đủ |
| `cover_image_url` | Text | URL ảnh bìa bài viết (tuỳ chọn) |
| `created_at` | Timestamptz | Thời gian tạo |

### Bảng `site_config` (Cấu hình trang web — single-row)
| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | UUID (PK) | Primary key |
| `hero_title` | Text | Tiêu đề lớn trang chủ |
| `hero_subtitle` | Text | Đoạn văn giới thiệu trang chủ |
| `about_text` | Text | Đoạn văn About Me |
| `profile_photo_url` | Text | URL ảnh đại diện (Supabase Storage) |
| `contact_email` | Text | Email hiển thị trên nút Get In Touch |
| `facebook_url` | Text | [MỚI] Link Facebook |
| `linkedin_url` | Text | [MỚI] Link LinkedIn |
| `spotify_url` | Text | [MỚI] Link Spotify |

## 5. Cấu Trúc File (Source Code)

```
cuong-portfolio/
├── supabase/
│   ├── schema.sql           # Projects, blog_posts tables + RLS
│   ├── site_config.sql      # site_config table + RLS
│   └── add_social_links.sql # [MỚI] SQL migration thêm cột social url
├── src/
│   ├── supabaseClient.js    # Khởi tạo Supabase client
│   ├── App.jsx              # Định tuyến, bao bọc bởi <AnimatePresence>
│   ├── components/
│   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   └── AdminLayout.jsx     # [MỚI] Layout sidebar dùng chung
│   └── pages/
│       ├── Home.jsx            # Trang chủ (Fetch config, projects, blog)
│       ├── ProjectDetail.jsx   # [MỚI] Trang chi tiết Project
│       ├── BlogDetail.jsx      # [MỚI] Trang chi tiết Blog
│       ├── AdminLogin.jsx      # Đăng nhập
│       ├── AdminDashboard.jsx  # Admin Projects
│       ├── AdminBlog.jsx       # Admin Blog
│       └── AdminConfig.jsx     # Admin Config (+ Social Links)
```

## 6. Các Tính Năng Đã Hoàn Thành
- [x] Khởi tạo dự án Vite + React và Tailwind CSS theo bộ màu phong thủy Mệnh Thổ.
- [x] Trang Chủ (Home) và layout responsive.
- [x] Admin Login kết nối Supabase Auth, middleware `ProtectedRoute`.
- [x] Bảng `site_config` và trang **General Settings** — quản lý nội dung tĩnh (Hero, About, Banner).
- [x] Hệ thống quản trị với Router URL thật (tránh lỗi Sidebar): `/admin`, `/admin/blog`, `/admin/config`.
- [x] **[MỚI] Social Media Integration**: Thêm input FB/LinkedIn/Spotify trong trang Config và render thành các icon `lucide-react` ở Homepage/Footer.
- [x] **[MỚI] Detail Pages & Transitions**:
  - Khởi tạo trang `ProjectDetail.jsx` và `BlogDetail.jsx`.
  - Fetch dữ liệu động qua tham số URL ID.
  - Tích hợp `framer-motion` tạo hiệu ứng Fade-in Slide-up cực mượt khi chuyển trang giữa Home ↔ Detail.
- [x] **[MỚI] Font Be Vietnam Pro**: Thay Inter/Outfit bằng Be Vietnam Pro để hiển thị tiếng Việt mượt mà trên toàn bộ trang.
- [x] **[MỚI] Blog Cover Image**: Thêm cột `cover_image_url` vào bảng `blog_posts`; Admin form có trường nhập URL + preview ảnh; BlogDetail hiển thị ảnh bìa full-width bên dưới tiêu đề.

---
*(Tệp này được tự động cập nhật sau mỗi tính năng quan trọng mới).*
