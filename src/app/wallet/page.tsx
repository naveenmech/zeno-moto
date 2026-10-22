"use client";

import { CreditCard, Smartphone, Wallet as WalletIcon } from "lucide-react";
import { useGetWalletQuery } from "@/store/api";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";

const METHOD_ICON = { UPI: Smartphone, card: CreditCard, wallet: WalletIcon } as const;

export default function WalletPage() {
  const { data: transactions } = useGetWalletQuery(undefined, { pollingInterval: 8000 });

  const volume = (transactions ?? []).filter((t) => t.status === "success").reduce((sum, t) => sum + t.amount, 0);
  const successRate = transactions?.length
    ? Math.round((transactions.filter((t) => t.status === "success").length / transactions.length) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Settled volume</p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">KES {volume.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Transactions</p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{transactions?.length ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Success rate</p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{successRate}%</p>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Rider</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {(transactions ?? []).map((txn) => {
              const Icon = METHOD_ICON[txn.method];
              return (
                <tr key={txn.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{txn.riderName}</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{txn.type.replace("-", " ")}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Icon size={14} /> {txn.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">KES {txn.amount}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={txn.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(txn.timestamp).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
