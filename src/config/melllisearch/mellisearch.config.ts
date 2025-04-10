import { MeiliSearch } from 'meilisearch';
import { config } from '../generalconfig';

// Create the MeiliSearch melliClient
export const melliClient = new MeiliSearch({
    host: config.MELLISSEARCH.host,
    apiKey: config.MELLISSEARCH.masterKey,
});

const userIndex = "users";

export const connectMeilisearch = async () => {
    try {
        await melliClient.createIndex(userIndex, { primaryKey: 'userId' })
        await melliClient.index('users' ).updateSearchableAttributes([
            'username', 'name', 'description'
        ]);

        await melliClient.index('users').updateSortableAttributes([
            'followerCount'
        ]);

        await melliClient.index('flicks').updateSearchableAttributes([
            'description', 'altText', 'taggedUserNames', 'username', 'name'
        ]);

        await melliClient.index('flicks').updateSortableAttributes([
            'likeCount', 'commentCount', 'repostCount'
        ]);
        console.log('Meilisearch connected successfully')
    } catch (err: any) {
        throw new Error(`Failed to connect to meilisearch ${err}`);
    }
}

