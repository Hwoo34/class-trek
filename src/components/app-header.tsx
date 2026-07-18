import Link from "next/link";
import { Radio } from "lucide-react";

interface AppHeaderProps {
  label?: string;
  status?: string;
  children?: React.ReactNode;
}

export function AppHeader({
  label = "Live Lesson Lab",
  status,
  children,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <Link className="brand" href="/">
        <span className="brand-mark">
          <Radio size={17} />
        </span>
        <span>{label}</span>
      </Link>
      <div className="header-actions">
        {status ? (
          <span className="status-pill">
            <span className="status-dot" />
            {status}
          </span>
        ) : null}
        {children}
      </div>
    </header>
  );
}
