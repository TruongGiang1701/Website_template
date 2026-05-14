-- Generated from src/features/marketing/pages/home/home.data.ts
-- Run:
-- - bash/zsh:    psql "$DATABASE_URL" -f db/seed.sql
-- - PowerShell:  psql "$env:DATABASE_URL" -f db/seed.sql
-- - cmd.exe:     psql "%DATABASE_URL%" -f db/seed.sql
BEGIN;

-- Tags
INSERT INTO tags (name, slug) VALUES ('E-commerce', 'e-commerce') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Nội thất', 'noi-that') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Doanh nghiệp', 'doanh-nghiep') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Watch', 'watch') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Thời trang', 'thoi-trang') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Pet care', 'pet-care') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Dịch vụ', 'dich-vu') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Streaming', 'streaming') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Entertainment', 'entertainment') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Công nghệ', 'cong-nghe') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Kiến trúc', 'kien-truc') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Corporate', 'corporate') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Education', 'education') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Course', 'course') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('E-learning', 'e-learning') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Automotive', 'automotive') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Showroom', 'showroom') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Cafe', 'cafe') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('F&B', 'f-b') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Nhà hàng', 'nha-hang') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Fashion', 'fashion') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Streetwear', 'streetwear') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Luxury', 'luxury') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Asian food', 'asian-food') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('BBQ', 'bbq') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Booking', 'booking') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Fast food', 'fast-food') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Spa', 'spa') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Beauty', 'beauty') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Làm đẹp', 'lam-dep') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Aesthetics', 'aesthetics') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Clinic', 'clinic') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Dental', 'dental') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Legal', 'legal') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Construction', 'construction') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Real estate', 'real-estate') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Landing page', 'landing-page') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Giáo dục', 'giao-duc') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Language center', 'language-center') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Edu', 'edu') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Portfolio', 'portfolio') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Personal', 'personal') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Agency', 'agency') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Marketing', 'marketing') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Startup', 'startup') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Tech', 'tech') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Cosmetic', 'cosmetic') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Smart home', 'smart-home') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Fitness', 'fitness') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO tags (name, slug) VALUES ('Gym', 'gym') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- Products
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-01', 'Website E-commerce Nội Thất Phòng Cách Đơn Giản Và Tinh Tế', 'website-e-commerce-noi-that-phong-cach-don-gian-va-tinh-te-tpl-01', 'Doanh nghiệp', 12000000, true, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-02', 'Website E-commerce Đồng Hồ Phong Cách Hiện Đại Và Sang Trọng', 'website-e-commerce-dong-ho-phong-cach-hien-dai-va-sang-trong-tpl-02', 'Thời trang', 9900000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-03', 'Website Dịch Vụ Chăm Sóc Thú Cưng - Dễ Thương Và Độc Đáo', 'website-dich-vu-cham-soc-thu-cung-de-thuong-va-doc-dao-tpl-03', 'Doanh nghiệp', 7900000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-04', 'Website Xem Phim Trực Tuyến Với Bố Cục Đa Dạng Và Chi Tiết', 'website-xem-phim-truc-tuyen-voi-bo-cuc-da-dang-va-chi-tiet-tpl-04', 'Công nghệ', 10500000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-05', 'Website Giới Thiệu Công Ty Kiến Trúc Phong Cách Hiện Đại Và Tối Giản', 'website-gioi-thieu-cong-ty-kien-truc-phong-cach-hien-dai-va-toi-gian-tpl-05', 'Doanh nghiệp', 8900000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-06', 'Website Trung Tâm Học Thuật, Khóa Học Và Dạy Online', 'website-trung-tam-hoc-thuat-khoa-hoc-va-day-online-tpl-06', 'Giáo dục', 6900000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-07', 'Website Giới Thiệu Và Trưng Bày Showroom Ô Tô', 'website-gioi-thieu-va-trung-bay-showroom-o-to-tpl-07', 'Doanh nghiệp', 11900000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-08', 'Website Giới Thiệu Quán Cafe Giao Diện Độc Đáo', 'website-gioi-thieu-quan-cafe-giao-dien-doc-dao-tpl-08', 'Nhà hàng', 5900000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-09', 'Website E-commerce Thời Trang Nữ Phong Cách Thanh Lịch Và Hiện Đại', 'website-e-commerce-thoi-trang-nu-phong-cach-thanh-lich-va-hien-dai-tpl-09', 'Thời trang', 12900000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-10', 'Website Bán Quần Áo Streetwear Cá Tính Và Trẻ Trung', 'website-ban-quan-ao-streetwear-ca-tinh-va-tre-trung-tpl-10', 'Thời trang', 8500000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-11', 'Website Thời Trang Cao Cấp Sang Trọng Dành Cho Doanh Nghiệp', 'website-thoi-trang-cao-cap-sang-trong-danh-cho-doanh-nghiep-tpl-11', 'Thời trang', 14200000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-12', 'Website Nhà Hàng Ẩm Thực Á Đông Giao Diện Ấm Cúng Và Tinh Tế', 'website-nha-hang-am-thuc-a-dong-giao-dien-am-cung-va-tinh-te-tpl-12', 'Nhà hàng', 7500000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-13', 'Website Nhà Hàng BBQ Hiện Đại Với Trải Nghiệm Đặt Bàn Online', 'website-nha-hang-bbq-hien-dai-voi-trai-nghiem-dat-ban-online-tpl-13', 'Nhà hàng', 10900000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-14', 'Website Quán Ăn Nhanh Fast Food Thiết Kế Trẻ Trung Và Năng Động', 'website-quan-an-nhanh-fast-food-thiet-ke-tre-trung-va-nang-dong-tpl-14', 'Nhà hàng', 6500000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-15', 'Website Spa Làm Đẹp Cao Cấp Phong Cách Thư Giãn Và Sang Trọng', 'website-spa-lam-dep-cao-cap-phong-cach-thu-gian-va-sang-trong-tpl-15', 'Làm đẹp', 13500000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-16', 'Website Thẩm Mỹ Viện Chuyên Nghiệp Tối Ưu Chuyển Đổi', 'website-tham-my-vien-chuyen-nghiep-toi-uu-chuyen-doi-tpl-16', 'Làm đẹp', 11500000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-17', 'Website Phòng Khám Nha Khoa Hiện Đại Chuẩn UX/UI', 'website-phong-kham-nha-khoa-hien-dai-chuan-ux-ui-tpl-17', 'Làm đẹp', 9500000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-18', 'Website Dịch Vụ Luật Sư Uy Tín Giao Diện Trang Trọng', 'website-dich-vu-luat-su-uy-tin-giao-dien-trang-trong-tpl-18', 'Doanh nghiệp', 10000000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-19', 'Website Công Ty Xây Dựng Phong Cách Doanh Nghiệp Chuyên Nghiệp', 'website-cong-ty-xay-dung-phong-cach-doanh-nghiep-chuyen-nghiep-tpl-19', 'Doanh nghiệp', 8000000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-20', 'Website Bất Động Sản Cao Cấp Tối Ưu Hiển Thị Dự Án', 'website-bat-dong-san-cao-cap-toi-uu-hien-thi-du-an-tpl-20', 'Doanh nghiệp', 15000000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-21', 'Website Landing Page Bán Khóa Học Online Tối Ưu Chuyển Đổi', 'website-landing-page-ban-khoa-hoc-online-toi-uu-chuyen-doi-tpl-21', 'Giáo dục', 6000000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-22', 'Website Trung Tâm Ngoại Ngữ Hiện Đại Và Dễ Sử Dụng', 'website-trung-tam-ngoai-ngu-hien-dai-va-de-su-dung-tpl-22', 'Giáo dục', 7000000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-23', 'Website Portfolio Cá Nhân Sáng Tạo Cho Designer Và Developer', 'website-portfolio-ca-nhan-sang-tao-cho-designer-va-developer-tpl-23', 'Công nghệ', 5000000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-24', 'Website Agency Marketing Digital Phong Cách Hiện Đại Và Đột Phá', 'website-agency-marketing-digital-phong-cach-hien-dai-va-dot-pha-tpl-24', 'Công nghệ', 12500000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-25', 'Website Công Ty Công Nghệ Startup Giao Diện Tối Giản Và Ấn Tượng', 'website-cong-ty-cong-nghe-startup-giao-dien-toi-gian-va-an-tuong-tpl-25', 'Công nghệ', 9000000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-26', 'Website Bán Mỹ Phẩm Online Phong Cách Tinh Tế Và Thu Hút', 'website-ban-my-pham-online-phong-cach-tinh-te-va-thu-hut-tpl-26', 'Làm đẹp', 10800000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-27', 'Website Bán Đồ Gia Dụng Thông Minh Giao Diện Hiện Đại', 'website-ban-do-gia-dung-thong-minh-giao-dien-hien-dai-tpl-27', 'Doanh nghiệp', 8800000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();
INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)
VALUES ('tpl-28', 'Website Fitness & Gym Trẻ Trung Năng Động Và Truyền Cảm Hứng', 'website-fitness-gym-tre-trung-nang-dong-va-truyen-cam-hung-tpl-28', 'Làm đẹp', 7800000, false, 'active', NULL)
ON CONFLICT (slug) DO UPDATE SET
  legacy_key = EXCLUDED.legacy_key,
  title = EXCLUDED.title,
  group_name = EXCLUDED.group_name,
  price_vnd = EXCLUDED.price_vnd,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  try_url = EXCLUDED.try_url,
  updated_at = now();

