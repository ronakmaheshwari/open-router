import React, { useEffect, useState } from "react";
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
  Users,
  Cpu,
  LayoutDashboard,
  CreditCard,
  Key,
  User,
} from "lucide-react";
import useElysiaClient from "@/providers/elysiaProvider";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/authContext";

const stats = [
  { title: "Total Requests", value: "1.2M", icon: BarChart3 },
  { title: "Active Models", value: "24", icon: Cpu },
  { title: "Users", value: "8,392", icon: Users },
  { title: "Latency Avg", value: "120ms", icon: Activity },
];

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Credits", icon: CreditCard },
  { label: "API Keys", icon: Key },
];

interface ProfileInterface {
    name: string;
    email: string;
}

const useProfileQuery = () => {
  const client = useElysiaClient();
  const { token } = useAuth();

  return useQuery<ProfileInterface>({
    queryKey: ["profile", token],
    enabled: !!token,
    queryFn: async () => {
      const res = await client.api.v1.auth.profile.get({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data) {
        throw new Error("Failed to fetch profile");
      }

      return res.data.data;
    },
  });
};

export default function DashboardComponent() {
    const { data, isLoading, error } = useProfileQuery();

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-[#020617] text-white">
        <Sidebar className="bg-[#020617] border-r">
          <SidebarHeader>
            <div className="px-4 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white">
                O
              </div>
              <span className="font-semibold text-lg tracking-tight text-white">
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
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all"
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
              {isLoading ? (
                <div className="text-xs text-gray-400">Loading...</div>
              ) : error || !data ? (
                <div className="text-xs text-red-400">Error loading profile</div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {data.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {data.email}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                OpenRouter Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Monitor usage, models, and performance
              </p>
            </div>

            <Button className="rounded-xl px-5 py-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md">
                Create API Key
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">
                          {stat.title}
                        </p>
                        <h2 className="text-2xl font-semibold mt-1">
                          {stat.value}
                        </h2>
                      </div>
                      <Icon className="w-8 h-8 text-gray-300" />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <Card className="xl:col-span-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Usage Overview
                </h2>
                <div className="h-72 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-gray-500">
                  Integrate chart here
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Recent Activity
                </h2>
                <ul className="space-y-4 text-sm text-gray-300">
                  <li className="flex justify-between">
                    <span>gpt-4.1 used</span>
                    <span className="text-gray-500">120 tokens</span>
                  </li>
                  <li>New API key created</li>
                  <li>User signed up</li>
                  <li className="text-red-400">Latency spike detected</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Models */}
          <Card className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Available Models</h2>
                <Button variant="secondary" className="rounded-xl">
                  Manage
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {["GPT-4.1", "Claude 3", "Mistral", "Gemini"].map(
                  (model, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.04 }}>
                      <Card className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                        <CardContent className="p-5">
                          <h3 className="font-medium text-lg">{model}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            High performance model
                          </p>
                          <Button className="mt-4 w-full rounded-xl">
                            Use Model
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
}