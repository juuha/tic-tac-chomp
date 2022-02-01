# tic-tac-chomp

## A Discord bot for a more complex tic-tac-toe game using the new Discord buttons

The game consists of a 3x3 board with 3 sizes of pieces. Similarly to regular tic-tac-toe 3 in a row wins. The difference is that larger pieces can eat smaller pieces, which then replaces that piece with the larger piece. Pieces can also be moved to a different tile, however smaller pieces that were eaten will escape from a moving piece's mouth and reappear on the original tile. Therefore the player must remember which tiles have which pieces, when they can only see the largest piece on each tile.

## Commands

- &battle <@name> - Starts a game with given person.
- &me - Shows information about yourself.
- &leaderboard - Shows the current top chompers (and you if you aren't in the top 5).

There are shorthand commands for your comfort:
- &b for battle
- &lb for leaderboard.
