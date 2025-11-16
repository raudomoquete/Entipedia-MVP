import { useState, useEffect } from 'react';
import { ClientType } from '@/types/client';
import { cn } from '@/lib/cn';

interface BaseEditableCellProps {
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
}

export function EditableTextCell({ value, onChange }: BaseEditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>(String(value ?? ''));

  useEffect(() => {
    setDraft(String(value ?? ''));
  }, [value]);

  const handleBlur = () => {
    setEditing(false);
    onChange(draft || undefined);
  };

  if (!editing) {
    return (
      <button
        type="button"
        className="w-full text-left text-sm hover:bg-muted/70 rounded px-1 py-0.5"
        onClick={() => setEditing(true)}
      >
        {value || <span className="text-muted-foreground">Click para editar</span>}
      </button>
    );
  }

  return (
    <input
      autoFocus
      className="w-full rounded border px-1 py-0.5 text-sm"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleBlur();
        } else if (e.key === 'Escape') {
          setEditing(false);
          setDraft(String(value ?? ''));
        }
      }}
    />
  );
}

interface EditableSelectCellProps {
  value: ClientType;
  options: { label: string; value: ClientType }[];
  onChange: (value: ClientType) => void;
}

export function EditableSelectCell({
  value,
  options,
  onChange,
}: EditableSelectCellProps) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    const current = options.find((o) => o.value === value);
    return (
      <button
        type="button"
        className="w-full text-left text-sm hover:bg-muted/70 rounded px-1 py-0.5"
        onClick={() => setEditing(true)}
      >
        {current?.label ?? value}
      </button>
    );
  }

  return (
    <select
      autoFocus
      className="w-full rounded border px-1 py-0.5 text-sm"
      value={value}
      onChange={(e) => {
        onChange(e.target.value as ClientType);
        setEditing(false);
      }}
      onBlur={() => setEditing(false)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface EditableCurrencyCellProps {
  value?: number;
  onChange: (value: number | undefined) => void;
}

export function EditableCurrencyCell({
  value,
  onChange,
}: EditableCurrencyCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>(
    value !== undefined ? value.toString() : ''
  );

  useEffect(() => {
    setDraft(value !== undefined ? value.toString() : '');
  }, [value]);

  const formatter = new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    maximumFractionDigits: 2,
  });

  const handleBlur = () => {
    setEditing(false);
    const parsed = draft.trim() === '' ? undefined : Number(draft);
    onChange(Number.isFinite(parsed as number) ? (parsed as number) : undefined);
  };

  if (!editing) {
    return (
      <button
        type="button"
        className={cn(
          'w-full text-right text-sm rounded px-1 py-0.5',
          'hover:bg-muted/70 font-medium'
        )}
        onClick={() => setEditing(true)}
      >
        {value !== undefined
          ? formatter.format(value)
          : <span className="text-muted-foreground">Click para editar</span>}
      </button>
    );
  }

  return (
    <input
      autoFocus
      className="w-full rounded border px-1 py-0.5 text-right text-sm"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleBlur();
        } else if (e.key === 'Escape') {
          setEditing(false);
          setDraft(value !== undefined ? value.toString() : '');
        }
      }}
    />
  );
}


