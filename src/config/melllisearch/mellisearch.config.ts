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

// Define filterable attributes for each index
const FILTERABLE_ATTRIBUTES: Record<keyof typeof INDEXES, string[]> = {
    USERS: ['userId', 'username'],
    FLICKS: ['flickId', 'userId'],
    HASHTAG: ['hashtagId'],
    QUESTS: ['questId', 'userId', 'mode'],
    SONGS: ['songId'],
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

    // Get the index instance
    const index = melliClient.index(indexName);

    // Configure filterable attributes
    try {
        await index.updateFilterableAttributes(FILTERABLE_ATTRIBUTES[key]);
        console.log(`✅ Configured filterable attributes for ${indexName}`);
    } catch (error) {
        console.error(`❌ Failed to configure filterable attributes for ${indexName}:`, error);
        // Continue even if this fails - client-side filtering will be used as fallback
    }

    // Cache the index for later use
    indexCache[key] = index;
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

// Optional: Function to verify settings
export const verifyMeilisearchSettings = async () => {
    for (const [key, indexName] of Object.entries(INDEXES)) {
        const index = getIndex(key as keyof typeof INDEXES);
        try {
            const settings = await index.getFilterableAttributes();
            console.log(`ℹ️ ${indexName} filterable attributes:`, settings);
        } catch (error) {
            console.error(`❌ Failed to verify settings for ${indexName}:`, error);
        }
    }
};