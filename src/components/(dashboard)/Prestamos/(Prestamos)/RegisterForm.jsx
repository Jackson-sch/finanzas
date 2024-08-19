import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDaysIcon } from "lucide-react";

export default function RegisterForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Préstamo</CardTitle>
        <CardDescription>
          Ingrese los detalles del préstamo que desea registrarse.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto del préstamo</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Ingresar monto del préstamo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest-rate">Tasa de interés</Label>
            <Input
              id="interest-rate"
              type="number"
              placeholder="Ingresar tasa de interés"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="term" className="flex gap-1">
              Plazo de préstamo{" "}
              <p className="text-xs font-light text-foreground">(meses)</p>
            </Label>
            <Input
              id="term"
              type="number"
              placeholder="Ingresar plazo de préstamo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start-date">Fecha de inicio</Label>
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="borrower">Prestataria</Label>
            <Input
              id="borrower"
              placeholder="Ingrese el nombre del prestatario"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lender">Prestadora</Label>
            <Input
              id="lender"
              placeholder="Ingrese el nombre del prestamista"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit">Registro de Préstamo</Button>
      </CardFooter>
    </Card>
  );
}
