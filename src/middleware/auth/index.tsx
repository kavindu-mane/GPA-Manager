import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { useCookies } from "react-cookie";
import { NotFound } from "@/pages/404";
import useStableRefs from "@/utils/use-stable-refs";

export default function AuthMiddleware({ requiredPermission = "" }) {
  const { user, permissions, setUserValue, setPermissionsValue } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // initialize axios private instance for authorized requests
  // initialize notification for notifications handling
  const { axiosPrivateInstance } = useStableRefs();
  const [loading, setLoading] = useState(true);
  // get cookies
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    // if user is already loaded
    if (user !== null) {
      setLoading(false);
      return;
    }

    // if user is not loaded yet
    let isMounted = true;

    async function verifyUser() {
      try {
        const { data } =
          await axiosPrivateInstance.current.get("/user/check-token");
        if (data?.data?.must_change_password !== 1) {
          setUserValue(data?.data);
          setPermissionsValue(data?.data?.user_group?.permissions);
        }
      } catch (error) {
        setUserValue(null);
        navigate("/login", {
          state: {
            from: location,
            error: "Session expired. please login again.",
          },
          replace: true,
        });
      } finally {
        isMounted && setLoading(false);
      }
    }

    // if user is not logged in and token is available
    cookies["token"] ? verifyUser() : setLoading(false);

    return () => {
      isMounted = false;
    };
  }, [
    axiosPrivateInstance,
    cookies,
    location,
    location.pathname,
    navigate,
    setPermissionsValue,
    setUserValue,
    user,
  ]);

  // if user is not loaded yet
  if (loading)
    return (
      <Spin
        className="flex h-screen w-screen items-center justify-center"
        size="large"
      />
    );

  // if user is logged in and does have required permission
  if (
    user !== null &&
    (permissions.includes(requiredPermission) || requiredPermission === "")
  )
    return <Outlet />;

  // if user is not logged in
  if (user === null) {
    const sessionState = localStorage.getItem("sessionActive") === "true";
    // clear session active state from local storage
    localStorage.removeItem("sessionActive");
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          error: sessionState ? "Session expired. please login again." : "",
        }}
        replace
      />
    );
  }

  // if user doesn't have required permission
  if (!permissions.includes(requiredPermission)) return <NotFound />;
}
