import React from "react";
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

import { CardComponent } from "../Prestamos/CardPayment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { tagSchema } from "@/lib/validaciones/tags/tags";

export default function Tags({ tags, addTag, deleteTag }) {
  console.log("🚀 ~ Tags ~ tags:", tags)
  const form = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = async (data) => {
    await addTag(data);
    form.reset();
  };

  return (
    <CardComponent
      title="Etiquetas"
      description="Administre las etiquetas de sus transacciones"
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
                    <FormLabel>Etiqueta</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nueva etiqueta" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">
              <Tag className="mr-2 h-4 w-4" /> Agregar
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag._id} variant="outline" className="px-3 py-1 text-sm">
            {tag.name}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 h-auto p-0 text-xs"
              onClick={() => deleteTag(tag._id)}
            >
              ×
            </Button>
          </Badge>
        ))}
      </div>
    </CardComponent>
  );
}
