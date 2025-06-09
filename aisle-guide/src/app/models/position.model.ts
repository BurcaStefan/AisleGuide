export interface Position {
  row: number;
  col: number;
}

export interface PathNode extends Position {
  distance: number;
  previous?: PathNode;
}
