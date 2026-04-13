import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Key, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ApiKey {
  name: string;
  apiKey: string;
  createdAt: string;
}

interface ApiKeysTableProps {
  keys?: ApiKey[];
  isLoading: boolean;
}

const ApiKeysTable = ({ keys, isLoading }: ApiKeysTableProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const displayKeys = keys ?? [];

  const handleCopy = (apiKey: string, index: number) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <Card className="bg-white/5 border border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Key className="h-5 w-5 text-white/60" />
            <h3 className="text-lg font-semibold text-white">API Keys</h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            </div>
          ) : displayKeys.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No API keys found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <colgroup>
                  <col className="w-1/4" />
                  <col className="w-1/2" />
                  <col className="w-1/6" />
                  <col className="w-10" />
                </colgroup>
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      Name
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      Key
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      Created
                    </th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayKeys.map((key, i) => (
                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4 max-w-0">
                        <span
                          className="text-sm font-medium text-white truncate block"
                          title={key.name}
                        >
                          {key.name || "—"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 max-w-0">
                        <code
                          className="text-sm text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded block truncate"
                          title={key.apiKey}
                        >
                          {key.apiKey}
                        </code>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className="text-sm text-gray-400">
                          {new Date(key.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(key.apiKey, i)}
                          className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Copy API key"
                        >
                          {copiedIndex === i ? (
                            <Check className="h-3.5 w-3.5 text-green-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ApiKeysTable;