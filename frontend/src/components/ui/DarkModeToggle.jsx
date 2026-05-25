import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

const DarkModeToggle = () => {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark((current) => !current)}
      className="button button-secondary"
      aria-label="Toggle dark mode"
      style={{ borderRadius: '999px', padding: '0.8rem' }}
    >
      {dark ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
    </button>
  );
};

export default DarkModeToggle;
