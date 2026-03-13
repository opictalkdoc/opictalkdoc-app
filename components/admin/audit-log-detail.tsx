"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AuditLogDetailProps {
  details: Record<string, unknown>;
}

export function AuditLogDetail({ details }: AuditLogDetailProps) {
  const [open, setOpen] = useState(false);

  if (!details || Object.keys(details).length === 0) {
    return <span className="text-foreground-muted">-</span>;
  }

  return (
    <div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        상세
      </button>
      {open && (
        <pre className="mt-1 max-h-40 overflow-auto rounded-md bg-surface-secondary p-2 text-xs text-foreground-secondary">
          {JSON.stringify(details, null, 2)}
        </pre>
      )}
    </div>
  );
}
