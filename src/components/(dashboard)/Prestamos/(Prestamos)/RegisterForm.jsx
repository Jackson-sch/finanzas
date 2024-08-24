import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDaysIcon } from "lucide-react";
import { CardPayment } from "../CardPayment";
import { loanSchema } from "@/lib/validaciones/loan/loan";

export default function RegisterForm({ onSubmit, onSimulator, loans }) {
  const form = useForm({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      borrower: "",
      amount: "",
      interestYear: "",
      interestRate: "",
      durationYears: "",
      durationMonths: "",
      date: "",
      paymentFrequency: "",
    },
  });

  const [fechaInicio, setFechaInicio] = useState(null);

  const { watch, setValue } = form;
  const interestYear = watch("interestYear");
  const durationYear = watch("durationYears");
  const durationMonth = watch("durationMonths");

  useEffect(() => {
    if (interestYear) {
      const interestRate = interestYear / 12;
      setValue("interestRate", interestRate.toFixed(2));
    }
  }, [interestYear, setValue]);

  useEffect(() => {
    if (durationYear || durationMonth) {
      const totalDurationMonths =
        (durationYear || 0) * 12 + (durationMonth || 0);
      setValue("durationMonths", totalDurationMonths);
    }
  }, [durationYear, setValue]);

  return (
    <CardPayment
      title="Registro de Préstamo"
      description="Ingrese los detalles del préstamo que desea registrar."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid items-start gap-6"
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
                      type="number"
                      placeholder="Ingresar monto del préstamo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="interestYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasa de interés anual</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ingresar tasa de interés"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="durationYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Plazo <strong>(años)</strong>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ingresar plazo de préstamo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasa de interés mensual</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      type="number"
                      placeholder="Ingresar tasa de interés"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="durationMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Plazo <strong>(meses)</strong>
                  </FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      type="number"
                      placeholder="Ingresar plazo de préstamo"
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
                        selected={fechaInicio}
                        onSelect={(date) => {
                          if (date) {
                            const dateString = date.toISOString().split("T")[0];
                            setFechaInicio(date);
                            field.onChange(dateString);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia de pago</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Frecuencia de pago">
                          {field.value || "Selecciona una opción"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mensual">Mensual</SelectItem>
                        <SelectItem value="Trimestral">Trimestral</SelectItem>
                        <SelectItem value="Semestral">Semestral</SelectItem>
                        <SelectItem value="Anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onSimulator(form.getValues())}>
              Simular Préstamo
            </Button>
            <Button type="submit">Registrar Préstamo</Button>
          </div>
        </form>
      </Form>
    </CardPayment>
  );
}