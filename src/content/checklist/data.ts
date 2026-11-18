/**
 * Checklist yêu cầu để theme được duyệt lên Shopify Theme Store — dịch & rút gọn từ
 * https://shopify.dev/docs/storefronts/themes/store/requirements.
 *
 * Cú pháp trong chuỗi: `code` → <code>, **đậm** → <strong>. Ký tự HTML được escape khi render.
 * ID của từng mục (dùng để lưu trạng thái tick) = `${section.id}-${thứ tự mục trong section}`,
 * nên thêm mục mới vào CUỐI section để không làm lệch trạng thái đã lưu của người dùng.
 */

export interface ChecklistGroup {
  title?: string;
  /** Nhóm khuyến nghị — nên làm nhưng không bắt buộc để được duyệt. */
  recommended?: boolean;
  note?: string;
  items: string[];
  /** Bảng thuật ngữ [nên dùng, không dùng] hiển thị dưới các mục. */
  terms?: [use: string, avoid: string][];
}

export interface ChecklistSection {
  id: string;
  title: string;
  intro?: string;
  groups: ChecklistGroup[];
  note?: string;
}

export const CHECKLIST: ChecklistSection[] = [
  {
    id: "exclusivity",
    title: "Độc quyền trên Theme Store",
    groups: [
      {
        items: [
          "Theme đã lên Theme Store thì chỉ được bán qua Theme Store, không bán trên marketplace khác.",
          "Không chèn credit tác giả (ví dụ link về website của dev) hay link affiliate vào file theme.",
        ],
      },
    ],
  },
  {
    id: "uniqueness",
    title: "Khác biệt so với theme khác",
    intro: "Theme phải khác hẳn các theme đang có trên Theme Store — kể cả theme của chính bạn. Cần đổi mới thật sự về thiết kế và tính năng, không chỉ chỉnh vài chi tiết bề ngoài.",
    groups: [
      {
        items: [
          "Khác biệt trên **trải nghiệm tổng thể** qua các template và thành phần chính. Được tái sử dụng component/thư viện, nhưng cách lắp ghép phải khác đáng kể.",
          "Không thể tái tạo \"chất\" của theme chỉ bằng chỉnh setting, đổi style bề mặt hay thêm vài section — muốn làm giống phải thay đổi lớn về cấu trúc.",
          "Có art direction sáng tạo, với hệ thống rõ ràng cho header & navigation, product card, cách trình bày media và cấu trúc trang.",
          "Không dựa vào thay đổi kiểu \"trang điểm\" hay thêm thắt: chỉnh spacing, đổi màu/font, gradient, shape divider, hiệu ứng nền/blur, chỉnh animation/transition, thêm vài setting hoặc section vào codebase có sẵn — những thứ này **không được tính** là khác biệt.",
          "Sự khác biệt nằm ở tầng kiến trúc, để theme vẫn giữ bản sắc riêng khi sau này thêm setting, section, tính năng.",
          "Chủ shop không thể mua theme rồi tùy chỉnh cho gần giống hệt một theme khác trên Theme Store.",
        ],
      },
    ],
    note: "Codebase duy nhất được phép dùng làm nền là **Skeleton Theme** của Shopify; ngoài ra phải là code tự viết hoàn toàn. Theme mới dựa trên hoặc phái sinh từ **Dawn** hay **Horizon** không được chấp nhận.",
  },
  {
    id: "design",
    title: "Thiết kế & UX",
    intro: "Phải đạt tất cả các tiêu chí dưới đây; trượt tiêu chí nào thì phải sửa xong mới được duyệt.",
    groups: [
      {
        title: "Thiết kế hình ảnh & art direction",
        items: [
          "**Thiết kế riêng, có chủ đích**: nổi bật, không na ná theme có sẵn; nhắm tới một nhóm chủ shop/ngành hàng cụ thể với phong cách hình ảnh rõ ràng.",
          "**Hình ảnh chuyên nghiệp**: ảnh, đồ họa, icon sắc nét, đúng kích thước, đồng bộ. Không dùng ảnh mờ, bị kéo giãn, vỡ pixel hay kiểu clipart.",
          "**Bảng màu đơn giản, hài hòa**: các màu đi với nhau, không chỏi nhau, không làm khó đọc.",
        ],
      },
      {
        title: "Bố cục",
        items: [
          "**Cấu trúc trang rõ ràng**: grid logic, khoảng cách và căn lề nhất quán, dễ lướt qua.",
          "**Phân cấp nội dung rõ**: dùng kích thước, màu, độ tương phản, vị trí để làm nổi thông tin chính; thông tin phụ nhỏ hơn, nhạt hơn hoặc xếp sau.",
          "**Bố cục linh hoạt mà vẫn chỉn chu**: trang vẫn cân đối khi độ dài nội dung, số ảnh, lượng chữ thay đổi — không có khoảng hở lạc lõng, vùng trống lớn hay layout vỡ.",
        ],
      },
      {
        title: "Nhất quán",
        items: [
          "**Typography nhất quán**: không dùng quá nhiều font, các font bổ trợ nhau, giữ một cặp font xuyên suốt.",
          "**Thiết kế & tương tác nhất quán**: button, link, form có cùng style, kích thước, màu và hành vi ở mọi nơi.",
          "**Settings gọn gàng**: ngôn ngữ đơn giản, dễ hiểu với chủ shop, nhóm hợp lý, tác vụ thường dùng dễ tìm.",
          "**Theme editor thân thiện với chủ shop**: tùy chỉnh trực quan, nhất quán; setting dễ hiểu, dễ tìm, cân bằng giữa linh hoạt và định hướng sẵn.",
        ],
      },
      {
        title: "Trải nghiệm mua sắm",
        items: [
          "Điều hướng rõ ràng, trơn tru: trang chủ → khám phá sản phẩm → trang sản phẩm → giỏ hàng → checkout.",
          "Khám phá sản phẩm dễ dàng qua menu trực quan, collection nổi bật hoặc gợi ý rõ ràng.",
          "Thao tác mua hàng mượt: chọn option, thêm vào giỏ, sửa giỏ, sang checkout đều rõ ràng và phản hồi ngay.",
        ],
      },
      {
        title: "Store demo",
        items: [
          "**Đầy đủ, thực tế**: mô phỏng một doanh nghiệp thật với sản phẩm chọn lọc, ảnh chuyên nghiệp, tình huống thực tế, nội dung tự viết. Không Lorem Ipsum hay nội dung giữ chỗ.",
          "**Section phù hợp, có chủ đích**: mọi section/tính năng hiển thị đều hợp với mô hình kinh doanh; bỏ những gì không phục vụ sản phẩm hay thông điệp.",
          "**Truyền cảm hứng cho chủ shop**: nội dung cuốn hút, bố cục đẹp, trình bày sản phẩm thực tế.",
        ],
      },
    ],
  },
  {
    id: "features",
    title: "Tính năng bắt buộc",
    intro: "Theme nào cũng phải hỗ trợ đủ các tính năng sau.",
    groups: [
      {
        items: [
          "**Sections Everywhere**: tương thích Online Store 2.0 (xem phần Template, section & block).",
          "**Discount**: hiển thị số tiền giảm ở cấp sản phẩm và cấp đơn hàng trong cart, checkout và order. Bắt buộc có ở trang Cart.",
          "**Nút accelerated checkout** (thanh toán nhanh): có ở trang Product và Cart. Không được đổi màu các nút thanh toán có thương hiệu.",
          "**Lọc sản phẩm (faceted filtering)**: trang collection và search lọc được theo tình trạng còn hàng, giá, loại sản phẩm, vendor và option của variant.",
          "**Gift card**: có template gift card hiển thị thẻ quà tặng được cấp sau khi mua.",
          "**Image focal point**: hỗ trợ điểm lấy nét của ảnh (đặt trong setting `image_picker` ở theme editor hoặc trang Files trong admin).",
          "**Ảnh khi chia sẻ mạng xã hội**: dùng object `page_image` để hiện thumbnail khi chia sẻ lên Facebook, Pinterest…",
          "**Chọn quốc gia / tiền tệ**: khi bán ra nước ngoài bằng tiền tệ địa phương, khách phải chọn được tiền tệ và quốc gia/khu vực (theo hướng dẫn UX của Shopify).",
          "**Chọn ngôn ngữ**: khi bán đa ngôn ngữ, khách phải chọn được ngôn ngữ (theo cùng hướng dẫn UX).",
          "**Menu nhiều cấp**: hỗ trợ menu lồng nhau để tạo dropdown nhiều cấp.",
          "**Form newsletter**: form đăng ký nhận email để làm email marketing.",
          "**Pickup availability**: trang Product hiển thị khả năng nhận hàng tại cửa hàng mà không cần thêm vào giỏ.",
          "**Sản phẩm liên quan (related)**: section trên trang Product hiển thị sản phẩm liên quan được gợi ý tự động.",
          "**Sản phẩm mua kèm (complementary)**: hiển thị sản phẩm bổ trợ trên trang Product.",
          "**Rich media**: model 3D, video nhúng, video Vimeo/YouTube — trong template product, section featured product và các form sản phẩm như quick view.",
          "**Tìm kiếm**: có template search và predictive search (gợi ý ngay khi gõ).",
          "**Selling plan** (gói subscription): chủ shop tạo được gói đăng ký định kỳ; gói khách đã chọn hiển thị trong trang Cart.",
          "**Shop Pay Installments**: banner trả góp trên trang Product.",
          "**Unit price** (đơn giá theo đơn vị đo): bắt buộc ở một số khu vực; hỗ trợ trên trang Collection, Product và Cart.",
          "**Ảnh theo variant**: mỗi variant gắn được một ảnh riêng.",
          "**Follow on Shop**: nút theo dõi store trên app Shop, dùng filter `login_button`. Không đổi màu nút có thương hiệu.",
          "**Account component**: thêm `<shopify-account>` vào header, hiển thị cả trên desktop lẫn mobile.",
        ],
      },
    ],
  },
  {
    id: "templates",
    title: "Template, section & block",
    intro: "Section và block giúp chủ shop tự sắp xếp trang và chỉnh giao diện mà không cần sửa code.",
    groups: [
      {
        title: "Template",
        items: [
          "Có đủ: `theme.liquid` (layout), `404.json`, `article.json`, `blog.json`, `cart.json`, `collection.json`, `index.json`, `list-collections.json`, `page.json`, `page.contact.json`, `password.json`, `product.json`, `search.json`, `gift_card.liquid`, `settings_data.json` và `settings_schema.json` (config).",
          "Không đưa file `config/markets.json` vào bản nộp.",
        ],
      },
      {
        title: "Section",
        items: [
          "Mọi template đều hỗ trợ section (JSON template), trừ trang Customer Account, Gift Card và Checkout.",
          "Có section **Custom Liquid** chứa setting kiểu `liquid`, dùng được trên mọi template hỗ trợ section (đây là điểm chèn cho một số loại app).",
          "Header và footer được render trong **section group**, để chủ shop thêm, xóa, sắp xếp lại được.",
        ],
      },
      {
        title: "Block & app block",
        items: [
          "Section main product chia thành block cho tất cả (hoặc phần lớn) thành phần — ví dụ price, vendor, description là các block riêng (tham khảo `main-product.liquid` của Dawn).",
          "Section main product và featured product hỗ trợ app block (`\"type\": \"@app\"`).",
          "Chỗ nào có thể đặt app block thì cũng thêm block **Custom Liquid** (có setting kiểu `liquid`).",
        ],
      },
    ],
  },
  {
    id: "lighthouse",
    title: "Lighthouse: hiệu năng & accessibility",
    groups: [
      {
        items: [
          "Điểm **Performance** trung bình ≥ **60** trên trang product, collection và trang chủ — cả desktop lẫn mobile.",
          "Điểm **Accessibility** trung bình ≥ **90** trên các trang trên — cả desktop lẫn mobile.",
          "Khi đo điểm, section phải có ảnh và nội dung thật, không để trống.",
        ],
      },
    ],
    note: "Đo trên shop benchmark (bộ dữ liệu chuẩn) mà Shopify cung cấp, theo hướng dẫn test performance và accessibility của Shopify.",
  },
  {
    id: "pages",
    title: "Các trang",
    groups: [
      {
        title: "Layout (theme.liquid)",
        items: [
          "Nếu hiển thị logo phương thức thanh toán: dùng `shop.enabled_payment_types` với filter `payment_type_img_url` hoặc `payment_type_svg_tag`; icon phải đủ màu.",
          "Thẻ `<html>` có thuộc tính `lang`, ví dụ `lang=\"{{ request.locale.iso_code }}\"`.",
          "Tạo URL động bằng object `routes` — ví dụ dùng `routes.root_url` thay cho `href=\"/\"`.",
          "Không sửa hay parse `content_for_header` (nội dung này có thể thay đổi bất cứ lúc nào, làm code của bạn chạy sai).",
        ],
      },
      {
        title: "Product",
        items: [
          "Hiển thị `product.title` (không cắt chữ), `variant.price`, `variant.unit_price`, giá so sánh (compare-at) của variant, `product.description`, tên và giá trị của option.",
          "Xem được tất cả ảnh sản phẩm; ảnh khác tỉ lệ không làm vỡ layout.",
          "Chọn variant nào thì hiện ảnh của variant đó.",
          "Dùng `cart.taxes_included` để báo giá đã gồm thuế (khi store dùng giá gồm thuế).",
          "Chức năng mua: tách variant thành từng option để chọn, chọn số lượng, nút Add to cart (thường bị disable/thay thế khi chọn tổ hợp không tồn tại hoặc hết hàng).",
          "Khi đổi variant: cập nhật giá, giá so sánh và thông báo hết hàng.",
          "Khi tải trang, chọn sẵn variant còn hàng đầu tiên (`product.selected_or_first_available_variant`).",
          "Hỗ trợ: gợi ý sản phẩm, rich media, accelerated checkout (bật mặc định), pickup availability, Shop Pay Installments.",
          "Sản phẩm gift card cho phép gửi tặng người nhận (`gift_card.recipient`): dùng `form.email`, `form.name`, `form.message` và `gift_card.send_on`.",
          "Swatch của option hiển thị màu hex hoặc ảnh, dùng `swatch.color` và `swatch.image`.",
        ],
      },
      {
        title: "Collection",
        items: [
          "Hiển thị `collection.title` (không cắt chữ), `collection.description`, `collection.image`.",
          "Liệt kê sản phẩm dạng grid/list với `product.title` (không cắt chữ, link tới `product.url`), `product.price`, `product.images`, `variant.unit_price` và ít nhất một media cho mỗi sản phẩm.",
          "Grid sản phẩm không vỡ khi ảnh khác tỉ lệ.",
          "Hiện badge Sale hoặc `product.compare_at_price_max` khi phù hợp.",
          "Khách sắp xếp (sort) được sản phẩm trong collection.",
          "Có thông báo khi collection không có sản phẩm nào.",
          "Các variant khác giá thì dùng `product.price_varies` — ví dụ hiện khoảng giá từ `product.price_min` đến `product.price_max`.",
          "Có phân trang (`paginate`) hoặc lazy load.",
        ],
      },
      {
        title: "Collection list",
        items: [
          "Hiển thị `collection.title` (không cắt chữ).",
          "Dùng `collection.featured_image` (tự lấy ảnh sản phẩm đầu tiên nếu collection chưa có ảnh).",
          "Có phân trang hoặc lazy load.",
        ],
      },
      {
        title: "Cart",
        items: [
          "Hiển thị thông tin line item: `title`, `unit_price`, `image`, `final_price`, `quantity`, `options_with_values`.",
          "Hiển thị `cart.total_price`.",
          "Dùng `cart.taxes_included` để báo giá đã gồm thuế.",
          "Có nút checkout submit form giỏ hàng.",
          "Khách đổi được số lượng từng line item; đổi số lượng thì cập nhật lại toàn bộ line item để tổng tiền luôn đúng.",
          "Có thông báo khi giỏ hàng trống.",
          "Hỗ trợ: ghi chú đơn hàng (cart note), selling plan, mã giảm giá tự động, accelerated checkout (bật mặc định).",
        ],
      },
      {
        title: "Page",
        items: ["Có `page.title` và `page.content`.", "Có template phụ cho trang liên hệ (contact form)."],
      },
      {
        title: "Blog",
        items: [
          "Hiển thị `blog.title`.",
          "Mỗi bài viết: `article.title` (không cắt chữ, link tới `article.url`), `article.image`, `article.excerpt_or_content` (không dùng `article.content`).",
          "Có phân trang hoặc lazy load.",
        ],
      },
      {
        title: "Article",
        items: [
          "Hiển thị `article.title` (không cắt chữ), `article.comments`, `article.published_at` (không dùng `article.created_at`).",
          "Bình luận có phân trang.",
          "Luồng bình luận chạy được cả khi không bật kiểm duyệt, hiển thị đủ thông báo thành công và lỗi.",
        ],
      },
      {
        title: "Search",
        items: [
          "Có thông báo khi không có kết quả.",
          "Trả về nhiều loại kết quả (product, blog, page); dùng `object_type` khi hiển thị.",
          "Có phân trang hoặc lazy load.",
        ],
      },
      {
        title: "404",
        items: ["Thông báo rõ là không tìm thấy trang.", "Có lối đi tiếp, ví dụ ô tìm kiếm hoặc link về trang chủ."],
      },
      {
        title: "Gift card",
        items: ["Hỗ trợ Apple Wallet.", "Hiển thị mã gift card.", "Hiển thị mã QR kích thước tối thiểu 120 × 120px.", "Có logo hoặc `shop.name`."],
      },
      {
        title: "Password",
        items: ["Có logo hoặc `shop.name`, `shop.password_message` và form nhập mật khẩu storefront (`form 'storefront_password'`)."],
      },
    ],
  },
  {
    id: "consistency",
    title: "Nhất quán & chức năng",
    groups: [
      {
        items: [
          "Nội dung từ trình soạn thảo (RTE) — `h1`–`h6`, `blockquote`, `ul`, `ol` — hiển thị đồng nhất ở mọi template, giống nhau giữa bài blog, mô tả sản phẩm và mô tả collection.",
          "Script phải host trên server của Shopify, trừ các thư viện bên thứ ba được phép.",
          "Không dùng JavaScript/code can thiệp hoặc \"độ\" thêm tính năng gốc của Shopify trong theme editor hay admin.",
          "Mọi link trỏ về domain Shopify phải có `rel=\"nofollow\"` (được kèm thuộc tính khác).",
          "Link asset bằng URL không ghi giao thức (protocol-relative, dạng `//...`); không hard-code `http` hay `https`.",
          "Có license hợp lệ cho mọi plugin và hình ảnh của bên thứ ba.",
          "Không có chức năng phụ thuộc vào app.",
          "Không làm tính năng kiểu app cần API mới chạy đầy đủ (wishlist, đặt lịch hẹn, mã giảm giá ở cấp giỏ hàng, Instagram feed…). Làm dở dang cũng không được chấp nhận.",
          "Không đưa thông tin gây hiểu lầm hay tạo cảm giác khan hiếm/gấp gáp giả: đồng hồ đếm ngược giả, số tồn kho giả, số người đang xem giả…",
        ],
      },
    ],
  },
  {
    id: "browsers",
    title: "Tương thích trình duyệt",
    groups: [
      {
        title: "Desktop",
        note: "Layout, duyệt web và mua hàng đều phải chạy được.",
        items: ["Safari: 2 bản mới nhất trên Mac.", "Chrome: 3 bản mới nhất trên Mac và PC.", "Firefox: 3 bản mới nhất trên Mac và PC.", "Edge: 2 bản mới nhất trên PC."],
      },
      {
        title: "Mobile",
        items: [
          "Theme responsive trên mobile.",
          "Mobile Safari: 2 bản mới nhất trên iOS.",
          "Chrome Mobile: 3 bản mới nhất trên Android và iOS.",
          "Samsung Internet: 2 bản mới nhất trên Android.",
        ],
      },
      {
        title: "Webview",
        note: "Duyệt và mua hàng được trong trình duyệt nhúng của app (bản mới nhất, cả Android & iOS).",
        items: ["Instagram.", "Facebook.", "Pinterest."],
      },
    ],
  },
  {
    id: "assets",
    title: "Asset",
    groups: [
      {
        items: [
          "Không dùng Sass: không có file `.scss` hay `.scss.liquid`. Viết CSS thuần (`.css` hoặc `.css.liquid`).",
          "Không minify file `.css` / `.js`, trừ code ES6 và thư viện bên thứ ba. Shopify tự minify CSS và JavaScript ES5 trở xuống.",
        ],
      },
    ],
  },
  {
    id: "seo",
    title: "SEO",
    groups: [
      {
        items: [
          "Có snippet SEO metadata gồm title, meta description và canonical URL.",
          "Có rich snippet sản phẩm của Google (structured data), đã kiểm tra bằng công cụ test structured data của Google.",
          "Không có template `robots.txt.liquid`.",
        ],
      },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility",
    groups: [
      {
        items: [
          "Mọi phần của trang dùng được bằng bàn phím, kể cả menu dropdown.",
          "Phần tử focus được thì có trạng thái focus nhìn thấy rõ.",
          "Mọi ảnh có thuộc tính `alt`. Ảnh sản phẩm dùng `image.alt` hoặc `image_url | image_tag: alt: ...`.",
          "Mỗi input trong form có `id` riêng, `label` có thuộc tính `for` trùng với `id` đó.",
          "HTML hợp lệ (valid).",
          "Độ tương phản màu: tối thiểu **4.5:1** cho chữ nội dung; **3:1** cho chữ lớn hơn 18pt và phần tử không phải chữ (viền, icon).",
          "Thứ tự focus bằng bàn phím khớp với thứ tự DOM (trên xuống dưới, trái sang phải).",
          "Vùng bấm/chạm tối thiểu **24 × 24** CSS px (trừ link nằm trong đoạn văn và các ngoại lệ của WCAG 2.2).",
          "Các heading `h1`–`h6` nhìn khác biệt nhau.",
        ],
      },
    ],
  },
  {
    id: "social",
    title: "Mạng xã hội",
    groups: [
      {
        items: [
          "Có bộ icon mạng xã hội để chủ shop lựa chọn.",
          "Có thẻ Open Graph và Twitter Card.",
          "Placeholder của các ô nhập link mạng xã hội để trống.",
        ],
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    intro: "Đặt tên và sắp xếp setting của section, block, preset sao cho đúng với điều chủ shop mong đợi; tránh lồng nhiều cấp.",
    groups: [
      {
        title: "Cơ bản",
        items: [
          "Setting tuân theo quy tắc văn phong và thuật ngữ bên dưới.",
          "Label và info text của setting đúng ngữ pháp, đúng chính tả.",
          "Giá trị mặc định minh họa được cách dùng setting — không dùng Lorem Ipsum hay nội dung của store demo làm placeholder.",
          "Có setting favicon.",
          "Upload logo hoạt động tốt với cả ảnh ngang lẫn ảnh dọc.",
          "Setting nào cũng có label.",
          "Setting `link_list` ở Header/Footer mặc định là `main-menu` hoặc `footer` (tùy vị trí).",
          "Giá trị mặc định dạng resource (vd. product) phải trỏ tới resource có thật.",
          "Setting `metaobject` / `metaobject_list` chỉ dùng định nghĩa chuẩn (standard) làm `metaobject_type`; không dùng định nghĩa tự tạo hoặc của app.",
          "Có `theme_info` trong `settings_schema.json`.",
          "Mọi thay đổi trong theme editor phải hiện ngay ở khung preview (debug bằng `request.design_mode`).",
        ],
      },
      {
        title: "Văn phong",
        note: "Chữ trong settings viết bằng tiếng Anh, nên các quy tắc này áp dụng cho tiếng Anh.",
        items: [
          "Tên section, preset, category viết kiểu sentence case: chỉ viết hoa chữ đầu và danh từ riêng.",
          "Đặt tên mô tả cho các lựa chọn, không đánh số (trừ màu và bảng màu): `Middle left`, `Top left`, `Top center` thay vì `Position 1, 2, 3`; `Collage`, `Image banner`, `Image with text` thay vì `Image 1, 2, 3`.",
          "Dùng từ dễ hiểu: `Horizontal position` / `Vertical position` thay vì `X position` / `Y position`; `Button label` thay vì `CTA label`.",
          "Dùng tiếng Anh–Mỹ: `canceled`, `catalog`, `center`, `color`, `customize`, `dialog`, `gray`, `organize` (không dùng `cancelled`, `catalogue`, `centre`, `colour`, `customise`, `dialogue`, `grey`, `organise`).",
          "Không dùng dấu `&`.",
          "Dùng câu khẳng định, không dùng câu hỏi: `Use a custom logo` chứ không phải `Use a custom logo?`.",
          "Chỉ nêu chủ thể của section một lần ở tiêu đề — tránh lặp kiểu `Slideshow`, `Slideshow color`, `Slideshow image`.",
          "Dùng câu chủ động; button và hành động bắt đầu bằng động từ.",
          "Ghi thông số theo đúng format: `64 x 64px required`, `3:2 aspect ratio recommended`, `1200 x 300px .jpg recommended`, `32 words max`; định dạng chữ thì ghi `Use basic HTML to format text`.",
        ],
      },
      {
        title: "Thuật ngữ",
        items: ["Dùng đúng thuật ngữ theo bảng bên dưới."],
        terms: [
          ["home page", "homepage"],
          ["top bar", "meta-nav, search bar"],
          ["bottom bar", "below footer, legal"],
          ["slideshow", "slider"],
          ["checkout (khi đặt tên setting)", "check out"],
          ["heading", "title"],
          ["subheading", "sub-heading"],
          ["body text", "main text"],
          ["signup", "sign-up, sign up"],
          ["favicon", "shortcut icon, website icon"],
          ["sidebar", "side bar"],
          ["button label", "button name"],
          ["social media (khi đặt tên section/setting)", "social, social sharing"],
          ["social media icons", "social media buttons"],
          ["navigation (mọi thành phần điều hướng)", "menus, menu"],
          ["main menu (điều hướng chính)", "navigation, menu"],
          ["secondary menu (điều hướng phụ)", "navigation, menu"],
          ["footer menu (menu ở footer)", "navigation, menu"],
          ["cart type (lựa chọn drawer / page / modal)", "Ajax, Ajaxify, Ajax cart"],
          [".png", "PNG, png, .PNG"],
          ["use (lựa chọn có bước tiếp theo, vd. upload file)", "show, enable"],
          ["show (ẩn/hiện một thành phần cơ bản)", "use, enable"],
          ["enable (app, plugin hoặc thay đổi lớn về layout)", "use, show"],
        ],
      },
      {
        title: "Tên section & preset",
        items: [
          "Đặt tên section theo chức năng và đối chiếu bảng thuật ngữ. Gợi ý: Header, Featured products, Featured collections, Slideshow, Image gallery, Logo list, Newsletter, Map, Blog posts, Testimonials, Footer.",
          "Đặt tên preset của section theo loại nội dung, vd. Image and text, Map, Columns, Blog articles.",
          "Placeholder nội dung: ảnh không phải sản phẩm/collection và các ảnh đặt sát nhau → **Image icon**; danh sách logo → **Logo icon**; slideshow, ảnh có chữ đè lên, ảnh full-width → **Lifestyle image**; video → video YouTube mặc định của Shopify.",
        ],
      },
    ],
  },
  {
    id: "fonts",
    title: "Font picker",
    groups: [
      {
        items: [
          "Mọi font đều dùng setting kiểu `font_picker`.",
          "Có font mặc định được load, ví dụ `default: work_sans_n6`.",
          "Font dùng trong giá trị mặc định và preset phải đang có trong thư viện font của Shopify.",
          "CSS load đủ biến thể bold, italic, bold-italic của mỗi font bằng filter `font_modify`.",
          "Không dùng custom font.",
        ],
      },
    ],
  },
  {
    id: "colors",
    title: "Hệ màu",
    groups: [
      {
        items: [
          "Có tối thiểu **4** màu.",
          "Mỗi setting màu nền đi kèm một setting màu chữ (foreground) tương ứng.",
          "Setting màu dùng kiểu `color`.",
        ],
      },
    ],
  },
  {
    id: "images",
    title: "Ảnh responsive",
    groups: [
      {
        items: [
          "Dùng ảnh responsive (ảnh nhỏ như icon thì không cần).",
          "Chỉ load ảnh khi cần, để giảm số ảnh phải tải lúc mở trang.",
        ],
      },
    ],
  },
  {
    id: "naming",
    title: "Đặt tên theme & preset",
    groups: [
      {
        title: "Bắt buộc",
        items: [
          "Không trùng với sản phẩm, sự kiện, nội dung thương hiệu của Shopify (vd. Shopify, Unite, Polaris).",
          "Không chứa tên công ty hay tên tài khoản Shopify Partner của bạn (tên partner đã tự hiện trên trang listing).",
          "Không dùng tên website, nền tảng ecommerce hay lợi ích SEO (vd. Performance, Mobile, Sales).",
          "Không dùng tên ngành hàng hay tên collection của Theme Store (vd. Fashion, Electronics, Jewelry).",
          "Một trong các preset phải mang đúng tên của theme gốc.",
          "Tên dài 1–2 từ, dưới 30 ký tự.",
          "Tên là duy nhất, không trùng theme nào đang có trên Theme Store.",
        ],
      },
      {
        title: "Gợi ý đặt tên",
        recommended: true,
        items: [
          "Tên gợi được mục đích của preset: chủ shop đoán được nên mong đợi gì, ý tưởng chính và nhóm khách hàng hướng tới.",
          "Dùng danh từ, dễ đánh vần, dễ phát âm.",
          "Dùng ổn ở nhiều vùng nói tiếng Anh — tra từ điển thành ngữ để tránh nghĩa lóng.",
          "Tránh tên chạy theo trend, cách viết lạ hoặc tên dài.",
          "Không dùng lại tên theme của nền tảng khác, hay tên theme/preset đã có.",
        ],
      },
      {
        title: "Thêm preset vào file zip",
        items: [
          "Mỗi preset có bộ template riêng (giống store demo của nó), đặt trong `listings/<preset-name>/templates/*.json`; section group riêng của preset (nếu có) đặt trong `listings/<preset-name>/sections/*.json`.",
          "Theme chỉ có một preset thì không cần thư mục `/listings`.",
        ],
      },
      {
        title: "Preset khớp với store demo",
        items: [
          "Vừa cài xong, theme trông và hoạt động đúng như store demo; có nhiều preset thì mỗi preset khớp với store demo của nó.",
          "Setting layout, màu và typography giống store demo.",
          "Dùng lại chữ của demo khi hợp lý; sửa hoặc bỏ phần chữ dễ gây rắc rối cho support. Chữ theo ngành hàng nên có nhưng không bắt buộc.",
        ],
      },
    ],
    note: "Ảnh của store demo **không** được chuyển sang khi cài theme.",
  },
  {
    id: "versions",
    title: "Phiên bản & release notes",
    groups: [
      {
        items: ["Mỗi lần nộp (lần đầu hay bản cập nhật) đều có số phiên bản và release notes nêu các tính năng chính."],
      },
    ],
  },
  {
    id: "demo-stores",
    title: "Store demo",
    intro: "Tạo store demo dạng **client transfer store** trong Dev Dashboard. Dev store thường không chuyển nhượng được (dù có bật feature preview hay không).",
    groups: [
      {
        title: "Bắt buộc",
        items: [
          "Mỗi preset có ít nhất một store demo.",
          "Store demo khớp với ngành hàng chính và quy mô catalog mà preset được gắn tag.",
          "Store cài từ preset trông đúng như những gì store demo thể hiện.",
          "Bật Bogus Gateway hoặc Shopify Payments ở test mode; tắt mọi phương thức checkout khác.",
          "Mọi trang demo dùng nội dung thật: không Lorem Ipsum, không chữ onboarding, không từ ngữ thô tục.",
          "Không sửa `powered_by_link`, và chỗ đó chỉ chứa `powered_by_link`.",
          "Không có link affiliate.",
          "Link về domain Shopify có `rel=\"nofollow\"`.",
          "Không có chữ hay nút nằm trong ảnh (trừ chữ in trên sản phẩm thật, infographic, badge, ảnh Instagram).",
          "Không dùng GIF động ở chỗ dễ bị nhầm là tính năng của theme.",
          "Không cài app. App review sản phẩm miễn phí và app dịch miễn phí được xem xét riêng — nếu demo đa ngôn ngữ thì phải dịch hết nội dung.",
          "Có quyền sử dụng mọi asset demo theo Shopify Partner Agreement; xin phép chủ thương hiệu trước khi dùng tên, ảnh, nội dung của họ. Nguồn ảnh miễn phí bản quyền: Shopify Burst.",
        ],
      },
      {
        title: "Nên có",
        recommended: true,
        items: [
          "Ghi nguồn ảnh sản phẩm trong phần mô tả.",
          "Store demo chạy phiên bản theme mới nhất.",
          "Dùng các tính năng có sẵn của Shopify.",
          "Thể hiện độ linh hoạt: có sản phẩm đang giảm giá, sản phẩm/variant hết hàng, sản phẩm nhiều variant và sản phẩm gift card.",
        ],
      },
    ],
  },
  {
    id: "docs",
    title: "Tài liệu & form liên hệ",
    groups: [
      {
        title: "Bắt buộc",
        items: [
          "Có tài liệu hướng dẫn theme và form liên hệ hỗ trợ công khai, sẵn sàng **trước khi ra mắt**.",
          "Cả hai đều được link từ trang listing của theme trên Theme Store.",
        ],
      },
      {
        title: "Tài liệu cho chủ shop",
        items: [
          "Đúng ngữ pháp, không lỗi chính tả.",
          "Khớp với chữ trong theme settings.",
          "Luôn cập nhật theo thay đổi của Shopify và các bản update theme.",
          "Có phần FAQ và các thông tin liên quan.",
        ],
      },
      {
        title: "Chính sách hỗ trợ",
        recommended: true,
        items: [
          "Nêu rõ chính sách hỗ trợ. Theme Partner bắt buộc sửa bug và trả lời câu hỏi; dịch vụ thêm (custom, tích hợp app, hỗ trợ update) có thể cung cấp nhưng không được tính vào giá theme.",
          "Nếu có hướng dẫn chỉnh code: nói rõ có hỗ trợ hay không, nhắc chủ shop duplicate theme trước khi sửa code, và gợi ý thuê Shopify Partner.",
        ],
      },
      {
        title: "Form liên hệ",
        items: [
          "Form nằm trong tài liệu; nếu là modal thì phải dùng tốt trên mobile và link được từ Theme Store.",
          "Không hỏi thông tin thừa như ngân sách, số điện thoại, loại dự án.",
          "Form nhận việc agency có thể để ở trang riêng, nhưng form link từ Theme Store phải theo đúng hướng dẫn này.",
          "Các trường nên có: họ tên; email; URL store (kèm ví dụ `http://www.storename.myshopify.com`); mô tả vấn đề (textarea); upload file (để gửi ảnh chụp lỗi); tên theme (nếu bạn có nhiều theme); subject (nếu có thì tự điền vào tiêu đề email).",
          "Có auto-reply ngay khi gửi form, để chủ shop biết yêu cầu đã được nhận.",
        ],
      },
    ],
  },
  {
    id: "support",
    title: "Hỗ trợ theme",
    intro: "Yêu cầu hỗ trợ đến từ form liên hệ được link trên Theme Store và trong tài liệu.",
    groups: [
      {
        title: "Bắt buộc",
        items: [
          "Giải đáp câu hỏi của chủ shop liên quan tới theme.",
          "Trả lời yêu cầu hỗ trợ trong vòng **2 ngày làm việc**.",
          "Sửa lỗi kỹ thuật (layout vỡ, link chết, lỗi logic) kịp thời.",
          "Lỗi nghiêm trọng phải sửa ngay, nếu không theme có thể bị gỡ tạm thời khỏi Theme Store.",
        ],
      },
      {
        title: "Trải nghiệm cài đặt",
        items: [
          "File `.json` không chứa resource riêng của admin store demo, như metafield tự tạo hay URL bắt đầu bằng `shopify://`.",
          "Giá trị mặc định dạng resource phải trỏ tới resource có ở **mọi** store (xem thêm các mục về giá trị mặc định ở phần Settings).",
        ],
      },
    ],
    note: "Hỗ trợ chiếm phần lớn công việc của một Theme Partner — theme trả phí trên Theme Store có thể nhận hàng nghìn ticket mỗi tháng.",
  },
];
