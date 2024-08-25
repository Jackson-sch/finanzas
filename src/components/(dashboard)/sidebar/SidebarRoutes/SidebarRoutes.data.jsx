import { Calendar, Car, ClipboardPen, DollarSign, HandCoins, Heart, SquareGanttChart, SquareKanban, Wallet, Wallet2 } from "lucide-react";

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
    icon: HandCoins,
    label: "Pagos de préstamos",
    href: "/pagos-prestamos",
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
