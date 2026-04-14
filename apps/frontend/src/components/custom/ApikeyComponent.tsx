'use client';

import { useState } from 'react';
import MainLayout from "../layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Copy, Eye, EyeOff, Trash2, CheckCircle2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useElysiaClient from '@/providers/elysiaProvider';
import { useAuth } from '@/providers/authContext';
import { toast } from 'sonner';
import { useApiKeys } from './ApikeyTable';

export default function ApikeyComponent() {
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const client = useElysiaClient();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useApiKeys()

  const createMutation = useMutation({
    mutationFn: async () => {
      return await client.api.v1.apikey.create.post(
        { name: newKeyName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("API key created");
      setNewKeyName('');
      queryClient.invalidateQueries({ queryKey: ["apikeys"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create API key");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await client.api.v1.apikey({id}).delete({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("API key deleted");
      queryClient.invalidateQueries({ queryKey: ["apikeys"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Delete failed");
    },
  });

  const createNewKey = () => {
    if (!newKeyName.trim()) return;
    createMutation.mutate();
  };

  const deleteKey = (id: string) => {
    deleteMutation.mutate(id);
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const apiKeys = data?.keys || [];

  return (
    <MainLayout>
      <div className="w-full mx-auto px-6 py-12 flex flex-col gap-10">

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            API Keys
          </h1>
          <p className="text-white/60 text-sm">
            Create and manage your API keys securely
          </p>
        </div>

        <Card className="bg-white/4 border border-white/10 rounded-2xl backdrop-blur-xl">
          <CardContent className="p-6 flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <h2 className="text-white font-medium text-base">
                Create new key
              </h2>
              <p className="text-white/50 text-sm">
                Give your key a name to identify it later
              </p>
            </div>

            <div className="flex gap-3">
              <Input
                placeholder="e.g. Production, Mobile App..."
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createNewKey()}
                className="h-11 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500"
              />

              <Button
                onClick={createNewKey}
                disabled={createMutation.isPending}
                className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create
              </Button>
            </div>

          </CardContent>
        </Card>

        <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">

          <table className="w-full text-sm">

            <thead className="border-b border-white/10 bg-white/2">
              <tr className="text-white/50 text-xs uppercase tracking-wide">
                <th className="px-6 py-4 text-left font-medium">Name</th>
                <th className="px-6 py-4 text-left font-medium">API Key</th>
                <th className="px-6 py-4 text-left font-medium">Created</th>
                <th className="px-6 py-4 text-left font-medium">Credits</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-white/40">
                    Loading API keys...
                  </td>
                </tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-white/40">
                    No API keys found
                  </td>
                </tr>
              ) : (
                apiKeys.map((key: any) => (
                  <tr
                    key={key.id}
                    className="border-b border-white/5 hover:bg-white/3 transition"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {key.name}
                    </td>

                    <td className="px-6 py-4 font-mono text-white/70">
                      {visibleKeys[key.id]
                        ? key.apiKey
                        : "••••••••••••••••••••••"}
                    </td>

                    <td className="px-6 py-4 text-white/60">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-white/60">
                      {key.creditsConsumed}
                    </td>

                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-green-400 text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        Active
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => toggleVisibility(key.id)}
                          className="p-2 rounded-md hover:bg-white/10 transition"
                        >
                          {visibleKeys[key.id]
                            ? <EyeOff className="w-4 h-4 text-white/70" />
                            : <Eye className="w-4 h-4 text-white/70" />}
                        </button>

                        <button
                          onClick={() => copyToClipboard(key.apiKey, key.id)}
                          className="p-2 rounded-md hover:bg-white/10 transition"
                        >
                          {copiedId === key.id
                            ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                            : <Copy className="w-4 h-4 text-white/70" />}
                        </button>

                        <button
                          onClick={() => deleteKey(key.id)}
                          className="p-2 rounded-md hover:bg-red-500/20 transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </MainLayout>
  );
}