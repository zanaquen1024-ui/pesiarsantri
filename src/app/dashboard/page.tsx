"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePesiar } from "@/lib/context/pesiar-context";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { currentUser } = usePesiar();

  useEffect(() => {
    switch (currentUser.role) {
      case "super_admin":
        router.replace("/dashboard/super-admin");
        break;
      case "admin":
        router.replace("/dashboard/admin");
        break;
      case "pengurus":
        router.replace("/dashboard/pengurus");
        break;
      case "guardian":
        router.replace("/dashboard/guardian");
        break;
      case "gate_officer":
        router.replace("/dashboard/gate");
        break;
      case "leader":
        router.replace("/dashboard/leader");
        break;
      default:
        router.replace("/dashboard/admin");
    }
  }, [currentUser, router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-4 border-pesantren-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Mengarahkan ke portal {currentUser.role}...</p>
      </div>
    </div>
  );
}

