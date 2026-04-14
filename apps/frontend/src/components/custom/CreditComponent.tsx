'use client';

import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Activity, CreditCard, HandCoinsIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useElysiaClient from "@/providers/elysiaProvider";
import { useAuth } from "@/providers/authContext";
import { toast } from "sonner";

export default function CreditComponent() {
  const [amount, setAmount] = useState<number | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const client = useElysiaClient();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const presetAmounts = [100, 500, 1000, 5000];

  const { data: creditData } = useQuery({
    queryKey: ["credit", token],
    enabled: !!token,
    queryFn: async () => {
      const res = await client.api.v1.payment.credit.get({
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.data?.credit;
    },
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions", token],
    enabled: !!token,
    queryFn: async () => {
      const res = await client.api.v1.payment.transactions.get({
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.data?.transactions || [];
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async () => {
      return await client.api.v1.payment.payment.post(
        {
          amount: Number(amount),
          card: cardNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: async () => {
      toast.success("Payment successful");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["credit", token] }),
        queryClient.invalidateQueries({ queryKey: ["transactions", token] }),
      ]);

      setAmount(null);
      setCardNumber("");
      setExpiry("");
      setCvv("");
    },
  });

  return (
    <MainLayout>
      <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col gap-10">

        <div>
          <h1 className="text-3xl font-semibold text-white">Credits</h1>
          <p className="text-white/60 text-sm">
            Manage your balance and payments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-linear-to-br from-green-500/20 to-green-400/10 border border-green-400/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 text-white/70">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white/10 border border-white/10">
                    <HandCoinsIcon className="w-4 h-4 text-white" />
                </div>
                <p className="text-lg font-medium tracking-tight">
                    Balance
                </p>
            </div>
            <h2 className="text-4xl text-green-400 font-semibold mt-2">
              ₹{creditData?.amount || 0}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/20">
                    <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-sm font-medium text-white/80">
                    Transactions
                </p>
            </div>
            <h2 className="text-4xl text-white font-semibold mt-2">
              {transactions?.length || 0}
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">

            <div>
              <h2 className="text-white font-semibold text-lg">
                Select Amount
              </h2>
              <p className="text-white/50 text-sm">
                Choose how many credits to add
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`h-12 rounded-xl border text-sm font-medium transition
                    ${
                      amount === amt
                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <Input
              type="number"
              placeholder="Custom amount"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-black/30 border-white/10 text-white h-12 rounded-xl"
            />

          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">

            <div>
              <h2 className="text-white font-semibold text-lg">
                Payment Details
              </h2>
              <p className="text-white/50 text-sm">
                Enter your card information
              </p>
            </div>

            <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">

              <Input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="bg-transparent border-2 border-neutral-400 text-white text-lg tracking-widest focus:ring-0"
              />

              <div className="flex justify-between gap-4">
                <Input
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="bg-transparent border-2 border-neutral-400 text-white focus:ring-0"
                />
                <Input
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="bg-transparent border-2 border-neutral-400 text-white focus:ring-0"
                />
              </div>

            </div>

            <Button
              onClick={() => paymentMutation.mutate()}
              disabled={
                !amount || !cardNumber || !expiry || !cvv || paymentMutation.isPending
              }
              className="h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl text-base font-medium shadow-lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {paymentMutation.isPending ? "Processing..." : `Pay ₹${amount || 0}`}
            </Button>

          </div>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 text-white/60 text-sm">
            Transaction History
          </div>

          <table className="w-full text-sm">
            <tbody>
              {transactions?.length === 0 ? (
                <tr>
                  <td className="text-center py-10 text-white/40">
                    No transactions
                  </td>
                </tr>
              ) : (
                transactions?.map((tx: any) => (
                  <tr
                    key={tx.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      ₹{tx.amount}
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {tx.status}
                    </td>
                    <td className="px-6 py-4 text-white/50 text-xs">
                      {new Date(tx.createdAt).toLocaleString()}
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