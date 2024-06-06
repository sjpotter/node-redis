import { RedisArgument, TuplesToMapReply, NumberReply, UnwrapReply, Resp2Reply, Command, SimpleStringReply } from '@redis/client/dist/lib/RESP/types';

export type CmsInfoReplyMap = TuplesToMapReply<[
  [SimpleStringReply<'width'>, NumberReply],
  [SimpleStringReply<'depth'>, NumberReply],
  [SimpleStringReply<'count'>, NumberReply]
]>;

export interface CmsInfoReply {
  width?: NumberReply;
  depth?: NumberReply;
  count?: NumberReply;
}
 
export default {
  FIRST_KEY_INDEX: 1,
  IS_READ_ONLY: true,
  transformArguments(key: RedisArgument) {
    return ['CMS.INFO', key];
  },
  transformReply: {
    2(reply: UnwrapReply<Resp2Reply<CmsInfoReplyMap>>): CmsInfoReply {
      return {
        width: reply[1],
        depth: reply[3],
        count: reply[5]
      };
    },
    3(reply: UnwrapReply<CmsInfoReplyMap>): CmsInfoReply {
      if (reply instanceof Map) {
        throw new Error("CMS.INFO shouldn't be used with type mapping to map or array");
/*
        return {
          width: reply.get("width" as unknown as BlobStringReply<'width'>),
          depth: reply.get("depth" as unknown as BlobStringReply<"depth">),
          count: reply.get("count" as unknown as BlobStringReply<"count">)
        }
*/
      } else if (reply instanceof Array) {
        throw new Error("CMS.INFO shouldn't be used with type mapping to map or array");
/*
        return {
          width: reply[1],
          depth: reply[3],
          count: reply[5]
        }
*/
      } else {
        return {
          width: reply['width'],
          depth: reply['depth'],
          count: reply['count']
        };
      }
    }
  }
} as const satisfies Command;
