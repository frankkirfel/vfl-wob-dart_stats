const s8s_DARTCLUB         = "VfL Wolfsburg e.V."
const s8s_TEAMS            = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
const s8s_SORT_DESC        = parseInt('1000000000000000', 2);
const s8s_SORT_NO_TOGGLE   = parseInt('0100000000000000', 2);
const s8s_SORT_BY_PLATZ    = parseInt('0000000000000001', 2);
const s8s_SORT_BY_SPIELER  = parseInt('0000000000000010', 2);
const s8s_SORT_BY_TEAM     = parseInt('0000000000000100', 2);
const s8s_SORT_BY_AVG      = parseInt('0000000000001000', 2);
const s8s_SORT_BY_SPIELE   = parseInt('0000000000010000', 2);
const s8s_SORT_BY_GEWONNEN = parseInt('0000000000100000', 2);
const s8s_SORT_BY_180      = parseInt('0000000001000000', 2);
const s8s_SORT_BY_140      = parseInt('0000000010000000', 2);
const s8s_SORT_BY_100      = parseInt('0000000100000000', 2);
const s8s_SORT_BY_80       = parseInt('0000001000000000', 2);
const s8s_SORT_BY_9D       = parseInt('0000010000000000', 2);
const s8s_SORT_BY_12D      = parseInt('0000100000000000', 2);
const s8s_SORT_BY_15D      = parseInt('0001000000000000', 2);
const s8s_SORT_BY_18D      = parseInt('0010000000000000', 2);

var s8s_sortFlags = 0;

var s8s_FILTER_EINZEL = parseInt('1000000000000000', 2);
var s8s_FILTER_DOPPEL = parseInt('0100000000000000', 2);

for (i=0; i<s8s_TEAMS.length; i++) {
	eval('var s8s_FILTER_TEAM_' + s8s_TEAMS[i] + ' = 0;');
}

var s8s_filterFlags = parseInt('1111111111111111', 2);


var s8s_init_players = [];
var s8s_init_players_prev = [];
var s8s_players = [];
var s8s_players_prev = [];


// HELPER FUNCTIONS >>>
var s8s_$ = function(str) {
	let ret = document.getElementById(str);
	if (!ret)
		return null;
	return ret;
}

var s8s_$$ = function(str) {
	let ret = document.getElementsByTagName(str);
	if (ret.length < 1)
		ret = document.getElementsByClassName(str);
	if (ret.length < 1)
		ret = document.getElementsByName(str);
	if (ret.length < 1)
		return null;
	return ret;
}

String.prototype.s8s_repeat = function(times) {
   return (new Array(times + 1)).join(this);
}

HTMLElement.prototype.s8s_set = function(val) {
	
	if (val === undefined)
		val = "";
	
	if (this.value !== undefined  && this.autocomplete !== undefined)
		this.value = val.toString();
	else
		this.innerHTML = val.toString();
}


