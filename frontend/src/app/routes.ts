import { createBrowserRouter } from "react-router";
import Entry from "./pages/Entry";
import Home from "./pages/Home";
import Signal from "./pages/Signal";
import Coven from "./pages/Coven";
import Ritual from "./pages/Ritual";
import Terminal from "./pages/Terminal";
import Layout from "./components/Layout";
import Dispatches from "./pages/Dispatches";
import DispatchDetail from "./pages/DispatchDetail";

export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { path: "/", Component: Home },
      { path: "/entry", Component: Entry },
      { path: "/signal", Component: Signal },
      { path: "/coven", Component: Coven },
      { path: "/ritual", Component: Ritual },
      { path: "/terminal", Component: Terminal },
      { path: "/dispatches", Component: Dispatches },
      { path: "/dispatches/:slug", Component: DispatchDetail },
    ],
  },
]);
