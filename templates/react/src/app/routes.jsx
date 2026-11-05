import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router";

const HomePage = lazy(() => import("@/pages/home/Home"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Fallback route, must be last */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
