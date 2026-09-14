import { RouterProvider } from "react-router-dom";
import AppProviders from "./AppProviders.tsx";
import { router } from "./router.tsx";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
