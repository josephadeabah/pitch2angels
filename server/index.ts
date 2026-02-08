import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import pool from "./db";

const app = express();

// Security middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://pitch2angels.com"] 
    : ["http://localhost:5173", "http://localhost:8080"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (install express-rate-limit if needed)
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// File filter for uploads
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and PDF files are allowed'));
  }
};

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'pitch2angels-api'
  });
});

// Submit application endpoint
app.post(
  "/api/applications",
  upload.fields([
    { name: "productImage", maxCount: 1 },
    { name: "paymentReceipt", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    const startTime = Date.now();
    
    try {
      console.log('📝 Application submission started');
      
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const data = req.body;

      // Validate required fields
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 
        'city', 'region', 'businessName', 'description',
        'amountPaid', 'transactionReference', 'bankName',
        'accountHolderName', 'paymentDate', 'signature'
      ];

      const missingFields = requiredFields.filter(field => !data[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: 'Missing required fields',
          missingFields,
          success: false
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return res.status(400).json({
          error: 'Invalid email format',
          success: false
        });
      }

      // Parse and validate categories
      let categories: string[] = [];
      if (data.categories) {
        try {
          categories = typeof data.categories === 'string' 
            ? JSON.parse(data.categories) 
            : data.categories;
          
          if (!Array.isArray(categories)) {
            categories = [];
          }
        } catch (e) {
          categories = [];
        }
      }

      // Process file URLs
      const productImageUrl = files?.productImage?.[0]
        ? `/uploads/${files.productImage[0].filename}`
        : null;

      const paymentReceiptUrl = files?.paymentReceipt?.[0]
        ? `/uploads/${files.paymentReceipt[0].filename}`
        : null;

      // Validate file presence
      if (!productImageUrl || !paymentReceiptUrl) {
        return res.status(400).json({
          error: 'Both product image and payment receipt are required',
          success: false
        });
      }

      // Prepare database query
      const query = `
        INSERT INTO applications (
          first_name,
          last_name,
          guardian_name,
          phone,
          email,
          city,
          region,
          pronouns,
          occupation,
          business_name,
          website,
          categories,
          phase,
          has_collaborators,
          collaborator_names,
          description,
          product_image,
          bank_name,
          account_holder_name,
          transaction_reference,
          amount_paid,
          payment_date,
          payment_receipt,
          agreed_to_terms,
          signature
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
        RETURNING id, created_at
      `;

    // Add this function at the top of your file
    function cleanText(text: string): string {
    if (!text) return text;
    
    // Remove emojis and non-ASCII characters
    return text
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Symbols & Pictographs
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport & Map Symbols
        .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical Symbols
        .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric Shapes
        .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental Arrows-C
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
        .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
        .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
        .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Miscellaneous Symbols
        .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
        .replace(/[^\x20-\x7E\t\n\r]/g, '');    // Remove any other non-ASCII characters except whitespace
    }

    // Then update your values array in the POST handler:
    const values = [
    cleanText(data.firstName.trim()),
    cleanText(data.lastName.trim()),
    data.guardianName ? cleanText(data.guardianName.trim()) : null,
    cleanText(data.phone.trim()),
    cleanText(data.email.trim().toLowerCase()),
    cleanText(data.city.trim()),
    cleanText(data.region.trim()),
    data.pronouns ? cleanText(data.pronouns) : null,
    data.occupation ? cleanText(data.occupation.trim()) : null,
    cleanText(data.businessName.trim()),
    data.website ? cleanText(data.website.trim()) : null,
    categories,
    data.phase ? cleanText(data.phase) : null,
    data.hasCollaborators || 'no',
    data.collaboratorNames ? cleanText(data.collaboratorNames.trim()) : null,
    cleanText(data.description.trim()), // This is where the emoji likely is
    productImageUrl,
    cleanText(data.bankName.trim()),
    cleanText(data.accountHolderName.trim()),
    cleanText(data.transactionReference.trim()),
    parseFloat(data.amountPaid) || 0,
    data.paymentDate,
    paymentReceiptUrl,
    data.agreedToTerms === 'true' || data.agreedToTerms === true,
    cleanText(data.signature.trim())
    ];

      console.log('📊 Executing database query...');
      const result = await pool.query(query, values);

      const applicationId = result.rows[0].id;
      const processTime = Date.now() - startTime;

      console.log(`✅ Application ${applicationId} submitted successfully in ${processTime}ms`);

      // Send success response
      res.status(201).json({
        success: true,
        id: applicationId,
        productImageUrl,
        paymentReceiptUrl,
        createdAt: result.rows[0].created_at,
        message: 'Application submitted successfully'
      });

    } catch (error: unknown) {
      console.error('❌ Application submission error:', error);
      
      const processTime = Date.now() - startTime;
      
      // Handle specific errors
      const errorCode = (error as NodeJS.ErrnoException)?.code;
      if (errorCode === '23505') { // Unique violation
        return res.status(409).json({
          error: 'Duplicate entry',
          message: 'An application with this email already exists',
          success: false
        });
      }

      if (errorCode === '23502') { // Not null violation
        return res.status(400).json({
          error: 'Missing required data',
          message: 'Please fill all required fields',
          success: false
        });
      }

      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to submit application. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
        success: false,
        processTime
      });
    }
  }
);

