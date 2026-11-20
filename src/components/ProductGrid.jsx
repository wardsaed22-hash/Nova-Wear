import ProductCard from './ProductCard';

export default function ProductGrid({ products, columns = 4, priorityCount = 0 }) {
  return (
    <ul role="list" className={`product-grid product-grid--${columns}`}>
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
