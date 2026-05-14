/** Dữ liệu tĩnh / copy cho Home — tách khỏi JSX để scale theo Figma. */
export const homeHeroOption2 = {
  titlePrefix: "Xây dựng",
  titleHighlight: "Website đẹp",
  titleSuffix: "& Landing Page hiệu quả",
  description:
    "Dịch vụ thiết kế website, landing page chuẩn SEO. Kho template đa ngành, lộ trình triển khai rõ ràng, giá minh bạch.",
  benefits: ["Thiết kế theo ngành", "Chuẩn SEO", "Triển khai nhanh"],
  cta: { label: "Nhận tư vấn miễn phí", href: "/about" },
} as const;

export const homeShowcaseOption2 = {
  heading: "Hiện thực hóa mọi ý tưởng của bạn ngay tại VISSTEMP",
  description:
    "Không cần biết code, bạn có thể tạo Website & Landing Page chỉ trong vài phút",
  tabs: ["Phổ biến", "Baby Store", "Pet Store", "Nội thất nhà cửa", "Thể thao"],
  cardTitle: "SOFTWARE UPDATE",
  cardSubtitle: "LATEST VERSION",
} as const;

export const homeClientsOption2 = {
  headingPrefix: "Khách hàng của",
  headingHighlight: "VISSTEMP",
  logos: [
    "/images/logos/logo_2.png",
    "/images/logos/logo_3.png",
    "/images/logos/logo_4.png",
    "/images/logos/logo_5.jpg",
    "/images/logos/logo_6.png",
    "/images/logos/logo_7.png",
  ],
} as const;

export const homeLandingHighlightsOption2 = {
  sections: [
    {
      id: "template-vault",
      tone: "blue",
      title: "Kho tàng Template không giới hạn Tha hồ lựa chọn",
      description:
        "VISSTEMP có sẵn các mẫu website & landing page đủ thể loại và phong cách. Phù hợp với mọi ngành nghề.",
      ctaLabel: "Trải nghiệm mẫu ngay",
      ctaHref: "/templates",
      image: "/images/categories/template.jpg",
    },
    {
      id: "custom-design",
      tone: "deep",
      title: "Thiết kế và chỉnh sửa Theo yêu cầu của khách hàng",
      description:
        "Nghiên cứu, tư vấn và đưa ra giải pháp hợp lý nhất cho từng khách hàng và doanh nghiệp.",
      ctaLabel: "Tư vấn miễn phí",
      ctaHref: "/about",
      image: "/images/categories/template_3.jpg",
      keywords: [
        "JavaScript",
        "Next.js",
        "ReactJS",
        "Tailwind",
        "WordPress",
        "Figma",
        "Responsive",
        "Node.js",
        "Design Thinking",
        "VISSSOFT",
      ],
    },
    {
      id: "support-maintenance",
      tone: "purple",
      title: "Hướng dẫn sử dụng và Bảo trì",
      description:
        "Đảm bảo khách hàng làm chủ được sản phẩm. Duy trì và nâng cấp sản phẩm theo thời gian.",
      ctaLabel: "Xem các gói dịch vụ",
      ctaHref: "/pricing",
      image: "/images/categories/template_2.jpg",
    },
  ],
} as const;

export const homeStatsOption2 = {
  heading: "1000+mẫu Website & Landing Page đa dạng",
} as const;

export type HomeTemplateItem = {
  id: string;
  title: string;
  image: string;
  href: string;
  tags: string[];
  price?: string;
  group:
    | "Thời trang"
    | "Nhà hàng"
    | "Làm đẹp"
    | "Giáo dục"
    | "Doanh nghiệp"
    | "Công nghệ";
  featured?: boolean;
};

export const homeTemplateOption2 = {
  searchPlaceholder: "Tìm kiếm mẫu website",
  allTabs: [
    "Tất cả",
    "Thời trang",
    "Nhà hàng",
    "Làm đẹp",
    "Giáo dục",
    "Doanh nghiệp",
    "Công nghệ",
  ] as const,
  /** Dữ liệu mẫu đã gỡ — catalog lấy từ DB qua `/api/products`. Giữ `allTabs` cho UI. */
  items: [] satisfies HomeTemplateItem[],
} as const;

