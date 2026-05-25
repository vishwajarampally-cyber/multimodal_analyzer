import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics } from '../api/documents';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <section className="card">
        <div className="section-header">
          <div>
            <h1 className="page-title">Document analytics</h1>
            <p className="page-subtitle">Browse upload trends, sentiment summaries, and recent activity.</p>
          </div>
          <Link to="/documents" className="button button-primary">
            Manage documents
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="loading-block" style={{ minHeight: '8rem' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-3">
            <div className="small-card">
              <p className="page-subtitle">Total uploads</p>
              <p style={{ fontSize: '2.5rem', marginTop: '1rem' }}>{stats.totalUploads}</p>
            </div>
            <div className="small-card">
              <p className="page-subtitle">Document types</p>
              <ul style={{ marginTop: '1rem', color: '#e2e8f0' }}>
                {stats.byType.map((item) => (
                  <li key={item._id}>
                    {item._id}: {item.count}
                  </li>
                ))}
              </ul>
            </div>
            <div className="small-card">
              <p className="page-subtitle">Sentiment</p>
              <ul style={{ marginTop: '1rem', color: '#e2e8f0' }}>
                {stats.sentimentCounts.map((item) => (
                  <li key={item._id}>
                    {item._id || 'Unknown'}: {item.count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-2">
        <section className="card">
          <h2 className="page-title" style={{ fontSize: '1.5rem' }}>
            Recent uploads
          </h2>
          <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="loading-block" style={{ minHeight: '5rem' }} />
                ))
              : stats.recentUploads.map((doc) => (
                  <div key={doc._id} className="small-card">
                    <p style={{ margin: 0, fontWeight: 600 }}>{doc.originalName}</p>
                    <p style={{ marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.95rem' }}>
                      Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
          </div>
        </section>
        <section className="card">
          <h2 className="page-title" style={{ fontSize: '1.5rem' }}>
            Quick actions
          </h2>
          <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
            <Link to="/documents" className="button button-secondary">
              Manage documents and compare AI summaries
            </Link>
            <Link to="/documents" className="button button-secondary">
              Choose a document to chat with
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
