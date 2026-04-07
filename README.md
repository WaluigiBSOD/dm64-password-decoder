# Dr. Mario 64 Password Decoder

JavaScript port of [Dr. Mario 64 Password Tool](https://github.com/WaluigiBSOD/dm64-password-tool), including only decoding functionality.

## Program

Both this program and [Dr. Mario 64 Password Tool](https://github.com/WaluigiBSOD/dm64-password-tool) were written using the original source code of the game that leaked in July 2020 as reference.

The original implementation of the password generation algorithm inside the source code of the game can be found at `bbgames.7z\bbgames.tar\d1\routefree\bbgames\depot\dm64\src\passwd.c`, for some reason the password decoding algorithm is absent but it can be easily obtained from the generation one.

### Obtaining a Password In-Game

After either winning or losing a Classic, Score Attack or Marathon game press **Z**, **R**, **L** and **D-Pad Left** together when the Replay menu is on screen.

More info is available [on TCRF](https://tcrf.net/Dr._Mario_64#Passwords).

## License

The source code is released under the GNU General Public License v 3.0 (see [`LICENSE`](https://github.com/WaluigiBSOD/dm64-password-decoder/blob/master/LICENSE) in the root of the repository for a copy of the license and for more information).

### Disclaimer

This program may contain copyrighted material, the use of which may not have been specifically authorized by the copyright owner.
This material is available in an effort to research on the password system of the videogame "Dr. Mario 64", to provide a tool that allows to know about it more deeply than before.

This should constitute a ‘fair use’ of any such copyrighted material (referenced and provided for in section 107 of the US Copyright Law).

If you wish to use any copyrighted material from this program for purposes of your own that go beyond ‘fair use’, you must obtain expressed permission from the copyright owner.