import Parser from "rss-parser";
import OSS from "ali-oss";

export const handle = async (
  _,
  context,
  callback: (err: any, data: any) => void
) => {
  const feed = await parseFeed();
  await persist(feed, context);
  callback(null, `Retrieved ${feed.items.length} items from ${feed.title}`);
};

const parseFeed = async () => {
  const feed = await new Parser().parseURL(
    "http://feeds.bbci.co.uk/news/world/rss.xml"
  );
  console.log(`Retrieved ${feed.items.length} items from ${feed.title}`);
  return feed;
};

export const persist = async (body: any, context: any) => {
  const date = new Date();
  const fileName = `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDay()}/${date.getHours()}${date.getMinutes()}.json`;

  const config = {
    region: `oss-${context.region}`,
    accessKeyId: context.credentials.accessKeyId,
    accessKeySecret: context.credentials.accessKeySecret,
    bucket: process.env.BUCKET_NAME,
    stsToken: context.credentials.securityToken,
  };
  const client = new OSS(config);

  try {
    await client.put(fileName, Buffer.from(JSON.stringify(body, null, 2)));
    console.log(`Saved ${fileName}`);
  } catch (err) {
    console.error("Failed to put", err);
  }
};
