export enum Screen {
  MainMenu = 'MAIN_MENU',
  NewGame = 'NEW_GAME',
  Game = 'GAME',
  OnlineMenu = 'ONLINE_MENU',
}

export enum GameMode {
  VsComputer = 'VS_COMPUTER',
  VsPlayerLocal = 'VS_PLAYER_LOCAL',
  VsPlayerOnline = 'VS_PLAYER_ONLINE',
}

export enum Player {
  Player1 = 'Player 1',
  Player2 = 'Player 2',
  Computer = 'Computer',
}

export interface OnlineGameState {
  players: { [key: string]: { name: string; score: number } };
  playerOrder: string[];
  currentPlayerId: string;
  diceValue: number;
  targetScore: number;
  winnerId: string | null;
  status: 'waiting' | 'playing' | 'finished';
}