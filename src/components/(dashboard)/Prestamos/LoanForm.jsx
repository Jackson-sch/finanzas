/* El código anterior es un componente funcional React llamado `RegisterForm` que representa un formulario para
registrar un préstamo.Aquí hay un desglose de lo que está haciendo el código: */
import { useEffect } from "react";
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
import { CalendarDaysIcon } from "lucide-react";
import { CardComponent } from "@/components/CardComponent"; 
import { loanSchema } from "@/lib/validaciones/loan/loan";
import { toast } from "@/components/ui/use-toast";

export default function RegisterForm({ onSubmit, onSimulator, session }) {
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
      email: session?.user?.email || "",
    },
  });

  const { watch, setValue } = form;
  const interestYear = watch("interestYear");
  const durationYear = watch("durationYears");
  const durationMonth = watch("durationMonths");

  const handleSubmit = async (data) => {
    try {
      // Asegurarse de que la fecha esté en formato ISO
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

  useEffect(() => {
    if (interestYear) {
      const interestRate = interestYear / 12;
      setValue("interestRate", interestRate.toFixed(2));
    }
  }, [interestYear, setValue]);

  useEffect(() => {
    if (durationYear || durationMonth) {
      const yearValue = Number(durationYear) || 0;
      const monthValue = Number(durationMonth) || 0;

      const newDurationMonths = yearValue * 12 + monthValue;
      if (newDurationMonths !== durationMonth) {
        setValue("durationMonths", newDurationMonths);
      }
    }
  }, [durationYear, setValue]);

  return (
    <CardComponent
      title="Registro de Préstamo"
      description="Ingrese los detalles del préstamo que desea registrar."
      className="shadow-lg"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid items-start gap-6"
        >
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
                      value={Number(field.value)}
                      {...field}
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
                      placeholder="Calculado automáticamente"
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
              name="durationYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plazo (años)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ingresar plazo en años"
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
                  <FormLabel>Plazo total (meses)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Calculado automáticamente"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-end">
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
                            <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
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
            </div>
            <div>
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
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSimulator(form.getValues())}
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
