import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { router } from './routes';
import { DialRoot } from 'dialkit';
import 'dialkit/styles.css';
import Loader from './components/Loader';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>
      <RouterProvider router={router} />
      <DialRoot />
    </>
  );
}

export default App;
