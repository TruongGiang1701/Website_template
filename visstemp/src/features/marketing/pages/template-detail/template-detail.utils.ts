import {
  homePricingOption2,
  type HomeTemplateItem,
  type PricingPlan,
} from "@/features/marketing/pages/home/home.data";

export type TemplateIndustry =
  | "fashion"
  | "restaurant"
  | "beauty"
  | "education"
  | "corporate"
  | "technology"
  | "real_estate"
  | "entertainment";

export type TemplateFeatureGroup = {
  heading: string;
  bullets: string[];
};

export function slugifyTemplateName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getTemplateSlug(item: HomeTemplateItem) {
  return `${slugifyTemplateName(item.title)}-${item.id}`;
}

export function getTemplateDetailHref(item: HomeTemplateItem) {
  if (item.href?.startsWith("/templates/")) return item.href;
  return `/templates/${getTemplateSlug(item)}`;
}

export function formatPrice(item: HomeTemplateItem) {
  return item.price ?? "10.000.000 VND";
}

export function inferIndustry(item: HomeTemplateItem): TemplateIndustry {
  const haystack = `${item.title} ${item.tags.join(" ")} ${item.group}`.toLowerCase();

  if (/(nha hang|f&b|cafe|bbq|fast food|am thuc)/.test(haystack)) return "restaurant";
  if (/(spa|tham my|my pham|beauty|dental|fitness|gym)/.test(haystack)) return "beauty";
  if (/(giao duc|course|e-learning|ngoai ngu|khoa hoc)/.test(haystack))
    return "education";
  if (/(bat dong san|real estate)/.test(haystack)) return "real_estate";
  if (/(streaming|xem phim|entertainment)/.test(haystack)) return "entertainment";
  if (/(thoi trang|fashion|streetwear|watch|dong ho|e-commerce)/.test(haystack))
    return "fashion";
  if (/(startup|agency|tech|cong nghe|portfolio|software)/.test(haystack))
    return "technology";
  return "corporate";
}

