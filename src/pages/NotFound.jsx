import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta({ title: 'Page not found' });
  return (
    <div className="container empty-state" style={{ minHeight: '60vh', alignContent: 'center' }}>
      <p className="eyebrow">Error 404</p>
      <h1 className="h1">This page has moved on.</h1>
      <p>The piece or page you were looking for doesn&rsquo;t exist — it may have sold out or the link may be wrong.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        <Link to="/shop" className="btn btn--primary">
          Shop all
        </Link>
        <Link to="/" className="btn btn--outline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
