import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CreditCard,
  Key,
  User,
} from "lucide-react";
import { useAuth } from "@/providers/authContext";
import useElysiaClient from "@/providers/elysiaProvider";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Credits", icon: CreditCard, path: "/credits" },
  { label: "API Keys", icon: Key, path: "/api-keys" },
];

const useProfileQuery = () => {
  const client = useElysiaClient();
  const { token } = useAuth();

  return useQuery({
    queryKey: ["profile", token],
    enabled: !!token,
    queryFn: async () => {
      const res = await client.api.v1.auth.profile.get({
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.data;
    },
  });
};

export default function AppSidebar() {
  const navigate = useNavigate();
  const { data: profile } = useProfileQuery();
  return (
    <Sidebar className="bg-[#020617] border-r border-white/10">
      <SidebarHeader>
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white">
            O
          </div>
          <span className="font-semibold text-lg text-white">
            OpenRouter
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="flex flex-col gap-1 px-2">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={()=>{navigate(`${item.path}`)}}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-white transition"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {profile?.name || "Loading..."}
              </span>
              <span className="text-xs text-gray-400">
                {profile?.email}
              </span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}