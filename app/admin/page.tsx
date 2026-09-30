import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { adminState } from "@/lib/adminState";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Administrace | Pauzeo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin configured={Boolean(process.env.ADMIN_PASSWORD)} />;
  return <AdminApp initial={await adminState()} />;
}
