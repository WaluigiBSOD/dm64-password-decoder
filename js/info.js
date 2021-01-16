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

const Title = "Dr. Mario 64 Password Decoder";

const Version = "1.2.2";
const VersionDate = "16 January 2021";

// Functions

function _SetTitle() {
	document.getElementById("page-title").innerHTML = Title;
	document.getElementById("title").innerHTML = Title;
}

function _SetVersion() {
	document.getElementById("version").innerHTML = "Version " + Version;
}

function _SetVersionDate() {
	document.getElementById("version").innerHTML = VersionDate;
}

// To be executed

_SetTitle();

_SetVersion();