function s8s_sort(sortFlags = s8s_sortFlags) {

	let property = "";
	
	if (sortFlags & s8s_SORT_BY_PLATZ)
		property = "Platz"
	else if (sortFlags & s8s_SORT_BY_SPIELER)
		property = "Spieler"
	else if (sortFlags & s8s_SORT_BY_TEAM)
		property = "Team"
	else if (sortFlags & s8s_SORT_BY_AVG)
		property = "AVG"
	else if (sortFlags & s8s_SORT_BY_SPIELE)
		property = "Spiele"
	else if (sortFlags & s8s_SORT_BY_GEWONNEN)
		property = "Gewonnen"
	else if (sortFlags & s8s_SORT_BY_180)
		property = "_180"
	else if (sortFlags & s8s_SORT_BY_140)
		property = "_140"
	else if (sortFlags & s8s_SORT_BY_100)
		property = "_100"
	else if (sortFlags & s8s_SORT_BY_80)
		property = "_80"
	else if (sortFlags & s8s_SORT_BY_9D)
		property = "_9D"
	else if (sortFlags & s8s_SORT_BY_12D)
		property = "_12D"
	else if (sortFlags & s8s_SORT_BY_15D)
		property = "_15D"
	else if (sortFlags & s8s_SORT_BY_18D)
		property = "_18D"
		

	if (sortFlags != s8s_sortFlags) {
		if (!(sortFlags & s8s_SORT_NO_TOGGLE)) {
			if ((property == "Platz" && (s8s_sortFlags & s8s_SORT_BY_PLATZ)) ||
				(property == "Spieler" && (s8s_sortFlags & s8s_SORT_BY_SPIELER)) ||
				(property == "Team" && (s8s_sortFlags & s8s_SORT_BY_TEAM)) ||
				(property == "AVG" && (s8s_sortFlags & s8s_SORT_BY_AVG)) ||
				(property == "Spiele" && (s8s_sortFlags & s8s_SORT_BY_SPIELE)) ||
				(property == "Gewonnen" && (s8s_sortFlags & s8s_SORT_BY_GEWONNEN)) ||
				(property == "_180" && (s8s_sortFlags & s8s_SORT_BY_180)) ||
				(property == "_140" && (s8s_sortFlags & s8s_SORT_BY_140)) ||
				(property == "_100" && (s8s_sortFlags & s8s_SORT_BY_100)) ||
				(property == "_80" && (s8s_sortFlags & s8s_SORT_BY_80)) ||
				(property == "_9D" && (s8s_sortFlags & s8s_SORT_BY_9D)) ||
				(property == "_12D" && (s8s_sortFlags & s8s_SORT_BY_12D)) ||
				(property == "_15D" && (s8s_sortFlags & s8s_SORT_BY_15D)) ||
				(property == "_18D" && (s8s_sortFlags & s8s_SORT_BY_18D))) {
				sortFlags = s8s_toggleSort(s8s_sortFlags);
			}
			s8s_sortFlags = (sortFlags | s8s_SORT_NO_TOGGLE);
		}
	}


	// Platz, Spiele, Gewonnen, 180, 140+, 100+, 80+ -> int
	if (property == "Platz" || property == "Spiele" || property == "Gewonnen" || property == "_180" || property == "_140" || property == "_100" || property == "_80") {
		return function(a,b){  
			let a_prop = (a[property] == null) ? -1 : parseInt(a[property]);
			let b_prop = (b[property] == null) ? -1 : parseInt(b[property]);
			if (a_prop > b_prop) {  
				return (sortFlags & s8s_SORT_DESC) ? -1 : 1;
			}
			else if (a_prop < b_prop) {
				return (sortFlags & s8s_SORT_DESC) ? 1 : -1;
			}
			return 0;
		}
	}
	// Spieler, Team,  -> string
	if (property == "Spieler" || property == "Team") {
		return function(a,b){  

			if (a[property] > b[property]) {  
				return (sortFlags & s8s_SORT_DESC) ? -1 : 1;
			}
			else if (a[property] < b[property]) {
				return (sortFlags & s8s_SORT_DESC) ? 1 : -1;
			}
			return 0;
		}
	}
	// AVG, ⌀9D, ⌀12D, ⌀15D, ⌀18D -> float
	if (property == "AVG" || property == "_9D" || property == "_12D" || property == "_15D" || property == "_18D") {
		return function(a,b){  

			if (parseFloat(a[property]) > parseFloat(b[property])) {  
				return (sortFlags & s8s_SORT_DESC) ? -1 : 1;
			}
			else if (parseFloat(a[property]) < parseFloat(b[property])) {
				return (sortFlags & s8s_SORT_DESC) ? 1 : -1;
			}
			return 0;
		}
	}
}

function s8s_toggleSort(sortFlags) {
	
	if (sortFlags > s8s_SORT_DESC)
		sortFlags &= (~s8s_SORT_DESC);
	else
		sortFlags |= s8s_SORT_DESC;
	return sortFlags;
}

function s8s_setFilter(chkbox = null) {
	if (chkbox != null) {
		if (chkbox.checked)
			s8s_filterFlags |= parseInt(chkbox.value);
		else
			s8s_filterFlags &= (~(parseInt(chkbox.value)));
		
		load_player_stats();
	}
}

