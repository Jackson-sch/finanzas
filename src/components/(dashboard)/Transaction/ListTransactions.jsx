"use client";

import React, { useState, useEffect } from "react";
import { addDays, format, isWithinInterval } from "date-fns";
import { CardComponent } from "../../CardComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Edit, Trash2, Search, Calendar as CalendarIcon } from "lucide-react";
import capitalize from "@/utils/capitalize";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InputSearch from "@/components/InputSearch";

export default function ListTransactions({
  transactions,
  deleteTransaction,
  setSelectedTransaction,
}) {
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    let result = transactions;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (transaction) =>
          transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.category
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
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
        }),
      );
    }

    setFilteredTransactions(result);
  }, [transactions, searchTerm, typeFilter, date]);

  return (
    <CardComponent
      title="Listado de transacciones"
      description="Listado de transacciones"
    >
      <div className="mb-6 grid gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="max-w-sm flex-1">
            <InputSearch
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              placeholder="Buscar por descripción, categoría o etiqueta"
            />
          </div>
          <div className="flex items-center gap-4">
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
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
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
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>
                  {transaction.date
                    ? format(new Date(transaction.date), "dd/MM/yyyy")
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
                  S/ {transaction.amount.toFixed(2)}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTransaction(transaction._id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </CardComponent>
  );
}
