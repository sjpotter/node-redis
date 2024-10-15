import { CommandParser } from '../client/parser';
import { ArrayReply, BlobStringReply, Command } from '../RESP/types';
import { RedisVariadicArgument } from './generic-transformers';

export default {
  IS_READ_ONLY: true,
  parseCommand(parser: CommandParser, keys: RedisVariadicArgument) {
    parser.setCachable();
    parser.push('SINTER');
    parser.pushKeys(keys);
  },
  transformReply: undefined as unknown as () => ArrayReply<BlobStringReply>
} as const satisfies Command;
