import { useEffect } from 'react';
import { legacyMarkup } from './legacyMarkup';
import { initLegacyApp } from './legacyApp';

function App() {
  useEffect(() => {
    initLegacyApp();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: legacyMarkup }} />;
}

export default App;
