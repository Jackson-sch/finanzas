
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { CardComponent } from "../../CardComponent";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { transactionSchema } from "@/lib/validaciones/transaction/transaction";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default  function TransactionForm({
  categories,
  tags,
  addTransaction,
  updateTransaction,
  transaction,
  session,
}) {

  const isEditing = !!transaction; // Verifica si se está editando una transacción

  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction?.type || "",
      amount: transaction?.amount || "",
      category: transaction?.category || "",
      tags: transaction?.tags || [],
      description: transaction?.description || "",
      date: transaction?.date
        ? new Date(transaction.date).toISOString()
        : new Date().toISOString(),
      email: session?.user?.email || "",
    },
  });

  const handleSubmitForm = async (data) => {
    data.amount = parseFloat(data.amount); // Asegúrate de que el monto sea un número
    data.date = new Date(data.date).toISOString(); // Asegúrate de que la fecha esté en formato ISO
    data.email = session.user.email; // Agrega el ID del usuario a la transacción

    if (isEditing) {
      await updateTransaction(transaction._id, data);
    } else {
      await addTransaction(data);
    }
    form.reset();
  };


  return (
    <CardComponent
      title={isEditing ? "Editar transacción" : "Registrar nueva transacción"}
      description={
        isEditing
          ? "Modifica los detalles de la transacción"
          : "Ingrese los detalles de la nueva transacción"
      }
      className="shadow-lg"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="space-y-8"
        >
          <div className="grid gap-6">
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ingreso">Ingreso</SelectItem>
                        <SelectItem value="egreso">Egreso</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="Ingrese el monto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
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
                            date > new Date() || date < new Date("2024-01-01")
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-[300px] pr-4">
                          {categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiquetas</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (!field.value.includes(value)) {
                          field.onChange([...field.value, value]);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar etiquetas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-[200px]">
                          {tags.map((tag) => (
                            <SelectItem key={tag._id} value={tag.name}>
                              {tag.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.value?.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0 text-xs"
                            onClick={() =>
                              field.onChange(
                                field.value.filter((t) => t !== tag),
                              )
                            }
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ingrese una descripción" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />{" "}
            {isEditing ? "Guardar Cambios" : "Agregar Transacción"}
          </Button>
        </form>
      </Form>
    </CardComponent>
  );
}
