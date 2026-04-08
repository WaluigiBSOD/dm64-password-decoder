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
		var PasswordChunk = Array(3).fill(0);
		
		var ObfuscationConstant;
		
		var Checksum = 0;
		var TestChecksum = 0;
		
		var GameMode = 0;
		var Level = 0;
		var Speed = 0;
		var Score = 0;
		var Time = 0;
		var FrameCount = 0;
		
		var PlayerName = Array(4).fill(0);
		
		var TemporaryX;
		var TemporaryY;
		
		var i;
		var j;
		
		// Frame Count (modulo 1024)
		
		TemporaryX = PasswordValidCharacters.indexOf(Password.charAt(0));
		TemporaryY = PasswordValidCharacters.indexOf(Password.charAt(19));
		
		if (TemporaryX > -1 && TemporaryY > -1) {
			FrameCount = TemporaryX | (TemporaryY << 5);
			
			// Obfuscation Constant (frame count, modulo 1024)
		
			ObfuscationConstant = TableMaskFrameCountX[TemporaryX] ^ TableMaskFrameCountY[TemporaryY];
		} else {
			_WriteError("Wrong character(s) in password");
			
			return;
		}
		
		// ###   Password   ###
		//
		//    20 characters
		//
		// V                  V
		// E5HQ3E80B03JA5316R1F
		//
		// ^                  ^
		// X                  Y
		//      FrameCount
		//
		//  ^^^^^^^^^^^^^^^^^^
		//     Data Chunks
		//
		//          ||
		//          VV
		//
		//  ^^^^^^
		//    X
		//
		//        ^^^^^^
		//          Y
		//
		//              ^^^^^^
		//                Z
			
		for (i=0;i<3;i++) {
			for (j=(6 * i) + 1;j<=6 * (i + 1);j++) {
				TemporaryX = PasswordValidCharacters.indexOf(Password.charAt(j));
				
				if (TemporaryX > -1) {
					PasswordChunk[i] |= TemporaryX << 25;
					
					if (j < 6 * (i + 1))
						PasswordChunk[i] >>= 5;
				} else {
					_WriteError("Wrong character(s) in password");
					
					return;
				}
			}
			
			PasswordChunk[i] ^= ObfuscationConstant;
		}
		
		// Checksum (1/2)
		
		Checksum = (PasswordChunk[0] >> 28) & 0x3;
		
		PasswordChunk[0] ^= TableMaskPasswordChunkX[Checksum];
		PasswordChunk[1] ^= TableMaskPasswordChunkY[Checksum];
		PasswordChunk[2] ^= TableMaskPasswordChunkZ[Checksum];
		
		// Time

		Time = PasswordChunk[2] & 0xFFFF;
		PasswordChunk[2] >>= 16;
		
		// Level (1/2)

		Level = PasswordChunk[2] & 0x3;
		PasswordChunk[2] >>= 2;
		
		// Mode

		GameMode = PasswordChunk[2] & 0x3;
		PasswordChunk[2] >>= 2;
		
		// Speed

		Speed = PasswordChunk[2] & 0x3;
		PasswordChunk[2] >>= 2;
		
		// Checksum (2/2)

		Checksum = ((PasswordChunk[2] & 0xFF) << 2) | Checksum;
		
		// Level (2/2)

		Level = (Level << 6) | (PasswordChunk[1] & 0x3F);
		PasswordChunk[1] >>= 6;
		
		// Player Name

		PlayerName[1] = PasswordChunk[1] & 0xFF;
		PasswordChunk[1] >>= 8;

		PlayerName[2] = PasswordChunk[1] & 0xFF;
		PasswordChunk[1] >>= 8;

		PlayerName[3] = PasswordChunk[1] & 0xFF;

		PlayerName[0] = PasswordChunk[0] & 0xFF;
		PasswordChunk[0] >>= 8;
		
		// Score

		Score = PasswordChunk[0] & 0xFFFFF;
		PasswordChunk[0] >>= 20;
		
		// Test Checksum
		
		TestChecksum = GameMode;
		TestChecksum += Level;
		TestChecksum += Speed;
		TestChecksum += (Score & 0x3FF);
		TestChecksum += ((Score >> 10) & 0x3FF);
		TestChecksum += (Time & 0xFF);
		TestChecksum += ((Time >> 8) & 0xFF);
		TestChecksum += PlayerName[0];
		TestChecksum += PlayerName[1];
		TestChecksum += PlayerName[2];
		TestChecksum += PlayerName[3];
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
			
			// Level
			
			if (GameMode != GameModeClassic) {
				document.getElementById("level-text").innerHTML = "Game Level:";

				if (Level == GameLevelEasy)
					document.getElementById("level").innerHTML = "Easy";
				else if (Level == GameLevelNormal)
					document.getElementById("level").innerHTML = "Normal";
				else if (Level == GameLevelHard)
					document.getElementById("level").innerHTML = "Hard";
				else {
					_WriteError("Invalid non-classic game level");
					
					return;
				}
			} else {
				if (Level > VirusLevelMaximum) {
					_WriteError("Invalid classic virus level");
					
					return;
				}
				
				document.getElementById("level-text").innerHTML = "Virus Level:";
				
				document.getElementById("level").innerHTML = Level;
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
			
			if (Score > ScoreMaximum) {
				_WriteError("Invalid score");
				
				return;
			}
			
			document.getElementById("score").innerHTML = Score + "0";
			
			while (document.getElementById("score").innerHTML.length < 7)
				document.getElementById("score").innerHTML = "0" + document.getElementById("score").innerHTML;
			
			// Time
			
			if (Time > TimeMaximum) {
				_WriteError("Invalid time");
				
				return;
			}
			
			document.getElementById("time").innerHTML = _FormatTime(Time);
			
			// Player Name
			
			document.getElementById("name").innerHTML = "";
			
			for (var i=0;i<PlayerName.length;i++) {
				if (PlayerNameFontValidCharacters.indexOf(PlayerName[i]) == -1) {
					_WriteError("Invalid player name");
					
					return;
				}
				
				while (PlayerName[i].toString().length < 3)
					PlayerName[i] = "0" + PlayerName[i];
				
				if (PlayerName[i] == "000")
					document.getElementById("name").innerHTML += "<img class=\"name-empty\" src=\"font/" + PlayerName[i] + ".png\">";
				else
					document.getElementById("name").innerHTML += "<img class=\"name\" src=\"font/" + PlayerName[i] + ".png\">";
			}
			
			// Show result
			
			_ShowResult();
			
			ValidPassword = true;
		} else
			_WriteError("Invalid checksum");
	} else
		_WriteError("Enter password",true);
}