import { MeiliSearch } from 'meilisearch';
import { config } from '../generalconfig';

// Create the MeiliSearch melliClient
export const melliClient = new MeiliSearch({
    host: config.MELLISSEARCH.host,
    apiKey: config.MELLISSEARCH.masterKey,
});

const INDEXES = {
    USERS: 'users',
    FLICKS: 'flicks',
    HASHTAG: 'hashtag',
    QUESTS: 'quests',
    SONGS: 'songs',
};

const PRIMARY_KEYS = {
    [INDEXES.USERS]: 'userId',
    [INDEXES.FLICKS]: 'flickId',
    [INDEXES.HASHTAG]: 'hashtagId',
    [INDEXES.QUESTS]: 'questId',
    [INDEXES.SONGS]: 'songId',
};

const setupIndex = async (indexName: string) => {
    try {
        await melliClient.getIndex(indexName);
    } catch {
        const task = await melliClient.createIndex(indexName, {
            primaryKey: PRIMARY_KEYS[indexName],
        });
        await melliClient.waitForTask(task.taskUid);
    }
};


export const userIndex = melliClient.index('users');
export const flicksIndex = melliClient.index('flicks');
export const hashtagIndex = melliClient.index('hashtag');
export const questsIndex = melliClient.index('quests');
export const songsIndex = melliClient.index('songs');

export const connectMeilisearch = async () => {
    try {
        let  result  =  await Promise.allSettled(Object.keys(INDEXES).map(setupIndex));
        if (result.some((res) => res.status === 'rejected')) {
            throw new Error('Failed to setup Meilisearch indexes');
        }
        console.log('Meilisearch indexes setup successfully');
    } catch (err: any) {
        throw new Error(`Failed to connect to meilisearch ${err}`);
    }
}

