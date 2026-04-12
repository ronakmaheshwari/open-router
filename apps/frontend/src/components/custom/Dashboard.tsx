import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "../ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BarChart3,
  Activity,
  Cpu,
  LayoutDashboard,
  CreditCard,
  Key,
  User,
} from "lucide-react";
import useElysiaClient from "@/providers/elysiaProvider";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/authContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Credits", icon: CreditCard },
  { label: "API Keys", icon: Key },
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

const useDashboard = () => {
  const client = useElysiaClient();
  const { token } = useAuth();

  return useQuery({
    queryKey: ["dashboard", token],
    enabled: !!token,
    queryFn: async () => {
      const res = await client.api.v1.apikey.dashboard.get({
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.data;
    },
  });
};

export default function DashboardComponent() {
  const { data: profile } = useProfileQuery();
  const { data: dashboard, isLoading } = useDashboard();

  const stats = [
    { title: "Total Requests", value: dashboard?.totalRequests || 0, icon: BarChart3 },
    { title: "API Keys", value: dashboard?.apiKeys || 0, icon: Key },
    { title: "Input Tokens", value: dashboard?.totalInputTokens || 0, icon: Cpu },
    { title: "Output Tokens", value: dashboard?.totalOutputTokens || 0, icon: Activity },
  ];

  const chartData = dashboard?.usageByDay || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-[#020617] text-white">
        <Sidebar className="bg-[#020617] border-r border-white/10">
          <SidebarHeader>
            <div className="px-4 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-zinc-50">O</div>
              <span className="font-semibold text-lg text-zinc-50">OpenRouter</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <div className="flex flex-col gap-1 px-2">
                {menuItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-white">
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
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-zinc-50 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-50">{profile?.name}</span>
                  <span className="text-xs text-gray-400">{profile?.email}</span>
                </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">OpenRouter Dashboard</h1>
              <p className="text-gray-400 text-sm">Monitor usage</p>
            </div>
            <Button className="rounded-xl px-5 py-2 bg-white/5 border border-white/10 hover:bg-white/10">
              Create API Key
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="bg-white/5 border border-white/10">
                    <CardContent className="p-5 flex justify-between">
                      <div>
                        <p className="text-sm text-gray-400">{stat.title}</p>
                        <h2 className="text-xl">{stat.value}</h2>
                      </div>
                      <Icon />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <Card className="xl:col-span-2 bg-white/5 border border-white/10">
              <CardContent className="p-6">
                <h2 className="mb-4">Usage Overview</h2>
                <div className="h-72">
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="tokens" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10">
              <CardContent className="p-6">
                <h2 className="mb-4">Recent Activity</h2>
                <ul className="space-y-2">
                  {dashboard?.recent?.map((r, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>{r.model}</span>
                      <span>{r.tokens}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}