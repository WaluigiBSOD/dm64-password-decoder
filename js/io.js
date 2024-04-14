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
		
		_WriteError("Enter password",true);
	}
}