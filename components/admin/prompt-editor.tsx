"use client";

import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";

interface PromptEditorProps {
  id: string;
  name: string;
  initialContent: string;
  onSave: (id: string, content: string) => Promise<{ success: boolean; error?: string }>;
}

export function PromptEditor({ id, name, initialContent, onSave }: PromptEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const hasChanges = content !== initialContent;

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await onSave(id, content);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert(result.error || "저장 실패");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h3 className="text-sm font-semibold text-foreground">{name}</h3>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={() => setContent(initialContent)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-foreground-muted hover:bg-surface-secondary"
            >
              <RotateCcw size={12} />
              되돌리기
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex items-center gap-1 rounded-md bg-primary-500 px-3 py-1 text-xs font-medium text-white hover:bg-primary-600 disabled:opacity-50"
          >
            <Save size={12} />
            {saving ? "저장 중..." : saved ? "저장됨!" : "저장"}
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
        className="w-full resize-y bg-transparent p-4 font-mono text-xs text-foreground outline-none"
        spellCheck={false}
      />
    </div>
  );
}
