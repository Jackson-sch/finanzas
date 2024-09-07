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

import { CardComponent } from "../../CardComponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { tagSchema } from "@/lib/validaciones/tags/tags";

export default function Tags({ tags, addTag, deleteTag, session }) {
  const [combinedTags, setCombinedTags] = useState([]);

  const form = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      email: session?.user?.email || "",
      isUserAdded: false,
    },
  });

  useEffect(() => {
    // Combina las etiquetas predeterminadas con las del usuario
    const defaultTags = tags.filter((tag) => !tag.isUserAdded);
    const userTags = tags.filter(
      (tag) => tag.isUserAdded && tag.email === session?.user?.email
    );

    setCombinedTags([...defaultTags, ...userTags]);
  }, [tags, session]);

  const handleSubmit = async (data) => {
    // marcar las etiquetas como agregadas por el usuario
    data.email = session?.user?.email;
    data.isUserAdded = true;
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
        {combinedTags.map((tag) => (
          <Badge key={tag._id} variant="outline" className="px-3 py-1 text-sm">
            {tag.name}
            {tag.isUserAdded && tag.email === session?.user?.email && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 text-xs"
                onClick={() => deleteTag(tag._id)}
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
