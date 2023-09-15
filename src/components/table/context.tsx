import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64 bg-white">
        <ContextMenuItem className="cursor-pointer">Delete</ContextMenuItem>
        <ContextMenuItem className="cursor-pointer">Duplicate</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
