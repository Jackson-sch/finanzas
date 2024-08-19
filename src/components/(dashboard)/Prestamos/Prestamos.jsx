/**
 * v0 by Vercel.
 * @see https://v0.dev/t/tgKceSRZPE3
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import RegisterForm from "./(Prestamos)/RegisterForm";
import DetailsLoan from "./(Prestamos)/DetailsLoan";
import PaymentsLoad from "./(Prestamos)/PaymentsLoad";
import PaymentHistory from "./(Prestamos)/PaymentHistory";

export default function Prestamos() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between rounded-md bg-primary px-6 py-4 text-primary-foreground">
        <h1 className="text-2xl font-bold">Gestión de préstamos</h1>
      </header>
      <main className="flex-1 pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <RegisterForm />
          <DetailsLoan />
        </div>
        <Separator className="my-6" />
        <div>
          <PaymentsLoad />
        </div>
        <Separator className="my-6" />
        <div>
          <PaymentHistory />
        </div>
      </main>
    </div>
  );
}
