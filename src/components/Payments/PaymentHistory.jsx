import React, { useState, useMemo, useCallback } from "react";
import { CardComponent } from "@/components/CardComponent";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { currencyFormatter } from "@/utils/CurrencyFormatter";
import { formatLocalDate } from "@/utils/formatDate";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";
import { History, TrashIcon, CalendarIcon } from "lucide-react";
import NoDataDisplay from "../NoDataDisplay/NoDataDisplay";
import PaginationBar from "../PaginationBar";
import InputSearch from "@/components/InputSearch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const PAYMENTS_PER_PAGE = 10;

export default function PaymentHistory({ payments, loans, deletePayment }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");


  const filteredAndSortedPayments = useMemo(() => {
    return payments
      .filter((payment) => {
        const loan = loans.find((loan) => loan._id === payment.loanId);
        if (!loan) return false;
        const loanData = calculateSimulatorData(loan, payment.paymentNumber);

        // Aplicar filtro de búsqueda
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          loanData.borrower.toLowerCase().includes(searchLower) ||
          payment.paymentNumber.toString().includes(searchLower);

        // Aplicar filtro de fecha
        const paymentDate = new Date(loan.date);
        const isInDateRange =
          (!dateRange.from || paymentDate >= dateRange.from) &&
          (!dateRange.to || paymentDate <= dateRange.to);

        // Aplicar filtro de estado de pago
        const isCompleted = payment.paymentNumber >= loanData.totalPayments;
        const matchesStatus =
          paymentStatus === "all" ||
          (paymentStatus === "completed" && isCompleted) ||
          (paymentStatus === "ongoing" && !isCompleted);

        return matchesSearch && isInDateRange && matchesStatus;
      })
      .sort((a, b) => {
        const loanA = loans.find((loan) => loan._id === a.loanId);
        const loanB = loans.find((loan) => loan._id === b.loanId);
        if (!loanA || !loanB) return 0;

        switch (sortBy) {
          case "date":
            return new Date(loanB.date) - new Date(loanA.date);
          case "amount":
            return (
              calculateSimulatorData(loanB).loanAmount -
              calculateSimulatorData(loanA).loanAmount
            );
          case "borrower":
            return calculateSimulatorData(loanA).borrower.localeCompare(
              calculateSimulatorData(loanB).borrower,
            );
          default:
            return 0;
        }
      });
  }, [payments, loans, searchTerm, dateRange, paymentStatus, sortBy]);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * PAYMENTS_PER_PAGE;
    return filteredAndSortedPayments.slice(
      startIndex,
      startIndex + PAYMENTS_PER_PAGE,
    );
  }, [filteredAndSortedPayments, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedPayments.length / PAYMENTS_PER_PAGE,
  );

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range);
    setCurrentPage(1);
  }, []);

  const handlePaymentStatusChange = useCallback((value) => {
    setPaymentStatus(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
    setCurrentPage(1);
  }, []);

  const renderTableBody = () => {
    if (filteredAndSortedPayments.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={9}
            className="text-center text-lg text-muted-foreground"
          >
            <NoDataDisplay
              icon={History}
              title="No hay pagos"
              description="No hay pagos para mostrar en este momento."
            />
          </TableCell>
        </TableRow>
      );
    }

    return paginatedPayments.map((payment) => {
      const loan = loans.find((loan) => loan._id === payment.loanId);
      if (!loan) return null;

      const loanData = calculateSimulatorData(loan, payment.paymentNumber);
      const progress =
        loanData.totalPayments > 0
          ? ((payment.paymentNumber / loanData.totalPayments) * 100).toFixed(2)
          : 100;

      return (
        <TableRow key={payment._id}>
          <TableCell>{formatLocalDate(loan.date)}</TableCell>
          <TableCell>{loanData.borrower}</TableCell>
          <TableCell className="text-center">{payment.paymentNumber}</TableCell>
          <TableCell>{currencyFormatter.format(loanData.loanAmount)}</TableCell>
          <TableCell>
            {currencyFormatter.format(loanData.paymentAmount)}
          </TableCell>
          <TableCell>
            {currencyFormatter.format(loanData.remainingAmount)}
          </TableCell>
          <TableCell>
            {currencyFormatter.format(loanData.totalAmount)}
          </TableCell>
          <TableCell>
            <div className="relative w-full">
              <Progress value={progress} max={100} />
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                {progress}%
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deletePayment(payment._id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <CardComponent
      title="Historial de pago"
      description="Ver el historial de los pagos de su préstamo."
      className="shadow-lg"
    >
      <div className="mb-6 grid gap-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="max-w-sm flex-1">
            <InputSearch
              setSearchTerm={handleSearchChange}
              searchTerm={searchTerm}
              placeholder="Buscar por prestatario o número de cuota"
            />
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Select
              value={paymentStatus}
              onValueChange={handlePaymentStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado del pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
                <SelectItem value="ongoing">En curso</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Fecha</SelectItem>
                <SelectItem value="amount">Monto</SelectItem>
                <SelectItem value="borrower">Prestatario</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                        {format(dateRange.to, "LLL dd, y", { locale: es })}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y", { locale: es })
                    )
                  ) : (
                    <span>Selecciona un rango de fechas</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Prestatario</TableHead>
              <TableHead>N° de cuota</TableHead>
              <TableHead>Monto Inicial</TableHead>
              <TableHead>Pago mensual</TableHead>
              <TableHead>Restante</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Progreso</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        visibleItems={paginatedPayments.length}
        totalItems={filteredAndSortedPayments.length}
      />
    </CardComponent>
  );
}
