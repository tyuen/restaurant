import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ErrorBoundary from "./components/ErrorBoundary";
import LazyLoading from "./components/LazyLoading";

import Layout from "./components/layouts/main";

//routes
import Home from "./pages/Home";
import NotFound from "./pages/404";

//lazy loaded routes
const Login = lazySuspense(() => import("./pages/Login"));
const Register = lazySuspense(() => import("./pages/Register"));

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={qc}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

function lazySuspense(fn: () => Promise<{ default: React.ComponentType }>) {
  const Component = lazy(
    fn, //n => new Promise(ok => setTimeout(() => ok(fn()), 5000))
  );
  return function (props: Record<string, unknown>) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LazyLoading />}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

export default App;
