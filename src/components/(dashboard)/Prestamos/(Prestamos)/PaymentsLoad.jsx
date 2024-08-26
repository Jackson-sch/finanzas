import { useState } from "react";
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

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDaysIcon } from "lucide-react";
import { paymentSchema } from "@/lib/validaciones/loan/loan";
import capitalize from "@/utils/capitalize";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";
import { useToast } from "@/components/ui/use-toast";

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

  const [fechaPago, setFechaPago] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleLoanChange = (loanId) => {
    const loan = loans.find((loan) => loan._id === loanId);
    setSelectedLoan(loan);

    // Actualizar el campo amount con el monto de la cuota mensual del préstamo seleccionado
    if (loan) {
      const loanData = calculateSimulatorData(loan);
      form.setValue("amount", loanData.paymentAmount);
    }
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
      handleSubmitPayment(data);
      form.reset();
      setFechaPago(null);
      setSelectedLoan(null);
    }
  };

  //Filtrar los prestamos que aun tienen saldo pendiente
  const filteredLoans = loans.filter((loan) => {
    const loanData = calculateSimulatorData(loan);
    return parseFloat(loanData.remainingAmount) > 0;
  });

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
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="loanId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prestatario</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleLoanChange(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un prestatario">
                              {capitalize(
                                filteredLoans.find(
                                  (loan) => loan._id === field.value,
                                )?.borrower || "Selecciona una opción",
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {filteredLoans.map((loan) => {
                              const loanData = calculateSimulatorData(loan);
                              return (
                                <SelectItem
                                  key={loan._id}
                                  value={loan._id}
                                  className="capitalize"
                                >
                                  <div>
                                    <h4 className="font-semibold">
                                      {loan.borrower}
                                    </h4>
                                    <div className="flex justify-between gap-2 text-xs">
                                      <p>
                                        Monto: <strong>{loan.amount}</strong>
                                      </p>
                                      <p>
                                        Cuota mensual:{" "}
                                        <strong>
                                          {loanData.paymentAmount}
                                        </strong>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
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
                          }} // Convertir a número
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
                          }} // Convertir a número
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
                      <FormLabel>Fecha de inicio</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start font-normal"
                          >
                            <CalendarDaysIcon className="mr-2 h-4 w-4" />
                            <span id="date-display">
                              {fechaPago
                                ? fechaPago.toLocaleDateString()
                                : "Selecciona la fecha"}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={fechaPago}
                            onSelect={(date) => {
                              if (date) {
                                const dateString = date
                                  .toISOString()
                                  .split("T")[0];
                                setFechaPago(date);
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
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="submit">Pago de préstamo</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
