import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
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
import { CalendarIcon } from "lucide-react";
import { CardComponent } from "@/components/CardComponent";
import { toast } from "@/components/ui/use-toast";

import {
  getEquivalentInterestRate,
  getTotalPayments,
  getPaymentAmount,
} from "@/utils/loanSimulator/LoanSimulator";
import { loanSchema } from "@/lib/validaciones/loan/loan";

export default function RegisterForm({ onSubmit, onSimulator, session }) {
  const form = useForm({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      borrower: "",
      amount: 0,
      interestYear: 0,
      interestRate: 0,
      durationYears: 0,
      durationMonths: 0,
      totalDurationMonths: 0,
      date: format(new Date(), "yyyy-MM-dd"),
      paymentFrequency: "Mensual",
      email: session?.user?.email || "",
      loanType: "Personal",
      interestType: "Fijo",
      estimatedPayment: 0,
      openingCosts: 0,
      insurance: 0,
      amortizationMethod: "Francés",
    },
  });

  const { watch, setValue } = form;

  const updateDuration = useCallback(
    (field, value) => {
      const years =
        field === "durationYears" ? value : Number(watch("durationYears")) || 0;
      const months =
        field === "durationMonths"
          ? value
          : Number(watch("durationMonths")) || 0;
      const totalMonths = years * 12 + months;
      setValue("totalDurationMonths", totalMonths, { shouldValidate: true });
    },
    [setValue, watch],
  );

const calculateEstimatedPayment = useCallback(() => {
    const formData = form.getValues();
    const loanAmount = Number(formData.amount);
    const interestYear = Number(formData.interestYear);
    const durationMonths = Number(formData.totalDurationMonths);
    const paymentFrequency = formData.paymentFrequency;

    if (loanAmount && interestYear && durationMonths && paymentFrequency) {
      const equivalentInterestRate = getEquivalentInterestRate(interestYear, paymentFrequency);
      const totalPayments = getTotalPayments(durationMonths, paymentFrequency);
      const paymentAmount = getPaymentAmount(loanAmount, equivalentInterestRate, totalPayments);
      
      setValue("estimatedPayment", Number(paymentAmount.toFixed(2)), { shouldValidate: true });
    }
  }, [form, setValue]);

  const handleSubmit = async (data) => {
    try {
      if (data.date) {
        data.date = new Date(data.date).toISOString();
      }
      if (data.email) {
        data.email = session.user.email;
      }
      await onSubmit(data);
      form.reset();
      toast({
        title: "Préstamo registrado",
        description: "El préstamo se ha registrado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al registrar el préstamo.",
        variant: "destructive",
      });
    }
  };

  return (
    <CardComponent
      title="Registro de Préstamo"
      description="Ingrese los detalles del préstamo que desea registrar."
      className="shadow-lg"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Sección de Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Básica</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="borrower"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prestatario</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del prestatario" {...field} />
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
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          calculateEstimatedPayment();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loanType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Préstamo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de préstamo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Hipotecario">Hipotecario</SelectItem>
                        <SelectItem value="Automotriz">Automotriz</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Sección de Interés y Duración */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Interés y Duración</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="interestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Interés</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de interés" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fijo">Fijo</SelectItem>
                        <SelectItem value="Variable">Variable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasa de interés anual (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingresar tasa de interés"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          const interestRate = Number(e.target.value) / 12;
                          setValue("interestRate", interestRate.toFixed(2));
                          calculateEstimatedPayment();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasa de interés mensual (%)</FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        type="number"
                        step="0.01"
                        placeholder="Calculado automáticamente"
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
                    <FormLabel>Plazo (años)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingresar plazo en años"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          updateDuration(
                            "durationYears",
                            Number(e.target.value),
                          );
                          calculateEstimatedPayment();
                        }}
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
                    <FormLabel>Meses adicionales</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingresar meses adicionales"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          updateDuration(
                            "durationMonths",
                            Number(e.target.value),
                          );
                          calculateEstimatedPayment();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Sección de Pagos y Fechas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pagos y Fechas</h3>
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(parseISO(field.value), "PPP", {
                                locale: es,
                              })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? parseISO(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={es}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la frecuencia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mensual">Mensual</SelectItem>
                        <SelectItem value="Trimestral">Trimestral</SelectItem>
                        <SelectItem value="Semestral">Semestral</SelectItem>
                        <SelectItem value="Anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="amortizationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Amortización</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Francés">Francés</SelectItem>
                        <SelectItem value="Alemán">Alemán</SelectItem>
                        <SelectItem value="Americano">Americano</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
          </div>

          {/* Sección de Costos Adicionales */}
          {/* <div className="space-y-4">
            <h3 className="text-lg font-medium">Costos Adicionales</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="openingCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costos de Apertura</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingresar costos de apertura"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seguro</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingresar costo del seguro"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div> */}

          {/* Campo de Pago Estimado */}
          {/* <FormField
            control={form.control}
            name="estimatedPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pago Estimado</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    readOnly
                    className="bg-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
 */}
          {/* Botones de acción */}
          <div className="flex flex-col gap-4 md:flex-row md:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                calculateEstimatedPayment();
                onSimulator(form.getValues());
              }}
            >
              Simular Préstamo
            </Button>
            <Button type="submit">Registrar Préstamo</Button>
          </div>
        </form>
      </Form>
    </CardComponent>
  );
}
