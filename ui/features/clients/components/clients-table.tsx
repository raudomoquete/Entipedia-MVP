import { Client, ClientType } from '@/types/client';
import { EditableTextCell, EditableSelectCell, EditableCurrencyCell } from './editable-cells';
import { Button } from '@/components/ui/button';

interface ClientsTableProps {
  data: Client[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onUpdateClient: (id: string, data: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
}

const CLIENT_TYPE_OPTIONS: { label: string; value: ClientType }[] = [
  { label: 'Persona', value: 'PERSON' },
  { label: 'Empresa', value: 'COMPANY' },
];

export function ClientsTable({
  data,
  page,
  pageSize,
  total,
  onPageChange,
  onUpdateClient,
  onDeleteClient,
}: ClientsTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border bg-background">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Nombre</th>
              <th className="px-3 py-2 text-left font-medium">Tipo</th>
              <th className="px-3 py-2 text-left font-medium">Email</th>
              <th className="px-3 py-2 text-left font-medium">Teléfono</th>
              <th className="px-3 py-2 text-right font-medium">Valor DOP</th>
              <th className="px-3 py-2 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((client) => (
              <tr key={client.id} className="hover:bg-muted/40">
                <td className="px-3 py-2 align-top">
                  <EditableTextCell
                    value={client.name}
                    onChange={(value) =>
                      onUpdateClient(client.id, { name: value as string })
                    }
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <EditableSelectCell
                    value={client.type}
                    options={CLIENT_TYPE_OPTIONS}
                    onChange={(value) =>
                      onUpdateClient(client.id, { type: value })
                    }
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <EditableTextCell
                    value={client.email}
                    onChange={(value) =>
                      onUpdateClient(client.id, { email: value as string | undefined })
                    }
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <EditableTextCell
                    value={client.phone}
                    onChange={(value) =>
                      onUpdateClient(client.id, { phone: value as string | undefined })
                    }
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <EditableCurrencyCell
                    value={client.lifetimeValue}
                    onChange={(value) =>
                      onUpdateClient(client.id, { lifetimeValue: value })
                    }
                  />
                </td>
                <td className="px-3 py-2 align-top text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteClient(client.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-sm text-muted-foreground"
                >
                  No hay clientes todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Página {page} de {totalPages} ({total} clientes)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}


