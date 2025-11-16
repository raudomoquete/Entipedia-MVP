import { IClientRepository } from '../../domain/repos-interfaces/client-repository';
import { Client } from '../../domain/entities/client';
import { ClientType } from '../../domain/value-objects/client-type';
import { MoneyDOP } from '../../domain/value-objects/money-dop';
import { createClientId } from '../../domain/value-objects/client-id';
import {
  ClientResponseDto,
  CreateClientDto,
  PaginatedClientsResponseDto,
  UpdateClientDto,
} from '../dto/client-dtos';
import { Result } from '../../shared/errors/result';
import { AppError } from '../../shared/errors/app-error';

export class ClientService {
  constructor(private readonly clientRepository: IClientRepository) {}

  private toResponseDto(client: Client): ClientResponseDto {
    return {
      id: client.id,
      name: client.name,
      type: client.type,
      email: client.email,
      phone: client.phone,
      lifetimeValue: client.lifetimeValue?.getAmount(),
      createdAt: client.createdAt.toISOString(),
    };
  }

  async createClient(
    dto: CreateClientDto
  ): Promise<Result<ClientResponseDto, AppError>> {
    const client = Client.create({
      id: createClientId(crypto.randomUUID()),
      name: dto.name.trim(),
      type: dto.type as ClientType,
      email: dto.email?.trim(),
      phone: dto.phone?.trim(),
      lifetimeValue:
        dto.lifetimeValue !== undefined
          ? MoneyDOP.create(dto.lifetimeValue)
          : undefined,
      createdAt: new Date(),
    });

    const result = await this.clientRepository.create(client);
    if (!result.success) {
      return Result.failure(result.error);
    }

    return Result.success(this.toResponseDto(result.value));
  }

  async updateClient(
    id: string,
    dto: UpdateClientDto
  ): Promise<Result<ClientResponseDto, AppError>> {
    const clientId = createClientId(id);

    const partial: {
      name?: string;
      type?: ClientType;
      email?: string;
      phone?: string;
      lifetimeValue?: MoneyDOP;
    } = {};

    if (dto.name !== undefined) {
      partial.name = dto.name.trim();
    }
    if (dto.type !== undefined) {
      partial.type = dto.type as ClientType;
    }
    if (dto.email !== undefined) {
      partial.email = dto.email.trim();
    }
    if (dto.phone !== undefined) {
      partial.phone = dto.phone.trim();
    }
    if (dto.lifetimeValue !== undefined) {
      partial.lifetimeValue = MoneyDOP.create(dto.lifetimeValue);
    }

    const result = await this.clientRepository.update(clientId, partial);
    if (!result.success) {
      return Result.failure(result.error);
    }

    return Result.success(this.toResponseDto(result.value));
  }

  async deleteClient(id: string): Promise<Result<void, AppError>> {
    const clientId = createClientId(id);
    return this.clientRepository.delete(clientId);
  }

  async getAllClients(
    page: number,
    pageSize: number
  ): Promise<Result<PaginatedClientsResponseDto, AppError>> {
    // Usamos el repositorio paginado de infraestructura.
    // Aunque el interface de dominio no lo expone, se puede ampliar ahí si lo deseas;
    // por ahora asumimos que la implementación concreta tiene este método.
    // @ts-expect-error: método específico de la implementación
    const result = await this.clientRepository.findAllPaginated(page, pageSize);
    if (!result.success) {
      return Result.failure(result.error);
    }

    const mapped: PaginatedClientsResponseDto = {
      items: result.value.items.map((client: Client) =>
        this.toResponseDto(client)
      ),
      total: result.value.total,
      page: result.value.page,
      pageSize: result.value.pageSize,
      totalPages: result.value.totalPages,
    };

    return Result.success(mapped);
  }

  async getClientById(
    id: string
  ): Promise<Result<ClientResponseDto, AppError>> {
    const clientId = createClientId(id);
    const result = await this.clientRepository.findById(clientId);
    if (!result.success) {
      return Result.failure(result.error);
    }

    return Result.success(this.toResponseDto(result.value));
  }
}


