import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '65vh' }}>
    <div className="card" style={{ maxWidth: '700px', textAlign: 'center' }}>
      <h1 className="page-title">Page not found</h1>
      <p className="page-subtitle" style={{ marginTop: '1rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard" className="button button-primary" style={{ marginTop: '1.5rem' }}>
        Go back home
      </Link>
    </div>
  </div>
);

export default NotFound;
