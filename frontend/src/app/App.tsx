import { RouterProvider } from 'react-router';
import { router } from './routes';
import { DialRoot } from 'dialkit';
import 'dialkit/styles.css';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <DialRoot />
    </>
  );
}

export default App;
