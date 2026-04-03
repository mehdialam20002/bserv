import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { getMachines, getCategories, getBrands } from "../api";
import MachineCard from "../components/MachineCard";

const PRIMARY = "#0f4c81";
const ACCENT = "#ff6b35";

const ITEMS_PER_PAGE = 12;

const CONDITIONS = ["All", "New", "Refurbished"];
const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "name", label: "Name" },
];

const defaultFilters = {
  search: "",
  category: "",
  brand: "",
  condition: "All",
  sort: "latest",
  min_price: "",
  max_price: "",
  page: 1,
};

/* ─── Inline Styles ─── */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fa",
  },

  /* Header / Banner */
  banner: {
    background: "linear-gradient(135deg, #0a3458 0%, #1a6db5 100%)",
    padding: "48px 0 40px",
    color: "#fff",
  },
  bannerInner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 24px",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
    opacity: 0.85,
    marginBottom: 8,
  },
  breadcrumbLink: {
    color: "#fff",
    textDecoration: "none",
    opacity: 0.8,
    transition: "opacity .2s",
  },
  bannerTitle: {
    fontSize: 36,
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.5px",
  },

  /* Filters Bar */
  filtersWrapper: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "24px 24px 0",
  },
  filtersBar: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    padding: "20px 24px",
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "flex-end",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: "1 1 200px",
    minWidth: 160,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  searchWrapper: {
    position: "relative",
    flex: "1 1 280px",
    minWidth: 200,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#999",
    fontSize: 18,
  },
  searchInput: {
    width: "100%",
    padding: "10px 14px 10px 38px",
    border: "1.5px solid #dde1e7",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    transition: "border-color .2s",
    boxSizing: "border-box",
    background: "#fafbfc",
  },
  select: {
    padding: "10px 32px 10px 12px",
    border: "1.5px solid #dde1e7",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    appearance: "none",
    background: `#fafbfc url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 12px center`,
    cursor: "pointer",
    transition: "border-color .2s",
    boxSizing: "border-box",
    width: "100%",
  },
  priceGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: "1 1 200px",
    minWidth: 160,
  },
  priceInputs: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  priceInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #dde1e7",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    background: "#fafbfc",
    boxSizing: "border-box",
  },
  priceSeparator: {
    color: "#aaa",
    fontSize: 14,
    flexShrink: 0,
  },
  clearBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    border: "none",
    borderRadius: 8,
    background: "#fee2e2",
    color: "#dc2626",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background .2s",
    whiteSpace: "nowrap",
    alignSelf: "flex-end",
  },

  /* Results Top Bar */
  resultsBar: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "20px 24px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultsCount: {
    fontSize: 15,
    color: "#555",
    fontWeight: 500,
  },
  resultsCountBold: {
    fontWeight: 700,
    color: PRIMARY,
  },
  viewToggle: {
    display: "flex",
    gap: 4,
  },
  viewBtn: (active) => ({
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    border: "1.5px solid",
    borderColor: active ? PRIMARY : "#dde1e7",
    background: active ? PRIMARY : "#fff",
    color: active ? "#fff" : "#999",
    cursor: "pointer",
    fontSize: 18,
    transition: "all .2s",
  }),

  /* Grid */
  gridWrapper: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "20px 24px 40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 24,
  },

  /* Skeleton */
  skeleton: {
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  skeletonImage: {
    width: "100%",
    height: 200,
    background: "linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  skeletonBody: {
    padding: 16,
  },
  skeletonLine: (width) => ({
    height: 14,
    borderRadius: 7,
    background: "linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    width: width || "100%",
    marginBottom: 10,
  }),

  /* Empty State */
  emptyState: {
    textAlign: "center",
    padding: "80px 24px",
    gridColumn: "1 / -1",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    color: "#ccc",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#333",
    margin: "0 0 8px",
  },
  emptyText: {
    fontSize: 15,
    color: "#888",
    margin: 0,
  },

  /* Pagination */
  pagination: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 24px 60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  pageBtn: (active) => ({
    minWidth: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    border: active ? "none" : "1.5px solid #dde1e7",
    background: active ? ACCENT : "#fff",
    color: active ? "#fff" : "#555",
    fontSize: 14,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    transition: "all .2s",
  }),
  pageNavBtn: (disabled) => ({
    minWidth: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    border: "1.5px solid #dde1e7",
    background: "#fff",
    color: disabled ? "#ccc" : "#555",
    fontSize: 14,
    fontWeight: 600,
    cursor: disabled ? "default" : "pointer",
    transition: "all .2s",
    pointerEvents: disabled ? "none" : "auto",
  }),
};

