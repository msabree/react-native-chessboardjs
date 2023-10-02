import type { FenPosition } from '../@types';

export const getImage = (piece: FenPosition) => {
  switch (piece) {
    case 'r':
      return require('../assets/br.png');
    case 'n':
      return require('../assets/bn.png');
    case 'b':
      return require('../assets/bb.png');
    case 'q':
      return require('../assets/bq.png');
    case 'k':
      return require('../assets/bk.png');
    case 'p':
      return require('../assets/bp.png');
    case 'R':
      return require('../assets/wr.png');
    case 'N':
      return require('../assets/wn.png');
    case 'B':
      return require('../assets/wb.png');
    case 'Q':
      return require('../assets/wq.png');
    case 'K':
      return require('../assets/wk.png');
    case 'P':
      return require('../assets/wp.png');
    // should never happen
    default:
      return require('../assets/wp.png');
  }
};
