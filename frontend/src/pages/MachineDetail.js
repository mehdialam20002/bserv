import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiStar,
  FiShoppingCart,
  FiTag,
  FiCheck,
  FiPhone,
  FiMail,
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { getMachine, createInquiry, createOrder, createReview } from "../api";
import MachineCard from "../components/MachineCard";

const PRIMARY = "#0f4c81";
const ACCENT = "#ff6b35";

const formatPrice = (price) => {
  if (price == null) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

/* ───────────── Skeleton loader ───────────── */
const Skeleton = () => (
  <div style={styles.container}>
    <div style={styles.breadcrumb}>
      <div style={{ ...styles.skeletonBlock, width: 200, height: 16 }} />
    </div>
    <div style={styles.heroGrid}>
      <div>
        <div style={{ ...styles.skeletonBlock, width: "100%", height: 420, borderRadius: 16 }} />
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ ...styles.skeletonBlock, width: 80, height: 80, borderRadius: 12 }} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ ...styles.skeletonBlock, width: 100, height: 28 }} />
        <div style={{ ...styles.skeletonBlock, width: "80%", height: 36 }} />
        <div style={{ ...styles.skeletonBlock, width: 160, height: 20 }} />
        <div style={{ ...styles.skeletonBlock, width: "60%", height: 24 }} />
        <div style={{ ...styles.skeletonBlock, width: "100%", height: 120 }} />
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ ...styles.skeletonBlock, width: "50%", height: 52 }} />
          <div style={{ ...styles.skeletonBlock, width: "50%", height: 52 }} />
        </div>
      </div>
    </div>
  </div>
);

