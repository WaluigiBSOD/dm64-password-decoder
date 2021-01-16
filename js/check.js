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

// Functions

function _CheckPassword() {
	var Password = document.getElementById("code").value;
	var PasswordChanged = false;
	
	Password = Password.toUpperCase();
	
	for (var i=0;i<Password.length;i++)
		if (PasswordCharacters.indexOf(Password.charAt(i)) == -1) {
			Password = Password.replace(Password.charAt(i),"");
			
			PasswordChanged = true;
		}
	
	document.getElementById("code").value = Password;
	
	if (!PasswordChanged)
		_DecodePassword(Password);
}