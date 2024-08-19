import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDaysIcon } from "lucide-react";

export default function PaymentsLoad() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos de préstamos</CardTitle>
        <CardDescription>
          Registre los pagos de su préstamo y rastree el saldo restante.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="payment-amount">Monto del pago</Label>
            <Input
              id="payment-amount"
              type="number"
              placeholder="Ingresar monto del pago"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-date">Fecha de pago</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  <span id="date-display">Selecciona la fecha</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button type="submit">Pago de préstamo</Button>
      </CardContent>
    </Card>
  );
}
