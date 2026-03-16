"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllWorkers } from "../actions/getAllWorkers";
import { loginWorker } from "../actions/loginWorker";
import { loginManager } from "../actions/loginManager";
import { User } from "@/lib/utilities/interfaces";

type Tab = "worker" | "manager";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("worker");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manufacturing App
          </h1>
          <p className="text-gray-600">Sarajevo Production System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => {
                setActiveTab("worker");
                setError("");
                setPassword("");
              }}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === "worker"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              👷 Worker
            </button>
            <button
              onClick={() => {
                setActiveTab("manager");
                setError("");
                setPassword("");
              }}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === "manager"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              👔 Manager
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {activeTab === "worker" ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Seleziona il tuo nome per accedere
                </p>

                {workers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    Caricamento workers...
                  </div>
                ) : (
                  workers.map((worker) => (
                    <button
                      key={worker.id}
                      onClick={() => handleWorkerLogin(worker.name)}
                      disabled={loading}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span className="text-2xl">👤</span>
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
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password Manager
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Caricamento..." : "🔓 Accedi come Manager"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Sarajevo Manufacturing • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
