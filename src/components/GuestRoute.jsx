import { Navigate } from "react-router-dom";

function GuestRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default GuestRoute;
