import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Join from "./pages/Join";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { RecoilRoot } from "recoil";
import MyPage from "./pages/MyPage";
import StoreSelect from "./pages/StoreSelect";
import StoreSearch from "./pages/StoreSearch";
import CreateReview from "./pages/CreateReview";
import CreateProfile from "./pages/CreateProfile";
import { QueryClient, QueryClientProvider } from "react-query";
import StorePage from "./pages/StorePage";
import ProtectedRoute from "./components/ProtectedRoute";

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
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store/:storeId" element={<StorePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/storeselect" element={<StoreSelect />} />
              <Route path="/storesearch" element={<StoreSearch />} />
              <Route path="/review" element={<CreateReview />} />
              <Route path="/profile" element={<CreateProfile />} />
            </Route>
          </Routes>
          <Footer />
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
};

export default App;
