interface LayoutProperties {
  header?: React.ReactNode;
  sidebarLeft?: React.ReactNode;
  sidebarRight?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

export const Layout: React.FC<LayoutProperties> = ({
  header,
  sidebarLeft,
  sidebarRight,
  content,
  footer,
}) => {
  return (
    <div className="flex h-full flex-row overflow-auto bg-slate-50">
      {sidebarLeft !== undefined && <div>{sidebarLeft}</div>}
      <div className="h-full w-full overflow-auto">{content}</div>
      {sidebarRight !== undefined && (
        <div className="border-l border-slate-300">{sidebarRight}</div>
      )}
    </div>
  );
};
