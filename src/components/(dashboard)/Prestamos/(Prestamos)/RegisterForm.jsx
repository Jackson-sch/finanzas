import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDaysIcon } from "lucide-react";
import { CardPayment } from "../CardPayment";
import { loanSchema } from "@/lib/validaciones/loan/load";
import { useState } from "react";

export default function RegisterForm() {
  // Uso del hook useForm para manejar el estado del formulario
  const form = useForm({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      borrower: "",
      amount: "",
      interestRate: "",
      duration: "",
      date: "",
    },
  });

  const [fechaPago, setFechaPago] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);

  const handleSubmit = async (data) => {
    console.log(data);
    try {
      const response = await fetch("/api/loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
      
    }
  };
  return (
    <CardPayment
      title="Registro de Préstamo"
      description="Ingrese los detalles del préstamo que desea registrarse."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid items-start gap-4"
        >
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="borrower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prestatario</FormLabel>
                  <FormControl>
                    <Input placeholder="Jackson Darwin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto del préstamo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresar monto del préstamo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasa de interés</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresar tasa de interés" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plazo de préstamo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresar plazo de préstamo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de inicio</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start font-normal"
                      >
                        <CalendarDaysIcon className="mr-2 h-4 w-4" />
                        <span id="date-display">
                          {fechaInicio
                            ? fechaInicio.toLocaleDateString()
                            : "Selecciona la fecha"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        select={field.value}
                        onSelect={(date) => {
                          setFechaInicio(date);
                          field.onChange(date);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de pago</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start font-normal"
                      >
                        <CalendarDaysIcon className="mr-2 h-4 w-4" />
                        <span id="fechaPago">
                          {fechaPago
                            ? fechaPago.toLocaleDateString()
                            : "Selecciona la fecha"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        select={field.value ? new Date(field.value) : null}
                        onSelect={(date) => {
                          const dateString = date.toISOString().split('T')[0]; // Convertir la fecha a string en formato 'YYYY-MM-DD'
                          setFechaPago(date);
                          field.onChange(dateString);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Registrar préstamo</Button>
        </form>
        
      </Form>

      {/* <div className="grid grid-cols-2 gap-4">
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
          <Input id="lender" placeholder="Ingrese el nombre del prestamista" />
        </div>
      </div> */}
    </CardPayment>
  );
}