-- Product images (re-seed)
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE legacy_key IS NOT NULL);
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-noi-that-phong-cach-don-gian-va-tinh-te-tpl-01'), '/images/products/product_1.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-noi-that-phong-cach-don-gian-va-tinh-te-tpl-01'), '/images/products/product_3.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-noi-that-phong-cach-don-gian-va-tinh-te-tpl-01'), '/images/products/product_5.png', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-noi-that-phong-cach-don-gian-va-tinh-te-tpl-01'), '/images/products/product_7.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-noi-that-phong-cach-don-gian-va-tinh-te-tpl-01'), '/images/products/product_18.jpg', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-dong-ho-phong-cach-hien-dai-va-sang-trong-tpl-02'), '/images/products/product_2.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-dong-ho-phong-cach-hien-dai-va-sang-trong-tpl-02'), '/images/products/product_9.jpg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-dong-ho-phong-cach-hien-dai-va-sang-trong-tpl-02'), '/images/products/product_10.jpeg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-dong-ho-phong-cach-hien-dai-va-sang-trong-tpl-02'), '/images/products/product_11.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-cham-soc-thu-cung-de-thuong-va-doc-dao-tpl-03'), '/images/products/product_3.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-cham-soc-thu-cung-de-thuong-va-doc-dao-tpl-03'), '/images/products/product_1.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-cham-soc-thu-cung-de-thuong-va-doc-dao-tpl-03'), '/images/products/product_5.png', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-cham-soc-thu-cung-de-thuong-va-doc-dao-tpl-03'), '/images/products/product_7.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-cham-soc-thu-cung-de-thuong-va-doc-dao-tpl-03'), '/images/products/product_18.jpg', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-xem-phim-truc-tuyen-voi-bo-cuc-da-dang-va-chi-tiet-tpl-04'), '/images/products/product_4.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-xem-phim-truc-tuyen-voi-bo-cuc-da-dang-va-chi-tiet-tpl-04'), '/images/products/product_23.jpg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-xem-phim-truc-tuyen-voi-bo-cuc-da-dang-va-chi-tiet-tpl-04'), '/images/products/product_24.png', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-xem-phim-truc-tuyen-voi-bo-cuc-da-dang-va-chi-tiet-tpl-04'), '/images/products/product_25.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-cong-ty-kien-truc-phong-cach-hien-dai-va-toi-gian-tpl-05'), '/images/products/product_5.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-cong-ty-kien-truc-phong-cach-hien-dai-va-toi-gian-tpl-05'), '/images/products/product_1.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-cong-ty-kien-truc-phong-cach-hien-dai-va-toi-gian-tpl-05'), '/images/products/product_3.png', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-cong-ty-kien-truc-phong-cach-hien-dai-va-toi-gian-tpl-05'), '/images/products/product_7.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-cong-ty-kien-truc-phong-cach-hien-dai-va-toi-gian-tpl-05'), '/images/products/product_18.jpg', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-hoc-thuat-khoa-hoc-va-day-online-tpl-06'), '/images/products/product_6.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-hoc-thuat-khoa-hoc-va-day-online-tpl-06'), '/images/products/product_21.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-hoc-thuat-khoa-hoc-va-day-online-tpl-06'), '/images/products/product_22.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-va-trung-bay-showroom-o-to-tpl-07'), '/images/products/product_7.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-va-trung-bay-showroom-o-to-tpl-07'), '/images/products/product_1.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-va-trung-bay-showroom-o-to-tpl-07'), '/images/products/product_3.png', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-va-trung-bay-showroom-o-to-tpl-07'), '/images/products/product_5.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-va-trung-bay-showroom-o-to-tpl-07'), '/images/products/product_18.jpg', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-quan-cafe-giao-dien-doc-dao-tpl-08'), '/images/products/product_8.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-quan-cafe-giao-dien-doc-dao-tpl-08'), '/images/products/product_12.jpg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-quan-cafe-giao-dien-doc-dao-tpl-08'), '/images/products/product_13.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-quan-cafe-giao-dien-doc-dao-tpl-08'), '/images/products/product_14.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-thoi-trang-nu-phong-cach-thanh-lich-va-hien-dai-tpl-09'), '/images/products/product_9.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-thoi-trang-nu-phong-cach-thanh-lich-va-hien-dai-tpl-09'), '/images/products/product_2.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-thoi-trang-nu-phong-cach-thanh-lich-va-hien-dai-tpl-09'), '/images/products/product_10.jpeg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-thoi-trang-nu-phong-cach-thanh-lich-va-hien-dai-tpl-09'), '/images/products/product_11.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-quan-ao-streetwear-ca-tinh-va-tre-trung-tpl-10'), '/images/products/product_10.jpeg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-quan-ao-streetwear-ca-tinh-va-tre-trung-tpl-10'), '/images/products/product_2.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-quan-ao-streetwear-ca-tinh-va-tre-trung-tpl-10'), '/images/products/product_9.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-quan-ao-streetwear-ca-tinh-va-tre-trung-tpl-10'), '/images/products/product_11.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-thoi-trang-cao-cap-sang-trong-danh-cho-doanh-nghiep-tpl-11'), '/images/products/product_11.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-thoi-trang-cao-cap-sang-trong-danh-cho-doanh-nghiep-tpl-11'), '/images/products/product_2.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-thoi-trang-cao-cap-sang-trong-danh-cho-doanh-nghiep-tpl-11'), '/images/products/product_9.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-thoi-trang-cao-cap-sang-trong-danh-cho-doanh-nghiep-tpl-11'), '/images/products/product_10.jpeg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-am-thuc-a-dong-giao-dien-am-cung-va-tinh-te-tpl-12'), '/images/products/product_12.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-am-thuc-a-dong-giao-dien-am-cung-va-tinh-te-tpl-12'), '/images/products/product_8.jpg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-am-thuc-a-dong-giao-dien-am-cung-va-tinh-te-tpl-12'), '/images/products/product_13.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-am-thuc-a-dong-giao-dien-am-cung-va-tinh-te-tpl-12'), '/images/products/product_14.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-bbq-hien-dai-voi-trai-nghiem-dat-ban-online-tpl-13'), '/images/products/product_13.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-bbq-hien-dai-voi-trai-nghiem-dat-ban-online-tpl-13'), '/images/products/product_8.jpg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-bbq-hien-dai-voi-trai-nghiem-dat-ban-online-tpl-13'), '/images/products/product_12.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-bbq-hien-dai-voi-trai-nghiem-dat-ban-online-tpl-13'), '/images/products/product_14.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-quan-an-nhanh-fast-food-thiet-ke-tre-trung-va-nang-dong-tpl-14'), '/images/products/product_14.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-quan-an-nhanh-fast-food-thiet-ke-tre-trung-va-nang-dong-tpl-14'), '/images/products/product_8.jpg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-quan-an-nhanh-fast-food-thiet-ke-tre-trung-va-nang-dong-tpl-14'), '/images/products/product_12.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-quan-an-nhanh-fast-food-thiet-ke-tre-trung-va-nang-dong-tpl-14'), '/images/products/product_13.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-spa-lam-dep-cao-cap-phong-cach-thu-gian-va-sang-trong-tpl-15'), '/images/products/product_15.jpeg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-spa-lam-dep-cao-cap-phong-cach-thu-gian-va-sang-trong-tpl-15'), '/images/products/product_16.jpg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-spa-lam-dep-cao-cap-phong-cach-thu-gian-va-sang-trong-tpl-15'), '/images/products/product_17.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-spa-lam-dep-cao-cap-phong-cach-thu-gian-va-sang-trong-tpl-15'), '/images/products/product_26.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-spa-lam-dep-cao-cap-phong-cach-thu-gian-va-sang-trong-tpl-15'), '/images/products/product_28.png', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-tham-my-vien-chuyen-nghiep-toi-uu-chuyen-doi-tpl-16'), '/images/products/product_16.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-tham-my-vien-chuyen-nghiep-toi-uu-chuyen-doi-tpl-16'), '/images/products/product_15.jpeg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-tham-my-vien-chuyen-nghiep-toi-uu-chuyen-doi-tpl-16'), '/images/products/product_17.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-tham-my-vien-chuyen-nghiep-toi-uu-chuyen-doi-tpl-16'), '/images/products/product_26.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-tham-my-vien-chuyen-nghiep-toi-uu-chuyen-doi-tpl-16'), '/images/products/product_28.png', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-phong-kham-nha-khoa-hien-dai-chuan-ux-ui-tpl-17'), '/images/products/product_17.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-phong-kham-nha-khoa-hien-dai-chuan-ux-ui-tpl-17'), '/images/products/product_15.jpeg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-phong-kham-nha-khoa-hien-dai-chuan-ux-ui-tpl-17'), '/images/products/product_16.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-phong-kham-nha-khoa-hien-dai-chuan-ux-ui-tpl-17'), '/images/products/product_26.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-phong-kham-nha-khoa-hien-dai-chuan-ux-ui-tpl-17'), '/images/products/product_28.png', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-luat-su-uy-tin-giao-dien-trang-trong-tpl-18'), '/images/products/product_18.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-luat-su-uy-tin-giao-dien-trang-trong-tpl-18'), '/images/products/product_1.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-luat-su-uy-tin-giao-dien-trang-trong-tpl-18'), '/images/products/product_3.png', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-luat-su-uy-tin-giao-dien-trang-trong-tpl-18'), '/images/products/product_5.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-luat-su-uy-tin-giao-dien-trang-trong-tpl-18'), '/images/products/product_7.jpg', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-xay-dung-phong-cach-doanh-nghiep-chuyen-nghiep-tpl-19'), '/images/products/product_19.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-xay-dung-phong-cach-doanh-nghiep-chuyen-nghiep-tpl-19'), '/images/products/product_1.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-xay-dung-phong-cach-doanh-nghiep-chuyen-nghiep-tpl-19'), '/images/products/product_3.png', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-xay-dung-phong-cach-doanh-nghiep-chuyen-nghiep-tpl-19'), '/images/products/product_5.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-xay-dung-phong-cach-doanh-nghiep-chuyen-nghiep-tpl-19'), '/images/products/product_7.jpg', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-bat-dong-san-cao-cap-toi-uu-hien-thi-du-an-tpl-20'), '/images/products/product_20.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-bat-dong-san-cao-cap-toi-uu-hien-thi-du-an-tpl-20'), '/images/products/product_1.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-bat-dong-san-cao-cap-toi-uu-hien-thi-du-an-tpl-20'), '/images/products/product_3.png', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-bat-dong-san-cao-cap-toi-uu-hien-thi-du-an-tpl-20'), '/images/products/product_5.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-bat-dong-san-cao-cap-toi-uu-hien-thi-du-an-tpl-20'), '/images/products/product_7.jpg', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-landing-page-ban-khoa-hoc-online-toi-uu-chuyen-doi-tpl-21'), '/images/products/product_21.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-landing-page-ban-khoa-hoc-online-toi-uu-chuyen-doi-tpl-21'), '/images/products/product_6.jpg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-landing-page-ban-khoa-hoc-online-toi-uu-chuyen-doi-tpl-21'), '/images/products/product_22.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-ngoai-ngu-hien-dai-va-de-su-dung-tpl-22'), '/images/products/product_22.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-ngoai-ngu-hien-dai-va-de-su-dung-tpl-22'), '/images/products/product_6.jpg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-ngoai-ngu-hien-dai-va-de-su-dung-tpl-22'), '/images/products/product_21.png', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-portfolio-ca-nhan-sang-tao-cho-designer-va-developer-tpl-23'), '/images/products/product_23.jpg', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-portfolio-ca-nhan-sang-tao-cho-designer-va-developer-tpl-23'), '/images/products/product_4.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-portfolio-ca-nhan-sang-tao-cho-designer-va-developer-tpl-23'), '/images/products/product_24.png', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-portfolio-ca-nhan-sang-tao-cho-designer-va-developer-tpl-23'), '/images/products/product_25.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-agency-marketing-digital-phong-cach-hien-dai-va-dot-pha-tpl-24'), '/images/products/product_24.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-agency-marketing-digital-phong-cach-hien-dai-va-dot-pha-tpl-24'), '/images/products/product_4.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-agency-marketing-digital-phong-cach-hien-dai-va-dot-pha-tpl-24'), '/images/products/product_23.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-agency-marketing-digital-phong-cach-hien-dai-va-dot-pha-tpl-24'), '/images/products/product_25.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-cong-nghe-startup-giao-dien-toi-gian-va-an-tuong-tpl-25'), '/images/products/product_25.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-cong-nghe-startup-giao-dien-toi-gian-va-an-tuong-tpl-25'), '/images/products/product_4.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-cong-nghe-startup-giao-dien-toi-gian-va-an-tuong-tpl-25'), '/images/products/product_23.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-cong-nghe-startup-giao-dien-toi-gian-va-an-tuong-tpl-25'), '/images/products/product_24.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-my-pham-online-phong-cach-tinh-te-va-thu-hut-tpl-26'), '/images/products/product_26.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-my-pham-online-phong-cach-tinh-te-va-thu-hut-tpl-26'), '/images/products/product_15.jpeg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-my-pham-online-phong-cach-tinh-te-va-thu-hut-tpl-26'), '/images/products/product_16.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-my-pham-online-phong-cach-tinh-te-va-thu-hut-tpl-26'), '/images/products/product_17.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-my-pham-online-phong-cach-tinh-te-va-thu-hut-tpl-26'), '/images/products/product_28.png', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-do-gia-dung-thong-minh-giao-dien-hien-dai-tpl-27'), '/images/products/product_27.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-do-gia-dung-thong-minh-giao-dien-hien-dai-tpl-27'), '/images/products/product_1.png', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-do-gia-dung-thong-minh-giao-dien-hien-dai-tpl-27'), '/images/products/product_3.png', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-do-gia-dung-thong-minh-giao-dien-hien-dai-tpl-27'), '/images/products/product_5.png', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-ban-do-gia-dung-thong-minh-giao-dien-hien-dai-tpl-27'), '/images/products/product_7.jpg', NULL, 4) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-fitness-gym-tre-trung-nang-dong-va-truyen-cam-hung-tpl-28'), '/images/products/product_28.png', NULL, 0) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-fitness-gym-tre-trung-nang-dong-va-truyen-cam-hung-tpl-28'), '/images/products/product_15.jpeg', NULL, 1) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-fitness-gym-tre-trung-nang-dong-va-truyen-cam-hung-tpl-28'), '/images/products/product_16.jpg', NULL, 2) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-fitness-gym-tre-trung-nang-dong-va-truyen-cam-hung-tpl-28'), '/images/products/product_17.jpg', NULL, 3) ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='website-fitness-gym-tre-trung-nang-dong-va-truyen-cam-hung-tpl-28'), '/images/products/product_26.png', NULL, 4) ON CONFLICT DO NOTHING;

