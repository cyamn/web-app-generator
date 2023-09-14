import l from "./layout.module.css";

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
    <div className="h-screen max-h-screen overflow-auto bg-slate-100">
      <div className={l.container}>
        {header !== undefined && <div className={l.header}>{header}</div>}
        <div className={l.main}>
          {sidebarLeft !== undefined && (
            <div className={l.sidebar}>{sidebarLeft}</div>
          )}
          <div className={l.content}>{content}</div>
          {sidebarRight !== undefined && (
            <div className={l.sidebar}>{sidebarRight}</div>
          )}
        </div>
        {footer !== undefined && <div className={l.footer}>{footer}</div>}
      </div>
    </div>
  );
};