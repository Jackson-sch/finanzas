import React from "react";
import { CardComponent } from "../Prestamos/CardPayment";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import capitalize from "@/utils/capitalize";

export default function ListTransactions({
  transactions,
  deleteTransaction,
  setSelectedTransaction,
}) {
  return (
    <CardComponent
      title="Listado de transacciones"
      description="Listado de transacciones"
    >
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
            {transactions.map((transaction) => (
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
