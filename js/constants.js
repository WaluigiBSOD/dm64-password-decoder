// Dr. Mario 64 Password Decoder
// Copyright (C) 2020-2021 WaluigiBSOD (waluigibsod.github.io)
//
// This file is part of Dr. Mario 64 Password Decoder.
//
// Dr. Mario 64 Password Decoder is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Dr. Mario 64 Password Decoder is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

// Constants

const PasswordCharacters = "ABCDEFGHJKLMNPQRSTVWXY1234567890";

const TableMaskHigh = [
	0x0B626835,
	0x0763337A,
	0x0F4D6F49,
	0x06343069
];

const TableMaskMiddle = [
	0x03DF4B61,
	0x040E7254,
	0x0A456B4F,
	0x092E476F
];

const TableMaskLower = [
	0x08C26B8A,
	0x0D73B9A1,
	0x053AD652,
	0x024DF62E
];

const TableMaskFrameCountLower = [
	0x81021794,
	0xF4967A99,
	0xB403DEC6,
	0x7FD52F56,
	0x5086D67F,
	0xD10A4924,
	0x939AEA49,
	0x24925292,
	0x492494A4,
	0x92492529,
	0x79775FFF,
	0x00942FFE,
	0xB95EA2BC,
	0xC3EB108E,
	0xA377F5BF,
	0xEFAC4D93,
	0x6307CC7F,
	0xBAE8741C,
	0x46B6AF5C,
	0x8F73890D,
	0xFEA85A79,
	0x5536EA9C,
	0xC7F04155,
	0x3A6E4D2D,
	0xC567B808,
	0x1AEE23E9,
	0x7F8454BA,
	0xA7586398,
	0x69A0CCE8,
	0xE7FF0027,
	0xF90A7044,
	0x62C46329
];

const TableMaskFrameCountUpper = [
	0xE435FBDF,
	0xE2384C76,
	0xD702AE2A,
	0x9E8D9B77,
	0xED3B7F7A,
	0x3DA8B55B,
	0xD8A8F1CA,
	0xB42CF9E0,
	0x4FA87E8F,
	0xCC992492,
	0x53B51492,
	0x4924A4B8,
	0xFF00CE0F,
	0x8ADD0B06,
	0x8FA63E2B,
	0x78205490,
	0x22350C22,
	0x3505266A,
	0x33505A8C,
	0xD4D5240B,
	0x0FEB4FF4,
	0x767F5FFE,
	0xFAF5B816,
	0x27D68FE8,
	0xCCFEB8FF,
	0x00A9B536,
	0x5B32E2F9,
	0xC35FEAC7,
	0xD0B7E2D5,
	0xD0AE7BEA,
	0xCE95D9FD,
	0x61F91740
];

const GameModeClassic = 0;
const GameModeScoreAttack = 1;
const GameModeMarathon = 2;

const GameLevelEasy = 0;
const GameLevelNormal = 1;
const GameLevelHard = 2;

const SpeedLow = 0;
const SpeedMedium = 1;
const SpeedHigh = 2;

const VirusLevelMinimum = 0;
const VirusLevelMaximum = 24;

const ScoreMinimum = 0;
const ScoreMaximum = 999999;

const TimeMinimum = 0;
const TimeMaximum = 59999;

const NameFontCharacterMinimum = 0;
const NameFontCharacterMaximum = 322;

const FrameCountMinimum = 0;
const FrameCountMaximum = 1023;

// Result Table Entry Format
//
// 0: Caption
// 1: Caption ID (optional)
// 2: ID of the area to be filled by the decoder

const ResultEntries = [
	[
		"Mode", "", "mode"
	],
	
	[
		"Level", "level-text", "level"
	],
	
	[
		"Speed", "", "speed"
	],
	
	[
		"Score", "", "score"
	],
	
	[
		"Time", "", "time"
	],
	
	[
		"Player Name", "", "name"
	],
	
	[
		"Frame Count (modulo 1024)", "", "framecount"
	]
]