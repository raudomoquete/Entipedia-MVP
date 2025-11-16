import { Client } from '../entities/client';
import { ClientId } from '../value-objects/client-id';
import { ClientType } from '../value-objects/client-type';
import { Result } from '../../shared/errors/result';
import { AppError } from '../../shared/errors/app-error';

/**
 * Repository interface para el agregado Client.
 * Implementaciones concretas vivirán en la capa de infraestructura.
 */
export interface IClientRepository {
  findById(id: ClientId): Promise<Result<Client, AppError>>;
  findAll(): Promise<Result<Client[], AppError>>;
  findByType(type: ClientType): Promise<Result<Client[], AppError>>;
  create(client: Client): Promise<Result<Client, AppError>>;
  update(id: ClientId, entity: Partial<Client>): Promise<Result<Client, AppError>>;
  delete(id: ClientId): Promise<Result<void, AppError>>;
}


