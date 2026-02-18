
import { z } from 'zod';
import { insertUserSchema, insertEnquirySchema, insertInvoiceSchema, insertSeatSchema, insertAttendanceSchema, insertSeatBookingSchema } from './schema';

export const api = {
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users' as const,
      responses: {
        200: z.array(z.any()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/users/:id' as const,
      responses: {
        200: z.any(),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/users' as const,
      input: insertUserSchema,
      responses: {
        201: z.any(),
      },
    },
  },
  seats: {
    list: {
      method: 'GET' as const,
      path: '/api/seats' as const,
      responses: {
        200: z.array(z.any()),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/seats/:id' as const,
      input: insertSeatSchema.partial(),
      responses: {
        200: z.any(),
      },
    },
    availability: {
      method: 'GET' as const,
      path: '/api/seats/availability' as const,
      input: z.object({
        hours: z.string(),
        slot: z.string(),
        date: z.string(),
      }),
      responses: {
        200: z.array(z.any()),
      },
    },
  },
  bookings: {
    create: {
      method: 'POST' as const,
      path: '/api/bookings' as const,
      input: insertSeatBookingSchema,
      responses: {
        201: z.any(),
      },
    },
  },
  enquiries: {
    list: {
      method: 'GET' as const,
      path: '/api/enquiries' as const,
      responses: {
        200: z.array(z.any()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/enquiries' as const,
      input: insertEnquirySchema,
      responses: {
        201: z.any(),
      },
    },
  },
  invoices: {
    list: {
      method: 'GET' as const,
      path: '/api/invoices' as const,
      responses: {
        200: z.array(z.any()),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/invoices/:id' as const,
      input: z.object({
        status: z.string(),
        transactionId: z.string().optional(),
        paymentScreenshot: z.string().optional(),
      }),
      responses: {
        200: z.any(),
      },
    },
  },
  attendance: {
    list: {
      method: 'GET' as const,
      path: '/api/attendance' as const,
      responses: {
        200: z.array(z.any()),
      },
    },
  },
  stats: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/stats/dashboard' as const,
      responses: {
        200: z.object({
          activeSubscribers: z.number(),
          monthlyRevenue: z.object({
            paid: z.number(),
            pending: z.number(),
            total: z.number(),
          }),
          attendanceData: z.array(z.object({
            date: z.string(),
            present: z.number(),
            absent: z.number(),
          })),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
