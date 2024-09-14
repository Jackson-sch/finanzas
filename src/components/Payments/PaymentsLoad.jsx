import { useEffect, useState } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, PlusCircleIcon, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDaysIcon } from "lucide-react";
import { paymentSchema } from "@/lib/validaciones/payment/payment";
import capitalize from "@/utils/capitalize";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";
import { useToast } from "@/components/ui/use-toast";
import { currencyFormatter } from "@/utils/CurrencyFormatter";
import NoDataDisplay from "../NoDataDisplay/NoDataDisplay";

export default function PaymentsLoad({ loans, handleSubmitPayment, payments }) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      loanId: "",
      amount: "",
      date: "",
      paymentNumber: "",
    },
  });

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filteredLoans, setFilteredLoans] = useState([]);

  const handleLoanChange = (loanId) => {
    const loan = loans.find((loan) => loan._id === loanId);
    setSelectedLoan(loan);

    if (loan) {
      const loanData = calculateSimulatorData(loan);
      form.setValue("amount", loanData.paymentAmount);

      // Calcular el siguiente número de cuota automáticamente
      const nextPaymentNumber = getNextPaymentNumber(loanId);
      form.setValue("paymentNumber", nextPaymentNumber);
    }
  };

  const getNextPaymentNumber = (loanId) => {
    const existingPayments = payments.filter(
      (payment) => payment.loanId === loanId,
    );
    return existingPayments.length + 1; // Siguiente número de cuota es el total de pagos + 1
  };

  const validatePaymentNumber = (paymentNumber) => {
    if (selectedLoan) {
      const existingPayment = payments.find(
        (payment) =>
          payment.loanId === selectedLoan._id &&
          payment.paymentNumber === parseInt(paymentNumber, 10),
      );

      if (existingPayment) {
        toast({
          title: "Número de pago duplicado",
          description: "El número de pago ya ha sido registrado",
          status: "error",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (data) => {
    if (validatePaymentNumber(data.paymentNumber)) {
      if (data.date) {
        data.date = new Date(data.date).toISOString();
      }
      handleSubmitPayment(data);
      form.reset();
      setSelectedLoan(null);
    }
  };

  useEffect(() => {
    const loansWithPendingBalance = loans.filter((loan) => {
      const loanData = calculateSimulatorData(loan);
      const remainingAmount = parseFloat(loanData.remainingAmount);

      // Obtener el número de pagos realizados
      const paymentsMade = payments.filter(
        (payment) => payment.loanId === loan._id,
      ).length;

      // Filtrar préstamos con saldo pendiente mayor a 0 y pagos incompletos
      return (
        remainingAmount > 0 && paymentsMade < loanData.totalPayments // Suponiendo que loanData.totalPayments es el número total de cuotas del préstamo
      );
    });

    setFilteredLoans(loansWithPendingBalance);
  }, [loans, payments]); // Agregamos 'payments' como dependencia para actualizar la lista si cambian los pagos.

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos de préstamos</CardTitle>
        <CardDescription>
          Registre los pagos de su préstamo y rastree el saldo restante.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="loanId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Prestatario</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleLoanChange(value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full text-xs">
                            <SelectValue placeholder="Seleccione un prestatario" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className="h-[300px] pr-4">
                            {filteredLoans.length > 0 ? (
                              filteredLoans.map((loan) => {
                                const loanData = calculateSimulatorData(loan);
                                return (
                                  <SelectItem
                                    key={loan._id}
                                    value={loan._id}
                                    className="flex flex-col space-y-1 border-b border-gray-100 py-2 last:border-none"
                                  >
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3 text-gray-500" />
                                      <span className="font-medium">
                                        {capitalize(loan.borrower)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <Badge
                                        variant="outline"
                                        className="font-normal"
                                      >
                                        <CreditCard className="mr-1 h-3 w-3" />
                                        {currencyFormatter.format(loan.amount)}
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="font-normal"
                                      >
                                        Cuota:{" "}
                                        {currencyFormatter.format(
                                          loanData.paymentAmount,
                                        )}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="text-xs font-normal"
                                      >
                                        N° cuotas: {loanData.totalPayments}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                );
                              })
                            ) : (
                              <div className="py-2 text-center text-muted-foreground">
                                <NoDataDisplay
                                  icon={Users}
                                  title="No hay datos disponibles"
                                  description="No hay prestatarios para mostrar en este momento."
                                />
                              </div>
                            )}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto del pago</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Ingresar monto del pago"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="paymentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de pago</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Número de cuota"
                          {...field}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
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
                            className={`w-full pl-1 text-left font-normal ${
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
                            disabled={
                              (date) => date > new Date() // Desactivar fechas futuras
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="mt-4 w-full">
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Registrar pago
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
