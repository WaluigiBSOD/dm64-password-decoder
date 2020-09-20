// Dr. Mario 64 Password Decoder
// Copyright (C) 2020 WaluigiBSOD (waluigibsod.github.io)
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

const Version = "1.0 Beta";

const PasswordCharacters = "ABCDEFGHJKLMNPQRSTVWXY1234567890";

const TableMaskHigh = [
    0x0B626835, 0x0763337A, 0x0F4D6F49, 0x06343069
];

const TableMaskMiddle = [
    0x03DF4B61, 0x040E7254, 0x0A456B4F, 0x092E476F
];

const TableMaskLower = [
    0x08C26B8A, 0x0D73B9A1, 0x053AD652, 0x024DF62E
];

const TableMaskFrameCountLower = [
    0x81021794, 0xF4967A99, 0xB403DEC6, 0x7FD52F56, 0x5086D67F, 0xD10A4924, 0x939AEA49, 0x24925292,
    0x492494A4, 0x92492529, 0x79775FFF, 0x00942FFE, 0xB95EA2BC, 0xC3EB108E, 0xA377F5BF, 0xEFAC4D93,
    0x6307CC7F, 0xBAE8741C, 0x46B6AF5C, 0x8F73890D, 0xFEA85A79, 0x5536EA9C, 0xC7F04155, 0x3A6E4D2D,
    0xC567B808, 0x1AEE23E9, 0x7F8454BA, 0xA7586398, 0x69A0CCE8, 0xE7FF0027, 0xF90A7044, 0x62C46329
];

