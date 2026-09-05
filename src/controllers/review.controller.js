import prisma from '../config/prisma.js';

/**
 * Obtener las reseñas de un producto y su promedio.
 * GET /api/products/:id/reviews
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const [reviews, ratingAggregate] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        orderBy: { id: 'desc' }
      }),
      prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true }
      })
    ]);

    res.status(200).json({
      productId,
      total: reviews.length,
      averageRating: ratingAggregate._avg.rating ?? 0,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una reseña para un producto.
 * POST /api/products/:id/reviews
 */
export const createProductReview = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { author, rating, comment } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const review = await prisma.review.create({
      data: {
        author,
        rating,
        comment,
        productId
      }
    });

    res.status(201).json({
      mensaje: 'Reseña creada exitosamente',
      data: review
    });
  } catch (error) {
    next(error);
  }
};
