import { getIndex } from "../config/melllisearch/mellisearch.config";
import { FLICKS, IMediaSchema } from "../models/Flicks/flicks.model";
import { SONG } from "../models/Song/song.model";
import { USER } from "../models/User/user.model";
import { HASHTAGS } from "../models/User/userHashTag.model";

async function reindexUsers() {
    const users = await USER.find({}, "-password").lean();
    if (!users.length) {
        console.log("No users found.");
        return;
    }
    // Remove sensitive fields, fix types as needed
    const payload = users.map(u => ({
        userId: u._id.toString(),
        ...u,
        dob: u.dob ? new Date(u.dob).toISOString() : undefined,
    }));
    const userIndex = getIndex("USERS");
    await userIndex.addDocuments(payload);
    console.log(`Pushed ${payload.length} users to Meilisearch`);
}


async function  reIndexSongs() {
    const songs = await SONG.find({}).lean();
    if (!songs.length) {
        console.log("No songs found.");
        return;
    }
    const payload = songs.map(s => ({
        songId: s._id.toString(),
        ...s,
    }));
    const songIndex = getIndex("SONGS");
    await songIndex.addDocuments(payload);
    console.log(`Pushed ${payload.length} songs to Meilisearch`);
}   

async function reIndexFlicks() {
    const flickIndex = getIndex("FLICKS");
    const pageSize = 500;
    let page = 0;
    while (true) {
        const flicks = await FLICKS.find({})
            .populate<{ user: { username: string; photo: string; name: string; _id: string } }>("user", "username photo name _id")
            .skip(page * pageSize)
            .limit(pageSize)
            .lean();
        if (!flicks.length) break;

        const payload = flicks.map(flick => {
            const {
                user, media = [], description = [], _id, ...restFlick
            } = flick;
            return {
                ...restFlick,
                media,
                descriptionText: description.map((desc: any) => desc.text),
                taggedUsers: (media as IMediaSchema[]).map(m =>
                    m?.taggedUsers?.map(u => u.text) || []
                ).flat(),
                alts: (media as IMediaSchema[]).map((m) => m?.alt || []).flat(),
                userId: user._id?.toString(),
                username: user?.username,
                name: user?.name,
                photo: user?.photo,
                flickId: _id.toString(),
            };
        });

        await flickIndex.addDocuments(payload);
        page++;
        console.log(`Indexed batch ${page}`);
    }
    console.log("Flicks reindex complete.");
}
async function reIndexHashtags() {
    const hashtags = await HASHTAGS.find({}).lean();
    if (!hashtags.length) {
        console.log("No hashtags found.");
        return;
    }
    const payload = hashtags.map(h => ({
        hashtagId: h._id.toString(),
        ...h,
    }));
    const hashtagIndex = getIndex("HASHTAG");
    await hashtagIndex.addDocuments(payload);
    console.log(`Pushed ${payload.length} hashtags to Meilisearch`);
}



export const runMellisearchMigration = async () => {
    try {
        console.log("Starting Meilisearch migration...");
        console.log("Reindexing Users...");
        await reindexUsers();
        console.log("Reindexing Songs...");
        await reIndexSongs();
        console.log("Reindexing Flicks...");
        await reIndexFlicks();
        console.log("Reindexing Hashtags...");
        await reIndexHashtags();
        console.log("Meilisearch migration completed successfully.");
    } catch (error) {
        console.error("Error during Meilisearch migration:", error);
        throw error;
    }   
}