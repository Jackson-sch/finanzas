import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash, WalletMinimal } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { CardComponent } from "@/components/CardComponent";
import InputSearch from "@/components/InputSearch";
import NoDataDisplay from "../NoDataDisplay/NoDataDisplay";
import PaginationBar from "../PaginationBar";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";
import { currencyFormatter } from "@/utils/CurrencyFormatter";
import { formatLocalDate } from "@/utils/formatDate";
import capitalize from "@/utils/capitalize";

const LOANS_PER_PAGE = 5;

export default function LoanList({ loans, deleteLoan }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedLoans = useMemo(() => {
    return loans
      .filter((loan) => {
        const simulatorData = calculateSimulatorData(loan);
        const searchLower = search.toLowerCase();
        return (
          simulatorData.borrower.toLowerCase().includes(searchLower) ||
          loan.borrower.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        const aData = calculateSimulatorData(a);
        const bData = calculateSimulatorData(b);
        switch (sortBy) {
          case "date":
            return new Date(b.date) - new Date(a.date);
          case "amount":
            return bData.loanAmount - aData.loanAmount;
          case "borrower":
            return aData.borrower.localeCompare(bData.borrower);
          default:
            return 0;
        }
      });
  }, [loans, search, sortBy]);

  const { paginatedLoans, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * LOANS_PER_PAGE;
    const paginatedLoans = filteredAndSortedLoans.slice(startIndex, startIndex + LOANS_PER_PAGE);
    const totalPages = Math.ceil(filteredAndSortedLoans.length / LOANS_PER_PAGE);
    return { paginatedLoans, totalPages };
  }, [filteredAndSortedLoans, currentPage]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const renderTableBody = () => {
    if (filteredAndSortedLoans.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            <NoDataDisplay
              icon={WalletMinimal}
              title="No hay prestatarios registrados"
              description="No se han registrado prestatarios en el sistema"
            />
          </TableCell>
        </TableRow>
      );
    }

    return paginatedLoans.map((loan) => {
      const loanData = calculateSimulatorData(loan);
      return (
        <TableRow key={loan._id}>
          <TableCell>{formatLocalDate(loan.date)}</TableCell>
          <TableCell>{capitalize(loanData.borrower)}</TableCell>
          <TableCell className="text-center">{loanData.totalPayments}</TableCell>
          <TableCell className="text-right">
            {currencyFormatter.format(loanData.loanAmount)}
          </TableCell>
          <TableCell className="text-right">
            {currencyFormatter.format(loanData.paymentAmount)}
          </TableCell>
          <TableCell className="text-right font-bold">
            {currencyFormatter.format(loanData.totalAmount)}
          </TableCell>
          <TableCell className="text-right">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              onClick={() => deleteLoan(loan._id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <CardComponent
      title="Lista de prestatarios"
      description="Ver la lista de prestatarios registrados."
      className="w-full shadow-lg"
    >
      <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
        <div className="max-w-sm flex-1">
          <InputSearch
            setSearchTerm={handleSearchChange}
            searchTerm={search}
            placeholder="Buscar por prestatario"
          />
        </div>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Fecha</SelectItem>
            <SelectItem value="amount">Monto</SelectItem>
            <SelectItem value="borrower">Prestatario</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[400px] w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Prestatario</TableHead>
              <TableHead>N° de cuotas</TableHead>
              <TableHead className="text-right">Monto Inicial</TableHead>
              <TableHead className="text-right">Pago mensual</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
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
        visibleItems={paginatedLoans.length}
        totalItems={filteredAndSortedLoans.length}
      />
    </CardComponent>
  );
}