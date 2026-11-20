import { useStore } from '../context/StoreContext';
import { HeartIcon } from './Icons';

export default function WishlistButton({ product, variant = 'floating', className = '' }) {
  const { isWishlisted, toggleWishlist } = useStore();
  const active = isWishlisted(product.id);

  if (variant === 'full') {
    return (
      <button
        type="button"
        className={`btn btn--outline wish-full ${className}`}
        aria-pressed={active}
        onClick={() => toggleWishlist(product)}
      >
        <HeartIcon size={18} filled={active} />
        {active ? 'Saved to wishlist' : 'Add to wishlist'}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`wish-btn ${active ? 'is-active' : ''} ${className}`}
      aria-pressed={active}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
    >
      <HeartIcon size={19} filled={active} />
    </button>
  );
}
