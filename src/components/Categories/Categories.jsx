import React, { useEffect, useState } from "react";
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

import { CardComponent } from "../CardComponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categorySchema } from "@/lib/validaciones/category/category";

export default function Categories({
  categories,
  addCategory,
  deleteCategory,
  session,
}) {
  const [combinedCategories, setCombinedCategories] = useState([]);

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      email: session?.user?.email || "",
      isUserAdded: false,
    },
  });

  useEffect(() => {
    // Combina las categorías predeterminadas con las del usuario
    const defaultCategories = categories.filter(
      (category) => !category.isUserAdded,
    );
    const userCategories = categories.filter(
      (category) =>
        category.isUserAdded && category.email === session?.user?.email,
    );

    setCombinedCategories([...defaultCategories, ...userCategories]);
  }, [categories, session]);

  const handleSubmit = async (data) => {
    // marcar las categorías como agregadas por el usuario
    data.email = session?.user?.email;
    data.isUserAdded = true;
    await addCategory(data);
    form.reset();
  };

  return (
    <CardComponent
      title="Categorías"
      description="Administre las categorías de sus transacciones"
    >
      <div className="mb-4 flex gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex w-full gap-4 space-y-8"
          >
            <div className="grid w-full gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nueva categoría" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex flex-wrap gap-2">
        {combinedCategories.map((category) => (
          <Badge
            key={category._id}
            variant="secondary"
            className="px-3 py-1 text-sm"
          >
            {category.name}
            {category.isUserAdded &&
              category.email === session?.user?.email && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-xs"
                  onClick={() => deleteCategory(category._id)}
                >
                  ×
                </Button>
              )}
          </Badge>
        ))}
      </div>
    </CardComponent>
  );
}
