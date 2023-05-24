import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { RecoilRoot } from "recoil";
import CreateProfile from "./pages/CreateProfile";
import { QueryClient, QueryClientProvider } from "react-query";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import StorePageSearch from "./pages/StorePageSearch";
import { Suspense, lazy } from "react";
import Loading from "./components/Loading";
// import Join from "./pages/Join";
// import Login from "./pages/Login";
// import MyPage from "./pages/MyPage";
// import CreateReview from "./pages/CreateReview";
// import StorePage from "./pages/StorePage";

const Login = lazy(() => import("./pages/Login"));
const Join = lazy(() => import("./pages/Join"));
const MyPage = lazy(() => import("./pages/MyPage"));
const StorePage = lazy(() => import("./pages/StorePage"));
const CreateReview = lazy(() => import("./pages/CreateReview"));

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
