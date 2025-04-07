import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Annonces from "./Annonces";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <div>Accueil Content</div>,
      },
      {
        path: "/annonces",
        element: <Annonces />,
      },
      {
        path: "/messagerie",
        element: <div>Messagerie Content</div>,
      },
      {
        path: "/agenda",
        element: <div>Agenda Content</div>,
      },
      {
        path: "/parametres",
        element: <div>Parametres Content</div>,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