export type RoadmapStep = {
  id: "01" | "02" | "03" | "04";
  title: string;
  lead: string;
  bullets: string[];
  outcome: string;
};

export const homeRoadmapOption2 = {
  heading: "Lộ trình phát triển Website / Landing Page",
  description:
    "Từ lúc tiếp nhận yêu cầu đến khi vận hành ổn định, VISSTEMP triển khai theo quy trình 4 bước rõ ràng để đảm bảo đúng mục tiêu, đúng tiến độ và tối ưu chuyển đổi.",
  steps: [
    {
      id: "01",
      title: "Tiếp nhận & làm rõ yêu cầu",
      lead: "Thu thập thông tin để chốt mục tiêu, đối tượng và phạm vi triển khai ngay từ đầu.",
      bullets: [
        "Xác định mục tiêu (lead, bán hàng, giới thiệu thương hiệu, tuyển dụng…)",
        "Thu thập nội dung: logo, màu thương hiệu, hình ảnh, copywriting",
        "Chốt sitemap + các section bắt buộc theo hành trình người dùng",
        "Định nghĩa KPI & tiêu chí nghiệm thu (tốc độ, SEO, conversion)",
      ],
      outcome: "Kết quả: Brief + sitemap + checklist deliverables.",
    },
    {
      id: "02",
      title: "Thiết kế UI/UX theo Figma",
      lead: "Dựng wireframe → UI chi tiết, đồng bộ token (màu, font, spacing) để không vỡ style khi scale.",
      bullets: [
        "Xây design system: typography, button, card, form, spacing scale",
        "Thiết kế layout responsive (mobile/tablet/desktop)",
        "Review trải nghiệm: CTA, hierarchy, microcopy, trạng thái empty/error",
        "Bàn giao Figma kèm guideline & assets",
      ],
      outcome: "Kết quả: Figma final + tokens + component list.",
    },
    {
      id: "03",
      title: "Phát triển & tích hợp tính năng",
      lead: "Triển khai theo cụm section/page, tái sử dụng primitives và data-driven để nhanh và dễ bảo trì.",
      bullets: [
        "Dựng layout chung (Header/Footer) + route groups theo khu vực",
        "Code UI primitives trước, sau đó compose sections theo Option/Variant",
        "Tối ưu hiệu năng: image, font, bundle, accessibility",
        "Tích hợp form/CRM, chat, analytics, tracking chuyển đổi (nếu cần)",
      ],
      outcome: "Kết quả: Bản build chạy ổn + checklist QA.",
    },
    {
      id: "04",
      title: "Kiểm thử, bàn giao & vận hành",
      lead: "Đảm bảo website chạy mượt, đúng chuẩn SEO, và có quy trình cập nhật sau launch.",
      bullets: [
        "Test đa thiết bị/trình duyệt, kiểm tra responsive & tương tác",
        "Thiết lập SEO cơ bản: metadata, sitemap/robots, heading structure",
        "Hướng dẫn quản trị nội dung, tạo landing mới từ template",
        "Theo dõi & tối ưu: đo lường, A/B nội dung, cải thiện chuyển đổi",
      ],
      outcome: "Kết quả: Go-live + tài liệu vận hành + kế hoạch tối ưu.",
    },
  ] satisfies RoadmapStep[],
} as const;

export type PricingPlan = {
  id: "basic" | "premium" | "care_plus";
  name: string;
  tagline: string;
  priceLabel: string;
  features: string[];
  cta: { label: string; href: string };
  recommended?: boolean;
  giftNote?: string;
};

