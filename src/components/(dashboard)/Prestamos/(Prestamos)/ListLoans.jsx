import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import capitalize from "@/utils/capitalize";
import { formatDate } from "@/utils/formattedDate";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";
import { CardComponent } from "@/components/CardComponent";
import { currencyFormatter } from "@/components/CurrencyFormatter";

export default function Component({ loans }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 5;

  const filteredAndSortedLoans = useMemo(() => {
    return loans
      .filter((loan) =>
        calculateSimulatorData(loan)
          .borrower.toLowerCase()
          .includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(b.date) - new Date(a.date);
        } else if (sortBy === "amount") {
          return (
            calculateSimulatorData(b).loanAmount -
            calculateSimulatorData(a).loanAmount
          );
        }
        return 0;
      });
  }, [loans, search, sortBy]);

  const paginatedLoans = useMemo(() => {
    const startIndex = (currentPage - 1) * loansPerPage;
    return filteredAndSortedLoans.slice(startIndex, startIndex + loansPerPage);
  }, [filteredAndSortedLoans, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedLoans.length / loansPerPage);

  const generatePaginationItems = () => {
    let items = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }
    return items;
  };

  return (
    <CardComponent
      title="Lista de prestatarios"
      description="Ver la lista de prestatarios registrados."
      className="w-full shadow-lg"
    >
      <div className="mb-4 flex justify-between">
        <Input
          placeholder="Buscar por prestatario"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Fecha</SelectItem>
            <SelectItem value="amount">Monto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Prestatario</TableHead>
            <TableHead>Monto Inicial</TableHead>
            <TableHead>Pago mensual</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLoans.map((loan, index) => {
            const loanData = calculateSimulatorData(loan);
            return (
              <TableRow key={index}>
                <TableCell>{formatDate(loan.date)}</TableCell>
                <TableCell>{capitalize(loanData.borrower)}</TableCell>
                <TableCell>{currencyFormatter.format(loanData.loanAmount)}</TableCell>
                <TableCell>{currencyFormatter.format(loanData.paymentAmount)}</TableCell>
                <TableCell className="font-bold">
                  {currencyFormatter.format(loanData.totalAmount)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-between">
        <div className="max-w-sm text-sm">
          Mostrando {paginatedLoans.length} de {filteredAndSortedLoans.length}{" "}
          préstamos
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
              />
            </PaginationItem>
            {generatePaginationItems()}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </CardComponent>
  );
}
