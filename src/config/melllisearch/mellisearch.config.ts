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

const FILTERABLE_ATTRIBUTES: Record<keyof typeof INDEXES, string[]> = {
    USERS: ['userId', 'username', 'isDeactivated'],
    FLICKS: ['flickId', 'userId'],
    HASHTAG: ['hashtagId'],
    QUESTS: ['questId', 'userId', 'mode'],
    SONGS: ['songId'],
};

const SEARCHABLE_ATTRIBUTES: Record<keyof typeof INDEXES, string[]> = {
    USERS: ['name', 'username'],
    FLICKS: ['username', 'name', 'location', 'descriptionText', 'taggedUsers', 'alts'],
    HASHTAG: ['value'],
    QUESTS: ['title', 'description', 'username', 'location', 'name', 'alts'],
    SONGS: ['name', 'artist'],
};

const indexCache: Partial<Record<keyof typeof INDEXES, Index>> = {};

const configureIndexSettings = async (index: Index, key: keyof typeof INDEXES) => {
    const indexName = INDEXES[key];

    try {
        // Update settings only if they're different from current
        await index.updateFilterableAttributes(FILTERABLE_ATTRIBUTES[key]);
        console.log(`✅ Configured filterable attributes for ${indexName}`);
    } catch (error) {
        console.error(`❌ Failed to configure filterable attributes for ${indexName}:`, error);
        throw error; // Rethrow if you want setup to fail for this index
    }

    try {
        await index.updateSearchableAttributes(SEARCHABLE_ATTRIBUTES[key]);
        console.log(`✅ Configured searchable attributes for ${indexName}`);
    } catch (error) {
        console.error(`❌ Failed to configure searchable attributes for ${indexName}:`, error);
        throw error;
    }
};

const setupIndex = async (key: keyof typeof INDEXES) => {
    const indexName = INDEXES[key];
    let index: Index;

    try {
        index = await melliClient.getIndex(indexName);
        console.log(`ℹ️ Index ${indexName} already exists`);
    } catch {
        console.log(`ℹ️ Creating index ${indexName}`);
        const task = await melliClient.createIndex(indexName, {
            primaryKey: PRIMARY_KEYS[key],
        });
        await melliClient.waitForTask(task.taskUid);
        index = melliClient.index(indexName);
    }

    await configureIndexSettings(index, key);
    indexCache[key] = index;
};

export const connectMeilisearch = async () => {
    try {
        const results = await Promise.allSettled(
            Object.keys(INDEXES).map((k) => setupIndex(k as keyof typeof INDEXES))
        );

        // Log results for debugging
        results.forEach((result, i) => {
            const indexName = INDEXES[Object.keys(INDEXES)[i] as keyof typeof INDEXES];
            if (result.status === 'rejected') {
                console.error(`❌ Failed to setup index ${indexName}:`, result.reason);
            }
        });

        // Check if all succeeded
        if (results.some(result => result.status === 'rejected')) {
            console.warn('⚠️ Some Meilisearch indexes failed to setup, but continuing');
            // Consider whether to throw or continue based on your requirements
        }

        console.log('✅ Meilisearch connection initialized');
    } catch (err) {
        console.error('❌ Error connecting to Meilisearch:', err);
        throw new Error(`Failed to connect to Meilisearch: ${err instanceof Error ? err.message : String(err)}`);
    }
};

export const getIndex = (key: keyof typeof INDEXES): Index => {
    const index = indexCache[key];
    if (!index) throw new Error(`Index "${key}" not initialized. Did you forget to call connectMeilisearch()?`);
    return index;
};

export const verifyMeilisearchSettings = async () => {
    for (const [key, indexName] of Object.entries(INDEXES)) {
        const index = getIndex(key as keyof typeof INDEXES);
        try {
            const [filterable, searchable] = await Promise.all([
                index.getFilterableAttributes(),
                index.getSearchableAttributes()
            ]);
            console.log(`ℹ️ ${indexName} filterable:`, filterable);
            console.log(`🔍 ${indexName} searchable:`, searchable);
        } catch (error) {
            console.error(`❌ Failed to verify settings for ${indexName}:`, error);
        }
    }
};