import { CommandParser } from '../client/parser';
import { RedisArgument, NumberReply, Command } from '../RESP/types';

export default {
  IS_READ_ONLY: true,
  parseCommand(parser: CommandParser, key: RedisArgument) {
    parser.setCachable();
    parser.push('HLEN');
    parser.pushKey(key);
  },
  transformReply: undefined as unknown as () => NumberReply
} as const satisfies Command;
