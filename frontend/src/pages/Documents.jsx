import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listDocuments, uploadDocument, deleteDocument } from '../api/documents';
import DropZone from '../components/upload/DropZone';
import AudioRecorder from '../components/upload/AudioRecorder';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [lastUpload, setLastUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const fetchDocuments = () => {
    listDocuments(query).then((res) => setDocuments(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileSelect = (file) => {
    setError(null);
    setPendingFile(file);
  };

  const confirmUpload = async () => {
    if (!pendingFile) return;
    setError(null);
    setUploading(true);
    const data = new FormData();
    data.append('file', pendingFile);

    try {
      const response = await uploadDocument(data, (event) => setProgress(Math.round((event.loaded / event.total) * 100)));
      const newDoc = response.data;
      setLastUpload(newDoc);
      fetchDocuments();
      setPendingFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (id) => {
    await deleteDocument(id);
    fetchDocuments();
  };

  return (
    <div className="page-container">
      <section className="card">
        <div className="section-header">
          <div>
            <h1 className="page-title">Document library</h1>
            <p className="page-subtitle">Upload files, search content, and inspect AI analysis in one place.</p>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={fetchDocuments}
            placeholder="Search documents or summaries"
            className="input"
          />
        </div>
        <DropZone onUpload={handleFileSelect} disabled={uploading} />

        <AudioRecorder onRecordingComplete={handleFileSelect} disabled={uploading} />

        {pendingFile && (
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h2 className="page-title" style={{ fontSize: '1.25rem' }}>Confirm upload</h2>
            <p style={{ margin: '0.5rem 0' }}><strong>File:</strong> {pendingFile.name}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Type:</strong> {pendingFile.type || 'Unknown'}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Size:</strong> {(pendingFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <button type="button" className="button button-primary" onClick={confirmUpload} disabled={uploading}>
                {uploading ? 'Analyzing…' : 'Upload and analyze'}
              </button>
              <button type="button" className="button button-secondary" onClick={() => setPendingFile(null)} disabled={uploading}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {uploading && (
          <div className="small-card" style={{ marginTop: '1rem' }}>
            Uploading {progress}%
            <div className="progress">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        {error && (
          <div className="small-card" style={{ marginTop: '1rem', color: '#f87171' }}>
            {error}
          </div>
        )}
        {lastUpload?.analysis && (
          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2 className="page-title" style={{ fontSize: '1.25rem' }}>Analysis result</h2>
            <p className="page-subtitle">Summary and insights from your uploaded file.</p>
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Summary</strong></p>
              <p>{lastUpload.analysis.summary || 'No summary available.'}</p>
            </div>
            {lastUpload.analysis.keywords?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Keywords</strong></p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {lastUpload.analysis.keywords.map((keyword) => (
                    <span key={keyword} className="badge">{keyword}</span>
                  ))}
                </div>
              </div>
            )}
            {lastUpload.analysis.insights?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Insights</strong></p>
                <ul>
                  {lastUpload.analysis.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}
            {lastUpload.analysis.sentiment && (
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Sentiment</strong> {lastUpload.analysis.sentiment}</p>
              </div>
            )}
          </section>
        )}
      </section>
      <div className="grid grid-2">
        {documents.map((doc) => (
          <article key={doc._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <h2 className="page-title" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{doc.originalName}</h2>
                <p className="page-subtitle">
                  {doc.mimetype} • {(doc.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button type="button" className="button button-danger" onClick={() => handleDelete(doc._id)}>
                Delete
              </button>
            </div>
            <p style={{ marginTop: '1rem', color: '#cbd5e1' }}>
              {doc.analysis?.summary || 'AI analysis pending'}
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link to={`/documents/${doc._id}`} className="button button-secondary">
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Documents;
