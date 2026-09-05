import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  productQuerySchema
} from '../schemas/product.schema.js';
import {
  getProductReviews,
  createProductReview
} from '../controllers/review.controller.js';
import { createReviewSchema } from '../schemas/review.schema.js';

const router = Router();

// Endpoints de Productos
router.get('/', validate(productQuerySchema, 'query'), getAllProducts);
router.get('/:id/reviews', validate(productIdParamSchema, 'params'), getProductReviews);
router.post('/:id/reviews', validate(productIdParamSchema, 'params'), validate(createReviewSchema, 'body'), createProductReview);
router.get('/:id', validate(productIdParamSchema, 'params'), getProductById);
router.post('/', validate(createProductSchema, 'body'), createProduct);
router.put('/:id', validate(productIdParamSchema, 'params'), validate(updateProductSchema, 'body'), updateProduct);
router.delete('/:id', validate(productIdParamSchema, 'params'), deleteProduct);

export default router;
