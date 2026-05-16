"use client";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para el modal de recuperar contraseña
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverError, setRecoverError] = useState("");
  const [recoverSuccess, setRecoverSuccess] = useState(false);
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Asegurar que el componente está montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData);

      console.log("🔐 Login response:", response);

      Cookies.set("token", response.token, {
        expires: 7,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      Cookies.set("user", JSON.stringify(response), {
        expires: 7,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      const rawRole = response.role || "";
      const role = rawRole.replace("ROLE_", "").toUpperCase();

      Cookies.set("role", role, {
        expires: 7,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      console.log("🎭 Rol normalizado:", role);

      if (role === "ADMIN" || role === "EMPLEADO") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/tienda";
      }
    } catch (err: any) {
      console.error("❌ Error en login:", err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Función simulada para recuperar contraseña
  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverError("");
    setRecoverLoading(true);

    // Validación básica
    if (!recoverEmail.trim()) {
      setRecoverError(
        "Debe ingresar un nombre de usuario o correo electrónico",
      );
      setRecoverLoading(false);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recoverEmail)) {
      setRecoverError("Debe ingresar un correo electrónico válido");
      setRecoverLoading(false);
      return;
    }

    // Simulación de envío (espera 2 segundos)
    setTimeout(() => {
      setRecoverLoading(false);
      setRecoverSuccess(true);

      // Cerrar modal después de 3 segundos
      setTimeout(() => {
        setShowRecoverModal(false);
        setRecoverSuccess(false);
        setRecoverEmail("");
      }, 3000);
    }, 2000);
  };

  const handleCancelRecover = () => {
    setShowRecoverModal(false);
    setRecoverEmail("");
    setRecoverError("");
    setRecoverSuccess(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            🛏️ Camas y Colchones
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión en tu cuenta
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </div>

          <div className="flex flex-col space-y-2 text-center">
            {mounted && (
              <button
                type="button"
                onClick={() => setShowRecoverModal(true)}
                className="font-medium text-primary-600 hover:text-primary-500 text-sm"
              >
                Recuperar Contraseña
              </button>
            )}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-500 text-sm"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </form>
      </div>

      {/* Modal Recuperar Contraseña (P1.3) - Solo se renderiza en el cliente */}
      {mounted && showRecoverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Recuperar Contraseña
            </h3>

            {!recoverSuccess ? (
              <form onSubmit={handleRecoverPassword}>
                {recoverError && (
                  <div className="rounded-md bg-red-50 p-3 mb-4">
                    <p className="text-sm text-red-800">{recoverError}</p>
                  </div>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="recoverEmail"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre de usuario o correo electrónico
                  </label>
                  <input
                    id="recoverEmail"
                    name="recoverEmail"
                    type="email"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm"
                    placeholder="tu@email.com"
                    value={recoverEmail}
                    onChange={(e) => setRecoverEmail(e.target.value)}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelRecover}
                    disabled={recoverLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={recoverLoading}
                    className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {recoverLoading ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-800 text-center">
                  Se ha enviado una contraseña temporal a su correo electrónico
                  registrado
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
