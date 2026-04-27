import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

/**
 * GET /api/products
 * Get all products with optional filters
 */
router.get('/', getAllProducts);

/**
 * POST /api/products
 * Create a new product (admin only)
 */
router.post('/', createProduct);

/**
 * GET /api/products/:id
 * Get a specific product
 */
router.get('/:id', getProductById);

/**
 * PATCH /api/products/:id
 * Update a product (admin only)
 */
router.patch('/:id', updateProduct);

/**
 * DELETE /api/products/:id
 * Delete a product (admin only)
 */
router.delete('/:id', deleteProduct);

export default router;
