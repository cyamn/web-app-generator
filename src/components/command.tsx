"use client";

import { File, Table } from "lucide-react";
import Link from "next/link";
import React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { api } from "@/utils/api";

type QuickmenuProperties = {
  project: string;
};

export const Quickmenu: React.FC<QuickmenuProperties> = ({ project }) => {
  const [open, setOpen] = React.useState(false);

  function close() {
    setOpen(false);
  }

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);
  if (!open) return null;
  return (
    <div className="absolute z-20 flex h-full w-full items-center justify-center bg-black/10 backdrop-blur-sm">
      <Command className="h-1/2 w-1/2 rounded-lg border bg-white shadow-md">
        <CommandInput placeholder="Search files by name..." autoFocus={true} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <QuickPages project={project} close={close} />
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Tables">
            <QuickTables project={project} close={close} />
          </CommandGroup>
          <CommandGroup heading="Api">
            <CommandItem>
              <File className="mr-2 h-4 w-4" />
              <Link
                className="w-full"
                href={`/${project}/api`}
                onClick={() => {
                  close();
                }}
              >
                <span>Api spec</span>
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

type QuickSubProperties = {
  project: string;
  close: () => void;
};

const QuickPages: React.FC<QuickSubProperties> = ({ project, close }) => {
  const {
    data: pages,
    isLoading,
    isError,
  } = api.pages.list.useQuery({
    project,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <>
      {pages.map((page, index) => (
        <CommandItem key={index}>
          <File className="mr-2 h-4 w-4" />
          <Link
            className="w-full"
            href={`/${project}/page/${page.path}/preview`}
            onClick={() => {
              close();
            }}
          >
            <span>{page.path}</span>
          </Link>
        </CommandItem>
      ))}
    </>
  );
};

const QuickTables: React.FC<QuickSubProperties> = ({ project, close }) => {
  const {
    data: tables,
    isLoading,
    isError,
  } = api.tables.list.useQuery({
    project,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <>
      {tables.map((table, index) => (
        <CommandItem key={index}>
          <Table className="mr-2 h-4 w-4" />
          <Link
            className="w-full"
            href={`/${project}/table/${table.name}`}
            onClick={() => {
              close();
            }}
          >
            <span>{table.name}</span>
          </Link>
        </CommandItem>
      ))}
    </>
  );
};
