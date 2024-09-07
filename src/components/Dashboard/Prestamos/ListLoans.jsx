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
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";
import { CardComponent } from "@/components/CardComponent";
import { currencyFormatter } from "@/utils/CurrencyFormatter";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { formatLocalDate } from "@/utils/formatDate";
import InputSearch from "@/components/InputSearch";

export default function Component({ loans, deleteLoan }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 5;

  const filteredAndSortedLoans = useMemo(() => {
    return loans
      .filter((loan) => {
        const simulatorData = calculateSimulatorData(loan);
        return (
          simulatorData.borrower.toLowerCase().includes(search.toLowerCase()) ||
          loan.borrower.toLowerCase().includes(search.toLowerCase()) // Filtro por el campo adicional borrower
        );
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(b.date) - new Date(a.date);
        } else if (sortBy === "amount") {
          return (
            calculateSimulatorData(b).loanAmount -
            calculateSimulatorData(a).loanAmount
          );
        } else if (sortBy === "borrower") {
          // Ordenar por borrower si se selecciona
          return a.borrower.localeCompare(b.borrower);
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
        <div className="max-w-sm flex-1">
          <InputSearch
            setSearchTerm={setSearch}
            searchTerm={search}
            placeholder="Buscar por prestatario"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Fecha</SelectItem>
            <SelectItem value="amount">Monto</SelectItem>
            <SelectItem value="borrower">Prestatario</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Prestatario</TableHead>
            <TableHead className="text-right">Monto Inicial</TableHead>
            <TableHead className="text-right">Pago mensual</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedLoans.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center capitalize text-xl">
                No hay prestatarios registrados
              </TableCell>
            </TableRow>
          )}
          {paginatedLoans.map((loan) => {
            const loanData = calculateSimulatorData(loan);
            return (
              <TableRow key={loan._id}>
                <TableCell>{formatLocalDate(loan.date)}</TableCell>
                <TableCell>{capitalize(loanData.borrower)}</TableCell>
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
