import { formatPrice } from '../utils/format';

export default function Price({ price, originalPrice, className = '' }) {
  const onSale = originalPrice && originalPrice > price;
  return (
    <p className={`price ${className}`}>
      {onSale ? (
        <>
          <span className="visually-hidden">Sale price</span>
          <span className="price__now price__now--sale">{formatPrice(price)}</span>
          <span className="visually-hidden">Original price</span>
          <s className="price__old">{formatPrice(originalPrice)}</s>
        </>
      ) : (
        <span className="price__now">{formatPrice(price)}</span>
      )}
    </p>
  );
}