-- Product tags (re-seed)
DELETE FROM product_tags WHERE product_id IN (SELECT id FROM products WHERE legacy_key IS NOT NULL);
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-noi-that-phong-cach-don-gian-va-tinh-te-tpl-01'), (SELECT id FROM tags WHERE slug='e-commerce')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-noi-that-phong-cach-don-gian-va-tinh-te-tpl-01'), (SELECT id FROM tags WHERE slug='noi-that')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-noi-that-phong-cach-don-gian-va-tinh-te-tpl-01'), (SELECT id FROM tags WHERE slug='doanh-nghiep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-dong-ho-phong-cach-hien-dai-va-sang-trong-tpl-02'), (SELECT id FROM tags WHERE slug='e-commerce')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-dong-ho-phong-cach-hien-dai-va-sang-trong-tpl-02'), (SELECT id FROM tags WHERE slug='watch')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-dong-ho-phong-cach-hien-dai-va-sang-trong-tpl-02'), (SELECT id FROM tags WHERE slug='thoi-trang')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-cham-soc-thu-cung-de-thuong-va-doc-dao-tpl-03'), (SELECT id FROM tags WHERE slug='pet-care')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-cham-soc-thu-cung-de-thuong-va-doc-dao-tpl-03'), (SELECT id FROM tags WHERE slug='dich-vu')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-cham-soc-thu-cung-de-thuong-va-doc-dao-tpl-03'), (SELECT id FROM tags WHERE slug='doanh-nghiep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-xem-phim-truc-tuyen-voi-bo-cuc-da-dang-va-chi-tiet-tpl-04'), (SELECT id FROM tags WHERE slug='streaming')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-xem-phim-truc-tuyen-voi-bo-cuc-da-dang-va-chi-tiet-tpl-04'), (SELECT id FROM tags WHERE slug='entertainment')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-xem-phim-truc-tuyen-voi-bo-cuc-da-dang-va-chi-tiet-tpl-04'), (SELECT id FROM tags WHERE slug='cong-nghe')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-cong-ty-kien-truc-phong-cach-hien-dai-va-toi-gian-tpl-05'), (SELECT id FROM tags WHERE slug='kien-truc')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-cong-ty-kien-truc-phong-cach-hien-dai-va-toi-gian-tpl-05'), (SELECT id FROM tags WHERE slug='corporate')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-cong-ty-kien-truc-phong-cach-hien-dai-va-toi-gian-tpl-05'), (SELECT id FROM tags WHERE slug='doanh-nghiep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-hoc-thuat-khoa-hoc-va-day-online-tpl-06'), (SELECT id FROM tags WHERE slug='education')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-hoc-thuat-khoa-hoc-va-day-online-tpl-06'), (SELECT id FROM tags WHERE slug='course')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-hoc-thuat-khoa-hoc-va-day-online-tpl-06'), (SELECT id FROM tags WHERE slug='e-learning')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-va-trung-bay-showroom-o-to-tpl-07'), (SELECT id FROM tags WHERE slug='automotive')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-va-trung-bay-showroom-o-to-tpl-07'), (SELECT id FROM tags WHERE slug='showroom')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-va-trung-bay-showroom-o-to-tpl-07'), (SELECT id FROM tags WHERE slug='doanh-nghiep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-quan-cafe-giao-dien-doc-dao-tpl-08'), (SELECT id FROM tags WHERE slug='cafe')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-quan-cafe-giao-dien-doc-dao-tpl-08'), (SELECT id FROM tags WHERE slug='f-b')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-gioi-thieu-quan-cafe-giao-dien-doc-dao-tpl-08'), (SELECT id FROM tags WHERE slug='nha-hang')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-thoi-trang-nu-phong-cach-thanh-lich-va-hien-dai-tpl-09'), (SELECT id FROM tags WHERE slug='e-commerce')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-thoi-trang-nu-phong-cach-thanh-lich-va-hien-dai-tpl-09'), (SELECT id FROM tags WHERE slug='fashion')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-e-commerce-thoi-trang-nu-phong-cach-thanh-lich-va-hien-dai-tpl-09'), (SELECT id FROM tags WHERE slug='thoi-trang')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-ban-quan-ao-streetwear-ca-tinh-va-tre-trung-tpl-10'), (SELECT id FROM tags WHERE slug='streetwear')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-ban-quan-ao-streetwear-ca-tinh-va-tre-trung-tpl-10'), (SELECT id FROM tags WHERE slug='fashion')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-ban-quan-ao-streetwear-ca-tinh-va-tre-trung-tpl-10'), (SELECT id FROM tags WHERE slug='thoi-trang')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-thoi-trang-cao-cap-sang-trong-danh-cho-doanh-nghiep-tpl-11'), (SELECT id FROM tags WHERE slug='luxury')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-thoi-trang-cao-cap-sang-trong-danh-cho-doanh-nghiep-tpl-11'), (SELECT id FROM tags WHERE slug='fashion')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-thoi-trang-cao-cap-sang-trong-danh-cho-doanh-nghiep-tpl-11'), (SELECT id FROM tags WHERE slug='thoi-trang')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-am-thuc-a-dong-giao-dien-am-cung-va-tinh-te-tpl-12'), (SELECT id FROM tags WHERE slug='f-b')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-am-thuc-a-dong-giao-dien-am-cung-va-tinh-te-tpl-12'), (SELECT id FROM tags WHERE slug='asian-food')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-am-thuc-a-dong-giao-dien-am-cung-va-tinh-te-tpl-12'), (SELECT id FROM tags WHERE slug='nha-hang')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-bbq-hien-dai-voi-trai-nghiem-dat-ban-online-tpl-13'), (SELECT id FROM tags WHERE slug='bbq')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-bbq-hien-dai-voi-trai-nghiem-dat-ban-online-tpl-13'), (SELECT id FROM tags WHERE slug='booking')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-nha-hang-bbq-hien-dai-voi-trai-nghiem-dat-ban-online-tpl-13'), (SELECT id FROM tags WHERE slug='nha-hang')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-quan-an-nhanh-fast-food-thiet-ke-tre-trung-va-nang-dong-tpl-14'), (SELECT id FROM tags WHERE slug='fast-food')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-quan-an-nhanh-fast-food-thiet-ke-tre-trung-va-nang-dong-tpl-14'), (SELECT id FROM tags WHERE slug='f-b')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-quan-an-nhanh-fast-food-thiet-ke-tre-trung-va-nang-dong-tpl-14'), (SELECT id FROM tags WHERE slug='nha-hang')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-spa-lam-dep-cao-cap-phong-cach-thu-gian-va-sang-trong-tpl-15'), (SELECT id FROM tags WHERE slug='spa')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-spa-lam-dep-cao-cap-phong-cach-thu-gian-va-sang-trong-tpl-15'), (SELECT id FROM tags WHERE slug='beauty')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-spa-lam-dep-cao-cap-phong-cach-thu-gian-va-sang-trong-tpl-15'), (SELECT id FROM tags WHERE slug='lam-dep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-tham-my-vien-chuyen-nghiep-toi-uu-chuyen-doi-tpl-16'), (SELECT id FROM tags WHERE slug='aesthetics')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-tham-my-vien-chuyen-nghiep-toi-uu-chuyen-doi-tpl-16'), (SELECT id FROM tags WHERE slug='clinic')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-tham-my-vien-chuyen-nghiep-toi-uu-chuyen-doi-tpl-16'), (SELECT id FROM tags WHERE slug='lam-dep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-phong-kham-nha-khoa-hien-dai-chuan-ux-ui-tpl-17'), (SELECT id FROM tags WHERE slug='dental')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-phong-kham-nha-khoa-hien-dai-chuan-ux-ui-tpl-17'), (SELECT id FROM tags WHERE slug='clinic')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-phong-kham-nha-khoa-hien-dai-chuan-ux-ui-tpl-17'), (SELECT id FROM tags WHERE slug='lam-dep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-luat-su-uy-tin-giao-dien-trang-trong-tpl-18'), (SELECT id FROM tags WHERE slug='legal')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-luat-su-uy-tin-giao-dien-trang-trong-tpl-18'), (SELECT id FROM tags WHERE slug='corporate')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-dich-vu-luat-su-uy-tin-giao-dien-trang-trong-tpl-18'), (SELECT id FROM tags WHERE slug='doanh-nghiep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-xay-dung-phong-cach-doanh-nghiep-chuyen-nghiep-tpl-19'), (SELECT id FROM tags WHERE slug='construction')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-xay-dung-phong-cach-doanh-nghiep-chuyen-nghiep-tpl-19'), (SELECT id FROM tags WHERE slug='corporate')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-xay-dung-phong-cach-doanh-nghiep-chuyen-nghiep-tpl-19'), (SELECT id FROM tags WHERE slug='doanh-nghiep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-bat-dong-san-cao-cap-toi-uu-hien-thi-du-an-tpl-20'), (SELECT id FROM tags WHERE slug='real-estate')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-bat-dong-san-cao-cap-toi-uu-hien-thi-du-an-tpl-20'), (SELECT id FROM tags WHERE slug='corporate')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-bat-dong-san-cao-cap-toi-uu-hien-thi-du-an-tpl-20'), (SELECT id FROM tags WHERE slug='doanh-nghiep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-landing-page-ban-khoa-hoc-online-toi-uu-chuyen-doi-tpl-21'), (SELECT id FROM tags WHERE slug='landing-page')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-landing-page-ban-khoa-hoc-online-toi-uu-chuyen-doi-tpl-21'), (SELECT id FROM tags WHERE slug='course')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-landing-page-ban-khoa-hoc-online-toi-uu-chuyen-doi-tpl-21'), (SELECT id FROM tags WHERE slug='giao-duc')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-ngoai-ngu-hien-dai-va-de-su-dung-tpl-22'), (SELECT id FROM tags WHERE slug='language-center')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-ngoai-ngu-hien-dai-va-de-su-dung-tpl-22'), (SELECT id FROM tags WHERE slug='edu')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-trung-tam-ngoai-ngu-hien-dai-va-de-su-dung-tpl-22'), (SELECT id FROM tags WHERE slug='giao-duc')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-portfolio-ca-nhan-sang-tao-cho-designer-va-developer-tpl-23'), (SELECT id FROM tags WHERE slug='portfolio')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-portfolio-ca-nhan-sang-tao-cho-designer-va-developer-tpl-23'), (SELECT id FROM tags WHERE slug='personal')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-portfolio-ca-nhan-sang-tao-cho-designer-va-developer-tpl-23'), (SELECT id FROM tags WHERE slug='cong-nghe')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-agency-marketing-digital-phong-cach-hien-dai-va-dot-pha-tpl-24'), (SELECT id FROM tags WHERE slug='agency')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-agency-marketing-digital-phong-cach-hien-dai-va-dot-pha-tpl-24'), (SELECT id FROM tags WHERE slug='marketing')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-agency-marketing-digital-phong-cach-hien-dai-va-dot-pha-tpl-24'), (SELECT id FROM tags WHERE slug='cong-nghe')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-cong-nghe-startup-giao-dien-toi-gian-va-an-tuong-tpl-25'), (SELECT id FROM tags WHERE slug='startup')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-cong-nghe-startup-giao-dien-toi-gian-va-an-tuong-tpl-25'), (SELECT id FROM tags WHERE slug='tech')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-cong-ty-cong-nghe-startup-giao-dien-toi-gian-va-an-tuong-tpl-25'), (SELECT id FROM tags WHERE slug='cong-nghe')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-ban-my-pham-online-phong-cach-tinh-te-va-thu-hut-tpl-26'), (SELECT id FROM tags WHERE slug='cosmetic')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-ban-my-pham-online-phong-cach-tinh-te-va-thu-hut-tpl-26'), (SELECT id FROM tags WHERE slug='e-commerce')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-ban-my-pham-online-phong-cach-tinh-te-va-thu-hut-tpl-26'), (SELECT id FROM tags WHERE slug='lam-dep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-ban-do-gia-dung-thong-minh-giao-dien-hien-dai-tpl-27'), (SELECT id FROM tags WHERE slug='smart-home')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-ban-do-gia-dung-thong-minh-giao-dien-hien-dai-tpl-27'), (SELECT id FROM tags WHERE slug='e-commerce')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-ban-do-gia-dung-thong-minh-giao-dien-hien-dai-tpl-27'), (SELECT id FROM tags WHERE slug='doanh-nghiep')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-fitness-gym-tre-trung-nang-dong-va-truyen-cam-hung-tpl-28'), (SELECT id FROM tags WHERE slug='fitness')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-fitness-gym-tre-trung-nang-dong-va-truyen-cam-hung-tpl-28'), (SELECT id FROM tags WHERE slug='gym')) ON CONFLICT DO NOTHING;
INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='website-fitness-gym-tre-trung-nang-dong-va-truyen-cam-hung-tpl-28'), (SELECT id FROM tags WHERE slug='lam-dep')) ON CONFLICT DO NOTHING;

COMMIT;
