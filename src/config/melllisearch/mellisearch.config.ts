import { MeiliSearch } from 'meilisearch';
import { config } from '../generalconfig';

// Create the MeiliSearch client
const client = new MeiliSearch({
    host: config.MELLISSEARCH.host,
    apiKey: config.MELLISSEARCH.masterKey,
});

const indexName = config.MELLISSEARCH.indexName;

export const connectMeilisearch = async () => {
    try {
        await client.createIndex(indexName, { primaryKey: 'merchantId' })
        await client.index(indexName).updateFilterableAttributes([
           
        ])
        console.log('Meilisearch connected successfully')
    } catch (err: any) {
        throw new Error(`Failed to connect to meilisearch ${err}`);
    }
}
