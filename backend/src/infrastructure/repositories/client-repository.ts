import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm/sql';
import { BaseRepository } from './base-repository';
import { clients } from '../database/schema';
import { Client } from '../../domain/entities/client';
import { ClientId, createClientId } from '../../domain/value-objects/client-id';
import { ClientType } from '../../domain/value-objects/client-type';
import { MoneyDOP } from '../../domain/value-objects/money-dop';
import { IClientRepository } from '../../domain/repos-interfaces/client-repository';
import { Result } from '../../shared/errors/result';
import { AppError, NotFoundError } from '../../shared/errors/app-error';

type ClientRow = typeof clients.$inferSelect;

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ClientRepository
  extends BaseRepository<Client, ClientId>
  implements IClientRepository
{
  private mapToDomain(row: ClientRow): Client {
    return Client.create({
      id: createClientId(row.id),
      name: row.name,
      type: row.type as ClientType,
      email: row.email ?? undefined,
      phone: row.phone ?? undefined,
      lifetimeValue:
        row.lifetimeValue !== null && row.lifetimeValue !== undefined
          ? MoneyDOP.create(Number(row.lifetimeValue))
          : undefined,
      createdAt: row.createdAt,
    });
  }

  async findById(id: ClientId): Promise<Result<Client, AppError>> {
    return this.executeOperation(async () => {
      const rows = await this.db
        .select()
        .from(clients)
        .where(eq(clients.id, id));

      const row = rows[0];
      if (!row) {
        throw new NotFoundError('Client', id);
      }

      return this.mapToDomain(row);
    });
  }

  async findAll(): Promise<Result<Client[], AppError>> {
    return this.executeOperation(async () => {
      const rows = await this.db.select().from(clients);
      return rows.map((row) => this.mapToDomain(row));
    });
  }

  async findByType(type: ClientType): Promise<Result<Client[], AppError>> {
    return this.executeOperation(async () => {
      const rows = await this.db
        .select()
        .from(clients)
        .where(eq(clients.type, type));

      return rows.map((row) => this.mapToDomain(row));
    });
  }

  async findAllPaginated(
    page: number,
    pageSize: number
  ): Promise<Result<PaginatedResult<Client>, AppError>> {
    const safePage = page > 0 ? page : 1;
    const safePageSize = pageSize > 0 ? pageSize : 10;
    const offset = (safePage - 1) * safePageSize;

    return this.executeOperation(async () => {
      const [countRow] = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(clients);

      const total = Number(countRow.count) || 0;
      const totalPages =
        safePageSize > 0 ? Math.ceil(total / safePageSize) : 1;

      const rows = await this.db
        .select()
        .from(clients)
        .limit(safePageSize)
        .offset(offset);

      const items = rows.map((row) => this.mapToDomain(row));

      return {
        items,
        total,
        page: safePage,
        pageSize: safePageSize,
        totalPages,
      };
    });
  }

  async create(client: Client): Promise<Result<Client, AppError>> {
    return this.executeOperation(async () => {
      const [row] = await this.db
        .insert(clients)
        .values({
          id: client.id,
          name: client.name,
          type: client.type,
          email: client.email ?? null,
          phone: client.phone ?? null,
          lifetimeValue:
            client.lifetimeValue !== undefined
              ? client.lifetimeValue.getAmount().toString()
              : null,
          // createdAt se omite para que PostgreSQL use el default (now())
        })
        .returning();

      return this.mapToDomain(row);
    });
  }

  async update(
    clientId: ClientId,
    entity: Partial<Client>
  ): Promise<Result<Client, AppError>> {
    return this.executeOperation(async () => {
      const existingResult = await this.findById(clientId);
      if (!existingResult.success) {
        throw existingResult.error;
      }
      const existing = existingResult.value;

      const updated = Client.create({
        id: clientId,
        name: entity.name ?? existing.name,
        type: entity.type ?? existing.type,
        email: entity.email ?? existing.email,
        phone: entity.phone ?? existing.phone,
        lifetimeValue: entity.lifetimeValue ?? existing.lifetimeValue,
        createdAt: existing.createdAt,
      });

      const [row] = await this.db
        .update(clients)
        .set({
          name: updated.name,
          type: updated.type,
          email: updated.email ?? null,
          phone: updated.phone ?? null,
          lifetimeValue:
            updated.lifetimeValue !== undefined
              ? updated.lifetimeValue.getAmount().toString()
              : null,
        })
        .where(eq(clients.id, clientId))
        .returning();

      if (!row) {
        throw new NotFoundError('Client', clientId);
      }

      return this.mapToDomain(row);
    });
  }

  async delete(id: ClientId): Promise<Result<void, AppError>> {
    return this.executeOperation(async () => {
      await this.db.delete(clients).where(eq(clients.id, id));
      return;
    });
  }
}