/* ───────────── Star Rating Component ───────────── */
const StarRating = ({ rating, size = 18, interactive = false, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <FiStar
        key={i}
        size={size}
        color={i <= rating ? "#facc15" : "#d1d5db"}
        fill={i <= rating ? "#facc15" : "none"}
        style={{ cursor: interactive ? "pointer" : "default" }}
        onClick={() => interactive && onChange && onChange(i)}
      />
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const MachineDetail = () => {
  const { slug } = useParams();

  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image gallery
  const [activeImage, setActiveImage] = useState(0);
  const [imageHover, setImageHover] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState("description");

  // Modal
  const [modal, setModal] = useState({ open: false, type: null }); // type: 'buy' | 'rent'
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    message: "",
    duration: 1,
  });
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  // Inquiry
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiry_type: "info",
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);

  // Review
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Wishlist / share
  const [wishlisted, setWishlisted] = useState(false);

  /* ── Fetch machine ── */
  useEffect(() => {
    const fetchMachine = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getMachine(slug);
        setMachine(data.data || data);
        setActiveImage(0);
      } catch (err) {
        setError(err.response?.data?.message || "Machine not found");
      } finally {
        setLoading(false);
      }
    };
    fetchMachine();
  }, [slug]);

  /* ── Handlers ── */
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);
    try {
      const payload = {
        machine_id: machine.id,
        order_type: modal.type,
        customer_name: orderForm.name,
        customer_email: orderForm.email,
        customer_phone: orderForm.phone,
        customer_company: orderForm.company,
        customer_address: orderForm.address,
        notes: orderForm.message,
      };
      if (modal.type === "rent") {
        payload.rent_duration_months = orderForm.duration;
      }
      await createOrder(payload);
      toast.success(
        modal.type === "buy"
          ? "Purchase order placed successfully!"
          : "Rental order placed successfully!"
      );
      setModal({ open: false, type: null });
      setOrderForm({ name: "", email: "", phone: "", company: "", address: "", message: "", duration: 1 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setOrderSubmitting(false);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    try {
      await createInquiry({
        machine_id: machine.id,
        name: inquiryForm.name,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        message: inquiryForm.message,
        inquiry_type: inquiryForm.inquiry_type,
      });
      toast.success("Inquiry sent successfully!");
      setInquiryForm({ name: "", email: "", phone: "", message: "", inquiry_type: "info" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send inquiry");
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await createReview({
        machine_id: machine.id,
        name: reviewForm.name,
        email: reviewForm.email,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success("Review submitted successfully!");
      setReviewForm({ name: "", email: "", rating: 5, comment: "" });
      // Re-fetch machine to show new review
      const { data } = await getMachine(slug);
      setMachine(data.data || data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: machine.name, url: window.location.href });
      } catch (_) {
        /* user cancelled */
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  /* ── Loading / Error states ── */
  if (loading) return <Skeleton />;

  if (error || !machine) {
    return (
      <div style={styles.container}>
        <motion.div
          style={styles.errorCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 style={{ margin: 0, color: "#dc2626" }}>Machine Not Found</h2>
          <p style={{ color: "#6b7280", margin: "12px 0 24px" }}>
            {error || "The machine you are looking for does not exist or has been removed."}
          </p>
          <Link to="/machines" style={styles.backLink}>
            <FiArrowLeft size={18} /> Back to Machines
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── Derived data ── */
  const images = machine.images && machine.images.length > 0
    ? machine.images
    : [machine.thumbnail || "/placeholder-machine.png"];
  const conditionLabel =
    machine.condition && machine.condition.toLowerCase() === "new" ? "New" : "Refurbished";
  const conditionColor = conditionLabel === "New" ? "#16a34a" : "#d97706";
  const filledStars = Math.round(machine.rating || 0);
  const features = machine.features || [];
  const specifications = machine.specifications || {};
  const reviews = machine.reviews || [];
  const relatedMachines = machine.related_machines || [];
  const tabs = ["description", "features", "specifications"];

  const rentTotal = modal.type === "rent" && machine.rent_price_monthly
    ? machine.rent_price_monthly * orderForm.duration
    : 0;

  /* ═══════════ RENDER ═══════════ */
  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* ─── BREADCRUMB ─── */}
        <nav style={styles.breadcrumb}>
          <Link to="/" style={styles.breadcrumbLink}>Home</Link>
          <span style={styles.breadcrumbSep}>&gt;</span>
          <Link to="/machines" style={styles.breadcrumbLink}>Machines</Link>
          <span style={styles.breadcrumbSep}>&gt;</span>
          <span style={styles.breadcrumbCurrent}>{machine.name}</span>
        </nav>

        {/* ─── PRODUCT HERO ─── */}
        <motion.section
          style={styles.heroGrid}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left: Images */}
          <div>
            <div
              style={styles.mainImageWrap}
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              <motion.img
                key={activeImage}
                src={images[activeImage]}
                alt={machine.name}
                style={styles.mainImage}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  scale: imageHover ? 1.08 : 1,
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
            {images.length > 1 && (
              <div style={styles.thumbRow}>
                {images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    style={{
                      ...styles.thumbWrap,
                      border: idx === activeImage ? `3px solid ${PRIMARY}` : "3px solid transparent",
                    }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img} alt={`${machine.name} ${idx + 1}`} style={styles.thumbImg} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div style={styles.heroRight}>
            {/* Brand */}
            {machine.brand && (
              <span style={styles.heroBrandBadge}>{machine.brand}</span>
            )}

            {/* Name */}
            <h1 style={styles.heroName}>{machine.name}</h1>

            {/* Rating */}
            <div style={styles.heroRatingRow}>
              <StarRating rating={filledStars} />
              <span style={styles.heroReviewCount}>
                {machine.rating ? Number(machine.rating).toFixed(1) : "0"} ({machine.reviewCount || machine.review_count || 0} reviews)
              </span>
            </div>

            {/* Condition */}
            <span style={{ ...styles.heroConditionBadge, backgroundColor: conditionColor }}>
              {conditionLabel}
            </span>

            {/* Prices */}
            <div style={styles.priceSection}>
              {machine.price != null && (
                <div style={styles.priceBlock}>
                  <span style={styles.priceLabelSmall}>Buy Price</span>
                  <span style={styles.priceMain}>{formatPrice(machine.price)}</span>
                </div>
              )}
              {machine.rent_price_monthly != null && (
                <div style={styles.priceBlock}>
                  <span style={styles.priceLabelSmall}>Rent Price</span>
                  <span style={styles.priceRent}>
                    {formatPrice(machine.rent_price_monthly)}
                    <span style={styles.pricePerMonth}>/month</span>
                  </span>
                </div>
              )}
            </div>

            {/* Availability */}
            <div style={styles.availRow}>
              {machine.is_available_for_sale && (
                <span style={styles.availBadge}>
                  <span style={styles.greenDot} />
                  Available for Sale
                </span>
              )}
              {machine.is_available_for_rent && (
                <span style={styles.availBadge}>
                  <span style={styles.greenDot} />
                  Available for Rent
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div style={styles.actionRow}>
              {machine.is_available_for_sale && (
                <motion.button
                  style={styles.buyBtn}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setModal({ open: true, type: "buy" })}
                >
                  <FiShoppingCart size={18} style={{ marginRight: 8 }} />
                  Buy Now
                </motion.button>
              )}
              {machine.is_available_for_rent && (
                <motion.button
                  style={styles.rentBtn}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setModal({ open: true, type: "rent" })}
                >
                  <FiTag size={18} style={{ marginRight: 8 }} />
                  Rent This Machine
                </motion.button>
              )}
            </div>

            {/* Utility row */}
            <div style={styles.utilRow}>
              <motion.button
                style={styles.utilBtn}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setWishlisted(!wishlisted);
                  toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
                }}
              >
                <FiHeart
                  size={18}
                  color={wishlisted ? "#ef4444" : "#6b7280"}
                  fill={wishlisted ? "#ef4444" : "none"}
                />
              </motion.button>
              <motion.button
                style={styles.utilBtn}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleShare}
              >
                <FiShare2 size={18} color="#6b7280" />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* ─── TABS SECTION ─── */}
        <section style={styles.tabSection}>
          <div style={styles.tabBar}>
            {tabs.map((tab) => (
              <button
                key={tab}
                style={{
                  ...styles.tabBtn,
                  color: activeTab === tab ? PRIMARY : "#6b7280",
                  borderBottomColor: activeTab === tab ? PRIMARY : "transparent",
                  fontWeight: activeTab === tab ? 700 : 500,
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              style={styles.tabContent}
            >
              {activeTab === "description" && (
                <p style={styles.descriptionText}>
                  {machine.description || "No description available for this machine."}
                </p>
              )}

              {activeTab === "features" && (
                <div style={styles.featuresGrid}>
                  {features.length > 0 ? (
                    features.map((f, idx) => (
                      <div key={idx} style={styles.featureItem}>
                        <FiCheck size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={styles.featureText}>{f}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#9ca3af" }}>No features listed.</p>
                  )}
                </div>
              )}

              {activeTab === "specifications" && (
                <div style={styles.specsTable}>
                  {Object.keys(specifications).length > 0 ? (
                    Object.entries(specifications).map(([key, value], idx) => (
                      <div
                        key={key}
                        style={{
                          ...styles.specRow,
                          backgroundColor: idx % 2 === 0 ? "#f9fafb" : "#ffffff",
                        }}
                      >
                        <span style={styles.specKey}>{key}</span>
                        <span style={styles.specValue}>{String(value)}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#9ca3af", padding: 20 }}>No specifications available.</p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ─── QUICK INQUIRY ─── */}
        <motion.section
          style={styles.inquirySection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.inquiryCard}>
            <div style={styles.inquiryHeader}>
              <h2 style={styles.inquiryTitle}>Have Questions?</h2>
              <p style={styles.inquirySubtitle}>
                Send us an inquiry and we will get back to you shortly.
              </p>
            </div>
            <form onSubmit={handleInquirySubmit} style={styles.inquiryForm}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <FiMail size={14} style={{ marginRight: 4 }} /> Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <FiPhone size={14} style={{ marginRight: 4 }} /> Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Your phone"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Inquiry Type</label>
                  <select
                    value={inquiryForm.inquiry_type}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, inquiry_type: e.target.value })}
                    style={styles.input}
                  >
                    <option value="info">General Info</option>
                    <option value="buy">Interested in Buying</option>
                    <option value="rent">Interested in Renting</option>
                  </select>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Your question or message..."
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  style={{ ...styles.input, resize: "vertical" }}
                />
              </div>
              <motion.button
                type="submit"
                style={styles.inquirySubmitBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={inquirySubmitting}
              >
                {inquirySubmitting ? "Sending..." : "Send Inquiry"}
              </motion.button>
            </form>
          </div>
        </motion.section>

        {/* ─── REVIEWS SECTION ─── */}
        <section style={styles.reviewsSection}>
          <h2 style={styles.sectionTitle}>Customer Reviews</h2>

          {reviews.length > 0 ? (
            <div style={styles.reviewsList}>
              {reviews.map((rev, idx) => (
                <motion.div
                  key={rev._id || idx}
                  style={styles.reviewCard}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewAvatar}>
                      {(rev.reviewer_name || rev.name || "A").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span style={styles.reviewerName}>
                        {rev.reviewer_name || rev.name || "Anonymous"}
                      </span>
                      <StarRating rating={rev.rating || 0} size={14} />
                    </div>
                    {rev.created_at && (
                      <span style={styles.reviewDate}>
                        {new Date(rev.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <p style={styles.reviewComment}>{rev.comment || rev.text}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#9ca3af", marginBottom: 24 }}>No reviews yet. Be the first to review!</p>
          )}

          {/* Write a review */}
          <div style={styles.writeReviewCard}>
            <h3 style={styles.writeReviewTitle}>Write a Review</h3>
            <form onSubmit={handleReviewSubmit} style={styles.reviewFormInner}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={reviewForm.email}
                    onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Rating *</label>
                <StarRating
                  rating={reviewForm.rating}
                  size={28}
                  interactive
                  onChange={(val) => setReviewForm({ ...reviewForm, rating: val })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Comment *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  style={{ ...styles.input, resize: "vertical" }}
                />
              </div>
              <motion.button
                type="submit"
                style={styles.reviewSubmitBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </motion.button>
            </form>
          </div>
        </section>

        {/* ─── RELATED MACHINES ─── */}
        {relatedMachines.length > 0 && (
          <section style={styles.relatedSection}>
            <h2 style={styles.sectionTitle}>Related Machines</h2>
            <div style={styles.relatedGrid}>
              {relatedMachines.map((m) => (
                <MachineCard key={m._id || m.id || m.slug} machine={m} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ═══════════ ORDER / INQUIRY MODAL ═══════════ */}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal({ open: false, type: null })}
          >
            <motion.div
              style={styles.modalContent}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                style={styles.modalClose}
                onClick={() => setModal({ open: false, type: null })}
              >
                <FiX size={22} />
              </button>

              <h2 style={styles.modalTitle}>
                {modal.type === "buy" ? "Buy This Machine" : "Rent This Machine"}
              </h2>
              <p style={styles.modalSubtitle}>{machine.name}</p>

              {/* Order type badge */}
              <span
                style={{
                  ...styles.orderTypeBadge,
                  backgroundColor: modal.type === "buy" ? ACCENT : PRIMARY,
                }}
              >
                {modal.type === "buy" ? "Purchase" : "Rental"}
              </span>

              <form onSubmit={handleOrderSubmit} style={styles.modalForm}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={orderForm.email}
                      onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Your phone"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Company</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={orderForm.company}
                      onChange={(e) => setOrderForm({ ...orderForm, company: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Delivery / billing address"
                    value={orderForm.address}
                    onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                    style={{ ...styles.input, resize: "vertical" }}
                  />
                </div>

                {/* Rent duration */}
                {modal.type === "rent" && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Rental Duration</label>
                    <div style={styles.durationRow}>
                      {[1, 3, 6, 12].map((m) => (
                        <motion.button
                          key={m}
                          type="button"
                          style={{
                            ...styles.durationBtn,
                            backgroundColor: orderForm.duration === m ? PRIMARY : "#f3f4f6",
                            color: orderForm.duration === m ? "#ffffff" : "#374151",
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setOrderForm({ ...orderForm, duration: m })}
                        >
                          {m} {m === 1 ? "Month" : "Months"}
                        </motion.button>
                      ))}
                    </div>
                    {machine.rent_price_monthly != null && (
                      <div style={styles.rentTotalRow}>
                        <span style={styles.rentTotalLabel}>Estimated Total:</span>
                        <span style={styles.rentTotalValue}>{formatPrice(rentTotal)}</span>
                      </div>
                    )}
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Message</label>
                  <textarea
                    rows={3}
                    placeholder="Any additional details..."
                    value={orderForm.message}
                    onChange={(e) => setOrderForm({ ...orderForm, message: e.target.value })}
                    style={{ ...styles.input, resize: "vertical" }}
                  />
                </div>

                {/* Price summary */}
                <div style={styles.modalPriceSummary}>
                  <span style={styles.modalPriceLabel}>
                    {modal.type === "buy" ? "Total Price:" : `Rental (${orderForm.duration} mo):`}
                  </span>
                  <span style={styles.modalPriceValue}>
                    {modal.type === "buy"
                      ? formatPrice(machine.price)
                      : formatPrice(rentTotal)}
                  </span>
                </div>

                <motion.button
                  type="submit"
                  style={{
                    ...styles.modalSubmitBtn,
                    backgroundColor: modal.type === "buy" ? ACCENT : PRIMARY,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={orderSubmitting}
                >
                  {orderSubmitting
                    ? "Processing..."
                    : modal.type === "buy"
                    ? "Confirm Purchase"
                    : "Confirm Rental"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px 20px 60px",
  },

  /* Skeleton */
  skeletonBlock: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    animation: "pulse 1.5s ease-in-out infinite",
  },

  /* Error */
  errorCard: {
    textAlign: "center",
    padding: "80px 24px",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginTop: 40,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: PRIMARY,
    fontSize: 15,
    fontWeight: 600,
    textDecoration: "none",
  },

  /* Breadcrumb */
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 28,
    fontSize: 14,
    flexWrap: "wrap",
  },
  breadcrumbLink: {
    color: PRIMARY,
    textDecoration: "none",
    fontWeight: 500,
  },
  breadcrumbSep: {
    color: "#9ca3af",
  },
  breadcrumbCurrent: {
    color: "#6b7280",
    fontWeight: 500,
  },

  /* Hero Grid */
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 48,
    marginBottom: 48,
  },

  /* Main Image */
  mainImageWrap: {
    width: "100%",
    height: 420,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    cursor: "zoom-in",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transformOrigin: "center center",
  },
  thumbRow: {
    display: "flex",
    gap: 12,
    marginTop: 16,
    flexWrap: "wrap",
  },
  thumbWrap: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    cursor: "pointer",
    backgroundColor: "#f3f4f6",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  /* Hero Right */
  heroRight: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  heroBrandBadge: {
    alignSelf: "flex-start",
    backgroundColor: `${PRIMARY}14`,
    color: PRIMARY,
    fontSize: 12,
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: 8,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  heroName: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: "#111827",
    lineHeight: 1.2,
  },
  heroRatingRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  heroReviewCount: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: 500,
  },
  heroConditionBadge: {
    alignSelf: "flex-start",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 700,
    padding: "5px 14px",
    borderRadius: 8,
  },

  /* Price */
  priceSection: {
    display: "flex",
    gap: 32,
    marginTop: 8,
    padding: "16px 0",
    borderTop: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
  },
  priceBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  priceLabelSmall: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  priceMain: {
    fontSize: 28,
    fontWeight: 800,
    color: PRIMARY,
  },
  priceRent: {
    fontSize: 22,
    fontWeight: 700,
    color: ACCENT,
  },
  pricePerMonth: {
    fontSize: 13,
    fontWeight: 500,
    color: "#9ca3af",
    marginLeft: 4,
  },

  /* Availability */
  availRow: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  availBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    backgroundColor: "#f0fdf4",
    padding: "8px 16px",
    borderRadius: 10,
    border: "1px solid #bbf7d0",
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#16a34a",
    display: "inline-block",
  },

  /* Action Buttons */
  actionRow: {
    display: "flex",
    gap: 16,
    marginTop: 8,
  },
  buyBtn: {
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 24px",
    backgroundColor: ACCENT,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    letterSpacing: 0.3,
  },
  rentBtn: {
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 24px",
    backgroundColor: PRIMARY,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    letterSpacing: 0.3,
  },
  utilRow: {
    display: "flex",
    gap: 12,
  },
  utilBtn: {
    width: 44,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },

  /* Tabs */
  tabSection: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflow: "hidden",
    marginBottom: 48,
  },
  tabBar: {
    display: "flex",
    borderBottom: "2px solid #e5e7eb",
  },
  tabBtn: {
    flex: 1,
    padding: "16px 24px",
    fontSize: 15,
    border: "none",
    borderBottom: "3px solid transparent",
    backgroundColor: "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: -2,
  },
  tabContent: {
    padding: "28px 32px",
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 1.8,
    color: "#374151",
    margin: 0,
    whiteSpace: "pre-wrap",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 1.5,
  },
  specsTable: {
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  specRow: {
    display: "flex",
    padding: "14px 20px",
  },
  specKey: {
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    textTransform: "capitalize",
  },
  specValue: {
    flex: 1,
    fontSize: 14,
    color: "#6b7280",
  },

  /* Inquiry */
  inquirySection: {
    marginBottom: 48,
  },
  inquiryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    padding: "36px 40px",
  },
  inquiryHeader: {
    marginBottom: 24,
  },
  inquiryTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
  },
  inquirySubtitle: {
    margin: "6px 0 0",
    fontSize: 14,
    color: "#6b7280",
  },
  inquiryForm: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  inquirySubmitBtn: {
    alignSelf: "flex-start",
    padding: "12px 32px",
    backgroundColor: PRIMARY,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  },

  /* Reviews */
  reviewsSection: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 24,
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginBottom: 32,
  },
  reviewCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: "20px 24px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
  },
  reviewHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: `${PRIMARY}18`,
    color: PRIMARY,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 700,
  },
  reviewerName: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: 2,
  },
  reviewDate: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#9ca3af",
  },
  reviewComment: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.7,
    color: "#4b5563",
  },
  writeReviewCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: "28px 32px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
  },
  writeReviewTitle: {
    margin: "0 0 20px",
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
  },
  reviewFormInner: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  reviewSubmitBtn: {
    alignSelf: "flex-start",
    padding: "12px 32px",
    backgroundColor: ACCENT,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  },

  /* Related */
  relatedSection: {
    marginBottom: 24,
  },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 24,
  },

  /* Form shared */
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    display: "flex",
    alignItems: "center",
  },
  input: {
    padding: "10px 14px",
    fontSize: 14,
    border: "1.5px solid #d1d5db",
    borderRadius: 10,
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#ffffff",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  },

  /* Modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
    overflowY: "auto",
  },
  modalContent: {
    position: "relative",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: "36px 40px 32px",
    maxWidth: 580,
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
  },
  modalClose: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: "50%",
    backgroundColor: "#f3f4f6",
    cursor: "pointer",
    color: "#374151",
  },
  modalTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: "#111827",
  },
  modalSubtitle: {
    margin: "4px 0 12px",
    fontSize: 14,
    color: "#6b7280",
  },
  orderTypeBadge: {
    display: "inline-block",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 700,
    padding: "5px 14px",
    borderRadius: 8,
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  durationRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 4,
  },
  durationBtn: {
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 600,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  rentTotalRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    padding: "10px 16px",
    backgroundColor: "#f0f9ff",
    borderRadius: 10,
  },
  rentTotalLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
  },
  rentTotalValue: {
    fontSize: 20,
    fontWeight: 800,
    color: PRIMARY,
  },
  modalPriceSummary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
  },
  modalPriceLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
  },
  modalPriceValue: {
    fontSize: 22,
    fontWeight: 800,
    color: PRIMARY,
  },
  modalSubmitBtn: {
    width: "100%",
    padding: "14px 24px",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 700,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    letterSpacing: 0.3,
  },
};

export default MachineDetail;
