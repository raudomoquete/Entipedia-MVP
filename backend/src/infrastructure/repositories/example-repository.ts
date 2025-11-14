import { BaseRepository } from './base-repository';
import { Result } from '../../shared/errors/result';
import { AppError, NotFoundError } from '../../shared/errors/app-error';

/**
 * Example repository showing how to use BaseRepository
 */
interface ExampleEntity {
  id: string;
  name: string;
  createdAt: Date;
}

export class ExampleRepository extends BaseRepository<ExampleEntity, string> {
  async findById(id: string): Promise<Result<ExampleEntity, AppError>> {
    return this.executeOperation(async () => {
      // Example: Query database using Drizzle
      // const result = await this.db.select().from(exampleTable).where(eq(exampleTable.id, id));
      // if (!result[0]) {
      //   throw new NotFoundError('Example', id);
      // }
      // return result[0];

      // Mock implementation
      if (id === '123') {
        return {
          id,
          name: 'Example',
          createdAt: new Date(),
        };
      }
      throw new NotFoundError('Example', id);
    });
  }

  async findAll(): Promise<Result<ExampleEntity[], AppError>> {
    return this.executeOperation(async () => {
      // Mock implementation
      return [
        { id: '1', name: 'Example 1', createdAt: new Date() },
        { id: '2', name: 'Example 2', createdAt: new Date() },
      ];
    });
  }

  async create(entity: Partial<ExampleEntity>): Promise<Result<ExampleEntity, AppError>> {
    return this.executeOperation(async () => {
      // Mock implementation
      return {
        id: Math.random().toString(36).substring(7),
        name: entity.name || 'Untitled',
        createdAt: new Date(),
      } as ExampleEntity;
    });
  }

  async update(
    id: string,
    entity: Partial<ExampleEntity>
  ): Promise<Result<ExampleEntity, AppError>> {
    return this.executeOperation(async () => {
      if (id !== '123') {
        throw new NotFoundError('Example', id);
      }
      return {
        id,
        name: entity.name || 'Updated',
        createdAt: new Date(),
      } as ExampleEntity;
    });
  }

  async delete(id: string): Promise<Result<void, AppError>> {
    return this.executeOperation(async () => {
      if (id !== '123') {
        throw new NotFoundError('Example', id);
      }
      // Deletion successful
    });
  }
}

