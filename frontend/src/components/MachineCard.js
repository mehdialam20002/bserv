import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiShoppingCart, FiTag, FiArrowRight } from "react-icons/fi";

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

const MachineCard = ({ machine }) => {
  const [hovered, setHovered] = useState(false);

  const {
    slug,
    name,
    brand,
    thumbnail,
    price,
    rent_price_monthly,
    rating,
    review_count,
    condition,
    category_name,
    is_available_for_sale,
    is_available_for_rent,
  } = machine;

  const conditionLabel =
    condition && condition.toLowerCase() === "new" ? "New" : "Refurbished";
  const conditionColor = conditionLabel === "New" ? "#16a34a" : "#d97706";

  const filledStars = Math.round(rating || 0);

  return (
    <motion.div
      style={{
        ...styles.card,
        boxShadow: hovered
          ? "0 16px 40px rgba(15, 76, 129, 0.18)"
          : "0 2px 12px rgba(0, 0, 0, 0.08)",
      }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Image Section */}
      <div style={styles.imageWrapper}>
        <motion.img
          src={thumbnail || "/placeholder-machine.png"}
          alt={name}
          style={styles.image}
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Brand Badge */}
        {brand && (
          <span style={styles.brandBadge}>{brand}</span>
        )}

        {/* Condition Badge */}
        <span
          style={{
            ...styles.conditionBadge,
            backgroundColor: conditionColor,
          }}
        >
          {conditionLabel}
        </span>
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        {/* Rating */}
        <div style={styles.ratingRow}>
          <div style={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <FiStar
                key={i}
                size={14}
                color={i <= filledStars ? "#facc15" : "#d1d5db"}
                fill={i <= filledStars ? "#facc15" : "none"}
                style={{ marginRight: 2 }}
              />
            ))}
          </div>
          {review_count != null && (
            <span style={styles.reviewCount}>({review_count})</span>
          )}
        </div>

        {/* Name & Category */}
        <h3 style={styles.name}>{name}</h3>
        {category_name && (
          <span style={styles.category}>{category_name}</span>
        )}

        {/* Prices */}
        <div style={styles.priceSection}>
          {price != null && (
            <div style={styles.priceRow}>
              <FiShoppingCart size={15} color={PRIMARY} />
              <span style={styles.priceLabel}>Buy:</span>
              <span style={styles.priceValue}>{formatPrice(price)}</span>
            </div>
          )}
          {rent_price_monthly != null && (
            <div style={styles.priceRow}>
              <FiTag size={15} color={ACCENT} />
              <span style={styles.priceLabel}>Rent:</span>
              <span style={{ ...styles.priceValue, color: ACCENT }}>
                {formatPrice(rent_price_monthly)}
                <span style={styles.perMonth}>/mo</span>
              </span>
            </div>
          )}
        </div>

        {/* Action Tags */}
        <div style={styles.tagsRow}>
          {is_available_for_sale && (
            <motion.span
              style={styles.buyTag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiShoppingCart size={12} style={{ marginRight: 4 }} />
              Buy
            </motion.span>
          )}
          {is_available_for_rent && (
            <motion.span
              style={styles.rentTag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiTag size={12} style={{ marginRight: 4 }} />
              Rent
            </motion.span>
          )}
        </div>

        {/* View Details Link */}
        <Link to={`/machines/${slug}`} style={styles.detailsLink}>
          <motion.div
            style={styles.detailsInner}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <span>View Details</span>
            <FiArrowRight size={16} style={{ marginLeft: 6 }} />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

const styles = {
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    transition: "box-shadow 0.3s ease",
    maxWidth: 340,
    width: "100%",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 220,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  brandBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(15, 76, 129, 0.88)",
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    backdropFilter: "blur(4px)",
  },
  conditionBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 8,
    letterSpacing: 0.3,
  },
  content: {
    padding: "16px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flexGrow: 1,
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  stars: {
    display: "flex",
    alignItems: "center",
  },
  reviewCount: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: 500,
  },
  name: {
    margin: 0,
    fontSize: 17,
    fontWeight: 700,
    color: "#1f2937",
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  category: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  priceSection: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginTop: 4,
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  priceLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 500,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 700,
    color: PRIMARY,
  },
  perMonth: {
    fontSize: 12,
    fontWeight: 500,
    color: "#9ca3af",
    marginLeft: 2,
  },
  tagsRow: {
    display: "flex",
    gap: 8,
    marginTop: 4,
  },
  buyTag: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: PRIMARY,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 600,
    padding: "5px 14px",
    borderRadius: 20,
    cursor: "pointer",
    userSelect: "none",
  },
  rentTag: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: ACCENT,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 600,
    padding: "5px 14px",
    borderRadius: 20,
    cursor: "pointer",
    userSelect: "none",
  },
  detailsLink: {
    textDecoration: "none",
    marginTop: 8,
    alignSelf: "flex-start",
  },
  detailsInner: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 600,
    color: PRIMARY,
  },
};

export default MachineCard;
