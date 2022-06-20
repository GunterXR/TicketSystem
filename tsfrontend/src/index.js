import ReactDOM from "react-dom/client";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import App from "./App";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Profile from "./pages/profile/Profile";
import Tickets from "./pages/tickets/Tickets"
import Ticket from "./pages/tickets/Ticket";
import AdminManage from "./pages/admin/AdminManage";
import AdminProfile from "./pages/admin/AdminProfile";
import Stats from "./pages/stats/Stats";

const root = ReactDOM.createRoot(
    document.getElementById("root")
);
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="profile" element={<Profile />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="ticket" element={<Ticket />} />
            <Route path="admin" element={<AdminManage />} />
            <Route path="admin/user" element={<AdminProfile />} />
            <Route path="stats" element={<Stats />} />
        </Routes>
    </BrowserRouter>
);