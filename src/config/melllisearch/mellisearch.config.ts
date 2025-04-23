import { MeiliSearch, Index } from 'meilisearch';
import { config } from '../generalconfig';

const melliClient = new MeiliSearch({
    host: config.MELLISSEARCH.host,
    apiKey: config.MELLISSEARCH.masterKey,
});

const INDEXES = {
    USERS: 'users',
    FLICKS: 'flicks',
    HASHTAG: 'hashtag',
    QUESTS: 'quests',
    SONGS: 'songs',
} as const;

const PRIMARY_KEYS: Record<keyof typeof INDEXES, string> = {
    USERS: 'userId',
    FLICKS: 'flickId',
    HASHTAG: 'hashtagId',
    QUESTS: 'questId',
    SONGS: 'songId',
};

// Internal cache of index instances
const indexCache: Partial<Record<keyof typeof INDEXES, Index>> = {};

const setupIndex = async (key: keyof typeof INDEXES) => {
    const indexName = INDEXES[key];

    try {
        // Try to retrieve the index (if it exists)
        await melliClient.getIndex(indexName);
    } catch {
        // If it doesn't exist, create it
        const task = await melliClient.createIndex(indexName, {
            primaryKey: PRIMARY_KEYS[key],
        });
        await melliClient.waitForTask(task.taskUid);
    }

    // Cache the index for later use
    indexCache[key] = melliClient.index(indexName);
};

// Init all indexes at startup
export const connectMeilisearch = async () => {
    try {
        const result = await Promise.allSettled(
            Object.keys(INDEXES).map((k) => setupIndex(k as keyof typeof INDEXES))
        );

        if (result.some((res) => res.status === 'rejected')) {
            throw new Error('Failed to setup Meilisearch indexes');
        }

        console.log('✅ Meilisearch indexes set up successfully');
    } catch (err: any) {
        console.error('❌ Error connecting to Meilisearch:', err);
        throw new Error(`Failed to connect to Meilisearch: ${err}`);
    }
};

// Safe accessor for indexes
export const getIndex = (key: keyof typeof INDEXES): Index => {
    const index = indexCache[key];
    if (!index) throw new Error(`Index "${key}" not initialized. Did you forget to call connectMeilisearch()?`);
    return index;
};
