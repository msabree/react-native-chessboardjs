const rotate = (matrix: any[][]) => {
  return matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
};

export const flipBoard = (board: any[][]) => {
  // Flip twice to get black on bottom;
  return rotate(rotate(board));
};
