import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDocument, refreshDocumentAnalysis } from '../api/documents';

const DocumentDetail = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getDocument(id)
      .then((res) => setDoc(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await refreshDocumentAnalysis(id);
      setDoc(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <div className="card-sm">Loading document…</div>;
  }

  if (!doc) {
    return <div className="card-sm">Document not found.</div>;
  }

  return (
    <div className="page-container">
      <section className="card">
        <div className="section-header">
          <div>
            <h1 className="page-title">{doc.originalName}</h1>
            <p className="page-subtitle">Detailed analysis, OCR raw text, and AI insights.</p>
          </div>
          <button type="button" className="button button-primary" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? 'Refreshing…' : 'Refresh analysis'}
          </button>
        </div>
        <div className="grid grid-3" style={{ marginTop: '1.5rem' }}>
          <div className="small-card">
            <p className="page-subtitle">Keywords</p>
            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(doc.analysis?.keywords || []).map((keyword) => (
                <span key={keyword} className="badge">{keyword}</span>
              ))}
            </div>
          </div>
          <div className="small-card">
            <p className="page-subtitle">Entities</p>
            <div style={{ marginTop: '1rem', color: '#cbd5e1', lineHeight: '1.8' }}>
              {(doc.analysis?.entities || []).map((entity) => (
                <p key={entity} style={{ margin: '0.35rem 0' }}>{entity}</p>
              ))}
            </div>
          </div>
          <div className="small-card">
            <p className="page-subtitle">Sentiment</p>
            <p style={{ marginTop: '1rem', fontSize: '2rem', fontWeight: 700 }}> {doc.analysis?.sentiment || 'Unknown'} </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Summary</h2>
        <p className="page-subtitle" style={{ marginTop: '1rem' }}>{doc.analysis?.summary || 'No summary available.'}</p>
      </section>

      <section className="card">
        <h2 className="page-title" style={{ fontSize: '1.5rem' }}>OCR / extracted text</h2>
        <pre style={{ marginTop: '1rem', padding: '1rem', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.95)', color: '#e2e8f0', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
          {doc.text || 'No text extracted from this file.'}
        </pre>
      </section>
    </div>
  );
};

export default DocumentDetail;
