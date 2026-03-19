"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, HardHat, LockKeyhole, User as UserIcon } from "lucide-react";
import { getAllWorkers } from "../actions/getAllWorkers";
import { loginWorker } from "../actions/loginWorker";
import { loginManager } from "../actions/loginManager";
import { User } from "@/lib/utilities/interfaces";
import { UserRole } from "@/lib/utilities/types";

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
      setError(result.error || "Errore durante il login");
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
      setError(result.error || "Password non valida");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Manufacturing App
          </h1>
          <p className="text-slate-300">Sarajevo Production System</p>
        </div>

        {/* Card */}
        <div className="surface rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => {
                setActiveTab("worker");
                setError("");
                setPassword("");
              }}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors border-r border-white/10 ${
                activeTab === "worker"
                  ? "bg-white/10 text-slate-100"
                  : "text-slate-300 hover:bg-white/5"
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
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === "manager"
                  ? "bg-white/10 text-slate-100"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                Manager
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {activeTab === "worker" ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-300 mb-4 text-center">
                  Seleziona il tuo nome per accedere
                </p>

                {workers.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    Caricamento workers...
                  </div>
                ) : (
                  workers.map((worker) => (
                    <button
                      key={worker.id}
                      onClick={() => handleWorkerLogin(worker.name)}
                      disabled={loading}
                      className="w-full font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-slate-100 border border-amber-400/20"
                    >
                      <UserIcon className="h-5 w-5" aria-hidden="true" />
                      <span>{worker.name}</span>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <form onSubmit={handleManagerLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-200 mb-2"
                  >
                    Password Manager
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl surface focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    placeholder="••••••••"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-sky-500/15 hover:bg-sky-500/25 text-slate-100 border border-sky-400/20"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                    {loading ? "Caricamento..." : "Accedi come Manager"}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Sarajevo Manufacturing • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
