const rotate = (board: { square: string }[][]) => {
  return (board[0] as any).map((_: any, index: number) =>
    board.map((row) => row[index]).reverse()
  );
};

export const flipBoard = (board: { square: string }[][]) => {
  // Flip twice to get black on bottom;
  return rotate(rotate(board));
};
