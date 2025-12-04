import { z } from "zod";

// No input needed for export data
export const exportDataSchema = z.object({});

// No input needed for account stats
export const getAccountStatsSchema = z.object({});

// Export types
export type ExportDataInput = z.infer<typeof exportDataSchema>;
export type GetAccountStatsInput = z.infer<typeof getAccountStatsSchema>;
