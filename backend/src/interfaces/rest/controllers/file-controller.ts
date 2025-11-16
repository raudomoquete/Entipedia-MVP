import { Request, Response, NextFunction, Router } from 'express';
import { BaseController } from './base-controller';
import { asyncHandler } from '../middlewares/async-handler';
import { uploadMiddleware } from '../middlewares/upload-middleware';
import { FileService } from '../../../application/services/file-service';
import { uploadFileMetadataSchema } from '../validators/file-validators';

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: File management (upload, list, download, delete)
 */
export class FileController extends BaseController {
  public readonly router: Router;

  constructor(private readonly fileService: FileService) {
    super();
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    /**
     * @swagger
     * /api/v1/files:
     *   get:
     *     summary: Get all files
     *     tags: [Files]
     *     responses:
     *       200:
     *         description: List of files
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.get('/files', this.getAll);

    /**
     * @swagger
     * /api/v1/files/{id}:
     *   get:
     *     summary: Get file metadata by ID
     *     tags: [Files]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: File metadata
     *       404:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.get('/files/:id', this.getById);

    /**
     * @swagger
     * /api/v1/files:
     *   post:
     *     summary: Upload a file
     *     tags: [Files]
     *     consumes:
     *       - multipart/form-data
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *               description:
     *                 type: string
     *                 description: Optional file description
     *     responses:
     *       201:
     *         description: File uploaded
     *       400:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.post(
      '/files',
      uploadMiddleware.single('file'),
      this.upload
    );

    /**
     * @swagger
     * /api/v1/files/{id}/download:
     *   get:
     *     summary: Download file by ID (redirects to static file URL)
     *     tags: [Files]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       302:
     *         description: Redirect to file URL
     *       404:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.get('/files/:id/download', this.download);

    /**
     * @swagger
     * /api/v1/files/{id}:
     *   delete:
     *     summary: Delete a file (metadata + physical file)
     *     tags: [Files]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: File deleted
     *       404:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.delete('/files/:id', this.delete);
  }

  public getAll = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.fileService.getAllFiles();
      this.handleResult(result, req, res, next);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await this.fileService.getFileById(id);
      this.handleResult(result, req, res, next);
    }
  );

  public upload = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const file = req.file;

      if (!file) {
        this.badRequest(res, 'File is required');
        return;
      }

      const metadataParse = uploadFileMetadataSchema.safeParse(req.body);
      if (!metadataParse.success) {
        this.badRequest(res, metadataParse.error.errors[0]?.message);
        return;
      }

      const result = await this.fileService.uploadFile({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      });

      if (!result.success) {
        this.handleResult(result, req, res, next);
        return;
      }

      this.created(res, result.value, `/api/v1/files/${result.value.id}`);
    }
  );

  public download = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await this.fileService.getFileById(id);

      if (!result.success) {
        this.handleResult(result, req, res, next);
        return;
      }

      res.redirect(result.value.url);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await this.fileService.deleteFile(id);

      if (!result.success) {
        this.handleResult(result, req, res, next);
        return;
      }

      this.noContent(res);
    }
  );
}



