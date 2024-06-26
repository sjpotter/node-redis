import { NullReply, BlobStringReply, ArrayReply, Command, RedisArgument } from '@redis/client/dist/lib/RESP/types';

export interface JsonTypeOptions {
  path?: RedisArgument;
}

export default {
  FIRST_KEY_INDEX: 1,
  IS_READ_ONLY: true,
  transformArguments(key: RedisArgument, options?: JsonTypeOptions) {
    const args = ['JSON.TYPE', key];

    if (options?.path) {
      args.push(options.path);
    }

    return args;
  },
  transformReply: {
    2: undefined as unknown as () => NullReply | BlobStringReply | ArrayReply<BlobStringReply>,
    3: undefined as unknown as () => ArrayReply<NullReply | BlobStringReply | ArrayReply<BlobStringReply | NullReply>>
  },
  unstableResp3Module: true
} as const satisfies Command;

