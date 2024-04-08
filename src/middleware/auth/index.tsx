import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import useStableRefs from "@/utils/use-stable-refs";
import { Loading } from "@/components";

export const AuthMiddleware = () => {
  const { user, setUserValue } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // initialize axios private instance for authorized requests
  const { axiosPrivateInstance } = useStableRefs();
  const [loading, setLoading] = useState(true);
  // get cookies
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    // if user is already loaded
    if (user !== null) {
      console.log("already loaded :", user);
      setLoading(false);
      return;
    }

    // if user is not loaded yet
    let isMounted = true;

    async function verifyUser() {
      try {
        const { data } = await axiosPrivateInstance.current.get("/user");
        setUserValue(data?.data);
        console.log(data?.data);
      } catch (error) {
        setUserValue(null);
        navigate("/login", {
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
    location.pathname,
    cookies,
    location,
    navigate,
    setUserValue,
    user,
  ]);

  // if user is not loaded yet
  if (loading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading />
      </div>
    );

  // if user is logged in
  if (user !== null) return <Outlet />;

  // if user is not logged in
  if (user === null) {
    return <Navigate to="/login" replace />;
  }
};
