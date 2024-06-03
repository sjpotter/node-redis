import { TuplesToMapReply, BlobStringReply, SetReply, NumberReply, ArrayReply, UnwrapReply, Resp2Reply, Command, SimpleStringReply } from '../RESP/types';

type TrackingInfo = TuplesToMapReply<[
  [SimpleStringReply<'flags'>, SetReply<BlobStringReply>],
  [SimpleStringReply<'redirect'>, NumberReply],
  [SimpleStringReply<'prefixes'>, ArrayReply<BlobStringReply>]
]>;

export default {
  FIRST_KEY_INDEX: undefined,
  IS_READ_ONLY: true,
  transformArguments() {
    return ['CLIENT', 'TRACKINGINFO'];
  },
  transformReply: {
    2: (reply: UnwrapReply<Resp2Reply<TrackingInfo>>) => ({
      flags: reply[1],
      redirect: reply[3],
      prefixes: reply[5]
    }),
    3: undefined as unknown as () => TrackingInfo
  }
} as const satisfies Command;
