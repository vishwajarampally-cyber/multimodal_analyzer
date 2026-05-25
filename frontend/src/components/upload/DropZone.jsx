import { useRef, useState } from 'react';

const DropZone = ({ onUpload, disabled }) => {
  const [hover, setHover] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;
    onUpload(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`dropzone${hover ? ' hovered' : ''}`}
    >
      <h2>Drag & drop your file here</h2>
      <p>Any file type is supported: documents, images, audio, video, PDF and more. Or record audio below.</p>
      <button type="button" onClick={() => inputRef.current?.click()} disabled={disabled} className="button button-primary" style={{ marginTop: '1.5rem' }}>
        Choose file
      </button>
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        accept="*/*"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default DropZone;
