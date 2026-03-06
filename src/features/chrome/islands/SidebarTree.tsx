import { navigate } from "astro:transitions/client";
import { useEffect, useMemo, useState } from "preact/hooks";

export interface SidebarItem {
  id: string;
  label: string;
  href?: string;
  isExternal?: boolean;
  children?: SidebarItem[];
}

interface Props {
  title: string;
  items: SidebarItem[];
  closeLabel: string;
}

function normalizeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
}

function shouldBypassClientNavigation(event: MouseEvent): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export default function SidebarTree({ title, items, closeLabel }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const folderIds = useMemo(() => {
    const list: string[] = [];

    const walk = (nodeList: SidebarItem[]) => {
      nodeList.forEach((item) => {
        if (item.children?.length) {
          list.push(normalizeId(item.id));
          walk(item.children);
        }
      });
    };

    walk(items);
    return list;
  }, [items]);

  useEffect(() => {
    const onToggle = () => {
      setIsOpen((previous) => !previous);
    };

    window.addEventListener("sidebar:toggle", onToggle);
    return () => window.removeEventListener("sidebar:toggle", onToggle);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  useEffect(() => {
    setExpanded((previous) => {
      const next: Record<string, boolean> = {};
      folderIds.forEach((folderId) => {
        next[folderId] = previous[folderId] ?? false;
      });
      return next;
    });
  }, [folderIds]);

  const closeSidebar = () => setIsOpen(false);

  const handleItemClick = async (
    event: MouseEvent,
    item: SidebarItem,
  ) => {
    if (!item.href || item.isExternal || !item.href.startsWith("/")) {
      closeSidebar();
      return;
    }

    if (shouldBypassClientNavigation(event)) {
      return;
    }

    event.preventDefault();
    closeSidebar();
    await navigate(item.href);
  };

  const toggleFolder = (folderId: string) => {
    setExpanded((previous) => ({
      ...previous,
      [folderId]: !previous[folderId],
    }));
  };

  const renderItems = (nodeList: SidebarItem[], nested = false) => (
    <ul className={nested ? "ml-4 border-l border-white/50" : "space-y-1"}>
      {nodeList.map((item) => {
        const folderId = normalizeId(item.id);
        const isFolder = Boolean(item.children?.length);
        const isExpanded = expanded[folderId] ?? false;
        const controlsId = `folder-content-${folderId}`;

        if (!isFolder) {
          return (
            <li key={item.id}>
              <a
                href={item.href ?? "#"}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                className="retro-item flex items-center px-2 py-1 text-white hover:bg-white/40 font-['ZX_Spectrum-7'] text-xl lg:text-2xl whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary"
                onClick={(event) => void handleItemClick(event, item)}
              >
                <span className="ml-2 truncate">{item.label}</span>
              </a>
            </li>
          );
        }

        return (
          <li key={item.id} className="folder-container">
            <button
              type="button"
              className="retro-folder w-full flex items-center px-2 py-1 text-white hover:bg-white/40 font-['ZX_Spectrum-7'] text-xl lg:text-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary"
              aria-expanded={isExpanded}
              aria-controls={controlsId}
              onClick={() => toggleFolder(folderId)}
            >
              <span className="ml-2 truncate text-left">{item.label}</span>
            </button>

            <div id={controlsId} hidden={!isExpanded}>
              {item.children ? renderItems(item.children, true) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40 ${isOpen ? "" : "hidden"}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 h-screen w-64 lg:w-48 border-r border-retro-primary/20 bg-black/80 backdrop-blur-sm z-50 transition-transform duration-150 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-2 h-full">
          <div className="border-2 border-retro-primary mb-2 px-2 py-1 flex justify-between items-center">
            <span className="text-retro-primary font-bold text-xl lg:text-2xl font-['ZX_Spectrum-7'] truncate">
              {title}
            </span>
            <button
              type="button"
              className="lg:hidden text-retro-primary hover:bg-retro-primary/20 p-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary"
              aria-label={closeLabel}
              onClick={closeSidebar}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav>{renderItems(items)}</nav>
        </div>
      </aside>
    </>
  );
}
