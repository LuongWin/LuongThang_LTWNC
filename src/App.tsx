import { useState, useEffect } from 'react';
import { Accordion } from './components/Accordion';
import { Tabs } from './components/Tabs/Tabs';
import { ProductsView } from './features/products/ProductsView';
import { CartDrawer } from './features/cart/CartDrawer';
import { CartBadgeButton } from './features/cart/CartBadgeButton';
import {
  Package,
  Layers,
  HelpCircle,
  Code2,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Sprout,
  Sun,
  Moon,
} from 'lucide-react';
import './App.css';

export function App() {
  // State theo dõi panel đang mở ở demo Accordion
  const [activeAccordionId, setActiveAccordionId] = useState<string | null>('panel-1');

  // State quản lý chủ đề: Mặc định là 3. Warm Earth & Nature Minimal
  const [theme, setTheme] = useState<'warm-earth' | 'dark-glow'>('warm-earth');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'warm-earth' ? 'dark-glow' : 'warm-earth'));
  };

  return (
    <div className="app-layout">
      {/* Slide-over Drawer cho Giỏ Hàng Redux Toolkit */}
      <CartDrawer />

      {/* Top Navigation Bar */}
      <header className="app-header">
        <div className="header-container">
          <div className="header-brand">
            {/* Logo Thiên nhiên & Mầm cây tối giản (Warm Earth & Nature Minimal) */}
            <div className="brand-logo nature-logo" title="Warm Earth & Nature Minimal Logo">
              <Sprout className="w-6 h-6 nature-icon" />
            </div>
            <div>
              <h1 className="brand-title">Lập Trình Web Nâng Cao</h1>
              <p className="brand-subtitle">Redux Toolkit Module Giỏ Hàng &bull; Compound Accordion &bull; usePagination&lt;T&gt;</p>
            </div>
          </div>

          <div className="header-actions">
            {/* Nút Giỏ hàng kết nối Redux Store */}
            <CartBadgeButton />

            {/* Nút chuyển đổi Theme linh hoạt */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Đang dùng: ${theme === 'warm-earth' ? 'Warm Earth Minimal 🌿' : 'Deep Dark Glow ⚡'}. Bấm để đổi!`}
            >
              {theme === 'warm-earth' ? (
                <>
                  <Sun className="w-4 h-4 theme-icon-sun" />
                  <span>Warm Earth 🌿</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 theme-icon-moon" />
                  <span>Deep Dark ⚡</span>
                </>
              )}
            </button>

            <div className="header-tags">
              <span className="badge badge-indigo">Redux Toolkit + RTK Query</span>
              <span className="badge badge-emerald">React 19 + TypeScript</span>
              <span className="badge badge-purple">Feature-Based</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <Tabs defaultTab="products">
          <div className="tabs-nav-wrapper">
            <Tabs.List className="main-tabs-list">
              <Tabs.Tab id="products" icon={<Package className="w-4 h-4" />}>
                1. Danh Sách Sản Phẩm &amp; Giỏ Hàng
              </Tabs.Tab>
              <Tabs.Tab id="accordion" icon={<Layers className="w-4 h-4" />}>
                2. Compound Accordion (Single-Open)
              </Tabs.Tab>
              <Tabs.Tab id="architecture" icon={<Code2 className="w-4 h-4" />}>
                3. Phân Tích Kiến Trúc Context API &amp; Redux
              </Tabs.Tab>
            </Tabs.List>
          </div>

          <Tabs.Panels>
            {/* TAB 1: DANH SÁCH SẢN PHẨM & GIỎ HÀNG */}
            <Tabs.Panel id="products">
              <section className="section-card">
                <ProductsView />
              </section>
            </Tabs.Panel>

            {/* TAB 2: ACCORDION COMPOUND COMPONENT */}
            <Tabs.Panel id="accordion">
              <section className="section-card">
                <div className="section-intro">
                  <div className="intro-badge">Yêu cầu 1</div>
                  <h2 className="section-title">
                    Compound Component <code>Accordion</code> Hoàn Chỉnh
                  </h2>
                  <p className="section-desc">
                    Được xây dựng bằng <strong>React Context API</strong> (tương tự kiến trúc <code>Tabs</code>). 
                    Đặc điểm cốt lõi: <strong>Nhiều panel nhưng chỉ mở DUY NHẤT 1 panel tại một thời điểm</strong>. 
                    Khi mở panel mới, panel đang mở sẽ tự động thu gọn lại.
                  </p>
                </div>

                {/* Thanh trạng thái kiểm chứng */}
                <div className="accordion-status-badge">
                  <span>Trạng thái Accordion hiện tại:</span>
                  <strong>
                    {activeAccordionId ? (
                      <span className="status-open">Đang mở: [{activeAccordionId}]</span>
                    ) : (
                      <span className="status-closed">Tất cả panel đang đóng</span>
                    )}
                  </strong>
                </div>

                {/* Demo Accordion */}
                <div className="accordion-demo-area">
                  <Accordion
                    defaultActiveId="panel-1"
                    activeId={activeAccordionId}
                    onChange={(id) => setActiveAccordionId(id)}
                    collapsible={true}
                  >
                    <Accordion.Item id="panel-1">
                      <Accordion.Header>
                        <span className="panel-title-text">
                          <CheckCircle2 className="w-5 h-5 inline mr-2" style={{ color: 'var(--accent-cyan)' }} />
                          1. Compound Component Pattern là gì? Vì sao nên áp dụng?
                        </span>
                      </Accordion.Header>
                      <Accordion.Panel>
                        <div className="faq-content">
                          <p>
                            <strong>Compound Component Pattern</strong> là một mẫu thiết kế nâng cao trong React,
                            cho phép các component con phối hợp chặt chẽ với nhau để tạo thành một thể thống nhất
                            mà người dùng component không cần tự truyền state qua prop drilling.
                          </p>
                          <ul>
                            <li>
                              <strong>Tính linh hoạt cao (Flexibility):</strong> Bạn có thể đảo thứ tự hoặc bổ sung thêm nội dung xen giữa mà không làm gãy logic.
                            </li>
                            <li>
                              <strong>Giao diện lập trình trực quan (Clean API):</strong> Cú pháp giống hệt HTML chuẩn như <code>&lt;select&gt;</code> và <code>&lt;option&gt;</code>.
                            </li>
                            <li>
                              <strong>Chia sẻ trạng thái ngầm qua Context:</strong> Cha giữ state mở/đóng, các con chỉ việc đăng ký và tiêu thụ qua <code>useContext</code>.
                            </li>
                          </ul>
                        </div>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item id="panel-2">
                      <Accordion.Header>
                        <span className="panel-title-text">
                          <HelpCircle className="w-5 h-5 inline mr-2" style={{ color: 'var(--accent-purple)' }} />
                          2. Cơ chế đảm bảo &quot;Chỉ mở 1 panel tại một thời điểm&quot; hoạt động như thế nào?
                        </span>
                      </Accordion.Header>
                      <Accordion.Panel>
                        <div className="faq-content">
                          <p>
                            Thay vì mỗi <code>Accordion.Item</code> tự lưu một <code>useState(false)</code> độc lập 
                            (điều này sẽ khiến nhiều panel có thể cùng mở một lúc), toàn bộ trạng thái mở được tập trung tại 
                            <strong><code>AccordionContext</code></strong> ở Root:
                          </p>
                          <pre className="code-snippet-small">
{`// Root state: Chỉ lưu ID của DUY NHẤT một panel đang mở
const [activeId, setActiveId] = useState<string | null>(defaultActiveId);

const toggleItem = (id: string) => {
  // Nếu bấm vào chính nó -> Thu gọn về null. 
  // Nếu bấm vào panel khác -> Gán ID mới (panel cũ lập tức bị đóng)
  setActiveId(prev => prev === id ? null : id);
};`}
                          </pre>
                          <p>
                            Tại mỗi <code>Accordion.Item</code>, cờ <code>isOpen</code> được tính toán tự động qua biểu thức so sánh:
                            <br />
                            <code>isOpen = (activeId === currentItemId)</code>. Nhờ đó, tính độc quyền (single-expanded) luôn được bảo đảm 100%!
                          </p>
                        </div>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item id="panel-3">
                      <Accordion.Header>
                        <span className="panel-title-text">
                          <BookOpen className="w-5 h-5 inline mr-2" style={{ color: 'var(--accent-cyan)' }} />
                          3. Chính sách bảo hành &amp; đổi trả sản phẩm công nghệ
                        </span>
                      </Accordion.Header>
                      <Accordion.Panel>
                        <div className="faq-content">
                          <p>
                            Tất cả sản phẩm công nghệ chính hãng trên hệ thống đều đi kèm gói dịch vụ bảo hành toàn diện:
                          </p>
                          <div className="policy-grid">
                            <div className="policy-box">
                              <h4>1 Đổi 1 trong 30 ngày</h4>
                              <p>Lỗi từ nhà sản xuất được đổi ngay thiết bị mới nguyên seal.</p>
                            </div>
                            <div className="policy-box">
                              <h4>Bảo hành chính hãng 12-24 tháng</h4>
                              <p>Bảo hành tại tất cả các trung tâm uỷ quyền của Apple, Sony, Dell, Samsung...</p>
                            </div>
                            <div className="policy-box">
                              <h4>Giao hàng hỏa tốc 2H</h4>
                              <p>Miễn phí vận chuyển cho đơn hàng giá trị từ 5.000.000đ trở lên.</p>
                            </div>
                          </div>
                        </div>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item id="panel-4">
                      <Accordion.Header>
                        <span className="panel-title-text">
                          <Code2 className="w-5 h-5 inline mr-2" style={{ color: 'var(--accent-purple)' }} />
                          4. Cấu trúc lồng ghép an toàn với TypeScript &amp; Accessibility (a11y)
                        </span>
                      </Accordion.Header>
                      <Accordion.Panel>
                        <div className="faq-content">
                          <p>
                            Component được trang bị các tiêu chuẩn công nghiệp:
                          </p>
                          <ul>
                            <li>
                              <strong>Context Protection Hook:</strong> Ném lỗi thông báo rõ ràng nếu lập trình viên sử dụng <code>Accordion.Header</code> hoặc <code>Accordion.Panel</code> ngoài phạm vi <code>Accordion</code> hoặc <code>Accordion.Item</code>.
                            </li>
                            <li>
                              <strong>WAI-ARIA Accessibility:</strong> Gắn đầy đủ <code>aria-expanded</code>, <code>aria-controls</code>, <code>role=&quot;region&quot;</code> và <code>aria-labelledby</code> để hỗ trợ bộ đọc màn hình (Screen Readers).
                            </li>
                            <li>
                              <strong>Keyboard Navigation:</strong> Hỗ trợ phím Space / Enter để kích hoạt đóng/mở panel nhanh chóng.
                            </li>
                          </ul>
                        </div>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </section>
            </Tabs.Panel>

            {/* TAB 3: SO SÁNH KIẾN TRÚC TABS VS ACCORDION */}
            <Tabs.Panel id="architecture">
              <section className="section-card">
                <div className="section-intro">
                  <div className="intro-badge">Đối Chiếu Kiến Trúc</div>
                  <h2 className="section-title">
                    So Sánh Context API: Tabs vs Accordion (Single-Open)
                  </h2>
                  <p className="section-desc">
                    Đối chiếu trực quan sự tương đồng và khác biệt cốt lõi giữa hai Compound Components sử dụng Context API.
                  </p>
                </div>

                <div className="comparison-table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>Đặc Điểm Kiến Trúc</th>
                        <th>Tabs (Đã Thực Hành)</th>
                        <th>Accordion (Bài Thực Hành Này)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Root State</strong></td>
                        <td><code>activeTab: string</code></td>
                        <td><code>activeId: string | null</code></td>
                      </tr>
                      <tr>
                        <td><strong>Hành Vi Toggle</strong></td>
                        <td>Chỉ chọn tab mới (luôn có 1 tab active)</td>
                        <td>Chọn panel mới; có thể click lại để đóng hoàn toàn (về <code>null</code>)</td>
                      </tr>
                      <tr>
                        <td><strong>Trigger Component</strong></td>
                        <td><code>Tab</code> nằm trong <code>TabList</code></td>
                        <td><code>Accordion.Header</code> nằm ngay trong từng <code>Accordion.Item</code></td>
                      </tr>
                      <tr>
                        <td><strong>Content Component</strong></td>
                        <td><code>TabPanel</code> hiển thị tách rời với trigger</td>
                        <td><code>Accordion.Panel</code> nằm ngay dưới header của item</td>
                      </tr>
                      <tr>
                        <td><strong>Cấu Trúc Context</strong></td>
                        <td>1 Context chung (TabsContext)</td>
                        <td>2 Context lồng: <code>AccordionContext</code> (Root) + <code>AccordionItemContext</code> (Item)</td>
                      </tr>
                      <tr>
                        <td><strong>Hiệu Ứng Mở/Đóng</strong></td>
                        <td>Fade-in nội dung tab mới</td>
                        <td>Xoay Chevron 180° và trượt mở (Slide Down / Up) mượt mà</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="architecture-diagram-card">
                  <h3>Sơ Đồ Dòng Dữ Liệu Context API trong Accordion</h3>
                  <div className="diagram-flow">
                    <div className="diagram-node node-root">
                      <strong>&lt;Accordion&gt; Root Provider</strong>
                      <span>activeId: &quot;panel-1&quot; | toggleItem(id)</span>
                    </div>
                    <ChevronRight className="diagram-arrow" />
                    <div className="diagram-node node-item">
                      <strong>&lt;Accordion.Item id=&quot;panel-1&quot;&gt;</strong>
                      <span>isOpen = (activeId === &quot;panel-1&quot;)</span>
                    </div>
                    <ChevronRight className="diagram-arrow" />
                    <div className="diagram-branches">
                      <div className="diagram-subnode">
                        <strong>&lt;Accordion.Header&gt;</strong>
                        <span>Click -&gt; toggleItem(&quot;panel-1&quot;)</span>
                      </div>
                      <div className="diagram-subnode">
                        <strong>&lt;Accordion.Panel&gt;</strong>
                        <span>Render nội dung khi isOpen === true</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="architecture-diagram-card" style={{ marginTop: '2rem' }}>
                  <h3>So Sánh Kiến Trúc: createAsyncThunk vs RTK Query (Bài Tập Tuần 3)</h3>
                  <div className="comparison-table-wrapper" style={{ marginTop: '1rem' }}>
                    <table className="comparison-table">
                      <thead>
                        <tr>
                          <th>Tiêu Chí</th>
                          <th>createAsyncThunk (Mặc Định Chuẩn)</th>
                          <th>RTK Query (Điểm Cộng Nâng Cao)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Bản chất</strong></td>
                          <td>Tạo async action thunk truyền thống, dispatch qua Redux store</td>
                          <td>Data fetching &amp; caching layer chuyên biệt, tự động sinh custom hooks</td>
                        </tr>
                        <tr>
                          <td><strong>Quản lý State</strong></td>
                          <td>Lưu trong <code>productsSlice</code> thông qua <code>extraReducers</code> (pending/fulfilled/rejected)</td>
                          <td>Tự động quản lý trong cache slice riêng (<code>productsApi.reducer</code>)</td>
                        </tr>
                        <tr>
                          <td><strong>Caching &amp; Deduplication</strong></td>
                          <td>Lập trình viên tự quản lý (kiểm tra status idle trước khi fetch)</td>
                          <td>Tự động cache theo endpoint &amp; arguments, loại trừ trùng lặp request</td>
                        </tr>
                        <tr>
                          <td><strong>Loading &amp; Error Flag</strong></td>
                          <td>Lưu thủ công trong slice (<code>status === 'loading'</code>, <code>error</code>)</td>
                          <td>Cung cấp sẵn từ Hook: <code>isLoading</code>, <code>isFetching</code>, <code>error</code>, <code>refetch</code></td>
                        </tr>
                        <tr>
                          <td><strong>Tổ chức thư mục</strong></td>
                          <td><code>features/products/productsSlice.ts</code></td>
                          <td><code>features/products/productsApi.ts</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Bài thực hành Lập Trình Web Nâng Cao &bull; Redux Toolkit, RTK Query, Compound Components &amp; React Custom Hooks</p>
      </footer>
    </div>
  );
}

export default App;
