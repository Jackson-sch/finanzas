import { Calendar, Car, DollarSign, Heart, SquareGanttChart, SquareKanban, Wallet } from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: Car,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: DollarSign,
    label: "Prestamos",
    href: "/prestamos",
  },
  {
    icon: Wallet,
    label: "Transacciones",
    href: "/transactions",
  },
  {
    icon: SquareKanban,
    label: "Reportes",
    href: "/reportes",
  },
];

export const dataAdminSidebar = [
  {
    icon: SquareGanttChart,
    label: "Manage your cars",
    href: "/dashboard/admin/cars-manager",
  },
  {
    icon: Calendar,
    label: "All Reservations",
    href: "/dashboard/admin/reserves-admin",
  },
];