const TableMaskFrameCountUpper = [
    0xE435FBDF, 0xE2384C76, 0xD702AE2A, 0x9E8D9B77, 0xED3B7F7A, 0x3DA8B55B, 0xD8A8F1CA, 0xB42CF9E0,
    0x4FA87E8F, 0xCC992492, 0x53B51492, 0x4924A4B8, 0xFF00CE0F, 0x8ADD0B06, 0x8FA63E2B, 0x78205490,
    0x22350C22, 0x3505266A, 0x33505A8C, 0xD4D5240B, 0x0FEB4FF4, 0x767F5FFE, 0xFAF5B816, 0x27D68FE8,
    0xCCFEB8FF, 0x00A9B536, 0x5B32E2F9, 0xC35FEAC7, 0xD0B7E2D5, 0xD0AE7BEA, 0xCE95D9FD, 0x61F91740
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

// Flags

var ValidPassword = false;

// Functions

function _SetVersion() {
	document.getElementById("version").innerHTML = "Version " + Version;
}

function _ShowResult() {
	document.getElementById("error").innerHTML = "";
	document.getElementById("result").style = "";
}

function _HideResult() {
	document.getElementById("result").style = "visibility: hidden;";
}

function _WriteError(CurrentError = "", Prompt = false) {
	_HideResult();
	
	if (!Prompt)
		document.getElementById("error").innerHTML = "<br>Error";
	
	if (CurrentError != "")
		if (Prompt)
			document.getElementById("error").innerHTML = "<br>" + CurrentError;
		else
			document.getElementById("error").innerHTML += ": " + CurrentError;
}

function _ResetInput() {
	if (ValidPassword) {
		document.getElementById("code").value = "";
		
		_WriteError("Enter the password",true);
	}
}

function _DecodePassword(Password = "") {
	ValidPassword = false;
	
	if (Password == "")
		Password = document.getElementById("code").value;
	
	Password = Password.toUpperCase();
	
	document.getElementById("code").value = Password;
	
	if (Password.length == 20) {
		var PasswordChunkHigh = 0;
		var PasswordChunkMedium = 0;
		var PasswordChunkLow = 0;
		
		var FrameCountX = 0;
		var FrameCountY = 0;
		
		var CheckSum = 0;
		var CheckSumLastTwoBits = 0;
		var TestCheckSum = 0;
		
		var GameMode = 0;
		var Level = 0;
		var Speed = 0;
		var Score = 0;
		var Time = 0;
		var FrameCount = 0;
		
		var Name = [0,0,0,0];
		
		var TemporaryX;
		var TemporaryY;
		
		// Frame Count (modulo 1024)
		
		TemporaryX = PasswordCharacters.indexOf(Password.charAt(0));
		TemporaryY = PasswordCharacters.indexOf(Password.charAt(19));
		
		if (TemporaryX > -1 && TemporaryY > -1) {
			FrameCount = TemporaryX | (TemporaryY << 5);
			
			FrameCountX = TemporaryX;
			FrameCountY = TemporaryY;
		} else {
			_WriteError("Wrong character(s) in password");
			
			return;
		}
		
		// Password Chunk High
			
		for (var i=1;i<=6;i++) {
			TemporaryX = PasswordCharacters.indexOf(Password.charAt(i));
			
			if (TemporaryX > -1) {
				PasswordChunkHigh |= TemporaryX << 25;
				if (i < 6)
					PasswordChunkHigh >>= 5;
			} else {
				_WriteError("Wrong character(s) in password");
				
				return;
			}
		}
		
		// Password Chunk Medium
			
		for (var i=7;i<=12;i++) {
			TemporaryX = PasswordCharacters.indexOf(Password.charAt(i));
			
			if (TemporaryX > -1) {
				PasswordChunkMedium |= TemporaryX << 25;
				if (i < 12)
					PasswordChunkMedium >>= 5;
			} else {
				_WriteError("Wrong character(s) in password");
				
				return;
			}
		}
		
		// Password Chunk Low
			
		for (var i=13;i<=18;i++) {
			TemporaryX = PasswordCharacters.indexOf(Password.charAt(i));
			
			if (TemporaryX > -1) {
				PasswordChunkLow |= TemporaryX << 25;
				if (i < 18)
					PasswordChunkLow >>= 5;
			} else {
				_WriteError("Wrong character(s) in password");
				
				return;
			}
		}
		
		// Constant (frame count)
		
		FrameCountConstant = TableMaskFrameCountLower[FrameCountX] ^ TableMaskFrameCountUpper[FrameCountY];
		
		PasswordChunkHigh ^= FrameCountConstant;
		PasswordChunkMedium ^= FrameCountConstant;
		PasswordChunkLow ^= FrameCountConstant;
		
		// Constant (checksum)
		
		CheckSumLastTwoBits = (PasswordChunkHigh >> 28) & 0x3;
		
		PasswordChunkHigh ^= TableMaskHigh[CheckSumLastTwoBits];
		PasswordChunkMedium ^= TableMaskMiddle[CheckSumLastTwoBits];
		PasswordChunkLow ^= TableMaskLower[CheckSumLastTwoBits];
		
		// Time

		Time = PasswordChunkLow & 0xFFFF;
		PasswordChunkLow >>= 16;
		
		// Level (1/2)

		Level = PasswordChunkLow & 0x3;
		PasswordChunkLow >>= 2;
		
		// Game mode

		GameMode = PasswordChunkLow & 0x3;
		PasswordChunkLow >>= 2;
		
		// Speed

		Speed = PasswordChunkLow & 0x3;
		PasswordChunkLow >>= 2;
		
		// CheckSum (1/2)

		CheckSum = PasswordChunkLow & 0xFF;
		
		// Level (2/2)

		Level = (Level << 6) | (PasswordChunkMedium & 0x3F);
		PasswordChunkMedium >>= 6;
		
		// Name

		Name[1] = PasswordChunkMedium & 0xFF;
		PasswordChunkMedium >>= 8;

		Name[2] = PasswordChunkMedium & 0xFF;
		PasswordChunkMedium >>= 8;

		Name[3] = PasswordChunkMedium & 0xFF;

		Name[0] = PasswordChunkHigh & 0xFF;
		PasswordChunkHigh >>= 8;
		
		// Score (2/2)

		Score = PasswordChunkHigh & 0xFFFFF;
		PasswordChunkHigh >>= 20;
		
		// CheckSum (2/2)

		CheckSum = (CheckSum << 2) | (PasswordChunkHigh & 0x3);

		CheckSum &= 0x3FF;
		
		// Test CheckSum
		
		TestCheckSum = GameMode + Level + Speed;
		TestCheckSum += (Score & 0x3FF);
		TestCheckSum += ((Score >> 10) & 0x3FF);
		TestCheckSum += (Time & 0xFF);
		TestCheckSum += ((Time >> 8) & 0xFF);
		TestCheckSum += Name[0] + Name[1] + Name[2] + Name[3];
		TestCheckSum &= 0x3FF;
		
		if (CheckSum == TestCheckSum) {
			// Mode
			
			if (GameMode == GameModeClassic)
				document.getElementById("mode").innerHTML = "Classic";
			else if (GameMode == GameModeScoreAttack)
				document.getElementById("mode").innerHTML = "Score Attack";
			else if (GameMode == GameModeMarathon)
				document.getElementById("mode").innerHTML = "Marathon";
			else {
				_WriteError("Invalid game mode");
				
				return;
			}
			
			// Game Level
			
			if (GameMode != GameModeClassic) {
				document.getElementById("leveltext").innerHTML = "Game Level:";

				if (Level == GameLevelEasy)
					document.getElementById("level").innerHTML = "Easy";
				else if (Level == GameLevelNormal)
					document.getElementById("level").innerHTML = "Normal";
				else if (Level == GameLevelHard)
					document.getElementById("level").innerHTML = "Hard";
				else {
					_WriteError("Invalid game level");
					
					return;
				}
			} else {
				document.getElementById("leveltext").innerHTML = "Virus Level:";
				document.getElementById("level").innerHTML = Level;
				
				if (Level < VirusLevelMinimum || Level > VirusLevelMaximum) {
					_WriteError("Invalid virus level");
					
					return;
				}
			}
			
			// Speed
			
			if (Speed == SpeedLow)
				document.getElementById("speed").innerHTML = "Low";
			else if (Speed == SpeedMedium)
				document.getElementById("speed").innerHTML = "Medium";
			else if (Speed == SpeedHigh)
				document.getElementById("speed").innerHTML = "High";
			else {
				_WriteError("Invalid speed");
				
				return;
			}
			
			// Score
			
			if (Score < ScoreMinimum || Score > ScoreMaximum) {
				_WriteError("Invalid score");
				
				return;
			}
			
			document.getElementById("score").innerHTML = Score + "0";
			
			while (document.getElementById("score").innerHTML.length < 7)
				document.getElementById("score").innerHTML = "0" + document.getElementById("score").innerHTML;
			
			// Time
			
			if (Time < TimeMinimum || Time > TimeMaximum) {
				_WriteError("Invalid time");
				
				return;
			}
			
			var TimeDecSec;
			var TimeSec;
			var TimeMin;
			
			TimeDecSec = Time % 10;
			TimeSec = Math.floor(Time / 10);
			TimeMin = Math.floor(TimeSec / 60);

			TimeSec %= 60;
			
			while (TimeSec.toString().length < 2)
				TimeSec = "0" + TimeSec;
			
			while (TimeMin.toString().length < 2)
				TimeMin = "0" + TimeMin;
			
			document.getElementById("time").innerHTML = TimeMin + " : " + TimeSec + " . " + TimeDecSec;
			
			// Name
			
			document.getElementById("name").innerHTML = "";
			
			for (var i=0;i<Name.length;i++) {
				if (Name[i] < NameFontCharacterMinimum || Name[i] > NameFontCharacterMaximum) {
					_WriteError("Invalid name");
					
					return;
				}
				
				while (Name[i].toString().length < 3)
					Name[i] = "0" + Name[i];
				
				document.getElementById("name").innerHTML += "<img class=\"name\" src=font/" + Name[i] + ".png></img>";
			}
			
			// Frame Count (modulo 1024)
			
			if (FrameCount < FrameCountMinimum || FrameCount > FrameCountMaximum) {
				_WriteError("Invalid frame count");
				
				return;
			}
			
			document.getElementById("framecount").innerHTML = FrameCount;
			
			// Show result
			
			_ShowResult();
			
			ValidPassword = true;
		} else {
			_WriteError("Invalid checksum");
			
			return;
		}
	} else {
		document.getElementById("code").value = document.getElementById("code").value.toUpperCase();
		
		_WriteError("Enter the password",true);
		
		return;
	}
}

_SetVersion();
_ResetInput();