function s8s_selDartclubs() {
	let i = 0;
	let sel = s8s_$("dartclubs");
	let txt = sel.options[sel.selectedIndex].text;
	sel.options.length = 0;

	var dartclubs_tmp = [];
	for (i=0; i<s8s_init_players.length; i++) {
		dartclubs_tmp.push(structuredClone(s8s_init_players[i].Team.slice(0, s8s_init_players[i].Team.length - 2).trim()));
	}
	var dartclubs = [...new Set(dartclubs_tmp)].sort();
	
	let option;
	for (i=0; i<dartclubs.length; i++) {
		if (dartclubs[i].length > 0) {
			option = document.createElement("option");
			option.value = dartclubs[i];
			option.text = dartclubs[i];
			if (txt == option.text)
				option.selected = true;
			sel.add(option);
		}
	}
	
	sel.value = s8s_DARTCLUB;
	select_dartclub();
}

HTMLElement.prototype.s8s_set = function(val) {
	
	if (val === undefined)
		val = "";
	
	if (this.value !== undefined  && this.autocomplete !== undefined)
		this.value = val.toString();
	else
		this.innerHTML = val.toString();
}

// <<< HELPER FUNCTIONS


!function() {
	let imported = document.createElement("link");
	imported.href = "./s8s.css";
	imported.type = "text/css";
	imported.rel = "stylesheet";
	imported.media = "screen,print";
	s8s_$$("head")[0].appendChild(imported);

	imported = document.createElement("link");
	imported.href = "./favicon.ico";
	imported.type = "image/png";
	imported.rel = "icon";
	s8s_$$("head")[0].appendChild(imported);

	window.addEventListener("load", s8s_init, false);
}()

function s8s_init() {
	while (s8s_init_players.length > 0) {
		s8s_init_players.pop();
	}

	while (s8s_init_players_prev.length > 0) {
		s8s_init_players_prev.pop();
	}

	let request = new XMLHttpRequest();
	request.open("GET", "./stats.json");
	request.responseType = "json";
	request.send();
	
	request.onload = function() {
		s8s_init_players = request.response;

		request = new XMLHttpRequest();
		request.open("GET", "./stats_prev.json");
		request.responseType = "json";
		request.send();
		
		request.onload = function() {
			s8s_init_players_prev = request.response;

			// console.log(s8s_init_players.length);
			// console.log(s8s_init_players_prev.length);
			
			s8s_selDartclubs();

			load_player_stats();
		}
	}
}

function select_dartclub() {

	let i = 0;
	var teams_tmp = [];
	for (i=0; i<s8s_init_players.length; i++) {
		if (s8s_init_players[i].Team.startsWith(s8s_$("dartclubs").options[s8s_$("dartclubs").selectedIndex].text)) {
			teams_tmp.push(structuredClone(s8s_init_players[i].Team.slice(-1)));
		}
	}
	var teams = [...new Set(teams_tmp)].sort();
	
	var inner_html = "<tr><td><input type=\"checkbox\" id=\"einzel\" name=\"einzel\" value=\"32768\" checked onchange=\"s8s_setFilter(this);\"><label for=\"einzel\"> Einzel</label></td><td><input type=\"checkbox\" id=\"doppel\" name=\"doppel\" value=\"16384\" checked onchange=\"s8s_setFilter(this);\"><label for=\"doppel\"> Doppel</label></td><td style=\"width:5em; text-align:right;\" onclick=\"invert_team_chkboxes();\" onmouseover=\"this.style.cursor='pointer'\">Teams:</td>";
	
	s8s_filterFlags = parseInt('1111111111111111', 2);
	
	for (i=0; i<teams.length; i++) {
		eval('s8s_FILTER_TEAM_' + teams[i] + ' = ' + (2**i) + ';');
		inner_html += "<td><input type=\"checkbox\" id=\"team_" + teams[i].toLowerCase() + "\" name=\"team_" + teams[i].toLowerCase() + "\" value=\"" + (2**i) + "\" checked onchange=\"s8s_setFilter(this);\"> " + teams[i] + "</label></td>";
	}
	
	inner_html += "</tr>";
	
	// console.log(inner_html);
	
	s8s_$("filters").innerHTML = inner_html;
	
	load_player_stats();
}

