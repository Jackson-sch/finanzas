"use client";

import React, { useState, useEffect, useMemo } from "react";
import { format, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { CardComponent } from "../CardComponent";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar as CalendarIcon, BoxIcon } from "lucide-react";
import capitalize from "@/utils/capitalize";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InputSearch from "@/components/InputSearch";
import { formatLocalDate } from "@/utils/formatDate";
import { currencyFormatter } from "@/utils/CurrencyFormatter";
import NoDataDisplay from "../NoDataDisplay/NoDataDisplay";
import PaginationBar from "../PaginationBar";

export default function ListTransactions({ transactions, deleteTransaction }) {
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  useEffect(() => {
    let result = transactions;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Date filter
    if (date?.from && date?.to) {
      result = result.filter((transaction) =>
        isWithinInterval(new Date(transaction.date), {
          start: date.from,
          end: date.to,
        })
      );
    }

    setFilteredTransactions(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, searchTerm, typeFilter, date]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <CardComponent
      title="Listado de transacciones"
      description="Listado de transacciones"
      className="shadow-lg"
    >
      <div className="mb-6 grid gap-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="max-w-sm flex-1">
            <InputSearch
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              placeholder="Buscar por descripción, categoría o etiqueta"
            />
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ingreso">Ingreso</SelectItem>
                <SelectItem value="egreso">Egreso</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                          {format(date.to, "LLL dd, y", { locale: es })}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y", { locale: es })
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
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Etiquetas</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-xl">
                  <NoDataDisplay 
                    icon={BoxIcon} 
                    title="No hay datos disponibles"
                    description="No hay transacciones para mostrar en este momento."
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>
                    {transaction.date
                      ? formatLocalDate(transaction.date)
                      : "Fecha no disponible"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "ingreso" ? "success" : "destructive"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {currencyFormatter.format(transaction.amount)}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {transaction.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{capitalize(transaction.description)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTransaction(transaction._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <PaginationBar 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        visibleItems={paginatedTransactions.length}
        totalItems={filteredTransactions.length}
      />
    </CardComponent>
  );
}