// Get application by ID
app.get('/api/applications/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM applications WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Application not found',
        success: false
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      error: 'Internal server error',
      success: false
    });
  }
});

// Serve uploaded files
app.use("/uploads", express.static(uploadDir));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: (err?: Error) => void) => {
  console.error('Unhandled error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size should not exceed 10MB',
        success: false
      });
    }
    return res.status(400).json({
      error: 'File upload error',
      message: err.message,
      success: false
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong',
    success: false
  });
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Get all applications with pagination and filters
app.get('/api/admin/applications', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      region = '',
      status = '',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE clause
    const whereConditions: string[] = [];
    const queryParams: (string | number)[] = [];

    if (search) {
      whereConditions.push(`
        (first_name ILIKE $${queryParams.length + 1} OR 
         last_name ILIKE $${queryParams.length + 1} OR 
         email ILIKE $${queryParams.length + 1} OR 
         business_name ILIKE $${queryParams.length + 1})
      `);
      queryParams.push(`%${String(search)}%`);
    }

    if (region) {
      whereConditions.push(`region = $${queryParams.length + 1}`);
      queryParams.push(String(region));
    }

    if (status === 'reviewed') {
      whereConditions.push('reviewed = true');
    } else if (status === 'pending') {
      whereConditions.push('reviewed = false');
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM applications ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT 
        id,
        first_name,
        last_name,
        email,
        phone,
        city,
        region,
        business_name,
        categories,
        phase,
        description,
        product_image,
        payment_receipt,
        amount_paid,
        transaction_reference,
        bank_name,
        payment_date,
        created_at,
        reviewed,
        review_notes,
        review_status,
        reviewed_at,
        reviewed_by
      FROM applications 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}
      LIMIT $${queryParams.length + 1} 
      OFFSET $${queryParams.length + 2}
    `;

    const dataParams = [...queryParams, limitNum, offset];
    const dataResult = await pool.query(dataQuery, dataParams);

    res.json({
      success: true,
      data: {
        applications: dataResult.rows,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      error: 'Internal server error',
      success: false
    });
  }
});

// Update application status (review, approve, reject)
app.patch('/api/admin/applications/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      reviewed, 
      review_status, 
      review_notes,
      reviewed_by = 'admin'
    } = req.body;

    // Validate required fields
    if (review_status && !['pending', 'approved', 'rejected', 'shortlisted'].includes(review_status)) {
      return res.status(400).json({
        error: 'Invalid review status',
        success: false
      });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: (string | number | boolean | Date | null)[] = [];
    let paramCount = 1;

    if (reviewed !== undefined) {
      updates.push(`reviewed = $${paramCount}`);
      values.push(reviewed);
      paramCount++;
      
      if (reviewed) {
        updates.push(`reviewed_at = $${paramCount}`);
        values.push(new Date().toISOString());
        paramCount++;
        
        updates.push(`reviewed_by = $${paramCount}`);
        values.push(reviewed_by);
        paramCount++;
      }
    }

    if (review_status) {
      updates.push(`review_status = $${paramCount}`);
      values.push(review_status);
      paramCount++;
    }

    if (review_notes !== undefined) {
      updates.push(`review_notes = $${paramCount}`);
      values.push(review_notes);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No updates provided',
        success: false
      });
    }

    values.push(id);
    const query = `
      UPDATE applications 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Application not found',
        success: false
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Application updated successfully'
    });

  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      error: 'Internal server error',
      success: false
    });
  }
});

