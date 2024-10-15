import { CommandParser } from '../client/parser';
import { RedisArgument, BlobStringReply, NullReply, Command } from '../RESP/types';

export default {
  IS_READ_ONLY: true,
  parseCommand(parser: CommandParser, key: RedisArgument, index: number) {
    parser.setCachable();
    parser.push('LINDEX');
    parser.pushKey(key);
    parser.push(index.toString());
  },
  transformReply: undefined as unknown as () => BlobStringReply | NullReply
} as const satisfies Command;
