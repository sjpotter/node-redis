import { CommandParser } from '@redis/client/lib/client/parser';
import { RedisArgument, Command } from '@redis/client/lib/RESP/types';
import { transformBooleanReply } from '@redis/client/lib/commands/generic-transformers';

export default {
  IS_READ_ONLY: true,
  parseCommand(parser: CommandParser, key: RedisArgument, item: RedisArgument) {
    parser.push('BF.EXISTS');
    parser.pushKey(key);
    parser.push(item);
  },
  transformReply: transformBooleanReply
} as const satisfies Command;
