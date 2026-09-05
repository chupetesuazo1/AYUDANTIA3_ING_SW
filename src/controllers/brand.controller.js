import prisma from '../config/prisma.js';

/**
 * Obtener todas las marcas incluyendo el conteo de productos.
 * GET /api/brands
 */
export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.status(200).json({
      total: brands.length,
      data: brands
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una marca.
 * POST /api/brands
 */
export const createBrand = async (req, res, next) => {
  try {
    const { name, country, website } = req.body;

    const existingBrand = await prisma.brand.findUnique({
      where: { name }
    });

    if (existingBrand) {
      return res.status(409).json({
        error: `La marca '${name}' ya existe.`
      });
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        country,
        website
      }
    });

    res.status(201).json({
      mensaje: 'Marca creada exitosamente',
      data: brand
    });
  } catch (error) {
    next(error);
  }
};
