import { test, expect } from '@playwright/test';

// Helpers para mockear APIs del backend sin tocar la base de datos real
const PROJECTS_API = '**/api/v1/projects';
const CLIENTS_API = '**/api/v1/clients*';
const FILES_API = '**/api/v1/files*';

function mockProjectsRoutes(page: any) {
  const projects = [
    {
      id: 'p1',
      name: 'Proyecto pendiente',
      description: 'Desc 1',
      status: 'PENDING',
      priority: 'MEDIUM',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'p2',
      name: 'Proyecto en progreso',
      description: 'Desc 2',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdAt: new Date().toISOString(),
    },
  ];

  page.route(PROJECTS_API, async (route: any, request: any) => {
    const url = request.url();
    const method = request.method();

    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(projects),
      });
      return;
    }

    if (method === 'POST') {
      const body = await request.postDataJSON();
      const created = {
        ...body,
        id: 'p3',
        createdAt: new Date().toISOString(),
      };
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(created),
      });
      return;
    }

    if (method === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
      return;
    }

    if (method === 'DELETE') {
      await route.fulfill({ status: 204 });
      return;
    }

    await route.continue();
  });
}

function mockClientsRoutes(page: any) {
  const clients = [
    {
      id: 'c1',
      name: 'Cliente 1',
      type: 'PERSON',
      email: 'c1@example.com',
      phone: '123',
      lifetimeValue: 1000,
      createdAt: new Date().toISOString(),
    },
  ];

  page.route(CLIENTS_API, async (route: any, request: any) => {
    const method = request.method();

    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: clients,
          total: clients.length,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        }),
      });
      return;
    }

    if (method === 'PATCH') {
      const body = await request.postDataJSON();
      clients[0] = { ...clients[0], ...body };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(clients[0]),
      });
      return;
    }

    if (method === 'DELETE') {
      await route.fulfill({ status: 204 });
      return;
    }

    await route.continue();
  });
}

function mockFilesRoutes(page: any) {
  const files: any[] = [
    {
      id: 'f1',
      name: 'archivo.pdf',
      type: 'DOCUMENT',
      size: 1024,
      mimeType: 'application/pdf',
      url: '/uploads/archivo.pdf',
      uploadedAt: new Date().toISOString(),
    },
  ];

  page.route(FILES_API, async (route: any, request: any) => {
    const url = request.url();
    const method = request.method();

    if (method === 'GET' && !url.endsWith('/download')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(files),
      });
      return;
    }

    if (method === 'POST') {
      const created = {
        id: 'f2',
        name: 'nuevo.txt',
        type: 'DOCUMENT',
        size: 10,
        mimeType: 'text/plain',
        url: '/uploads/nuevo.txt',
        uploadedAt: new Date().toISOString(),
      };
      files.push(created);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(created),
      });
      return;
    }

    if (method === 'DELETE') {
      await route.fulfill({ status: 204 });
      return;
    }

    await route.continue();
  });
}

test.describe('E2E MVP flows (mocked backend)', () => {
  test('Projects: muestra tablero Kanban y permite drag & drop básico', async ({
    page,
  }) => {
    await mockProjectsRoutes(page);
    await page.goto('/projects');

    await expect(page.getByText('Pendiente')).toBeVisible();
    await expect(page.getByText('En progreso')).toBeVisible();
    await expect(page.getByText('Proyecto pendiente')).toBeVisible();

    const pendingCard = page.getByText('Proyecto pendiente').first();
    const inProgressColumn = page.getByText('En progreso').locator('..');

    await pendingCard.dragTo(inProgressColumn);

    await expect(page.getByText('Proyecto pendiente')).toBeVisible();
  });

  test('Clients: permite edición inline y eliminar cliente', async ({ page }) => {
    await mockClientsRoutes(page);
    await page.goto('/clients');

    await expect(page.getByText('Clientes')).toBeVisible();
    await expect(page.getByText('Cliente 1')).toBeVisible();

    const nameCell = page.getByText('Cliente 1');
    await nameCell.click();
    await page.keyboard.type(' actualizado');
    await page.keyboard.press('Enter');

    await expect(page.getByText('Cliente 1 actualizado')).toBeVisible();

    const deleteButton = page.getByRole('button', { name: /eliminar/i }).first();
    await deleteButton.click();

    await expect(page.getByText('No hay clientes todavía.')).toBeVisible();
  });

  test('Files: lista archivos, permite upload mock y delete', async ({ page }) => {
    await mockFilesRoutes(page);
    await page.goto('/files');

    await expect(page.getByText('Archivos')).toBeVisible();
    await expect(page.getByText('archivo.pdf')).toBeVisible();

    const uploadButton = page.getByRole('button', { name: /subir archivo/i });
    await uploadButton.click();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'nuevo.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('contenido'),
    });

    const confirmButton = page.getByRole('button', { name: /^subir$/i });
    await confirmButton.click();

    await expect(page.getByText('nuevo.txt')).toBeVisible();

    const deleteButtons = page.getByRole('button', { name: /eliminar archivo/i });
    await deleteButtons.first().click();
  });
});



