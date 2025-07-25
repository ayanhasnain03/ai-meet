import React, {
  memo,
  ReactNode,
  useState,
  useMemo,
  useCallback,
} from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";

interface Option {
  id: string;
  value: string;
  children: ReactNode;
}

interface Props {
  options: Option[];
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

const CommandSelectComponent = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  isSearchable = false,
  className,
}: Props) => {
  const [open, setOpen] = useState(false);

  // find the selected option only when options/value change
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  // stable handler to close + notify
  const handleSelect = useCallback(
    (val: string) => {
      onSelect(val);
      setOpen(false);
    },
    [onSelect]
  );

  // render list items only when options change
  const itemList = useMemo(
    () =>
      options.map((opt) => (
        <CommandItem key={opt.id} onSelect={() => handleSelect(opt.value)}>
          {opt.children}
        </CommandItem>
      )),
    [options, handleSelect]
  );

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "h-9 justify-between font-normal px-2",
          !selectedOption && "text-muted-foreground",
          className
        )}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        <ChevronsUpDownIcon className="ml-2" />
      </Button>

      <CommandResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={!onSearch}
      >
        {/* show search input only if there's a handler */}
        {(isSearchable || onSearch) && (
          <CommandInput placeholder="Search..." onValueChange={onSearch} />
        )}

        <CommandList>
          {options.length === 0 ? (
            <CommandEmpty>
              <span className="text-muted-foreground text-sm">
                No options available.
              </span>
            </CommandEmpty>
          ) : (
            itemList
          )}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};

export const CommandSelect = memo(CommandSelectComponent);