export const homePricingOption2 = {
  heading: "Bảng giá các Gói dịch vụ",
  description: "Các gói dịch vụ phù hợp với kế hoạch của bạn",
  plans: [
    {
      id: "basic",
      name: "GÓI TEMPLATE BASIC",
      tagline: '"Chọn ngay mẫu website sẵn có – nhanh, đẹp, tiết kiệm"',
      priceLabel: "GIÁ TỪ 10.000.000 ĐẾN 15.000.000 VND",
      features: [
        "Cung cấp file thiết kế hoặc giao diện mẫu sẵn sàng sử dụng.",
        "Phù hợp cho khách hàng muốn tự triển khai hoặc có đội ngũ lập trình riêng.",
      ],
      cta: { label: "GIÁ TỪ 10.000.000 ĐẾN 15.000.000 VND", href: "/pricing" },
    },
    {
      id: "premium",
      name: "GÓI WEBSITE PREMIUM",
      tagline: '"Tư vấn – Thiết kế – Lập trình – Hoàn thiện trọn gói"',
      priceLabel: "LIÊN HỆ NGAY",
      features: [
        "Nghiên cứu nhu cầu & tư vấn chiến lược xây dựng website.",
        "Thiết kế giao diện UI/UX độc quyền.",
        "Lập trình website chuẩn SEO & tối ưu hiệu năng hoạt động.",
        "Bàn giao sản phẩm hoàn chỉnh, sẵn sàng hoạt động.",
      ],
      cta: { label: "LIÊN HỆ NGAY", href: "/about" },
      recommended: true,
      giftNote: "Tặng 3 tháng sử dụng gói WEBSITE CARE+",
    },
    {
      id: "care_plus",
      name: "GÓI WEBSITE CARE+",
      tagline: '"Dịch vụ đồng hành – Vận hành trơn tru, nâng cấp liên tục"',
      priceLabel: "LIÊN HỆ NGAY",
      features: [
        "Cung cấp hosting và domain.",
        "Quản trị nội dung & sao lưu dữ liệu định kỳ.",
        "Bảo trì kỹ thuật & khắc phục sự cố.",
        "Nâng cấp tính năng theo nhu cầu.",
      ],
      cta: { label: "LIÊN HỆ NGAY", href: "/about" },
    },
  ] satisfies PricingPlan[],
} as const;

export type ContactShowcaseItem = {
  id: string;
  title: string;
  image: string;
  href: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
};

export const homeContactOption2 = {
  heading: "Sở hữu website của riêng bạn",
  subheading:
    "Đây không phải là dạng thuê website. Bạn sở hữu source code, hình ảnh và nội dung 100%, dễ mở rộng theo từng giai đoạn tăng trưởng.",
  caption:
    "VISSTEMP đồng hành từ tư vấn, triển khai đến tối ưu vận hành để website luôn bền vững.",
  contactCta: {
    label: "Liên hệ với VISSTEMP",
    href: "/about",
  },
  phone: "0909 999 888",
  email: "hello@visstemp.vn",
  projects: [
    {
      id: "project-1",
      title: "Landing page giáo dục",
      image: "/images/contact/project-1.jpg",
      href: "/pricing",
    },
    {
      id: "project-2",
      title: "Website giới thiệu nội thất",
      image: "/images/contact/project-2.jpg",
      href: "/pricing",
    },
    {
      id: "project-3",
      title: "Trang web portfolio sáng tạo",
      image: "/images/contact/project-3.jpg",
      href: "/pricing",
    },
    {
      id: "project-4",
      title: "Website thương mại điện tử",
      image: "/images/contact/project-4.jpg",
      href: "/pricing",
    },
    {
      id: "project-5",
      title: "Website dịch vụ chuyên nghiệp",
      image: "/images/contact/project-5.jpg",
      href: "/pricing",
    },
    {
      id: "project-6",
      title: "Landing page bất động sản",
      image: "/images/contact/project-6.jpg",
      href: "/pricing",
    },
    {
      id: "project-7",
      title: "Website giới thiệu sản phẩm công nghệ",
      image: "/images/contact/project-7.jpg",
      href: "/pricing",
    },
  ] satisfies ContactShowcaseItem[],
  team: [
    {
      id: "member-1",
      name: "Ngoc Minh",
      role: "Frontend Engineer",
      image: "/images/team/member-1.jpg",
    },
    {
      id: "member-2",
      name: "Thanh Huyen",
      role: "UI/UX Designer",
      image: "/images/team/member-2.jpg",
    },
    {
      id: "member-3",
      name: "Hoang Nam",
      role: "Backend Engineer",
      image: "/images/team/member-3.jpg",
    },
  ] satisfies TeamMember[],
} as const;
