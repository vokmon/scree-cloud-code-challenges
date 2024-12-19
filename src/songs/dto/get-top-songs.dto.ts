import {
  DEFAULT_LIMIT,
  MAX_LIMIT,
  MIN_LIMIT,
} from '@src/constants/PaginationConstants';
import { getCurrentMonth } from '@src/utils/date-utils';
import { z } from 'zod';
import { Song } from './songs.dto';

// Define the regular expression for the YYYY-MM format
const yearMonthsPattern =
  /^(\d{4}-(0[1-9]|1[0-2]))(,(\d{4}-(0[1-9]|1[0-2])))*$/;

// Create a schema for an array of strings that match the YYYY-MM format
export const GetTopSongsCriteriaSchema = z.object({
  monthYears: z
    .string()
    .regex(
      yearMonthsPattern,
      'Invalid date format, expected YYYY-MM,YYYY-MM,...',
    )
    .optional() // Makes the monthYear field optional
    .default(getCurrentMonth()) // Default to current month if not provided
    .transform((months) => {
      // Split the comma-separated string into an array of strings
      return months.split(',').map((monthYear) => {
        const [year, month] = monthYear.split('-');
        return {
          month: parseInt(month, 10),
          year: parseInt(year, 10),
        };
      });
    }),

  limit: z
    .string()
    .optional()
    .default(String(DEFAULT_LIMIT))
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= MIN_LIMIT, {
      message: `Limit must be greater than ${MIN_LIMIT - 1}`,
    })
    .refine((val) => val <= MAX_LIMIT, {
      message: `Song limit must be less than or equal to ${MAX_LIMIT}`,
    }),
});

export type MonthYear = {
  month: number;
  year: number;
};
export type GetTopSongsCriteriaDto = z.infer<typeof GetTopSongsCriteriaSchema>;

export type TopSongs = {
  month: number;
  year: number;
  topSongs: {
    playCount: number;
    song: Song;
  }[];
};
