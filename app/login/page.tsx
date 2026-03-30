"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  HardHat,
  LockKeyhole,
  User as UserIcon,
  Factory,
} from "lucide-react";
import { getAllWorkers } from "../actions/getAllWorkers";
import { loginWorker } from "../actions/loginWorker";
import { loginManager } from "../actions/loginManager";
import { User } from "@/lib/utilities/interfaces";
import { UserRole } from "@/lib/utilities/types";
import { Button } from "@/lib/components/button";
import { Input } from "@/lib/components/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/card";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UserRole>("worker");
  const [workers, setWorkers] = useState<User[]>([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load workers on mount
  useEffect(() => {
    const loadWorkers = async () => {
      const data = await getAllWorkers();
      setWorkers(data);
    };
    loadWorkers();
  }, []);

  const handleWorkerLogin = async (workerName: string) => {
    setError("");
    setLoading(true);

    const result = await loginWorker(workerName);

    if (result.success && result.workerId) {
      router.push(`/worker/${result.workerId}`);
      router.refresh();
    } else {
      setError(result.error || "Error during login");
    }

    setLoading(false);
  };

  const handleManagerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginManager(password);

    if (result.success) {
      router.push("/manager");
      router.refresh();
    } else {
      setError(result.error || "Invalid password");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-400/20 flex items-center justify-center">
              <Factory className="h-6 w-6 text-amber-400" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-slate-100">Roma</h1>
              <p className="text-xs text-slate-400">Production System</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <Card>
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => {
                setActiveTab("worker");
                setError("");
                setPassword("");
              }}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
                activeTab === "worker"
                  ? "bg-amber-400/10 text-amber-300 border-b-2 border-amber-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <HardHat className="h-4 w-4" aria-hidden="true" />
                Worker
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("manager");
                setError("");
                setPassword("");
              }}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
                activeTab === "manager"
                  ? "bg-sky-400/10 text-sky-300 border-b-2 border-sky-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                Manager
              </span>
            </button>
          </div>

          {/* Content */}
          <CardContent className="pt-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm">
                <p className="font-medium">Authentication Error</p>
                <p className="mt-1">{error}</p>
              </div>
            )}

            {activeTab === "worker" ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-400 mb-6 text-center">
                  Select your name to continue
                </p>

                {workers.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <div className="h-8 w-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-2" />
                    Loading workers...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {workers.map((worker) => (
                      <button
                        key={worker.id}
                        onClick={() => handleWorkerLogin(worker.name)}
                        disabled={loading}
                        className="py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-slate-100 border border-amber-400/20 hover:border-amber-400/40 text-sm font-medium"
                      >
                        <UserIcon
                          className="h-5 w-5 text-amber-300"
                          aria-hidden="true"
                        />
                        <span className="truncate">{worker.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleManagerLogin} className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300 mb-3"
                  >
                    <span className="flex items-center gap-2">
                      <LockKeyhole className="h-4 w-4 text-sky-400" />
                      Manager Password
                    </span>
                  </label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoFocus
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  <LockKeyhole className="h-4 w-4 mr-2" />
                  {loading ? "Signing in..." : "Manager Sign In"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Roma Manufacturing © {new Date().getFullYear()}</p>
          <p className="mt-1">Advanced Production Management System</p>
        </div>
      </div>
    </div>
  );
}