// Get application statistics
app.get('/api/admin/statistics', async (req: Request, res: Response) => {
  try {
    const queries = await Promise.all([
      // Total applications
      pool.query('SELECT COUNT(*) FROM applications'),
      
      // Applications today
      pool.query(`
        SELECT COUNT(*) FROM applications 
        WHERE DATE(created_at) = CURRENT_DATE
      `),
      
      // By region
      pool.query(`
        SELECT region, COUNT(*) as count 
        FROM applications 
        GROUP BY region 
        ORDER BY count DESC
      `),
      
      // By review status
      pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE NOT reviewed) as pending,
          COUNT(*) FILTER (WHERE reviewed AND review_status = 'approved') as approved,
          COUNT(*) FILTER (WHERE reviewed AND review_status = 'rejected') as rejected,
          COUNT(*) FILTER (WHERE reviewed AND review_status = 'shortlisted') as shortlisted
        FROM applications
      `),
      
      // Recent applications (last 7 days)
      pool.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM applications 
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `)
    ]);

    const [totalRes, todayRes, regionsRes, statusRes, recentRes] = queries;

    res.json({
      success: true,
      data: {
        total: parseInt(totalRes.rows[0].count),
        today: parseInt(todayRes.rows[0].count),
        byRegion: regionsRes.rows,
        byStatus: statusRes.rows[0],
        recent: recentRes.rows
      }
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      error: 'Internal server error',
      success: false
    });
  }
});

// Delete application (admin only)
app.delete('/api/admin/applications/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if application exists
    const checkResult = await pool.query(
      'SELECT id FROM applications WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Application not found',
        success: false
      });
    }

    // Delete the application
    await pool.query('DELETE FROM applications WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      error: 'Internal server error',
      success: false
    });
  }
});

// Export applications to CSV
app.get('/api/admin/export', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        first_name,
        last_name,
        email,
        phone,
        city,
        region,
        business_name,
        array_to_string(categories, ', ') as categories,
        phase,
        amount_paid,
        transaction_reference,
        bank_name,
        payment_date,
        created_at,
        reviewed,
        review_status,
        reviewed_at
      FROM applications 
      ORDER BY created_at DESC
    `);

    // Convert to CSV
    const headers = [
      'ID', 'First Name', 'Last Name', 'Email', 'Phone', 'City', 'Region',
      'Business Name', 'Categories', 'Phase', 'Amount Paid', 'Transaction Reference',
      'Bank Name', 'Payment Date', 'Created At', 'Reviewed', 'Review Status', 'Reviewed At'
    ];

    const csvRows = result.rows.map(row => 
      headers.map(header => {
        const value = row[header.toLowerCase().replace(/ /g, '_')];
        return `"${String(value || '').replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csv = [headers.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');
    res.send(csv);

  } catch (error) {
    console.error('Error exporting applications:', error);
    res.status(500).json({
      error: 'Internal server error',
      success: false
    });
  }
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    success: false
  });
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadDir}`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('🔄 Shutting down gracefully...');
  
  server.close(async () => {
    console.log('👋 HTTP server closed');
    
    try {
      await pool.end();
      console.log('📦 Database pool closed');
      process.exit(0);
    } catch (err) {
      console.error('Error closing database pool:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⏰ Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;