const featureLibrary: Record<TemplateIndustry, TemplateFeatureGroup> = {
  fashion: {
    heading: "Các tính năng chính cho website bán hàng thời trang",
    bullets: [
      "Trang danh mục sản phẩm có bộ lọc theo size, màu sắc, mức giá, thương hiệu và trạng thái còn hàng để khách tìm đúng mẫu chỉ sau vài thao tác.",
      "Trang chi tiết sản phẩm hỗ trợ ảnh zoom đa góc, gợi ý phối đồ theo set, bảng quy đổi size (VN/US/EU) và hướng dẫn chọn size theo chiều cao/cân nặng.",
      "Giỏ hàng + thanh toán đa bước tối ưu chuyển đổi: áp mã giảm giá, chọn đơn vị vận chuyển, tự động tính phí ship theo khu vực và xác nhận đơn qua email/SMS.",
      "Khu vực quản trị đơn hàng giúp theo dõi trạng thái theo thời gian thực (mới tạo, đóng gói, giao hàng, hoàn tất), đồng bộ tồn kho theo biến thể size/màu.",
      "Khối banner khuyến mãi theo chiến dịch (Flash Sale, BST mới, combo) kèm countdown và logic ưu tiên sản phẩm lợi nhuận cao ngay trên trang chủ.",
      "Tìm kiếm thông minh có gợi ý từ khóa, sản phẩm tương tự và lịch sử tìm kiếm, giúp tăng tỉ lệ click vào sản phẩm phù hợp.",
      "Responsive-first cho mobile: sticky CTA mua ngay, giỏ hàng mini, thao tác một tay thuận tiện và tối ưu tốc độ tải ảnh bằng lazy loading.",
      "Chuẩn SEO cho ecommerce: schema Product/Offer/Review, URL thân thiện, heading đúng cấu trúc và tối ưu Core Web Vitals để tăng thứ hạng tìm kiếm.",
    ],
  },
  restaurant: {
    heading: "Các tính năng chính cho website nhà hàng/F&B",
    bullets: [
      "Menu món ăn phân nhóm rõ ràng (món chính, combo, đồ uống) với ảnh thực tế, giá bán, trạng thái còn món và đề xuất món đi kèm.",
      "Đặt bàn online theo khung giờ, số lượng khách và khu vực ngồi; hệ thống tự động khóa slot trùng để tránh overbooking.",
      "Trang ưu đãi theo thời gian thực hiển thị combo hot, khuyến mãi theo khung giờ vàng và voucher dành cho khách quay lại.",
      "Tích hợp bản đồ, chỉ đường, hotline một chạm và lịch mở cửa để khách dễ liên hệ ngay từ thiết bị di động.",
      "Quản trị nội dung linh hoạt: cập nhật menu theo mùa, thêm chi nhánh mới, chỉnh ảnh banner mà không cần can thiệp code.",
      "Module đánh giá khách hàng và phản hồi trực tiếp giúp tăng độ tin cậy thương hiệu và cải thiện trải nghiệm dịch vụ.",
      "SEO local cho nhà hàng: tối ưu từ khóa khu vực, schema LocalBusiness, trang chi nhánh riêng để tăng traffic tìm kiếm gần bạn.",
      "Giao diện mobile tối ưu quyết định nhanh: nút đặt bàn cố định, CTA gọi điện, hiển thị món nổi bật ở vùng nhìn đầu tiên.",
    ],
  },
  beauty: {
    heading: "Các tính năng chính cho website làm đẹp/spa/clinic",
    bullets: [
      "Danh mục dịch vụ trình bày theo nhu cầu (chăm sóc da, trị liệu, nha khoa, thẩm mỹ) với bảng giá rõ ràng và thời lượng thực hiện.",
      "Đặt lịch trực tuyến theo chuyên viên, khung giờ và cơ sở; gửi nhắc lịch tự động qua email/SMS để giảm tỉ lệ vắng mặt.",
      "Trang trước/sau (before-after) và feedback khách hàng có bộ lọc theo dịch vụ để tăng tính thuyết phục khi ra quyết định.",
      "Form tư vấn cá nhân hóa thu thập tình trạng hiện tại + mong muốn, tự động chuyển lead về CRM để đội ngũ chăm sóc gọi lại nhanh.",
      "Bán sản phẩm chăm sóc tại nhà kèm gợi ý routine phù hợp, upsell theo combo và quản lý tồn kho sản phẩm chuẩn theo lô.",
      "Hệ thống quyền quản trị cho lễ tân, tư vấn viên, quản lý giúp phân tách dữ liệu khách hàng và lịch hẹn an toàn.",
      "Tối ưu UX/UI theo hành vi mobile: nút đặt lịch nổi, thao tác ít bước, nội dung trust (chứng chỉ, bác sĩ, cơ sở vật chất) ở vị trí nổi bật.",
      "Chuẩn SEO ngành làm đẹp với landing page dịch vụ riêng, FAQ schema và tối ưu nội dung theo từ khóa chuyển đổi cao.",
    ],
  },
  education: {
    heading: "Các tính năng chính cho website giáo dục/khóa học",
    bullets: [
      "Danh mục khóa học có lọc theo cấp độ, hình thức học, học phí và thời gian khai giảng để học viên chọn chương trình phù hợp.",
      "Trang chi tiết khóa học trình bày syllabus theo tuần, hồ sơ giảng viên, đầu ra cam kết và tài nguyên học thử.",
      "Đăng ký học online với nhiều hình thức thanh toán, xuất hóa đơn và tự động kích hoạt tài khoản học tập ngay sau khi thanh toán.",
      "Hệ thống quản lý lớp học: theo dõi tiến độ học viên, điểm số, bài tập và gửi thông báo nhắc lịch học định kỳ.",
      "Module webinar/sự kiện tuyển sinh tích hợp form lead, đếm ngược và phân loại nguồn lead theo chiến dịch marketing.",
      "Tìm kiếm khóa học theo mục tiêu nghề nghiệp và gợi ý lộ trình học cá nhân hóa dựa trên năng lực đầu vào.",
      "Responsive mobile giúp học viên tra cứu bài học, lịch học và tài liệu nhanh; tối ưu hiệu năng khi truy cập mạng yếu.",
      "Tối ưu SEO content hub: trang chia sẻ kiến thức, bộ từ khóa dài theo ngành và schema Course để tăng hiển thị tự nhiên.",
    ],
  },
  corporate: {
    heading: "Các tính năng chính cho website doanh nghiệp",
    bullets: [
      "Trang giới thiệu công ty thể hiện năng lực cốt lõi, hồ sơ pháp lý, đội ngũ và dự án tiêu biểu để nâng cao uy tín thương hiệu.",
      "Module dịch vụ/sản phẩm cấu trúc theo ngành, có CTA theo từng giai đoạn funnel (tìm hiểu, nhận báo giá, đặt lịch tư vấn).",
      "Form lead nâng cao với trường thông tin theo nhu cầu B2B, tự động phân loại mức độ tiềm năng để đội sales xử lý ưu tiên.",
      "Trang dự án/case study có bộ lọc theo lĩnh vực và KPI kết quả, giúp tăng niềm tin khi khách hàng ra quyết định hợp tác.",
      "Hệ thống tin tức - thông báo hỗ trợ chiến lược nội dung dài hạn, giúp thương hiệu duy trì sự hiện diện chuyên nghiệp.",
      "Tích hợp đa ngôn ngữ và cấu trúc URL chuẩn cho thị trường quốc tế, thuận lợi mở rộng hoạt động kinh doanh.",
      "Bảo mật và phân quyền quản trị theo phòng ban, ghi log thao tác để đảm bảo an toàn dữ liệu doanh nghiệp.",
      "SEO kỹ thuật + hiệu năng: kiến trúc thông tin rõ ràng, internal link chiến lược, tối ưu tốc độ giúp tăng chất lượng lead inbound.",
    ],
  },
  technology: {
    heading: "Các tính năng chính cho website công nghệ/startup",
    bullets: [
      "Trang sản phẩm SaaS/giải pháp có trình bày use case theo ngành, bảng so sánh gói và CTA demo/trial tối ưu chuyển đổi B2B.",
      "Khối tài liệu kỹ thuật gồm changelog, docs, FAQ và onboarding guide giúp giảm tải đội hỗ trợ khi scale người dùng.",
      "Tích hợp đăng ký tài khoản, xác thực email và flow onboarding nhiều bước để tăng activation rate cho người dùng mới.",
      "Dashboard giới thiệu tính năng theo module, có biểu đồ minh họa realtime tạo cảm nhận sản phẩm mạnh và hiện đại.",
      "Kênh thu lead developer-friendly: form API access, nhận webhook key, theo dõi trạng thái yêu cầu trong khu vực khách hàng.",
      "Tìm kiếm tài liệu thông minh theo từ khóa kỹ thuật, hỗ trợ filter theo module và phiên bản sản phẩm.",
      "UI motion/interaction có kiểm soát (micro-animation, trạng thái loading/skeleton) để trải nghiệm mượt nhưng vẫn tối ưu hiệu năng.",
      "SEO cho sản phẩm công nghệ: trang feature riêng, cấu trúc semantic tốt, schema SoftwareApplication để tăng hiển thị organic.",
    ],
  },
  real_estate: {
    heading: "Các tính năng chính cho website bất động sản",
    bullets: [
      "Danh sách dự án/bất động sản có bộ lọc nâng cao: vị trí, diện tích, mức giá, pháp lý, số phòng và tiến độ bàn giao.",
      "Trang chi tiết dự án hiển thị thư viện ảnh, sơ đồ mặt bằng, tiện ích xung quanh và tài liệu tải xuống cho khách hàng tiềm năng.",
      "Bản đồ tương tác giúp người dùng xem nhanh vị trí dự án, thời gian di chuyển và các điểm dịch vụ lân cận.",
      "Form đăng ký nhận báo giá/đặt lịch xem nhà tự động chuyển lead tới sale phụ trách theo khu vực.",
      "Quản trị giỏ hàng sản phẩm dự án: trạng thái căn hộ, mức giá cập nhật, lịch sử thay đổi và note nội bộ đội kinh doanh.",
      "Khu vực tin tức thị trường hỗ trợ chiến lược content SEO dài hạn và xây uy tín chuyên gia tư vấn.",
      "Responsive tối ưu cho mobile giúp khách xem nhanh ảnh dự án, gọi sale ngay và gửi thông tin chỉ với vài thao tác.",
      "Chuẩn SEO bất động sản: landing page theo quận/huyện, schema RealEstateListing và tối ưu tốc độ cho ảnh kích thước lớn.",
    ],
  },
  entertainment: {
    heading: "Các tính năng chính cho website giải trí/streaming",
    bullets: [
      "Thư viện nội dung phân loại theo thể loại, quốc gia, năm phát hành và trạng thái xem để người dùng tìm phim/chương trình nhanh.",
      "Trang chi tiết nội dung có trailer, thông tin diễn viên, đánh giá cộng đồng và gợi ý nội dung tương tự theo hành vi xem.",
      "Module tài khoản cá nhân lưu lịch sử xem, danh sách yêu thích và đồng bộ đa thiết bị cho trải nghiệm liền mạch.",
      "Tìm kiếm realtime với đề xuất thông minh theo từ khóa, tag và trending giúp tăng thời gian onsite.",
      "Trang chiến dịch nổi bật (new release/hot this week) với bố cục hero + carousel để đẩy nội dung trọng điểm.",
      "Hệ thống phân quyền nội dung theo gói thành viên, khu vực và độ tuổi để đáp ứng yêu cầu vận hành thực tế.",
      "Tối ưu hiệu năng media: lazy load thumbnail, preload có điều kiện, giảm thời gian phản hồi ở lần tải đầu.",
      "SEO content phong phú: trang bộ sưu tập, trang người nổi tiếng và cụm chủ đề để mở rộng traffic tự nhiên.",
    ],
  },
};

export function getDynamicFeatureGroup(item: HomeTemplateItem): TemplateFeatureGroup {
  const industry = inferIndustry(item);
  return featureLibrary[industry];
}

export function getServicePackagesForDetail(): PricingPlan[] {
  return homePricingOption2.plans.filter(
    (x) => x.id === "premium" || x.id === "care_plus",
  );
}
