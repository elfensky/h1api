import { z } from 'zod';

export const schema_rebroadcast = z
    .object({
        action: z.enum(['get_campaign_status', 'get_snapshots']),
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
            message: 'season must be present if action is [get_snapshots]',
            path: ['season'], // This specifies which field the error message should be associated with
        }
    );

//
export const schema_defend_event_unique = z.string().refine(
    (id) => {
        const parsed = parseInt(id, 10);
        return !isNaN(parsed) && id.trim() !== '';
    },
    {
        message: `provided defend event [:id] is not parsable to an integer`,
        path: [':id'],
    }
);
//
export const schema_attack_event_unique = z.string().refine(
    (id) => {
        const parsed = parseInt(id, 10);
        return !isNaN(parsed) && id.trim() !== '';
    },
    {
        message: `provided attack event [:id] is not parsable to an integer`,
        path: [':id'],
    }
);
//
