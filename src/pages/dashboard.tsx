import { Button } from "@/components/ui/button";
import { TbHexagonLetterG } from "react-icons/tb";
import { IoIosHome } from "react-icons/io";
import { IoSettingsSharp, IoSearch } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers";
import useStableRefs from "@/utils/use-stable-refs";
import { useToast } from "@/components/ui/use-toast";
import { DashboardMain } from "./dashboards";

export const Dashboard = () => {
  const { user } = useAuth();
  // initialize axios private instance for authorized requests
  const { axiosPrivateInstance } = useStableRefs();
  const navigate = useNavigate();
  // toast hook
  const { toast } = useToast();
  // location hook
  const location = useLocation();

  const navigationBarSetup = [
    {
      url: "/",
      text: "Dashboard",
      icon: <IoIosHome className="h-4 w-4" />,
    },
    {
      url: "/settings",
      text: "Settings",
      icon: <IoSettingsSharp className="h-4 w-4" />,
    },
  ];

  // logout function
  const logout = async () => {
    await axiosPrivateInstance.current
      .post("/user/logout")
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Logout successful",
            description: "Redirecting to login...",
            className: "bg-green-500 text-white",
          });
          navigate("/login", { replace: true });
        }
      })
      .catch(() => {
        toast({
          title: "Logout unsuccessful",
          description: "An error occurred while logging out",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* brand name */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <TbHexagonLetterG className="h-6 w-6" />
              <span className="">GPA Manager</span>
            </Link>
          </div>

          {/* navigation bar */}
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navigationBarSetup.map((item) => (
                <Link
                  to={item.url}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${item.url === location.pathname ? "bg-muted text-primary" : "text-muted-foreground"} transition-all hover:text-primary`}
                >
                  {item.icon}
                  {item.text}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {/* navigation for small sizes */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* side bar for small devices */}
          <Sheet>
            {/* menu */}
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <GiHamburgerMenu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <TbHexagonLetterG className="h-6 w-6" />
                  <span className="">GPA Manager</span>
                </Link>
                {navigationBarSetup.map((item) => (
                  <Link
                    to={item.url}
                    className={`${item.url === location.pathname ? "bg-muted text-primary" : "text-muted-foreground"} mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground`}
                  >
                    {item.icon}
                    {item.text}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* search */}
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <IoSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search subject..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>

          {/* user menu dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <FaUserCircle className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="max-w-40 truncate">
                {user.name}
                <p className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {/* main content area */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex h-full w-full flex-col items-center gap-1 text-center">
              {/* to be implemented */}
              <DashboardMain />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
