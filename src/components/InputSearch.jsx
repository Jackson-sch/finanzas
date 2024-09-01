import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const InputSearch = forwardRef(
  (
    {
      searchTerm,
      setSearchTerm,
      placeholder = "Search...",
      icon: Icon = Search,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative ml-auto flex-1 md:grow-0">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          ref={ref}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className={cn("w-full bg-background pl-8 pr-8", className)}
          {...props}
        />
        {searchTerm && (
          <Button
            variant="ghost" size="icon"
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);

InputSearch.displayName = "InputSearch";

export default InputSearch;