/* Responsive overrides via media query style tag */
const ResponsiveStyles = () => (
  <style>{`
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @media (max-width: 1024px) {
      .machines-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 640px) {
      .machines-grid { grid-template-columns: 1fr !important; }
      .machines-filters-bar { padding: 16px !important; gap: 12px !important; }
      .machines-banner-title { font-size: 28px !important; }
    }
  `}</style>
);

/* ─── Skeleton Card ─── */

const SkeletonCard = () => (
  <div style={styles.skeleton}>
    <div style={styles.skeletonImage} />
    <div style={styles.skeletonBody}>
      <div style={styles.skeletonLine("60%")} />
      <div style={styles.skeletonLine("90%")} />
      <div style={styles.skeletonLine("45%")} />
    </div>
  </div>
);

/* ─── Main Component ─── */

const Machines = () => {
  const [searchParams] = useSearchParams();

  const [machines, setMachines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    category: searchParams.get("category") || "",
  }));

  const searchTimerRef = useRef(null);

  /* Fetch categories & brands on mount */
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(catRes.data?.data || catRes.data || []);
        setBrands(brandRes.data?.data || brandRes.data || []);
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };
    fetchMeta();
  }, []);

  /* Fetch machines whenever filters change */
  useEffect(() => {
    const fetchMachines = async () => {
      setLoading(true);
      try {
        const params = {
          page: filters.page,
          limit: ITEMS_PER_PAGE,
        };
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.brand) params.brand = filters.brand;
        if (filters.condition !== "All")
          params.condition = filters.condition;
        if (filters.sort) params.sort = filters.sort;
        if (filters.min_price) params.min_price = filters.min_price;
        if (filters.max_price) params.max_price = filters.max_price;

        const res = await getMachines(params);
        const data = res.data;
        setMachines(data.data || data.machines || data || []);
        setTotalCount(data.pagination?.total || data.total || (data.data || data).length || 0);
        setTotalPages(data.pagination?.totalPages || data.totalPages || Math.ceil((data.pagination?.total || 0) / ITEMS_PER_PAGE) || 1);
      } catch (err) {
        console.error("Failed to fetch machines", err);
        setMachines([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, [filters]);

  /* Debounced search handler */
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    }, 300);
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ ...defaultFilters });
  }, []);

  const goToPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.brand ||
    filters.condition !== "All" ||
    filters.min_price ||
    filters.max_price ||
    filters.sort !== "latest";

  /* Build pagination numbers */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, filters.page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div style={styles.page}>
      <ResponsiveStyles />

      {/* ──── Banner ──── */}
      <div style={styles.banner}>
        <div style={styles.bannerInner}>
          <div style={styles.breadcrumb}>
            <Link to="/" style={styles.breadcrumbLink}>
              Home
            </Link>
            <span>&rsaquo;</span>
            <span>Machines</span>
          </div>
          <h1 style={styles.bannerTitle} className="machines-banner-title">
            Our Machines
          </h1>
        </div>
      </div>

      {/* ──── Filters Bar ──── */}
      <div style={styles.filtersWrapper}>
        <div
          style={styles.filtersBar}
          className="machines-filters-bar"
        >
          {/* Search */}
          <div style={styles.searchWrapper}>
            <FiSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search machines..."
              defaultValue={filters.search}
              onChange={handleSearchChange}
              style={styles.searchInput}
              onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
              onBlur={(e) => (e.target.style.borderColor = "#dde1e7")}
            />
          </div>

          {/* Category */}
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Category</span>
            <select
              value={filters.category}
              onChange={(e) => updateFilter("category", e.target.value)}
              style={styles.select}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.slug || cat.name} value={cat.slug || cat._id || cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Brand</span>
            <select
              value={filters.brand}
              onChange={(e) => updateFilter("brand", e.target.value)}
              style={styles.select}
            >
              <option value="">All Brands</option>
              {brands.map((b) => {
                const val = typeof b === "string" ? b : b.slug || b._id || b.name;
                const label = typeof b === "string" ? b : b.name;
                return (
                  <option key={val} value={val}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Condition */}
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Condition</span>
            <select
              value={filters.condition}
              onChange={(e) => updateFilter("condition", e.target.value)}
              style={styles.select}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Sort By</span>
            <select
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              style={styles.select}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div style={styles.priceGroup}>
            <span style={styles.filterLabel}>Price Range</span>
            <div style={styles.priceInputs}>
              <input
                type="number"
                placeholder="Min"
                value={filters.min_price}
                onChange={(e) => updateFilter("min_price", e.target.value)}
                style={styles.priceInput}
                min="0"
              />
              <span style={styles.priceSeparator}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.max_price}
                onChange={(e) => updateFilter("max_price", e.target.value)}
                style={styles.priceInput}
                min="0"
              />
            </div>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              style={styles.clearBtn}
              onClick={clearFilters}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fecaca")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fee2e2")}
            >
              <FiX size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ──── Results Top Bar ──── */}
      <div style={styles.resultsBar}>
        <p style={styles.resultsCount}>
          Showing{" "}
          <span style={styles.resultsCountBold}>
            {loading ? "..." : totalCount}
          </span>{" "}
          machines
        </p>
        <div style={styles.viewToggle}>
          <button
            style={styles.viewBtn(viewMode === "grid")}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <FiGrid />
          </button>
          <button
            style={styles.viewBtn(viewMode === "list")}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <FiList />
          </button>
        </div>
      </div>

      {/* ──── Machine Grid ──── */}
      <div style={styles.gridWrapper}>
        <div style={styles.grid} className="machines-grid">
          <AnimatePresence mode="wait">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`skel-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <SkeletonCard />
                </motion.div>
              ))
            ) : machines.length > 0 ? (
              machines.map((machine, i) => (
                <motion.div
                  key={machine._id || machine.slug || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  layout
                >
                  <MachineCard machine={machine} />
                </motion.div>
              ))
            ) : (
              <motion.div
                style={styles.emptyState}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div style={styles.emptyIcon}>
                  <FiFilter size={64} />
                </div>
                <h3 style={styles.emptyTitle}>No machines found</h3>
                <p style={styles.emptyText}>
                  Try adjusting your filters or search terms to find what you're
                  looking for.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ──── Pagination ──── */}
      {!loading && totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.pageNavBtn(filters.page <= 1)}
            onClick={() => goToPage(filters.page - 1)}
            disabled={filters.page <= 1}
          >
            Prev
          </button>

          {getPageNumbers()[0] > 1 && (
            <>
              <button
                style={styles.pageBtn(filters.page === 1)}
                onClick={() => goToPage(1)}
              >
                1
              </button>
              {getPageNumbers()[0] > 2 && (
                <span style={{ color: "#999", padding: "0 4px" }}>&hellip;</span>
              )}
            </>
          )}

          {getPageNumbers().map((num) => (
            <button
              key={num}
              style={styles.pageBtn(filters.page === num)}
              onClick={() => goToPage(num)}
            >
              {num}
            </button>
          ))}

          {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                <span style={{ color: "#999", padding: "0 4px" }}>&hellip;</span>
              )}
              <button
                style={styles.pageBtn(filters.page === totalPages)}
                onClick={() => goToPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            style={styles.pageNavBtn(filters.page >= totalPages)}
            onClick={() => goToPage(filters.page + 1)}
            disabled={filters.page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Machines;
