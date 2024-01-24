// Dr. Mario 64 Password Decoder
// Copyright (C) 2020-present WaluigiBSOD (waluigibsod.github.io)
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

// Functions

function _DecodePassword(Password) {
	ValidPassword = false;
	
	if (Password.length == 20) {
		var PasswordChunkHigh = 0;
		var PasswordChunkMedium = 0;
		var PasswordChunkLow = 0;
		
		var FrameCountX = 0;
		var FrameCountY = 0;
		
		var Checksum = 0;
		var ChecksumLastTwoBits = 0;
		var TestChecksum = 0;
		
		var GameMode = 0;
		var Level = 0;
		var Speed = 0;
		var Score = 0;
		var Time = 0;
		var FrameCount = 0;
		
		var Name = Array(4).fill(0);
		
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
		
		// Randomization Constant (frame count, modulo 1024)
		
		FrameCountConstant = TableMaskFrameCountLower[FrameCountX] ^ TableMaskFrameCountUpper[FrameCountY];
		
		PasswordChunkHigh ^= FrameCountConstant;
		PasswordChunkMedium ^= FrameCountConstant;
		PasswordChunkLow ^= FrameCountConstant;
		
		// Constant (checksum)
		
		ChecksumLastTwoBits = (PasswordChunkHigh >> 28) & 0x3;
		
		PasswordChunkHigh ^= TableMaskHigh[ChecksumLastTwoBits];
		PasswordChunkMedium ^= TableMaskMiddle[ChecksumLastTwoBits];
		PasswordChunkLow ^= TableMaskLower[ChecksumLastTwoBits];
		
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
		
		// Checksum (1/2)

		Checksum = PasswordChunkLow & 0xFF;
		
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
		
		// Checksum (2/2)

		Checksum = (Checksum << 2) | (PasswordChunkHigh & 0x3);
		Checksum &= 0x3FF;
		
		// Test Checksum
		
		TestChecksum = GameMode + Level + Speed;
		TestChecksum += (Score & 0x3FF);
		TestChecksum += ((Score >> 10) & 0x3FF);
		TestChecksum += (Time & 0xFF);
		TestChecksum += ((Time >> 8) & 0xFF);
		TestChecksum += Name[0] + Name[1] + Name[2] + Name[3];
		TestChecksum &= 0x3FF;
		
		if (Checksum == TestChecksum) {
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
				document.getElementById("level-text").innerHTML = "Game Level:";

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
				document.getElementById("level-text").innerHTML = "Virus Level:";
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
			
			document.getElementById("time").innerHTML = _FormatTime(Time);
			
			// Name
			
			document.getElementById("name").innerHTML = "";
			
			for (var i=0;i<Name.length;i++) {
				if (NameFontValidCharacters.indexOf(Name[i]) == -1) {
					_WriteError("Invalid name");
					
					return;
				}
				
				while (Name[i].toString().length < 3)
					Name[i] = "0" + Name[i];
				
				if (Name[i] == "000")
					document.getElementById("name").innerHTML += "<img class=\"name-empty\" src=\"font/" + Name[i] + ".png\">";
				else
					document.getElementById("name").innerHTML += "<img class=\"name\" src=\"font/" + Name[i] + ".png\">";
			}
			
			// Frame Count (modulo 1024)
			
			if (FrameCount < FrameCountMinimum || FrameCount > FrameCountMaximum) {
				_WriteError("Invalid frame count");
				
				return;
			}
			
			// Show result
			
			_ShowResult();
			
			ValidPassword = true;
		} else
			_WriteError("Invalid checksum");
	} else
		_WriteError("Enter password",true);
}