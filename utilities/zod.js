import { z } from 'zod';

export const post_rebroadcast_schema = z
    .object({
        action: z
            .string()
            .min(13, 'action must be get_campaign_status or get_snapshots')
            .refine((val) => val.startsWith('get_'), {
                message: 'action must start with "get_"',
            }),
        season: z
            .string()
            .min(1, 'season must be at least 1 character long')
            .transform((val) => {
                const parsed = parseInt(val, 10);
                if (isNaN(parsed)) {
                    throw new Error('Season must be parsable to an integer');
                }
                return parsed;
            })
            .optional(),
    })
    .refine(
        (data) => {
            // If action is "get_snapshots", season must be present
            if (data.action === 'get_snapshots' && data.season === undefined) {
                return false;
            }
            return true;
        },
        {
            message: 'season must be present if action is "get_snapshots"',
            path: ['season'], // This specifies which field the error message should be associated with
        }
    );