function load_player_stats() {

	while (s8s_players.length > 0) {
		s8s_players.pop();
	}

	while (s8s_players_prev.length > 0) {
		s8s_players_prev.pop();
	}

			
	for (i=0; i<s8s_init_players.length; i++) {
		if (s8s_init_players[i].Team.startsWith(s8s_$("dartclubs").value)) {
			if ((s8s_filterFlags & s8s_FILTER_EINZEL) > 0) { 
				if (!s8s_init_players[i].Spieler.includes(" & ")) {
					for (j=0; j<s8s_TEAMS.length; j++) {
						eval('if ((s8s_filterFlags & s8s_FILTER_TEAM_' + s8s_TEAMS[j] + ') > 0) {if (s8s_init_players[i].Team.endsWith("' + s8s_TEAMS[j] + '"))s8s_players.push(structuredClone(s8s_init_players[i]));}');
					}
				}
			}
			if ((s8s_filterFlags & s8s_FILTER_DOPPEL) > 0) { 
				if (s8s_init_players[i].Spieler.includes(" & ")) {
					for (j=0; j<s8s_TEAMS.length; j++) {
						eval('if ((s8s_filterFlags & s8s_FILTER_TEAM_' + s8s_TEAMS[j] + ') > 0) {if (s8s_init_players[i].Team.endsWith("' + s8s_TEAMS[j] + '"))s8s_players.push(structuredClone(s8s_init_players[i]));}');
					}
				}
			}
		}
		else {
			continue;
		}
	}
	for (i=0; i<s8s_init_players_prev.length; i++) {
		if (s8s_init_players_prev[i].Team.startsWith(s8s_$("dartclubs").value)) {
			if ((s8s_filterFlags & s8s_FILTER_EINZEL) > 0) { 
				if (!s8s_init_players_prev[i].Spieler.includes(" & ")) {
					for (j=0; j<s8s_TEAMS.length; j++) {
						eval('if ((s8s_filterFlags & s8s_FILTER_TEAM_' + s8s_TEAMS[j] + ') > 0) {if (s8s_init_players_prev[i].Team.endsWith("' + s8s_TEAMS[j] + '"))s8s_players_prev.push(structuredClone(s8s_init_players_prev[i]));}');
					}
				}
			}
			if ((s8s_filterFlags & s8s_FILTER_DOPPEL) > 0) { 
				if (s8s_init_players_prev[i].Spieler.includes(" & ")) {
					for (j=0; j<s8s_TEAMS.length; j++) {
						eval('if ((s8s_filterFlags & s8s_FILTER_TEAM_' + s8s_TEAMS[j] + ') > 0) {if (s8s_init_players_prev[i].Team.endsWith("' + s8s_TEAMS[j] + '"))s8s_players_prev.push(structuredClone(s8s_init_players_prev[i]));}');
					}
				}
			}
		}
		else {
			continue;
		}
	}
	
	s8s_players.sort(s8s_sort(s8s_SORT_BY_GEWONNEN | s8s_SORT_DESC));
	s8s_players.sort(s8s_sort(s8s_SORT_BY_SPIELE | s8s_SORT_DESC));
	s8s_players.sort(s8s_sort(s8s_SORT_BY_AVG | s8s_SORT_DESC));

	for (i=0; i<s8s_players.length; i++) {
		s8s_players[i].Team = s8s_players[i].Team.slice(-1);
		s8s_players[i].Platz = (i+1);
	}

		
	s8s_players_prev.sort(s8s_sort(s8s_SORT_BY_GEWONNEN | s8s_SORT_DESC));
	s8s_players_prev.sort(s8s_sort(s8s_SORT_BY_SPIELE | s8s_SORT_DESC));
	s8s_players_prev.sort(s8s_sort(s8s_SORT_BY_AVG | s8s_SORT_DESC));

	for (i=0; i<s8s_players_prev.length; i++) {
		s8s_players_prev[i].Team = s8s_players_prev[i].Team.slice(-1);
		s8s_players_prev[i].Platz = (i+1);
	}
	
	stats2tbl();
}

