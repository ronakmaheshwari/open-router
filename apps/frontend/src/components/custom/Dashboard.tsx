import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BarChart3,
  Activity,
  Cpu,
  Key,
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
import MainLayout from "../layout/MainLayout";
import { useState } from "react";
import CreateApiModal from "./CreateApiModal";
import ApiKeysTable from "./ApikeyTable";

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
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();

  const [showModal, setShowModal] = useState<boolean>(false);

  const stats = [
    { title: "Total Requests", value: dashboard?.totalRequests || 0, icon: BarChart3 },
    { title: "API Keys", value: dashboard?.apiKeys || 0, icon: Key },
    { title: "Input Tokens", value: dashboard?.totalInputTokens || 0, icon: Cpu },
    { title: "Output Tokens", value: dashboard?.totalOutputTokens || 0, icon: Activity },
  ];

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">OpenRouter Dashboard</h1>
          <p className="text-gray-400 text-sm">Monitor usage</p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="rounded-xl px-5 py-2 bg-white/5 border border-white/10 hover:bg-white/10"
        >
          Create API Key
        </Button>
      </div>

      <CreateApiModal open={showModal} setOpen={setShowModal} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <Card className="xl:col-span-2 bg-white/5 border border-white/10">
          <CardContent className="p-6">
            <h2 className="mb-4">Usage Overview</h2>

            <div className="h-72">
              {dashboardLoading ? (
                <p>Loading...</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboard?.usageByDay || []}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tokens" stroke="#fff" />
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
              {dashboard?.recent?.map((r: any, i: number) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{r.model}</span>
                  <span>{r.tokens}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <ApiKeysTable />
    </MainLayout>
  );
}