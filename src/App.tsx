import { Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { Suspense, lazy } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Loading from "./components/Loading";

const Login = lazy(() => import("./pages/Login"));
const Join = lazy(() => import("./pages/Join"));
const MyPage = lazy(() => import("./pages/MyPage"));
const StorePage = lazy(() => import("./pages/StorePage"));
const CreateReview = lazy(() => import("./pages/CreateReview"));
const CreateProfile = lazy(() => import("./pages/CreateProfile"));
const StorePageSearch = lazy(() => import("./pages/StorePageSearch"));

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <ScrollToTop />
          <Header />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/join" element={<Join />} />
              <Route path="/reviewsearch" element={<StorePageSearch />} />
              <Route path="/store/:storeId" element={<StorePage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/review" element={<CreateReview />} />
                <Route path="/profile" element={<CreateProfile />} />
              </Route>
            </Routes>
          </Suspense>
          <Footer />
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
};

export default App;