function invert_team_chkboxes() {
	
	for (i=0; i<s8s_TEAMS.length; i++) {
		var team = s8s_TEAMS[i].toLowerCase();
		eval('if (s8s_$("team_' + team + '") != null) {s8s_$("team_' + team + '").checked = !s8s_$("team_' + team + '").checked; if (s8s_$("team_' + team + '").checked) {s8s_filterFlags |= parseInt(s8s_$("team_' + team + '").value);} else {s8s_filterFlags &= (~(parseInt(s8s_$("team_' + team + '").value)));}}');
	}

	load_player_stats();
}

function stats2tbl() {
	s8s_$("stats").innerHTML = "";
	var full_avg = 0.0;
	var full_9d  = 0.0;
	var full_12d = 0.0;
	var full_15d = 0.0;
	var full_18d = 0.0;
	
	for (i=0; i<s8s_players.length; i++) {
		var tableclass = "";
		var movement = 0;
		full_avg += s8s_players[i].AVG;
		full_9d += s8s_players[i]._9D;
		full_12d += s8s_players[i]._12D;
		full_15d += s8s_players[i]._15D;
		full_18d += s8s_players[i]._18D;

		for (j=0; j<s8s_players_prev.length; j++) {
			if (s8s_players_prev[j].Spieler == s8s_players[i].Spieler && s8s_players_prev[j].Team == s8s_players[i].Team) {
				movement = s8s_players_prev[j].Platz - s8s_players[i].Platz;
				movement = (movement == 0 ? "-" : movement);
				break;
			}
		}
		
		if (!isNaN(movement)) {
			if (movement > 0) {
				if (movement >= 10) {
					tableclass = "moveup right";
				}
				else {
					tableclass = "moveup";
				}
			}
			else if (movement < 0) {
				if (movement <= -10) {
					tableclass = "movedown right"
				}
				else {
					tableclass = "movedown"
				}
			}

			movement = Math.abs(movement);
			movement = (movement == 0 ? "" : movement.toString());
		}
		
		s8s_$("stats").innerHTML += "<tr><td>" + s8s_players[i].Platz + ".</td><td class='" + tableclass + "'>" + movement + "</td><td style='text-align: left;'>" + s8s_players[i].Spieler + "</td><td>" + s8s_players[i].Team + "</td><td>" + s8s_players[i].AVG.toFixed(1) + "</td><td>" + s8s_players[i].Spiele + "</td><td>" + s8s_players[i].Gewonnen + "</td><td>" + (s8s_players[i]._180 ?? "") + "</td><td>" + (s8s_players[i]._140 ?? "") + "</td><td>" + (s8s_players[i]._100 ?? "") + "</td><td>" + (s8s_players[i]._80 ?? "") + "</td><td>" + s8s_players[i]._9D.toFixed(1) + "</td><td>" + s8s_players[i]._12D.toFixed(1) + "</td><td>" + s8s_players[i]._15D.toFixed(1) + "</td><td>" + s8s_players[i]._18D.toFixed(1) + "</td></tr>"
	}
	if (s8s_players.length > 0) {
		//console.log((full_avg/s8s_players.length).toFixed(1));
		s8s_$("stats").innerHTML += "<tr><td colspan=4 style='text-align:right; padding:0.8em;'><b><strong>&#x2300; AVG:</strong></b></td><td><b><strong>" + (full_avg/s8s_players.length).toFixed(1) + "</strong></b></td><td colspan=6></td><td>" + (full_9d/s8s_players.length).toFixed(1) + "</td><td>" + (full_12d/s8s_players.length).toFixed(1) + "</td><td>" + (full_15d/s8s_players.length).toFixed(1) + "</td><td>" + (full_18d/s8s_players.length).toFixed(1) + "</td></tr>";
	}
}
