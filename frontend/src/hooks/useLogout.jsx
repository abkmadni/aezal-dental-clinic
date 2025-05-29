import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  return logout;
}
