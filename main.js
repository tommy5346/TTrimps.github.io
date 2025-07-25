//Contact me via Kongregate as GreenSatellite, reddit on /r/Trimps, or Email at trimpsgame@gmail.com
//This UI layout was made possible by bootstrap http://www.getbootstrap.com, and the icons are from Glyphicons http://www.glyphicons.com and Icomoon https://icomoon.io
//If you want to learn how to make javascript games, this is the short tutorial that got me started: http://dhmholley.co.uk/incrementals.html

/*		Trimps
		Copyright (C) 2019 Zach Hood

		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with this program (if you are reading this on the original
		author's website, you can find a copy at
		<trimps.github.io/license.txt>). If not, see
		<http://www.gnu.org/licenses/>. */
"use strict";
if (typeof kongregate === 'undefined' && document.getElementById("boneBtn") !== null) {
	var boneBtn = document.getElementById("getBonesBtn");
	boneBtn.onclick = "";
	boneBtn.innerHTML = "Kongregate API not loaded! You cannot submit high scores or spend Kreds. Try refreshing or contacting Kongregate support!";
	boneBtn.style.backgroundColor = "#d9534f";
	document.getElementById("getBundleBtn").style.display = "none";
}
if (typeof usingScreenReader === 'undefined'){
	var usingScreenReader = false;
}
var srTooltipMode = "click"
document.getElementById("versionNumber").innerHTML = game.global.stringVersion;

var autoSaveTimeout;

function restartAutoSave(){
	clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(autoSave, 60000);
}

function autoSave() {
    if (game.options.menu.autoSave.enabled && !usingRealTimeOffline) save();
    autoSaveTimeout = setTimeout(autoSave, 60000);
}

var lastOnlineSave = -1800000;
var isSaving = false;
var disableSaving = false;
var cloudConflictDisableSaving = false;
function save(exportThis, fromManual) {
	isSaving = true;
	autoBattle.save();
	u2Mutations.save();
    var saveString = JSON.stringify(game);
    var saveGame = JSON.parse(saveString);
	isSaving = false;
    delete saveGame.worldUnlocks;
    delete saveGame.badGuys;
    delete saveGame.mapConfig;
	delete saveGame.global.prestige;
	delete saveGame.trimpDeathTexts;
	delete saveGame.badGuyDeathTexts;
	delete saveGame.tierValues;
	delete saveGame.workspaces;
	delete saveGame.resources.trimps.employed;
	delete saveGame.bwRewards;
    for (var item in saveGame.equipment) {
		delete saveGame.equipment[item].tooltip;
		delete saveGame.equipment[item].blocktip;
        delete saveGame.equipment[item].cost;
    }
    for (var itemA in saveGame.buildings) {
        delete saveGame.buildings[itemA].tooltip;
        delete saveGame.buildings[itemA].cost;
		delete saveGame.buildings.Barn.increase;
		delete saveGame.buildings.Forge.increase;
		delete saveGame.buildings.Shed.increase;
		delete saveGame.buildings.origTime;
    }
    for (var itemB in saveGame.upgrades) {
        delete saveGame.upgrades[itemB].tooltip;
        delete saveGame.upgrades[itemB].cost;
		delete saveGame.upgrades[itemB].prestiges;
		delete saveGame.upgrades[itemB].modifier;
    }
    for (var itemC in saveGame.jobs) {
        delete saveGame.jobs[itemC].tooltip;
        delete saveGame.jobs[itemC].cost;
    }
    for (var itemD in saveGame.triggers) {
        delete saveGame.triggers[itemD].message;
        delete saveGame.triggers[itemD].cost;
    }
	for (var itemE in saveGame.mapUnlocks){
		var unlock = saveGame.mapUnlocks[itemE];
		delete unlock.level;
		delete unlock.message;
		delete unlock.icon;
		delete unlock.world;
		delete unlock.repeat;
		delete unlock.startAt;
		delete unlock.blockU2;
		delete unlock.blockU1;
	}
	for (var itemP in saveGame.portal){
		var portal = saveGame.portal[itemP];
		delete portal.modifier;
		delete portal.priceBase;
		delete portal.tooltip;
		delete portal.otherModifier;
		delete portal.additiveInc;
		delete portal.specialGrowth;
		delete portal.max;
	}
	for (var itemS in saveGame.options.menu){
		var settingItem = saveGame.options.menu[itemS];
		delete settingItem.description;
		delete settingItem.titles;
		delete settingItem.locked;
		delete settingItem.secondLocation;
		delete settingItem.extraTags;
	}
	var challenge = saveGame.global.challengeActive;
	if (!challenge && game.challenges.Nurture.cruffysUntil && game.challenges.Nurture.cruffysUntil >= game.global.world) challenge = "Nurture";
	if (challenge == "Mapocalypse") challenge = "Electricity";
	for (var itemF in saveGame.challenges){
		if (itemF != challenge && !saveGame.global.multiChallenge[itemF]){
			delete saveGame.challenges[itemF];
			continue;
		}
		var challenge = saveGame.challenges[itemF];
		delete challenge.unlockString;
		delete challenge.squaredDescription;
		delete challenge.replaceSquareFreq;
		delete challenge.replaceSquareReward;
		delete challenge.replaceSquareThresh;
		delete challenge.replaceSquareGrowth;
		delete challenge.zoneScaling;
		delete challenge.scaleModifier;
		delete challenge.zoneScaleFreq;
		delete challenge.description;
		delete challenge.heliumThrough;
		delete challenge.completeAfterZone;
		delete challenge.completeAfterMap;
	}
	for (var itemG in saveGame.achievements){
		var achievement = saveGame.achievements[itemG];
		delete achievement.tiers;
		delete achievement.breakpoints;
		delete achievement.breakpoints2;
		delete achievement.names;
		delete achievement.descriptions;
		delete achievement.title;
		delete achievement.icon;
		delete achievement.newStuff;
		delete achievement.filters;
		delete achievement.timed;
		delete achievement.size;
	}
	delete saveGame.heirlooms.values;
	delete saveGame.heirlooms.defaultSteps;
	delete saveGame.heirlooms.rarityNames;
	delete saveGame.heirlooms.rarities;
	delete saveGame.heirlooms.rarityBreakpoints;
	for (var itemHT in saveGame.heirlooms){
		for (var itemHI in saveGame.heirlooms[itemHT]){
			var heirloom = saveGame.heirlooms[itemHT][itemHI];
			delete heirloom.name;
			delete heirloom.steps;
		}
	}
	for (var itemTL in saveGame.talents){
		var talent = saveGame.talents[itemTL];
		delete talent.icon;
		delete talent.description;
		delete talent.tier;
		delete talent.requires;
		delete talent.name;
	}
	for (var itemGU in saveGame.generatorUpgrades){
		var genUp = saveGame.generatorUpgrades[itemGU];
		delete genUp.base;
		delete genUp.baseCost;
		delete genUp.baseIncrease;
	}
	for (var itemPGU in saveGame.permanentGeneratorUpgrades){
		var genUp = saveGame.permanentGeneratorUpgrades[itemPGU];
		delete genUp.description;
		delete genUp.cost;
	}
	for (var itemEmp in saveGame.empowerments){
		var empUp = saveGame.empowerments[itemEmp];
		delete empUp.baseModifier;
		delete empUp.color;
		delete empUp.formationDesc;
		delete empUp.enlightenDesc;
	}
	for (var itemSrb in saveGame.singleRunBonuses){
		itemSrb = saveGame.singleRunBonuses[itemSrb];
		delete itemSrb.name;
		delete itemSrb.text;
		delete itemSrb.cost;
		delete itemSrb.confirmation;
	}
	for (var itemStat in saveGame.stats){
		itemStat = saveGame.stats[itemStat];
		delete itemStat.title;
	}
	for (var itemPerma in saveGame.permaBoneBonuses){
		itemPerma = saveGame.permaBoneBonuses[itemPerma];
		delete itemPerma.name;
		delete itemPerma.text;
		delete itemPerma.confirmation;
	}
	saveGame.playerSpire = playerSpire.save();
    saveString = LZString.compressToBase64(JSON.stringify(saveGame));
    if (exportThis) return saveString;
	if (disableSaving) {
		message("Due to an error occuring, saving has been disabled to prevent corruption", "Notices");
		postMessages();
		return;
	}
	if (cloudConflictDisableSaving){
		return;
	}
	try{
		if (typeof nw !== 'undefined') saveWindowSettings();
		if (typeof greenworks !== 'undefined') saveToSteam(saveString);
		localStorage.setItem("trimpSave1",saveString);
		if (localStorage.getItem("trimpSave1") == saveString){
			message("Game Saved!", "Notices");
		}
		else {
			message("For some reason, your game is not saving. Make sure you export and back up your save!", "Notices");
		}
	}
	catch(e){
		if(e.name == "NS_ERROR_FILE_CORRUPTED") {
        message("Sorry, it looks like your browser storage has been corrupted. Please clear your storage by going to Tools -> Clear Recent History -> Cookies and set time range to 'Everything'. This will remove the corrupted browser storage across all sites.", "Notices");
		}
		else
		message("For some reason, your game is not saving. Make sure you export and back up your save!", "Notices");
		}

	if (game.options.menu.usePlayFab.enabled == 1 && playFabId){
		var timeSinceSave = performance.now() - lastOnlineSave;
		if ((timeSinceSave < 7200000 && !fromManual) || timeSinceSave < 60000){
			return;
		}
		saveToPlayFab(saveString);
	}

}

function load(saveString, autoLoad, fromPf) {
	if (usingRealTimeOffline) offlineProgress.finish(true);
	var savegame;
	//oldVersion mostly deprecated, but still used for compat with saves from before stringVersion
	var oldVersion = 0;
	var oldStringVersion = '';
	var betaV = -1;
	var fromImport = false;
	var unparsedSave;
	if (saveString === true) fromImport = true
    if (saveString) {
        savegame = JSON.parse(LZString.decompressFromBase64(((fromImport) ? document.getElementById("importBox").value.replace(/(\r\n|\n|\r|\s)/gm,"") : saveString)));
        tooltip('hide');
		if (!savegame) {
			message("It looks like your import code isn't working properly. Please make sure that your export code is saved in a text file compatible with all of the characters. If you believe this code should be working, you can Email it to Trimpsgame@gmail.com and I will do my best to restore it for you!", "Notices");
			return false;
		}
		else if (fromImport){
			game.options.menu.usePlayFab.enabled = 0;
			toggleSetting("usePlayFab", null, false, true);
			playFabId = -1;
		}
    } else  {
		try {
			unparsedSave = localStorage.getItem("trimpSave1");
		}
		catch (e) {
			message("Your browser is preventing Trimps from accessing localStorage, and you will not be able to save or load your progress. Please check your browser settings to ensure that 3rd party cookies are not disabled, and that you're not using any addons that might interrupt storage! <br/><br/> AutoSave has been disabled to prevent damage to your save. If you previously had a save file, it should still be waiting for you once you fix your browser settings.", "Notices");
			game.options.menu.autoSave.enabled = 0;
			game.options.menu.autoSave.onToggle();
			return false;
		}
        if (unparsedSave !== null) savegame = JSON.parse(LZString.decompressFromBase64(unparsedSave));
		else {
			if (typeof nw === 'undefined') tooltip("Welcome", null, "update");
			return false;
		}
    }
	if (typeof savegame === 'undefined' || savegame === null || typeof savegame.global === 'undefined') {
		if (typeof nw === 'undefined') tooltip("Welcome", null, "update");
		return false;
	}
	oldVersion = savegame.global.version;
	oldStringVersion = (savegame.global.stringVersion) ? savegame.global.stringVersion.split('.') : null;
	betaV = savegame.global.betaV;
	if (savegame.global.isBeta && !game.global.isBeta){
		message("You can't import a save from the beta version to this version!", "Notices");
		return false;
	}
	if ((oldStringVersion && oldStringVersion.length && (compareVersion(oldStringVersion, game.global.stringVersion.split('.'), true)))) {
		var compatText = "Your save file is from a newer version of Trimps (v" + savegame.global.stringVersion + ") than what your computer is running (v" + game.global.stringVersion + ").";
		if (typeof nw === 'undefined') compatText += " Refresh or restart your browser!";
		else compatText += " You may need to restart Steam and then relaunch Trimps to get the newest update.";
		message(compatText, "Notices");
		return false;
	}
	resetGame();
    if (game.global.killSavesBelow > oldVersion) {
		if (savegame.global.version == 0.07){
			game.global.kongBonusMode = true;
			activateKongBonus(savegame.global.world);
			return false;
		}
        message("I'm so terribly sorry, but your previous save game (version " + savegame.global.version + ") does not work in the new version. This should be the last reset!", "Notices");
        return false;
    }
	else if (game.global.isBeta) {
		savegame.global.isBeta = true;
	}
	savegame.global.version = game.global.version;
	savegame.global.stringVersion = game.global.stringVersion;
	savegame.global.betaV = game.global.betaV;
	//Compatibility to new message filter config. Separated from other compatibility as it needs to go into effect before game has the old booleans copied over it.
	if (oldVersion < 3.51){
		addNewSetting("timestamps");
		var oldMsg = savegame.global.messages;
		savegame.global.messages = game.global.messages;
		for (var item in oldMsg){
			savegame.global.messages.enabled = oldMsg[item];
		}
	}
	//Load global
	if (typeof savegame.global !== 'undefined') {
        for (var item in game.global) {
            if (item == "time" || item == "start" || item == "lastFightUpdate" || item == "prestige") continue;
            if (typeof savegame.global[item] !== 'undefined') game.global[item] = savegame.global[item];
            if (item == "buildingsQueue") {
                for (var itemA in game.global.buildingsQueue) {
                    addQueueItem(game.global.buildingsQueue[itemA]);
                }
				game.global.nextQueueId = game.global.buildingsQueue.length;
            }
        }
	}
	//c^2
	if (typeof savegame.c2 !== 'undefined'){
		for (var item in game.c2){
			if (savegame.c2[item]) game.c2[item] = savegame.c2[item];
		}
	}
	//Load the rest of the game.categories
    for (var a in game) { //global, resources, jobs, buildings, upgrades, triggers, equipment, settings, options
        if (a == "global") continue;
        if (a == "badGuys") continue;
        if (a == "worldUnlocks") continue;
        if (a == "mapConfig") continue;
		// if (a == "herbs"){ //or any other two step object
		// 	if (typeof savegame[a] === 'undefined') continue;
		// 	for (var b in game[a]){
		// 		if (typeof savegame[a][b] !== 'undefined') game[a][b] = savegame[a][b];
		// 	}
		// }
		if (a == "options" && savegame.options){
			for (var itemO in savegame.options.menu){
				if (game.options.menu[itemO]) game.options.menu[itemO].enabled = savegame.options.menu[itemO].enabled;
				if (itemO == "mapAtZone"){
					var mazSave = savegame.options.menu.mapAtZone;
					var mazGame = game.options.menu.mapAtZone;
					mazGame.setZone = mazSave.setZone;
					if (mazSave.setZoneB) mazGame.setZoneB = mazSave.setZoneB;
					if (mazSave.setZoneU2) mazGame.setZoneU2 = mazSave.setZoneU2;
					if (mazSave.setZoneU2B) mazGame.setZoneU2B = mazSave.setZoneU2B;
					if (mazSave.U1Mode) mazGame.U1Mode = mazSave.U1Mode;
					if (mazSave.U2Mode) mazGame.U2Mode = mazSave.U2Mode;
				}
			}
			if (typeof savegame.options.menu.GeneticistassistTarget !== 'undefined' && savegame.options.menu.GeneticistassistTarget.disableOnUnlock) game.options.menu.GeneticistassistTarget.disableOnUnlock = true;
			if (savegame.options.menu.pauseGame && savegame.options.menu.pauseGame.timeAtPause) game.options.menu.pauseGame.timeAtPause = savegame.options.menu.pauseGame.timeAtPause;
			continue;
		}
        var topSave = savegame[a];
        if (typeof topSave === 'undefined' || topSave === null) continue;
		if (savegame.global.brokenPlanet) game.global.prestige.cost = 53;
		if (a == "equipment"){
			loadEquipment(topSave);
			continue;
		}
		var topGame = game[a];
        for (var b in topGame) { //each item in main category (resource names, job names, etc)
            var midSave = topSave[b];
            if (typeof midSave === 'undefined' || midSave === null) continue;
            var midGame = topGame[b];
            if (typeof midSave !== 'object') midGame = midSave;
            else
                for (var c in midGame) { //purchased, cost, etc
                    if (c == "cost") continue;
                    if (c == "tooltip") continue;
					if (a == "mapUnlocks" && c == "repeat") continue;
					if (a == "stats" && c == "title") continue; //title is being deleted from stats now, but I guess this has to stay forever for 4.8 compatibility.
					if (a == "resources" && b == "trimps" && c == "employed") {
						continue;
					}
					if (a == "resources" && c == "owned"){
						//check bad entries here.
					}
					if (a == "buildings" && c == "purchased"){
						if (savegame.buildings[b].purchased < 0) savegame.buildings[b].purchased = 0;
					}
                    var botSave = midSave[c];
                    if (typeof botSave === 'undefined' || botSave === null) continue;
					if (a == "heirlooms"){
						if (typeof botSave.currentBonus !== 'undefined')
							midGame[c].currentBonus = botSave.currentBonus;
						continue;
					}

                    midGame[c] = botSave;
                }
        }
    }
	game.global.lockTooltip = false;
	u2Mutations.load();
	autoBattle.resetAll();
	playerSpire.resetToDefault();
	alchObj.load();
	autoBattle.load();
	if (savegame.playerSpire) playerSpire.load(savegame.playerSpire)
	//Compatibility

	if (oldVersion === 1.0){
		var hasPortal = false;
		for (var portItem in game.portal){
			var portUpgrade = game.portal[portItem];
			if (portUpgrade.level > 0) hasPortal = true;
			if (typeof portUpgrade.level === 'undefined') continue;
			for (var d = 0; d < portUpgrade.level; d++){
				portUpgrade.heliumSpent += Math.ceil((d / 2) + portUpgrade.priceBase * Math.pow(1.3, d));
			}
		}
		if (hasPortal) game.global.totalPortals = 1;
	}
	if (oldVersion === 1.01){
		game.jobs.Dragimp.modifier = (0.5 * Math.pow(1.05, game.buildings.Tribute.owned));
	}
	if (oldVersion <= 1.02){
		for (var checkResourceMax in game.resources){
			var toCheckMax = game.resources[checkResourceMax];
			if (toCheckMax.max == -1) continue;
			toCheckMax.max = parseFloat(toCheckMax.max);
		}
	}
	if (oldVersion <= 1.06){
		game.resources.trimps.max += (game.buildings.Mansion.owned * 2);
		game.buildings.Mansion.increase.by = 10;
	}
	if (oldVersion <= 1.07){
		game.global.highestLevelCleared = game.global.world;
		game.resources.trimps.max += (game.buildings.Wormhole.owned * 500);
		game.buildings.Wormhole.increase.by = "1000";
		if (game.global.world >= 33) game.worldUnlocks.Doom.fire();
	}
	if (oldVersion < 1.1){
		if (game.global.world >= 25){
			for (var mys = 0; mys < Math.floor((game.global.world - 20) / 5); mys++){
				unlockUpgrade("Gymystic");
			}
		}
	}
	if (oldVersion < 2.213) {
		for (var item in game.options.menu){
			game.options.menu[item].enabled = (game.options.menu[item].enabled) ? 1 : 0;
		}
	}
	if (oldVersion < 2.3){
		if (game.global.highestLevelCleared >= 80) game.global.prisonClear++;
		if (game.global.world >= 70) {
			message("Welcome to 2.3! Since you are currently past Zone 70, you have automatically unlocked the new Challenge - 'Trapper' and the new Job - 'Geneticist'", "Notices");
			unlockJob("Geneticist");
		}
		else if (game.global.highestLevelCleared >= 69){
			message("Welcome to 2.3! Since you have previously cleared up to at least Zone 70, you have unlocked the new Challenge - 'Trapper'!", "Notices");
		}
	}
	if (oldVersion < 2.7){
		for (var statName in game.stats){
			var statItem = game.stats[statName];
			if (typeof statItem.valueTotal !== 'undefined' && typeof statItem.value !== 'undefined') {
				statItem.valueTotal = statItem.value;
				statItem.value = 0;
			}
			else if (typeof statItem.valueTotal !== 'undefined' && typeof statItem.valueTotal !== 'function' && typeof savegame.stats !== 'undefined'){
				if (typeof savegame.stats[statName] !== 'undefined') {
					statItem.valueTotal = savegame.stats[statName].value;
					}
			}
		}
		if (game.global.totalHeliumEarned > 0){
			var totalHelium = 0;
			for (var item in game.portal){
				if (game.portal[item].locked) continue;
				var portUpgrade = game.portal[item];
				if (typeof portUpgrade.level === 'undefined' || portUpgrade.level <= 0) continue;
				totalHelium += portUpgrade.heliumSpent;
			}
			var newTHV = totalHelium + game.global.heliumLeftover + game.resources.helium.owned;
			if (game.global.totalHeliumEarned - newTHV > 0) game.stats.spentOnWorms.valueTotal = game.global.totalHeliumEarned - newTHV;
			game.global.totalHeliumEarned = newTHV;
		}
	}
	var noOfflineTooltip = false;
	if (oldVersion < 2.72){
		achievementCompatibilityUnlock();
		noOfflineTooltip = true;
	}
	if (oldVersion < 2.73){
		if (game.jobs.Geneticist.owned > 0) game.global.lastLowGen = (game.global.lowestGen > 0) ? game.global.lowestGen : game.jobs.Geneticist.owned;
	}
	if (oldVersion < 2.75){
		game.buildings.Wormhole.increase.by = 1500;
	}
	if (oldVersion < 2.81 && typeof game.global.lootAvgs !== 'undefined'){
		game.global.lootAvgs.fragments = {average:0, accumulator: 0}
	}
	if (oldVersion < 2.9){
		if (game.options.menu.showFullBreed.enabled == 2) game.options.menu.showFullBreed.enabled = 1;
		if (game.global.totalPortals >= 1) message("Use of the portal has created a chance for the Void to seep into your world. Be alert.", "Story", null, "voidMessage");
	}
	if (oldVersion < 3){
		game.global.heirloomSeed = getRandomIntSeeded(game.global.voidSeed, 0, 1000000);
	}
	if (oldVersion < 3.1){
		game.global.heirloomBoneSeed = getRandomIntSeeded(game.global.heirloomSeed, 0, 1000000);
	}
	/* if (oldVersion < 3.11){
		game.global.eggSeed = getRandomIntSeeded(game.global.heirloomBoneSeed, 0, 1000000);
		cancelTooltip();
		noOfflineTooltip = true;
		tooltip("Eggs", null, 'update');
	} */
	if (oldVersion < 3.2){
		game.global.researched = true;
	}
	if (oldVersion < 3.21){
		game.achievements.oneOffs.finished.push(false);
		game.achievements.oneOffs.filters.push(-1);
	}
	if (oldVersion < 3.23){
		game.global.autoPrestiges = (game.global.autoPrestiges === true) ? 1 : 0;
		game.global.voidMaxLevel = game.global.highestLevelCleared;
	}
	if (oldVersion < 3.3){
		if (game.global.highestLevelCleared >= 59) game.global.autoUpgradesAvailable = true;
		if (game.global.sLevel >= 4) game.buildings.Warpstation.craftTime = 0;
	}
	if (oldVersion < 3.6){
		if (game.achievements.oneOffs.finished.length > 12)
			game.achievements.oneOffs.finished.splice(12, game.achievements.oneOffs.finished.length - 12);
		var newFinished = game.achievements.oneOffs.finished;
		var removed = newFinished.splice(10, 2);
		for (var x = 0; x < 12; x++) newFinished.push(false);
		newFinished.splice(18, 0, removed[0]);
		newFinished.splice(19, 0, removed[1]);
		game.achievements.oneOffs.finished = newFinished;
		addNewSetting("tinyButtons");
	}
	if (oldVersion < 3.7){
		game.global.messages.Loot.essence = true;
		if (game.global.highestLevelCleared >= 180) addNewSetting('masteryTab');
	}
	if (oldVersion < 3.71){
		checkAchieve("totalHelium");
	}
	if (oldVersion < 3.81){
		for (var x = 0; x < game.global.gridArray.length; x++){
			if (game.global.gridArray[x].corrupted) game.global.gridArray[x].mutation = "Corruption";
		}
	}
	if (oldVersion < 3.811){
		game.global.messages.Loot.events = true;
	}
	if (oldVersion < 4){
		if (game.global.world >= 230) game.global.canMagma = false;
		else if (game.global.highestLevelCleared > 229){
			game.global.highestLevelCleared = 229;
			if (game.global.roboTrimpLevel > 8)
				game.global.roboTrimpLevel = 8;
		}
		game.resources.trimps.potency = 0.0085;
		if (game.global.spentEssence > 0){
			for (var item in game.talents){
				game.talents[item].purchased = false;
				if (item == "foreman") continue;
				if (game.talents[item].purchased && typeof game.talents[item].onRespec === 'function') game.talents[item].onRespec();
			}
			if (typeof savegame.talents.foreman !== 'undefined' && savegame.talents.foreman.purchased) game.global.autoCraftModifier -= 1250;
			if (typeof savegame.talents.foreman2 !== 'undefined' && savegame.talents.foreman2.purchased) game.global.autoCraftModifier -= 3750;
			game.global.essence += game.global.spentEssence;
			game.global.spentEssence = 0;
			message("Due to a rework of the current Masteries, all of your spent Dark Essence has been refunded for free! Don't forget to repurchase your Masteries!", "Notices");
			updateTalentNumbers();
		}
		game.global.messages.Loot.magma = true;
	}
	if (oldVersion < 4.01){
		game.global.messages.Loot.events = true;
		if (game.stats.trimpsGenerated.value > 0){
			game.global.trimpsGenerated = game.stats.trimpsGenerated.value;
			game.stats.trimpsGenerated.value = scaleNumberForBonusHousing(game.stats.trimpsGenerated.value);
		}
		if (game.stats.highestVoidMap.valueTotal > 230)
			game.stats.highestVoidMap.valueTotal = 230;
	}
	if (oldVersion < 4.1){
		game.achievements.humaneRun.earnable = false;
		game.achievements.humaneRun.lastZone = -1;
	}
	if (oldVersion < 4.2){
		if (game.global.highestLevelCleared > 64){
			tooltip("UnlockedChallenge2", null, 'update');
			noOfflineTooltip = true;
		}
	}
	if (oldVersion == 4.2){
		countChallengeSquaredReward();
	}
	if (oldVersion < 4.3){
		if (game.global.Geneticistassist)
			addNewSetting("geneSend");
		addNewSetting('fireForJobs');
		if (game.global.highestLevelCleared >= 59)
			addNewSetting('ctrlGigas');
		if (game.global.spentEssence > 0)
			respecTalents(false, true);
	}
	if (oldVersion < 4.31 && game.global.world >= 230){
		game.stats.decayedNurseries.value = game.buildings.Nursery.purchased - game.buildings.Nursery.owned;
	}
	if (oldVersion < 4.5 && typeof game.portal.Looting_II !== 'undefined' && game.portal.Looting_II.locked == false){
		game.global.spiresCompleted = 1;
		game.global.b += 20;
		message("Welcome to Patch 4.5! Since you have already cleared Spire I, you have been given 20 bones and earned 5% Zone Liqufication. Click 'What's New' to see what's new!", "Story");
	}
	if (oldVersion < 4.6){
		if (game.global.highestLevelCleared >= 79) addNewSetting('bigPopups');
		if (game.talents.bionic.purchased) game.talents.bionic.onPurchase();
		// sessionMapValues Will break things after 4.7
		// preset.specMod = "0";
		// preset.perf = false;
		// preset.extra = 0;
		game.jobs.Explorer.modifier *= 4;
		var booksNeeded = Math.floor((game.global.world - 10) / 10);
		if (booksNeeded > 0){
			for (var x = 0; x < booksNeeded; x++) {
				unlockUpgrade("Speedexplorer");
				game.mapUnlocks.Speedexplorer.next += 10;
			}
		}
		for (var item in game.c2){
			if (savegame.challenges && savegame.challenges[item] && savegame.challenges[item].highestSquared) game.c2[item] = savegame.challenges[item].highestSquared;
		}
		addNewFeats([3, 6, 19, 20, 25, 26, 30, 31, 32, 33, 34, 35]);
		countChallengeSquaredReward();
		if (checkLowestHeirloom() >= 7) giveSingleAchieve("Swagmatic");
	}
	else if (oldVersion < 4.601) {
		//only run if game was already on 4.6
		game.mapUnlocks.Speedexplorer.next -= 10;
	}
	if (oldVersion < 4.602){
		game.global.messages.Loot.cache = true;
	}
	if (oldVersion < 4.603 && typeof game.global.messages.Loot.token === 'undefined'){
		game.global.messages.Loot.token = true;
	}
	if (oldVersion < 4.7){
		if (oldVersion >= 4.6) game.global.mapPresets.p1 = savegame.global.sessionMapValues;
		if (game.global.spiresCompleted >= 2) game.portal.Capable.locked = false;
		if (game.global.spiresCompleted >= 3) game.portal.Cunning.locked = false;
		if (game.global.spiresCompleted >= 4) game.portal.Curious.locked = false;
		addNewSetting("smallPerks");
		if (game.options.menu.masteryTab.lockUnless()) addNewSetting("masteryTab");
		game.global.messages.Loot.bone = true;
	}
	if (oldVersion < 4.71){
		if (game.global.challengeActive == "Trimp" && game.global.world >= 230){
			if (game.upgrades.Coordination.done > 0){
				game.global.capTrimp = true;
				message("I'm terribly sorry, but your Trimp<sup>2</sup> run appears to have more than one Trimp fighting, which kinda defeats the purpose. Your score for this Challenge<sup>2</sup> will be capped at 230.", "Notices")
			}
			else {
				game.upgrades.Coordination.allowed = 0;
				game.upgrades.Coordination.locked = true;
				game.challenges.Trimp.heldBooks += 100;
			}
		}
		if (game.c2.Trimp > 230) game.c2.Trimp = 230;
		countChallengeSquaredReward();
	}
	if (oldVersion < 4.8){
		game.options.menu.mapAtZone.setZone = [game.options.menu.mapAtZone.setZone];
		if (savegame.unlocks && savegame.unlocks.quickTrimps) game.singleRunBonuses.quickTrimps.owned = true;
		if (savegame.unlocks && savegame.unlocks.goldMaps) game.singleRunBonuses.goldMaps.owned = true;
		checkAchieve("dailyHelium");
		checkAchieve("totalHeirlooms");
		reevaluateTimedAchieve("spireTimed");
		reevaluateTimedAchieve("spire2Timed");
		reevaluateTimedAchieve("spire4Timed");
		addNewFeats([0, 33, 38, 39, 40, 41]);
		calculateAchievementBonus();
	}
	if (oldVersion < 4.801){
		if (countPurchasedTalents() == 40) game.global.essence = 0;
	}
	if (oldVersion < 4.813){
		//Fix for people who haven't played since the 2016 Trimpmas event, with the old style TrimpmasSnow.
		for (var x = 0; x < game.global.gridArray.length; x++){
			if (game.global.gridArray[x].mutation == "TrimpmasSnow") delete game.global.gridArray[x].mutation;
		}
	}
	if (oldVersion < 4.814) {
		if (oldVersion > 2.8){
			var resources = ['food', 'wood', 'metal', 'gems', 'fragments'];
			var newAvgs = {};
			for (var x = 0; x < resources.length; x++) {
				var res = resources[x];
				newAvgs[res] = {
					accumulator: 0,
					average: game.global.lootAvgs[res].reduce(function(a, b) {
						return a + b;
					}, 0)
					/ (game.global.lootAvgs[res].length || 1)
				};
			}
			game.global.lootAvgs = newAvgs;
		}
		game.settings.ewma_alpha = 0.05;
		game.settings.ewma_ticks = 10;
	}
	if (oldVersion < 4.9){
		if (game.global.spentEssence > 0){
			respecTalents(true, true);
			message("<span style='color: #1ab1d6; font-size: 1.2em;'>WELCOME TO 4.9!</span> Due to a rework of the current Masteries, all of your spent Dark Essence has been refunded for free! Don't forget to repurchase your Masteries!", "Notices", null, "patchNotice");
		}
		if (game.global.spiresCompleted >= 5){
			game.portal.Classy.locked = false;
			message("Since you've previously cleared Spire V, you've unlocked the brand new <b>Classy</b> perk!", "Notices", null, "patchNotice");
		}
		game.global.mapPresets.p1.offset = 'd';
		game.global.mapPresets.p2.offset = 'd';
		game.global.mapPresets.p3.offset = 'd';
		addNewFeats([8, 20, 28, 43, 46, 47]);
		if (game.global.spiresCompleted >= 1){
			var bonus = Math.pow(4, game.global.spiresCompleted);
			message("Since you've previously cleared " + game.global.spiresCompleted + " Spires, you've gained a " + bonus + "x bonus to all Dark Essence drops! Each new Spire you clear will increase this by another 4x.", "Notices", null, "patchNotice");
		}
		Fluffy.calculateInfo();
		if (Fluffy.isRewardActive('void')){
			var mapsRemoved = 0;
			for (var x = game.global.mapsOwnedArray.length; x >= 0; x--){
				var thisMap = game.global.mapsOwnedArray[x];
				if (!thisMap) continue;
				if (game.global.lookingAtMap == thisMap.id || game.global.currentMapId == thisMap.id) continue;
				if (thisMap.location != "Void") continue;
				game.global.totalVoidMaps--;
				game.global.mapsOwnedArray.splice(x, 1);
				game.global.mapsOwned--;
				mapsRemoved++;
			}
			for (var y = 0; y < mapsRemoved; y++){
				createVoidMap(false, false, true);
			}
		}
	}
	if (oldStringVersion == null){
		//Last version was pre 4.10.0. Run compat code for 4.10.0
		if (game.global.spiresCompleted >= 1){
			playerSpire.init();
			playerSpire.spirestones = 20;
			playerSpire.openPopup();
		}
		if (game.achievements.oneOffs.finished.length < 48){
			for (var x = game.achievements.oneOffs.finished.length; x < 48; x++){
				game.achievements.oneOffs.finished[x] = false;
			}
		}
		addNewFeats([9, 30, 31, 36, 48, 49, 50, 51, 56, 57, 58, 59]);
		if (game.global.recentDailies.length >= 7) giveSingleAchieve("Now What");
		oldStringVersion = [4, 10, 0];
	}
	else {
		oldStringVersion = [parseInt(oldStringVersion[0], 10), parseInt(oldStringVersion[1], 10), parseInt(oldStringVersion[2], 10)];
	}
	//Last version was at least 4.10.0, continue as normal
	if (compareVersion([4, 10, 2], oldStringVersion)){
		//Bug fix for a few missing spires
		if (game.global.spiresCompleted >= 1 && !playerSpire.initialized){
			playerSpire.init();
			playerSpire.spirestones = 20;
			playerSpire.openPopup();
		}
	}
	if (compareVersion([4,11,0], oldStringVersion)){
		if (game.global.freeTalentRespecs < 3) game.global.freeTalentRespecs++;
	}
	if (compareVersion([5,0,0], oldStringVersion)){
		//Create backup of old save
		if (unparsedSave){
			try{
				localStorage.setItem("trimpBackup1",unparsedSave);
			}
			catch(e){
				console.log(e);
			}
		}
		//Give Nu for value of current Heirlooms
		var spentValue = 0;
		if (game.global.ShieldEquipped.name) spentValue += getTotalHeirloomRefundValue(game.global.ShieldEquipped, true);
		if (game.global.StaffEquipped.name) spentValue += getTotalHeirloomRefundValue(game.global.StaffEquipped, true);
		for (var hc = 0; hc < game.global.heirloomsCarried.length; hc++){
			var loom = game.global.heirloomsCarried[hc];
			if (loom.type == "Core") continue;
			spentValue += getTotalHeirloomRefundValue(loom, true);
		}
		for (var he = 0; he < game.global.heirloomsExtra.length; he++){
			var loom = game.global.heirloomsExtra[he];
			if (loom.type == "Core") continue;
			spentValue += getTotalHeirloomRefundValue(loom, true);
		}
		game.global.nullifium += spentValue;
		//Talent Conversion
		if (savegame.talents){
			game.talents.heirloom.purchased = (savegame.talents.turkimp2 && savegame.talents.turkimp2.purchased);
			game.talents.turkimp2.purchased = (savegame.talents.turkimp3 && savegame.talents.turkimp3.purchased);
			game.talents.heirloom2.purchased = (savegame.talents.turkimp4 && savegame.talents.turkimp4.purchased);
			game.talents.mapHealth.purchased = (savegame.talents.nature && savegame.talents.nature.purchased);
			game.talents.nature.purchased = (savegame.talents.nature2 && savegame.talents.nature2.purchased);
			game.talents.nature2.purchased = (savegame.talents.nature3 && savegame.talents.nature3.purchased);
			game.global.freeTalentRespecs++;
			if (game.global.freeTalentRespecs > 3) game.global.freeTalentRespecs = 3;
		}
		//Convert Perk Presets
		if (typeof savegame.global.perkPreset1 !== 'undefined'){
			game.global.perkPresetU1.perkPreset1 = savegame.global.perkPreset1;
			game.global.perkPresetU1.perkPreset2 = savegame.global.perkPreset2;
			game.global.perkPresetU1.perkPreset3 = savegame.global.perkPreset3;
		}
		game.portal.Classy.max = 75;
		//U2 Message for people above E8L10
		if (game.global.fluffyPrestige > 8){
			cancelTooltip();
			tooltip("A Whole New World", null, 'update');
			noOfflineTooltip = true;
		}
	}
	if (compareVersion([5,0,3], oldStringVersion)){
		if (game.global.highestRadonLevelCleared > 0){
			game.global.voidMaxLevel2 = game.global.highestRadonLevelCleared;
			game.global.voidMaxLevel = game.global.lastPortal;
		}
	}
	if (compareVersion([5,0,4], oldStringVersion)){
		game.portal.Trumps.locked = false;
	}
	if (compareVersion([5,1,0], oldStringVersion)){
		if (savegame.options && savegame.options.menu){
			if (savegame.options.menu.mapAtZone){
				var arr = [];
				for (var x = 0; x < savegame.options.menu.mapAtZone.setZone.length; x++){
					arr.push({
						world: savegame.options.menu.mapAtZone.setZone[x],
						check: false,
						preset: 0,
						repeat: 0,
						until: 0,
						exit: 0,
						bwWorld: 125
					})
				}
				game.options.menu.mapAtZone.setZone = arr;
				if (savegame.options.menu.mapAtZone.setZoneU2){
					arr = [];
					for (var x = 0; x < savegame.options.menu.mapAtZone.setZoneU2.length; x++){
						arr.push({
							world: savegame.options.menu.mapAtZone.setZoneU2[x],
							check: false,
							preset: 0,
							repeat: 0,
							until: 0,
							exit: 0,
							bwWorld: 125
						})
					}
					game.options.menu.mapAtZone.setZoneU2 = arr;
				}
			}
		}
		if (game.global.ShieldEquipped.name){
			game.global.ShieldEquipped.id = 1;
			game.global.ShieldEquipped.icon = '*shield3';
		}
		if (game.global.StaffEquipped.name){
			game.global.StaffEquipped.id = 2;
			game.global.StaffEquipped.icon = 'grain';
		}
		if (game.global.CoreEquipped.name) game.global.CoreEquipped.icon = 'adjust';
		for (var hc = 0; hc < game.global.heirloomsCarried.length; hc++){
			var loom = game.global.heirloomsCarried[hc];
			loom.id = (3 + hc);
			var type = loom.type;
			loom.icon = ((type == "Core") ? 'adjust' : (type == "Shield") ? '*shield3' : 'grain');
		}
		for (var he = 0; he < game.global.heirloomsExtra.length; he++){
			var loom = game.global.heirloomsExtra[he];
			loom.id = (3 + game.global.heirloomsCarried.length + he);
			var type = loom.type;
			loom.icon = ((type == "Core") ? 'adjust' : (type == "Shield") ? '*shield3' : 'grain');
		}
		if (game.buildings.Microchip.owned > 5) game.buildings.Microchip.owned = 5;
	}
	if (compareVersion([5,3,0], oldStringVersion)){
		if (game.global.freeTalentRespecs < 3) game.global.freeTalentRespecs++;
		if (savegame.talents){
			game.talents.herbalist.purchased = (savegame.talents.foreman && savegame.talents.foreman.purchased);
			if (savegame.talents.foreman && savegame.talents.foreman.purchased && game.global.roboTrimpLevel == 0){
				//Probably isn't possible that someone had a t2 mastery without ever doing a BW but you never know
				game.global.autoCraftModifier -= 12500;
				updateForemenCount();
			}
			else if ((!savegame.talents.foreman || !savegame.talents.foreman.purchased) && game.global.roboTrimpLevel >= 1){
				game.global.autoCraftModifier += 12500;
				updateForemenCount();
			}
			game.talents.mapHealth.purchased = (savegame.talents.doubleBuild && savegame.talents.doubleBuild.purchased);
			game.talents.maz.purchased = (savegame.talents.mapHealth && savegame.talents.mapHealth.purchased);
			game.talents.mapBattery.purchased = (savegame.talents.autoJobs && savegame.talents.autoJobs.purchased);
			if (savegame.talents.autoJobs && savegame.talents.autoJobs.purchased && game.global.roboTrimpLevel < 2){
				toggleAutoJobs(true, true);
			}
			game.talents.magimp.purchased = (savegame.talents.autoStructure && savegame.talents.autoStructure.purchased);
			if (savegame.talents.autoStructure && savegame.talents.autoStructure.purchased && game.global.roboTrimpLevel < 3){
				toggleAutoStructure(true, true);
			}
		}
		game.global.lootAvgs.science = {average: 0, accumulator: 0};
		game.achievements.oneOffs2.finished.push(false);
		game.global.autoGoldenU2 = game.global.autoGolden;
		if (game.global.roboTrimpLevel > 0){
			noOfflineTooltip = true;
			var text = "<b style='font-size: 1.5em; color: blue'>Welcome to Patch 5.3.0!</b> For your past completions of " + game.global.roboTrimpLevel + " unique Bionic Wonderland Tier" + needAnS(game.global.roboTrimpLevel) + ", you have unlocked the following permanent special bonuses: Foremany (Permanently adds 50000 Foreman to your town to aid in construction)";
			if (game.global.roboTrimpLevel > 1) text += ", AutoJobs";
			if (game.global.roboTrimpLevel > 2) text += ", AutoStructure";
			if (game.global.roboTrimpLevel > 4) text += ", and Double Build (Stacked items in the Building Queue will be constructed two at a time)";
			text += ".";
			if (game.global.highestLevelCleared >= 179) text += " As these bonuses were previously Masteries and are now not, new Masteries have been added to replace these!";
			text += "<br/><br/>A lot of other new stuff has just been added to Trimps as well, click <a target='_blank' href='https://trimps.github.io/updates.html'>What's New</a> in the bottom right of your game window to see the full patch notes!";
			tooltip('confirm', null, 'update', text, null, 'Welcome to 5.3.0', 'Got it!', null, true);
		}
	}
	if (compareVersion([5,4,0], oldStringVersion)){
		if (game.portal.Overkill.radLevel){
			game.portal.Hunger.radLevel = game.portal.Overkill.radLevel;
			game.portal.Hunger.radSpent = game.portal.Overkill.radSpent;
			game.portal.Overkill.radLevel = 0;
			game.portal.Overkill.radSpent = 0;
		}
		if (!game.portal.Overkill.radLocked){
			game.portal.Hunger.radLocked = false;
		}
		game.portal.Overkill.radLocked = true;
		if (game.global.fluffyPrestige2 > 0) game.global.fluffyExp2 += 349525000;
		game.global.fluffyPrestige2 = 0;
		game.global.mapPresets.p4 = Object.assign({}, game.global.mapPresets.p1);
		game.global.mapPresets.p5 = Object.assign({}, game.global.mapPresets.p2);
		game.global.mapPresets2.p4 = Object.assign({}, game.global.mapPresets2.p1);
		game.global.mapPresets2.p5 = Object.assign({}, game.global.mapPresets2.p2);
		game.global.messages.Loot.exp = true;
		if (game.global.universe == 2 && game.global.world > 50) unlockJob("Worshipper");
		if (game.global.mayhemCompletions > game.challenges.Mayhem.maxRuns) game.global.mayhemCompletions = game.challenges.Mayhem.maxRuns;
		for (var x = 0; x < 4; x++) game.achievements.oneOffs2.finished.push(false);
	}
	if (compareVersion([5,5,0], oldStringVersion)){
		if (game.global.challengeActive == "Archaeology" && game.global.world >= 91) game.challenges.Archaeology.onComplete();
		if (savegame.portal.Equality){
		savegame.portal.Equality.reversingSetting = savegame.portal.Equality.scalingSetting + 1;
		if (savegame.portal.Equality.reversingSetting > 10) savegame.portal.Equality.reversingSetting = 10;
		}
		addNewFeats([10,11,19,20,21,22], true);
		checkAchieve("zones2");
		checkAchieve("totalRadon");
		if (game.global.highestRadonLevelCleared >= 74){
			noOfflineTooltip = true;
			autoBattle.firstUnlock();
		}
		if (game.portal.Observation.trinkets >= 7500) giveSingleAchieve("Heavy Trinker");
		if (game.global.mayhemCompletions >= 25) giveSingleAchieve("Peace");
	}
	if (compareVersion([5,6,0], oldStringVersion)){
		addNewFeats([23, 24], true);
	}
	if (compareVersion([5,7,0], oldStringVersion)){
		addNewSetting('equipHighlight');
		if (game.global.highestRadonLevelCleared < 154 && typeof game.global.messages.Loot.alchemy !== 'undefined') delete game.global.messages.Loot.alchemy;
		if (savegame && savegame.talents && savegame.talents.deciBuild && savegame.talents.deciBuild.purchased) game.talents.kerfluffle.purchased = true;
	}
	if (compareVersion([5,7,2], oldStringVersion)){
		game.global.messages.Loot.voidMaps = true;
	}
	if (compareVersion([5,8,0], oldStringVersion)){
		if (game.global.universe == 1){
			for (var x = 0; x < game.global.mapsOwnedArray.length; x++){
				var map = game.global.mapsOwnedArray[x];
				if (map.location != "Void") continue;
				if (game.global.world <= 199){
					if (game.global.world >= 60){
						map.difficulty--;
					}
					else{
						map.difficulty /= 2;
					}
				}
				else {
					map.loot++;
				}
				
			}
		}
		if (game.global.highestRadonLevelCleared >= 200){
			game.global.tabForMastery = false;
			document.getElementById('MasteryTabName').innerHTML = "Mutators";
		}
		checkAchieve("zones");
		checkAchieve("dailyHelium");
		addNewFeats([25,26], true);
		checkAchieve("totalGems")
		game.stats.runetrinkets.valueTotal = game.portal.Observation.trinkets;
	}
	if (compareVersion([5,9,0], oldStringVersion)){
		if (autoBattle.maxEnemyLevel > 150) autoBattle.maxEnemyLevel = 150;
		if (autoBattle.enemyLevel > 150) autoBattle.enemyLevel = 150;
		var spentValue = 0;
		if (game.global.CoreEquipped.name) spentValue += getTotalHeirloomRefundValue(game.global.CoreEquipped, true);
		for (var hc = 0; hc < game.global.heirloomsCarried.length; hc++){
			var loom = game.global.heirloomsCarried[hc];
			if (loom.type != "Core") continue;
			spentValue += getTotalHeirloomRefundValue(loom, true);
		}
		for (var he = 0; he < game.global.heirloomsExtra.length; he++){
			var loom = game.global.heirloomsExtra[he];
			if (loom.type != "Core") continue;
			spentValue += getTotalHeirloomRefundValue(loom, true);
		}
		playerSpire.spirestones += spentValue;
		if (game.global.maxCarriedHeirlooms < game.heirlooms.values.length){
			for (var mch = game.global.maxCarriedHeirlooms; mch < game.heirlooms.values.length; mch++){
				var cost = getNextCarriedCost();
				if (cost < game.global.nullifium) game.global.maxCarriedHeirlooms++;
				else break;
			}
		}
		getHazardParityMult();
		getHazardGammaBonus();
	}
	if (compareVersion([5,10,0], oldStringVersion)){
		if (playerSpire.rowsAllowed >= 20) giveSingleAchieve("Power Tower");
		if (savegame.portal.Equality){
			game.portal.Equality.settings.reg = {
				scalingActive: savegame.portal.Equality.scalingActive,
				scalingSetting: savegame.portal.Equality.scalingSetting,
				reversingSetting: savegame.portal.Equality.reversingSetting,
				scalingReverse: savegame.portal.Equality.scalingActive,
				disabledStackCount: savegame.portal.Equality.disabledStackCount
			}
		}
		var bestU2Voids = 0;
		if (game.global.universe == 2) {
			bestU2Voids = game.stats.totalVoidMaps.value;
			game.stats.mostU2Voids.value = bestU2Voids;
		}
		if (game.global.lastU2Voids > bestU2Voids) bestU2Voids = game.global.lastU2Voids;
		game.stats.mostU2Voids.valueTotal = bestU2Voids;
		autoBattle.checkAddRingSlot();
		game.global.autoUpgrades = (game.global.autoUpgrades) ? 1 : 0;
	}
	//End compatibility
	//Test server only

	//End test server only
	//Temporary until next patch

	//End Temporary
	portalUniverse = game.global.universe;
	Fluffy.handleBox();
	if (!getCurrentMapObject()) {
		game.global.currentMapId = "";
		game.global.mapGridArray = [];
		game.global.lastClearedMapCell = -1;
	}

	if (game.buildings.Gym.locked === 0) document.getElementById("blockDiv").style.visibility = "visible";
	if (getEnergyShieldMult() > 0 && game.upgrades.Battle.done) document.getElementById("blockDiv").style.visibility = "visible"

    if (game.global.gridArray.length > 0) {
        document.getElementById("battleContainer").style.visibility = "visible";
		fadeIn("equipmentTab", 10);
		fadeIn("equipmentTitleDiv", 10);
        drawGrid();
		if (checkIfSpireWorld() && !game.global.spireActive) clearSpireMetals();
        document.getElementById('metal').style.visibility = "visible";
        for (var x = 0; x <= game.global.lastClearedCell; x++) {
            swapClass("cellColor", "cellColorBeaten", document.getElementById("cell" + x));
        }
        if (game.global.battleClock > 0) document.getElementById("battleTimer").style.visibility = "visible";
    }
    if (game.global.mapGridArray.length > 0 && game.global.currentMapId !== "") {
        drawGrid(true);
        for (var y = 0; y <= game.global.lastClearedMapCell; y++) {
            swapClass("cellColor", "cellColorBeaten", document.getElementById("mapCell" + y));
        }
    } else if (game.global.mapGridArray.length === 0 && game.global.mapsActive) game.global.mapsActive = false;
    if (game.resources.trimps.owned > 0 || game.buildings.Trap.owned > 0) game.buildings.Trap.first();
    if (game.global.autoBattle) {
        fadeIn("pauseFight", 1);
        pauseFight(true);
    }
    for (var itemC in game.global.mapsOwnedArray) {
		if (game.global.mapsOwnedArray[itemC].name == "Dimension of Anger") game.global.mapsOwnedArray[itemC].level = 20;
        unlockMap(itemC);
    }
	for (var messageBool in game.global.messages){
		if (!game.global.messages[messageBool].enabled){
			filterMessage(messageBool, true);
		}
	}
	game.global.buyTab = "all";
	filterTabs("all");
	if (game.global.mapsUnlocked) unlockMapStuff();
	repeatClicked(true);
	document.getElementById("worldNumber").innerHTML = game.global.world;
    mapsSwitch(true);
    checkTriggers(true);
	toggleAutoTrap(true);
	toggleAutoStructure(true);
	toggleAutoJobs(true);
	toggleAutoEquip(true);
	toggleAutoGolden(true);
	document.getElementById("goldConfig").style.display = (game.global.canGuString ? "block" : "none");
    setGather(game.global.playerGathering);
    numTab(1);
	if (!fromPf && game.options.menu.usePlayFab.enabled == 1) {
		game.options.menu.usePlayFab.enabled = 0;
		toggleSetting("usePlayFab", null, false, true);
		if (!enablePlayFab()) noOfflineTooltip = true;
	}
	if (fromPf){
		game.options.menu.usePlayFab.enabled = 1;
		toggleSetting("usePlayFab", null, false, true);
	}
	if (game.global.portalActive) {fadeIn("portalBtn", 10); fadeIn("helium", 10);}
	else if (game.resources.helium.owned > 0 || game.resources.radon.owned > 0) fadeIn("helium", 10);
	document.getElementById('heliumName').innerHTML = heliumOrRadon();
	document.getElementById('goodGuyBlockName').innerHTML = (game.global.universe == 2) ? "<span class='energyShieldIcon icomoon icon-shield2'></span>" : "BLK";
	if (game.jobs.Explorer.locked === 0) fadeIn("fragmentsPs", 10);
	if (game.buildings.Tribute.locked === 0 || game.options.menu.useAverages.enabled) fadeIn("gemsPs", 10);
    if (game.global.autoCraftModifier > 0)
        document.getElementById("foremenCount").innerHTML = (game.global.autoCraftModifier * 4) + " Foremen";
	if (game.global.fighting && game.global.soldierHealth <= 0) fight();
    else if (game.global.fighting) startFight();
	game.options.menu.darkTheme.onToggle();
	updateLabels();
	if (game.global.viewingUpgrades){
		viewPortalUpgrades();
		if (game.global.respecActive) respecPerks();
	}
	else game.global.respecActive = false;
	if (game.global.kongBonusMode) activateKongBonus();
	if (game.global.challengeActive !== ""){
		var challengeList;
		if (game.challenges[game.global.challengeActive].multiChallenge) challengeList = game.challenges[game.global.challengeActive].multiChallenge;
		else challengeList = [game.global.challengeActive];
		for (var cha = 0; cha < challengeList.length; cha++){
			if (typeof game.challenges[challengeList[cha]].onLoad !== 'undefined') game.challenges[challengeList[cha]].onLoad();
		}
	}
	if (game.global.challengeActive != "Scientist") document.getElementById("scienceCollectBtn").style.display = "block";
	if (game.global.brokenPlanet) {
		// document.getElementById("wrapper").style.background = "url(css/bg2_vert.png) center repeat-y";
		document.getElementById("wrapper").className = "wrapperBroken";
		if (game.global.roboTrimpLevel > 0) displayRoboTrimp();
	}
	if (challengeActive("Balance") || game.global.challengeActive == "Unbalance"){
		updateBalanceStacks();
	}
	u2Mutations.checkStacks();
	if (game.global.spireActive) handleExitSpireBtn();
	game.options.displayed = false;
	game.options.menu.barOutlines.onToggle();
	game.options.menu.progressBars.onToggle();
	game.options.menu.autoSave.onToggle();
	game.options.menu.tinyButtons.onToggle();
	if (usingScreenReader) game.options.menu.showSRInfo.onToggle();

	displayPerksBtn();
	displayGoldenUpgrades();
	if (game.global.highestLevelCleared >= 180 && game.global.tabForMastery) updateTalentNumbers();
	//3.6 bug fix
	if (getAchievementStrengthLevel() <= 0) {
		game.global.goldenUpgrades = 0;
		for (var item in game.goldenUpgrades){
			game.goldenUpgrades[item].currentBonus = 0;
		}
	}
	fireMode(true);

	if (game.global.autoUpgradesAvailable){
		document.getElementById("autoUpgradeBtn").style.display = "block";
		toggleAutoUpgrades(true);
	}
	if (game.global.sLevel >= 4){
		document.getElementById("autoPrestigeBtn").style.display = "block";
		toggleAutoPrestiges(true);
	}
	if (game.global.autoStorageAvailable){
		document.getElementById("autoStorageBtn").style.display = "block";
		toggleAutoStorage(true);
	}
	unlockFormation("all");
	setFormation();
	game.permaBoneBonuses.boosts.updateBtn();
	toggleSetting("mapLoot", null, false, true);
	toggleSetting("repeatUntil", null, false, true);
	toggleSetting("exitTo", null, false, true);
	toggleSetting("repeatVoids", null, false, true);
	toggleSetting("mapAtZone", null, false, true);
	game.global.removingPerks = false;
	game.global.switchToMaps = false;

	if (game.global.voidBuff) setVoidBuffTooltip();
	if (game.upgrades.Gigastation.done >= 1) loadGigastations();
	checkChallengeSquaredAllowed();

	if (oldVersion < 2){
		if (game.global.world == 59){
			game.global.gridArray[99].name = "Improbability";
			message("Your Scientists have detected an anomaly at the end of this Zone. Exercise caution.", "Notices");
		}
		else if (game.global.world == 60 && game.global.lastClearedCell <= 10){
			planetBreaker();
			game.global.world = 59;
			nextWorld();
		}
		else if (game.global.world >= 60){
			message("There is a new anomaly at 59, but you are too far past to reach it. You will have to use your portal to see the changes it brings. It looks like you have access to a new challenge, however!", "Notices");
		}
		else {
			message("Your scientists have detected an anomaly at the end of Zone 59. They warn you to be careful if you intend to approach it.", "Notices");
		}
	}
	document.getElementById("tab5Text").innerHTML = "+" + prettify(game.global.lastCustomAmt);
	game.global.lastUnlock = 0;
	if (game.resources.gems.owned > 0) fadeIn("gems", 10);
	updateSkeleBtn();
	if (game.talents.turkimp2.purchased || game.global.turkimpTimer > 0) document.getElementById("turkimpBuff").style.display = "block";
	if ((game.stats.totalHeirlooms.value + game.stats.totalHeirlooms.valueTotal) > 0) document.getElementById("heirloomBtnContainer").style.display = "block";
	calculateAchievementBonus();
	if(game.global.firing)
		swapClass("fireBtn", "fireBtnFiring", document.getElementById("fireBtn"));
	else
		swapClass("fireBtn", "fireBtnNotFiring", document.getElementById("fireBtn"));
	loadSingleBonusColors()
	handlePoisonDebuff();
	handleIceDebuff();
	handleWindDebuff();
	setEmpowerTab();
	refreshMaps();
	setAdvMaps2UnlockText();
	countChallengeSquaredReward();
	manageEqualityStacks();
	setTrimpColSize();
	setUniverseStyle();
	if (game.global.tutorialActive) tutorial.load();
	if (game.global.totalVoidMaps > 0 && !game.global.mapsActive) addVoidAlert();
	if (!game.options.menu.pauseGame.enabled) {
		//If not paused and offline progress is enabled, run offline progress
		if (game.options.menu.offlineProgress.enabled)
			checkOfflineProgress(noOfflineTooltip);
		//If not paused and offline progress is disabled, fix clock
		else {
			var timeToAdd = (new Date().getTime() - game.global.lastOnline);
			game.global.portalTime += timeToAdd;
			game.global.zoneStarted += timeToAdd;
		}
	}
	//If paused, set clock pulse
	else {
		handlePauseMessage(true);
		updatePortalTimer();
		document.getElementById("portalTimer").className = "timerPaused";
	}
	return true;
}

function compareVersion(compareTo, compare, parseFirst){
	if (parseFirst){
		compareTo = [parseInt(compareTo[0], 10), parseInt(compareTo[1], 10), parseInt(compareTo[2], 10)];
		compare = [parseInt(compare[0], 10), parseInt(compare[1], 10), parseInt(compare[2], 10)];
	}
	//Returns true if compare (old version) is older than compareTo (new version)
	//Use case like 'compareVersion([4,11,0], [4,10,0])' to see if compat code for 4.11.0 should run on a save from 4.10.0. Would be true.
	if (compare[0] < compareTo[0]) return true;
	if (compare[0] > compareTo[0]) return false;
	if (compare[1] < compareTo[1]) return true;
	if (compare[1] > compareTo[1]) return false;
	if (compare[2] < compareTo[2]) return true;
	return false;
}

function handlePauseMessage(send){
	//post the message
	if (send){
		postMessages();
		if (document.getElementsByClassName('pauseMsg').length == 0){
			var text = "<b>YOUR GAME IS PAUSED!</b> Click the flashing timer in the bottom right" + ((game.options.menu.hotkeys.enabled) ? ", or press the spacebar" : "") + " to unpause.";
			message(text, "Notices", null, 'pauseMsg');
			postMessages();
		}
		return;
	}
	//clear the message
	postMessages();
	var pauseMsgs = document.getElementsByClassName('pauseMsg');
	var log = document.getElementById('log');
	for (var x = 0; x < pauseMsgs.length; x++){
		log.removeChild(pauseMsgs[x]);
	}
}

function reevaluateTimedAchieve(achieveName){
	var best = 0;
	var achieve = game.achievements[achieveName];
	if (!achieve) return;
	if (achieve.highest == 0 && achieve.finished == 0) return;
	for (var x = achieve.breakpoints.length - 1; x >= 0; x--){
		if (achieve.highest < achieve.breakpoints[x]) {
			best = x + 1;
			break;
		}
	}
	achieve.finished = best;
}

function startTrackAchieve(group, index){
	if (!group || (game.global.trackedAchieve != null && game.global.trackedAchieve[0] == group && game.global.trackedAchieve[1] == index)){
		game.global.trackedAchieve = null;
		trackAchievement();
		displayAchievements();
		return;
	}
	var achievement = game.achievements[group];
	var one = (typeof achievement.finished !== 'number');
	if (((!one && !achievement.showAll && index > achievement.finished) || (one && (achievement.filterLevel() < achievement.filters[index] && !achievement.finished[index])))){
		//Locked
		game.global.trackedAchieve = null;
		return;
	}
	game.global.trackedAchieve = [group, index];
	trackAchievement();
	displayAchievements();
}

function trackAchievement(){
	var tracker = document.getElementById('achievementTracker');
	if (!tracker) return;
	if (game.global.trackedAchieve == null){
		if (tracker.style.display != 'none') tracker.style.display = 'none';
		return;
	}
	tracker.style.display = 'block';
	displayAchievementPopup(game.global.trackedAchieve[0], false, game.global.trackedAchieve[1], true);
	var displayColor = "";
	var item = game.global.trackedAchieve[0];
	var x = game.global.trackedAchieve[1];
	var achievement = game.achievements[item];
	var one = (typeof achievement.finished !== 'number');
	if ((!one && achievement.finished == x) || (one && !achievement.finished[x] && achievement.filterLevel() >= achievement.filters[x])) {
		if (item == "humaneRun" || item == "mapless" || item == "shielded")
			displayColor = (achievement.evaluate(x) == 0) ? "achieveTrackerColorRed" : "achieveTrackerColorYellow";
		else if (achievement.timed){
			displayColor = (game.global.universe != achievement.u || achievement.evaluate() >= achievement.breakpoints[achievement.finished]) ? "achieveTrackerColorRed": "achieveTrackerColorYellow";
		}
		else
			displayColor = (one && !checkFeatEarnable(achievement.names[x])) ? "achieveTrackerColorRed" : "achieveTrackerColorYellow";
	}
	else if ((one && achievement.finished[x]) || (!one && achievement.finished > x)) {
		displayColor = "achieveTrackerColorGreen";
	}
	var progElem = document.getElementById('achievementTrackerProgress');
	if (!progElem.innerHTML){
		var text = "";
		if (displayColor == "achieveTrackerColorGreen") text += "<span style='color: #159515'><b>Progress:</b> Complete!</span>";
		else if (displayColor == "achieveTrackerColorRed") text += "<b>Progress:</b> Not Earnable!";
		else if (displayColor == "achieveTrakcerColorYellow") text += "<b>Progress:</b> Still Earnable!";
		if (text != "") progElem.innerHTML = text;
	}
	tracker.className = displayColor;
}

function addNewFeats(indexArray, u2){
	//After adding new feats, call this with the index of the new feats
	var newFeats = [];
	var inserted = 0;
	var oldFeats = (u2) ? game.achievements.oneOffs2.finished : game.achievements.oneOffs.finished;
	for (var x = 0; x < (oldFeats.length + indexArray.length); x++){
		if (indexArray.length > inserted && indexArray[inserted] == x){
			 newFeats.push(false);
			 inserted++;
		}
		else {
			newFeats.push(oldFeats[x - inserted]);
		}
	}
	if (u2) game.achievements.oneOffs2.finished = newFeats;
	else game.achievements.oneOffs.finished = newFeats;
}

function loadGigastations() {
	var modifier = Math.pow(1.75, game.upgrades.Gigastation.done);
	game.buildings.Warpstation.cost.gems[0] *= modifier;
	game.buildings.Warpstation.cost.metal[0] *= modifier;
}

function addMapModifier(location, modifier, clear){
	for (var x = 0; x < game.global.mapsOwnedArray.length; x++){
		var map = game.global.mapsOwnedArray[x];
		if (map.location != location) continue;
		map.bonus = (clear) ? "" : modifier;
		var parent = document.getElementById(map.id);
		if (!parent) continue;
		var levelSpan = parent.getElementsByClassName('mapLevel')[0];
		if (!clear){
			levelSpan.innerHTML += getMapSpecTag(modifier);
			continue;
		}
		var mapSpec = levelSpan.getElementsByClassName('mapSpec')[0];
		if (mapSpec != null)
			levelSpan.removeChild(mapSpec);
	}
}

var trimpStatsDisplayed = false;
function toggleStats(toggleMode){
	if (toggleMode) {
		game.global.statsMode = toggleMode;
		trimpStatsDisplayed = !trimpStatsDisplayed;
	}
	cancelTooltip();
	if (game.global.totalPortals == 0) document.getElementById("statsBtnRow").style.display = "none";
	document.getElementById("statsWrapper").style.display = (trimpStatsDisplayed) ? "none" : "block";
	document.getElementById("wrapper").style.display = (trimpStatsDisplayed) ? "block" : "none";
	trimpStatsDisplayed = !trimpStatsDisplayed;
	var mode = game.global.statsMode;
	var onBorder = "5px solid yellow";
	var offBorder = "5px solid black";
	document.getElementById("currentSelectBtn").style.border = (mode == "current") ? onBorder : offBorder;
	document.getElementById("totalSelectBtn").style.border = (mode == "total") ? onBorder : offBorder;
	document.getElementById("customSelectBtn").style.border = (mode == "custom") ? onBorder : offBorder;
	if (trimpStatsDisplayed){
		displayAllStats(true);
	}
	else if (game.global.statsMode == "custom") game.global.statsMode = "current";
}

function displayRoboTrimp() {
	if (game.global.roboTrimpLevel <= 0) return;
	var elem = document.getElementById("chainHolder");
	elem.style.visibility = "visible";
	var statusElem = document.getElementById('roboTrimpTurnsLeft')
	if (game.global.roboTrimpCooldown > 0){
		swapClass("shriekState", "shriekStateCooldown", elem);
		let text = game.global.roboTrimpCooldown
		if (usingScreenReader) text = "MagnetoShriek Cooldown: " + text
		statusElem.innerHTML = text
	}
	else {
		document.getElementById('roboTrimpTurnsLeft').innerHTML = "";
		var swapIn = (game.global.useShriek) ? 'shriekStateEnabled' : 'shriekStateDisabled';
		swapClass("shriekState", swapIn, elem);
		if (usingScreenReader){
			statusElem.innerHTML = (game.global.useShriek) ? "Deactivate MagnetoShriek" : "Activate MagnetoShriek";
		}
	}
}

function magnetoShriek() {
	if (game.global.universe != 1) return;
	if (game.global.roboTrimpCooldown > 0 || !game.global.roboTrimpLevel || game.global.world < 60) return;
	game.global.useShriek = !game.global.useShriek;
	if (usingScreenReader){
		screenReaderAssert("MagnetoShriek " + ((game.global.useShriek) ? "activated and will be used on this Zone's boss" : "deactivated") + ". Click again to " + ((game.global.useShriek) ? "deactivate" : "activate"));
	}
	displayRoboTrimp();
	if (game.global.useShriek && !game.global.mapsActive){
        var cell = getCurrentWorldCell();
		if (cell.name == "Improbability" || cell.name  == "Omnipotrimp"){
			activateShriek();
		}
	}
}

function activateShriek() {
	game.global.usingShriek = true;
	game.global.useShriek = false;
	game.global.roboTrimpCooldown = 5;
	displayRoboTrimp();
	updateAllBattleNumbers();
}

function disableShriek() {
	game.global.usingShriek = false;
	game.global.useShriek = false;
	swapClass("dmgColor", "dmgColorWhite", document.getElementById("badGuyAttack"));
}

function displayAllStats(buildAll) {
	if (buildAll) document.getElementById("statsRow").innerHTML = '<div class="col-xs-3" id="statCol1"></div><div class="col-xs-3" id="statCol2"></div><div class="col-xs-3" id="statCol3"></div><div class="col-xs-3" id="statCol4"></div>';
	var mode = game.global.statsMode;
	var column = 1;
	if (!buildAll && mode == "custom") return;
	for (var item in game.stats){
		var stat = game.stats[item];
		if (mode != "custom" && stat.hidden) continue;
		if (typeof stat.display === 'function'){
			if (!stat.display()) continue;
		}
		if (mode == "current" && typeof stat.displayCurrent === 'function'){
			if (!stat.displayCurrent()) continue;
		}
		if (typeof stat.value === 'undefined' && mode == 'current') continue;
		if (typeof stat.valueTotal == 'undefined' && mode == 'total') continue;
		if (mode == "custom"){
			document.getElementById("statCol" + column).innerHTML += '<div class="statContainer" id="stat' + item + 'Container"><span class="statTitle">' + stat.title + '</span><br/><span class="btn btn-' + ((stat.hidden) ? 'danger' : 'success') + ' btn-lg" onclick="toggleHideStat(\'' + item + '\', this)">' + ((stat.hidden) ? 'Unhide' : 'Hide') + '</span></div>'
			column++;
			if (column == 5) column = 1;
			continue;
		}
		var value = (mode == 'current') ? stat.value : stat.valueTotal;
		value = (typeof value === 'function') ? value() : value;
		if (mode == 'total' && typeof stat.valueTotal !== 'function' && typeof stat.value !== 'undefined' && !stat.noAdd) value += stat.value;
		if (!stat.noFormat) value = prettify(value);
		if (buildAll){
			document.getElementById("statCol" + column).innerHTML += '<div class="statContainer" id="stat' + item + 'Container"><span class="statTitle">' + stat.title + '</span><br/><span class="statValue" id="stat' + item + 'Value">' + value + '</span></div>'
			column++;
			if (column == 5) column = 1;
		}
		else {
			var elem = document.getElementById("stat" + item + "Value");
			if (elem && value) elem.innerHTML = value;
		}
	}
}

function toggleHideStat(stat, elem){
	var stat = game.stats[stat];
	stat.hidden = !stat.hidden;
	elem.className = "btn btn-" + ((stat.hidden) ? 'danger' : 'success') + " btn-lg";
	elem.innerHTML = (stat.hidden) ? "Unhide" : "Hide";  
}

function countChallengeSquaredReward(numberOnly, mesmerPreview, getUniverseArray){
	//"noMesmer" for mesmerPreview forces the calculation while ignoring mesmer
	//"mesmer" for mesmerPreview forces the calculation to include mesmer
	var reward = 0;
	var rewardU2 = 0;
	if (!mesmerPreview) mesmerPreview = false;
	for (var item in game.challenges){
		var challenge = game.challenges[item];
		if (!challenge.allowSquared) continue;
		var thisReward = getIndividualSquaredReward(item, false, mesmerPreview);
		if (challenge.allowU2 && challenge.blockU1) rewardU2 += thisReward;
		else reward += thisReward;
	}
	if (reward > 60000) reward = 60000;
	if (getUniverseArray) return [reward, rewardU2];
	reward *= ((rewardU2 / 100) + 1);
	if (reward >= 2000 && !mesmerPreview) giveSingleAchieve("Challenged");
	if (numberOnly) return reward;
	game.global.totalSquaredReward = reward;
}

var squaredConfig = {
		rewardFreq: 10,
		rewardEach: 1,
		rewardGrowth: 1,
		thresh: 100,
}

function getIndividualSquaredReward(challengeName, forceHighest, mesmerPreview){
	if (!forceHighest) forceHighest = game.c2[challengeName];
	if (forceHighest < 1) return 0;
	var obsidianStart = getObsidianStart();
	if (forceHighest > obsidianStart) forceHighest = obsidianStart;
	var challenge = game.challenges[challengeName];
	var bonus = 0;
	var thresh = (challenge.replaceSquareThresh) ? challenge.replaceSquareThresh : squaredConfig.thresh;
	var reward = (challenge.replaceSquareReward) ? challenge.replaceSquareReward : squaredConfig.rewardEach;
	var rewardGrowth = (challenge.replaceSquareGrowth) ? challenge.replaceSquareGrowth : squaredConfig.rewardGrowth;
	var freq = (challenge.replaceSquareFreq) ? challenge.replaceSquareFreq : squaredConfig.rewardFreq;
	var addedBonuses = 0;
	var loops = Math.ceil(forceHighest / thresh);
	if ((game.talents.mesmer.purchased || mesmerPreview == "mesmer") && (!challenge.onlySquared || challenge.allowMesmer) && mesmerPreview != "noMesmer"){
		if (!challenge.replaceSquareFreq && !challenge.replaceSquareGrowth && !challenge.replaceSquareReward && !challenge.replaceSquareThresh){
			reward *= 3;
			rewardGrowth *= 3;
		}
	}
	var obsidianStartBase = getObsidianStart(true);
	for (var x = 0; x < loops; x++){
		var count = (x == loops - 1) ? forceHighest - addedBonuses : thresh;
		var toAdd = (count - (count % freq));
		var extraBonus = 1;
		if (addedBonuses + toAdd > obsidianStartBase){
			if (addedBonuses >= obsidianStartBase) extraBonus = 5;
			else{
				var nonBonused = obsidianStartBase - addedBonuses;
				var overCap = (addedBonuses + toAdd) - obsidianStartBase;
				extraBonus = ((overCap / (overCap + nonBonused)) * 4) + 1;
			}
		}
		addedBonuses += count - (count % freq);
		count = Math.floor(count / freq);
		bonus += count * ((rewardGrowth * x) + reward) * extraBonus;
	}
	//console.log(addedBonuses);
	return Math.round(bonus);
}

function calculateMapCost(plusLevel = 0) {
	const mapPresets = game.global.universe === 2 ? game.global.mapPresets2 : game.global.mapPresets;
	const { loot, difficulty, size, biome, perf, specMod } = mapPresets[`p${game.global.selectedMapPreset}`];

	const mapLevel = Math.max(game.global.world, 6);
	let baseCost = loot + difficulty + size;
	baseCost *= game.global.world >= 60 ? 0.74 : 1;

	if (perf && [loot, difficulty, size].reduce((a, b) => a + b) === 27) baseCost += 6;
	if (plusLevel > 0) baseCost += plusLevel * 10;
	if (specMod !== '0') baseCost += mapSpecialModifierConfig[specMod].costIncrease;

	baseCost += mapLevel;
	baseCost = Math.floor((baseCost / 150) * Math.pow(1.14, baseCost - 1) * mapLevel * 2 * Math.pow(1.03 + mapLevel / 50000, mapLevel));
	baseCost *= biome !== 'Random' ? 2 : 1;

	return baseCost;
}

var portalWindowOpen = false;
var challengeSquaredMode = false;
var savedBuyAmt = -1;
function portalClicked(noUniChange) {
	if (!noUniChange){
		portalUniverse = game.global.universe;
	}
	updatePortalUniverseBtn();
	if (game.global.runningChallengeSquared && !game.global.challengeActive) game.global.runningChallengeSquared = false;
	challengeSquaredMode = false;
	portalWindowOpen = true;
	cancelTooltip();
	game.global.viewingUpgrades = false;
	game.global.respecActive = false;
	resetPresets();
	game.global.tempHighHelium = game.resources.helium.owned;
	game.global.tempHighRadon = game.resources.radon.owned;
	if (portalUniverse == 2){
		game.resources.helium.respecMax = game.resources.radon.owned + game.global.radonLeftover;
	}
	else{
		game.resources.helium.respecMax = game.resources.helium.owned + game.global.heliumLeftover;
	}

	game.resources.helium.totalSpentTemp = 0;
	document.getElementById("wrapper").style.display = "none";
	var bgColor = "";
	var sLevel = getSLevel(true);
	if (sLevel == 5 && game.global.portalColor != 0) sLevel = game.global.portalColor - 1;
	if (sLevel == 1) bgColor = "#00b386";
	else if (sLevel == 2) bgColor = "#3db0f8";
	else if (sLevel == 3) bgColor = "#2a6a93";
	else bgColor = "green";
	swapClass("portalMk", "portalMk" + (sLevel + 1), document.getElementById("portalWrapper"));
	fadeIn("portalWrapper", 10);
	var titleText = "Time Portal";
	if (getSLevel(true) >= 1) titleText += " Mk. " + romanNumeral(getSLevel(true) + 1);
	if (getSLevel(true) == 5) titleText = "<div class='pointer portalTitleBtn' onclick='tooltip(\"Change Portal Color\", null, \"update\")'>" + titleText + "</div>";
	var portalStory = (getSLevel(true) >= 1) ? heliumOrRadon(false, true) + " goes in, victory comes out" : ((portalUniverse == 1) ? "Well, you did it. You followed your instincts through this strange world, made your way through the Dimension of Anger, and obtained this portal. But why? Maybe there will be answers through this portal... Your scientists tell you they can overclock it to bring more memories and items back, but they'll need helium to cool it." : "The Radon Universe is harsh. Your Portal still retains some information about the Scientist upgrades, but it'll need an upgrade of its own to be able to utilize them in this new Universe.<br/><b>Be ready to manually Gather some Food!</b>");
	document.getElementById("portalTitle").innerHTML = titleText;
	document.getElementById("portalStory").innerHTML = portalStory;
	var resName = (portalUniverse == 1) ? "Helium" : "Radon";
	document.getElementById("portalHelium").innerHTML = '<span id="portalHeliumOwned">' + prettify(game.resources.helium.respecMax) + '</span> ' + resName;
	var totalEarned = (portalUniverse == 1) ? game.global.totalHeliumEarned : game.global.totalRadonEarned;
	document.getElementById("totalHeliumEarned").innerHTML = prettify(totalEarned);
	document.getElementById("totalHeliumSpent").innerHTML = prettify(countHeliumSpent(false, true));
	document.getElementById("totalPortals").innerHTML = getTotalPortals(true);
	document.getElementById("activatePortalBtn").style.display = "inline-block";
	document.getElementById("activatePortalBtn").innerHTML = "Activate Portal";
	document.getElementById("challengeSquaredBonusAmt").innerHTML = prettify(game.global.totalSquaredReward);
	document.getElementById('inPortalC2Name').innerHTML = (game.global.highestRadonLevelCleared >= 49) ? "<span class='icomoon icon-infinity'></span>" : "2";
	var className = (game.global.highestRadonLevelCleared >= 49) ? "thingColorInfinite" : "thingColorSquared";
	swapClass("thingColor", className, document.getElementById('inPortalC2Button'))
	document.getElementById("challengeDescription").style.height = (getSLevel(true) >= 1) ? "19vw" : "22.5vw";
	document.getElementById("challengeDescriptionPre").innerHTML = (getSLevel(true) >= 1) ? "Don't forget to bring a challenge<br/>" : 'You can also choose to activate a challenge before using your portal. Completing a challenge will earn you a permanent reward. You can abandon or view an active challenge at any time by clicking the "View Perks" button.';
	if (game.global.canRespecPerks) {
		document.getElementById("respecPortalBtn").innerHTML = "Respec";
		document.getElementById("respecPortalBtn").style.display = "inline-block";
	}
	document.getElementById('swapToCurrentChallengeBtn').style.display = (game.global.challengeActive) ? 'inline-block' : 'none';
	swapToCurrentChallenge(true);
	displayChallenges();
	savedBuyAmt = game.global.buyAmt;
	numTab(1, true);
	game.global.buyAmt = 1;
	displayPortalUpgrades();
	game.global.removingPerks = false;
	if (game.global.canRespecPerks && game.global.totalPortals > 0)
		respecPerks(true);
	u2Mutations.respecOnPortal = false;
	u2Mutations.toggleRespec(true);
}

function savePortalColor(setting){
	game.global.portalColor = setting;
	swapClass('portalMk', 'portalMk' + setting, document.getElementById('portalWrapper'));
	tooltip('Change Portal Color', null, 'update');
}

function getTotalPortals(usePortalUniverse){
	var universe = (usePortalUniverse) ? portalUniverse : game.global.universe;
	if (universe == 1) return game.global.totalPortals;
	if (universe == 2) return game.global.totalRadPortals;
}

function toggleChallengeSquared(){
	if (portalUniverse == 2 && game.global.highestRadonLevelCleared < 49) return;
	challengeSquaredMode = !challengeSquaredMode;
	displayChallenges();
}

function challengeActive(what){
	if (game.global.multiChallenge[what]) return true;
	else if (game.global.challengeActive == what) return true;
	else return false;
}

function displayChallenges() {
	var challengeCount = 0;
	game.global.selectedChallenge = "";
	const tagName = (usingScreenReader ? "li" : "div");
	var challengesHere = document.getElementById("challengesHere");
	document.getElementById("specificChallengeDescription").innerHTML = "<br/><br/><br/>Click a challenge below to learn more about and/or run it!";
	var challengeHTML = `<${tagName} class="noselect pointer challengeThing thing" id="challenge0" onclick="selectChallenge(0)"><span class="thingName">None</span></${tagName}>`;
	var firstFail = false;
	var extraClass = "";
	for (var what in game.challenges){
		var thisFail = false;
		var name = "";
		var challenge = game.challenges[what];
		if (portalUniverse == 1 && challenge.blockU1) continue;
		if (portalUniverse == 2 && !challenge.allowU2) continue;
		if (challengeSquaredMode && portalUniverse == 2 && game.global.highestRadonLevelCleared < 49) continue;
		if (!challengeSquaredMode && challenge.onlySquared) continue;
		if (challengeSquaredMode && !challenge.allowSquared) continue;
		if (!challenge.filter(true)) {
			if (firstFail || what == "Daily" || challengeSquaredMode) continue;
			if (what != "Scientist") firstFail = true;
			thisFail = true;
		}
		if (challengeSquaredMode && what == "Enlightened") {
			if (usingScreenReader) challengeHTML += `<ul aria-label="Doubled C2s">`
			else challengeHTML += "<div style='clear: both; height: 5px;'></div>";
		}
		challengeCount++;
		var done = false;
		if (game.portal[game.challenges[what].unlocks]) done = isPerkUnlocked(game.challenges[what].unlocks, true);
		else if (what == "Scientist" && game.global.sLevel > 0) {
			if (game.global.sLevel >= 4 && game.global.highestLevelCleared >= 129){
				name = "Scientist V";
				if (game.global.sLevel == 5) done = true;
			}
			else if (game.global.sLevel >= 3 && game.global.highestLevelCleared >= 109) {
				if (game.global.highestLevelCleared < 124 && game.global.sLevel == 4) {
					firstFail = false;
					thisFail = false;
				}
				name = (thisFail) ? "Scientist V" : "Scientist IV";
				if (game.global.sLevel == 4) done = true;
			}
			else if (game.global.sLevel >= 2 && game.global.highestLevelCleared >= 89){
				name = (thisFail) ? "Scientist IV" : "Scientist III";
				if (game.global.sLevel == 3) done = true;
			}
			else if (game.global.sLevel == 1 && game.global.highestLevelCleared < 44){
				done = true;
				name = "Scientist I";
				thisFail = false;
				firstFail = false;
			}
			else if (game.global.sLevel >= 1 && game.global.highestLevelCleared >= 49){
				name = (thisFail) ? "Scientist III" : "Scientist II";
				if (game.global.sLevel == 2) done = true;
			}
			else if (thisFail) name = "Scientist II";
			else done = true;
		}
		else if (what == "Decay") done = game.global.decayDone;
		else if (what == "Frugal") done = game.global.frugalDone;
		else if (what == "Slow") done = game.global.slowDone;
		else if (what == "Storm") done = game.global.stormDone;
		else if (what == "Mayhem") done = game.global.mayhemCompletions >= game.challenges.Mayhem.maxRuns;
		else if (what == "Pandemonium") done = game.global.pandCompletions >= game.challenges.Pandemonium.maxRuns;
		else if (what == "Desolation") done = game.global.desoCompletions >= game.challenges.Desolation.maxRuns;
		else if (what == "Frigid") done = game.global.frigidCompletions >= game.challenges.Frigid.maxRuns;
		else if (what == "Exterminate") done = game.global.exterminateDone;
		else if (what == "Glass") done = game.global.glassDone;
		done = (done) ? "finishedChallenge" : "";
		if (challenge.heliumThrough || what == "Experience") done = "challengeRepeatable";
		if (challengeSquaredMode) done = '" style="background-color: ' + getChallengeSquaredButtonColor(what);
		if (thisFail) done = "nextChallenge";
		if (!name) name = what;
		let srText = (done == "finishedChallenge" ? ", Complete" : 
				done == "challengeRepeatable" ? ", Repeatable" : 
				(challengeSquaredMode && getChallengeSquaredButtonColor(what) == "rgb(0,0,0)") ? ", Complete" :
				challengeSquaredMode ? `, Z${getC2HighestReached(what)}` :
				(["Frigid", "Desolation", "Pandemonium", "Mayhem"].includes(what) && done != "finishedChallenge") ?  ", Limited Repeatable" :
				""); // this sure got out of hand
		//make sure the challengeSquaredMode color still works after messing with line below
		challengeHTML += `<${tagName} class="noselect pointer challengeThing thing ` + done + '" id="challenge' + what + '" onclick="selectChallenge(\'' + what + '\')"><span class="thingName">' + name + (usingScreenReader ? srText : "") + `</span></${tagName}>`;
	}
	challengesHere.innerHTML = challengeHTML;
	if (challengeCount > 0) document.getElementById("challenges").style.display = "block";
	document.getElementById("flagMustRestart").style.display = "none";
	swapClass('challengeDescription', 'challengeDescriptionLg', document.getElementById('specificChallengeDescription'));
}

function getChallengeSquaredButtonColor(challengeName){
	var challenge = game.challenges[challengeName];
	var challengeList;
	var totalLevel = 0;
	if (challenge.multiChallenge) challengeList = challenge.multiChallenge;
	else challengeList = [challengeName];
	for (var x = 0; x < challengeList.length; x++){
		if (portalUniverse == 1 && game.c2[challengeList[x]] >= getObsidianStart()) return "rgb(0,0,0)";
		totalLevel += game.c2[challengeList[x]];
	}
	totalLevel /= challengeList.length;
	var percent = totalLevel / getHighestLevelCleared(true);
	var r = parseInt(255 - (percent * 102), 10);
	var g = parseInt(255 - (percent * 255), 10);
	//var b = parseInt(255 - (percent * 102)); commenting this out and reusing r is technically an optimization
	var b = (challengeList.length > 1) ? parseInt(255 - (percent * 255), 10) : r;
	var rgb = "rgb(" + r + "," + g + "," + b + ")";
	if (percent < .5) rgb += "; color: black; border-color: black";
	return rgb;
}

function getC2HighestReached(what) {
	var challengeList;
	if (game.challenges[what].multiChallenge) challengeList = game.challenges[what].multiChallenge;
	else challengeList = [what];
	var highestZone = 0
	for (var x = 0; x < challengeList.length; x++){
		var challengeName = challengeList[x];
		highestZone = Math.max(highestZone, game.c2[challengeName]);
	}
	return highestZone
}

function selectChallenge(what) {
	cancelTooltip();
	displayChallenges();
	document.getElementById("challenge" + what).className += " cBorderOn";
	document.getElementById('activatePortalBtn').style.display = 'inline-block';
	var addChallenge = document.getElementById("addChallenge");
	if (what === 0){
		game.global.selectedChallenge = "";
		document.getElementById("specificChallengeDescription").innerHTML = "<br/><br/><br/>Click a challenge below to learn more about and/or run it!";
		document.getElementById("flagMustRestart").style.display = "none";
		swapClass('challengeDescription', 'challengeDescriptionLg', document.getElementById('specificChallengeDescription'));
		if (addChallenge !== null) addChallenge.innerHTML = "";
		return;
	}
	if (!game.challenges[what].filter()){
		var unlockString = (typeof game.challenges[what].unlockString === 'function') ? game.challenges[what].unlockString() : game.challenges[what].unlockString;
		document.getElementById("specificChallengeDescription").innerHTML = "You will unlock this challenge once you " + unlockString;
		game.global.selectedChallenge = "";
		document.getElementById("flagMustRestart").style.display = "none";
		swapClass('challengeDescription', 'challengeDescriptionLg', document.getElementById('specificChallengeDescription'));
		if (addChallenge !== null) addChallenge.innerHTML = "";
		return;
	}
	var desc = (challengeSquaredMode) ? game.challenges[what].squaredDescription + " " + getSpecialSquaredRewards(game.challenges[what]) : game.challenges[what].description;
	desc += "<b>";
	if (challengeSquaredMode) {
		var obsidianStart = getObsidianStart();
		var challengeList;
		if (game.challenges[what].multiChallenge) challengeList = game.challenges[what].multiChallenge;
		else challengeList = [what];
		var totalReward = 0;
		for (var x = 0; x < challengeList.length; x++){
			var challengeName = challengeList[x];
			var reward = getIndividualSquaredReward(challengeName);
			totalReward += reward;
			var highestZone = game.c2[challengeName];
			var number = (portalUniverse == 1) ? "2" : "3";
			if (obsidianStart < highestZone) highestZone += " (Capped to " + obsidianStart + " by Obsidian)";
			if (x == 0) desc += " Your";
			else desc += " and your"
			desc += " highest Zone reached for " + challengeName + "<sup>" + number + "</sup> is Z" + highestZone + ", ";
		}

		desc += "earning you " + prettify(totalReward);
		if (game.global.highestRadonLevelCleared >= 49){
			var rewards = countChallengeSquaredReward(false, false, true);
			rewards = (portalUniverse == 1) ? rewards[1] : rewards[0]
			desc += "% Challenge<sup>" + number + "</sup> bonus, and adding " + prettify(totalReward * (1 + (rewards / 100))) + "% to your total Challenge<sup><span class='icomoon icon-infinity'></span></sup> bonus.";
		}
		else{
			desc += "% extra attack and health, and " + prettify(totalReward / 10) + "% more Helium from all sources.";
		}
		if (portalUniverse == 1 && game.global.highestLevelCleared >= (getObsidianStart(true) - 2)) desc += "<br/><b style='color: blue'>Zones above Z" + getObsidianStart(true) + " are worth 5x more Challenge<sup>2</sup> bonus!</b>";
	}
	else if (game.portal[game.challenges[what].unlocks]) desc += (isPerkUnlocked(game.challenges[what].unlocks, true)) ? " You will not earn a new perk." : " You will also earn a new Perk!";
	else if (what == "Scientist") {
		var sciLev = getScientistLevel();
		if (sciLev == game.global.sLevel) desc += " You have already completed this challenge!";
		desc = desc.replace("_", getScientistInfo(sciLev));
		desc = desc.replace("*", getScientistInfo(sciLev, true));
	}
	desc += "</b>";
	document.getElementById("specificChallengeDescription").innerHTML = desc;
	game.global.selectedChallenge = what;
	document.getElementById("flagMustRestart").style.display = (game.challenges[what].mustRestart) ? "inline" : "none";
	var descSize = (game.challenges[what].mustRestart) ? "challengeDescriptionSm" : "challengeDescriptionLg";
	swapClass('challengeDescription', descSize, document.getElementById('specificChallengeDescription'));

	if (addChallenge !== null){
		addChallenge.innerHTML = "You have the <b>" + what + " Challenge</b> active.";
		addChallenge.className = (challengeSquaredMode) ? "colorSquared" : "";
	}
	if (what == "Daily") updateDailyClock();
}

function getSLevel(usePortalUniverse){
	var universe = game.global.universe;
	if (usePortalUniverse) universe = portalUniverse;
	if (universe == 1) return game.global.sLevel;
	return game.buildings.Microchip.owned;
}

function getScientistLevel() {
	if (game.global.sLevel == 0) return 1;
	if (game.global.highestLevelCleared >= 49 && game.global.sLevel == 1) return 2;
	if (game.global.highestLevelCleared >= 89 && game.global.sLevel == 2) return 3;
	if (game.global.highestLevelCleared >= 109 && game.global.sLevel == 3) return 4;
	if (game.global.highestLevelCleared >= 129 && game.global.sLevel >= 4) return 5;
	return game.global.sLevel;
}

function getScientistInfo(number, reward){
	switch (number){
		case 1: {
			const foreman = game.global.universe === 1 || !bwRewardUnlocked('Foremany') ? `, and 1 Foreman` : ``;
			return reward ? `start with 5000 Science, 100 Food, 100 Wood, 10 Traps${foreman}` : 11500;
		}
		case 2: {
			return (reward) ? "start with 5 Barns, 5 Sheds, 5 Forges, and T2 Equipment unlocked" : 8000;
		}
		case 3: {
			return (reward) ? "start with full Trimps and 200% player efficiency" : 1500;
		}
		case 4: {
			return (reward) ? "earn two levels of each prestige upgrade per map" + ((game.global.universe == 1) ? ", unlock AutoPrestiges, and your Warpstations will build instantly, skipping the queue" : "") + ". This bonus will apply" : 70;
		}
		case 5: {
			return (reward) ? "permanently increase all " + heliumOrRadon() + " found by 0.5% per zone (compounding). You'll also start with 1000% player efficiency and 50 Barns, Sheds, and Forges" : 1500;
		}
	}
}

function confirmAbandonChallenge(){
	if (game.global.challengeActive == "Daily"){
		tooltip("Finish Daily", null, 'update');
		return;
	}
	var text = "Are you sure you want to abandon this challenge?";
	if (game.challenges[game.global.challengeActive].mustRestart) text += " <b>Abandoning this challenge will cause the portal to become unstable and start you from the beginning of this run. (You'll keep your permanent rewards like helium and perks)</b><br/><br/>Click Confirm to abandon the challenge and restart at Z1, Cancel to go back, or Restart to go back to Z1 with the same challenge.";
	tooltip('confirm', null, 'update', text, 'abandonChallenge()', 'Abandon Challenge');
	if (game.challenges[game.global.challengeActive].mustRestart) document.getElementById("confirmTipCost").insertAdjacentHTML('beforeend', '<div class="btn btn-success" onclick="abandonChallenge(true); cancelTooltip()">Restart Challenge</div>');
}

function abandonChallengeResetEnemy() {
	const worldCell = game.global.gridArray[game.global.lastClearedCell + 1];
	if (!worldCell) return;

	let statChallenge = false;
	let statMaps = false;

	if (challengeActive('Daily')) {
		if (typeof game.global.dailyChallenge.badHealth !== 'undefined') {
			statChallenge = true;
		}

		if (typeof game.global.dailyChallenge.empower !== 'undefined') {
			statChallenge = true;
		}

		if (typeof game.global.dailyChallenge.badMapHealth !== 'undefined' && game.global.currentMapId !== '') {
			statMaps = true;
		}

		if (typeof game.global.dailyChallenge.empoweredVoid !== 'undefined' && game.global.voidBuff === 'Void') {
			statMaps = true;
		}
	}

	if (game.global.universe === 1) {
		const challenges = ['Meditate', 'Scientist', 'Balance', 'Life', 'Toxicity', 'Coordinate', 'Corrupted', 'Domination', 'Obliterated', 'Eradicated', 'Frigid', 'Experience'];
		statChallenge = challenges.some((challenge) => challengeActive(challenge));

		if (challengeActive('Lead') && game.challenges.Lead.stacks > 0) {
			statChallenge = true;
		}

		statMaps = statChallenge;
	}

	if (game.global.universe === 2) {
		const challenges = ['Unbalance', 'Duel', 'Wither', 'Quest', 'Archaeology', 'Mayhem', 'Exterminate', 'Nurture', 'Pandemonium', 'Alchemy', 'Glass', 'Hypothermia', 'Desolation'];
		statChallenge = challenges.some((challenge) => challengeActive(challenge));

		if (challengeActive('Revenge') && game.global.world % 2 === 0) {
			statChallenge = true;
		}

		statMaps = statChallenge;

		if (challengeActive('Storm')) {
			statChallenge = true;
		} else if (challengeActive('Exterminate')) {
			statChallenge = true;
		} else if (challengeActive('Smithless') && game.global.world % 25 === 0 && worldCell.ubersmith && !worldCell.failedUber) {
			statChallenge = true;
		}
	}
	
	return [statChallenge, statMaps];
}

function abandonChallenge(restart) {
	let challengeName = game.global.challengeActive;
	let challenge = game.challenges[challengeName];
	const [resetWorld, resetMap] = abandonChallengeResetEnemy();
	if (game.global.universe === 2 && (game.global.runningChallengeSquared || challengeName === 'Daily')) game.global.u2MutationSeed = game.global.ogU2MutationSeed;

	if (game.global.runningChallengeSquared) {
		let challengeList;
		if (challenge.multiChallenge) challengeList = challenge.multiChallenge;
		else challengeList = [challengeName];

		game.global.challengeActive = '';
		game.global.multiChallenge = {};

		for (let x = 0; x < challengeList.length; x++) {
			if (game.global.world > game.c2[challengeList[x]]) game.c2[challengeList[x]] = game.global.world;
			if (typeof game.challenges[challengeList[x]].abandon !== 'undefined' && game.challenges[challengeList[x]].fireAbandon) game.challenges[challengeList[x]].abandon();
		}

		if (game.global.capTrimp && game.c2.Trimp > 230) game.c2.Trimp = 230;
		countChallengeSquaredReward();

		if (!restart) {
			fadeIn('helium', 10);
			game.global.runningChallengeSquared = false;
			if (game.global.universe === 2 && (game.global.world > 30 || (game.global.world === 30 && game.global.lastClearedCell >= 29))) unlockJob('Meteorologist');
		}
	} else if (challenge.fireAbandon && typeof challenge.abandon !== 'undefined') {
		game.global.challengeActive = '';
		challenge.abandon();
	}

	game.global.challengeActive = '';
	cancelPortal();

	if (challengeName === 'Scientist') {
		document.getElementById('scienceCollectBtn').style.display = 'block';
	}

	if (game.challenges[challengeName].mustRestart) {
		if (restart) game.global.selectedChallenge = challengeName;
		resetGame(true);
	}

	if (resetWorld || resetMap) {
		if (resetWorld) {
			const worldCell = game.global.gridArray[game.global.lastClearedCell + 1];
			if (worldCell) worldCell.maxHealth = -1;
		}

		if (resetMap && game.global.currentMapId !== '') {
			const mapCell = game.global.mapGridArray[game.global.lastClearedMapCell + 1];
			mapCell.maxHealth = -1;
		}

		if (game.global.fighting) game.global.fighting = false;
	}

	if (challengeName !== 'Daily') message('Your challenge has been abandoned.', 'Notices');
	refreshMaps();
}

function checkChallengeSquaredAllowed(){
	document.getElementById('challengeTitleSquared').style.display = (game.global.highestLevelCleared >= 64) ? "block" : "none";
	document.getElementById('challengeTitleNoSquared').style.display = (game.global.highestLevelCleared >= 64) ? "none" : "block";
}

function formatDailySeedDate(){
	if (!game.global.dailyChallenge.seed) return "";
	var seed = String(game.global.dailyChallenge.seed);
	return seed.substr(0, 4) + '-' + seed.substr(4, 2) + '-' + seed.substr(6);
}

function getSpecialSquaredRewards(challenge){
	var description = "";
	if (challenge.replaceSquareReward || challenge.replaceSquareThresh || challenge.replaceSquareFreq || challenge.replaceSquareGrowth){
		var threshes = (challenge.replaceSquareThresh) ? challenge.replaceSquareThresh : squaredConfig.thresh;
		var reward = (challenge.replaceSquareReward) ? challenge.replaceSquareReward : squaredConfig.rewardEach;
		var freq = (challenge.replaceSquareFreq) ? challenge.replaceSquareFreq : squaredConfig.rewardFreq;
		var rewardIncrease = (challenge.replaceSquareGrowth) ? challenge.replaceSquareGrowth : squaredConfig.rewardGrowth;
		description += "<span class='colorSquared'>This challenge issues rewards differently than most other Challenge<sup>" + ((portalUniverse == 1) ? "2" : "3") + "</sup>s.";
		description += ((challenge.replaceSquareReward) ? "<b>" : "")  + " You will gain " + reward + "% " + ((portalUniverse == 1) ? "attack and health, and " + prettify(reward / 10) + "% Helium" : "to your bonus") + ((challenge.replaceSquareReward) ? "</b>" : "");
		description += ((challenge.replaceSquareFreq) ? "<b>" : "") + " for every " + freq + " Zone" + needAnS(freq) + " reached." + ((challenge.replaceSquareFreq) ? "</b>" : "");
		description += ((challenge.replaceSquareThresh) ? "<b>" : "") + " Every " + threshes + " Zone" + needAnS(threshes) + " reached," + ((challenge.replaceSquareThresh) ? "</b>" : "");
		description += ((challenge.replaceSquareGrowth) ? "<b>" : "") + " this bonus will increase by " + rewardIncrease + "%" + ((portalUniverse == 1) ? " attack and health, and " + prettify(rewardIncrease / 10) + "% Helium" : "") + ".</span> " + ((challenge.replaceSquareGrowth) ? "</b>" : "");
	}
	return description;
}

function needAnS(number){
	//this will save so many lines if I don't forget about it
	return (number == 1) ? "" : "s";
}

function getSquaredDescriptionInRun(hideDesc){
	if (!game.global.runningChallengeSquared) return "";
	var challenge = game.challenges[game.global.challengeActive];
	var description = "";
	if (!hideDesc){
		description = "\"" + challenge.squaredDescription + "\" " + getSpecialSquaredRewards(challenge);
	}
	description += "<b>You are currently at Zone " + game.global.world;
	var portalText = (game.global.viewingUpgrades) ? "abandon the challenge " : "use the portal ";
	var challengeList = [];
	if (challenge.multiChallenge) challengeList = challenge.multiChallenge;
	else challengeList = [game.global.challengeActive];
	var totalDif = 0;
	for (var x = 0; x < challengeList.length; x++){
		var lastMulti = (x == (challengeList.length - 1));
		var challengeName = challengeList[x];
		challenge = game.challenges[challengeName];
		var dif = getIndividualSquaredReward(challengeName, game.global.world) - getIndividualSquaredReward(challengeName);
		totalDif += dif;
		var highest = game.c2[challengeName];
		var rewards = countChallengeSquaredReward(false, false, true);
		var reward = (game.global.universe == 1) ? rewards[0] : rewards[1];
		var number = (game.global.universe == 1) ? "2" : "3";
		if (highest > 0){
			if (dif >= 1){
				description += "<span class='greenText'>, your previous highest for " + challengeName + "<sup>" + number + "</sup> was Zone " + highest + "</span>";
			}
			else {
				description += "<span class='redText'>, your best for " + challengeName + "<sup>" + number + "</sup> is Zone " + highest + "</span>";
			}
		}
		if (lastMulti){
			if (highest > 0 || totalDif >= 1){
				if (totalDif >= 1){
					description += "<span class='greenText'>. If you " + portalText + "now, you'll add " + prettify(totalDif) + "% to your total Challenge<sup>" + number + "</sup> bonus, bringing it to " + prettify(totalDif + reward) + "%.";
					if (game.global.highestRadonLevelCleared >= 49){
						var c2 = (game.global.universe == 1) ? (rewards[0] + totalDif) : rewards[0];
						var c3 = (game.global.universe == 1) ? rewards[1] : (rewards[1] + totalDif);
						description += " Your new Challenge<sup><span class='icomoon icon-infinity'></span></sup> bonus will be " + prettify((1 + (c3 / 100)) * c2) + "%.";
					}
					description += "</span>"
				}
				else{
					description += "<span class='redText'>. If you " + portalText + "now, your total Challenge<sup>" + number + "</sup> bonus will stay at " + prettify(reward) + "%.</span>";
				}
			}
			else {
				description += ". <span class='redText'>You'll need to reach at least Zone " + ((challenge.replaceSquareFreq) ? challenge.replaceSquareFreq : squaredConfig.rewardFreq) + " before you'll add anything to your current Challenge<sup>" + number + "</sup> bonus of " + prettify(reward) + "%.</span>";
			}
		}
	}
	description += "</b>";
	return description;
}

function viewPortalUpgrades() {
	if (game.global.totalPortals == 0) return;
	portalUniverse = game.global.universe;
	var c2Btn = document.getElementById('challengeSquaredViewBtn');
	if (c2Btn){
		if (game.global.highestLevelCleared >= 49 && game.global.runningChallengeSquared){
			c2Btn.style.display = 'inline-block';
			document.getElementById('challengeSquaredBonusAmtView').innerHTML = prettify(game.global.totalSquaredReward);
			document.getElementById('challengeSquaredName').innerHTML = (game.global.highestRadonLevelCleared >= 49) ? "<span class='icomoon icon-infinity'></span>" : "2";
			var className = (game.global.highestRadonLevelCleared >= 49) ? "thingColorInfinite" : "thingColorSquared";
			swapClass("thingColor", className, c2Btn)
		}
		else
			c2Btn.style.display = 'none';
	}

	cancelTooltip();
	game.global.viewingUpgrades = true;
	updatePortalUniverseBtn();
	game.resources.helium.respecMax = (game.global.universe == 2) ? game.global.radonLeftover : game.global.heliumLeftover;
	document.getElementById("viewChallenge").style.display = "block";
	resetPresets();
	var challengeText = "";
	if (game.global.challengeActive){
		challengeText = getCurrentChallengePane();
	}
	else
		challengeText = "You don't have an active challenge.";
	if (game.global.universe == 2 && !game.global.portalActive){
		document.getElementById('extraChallengeStuff').innerHTML = "<br/>If you can't handle this Universe, you can always return to Universe 1. However, returning before finding the Portal Device will invalidate all Scruffy Exp and Radon earned.<br/><span onclick='screwThisUniverse()' class='inPortalBtn btn btn-danger'>Return to Universe 1</span>"
	}
	document.getElementById("viewChallengeText").innerHTML = challengeText;
	document.getElementById("wrapper").style.display = "none";
	swapClass("portalMk", "portalMkPreview", document.getElementById("portalWrapper"));
	fadeIn("portalWrapper", 10);
	document.getElementById("portalTitle").innerHTML = "View Perks";
	var totalAvailable = (portalUniverse == 1) ? game.global.heliumLeftover : game.global.radonLeftover;
	var resName = (portalUniverse == 1) ? "Helium" : "Radon";
	document.getElementById("portalHelium").innerHTML = '<span id="portalHeliumOwned">' + prettify(parseFloat(totalAvailable, 10)) + '</span> ' + resName + ' Left Over';
	document.getElementById("portalStory").innerHTML = "These are all of your perks! You can reset them once per run.";
	document.getElementById("totalHeliumSpent").innerHTML = prettify(countHeliumSpent(false, true));
	var totalEarned = (portalUniverse == 1) ? game.global.totalHeliumEarned : game.global.totalRadonEarned;
	document.getElementById("totalHeliumEarned").innerHTML = prettify(totalEarned);
	document.getElementById("totalPortals").innerHTML = getTotalPortals(true);
	document.getElementById("cancelPortalBtn").innerHTML = "Cancel";
	document.getElementById("activatePortalBtn").style.display = "none";
	if (game.global.canRespecPerks) {
		document.getElementById("respecPortalBtn").innerHTML = "Respec";
		document.getElementById("respecPortalBtn").style.display = "inline-block";
	}
	document.getElementById("swapToCurrentChallengeBtn").style.display = "none";
	savedBuyAmt = game.global.buyAmt;
	numTab(1, true);
	game.global.buyAmt = 1;
	displayPortalUpgrades();
	updatePortalChallengeAbandonButton();
	u2Mutations.toggleRespec(false, true);
}

function screwThisUniverse(confirmed) {
	if (!confirmed) {
		tooltip('confirm', null, 'update', 'Are you sure you want to return to Universe 1? You will lose any Radon and Scruffy Exp earned so far.', 'screwThisUniverse(true)', 'Abandon Scruffy', "I'm sure he'll be fine");
		return;
	}

	game.global.totalRadonEarned -= game.resources.radon.owned;
	game.resources.radon.owned = 0;
	game.global.fluffyExp2 -= Fluffy.getBestExpStat().value;
	Fluffy.getBestExpStat().value = 0;
	portalClicked();
	swapPortalUniverse();
	portalUniverse = 1;
	resetGame(true);
	checkEquipPortalHeirlooms();
	document.getElementById('finishDailyBtnContainer').style.display = 'none';
}

function getObsidianStart(baseOnly){
	var start = 701;
	if (baseOnly) return start;
	var radLevels = game.global.highestRadonLevelCleared;
	var bonus = 0;
	bonus += (radLevels > 100) ? 100 + (Math.floor((radLevels - 100) / 50) * 10) : Math.floor(radLevels / 10) * 10;
	start += bonus;
	if (start > 810) start = 810;
	return start;
}

var lookingAtCurrentChallenge = false;
function swapToCurrentChallenge(updateOnly){
	if (!updateOnly) lookingAtCurrentChallenge = !lookingAtCurrentChallenge;
	var btnElem = document.getElementById('swapToCurrentChallengeBtn');
	var viewChallengeElem = document.getElementById('viewChallenge');
	var challengesElem = document.getElementById('challenges');
	if (lookingAtCurrentChallenge){
		viewChallengeElem.style.display = 'block';
		challengesElem.style.display = 'none';
		document.getElementById('viewChallengeText').innerHTML = getCurrentChallengePane();
		updatePortalChallengeAbandonButton();
		btnElem.innerHTML = "Select New Challenge";
		var c2Reward = document.getElementById('challengeSquaredBonusAmtView');
		if (c2Reward !== null)
			c2Reward.innerHTML = prettify(game.global.totalSquaredReward);
	}
	else {
		viewChallengeElem.style.display = 'none';
		challengesElem.style.display = 'block';
		btnElem.innerHTML = "View Current Challenge";
	}
}

function getCurrentChallengePane(){
	var challengeText = "";
	var description;
	if (game.global.challengeActive == "Daily")
		description = getCurrentDailyDescription();
	else if (game.global.runningChallengeSquared)
		description = getSquaredDescriptionInRun();
	else
		description = game.challenges[game.global.challengeActive].description;
	if (game.global.challengeActive == "Scientist"){
		var sciLevel = getScientistLevel();
		description = description.replace('_', getScientistInfo(sciLevel));
		description = description.replace('*', getScientistInfo(sciLevel, true));
	}
	challengeText = "You have the ";
	challengeText += (game.global.challengeActive == "Daily") ? formatDailySeedDate() + " " + game.global.challengeActive + " challenge active. " + description : game.global.challengeActive + " challenge active. " + description;
	return challengeText;
}

function updatePortalChallengeAbandonButton(){
	var abandonElem = document.getElementById("cancelChallengeBtn");
	if (game.global.challengeActive){
		abandonElem.style.display = "inline-block";
		if (game.global.challengeActive == "Daily") {
			swapClass('btn-', 'btn-success', abandonElem);
			abandonElem.innerHTML = "Finish Daily";
		}
		else{
			abandonElem.innerHTML = "Abandon Challenge";
			swapClass('btn-', 'btn-warning', abandonElem);
		}
	}
	else abandonElem.style.display = 'none';
}

function getHighestLevelCleared(usePortalUniverse, obsidianLimit){
	var universe = (usePortalUniverse) ? portalUniverse : game.global.universe;
	var level = 0;
	if (universe == 2) level = game.global.highestRadonLevelCleared;
	else level = game.global.highestLevelCleared;
	if (obsidianLimit){
		var obs = getObsidianStart();
		if (level > obs) return obs;
	}
	return level;
}

function getVoidMaxLevel(){
	var universe = game.global.universe;
	if (universe == 2) return game.global.voidMaxLevel2;
	else return game.global.voidMaxLevel;
}

function setVoidMaxLevel(amt){
	var universe = game.global.universe;
	if (universe == 2) game.global.voidMaxLevel2 = amt;
	else game.global.voidMaxLevel = amt;
}

function unlockPerk(what){
	var perk = game.portal[what];
	if (game.global.universe == 2){
		if (typeof perk.radLocked !== 'undefined') perk.radLocked = false;
	}
	else{
		if (typeof perk.locked !== 'undefined') perk.locked = false;
	}
}

function isPerkUnlocked(what, usePortalUniverse){
	var perk = game.portal[what];
	var universe = (usePortalUniverse) ? portalUniverse: game.global.universe;
	if (universe == 2){
		if (typeof perk.radLocked !== 'undefined' && !perk.radLocked) return true;
		return false;
	}
	else{
		if (typeof perk.locked !== 'undefined' && !perk.locked) return true;
		return false;
	}
}

function getPerkLevel(what, usePortalUniverse){
	var portUpgrade = game.portal[what];
	var universe = (usePortalUniverse) ? portalUniverse : game.global.universe;
	if (universe == 1) {
		if (typeof portUpgrade.level !== 'undefined') return portUpgrade.level;
		return 0;
	}
	if (universe == 2){
		if (typeof portUpgrade.radLevel !== 'undefined') return portUpgrade.radLevel;
		return 0;
	}
	return 0;
}

function getSpentPerkResource(what, usePortalUniverse){
	var portUpgrade = game.portal[what];
	var universe = (usePortalUniverse) ? portalUniverse : game.global.universe;
	if (universe == 1) {
		if (typeof portUpgrade.level !== 'undefined') return portUpgrade.heliumSpent;
		return 0;
	}
	if (universe == 2){
		if (typeof portUpgrade.radLevel !== 'undefined') return portUpgrade.radSpent;
		return 0;
	}
	return 0;
}

function getTotalPerkResource(usePortalUniverse){
	var universe = (usePortalUniverse) ? portalUniverse : game.global.universe;
	if (universe == 2) return game.global.totalRadonEarned;
	else return game.global.totalHeliumEarned;
}

function getLastPortal(){
	if (game.global.universe == 2) return game.global.lastRadonPortal;
	return game.global.lastPortal;
}

function displayPortalUpgrades(fromTab) {
	document.getElementById('ptabInfoText').innerHTML = (game.options.menu.detailedPerks.enabled) ? "Less Info" : "More Info";
	toggleRemovePerks(true);
	var elem = document.getElementById("portalUpgradesHere");
	elem.innerHTML = "";
	if (!fromTab) game.resources.helium.totalSpentTemp = 0;
	for (let what in game.portal){
		var itemName = what.replace('_', ' ');
		var portUpgrade = game.portal[what];
		if (!fromTab){
			portUpgrade.levelTemp = 0;
			portUpgrade.heliumSpentTemp = 0;
		}
		if (portalUniverse == 2 && (typeof portUpgrade.radLevel === 'undefined' || portUpgrade.radLocked)) continue;
		if (portalUniverse == 1 && (typeof portUpgrade.level === 'undefined' || portUpgrade.locked)) continue;
		var spentRes = getSpentPerkResource(what, true) + portUpgrade.heliumSpentTemp;
		var level = getPerkLevel(what, true);
		var combinedLevel = level + portUpgrade.levelTemp;
		if (what == "Greed" || what == "Tenacity") level += game.portal.Masterfulness.radLevel + game.portal.Masterfulness.levelTemp;
		var html = "";
		if (usingScreenReader){
			html += '<button class="';
		}
		else {
			html += '<button onmouseover="tooltip(\'' + what + '\',\'portal\',event)" onmouseout="tooltip(\'hide\')" class="';
		}
		var htmlClass = "noselect pointer portalThing thing perkColorOff";
		if (usingScreenReader) htmlClass += " screenReaderPerk";
		if (game.options.menu.detailedPerks.enabled == 1) htmlClass += " detailed";
		if (game.options.menu.smallPerks.enabled) htmlClass += (game.options.menu.smallPerks.enabled == 1) ? " smallPerk" : " tinyPerk";
		if (portUpgrade.additive) htmlClass += " additive";
		htmlClass += " changingOff";
		html += htmlClass + '" id="' + what + '" onclick="buyPortalUpgrade(\'' + what + '\')"><span class="thingName">' + what.replace('_', ' ');
		if (usingScreenReader) html += "<span id='screenReaderPerkAfford" + what + "'></span>";
		html += '</span>';

		if (game.options.menu.detailedPerks.enabled == 1 || usingScreenReader){
		html += '<br/>Level:&nbsp;<span class="thingOwned"><b><span id="' + what + 'Owned">' + ((game.options.menu.formatPerkLevels.enabled) ? prettify(level) : level) + '</span></b>';
		if (!portUpgrade.max || portUpgrade.max > combinedLevel) html += "<br/>Price: <span id='" + what + "Price'>" + prettify(getPortalUpgradePrice(what)) + "</span>";
		else html += "<br/>Price: <span id='" + what + "Price'>Max</span>";
		html += '<br/>Spent: <span id="' + what + 'Spent">' + prettify(spentRes) + '</span>';
		}
		else html += '<br/><span class="thingOwned">Lv:&nbsp;<span id="' + what + 'Owned">' + ((game.options.menu.formatPerkLevels.enabled) ? prettify(level) : level) + '</span>';
		html += '</span></button>';
		if (what == "Equality"){
			var state = game.portal.Equality.getSetting('scalingActive') ? "On" : "Off";
			html += '<button onmouseover="tooltip(\'Equality Scaling\', null, event)" onmouseout="tooltip(\'hide\')" class="' + htmlClass + ' equalityColor' + state + '" id="equalityScaling" onclick="toggleEqualityScale()"><span class="thingName">Scale Equality</span><br/><span class="thingOwned"><span id="equalityScalingState">' + state + '</span>';
			if (game.options.menu.detailedPerks.enabled) html += "<br/>&nbsp;<br/>&nbsp;";
			html += "</span></button>";
		}
		elem.insertAdjacentHTML("beforeend", html)
		updatePerkColor(what);
		updatePerkLevel(what);
		if (usingScreenReader) { 
			if (what == 'Equality')  makeAccessibleTooltip("equalityScaling", 'Equality Scaling', "portal") 
			makeAccessibleTooltip(what, [what, "portal"])
		}
	}
}

function toggleEqualityScale(fromTip){
	if (ctrlPressed){
		tooltip('Scale Equality Scaling', null, 'update');
		return;
	}
	var settingLoc = (fromTip) ? equalitySlidersTip : false;
	game.portal.Equality.setSetting('scalingActive', settingLoc, !game.portal.Equality.getSetting('scalingActive', settingLoc))
	manageEqualityStacks();
	updateEqualityScaling(fromTip);
}

function manageEqualityStacks() {
	if (game.global.universe !== 2 || game.portal.Equality.radLocked) return;
	const equality = getPerkLevel('Equality');

	if (game.portal.Equality.scalingCount < 0) game.portal.Equality.scalingCount = 0;
	if (game.portal.Equality.scalingCount > equality) game.portal.Equality.scalingCount = equality;
	const tabElem = document.getElementById('equalityTab');
	const tabTextElem = document.getElementById('equalityA');
	const activeStacks = game.portal.Equality.getActiveLevels();
	let text = activeStacks + ' stack' + needAnS(activeStacks) + ' of Equality are active, multiplying the Attack of Trimps ';
	let elemText = 'Equality (Scaling ';
	const enemyMult = game.portal.Equality.getMult(false);
	if (game.heirlooms.Shield.inequality.currentBonus > 0) {
		const trimpMult = game.portal.Equality.getMult(true);
		text += ' by ' + prettifyTiny(trimpMult) + ' and Enemies by ' + prettifyTiny(enemyMult);
	} else {
		text += ' and Enemies by ' + prettifyTiny(enemyMult);
	}

	if (game.portal.Equality.getSetting('scalingActive')) {
		swapClass('equalityTabScaling', 'equalityTabScalingOn', tabElem);
		elemText += 'On)';
		text += '. Scaling is on.';
		manageStacks('Equality Scaling', activeStacks, true, 'equalityStacks', 'icomoon icon-arrow-bold-down', text, false);
	} else {
		swapClass('equalityTabScaling', 'equalityTabScalingOff', tabElem);
		elemText += 'Off)';
		text += '. Scaling is off.';
		manageStacks('Equality Scaling', activeStacks, true, 'equalityStacks', 'icomoon icon-arrow-bold-down', text, false);
	}

	if (tabTextElem.innerHTML !== elemText) {
		tabTextElem.innerHTML = elemText;
	}
}

function scaleEqualityScale(slider, whatDo){
	if (whatDo == "reverse"){
		game.portal.Equality.setSetting('scalingReverse', equalitySlidersTip, !game.portal.Equality.getSetting('scalingReverse', equalitySlidersTip))
		return;
	}
	var val = slider.value;
	var textElem;
	if (slider.id == "scaleEqualitySlider"){
		if (!(val >= 0) || !(val <= 10)) val = 5;
		game.portal.Equality.setSetting('scalingSetting', equalitySlidersTip, val);
		textElem = document.getElementById('equalityCurrentScale');
	}
	else if (slider.id == "scaleEqualitySliderReverse"){
		if (!(val >= 0) || !(val <= 10)) val = 5;
		game.portal.Equality.setSetting('reversingSetting', equalitySlidersTip, val);
		textElem = document.getElementById('equalityCurrentScaleReverse')
	}
	else if (slider.id == "equalityDisabledSlider"){
		if (!(val >= 0) || !(val <= game.portal.Equality.radLevel)) val = -1;
		game.portal.Equality.setSetting('disabledStackCount', equalitySlidersTip, val);
		if (val == -1) val = "Max (" + game.portal.Equality.radLevel + ")";
		textElem = document.getElementById('equalityDisabledStackCount');
		manageEqualityStacks();
	}
	if (textElem) textElem.innerHTML = val;
}

function updateEqualityScaling(fromTip){
	var settingLoc = (fromTip) ? equalitySlidersTip : false;
	var suffix = (game.global.viewingUpgrades || portalWindowOpen) ? "" : "2";
	if (usingRealTimeOffline) suffix = "3";
	var elem = document.getElementById("equalityScaling" + suffix);
	if (!elem) return;
	var stateElem = document.getElementById("equalityScalingState" + suffix);
	if (game.portal.Equality.getSetting('scalingActive', settingLoc)){
		stateElem.innerHTML = "On";
		swapClass("equalityColor", "equalityColorOn", elem);
	}
	else {
		stateElem.innerHTML = "Off";
		swapClass("equalityColor", "equalityColorOff", elem);
	}
}

function updatePerkColor(what){
	var elem = document.getElementById(what);
	if (!elem) return;
	var perk = game.portal[what];
	var perkClass;
	var level = getPerkLevel(what, true);
	if (game.global.removingPerks){
		var removableLevel = (game.global.respecActive) ? (level + perk.levelTemp) : perk.levelTemp;
		perkClass = (removableLevel > 0) ? "perkColorOn" : "perkColorOff";
		if (usingScreenReader){
			var affordElem = document.getElementById('screenReaderPerkAfford' + what);
			if (affordElem){
				affordElem.innerHTML = (removableLevel > 0) ? ", Can Buy" : ", Not Affordable";
			}
		}
	}
	else
	{
		var buyAmt = (game.global.buyAmt == "Max") ? 1 : game.global.buyAmt;
		var price = getPortalUpgradePrice(what, false, buyAmt);
		var canSpend = game.resources.helium.respecMax - game.resources.helium.totalSpentTemp;
		if (perk.max && (perk.max < level + perk.levelTemp + buyAmt)) perkClass = "perkColorMaxed";
		else
		perkClass = ((canSpend >= price)) ? "perkColorOn" : "perkColorOff";
		if (usingScreenReader){
			var affordElem = document.getElementById('screenReaderPerkAfford' + what);
			if (affordElem){
				if (perkClass == "perkColorMaxed")  {
					affordElem.innerHTML = ", Max"; 
				}
				else {
					let amt = ''
					if (game.global.buyAmt == "Max") amt = prettify(getPerkBuyCount(what));
					else if (game.global.buyAmt > 1) amt = prettify(game.global.buyAmt);
					affordElem.innerHTML = (perkClass === "perkColorOn") ? `, Can Buy ${amt}` : ", Not Affordable";
				}
			}
		}
	}
	swapClass("perkColor", perkClass, elem);
}

function updateAllPerkColors(){
	for (var item in game.portal){
			if (game.portal[item].locked) continue;
			updatePerkColor(item);
	}
}

function activateKongBonus(oldWorld){
	var helium = 0;
	var addText = "";
	if (oldWorld > 0){
		helium = Math.floor(oldWorld / 2);
		addText = "You earned " + helium + " bonus points for reaching World " + oldWorld + ".";
	}
	else {
		helium = game.resources.helium.owned;
		addText = "You still have " + helium + " bonus points to spend!";
	}
	document.getElementById("wrapper").style.display = "none";
	var portalWrapper = document.getElementById("portalWrapper");
	portalWrapper.style.backgroundColor = "black";
	portalWrapper.style.color = "white";
	document.getElementById("portalTitle").innerHTML = "Beta Bonus";
	document.getElementById("portalStory").innerHTML = "Thank you so much for helping test the beta version of Trimps. All of the support and feedback was amazing! This version still needs some feedback and tweaks before it will be perfect, but saves will not be purposely reset again. Enjoy! " + addText;
	document.getElementById("portalHelium").innerHTML = '<span id="portalHeliumOwned">' + helium + '</span> Bonus Points';
	document.getElementById("cancelPortalBtn").innerHTML = "No Thanks";
	document.getElementById("activatePortalBtn").innerHTML = "Finished";
		document.getElementById("activatePortalBtn").style.display = "inline-block";

	fadeIn("portalWrapper", 10);
	game.resources.helium.owned = helium;
	game.resources.helium.respecMax = helium;
	displayPortalUpgrades();
	numTab(1, true);
}

var usingRealTimeOffline = false;
var offlineProgress = {
	wrapperElem: document.getElementById('offlineWrapper'),
	innerWrapperElem: document.getElementById('innerWrapper'),
	progressElem: document.getElementById('offlineProgress'),
	progressTextElem: document.getElementById('offlineProgressText'),
	cellElem: document.getElementById('offlineCellNumber'),
	zoneElem: document.getElementById('offlineZoneNumber'),
	extraInfoElem: document.getElementById('offlineExtraInfo'),
	mapBtnsElem: document.getElementById('offlineMapBtns'),
	mapTextElem: document.getElementById('offlineMapText'),
	zoneBtnsElem: document.getElementById('offlineZoneBtns'),
	inMapDescriptionElem: document.getElementById('offlineInMapDescription'),
	timeOfflineElem: document.getElementById('offlineTimeOffline'),
	mapBtnsInnerElem: document.getElementById('offlineMapBtnsInner'),
	effectiveElem: document.getElementById('offlineEffective'),
	formationsElem: document.getElementById('offlineFormations'),
	equalityBtn: document.getElementById('offlineEqualityBtn'),
	fightBtn: document.getElementById('offlineFightBtn'),
	mapBtns: [document.getElementById('offlineMapBtn0'), document.getElementById('offlineMapBtn1'), document.getElementById('offlineMapBtn2'), document.getElementById('offlineMapBtn3')],
	progressMax: -1,
	startTime: -1,
	currentFluff: "",
	nextFluffIn: -1,
	repeatSetting: false,
	repeatUntil: 2,
	exitTo: 1,
	maxTicks: 864000,
	lastEnemyKilled: 0,
	ticksProcessed: 0,
	mapsAllowed: 0,
	countThisMap: false,
	loop: null,
	lastLoop: -1,
	loopTicks: 0,
	showingEquality: false,
	totalOfflineTime: 0,
	getLimitBar: function(){
		var val = game.global.timeWarpLimit;
		if (val == -1) val = 21;
		else val = Math.round(val / 50);
		var text = "<input aria-label='Speed Limiter' oninput='offlineProgress.setLimit(this)' onchange='offlineProgress.setLimit(this)' type='range' id='limitTimewarpSlider' min='1' max='21' value='" + val + "' />";
		text += "<span class='twLimitSpeed' aria-live='polite'>" + this.getLimitText() + "</span>";
		return text;
	},
	getTimeOfflineText: function(){
		return 'Welcome back! You were offline for ' + this.formatTime(Math.floor(this.totalOfflineTime / 1000)) + '.' + this.getLimitBar();
	},
	getLimitText: function(){
		if (game.global.timeWarpLimit == -1) return "Unlimited Speed!";
		return "Limited to " + game.global.timeWarpLimit + "x speed"
	},
	setLimit: function(elem){
		if (elem.value == 21) game.global.timeWarpLimit = -1;
		else game.global.timeWarpLimit = Math.round(elem.value * 50);
		var elems = document.getElementsByClassName('twLimitSpeed');
		var text = this.getLimitText();
		for (var x = 0; x < elems.length; x++){
			elems[x].innerHTML = text;
		}
	},
	fluff: function(){
		var fluffs = ["Your Trimps really missed you", "Your Trimps didn't do dishes while you were gone", "A Scientist has been locked outside all night", "There's a Snimp in the pantry", "Your Trimps threw a party while you were out", "Your Trimps raided your fridge while you were gone", "Some Trimps toilet papered your ship", "Your Trimps were a few minutes away from burning the place down", "The Turkimps escaped again", "Your Trimps ran the AC all night", "Wow, such speed", "Your Trimps dinged your ship while out on a joyride", "One of your Trimps got a tattoo while you were gone"];
		if (game.global.fluffyExp > 0) {
			var name = Fluffy.getName();
			fluffs.push(name + " reminds you that he's not a babysitter");
			fluffs.push(name + " wrote a novel while you were gone");
			fluffs.push(name + " really missed you");
			fluffs.push(name + " greets you excitedly");
			fluffs.push(name + " forgives you for leaving");
		}
		this.currentFluff = fluffs[Math.floor(Math.random() * fluffs.length)];
		return this.currentFluff;
	},
	showEquality: function(){
		if (this.showingEquality || game.global.universe === 1 || game.portal.Equality.radLocked) {
			const newTimeOfflineHTML = this.getTimeOfflineText();
			if (this.timeOfflineElem.innerHTML !== newTimeOfflineHTML) {
				this.timeOfflineElem.innerHTML = newTimeOfflineHTML;
			}
			if (this.equalityBtn.innerHTML !== 'Show Equality') {
				this.equalityBtn.innerHTML = 'Show Equality';
			}
			this.showingEquality = false;
			return;
		}
		let text = `<div style="font-size: 0.85vw; margin-top: -1.5vw;"><div style="width: 50%; font-size: 0.75vw;" role="button" class="noselect pointer portalThing thing perkColorOff changingOff equalityColorOn" id="equalityScaling3" onclick="toggleEqualityScale()"><span class="thingName">Scale Equality</span><br><span class="thingOwned"><span id="equalityScalingState3">On</span></span></div><br/>`;
		text += getEqualitySliders(true);
		text += '</div>';
		if (this.timeOfflineElem.innerHTML !== text) {
			this.timeOfflineElem.innerHTML = text;
		}
		updateEqualityScaling();
	
		if (this.equalityBtn.innerHTML !== 'Hide Equality') {
			this.equalityBtn.innerHTML = 'Hide Equality';
		}
		this.showingEquality = true;
	},
	updateFormations: function(force){
		if (!game.upgrades.Formations.done && !force) {
			if (this.formationsElem.style.display !== 'none') {
				this.formationsElem.style.display = 'none';
			}
			return;
		}
		let text = `<div role='button' tabindex='0' aria-label='No Formation ${game.global.formation === 0 ? ', Active' :''}'  class='formationBtn offlineForm pointer ${game.global.formation === 0 ? 'formationStateEnabled' : 'formationStateDisabled'}' onclick='setFormation("0")'>X</div>`;
		text += `<div role='button' tabindex='0' aria-label='Heap ${game.global.formation === 1 ? ', Active' :''}' class='formationBtn offlineForm pointer ${game.global.formation === 1 ? 'formationStateEnabled' : 'formationStateDisabled'}' onclick='setFormation("1")'>H</div>`;
		if (game.upgrades.Dominance.done) text += `<div role='button' tabindex='0' aria-label='Dominance ${game.global.formation === 2 ? ', Active' :''}' class='formationBtn offlineForm pointer ${game.global.formation === 2 ? 'formationStateEnabled' : 'formationStateDisabled'}' onclick='setFormation("2")'>D</div>`;
		if (game.upgrades.Barrier.done) text += `<div role='button' tabindex='0' aria-label='Barrier ${game.global.formation === 3 ? ', Active' :''}' class='formationBtn offlineForm pointer ${game.global.formation === 3 ? 'formationStateEnabled' : 'formationStateDisabled'}' onclick='setFormation("3")'>B</div>`;
		if (getHighestLevelCleared() >= 180) text += `<div role='button' tabindex='0' aria-label='Scryer ${game.global.formation === 4 ? ', Active' :''}' class='formationBtn offlineForm pointer ${game.global.formation === 4 ? 'formationStateEnabled' : 'formationStateDisabled'}' onclick='setFormation("4")'>S</div>`;
		if (game.global.uberNature === 'Wind') text += `<div role='button' tabindex='0' aria-label='Wind ${game.global.formation === 5 ? ', Active' :''}' class='formationBtn offlineForm pointer ${game.global.formation === 5 ? 'formationStateEnabled' : 'formationStateDisabled'}' onclick='setFormation("5")'>W</div>`;

		if (this.formationsElem.innerHTML !== text) {
			this.formationsElem.innerHTML = text;
		}
	
		if (this.formationsElem.style.display !== 'block') {
			this.formationsElem.style.display = 'block';
		}
	},
	updateMapBtns: function() {
		if (game.global.preMapsActive || game.global.mapsActive) {
			if (this.zoneBtnsElem.style.display !== 'block') {
				this.zoneBtnsElem.style.display = 'block';
				this.mapBtnsElem.style.display = 'none';
			}
		} else {
			if (this.mapBtnsElem.style.display !== 'block') {
				this.zoneBtnsElem.style.display = 'none';
				this.mapBtnsElem.style.display = 'block';
			}
		}
	
		if (this.mapsAllowed < 1) {
			if (this.mapBtnsInnerElem.style.display !== 'none') {
				this.mapBtnsInnerElem.style.display = 'none';
				const elemText = 'No maps available<br>Gain 1 map for each 8 hours away';
				if (this.mapTextElem.innerHTML !== elemText) {
					this.mapTextElem.innerHTML = elemText;
				}
			}
			return;
		}
	
		this.mapBtnsInnerElem.style.display = 'block';
		const world = game.global.world;
		const frags = game.resources.fragments.owned;
		for (let x = 0; x < 4; x++) {
			const useWorld = world - x;
			if (useWorld < 6) {
				this.mapBtns[x].style.display = 'none';
				continue;
			}
	
			const price = calculateMapCost(0 - x);
	
			let mapText = '';
			let displayStyle = '';
			let innerHTML = '';
	
			if (x === 4 && price > frags) {
				mapText = "Oof, you don't have enough fragments to run a map.";
				displayStyle = 'none';
			} else {
				mapText = `You can run <b>${this.mapsAllowed} map${needAnS(this.mapsAllowed)}</b> while you wait!<br>Use ${this.mapsAllowed === 1 ? 'it' : 'them'} wisely...<br>You have ${prettify(frags)} Fragments.`;
				displayStyle = 'inline-block';
			}
	
			innerHTML = `Z ${useWorld} map<br>${prettify(price)} Frags<br>${this.countMapItems(useWorld)} items`;
	
			if (this.mapTextElem.innerHTML !== mapText) {
				this.mapTextElem.innerHTML = mapText;
			}
	
			if (this.mapBtns[x].style.display !== displayStyle) {
				this.mapBtns[x].style.display = displayStyle;
			}
	
			if (this.mapBtns[x].innerHTML !== innerHTML) {
				this.mapBtns[x].innerHTML = innerHTML;
			}
		}
	},
	countMapItems: function(useWorld){
		var dummy = {location: "All", level: useWorld, size: 100};
		return addSpecials(true, true, dummy);
	},
	getHelpText: function(){
		var text = "<p>While you were out, your Trimps didn't get much done - unless you count destruction of property. Luckily you have a Time Portal! While you can't go forward in time, you can go back to keep the Trimps in line and I'll wait here for you.</p>";
		text += "<p>While you're in the past, everything will progress like normal, just much faster. The temporal displacement effects give you blurry vision and a headache (making fine control impossible), but you can force your Trimps to stop and run 1 map whenever you want for each 8 hours spent offline! Maps created this way will use your first preset settings at your selected level with Repeat for Items and Exit to World.</p>";
		text += "<p>If your Trimps look stuck, you can always <b>Stop Here</b> to regain full control of your Trimps, and you'll still receieve resources from Trustworthy Trimps for any unused Time Warp time!</p>"
		text += "<p><b>You can Time Warp for 100% of the time you spent offline, up to a maximum of 24 hours.</b></p>"
		text += "<div style='text-align: center; border: 1px solid black;'><b>You can change your Offline Progress setting to suit your needs!</b><br/><br/>" + getSettingHtml(game.options.menu.offlineProgress, "offlineProgress", null, "timewarp") + "</div>";
		return text;
	},
	fightClicked: function(){
		if (game.global.autoBattle && game.global.pauseFight){
			pauseFight();
			this.fightBtn.style.display = 'none';
		}
		else {
			fightManual();
		}
	},
	start: function(){
		if (!game.global.lastOnline) return;
		var rightNow = new Date().getTime();
		if (game.global.lastOfflineProgress > rightNow){
			game.global.lastOfflineProgress = rightNow;
			return;
		}
		if (game.global.viewingUpgrades) cancelPortal();
		clearTimeout(this.loop);
		this.loop = null;
		game.global.lastOfflineProgress = rightNow;
		var offlineTime = rightNow - game.global.lastOnline;
		var dif = Math.floor(offlineTime / 100);
		var ticks = (dif > this.maxTicks) ? this.maxTicks : dif;
		//ticks = this.maxTicks;
		if (game.options.menu.offlineProgress.enabled == 1){
			var unusedTicks = (dif - ticks);
			if (unusedTicks > 0){
				trustworthyTrimps(true, (unusedTicks / 10));
			}
		}
		game.global.portalTime += (ticks * 100);
		game.global.zoneStarted += (ticks * 100);
		usingRealTimeOffline = true;
		this.progressMax = ticks;
		this.lastEnemyKilled = 0;
		this.ticksProcessed = 0;
		this.mapsAllowed = Math.floor(this.progressMax / 288000);
		this.wrapperElem.style.display = 'block';
		this.innerWrapperElem.style.display = 'none';
		this.startTime = rightNow;
		this.repeatSetting = game.global.repeatMap;
		this.repeatUntil = game.options.menu.repeatUntil.enabled;
		this.exitTo = game.options.menu.exitTo.enabled;
		this.totalOfflineTime = offlineTime;
		this.timeOfflineElem.innerHTML = this.getTimeOfflineText();
		this.updateBar(0);
		var x = 0;
		this.nextFluffIn = -1;
		var loopTicks = game.global.timeWarpLimit * 2;
		if (loopTicks == -1 || loopTicks > 300) loopTicks = 300;
		this.lastLoop = new Date().getTime();
		var updateFreq = 1000;
		var nextUpdate = updateFreq;
		this.updateFormations();
		this.equalityBtn.style.display = (game.portal.Equality.radLocked || game.global.universe == 1) ? 'none' : 'inline-block';
		if (!game.global.autoBattle){
			this.fightBtn.style.display = 'inline-block';
			this.fightBtn.innerHTML = "Start Fighting";
		}
		else if (game.global.pauseFight){
			this.fightBtn.style.display = 'inline-block';
			this.fightBtn.innerHTML = "Enable AutoFight";
		}
		else this.fightBtn.style.display = 'none';
		(function loop() {
			x += loopTicks;
			if (x >= nextUpdate){
				offlineProgress.updateBar(x);
				nextUpdate += updateFreq;
			}
			for(var i = 0; i < loopTicks; i++) {
				gameLoop(true)
				offlineProgress.ticksProcessed++;
				game.global.zoneStarted -= 100;
				game.global.portalTime -= 100;
				game.global.lastSoldierSentAt -= 100;
				game.global.lastSkeletimp -= 100;
			}
			var now = new Date().getTime();
			var timeSpent = now - offlineProgress.lastLoop;
			if (timeSpent < 100){
				loopTicks += 50;
			}
			else if (timeSpent < 175){
				loopTicks += 5;
			}
			else if (timeSpent > 200 && loopTicks > 50){
				loopTicks -= 5;
			}
			offlineProgress.lastLoop = now;
			let nextLoop = 0;
			if (game.global.timeWarpLimit != -1 && loopTicks > game.global.timeWarpLimit * 2){
				loopTicks = game.global.timeWarpLimit * 2;
				nextLoop = 200 - timeSpent;
				if (nextLoop < 0) nextLoop = 0;
				else offlineProgress.lastLoop += nextLoop;
			}
			offlineProgress.loopTicks = loopTicks;
			
			if (typeof steamCanvas !== 'undefined') steamCanvasContext.clearRect(0, 0, steamCanvas.width, steamCanvas.height);

			if (x < ticks && usingRealTimeOffline){
				offlineProgress.loop = setTimeout(loop, nextLoop);
			}
			else{
				offlineProgress.finish();
			}
		})();
	},
	finish: function(reset){
		clearTimeout(this.loop);
		this.loop = null;
		usingRealTimeOffline = false;
		drawAllBuildings();
		drawAllUpgrades();
		drawAllEquipment();
		drawAllJobs();
		this.timeOfflineElem.innerHTML = '';
		this.equalityBtn.innerHTML = "Show Equality";
		this.showingEquality = false;
		this.wrapperElem.style.display = 'none';
		this.innerWrapperElem.style.display = 'block';
		game.global.repeatMap = this.repeatSetting;
		repeatClicked(true);
		game.options.menu.repeatUntil.enabled = this.repeatUntil;
		toggleSetting("repeatUntil", null, false, true);
		game.options.menu.exitTo.enabled = this.exitTo;
		toggleSetting("exitTo", null, false, true);
		toggleSetting("mapAtZone", null, false, true);
		var secondsRemaining = Math.floor((this.progressMax - this.ticksProcessed) / 10);
		this.progressMax = -1;
		this.ticksProcessed = 0;
		this.startTime = -1;
		this.nextFluffIn = -1;
		if (secondsRemaining > 60 && !reset && game.options.menu.offlineProgress.enabled == 1){
			game.global.portalTime -= (secondsRemaining * 1000);
			game.global.zoneStarted -= (secondsRemaining * 1000);
			trustworthyTrimps(false, secondsRemaining);
		}
		var cell = game.global.gridArray[game.global.lastClearedCell + 1];
		if (cell && cell.health > cell.maxHealth) cell.health = cell.maxHealth;
	},
	updateBar: function(current) {
		const width = ((current / this.progressMax) * 100).toFixed(1) + '%';
		this.progressElem.style.width = width;
		let newCellHTML = `Cell ${game.global.lastClearedCell + 2}`;
		let newZoneHTML = `Zone ${game.global.world}`;
		let newProgressTextHTML = `${prettify(current)} / ${prettify(this.progressMax)} ticks (${width})`;
	
		if (this.cellElem.innerHTML !== newCellHTML) {
			this.cellElem.innerHTML = newCellHTML;
		}
	
		if (this.zoneElem.innerHTML !== newZoneHTML) {
			this.zoneElem.innerHTML = newZoneHTML;
		}
	
		if (this.progressTextElem.innerHTML !== newProgressTextHTML) {
			this.progressTextElem.innerHTML = newProgressTextHTML;
		}
		this.updateMapBtns();
		let newMapDesc = '';
		if (game.global.mapsActive) {
			const map = getCurrentMapObject();
			newMapDesc = `<span style='font-size: 0.8em'>Mapping in ${map.name} (${map.level})<br/>Cell ${game.global.lastClearedMapCell + 2}<br/>${this.countMapItems(map.level)} items remain</span>`;
			if (this.countThisMap) newMapDesc += "<br/><span style='font-size: 0.6em'>Looks like you still haven't cleared this map. If you want to leave and make an easier one, I won't count it against you!</span>";
		} else if (game.global.preMapsActive) {
			newMapDesc = 'Sitting in the Map Chamber (lame)';
		}
	
		if (this.inMapDescriptionElem.innerHTML !== newMapDesc) {
			this.inMapDescriptionElem.innerHTML = newMapDesc;
		}
	
		if (current === 0) {
			this.extraInfoElem.innerHTML = 'Starting Offline Progress... (Updates every 2000 processed loops)';
			return;
		}
		const timeSpent = ((new Date().getTime() - this.startTime) / 1000) + 1;
		if (timeSpent > this.nextFluffIn) {
			this.fluff();
			this.nextFluffIn = timeSpent + 30;
		}
		const speed = current / (timeSpent * 10);
		const remaining = Math.floor((this.progressMax - current) / speed / 10);
		let newExtraText = `${prettify(current / 10)} seconds processed in ${prettify(Math.floor(timeSpent))} seconds (${this.loopTicks}L/F, ${prettify(speed)}x speed)<br>Estimated completion in ${this.formatTimeClock(remaining)}<br>${this.currentFluff}`;
	
		if (this.extraInfoElem.innerHTML !== newExtraText) {
			this.extraInfoElem.innerHTML = newExtraText;
		}
		let newEffectiveHTML = '';
		if (this.ticksProcessed - this.lastEnemyKilled > 25000) {
			newEffectiveHTML = 'Progress has slowed to a crawl!';
			const cell = game.global.gridArray[game.global.lastClearedCell + 1];
			if (cell && cell.health > cell.maxHealth) cell.health = cell.maxHealth;
		}
	
		if (this.effectiveElem.innerHTML !== newEffectiveHTML) {
			this.effectiveElem.innerHTML = newEffectiveHTML;
		}
		screenReaderSummary();
	},
	leaveMap: function(){
		this.zoneBtnsElem.style.display = 'none';
		if (!game.global.mapsActive && !game.global.preMapsActive) return;
		game.options.menu.exitTo.enabled = 1;
		mapsClicked(true);
		if (game.global.preMapsActive)
			mapsClicked(true);
	},
	runFirstMap: function(worldDif){
		if (this.mapsAllowed < 1) return;
		if (game.global.mapsActive) return;
		game.options.menu.exitTo.enabled = 1;
		game.global.repeatMap = true;
		game.options.menu.repeatUntil.enabled = 2;
		worldDif = parseInt(worldDif, 10);
		if (!worldDif) worldDif = 0;
		var world = game.global.world;
		if (worldDif == 0 || worldDif == -1 || worldDif == -2 || worldDif == -3) world += worldDif;
		if (!game.global.mapsActive && !game.global.preMapsActive) mapsClicked(true);
		document.getElementById('mapLevelInput').value = world;
		var mapStatus = buyMap();
		if (mapStatus == 1){
			if (game.global.currentMapId) recycleMap();
			selectMap(game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id);
			runMap();
			this.mapBtnsElem.style.display = 'none';
			this.countThisMap = true;
		}
	},
	formatTime: function(seconds){
		if (seconds < 60) return seconds + " second" + needAnS(seconds);
		var minutes = Math.floor(seconds / 60);
		seconds %= 60;
		if (minutes < 60) return minutes + " minute" + needAnS(minutes) + ((seconds > 0) ? " and " + seconds + " second" + needAnS(seconds) : "");
		var hours = Math.floor(minutes / 60);
		minutes %= 60;
		if (hours <= 24) return hours + " hour" + needAnS(hours) + ((minutes > 0) ? " and " + minutes + " minute" + needAnS(minutes) : "");
		var days = Math.floor(hours / 24);
		hours %= 24;
		return days + " day" + needAnS(days) + " and " + hours + " hour" + needAnS(hours);
	},
	formatTimeClock: function(seconds){
		function fillNumber(number){
			return (number < 10) ? "0" + number : number;
		}
		var minutes = Math.floor(seconds / 60);
		seconds %= 60;
		var hours = Math.floor(minutes / 60);
		minutes %= 60;
		return fillNumber(hours) + ":" + fillNumber(minutes) + ":" + fillNumber(seconds);
	}
}

function checkOfflineProgress(noTip){
	if (new Date().getTime() - game.global.lastOnline < 300000) return;
	if (game.options.menu.offlineProgress.enabled == 1 || game.options.menu.offlineProgress.enabled == 2){
		offlineProgress.start();
	}
	else if (game.options.menu.offlineProgress.enabled == 3){
		trustworthyTrimps(noTip);
	}
}

//48 hours = 172800
var savedOfflineText = "";
function trustworthyTrimps(noTip, forceTime){
	if (!game.global.lastOnline) return;
	var rightNow = new Date().getTime();
	var textArray = [];
	var dif = 0;
	if (forceTime){
		dif = forceTime;
	}
	else{
		if (game.global.lastOfflineProgress > rightNow){
			game.global.lastOfflineProgress = rightNow;
			return;
		}
		game.global.lastOfflineProgress = rightNow;
		dif = rightNow - game.global.lastOnline;
		dif = Math.floor(dif / 1000);
	}
	if (dif < 60) return;
	var textString = "";
	var storageBought = [];
	var compatible = ["Farmer", "Lumberjack", "Miner", "Dragimp", "Explorer"];
	var storages = ['Barn', 'Shed', 'Forge'];
	for (var x = 0; x < compatible.length; x++){
		var job = game.jobs[compatible[x]];
		var resName = job.increase;
		var resource = game.resources[resName];
		var amt = job.owned * job.modifier;
		amt += (amt * getPerkLevel("Motivation") * game.portal.Motivation.modifier);
		if (getPerkLevel("Motivation_II") > 0) amt *= (1 + (getPerkLevel("Motivation_II") * game.portal.Motivation_II.modifier));
		if (resName != "gems" && game.permaBoneBonuses.multitasking.owned > 0 && (game.resources.trimps.owned >= game.resources.trimps.realMax())) amt *= (1 + game.permaBoneBonuses.multitasking.mult());
		if (job != "Explorer"){
			if (game.global.challengeActive == "Alchemy") amt *= alchObj.getPotionEffect("Potion of Finding");
			amt *= alchObj.getPotionEffect("Elixir of Finding");
		}
		if (game.global.challengeActive == "Frigid") amt *= game.challenges.Frigid.getShatteredMult();
		if (game.global.pandCompletions && job != "Explorer") amt *= game.challenges.Pandemonium.getTrimpMult();
		if (game.global.desoCompletions && job != "Explorer") amt *= game.challenges.Desolation.getTrimpMult();
		if (!game.portal.Observation.radLocked && game.global.universe == 2 && game.portal.Observation.trinkets > 0) amt *= game.portal.Observation.getMult();
		if (resName == "food" || resName == "wood" || resName == "metal"){
			amt *= getParityBonus();
			if (autoBattle.oneTimers.Gathermate.owned && game.global.universe == 2) amt *= autoBattle.oneTimers.Gathermate.getMult();
		}
		if (Fluffy.isRewardActive('gatherer')) amt *= 2;
		if (getPerkLevel("Meditation") > 0 || (game.jobs.Magmamancer.owned > 0 && resName == "metal")) {
			var medLevel = getPerkLevel("Meditation");
			var toAlter;
			var originalAmt = amt;
			//Find how many stacks of 10 minutes were already stacked before logging out
			var timeAtLastOnline = Math.floor((game.global.lastOnline - game.global.zoneStarted) / 600000);
			//Figure out what percentage of the total time offline one 10 minute chunk is. This will be used to modify amt to the proper amount in 10 minute chunks in order to mimic stacks
			var chunkPercent = 60000 / dif;
			//Start at 100% untouched
			var remaining = 100;
			//if a 10 minute chunk is larger than the time offline, no need to scale in chunks, skip to the end.
			var loops = 6;
			if (game.jobs.Magmamancer.owned && resName == "metal") loops = 12;
			if (timeAtLastOnline < loops && chunkPercent < 100){
				//Start from however many stacks were held before logging out. End at 5 stacks, the 6th will be all time remaining rather than chunks and handled at the end
				for (var z = timeAtLastOnline; z < loops; z++){
					//If no full chunks left, let the final calculation handle it
					if (remaining < chunkPercent) break;
					//Remove a chunk from remaining, as it is about to be calculated
					remaining -= chunkPercent;
					//Check for z == 0 after removing chunkPercent, that way however much time was left before the first stack doesn't get calculated as having a stack
					if (z == 0) continue;
					//Find out exactly how much of amt needs to be modified to make up for this chunk
					toAlter = (originalAmt * chunkPercent / 100);
					//Remove it from toAlter
					amt -= toAlter;
					//Modify and add back
					if (medLevel && z < 6)
						amt += (toAlter * (1 + (z * 0.01 * medLevel)));
					//loops will only set to 72 if the current resource is metal and the player has Magmamancers
					if (loops == 12)
						amt += (toAlter * game.jobs.Magmamancer.getBonusPercent(false, z));
				}
			}
			if (remaining){
				//Check again how much needs to be altered
				toAlter = (originalAmt * (remaining / 100));
				//Remove
				amt -= toAlter;
				//Modify and add back the final amount
				if (medLevel)
					amt += (toAlter) * (1 + (game.portal.Meditation.getBonusPercent() * 0.01));
				if (loops == 12)
					amt += (toAlter * game.jobs.Magmamancer.getBonusPercent());
			}
		}
		if (game.global.challengeActive == "Decay" || game.global.challengeActive == "Melt"){
			var challenge = game.challenges[game.global.challengeActive];
			amt *= 10;
			amt *= Math.pow(challenge.decayValue, challenge.stacks);
		}
		if (challengeActive("Meditate")) amt *= 1.25;
		if (challengeActive("Balance")) amt *= game.challenges.Balance.getGatherMult();
		if (game.global.challengeActive == "Unbalance") amt *= game.challenges.Unbalance.getGatherMult();
		if (game.global.challengeActive == "Archaeology" && resource != "fragments") amt *= game.challenges.Archaeology.getStatMult("science");
		if (game.global.challengeActive == "Insanity" && resource != "fragments") amt *= game.challenges.Insanity.getLootMult();
		if (game.challenges.Nurture.boostsActive() && resource != "fragments") amt *= game.challenges.Nurture.getResourceBoost();
		if (game.global.challengeActive == "Desolation" && resource != "fragments") amt *= game.challenges.Desolation.trimpResourceMult();
		if (game.global.challengeActive == "Daily"){
			if (typeof game.global.dailyChallenge.famine !== 'undefined' && x < 4){
				amt *= dailyModifiers.famine.getMult(game.global.dailyChallenge.famine.strength);
			}
			if (typeof game.global.dailyChallenge.dedication !== 'undefined'){
				amt *= dailyModifiers.dedication.getMult(game.global.dailyChallenge.dedication.strength);
			}
		}
		amt = calcHeirloomBonus("Staff", compatible[x] + "Speed", amt);
		amt *= dif;
		if (x < 3){
			var newMax = resource.max + (resource.max * game.portal.Packrat.modifier * getPerkLevel("Packrat"));
			newMax = calcHeirloomBonus("Shield", "storageSize", newMax);
			var allowed = (newMax - resource.owned);
			if (amt > allowed){
				if (!game.global.autoStorage) {
					amt = allowed;
				}
				else {
					var storageBuilding = game.buildings[storages[x]];
					var count;
					for (count = 1; count < 300; count++){
						amt -= storageBuilding.cost[resName]();
						storageBuilding.owned++;
						storageBuilding.purchased++;
						resource.max *= 2;
						newMax = resource.max + (resource.max * game.portal.Packrat.modifier * getPerkLevel("Packrat"));
						newMax = calcHeirloomBonus("Shield", "storageSize", newMax);
						if (newMax > (resource.owned + amt)) break;
					}
					var s = (count > 1) ? "s" : "";
					storageBought.push(count + " " + storages[x] + s + ", ");
				}
			}
		}
		if (amt > 0){
			resource.owned += amt;
			textString = prettify(amt) + " " + resName + ", ";
			textArray.push(textString);
			if (resName == "gems") game.stats.gemsCollected.value += amt;
		}
	}
	if (textArray.length === 0) return;
	textString = "While you were away, your Trimps were able to produce ";
	for (var y = 0; y < textArray.length; y++){
		textString += textArray[y];
		if (y == textArray.length -2) textString += "and ";
	}
	textString = textString.slice(0, -2);
	if (storageBought.length) {
		textString += " <b>after buying</b> ";
		for (var z = 0; z < storageBought.length; z++){
			textString += storageBought[z];
			if (z == storageBought.length - 2) textString += "and ";
		}
		textString = textString.slice(0, -2);
	}
	textString += ".";
	if (playerSpire.initialized && playerSpire.lootAvg.average){
		var avg = playerSpire.getRsPs();
		if (!isNumberBad(avg)){
			var rsCap = dif;
			if (rsCap > 604800) rsCap = 604800;
			var rsReward = (rsCap * 0.75 * avg);
			playerSpire.runestones += rsReward;
			textString += "<br/>Your Spire Traps and Towers have also produced <b>" + prettify(rsReward) + "</b> Runestones while you were away!";
		}
	}
	if (!noTip) tooltip("Trustworthy Trimps", null, "update", textString);
	else savedOfflineText = textString;
}

function respecPerks(fromPortal){
	if (game.global.challengeActive == "Hypothermia" && game.global.viewingUpgrades){
		document.getElementById('portalStory').innerHTML = "<span style='color: red'>You cannot change your perks while on the Hypothermia Challenge!</span>";
		return;
	}
	if (!game.global.canRespecPerks) return;
	//if (!game.global.viewingUpgrades) return;
	game.global.respecActive = true;
	displayPortalUpgrades(true);
	numTab(1, true);
	if (portalUniverse == 2){
		game.resources.helium.respecMax = (game.global.viewingUpgrades) ? game.global.radonLeftover : game.global.radonLeftover + game.resources.radon.owned;
	}
	else{
		game.resources.helium.respecMax = (game.global.viewingUpgrades) ? game.global.heliumLeftover : game.global.heliumLeftover + game.resources.helium.owned;
	}
	document.getElementById("portalHeliumOwned").innerHTML = prettify(game.resources.helium.respecMax - game.resources.helium.totalSpentTemp);
	document.getElementById("respecPortalBtn").style.display = "none";
	if (!fromPortal){
		document.getElementById("portalStory").innerHTML = "You can only respec once per run. Clicking cancel will not consume this use.";
		document.getElementById("portalTitle").innerHTML = "Respec Perks";
	}
	document.getElementById("ptabRemove").style.display = "table-cell";
	document.getElementById("clearPerksBtn").style.display = "inline-block";
	if (selectedPreset)
		swapClass('tab', 'tabNotSelected', document.getElementById('presetTabLoad'));
}

var portalUniverse = -1;
function swapPortalUniverse(){
	if (game.global.viewingUpgrades) return;
	if (portalUniverse == 1) portalUniverse = 2;
	else portalUniverse = 1;
	portalClicked(true);
	updatePortalUniverseBtn();
}

function updatePortalUniverseBtn(){
	var btn = document.getElementById('swapPortalUniverseBtn');
	if (game.global.viewingUpgrades || !Fluffy.checkU2Allowed()){
		btn.style.display = 'none';
		return;
	}
	else{
		btn.style.display = 'block';
	}
	var text = "Change to Universe ";
	if (portalUniverse == 1) text += "2";
	else text += "1";
	btn.innerHTML = text;
}

function clearPerks(){
	if (!game.global.respecActive) return;
	var leftRes = (portalUniverse == 2) ? game.global.radonLeftover : game.global.heliumLeftover;
	var thisRunRes = (portalUniverse == 2) ? game.resources.radon.owned : game.resources.helium.owned;
	game.resources.helium.respecMax = (game.global.viewingUpgrades) ? leftRes : leftRes + thisRunRes;
	game.resources.helium.totalSpentTemp = 0;
	for (var item in game.portal){
		if (!isPerkUnlocked(item, true)) continue;
		var portUpgrade = game.portal[item];
		if ((portalUniverse == 1 && typeof portUpgrade.level === 'undefined') || (portalUniverse == 2 && typeof portUpgrade.radLevel === 'undefined')) continue;
		portUpgrade.levelTemp = 0;
		portUpgrade.levelTemp -= getPerkLevel(item, true);
		var spent = getSpentPerkResource(item, true);
		game.resources.helium.respecMax += spent;
		portUpgrade.heliumSpentTemp = 0;
		portUpgrade.heliumSpentTemp -= spent;
	}
	displayPortalUpgrades(true);
	document.getElementById("portalHeliumOwned").innerHTML = prettify(game.resources.helium.respecMax);
	if (game.global.viewingUpgrades) {
		document.getElementById("respecPortalBtn").style.display = "none";
		document.getElementById("activatePortalBtn").innerHTML = "Confirm";
		document.getElementById("activatePortalBtn").style.display = "inline-block";
	}
	document.getElementById("totalHeliumSpent").innerHTML = prettify(countHeliumSpent(true, true));
}

function countHeliumSpent(checkTemp, usePortalUniverse){
	var count = 0;
	var universe = (usePortalUniverse) ? portalUniverse : game.global.universe;
	for (var item in game.portal){
		item = game.portal[item];
		if (universe == 2){
			if (typeof item.radLevel === 'undefined') continue;
			count += item.radSpent;
		}
		else {
			if (typeof item.level === 'undefined') continue;
			count += item.heliumSpent;
		}
		
		if (checkTemp && item.heliumSpentTemp) count += item.heliumSpentTemp;
	}
	return count;
}

function activateClicked(){
	if (game.global.viewingUpgrades){
		var refund = game.resources.helium.respecMax - game.resources.helium.totalSpentTemp;
		if (!commitPortalUpgrades()) return;
		if (game.global.universe == 2){
			game.global.radonLeftover = refund;
			if (game.portal.Frenzy.radLevel <= 0 && game.portal.Frenzy.frenzyStarted != -1){
				game.portal.Frenzy.frenzyStarted = -1;
				game.portal.Frenzy.drawStacks();
			}
		}
		else{
			game.global.heliumLeftover = refund;
		}
		if (game.global.respecActive) game.global.canRespecPerks = false;
		cancelPortal();
		game.resources.helium.respecMax = 0;
		return;
	}
	var newText = "";
	if (game.global.selectedChallenge){
		if (challengeSquaredMode)
			newText += " <span id='addChallenge' class='colorSquared'>You are about to run the <b style='font-size: 1.1em'>" + game.global.selectedChallenge + " Challenge<sup>" + ((portalUniverse == 1) ? "2" : "3") + "</sup></b></span><br/>";
		else
			newText += " <span id='addChallenge'>You are about to run the <b style='font-size: 1.1em'>" + game.global.selectedChallenge + " Challenge</b></span><br/>";
	}
	else if (game.options.menu.portalChallenge.shouldAlert()) newText += " <span id='addChallenge'><b style='color: #870c0c'>You don't have a Challenge selected! Challenges add some extra rules to your Portal in exchange for a reward at the end. Click that you're not ready and select one from the right side of this screen!</b><br/><span style='font-weight: initial; font-size: 0.9em'>You can disable this warning under Settings -> Pop-ups and Alerts.</span></span><br/>";
	else newText += " <span id='addChallenge'></span>";
	if (game.global.kongBonusMode){
		newText = "All set?";
	}
	else newText += "<div id='portalConfirmStory'>Are you sure you want to enter the portal? You will lose all progress other than the portal-compatible upgrades you've earned, such as Helium, Perks, Bones, and Exotic Imports. Who knows where or when it will send you.</div><br/>";

	if (game.global.challengeActive == "Daily") newText += "<span class='dailyError portalError'>You still have the Daily challenge active! If you portal right now, your reward will be applied at the beginning of your next run. Alternatively, click 'Finish Daily' in the World or inside 'View Perks' to get the bonus now.</span>";
	if (game.global.runningChallengeSquared) newText += "<div class='squaredError portalError'>" + getSquaredDescriptionInRun(true) + "</div>";
	if (game.global.heirloomsExtra.length){
		var s = (game.global.heirloomsExtra.length > 1) ? "s" : "";
		var spirestones = recycleAllExtraHeirlooms(false, true);
		var highestTier = 0;
		for (var x = 0; x < game.global.heirloomsExtra.length; x++){
			if (game.global.heirloomsExtra[x].rarity > highestTier) highestTier = game.global.heirloomsExtra[x].rarity;
		}
		highestTier = game.heirlooms.rarityNames[highestTier];
		newText += "<div class='heirloomRecycleWarning portalError'>You have " + game.global.heirloomsExtra.length + " extra Heirloom" + s + " (highest rarity is " + highestTier + "), which will be recycled for " + prettify(recycleAllExtraHeirlooms(true)) + " Nullifium " + ((spirestones > 0) ? " and " + prettify(spirestones) + " Spirestones " : "") + "if you portal now. Make sure you carry any that you want to save!</div>";
	}
	if (game.global.world >= 230 && canAffordGeneratorUpgrade()){
		newText += "<div class='magmiteError portalError'>You have " + prettify(game.global.magmite) + " Magmite, which is enough purchase an upgrade for your Dimensional Generator! If you portal now, " + ((game.permanentGeneratorUpgrades.Shielding.owned) ? "20" : "30") + "% of your Magmite will decay.<div style='text-align: center'><span role='button' tabindex='0' onclick='cancelTooltip(); tooltip(\"Upgrade Generator\", null, \"update\")' class='btn btn-lg btn-success'>Spend Magmite</span></div></div><br/>";
	}
	var btnText = "<div role='button' tabindex='0' class='btn btn-info btn-lg' onclick='activatePortal()'>Let's do it.</div>&nbsp;<div role='button' tabindex='0' class='btn btn-lg btn-warning' onclick='cancelTooltip()'>Wait, I'm not ready!</div>";
	tooltip('Activate Portal', 'customText', 'update', newText, btnText);
	screenReaderAssert("Confirmation Popup is active. Press S to view the popup.")
	game.global.lockTooltip = true;
	var tooltipElem = document.getElementById('tooltipDiv');
	tooltipElem.style.left = "33.75%";
	tooltipElem.style.top = "25%";
}

function enablePerkConfirmBtn(){
	if (portalWindowOpen && game.global.selectedChallenge == "Daily") return;
	document.getElementById("activatePortalBtn").innerHTML = "Confirm";
	document.getElementById("activatePortalBtn").style.display = "inline-block";
}

function getPerkBuyCount(perkName){
	var perk = game.portal[perkName];
	if (!perk) return 0;
	if (game.global.buyAmt != "Max") return game.global.buyAmt;
	var heliumAvailable = (game.resources.helium.respecMax - game.resources.helium.totalSpentTemp) * game.global.maxSplit;
	var toBuy = 0;
	var perkLevels = getPerkLevel(perkName, true);
	if (!perk.additive){
		var growth = (perk.specialGrowth) ? perk.specialGrowth : 1.3;
		//if (portalUniverse == 2 && !perk.specialGrowth) growth = 1.5;
		var toSpend = 0;
		var currentLevel = perkLevels + perk.levelTemp;
		var priceBase = perk.priceBase;
		while (toBuy < 1000 && toSpend < heliumAvailable){
			if (toBuy > 1000) return Infinity;
			var nextLevel = currentLevel + toBuy;
			toSpend += Math.ceil(((nextLevel) / 2) + priceBase * Math.pow(growth, nextLevel));
			if (isNumberBad(toSpend)) return 1;
			toBuy++;
		}
		toBuy--;
	}
	else {
		//Let it be known that buy max on additive perks only exists because The Amazing GhostFrog is a math wizard. 
		//I spent hours bashing my head against a wall trying to figure it out, and she came up with this formula in a few minutes.
		var levels = perkLevels + perk.levelTemp;
		var increase = perk.additiveInc
		var nextPurchaseCost = perk.priceBase + (levels * increase);
		var A = (increase / 2);
		var B = (nextPurchaseCost - A);
		var C = heliumAvailable * -1;
		var affordableLevels = ((B * -1) + Math.sqrt(Math.pow(B, 2) - (4 * A * C))) / (2 * A);
		toBuy = Math.floor(affordableLevels);
	}
	if (toBuy <= 0) toBuy = 1;
	if (perk.max && ((perkLevels + perk.levelTemp + toBuy) > perk.max)) toBuy = perk.max - perkLevels - perk.levelTemp;
	return toBuy;
}

function buyPortalUpgrade(what){
	if (game.global.challengeActive == "Hypothermia" && game.global.viewingUpgrades){
		document.getElementById('portalStory').innerHTML = "<span style='color: red'>You cannot change your perks while on the Hypothermia Challenge!</span>";
		return;
	}
	if (!game.global.kongBonusMode && !game.global.portalActive && !game.global.respecActive && !game.global.viewingUpgrades) return;
	if (game.global.buyAmt != "Max" && isNaN(game.global.buyAmt)) {
		numTab(1);
		return;
	}
	var toBuy = game.portal[what];
	if (game.global.removingPerks){
		removePerk(what);
		updateAllPerkColors();
		enablePerkConfirmBtn();
		document.getElementById("totalHeliumSpent").innerHTML = prettify(countHeliumSpent(true, true));
		return;
	}
	var levelsToAdd = getPerkBuyCount(what);
	if (toBuy.max < getPerkLevel(what, true) + toBuy.levelTemp + levelsToAdd) return;
	var price = getPortalUpgradePrice(what, false, levelsToAdd);
	var canSpend = game.resources.helium.respecMax - game.resources.helium.totalSpentTemp;
	if (canSpend >= price){
		document.getElementById("ptabRemove").style.display = "table-cell";
		toBuy.levelTemp += levelsToAdd;
		game.resources.helium.totalSpentTemp += price;
		toBuy.heliumSpentTemp += price;
		canSpend -= price;
		updatePerkLevel(what);
		if(!usingScreenReader) tooltip(what, "portal", "update");
		document.getElementById("portalHeliumOwned").innerHTML = prettify(canSpend);
		enablePerkConfirmBtn();
		if (game.global.buyAmt == "Max") displayPortalUpgrades(true);
		else updateAllPerkColors();
	}
	document.getElementById("totalHeliumSpent").innerHTML = prettify(countHeliumSpent(true, true));
}

var selectedPreset = 0;
function presetTab(tabNum){
	swapClass('tab', 'tabNotSelected', document.getElementById('presetTabSave'));
	if (game.global.respecActive)
		swapClass('tab', 'tabNotSelected', document.getElementById('presetTabLoad'));
	swapClass('tab', 'tabNotSelected', document.getElementById('presetTabRename'));
	swapClass('tab', 'tabSelected', document.getElementById('presetTab' + tabNum));
	if (selectedPreset > 0) swapClass('tab', 'tabNotSelected', document.getElementById('presetTab' + selectedPreset));
	selectedPreset = tabNum;
}

function resetPresets(){
	swapClass('tab', 'tabNotEnabled', document.getElementById('presetTabSave'));
	swapClass('tab', 'tabNotEnabled', document.getElementById('presetTabLoad'));
	swapClass('tab', 'tabNotEnabled', document.getElementById('presetTabRename'));
	selectedPreset = 0;
	var presetGroup = (portalUniverse == 2) ? game.global.perkPresetU2 : game.global.perkPresetU1;
	for (var x = 1; x <= 3; x++){
		var preset = presetGroup["perkPreset" + x];
		swapClass('tab', 'tabNotSelected', document.getElementById('presetTab' + x));
		document.getElementById('presetTab' + x + 'Text').innerHTML = (preset.Name) ? preset.Name : "Preset " + x;
	}
}

function getPerkPresetGroup(){
	return (portalUniverse == 2) ? game.global.perkPresetU2 : game.global.perkPresetU1;
}

function savePerkPreset(){
	var to = selectedPreset;
	if (to == 0) return;
	var saved = {};
	var presetGroup = getPerkPresetGroup();
	var levelName = (portalUniverse == 2) ? "radLevel" : "level";
	for(var item in game.portal){
		var temp = (game.portal[item].levelTemp) ? game.portal[item].levelTemp : 0;
		if ((portalUniverse == 1 && game.portal[item].locked !== false) || (portalUniverse == 2 && game.portal[item].radLocked !== false) || game.portal[item][levelName] + temp == 0) continue;
		saved[item] = game.portal[item][levelName] + temp;
	}
	if (presetGroup["perkPreset" + to].Name) saved.Name = presetGroup["perkPreset" + to].Name;
	presetGroup["perkPreset" + to] = saved;
	document.getElementById('presetTab' + to + 'Text').innerHTML = ((saved.Name) ? saved.Name : "Preset " + to);
}

function renamePerkPreset(needTooltip, name){
	if (selectedPreset == 0) return;
	var presetGroup = getPerkPresetGroup();
	if (presetGroup["perkPreset" + selectedPreset] == {}) return;
	if (needTooltip){
		tooltip("Rename Preset", null, "update");
		return;
	}
	var elem = document.getElementById('renamePresetBox');
	if (!elem || !elem.value) return;
	presetGroup["perkPreset" + selectedPreset].Name = htmlEncode(elem.value.substring(0, 25));
	cancelTooltip();
	for (var x = 1; x <= 3; x++){
		var preset = presetGroup["perkPreset" + x];
		document.getElementById('presetTab' + x + 'Text').innerHTML = (preset.Name) ? preset.Name : "Preset " + x;
	}
}

function loadPerkPreset(){
	if (!game.global.respecActive) return;
	if (selectedPreset == 0) return;
	var presetNumber = selectedPreset;
	var presetGroup = getPerkPresetGroup();
	var perkSetting = presetGroup["perkPreset" + presetNumber];
	if (isObjectEmpty(perkSetting)) return;
	clearPerks();
	for (var item in perkSetting){
		if (!game.portal[item] || !isPerkUnlocked(item, true)) continue;
		var changeAmt = perkSetting[item] - getPerkLevel(item, true) - game.portal[item].levelTemp;
		var price = (changeAmt != 0) ? getPortalUpgradePrice(item, (changeAmt < 0), changeAmt) : 0;
		if (game.resources.helium.respecMax - game.resources.helium.totalSpentTemp < price) continue;
		game.portal[item].levelTemp += changeAmt;
		game.resources.helium.totalSpentTemp += price;
		game.portal[item].heliumSpentTemp += price;
		updatePerkLevel(item);
	}
	document.getElementById("portalHeliumOwned").innerHTML = prettify(game.resources.helium.respecMax - game.resources.helium.totalSpentTemp);
	enablePerkConfirmBtn();
	updateAllPerkColors();
	document.getElementById("totalHeliumSpent").innerHTML = prettify(countHeliumSpent(true, true));
}

function exportPerks(){
	//First, make a blank object to hold the perk info
	var exportPerks = {};
	var levelName = (portalUniverse == 2) ? "radLevel" : "level";
	for (var item in game.portal){
		//For smaller strings and backwards compatibility, perks not added to the object will be treated as if the perk is supposed to be level 0.
		if ((portalUniverse == 1 && game.portal[item].locked !== false) || (portalUniverse == 2 && game.portal[item].radLocked !== false) || game.portal[item][levelName] <= 0) continue;
		//Add the perk to the object with the desired level
		exportPerks[item] = game.portal[item][levelName];
	}

	//At this point you should have an object like this:
	//{
	//	Looting: 10,
	//	Toughness: 5,
	//	Power: 7
	//} This would set Looting to 10, Toughness to 5, Power to 7, and all other unlocked perks to level 0.

	//JSON.stringify() the object
	exportPerks = JSON.stringify(exportPerks);
	//And finally, compress it to base 64 with LZString. I suggest grabbing a copy of LZString.js from github.com/trimps to ensure there are no differences between our versions (beta 1.5).
	return LZString.compressToBase64(exportPerks);
}

function importPerks() {
	//This function was written by the brilliant Grimy. Thanks Grimy!
	var levels;
	var levelName = (portalUniverse == 2) ? "radLevel" : "level";
	try {
		levels = JSON.parse(LZString.decompressFromBase64(document.getElementById('perkImportBox').value.replace(/\s/gm, '')));
	} catch (e) { return "Something went really wrong, what did you even just try to do?!"}
	if (!levels)
		return "This doesn't look like a valid perk string.";
	if (levels.global)
		return "This looks like a save string, rather than a perk string. To import a save string, use the Import button on the main screen.";
	// Check that everything is in order. Don't touch anything yet.
	var respecNeeded = false;
	var heNeeded = 0;
	var changeAmt = {};
	var price = {};
	var levelCount = 0;

	for (var perk in game.portal) {
		if (!levels[perk]){
			if (portalUniverse == 1 && game.portal[perk].locked !== false) continue;
			if (portalUniverse == 2 && game.portal[perk].radLocked !== false) continue;
			if (game.portal[perk][levelName] + game.portal[perk].levelTemp == 0) continue;
			levels[perk] = 0;
		}
		// parseInt parses "1e6" as 1, so we use parseFloat then floor as a replacement
		var level = Math.floor(parseFloat(levels[perk]));
		levelCount += level;

		if (game.portal[perk].locked || level > game.portal[perk].max || isNumberBad(level))
			return "Cannot set " + perk + " to level " + level + ".";

		if (portalUniverse == 1 && level < game.portal[perk].level) respecNeeded = true;
		else if (portalUniverse == 2 && level < game.portal[perk].radLevel) respecNeeded = true;

		changeAmt[perk] = level - game.portal[perk][levelName] - game.portal[perk].levelTemp;
		price[perk] = changeAmt[perk] > 0 ? getPortalUpgradePrice(perk, false, changeAmt[perk]) :
					  changeAmt[perk] < 0 ? -getPortalUpgradePrice(perk, true, -changeAmt[perk]) : 0;
		heNeeded += price[perk];
	}
	if (heNeeded > game.resources.helium.respecMax - game.resources.helium.totalSpentTemp)
		return "You don't have enough " + heliumOrRadon(false, true) + " to afford this perk setup.";

	if (respecNeeded && !game.global.canRespecPerks)
		return "This perk setup would require a respec, but you don't have one available.";

	// Okay, now we can actually set the perks.
	cancelTooltip();
	if (respecNeeded && !game.global.respecActive)
		respecPerks();
	if (levelCount == 0){
		clearPerks();
	}
	else{
		for (perk in changeAmt) {
			game.portal[perk].levelTemp += changeAmt[perk];
			game.resources.helium.totalSpentTemp += price[perk];
			game.portal[perk].heliumSpentTemp += price[perk];
			updatePerkLevel(perk);
		}
	}

	document.getElementById("portalHeliumOwned").innerHTML = prettify(game.resources.helium.respecMax - game.resources.helium.totalSpentTemp);
	enablePerkConfirmBtn();
	updateAllPerkColors();
	document.getElementById("totalHeliumSpent").innerHTML = prettify(countHeliumSpent(true, true));
}

function removePerk(what) {
	var removeAmt = game.global.buyAmt;
	var perkLevel = getPerkLevel(what, true);
	if (removeAmt == "Max") removeAmt = Math.ceil((perkLevel + game.portal[what].levelTemp) * game.global.maxSplit);
	if (isNumberBad(removeAmt)){
		console.log("Remove Amount is " + removeAmt);
		return;
	}
	var toBuy = game.portal[what];
	var realTemp = (game.global.respecActive) ? toBuy.levelTemp + perkLevel : toBuy.levelTemp;
	var forceZeroSpent = false;
	if (realTemp < removeAmt) removeAmt = realTemp;
	var refund = getPortalUpgradePrice(what, true, removeAmt);
	//Error Checking
	var tempLevelTemp = perkLevel + toBuy.levelTemp - removeAmt;
	if (isNumberBad(tempLevelTemp)) {
		console.log("Trying to set perk level to " + tempLevelTemp);
		return;
	}
	var perkSpent = getSpentPerkResource(what, true);
	var tempHeliumSpentTemp = perkSpent + toBuy.heliumSpentTemp - refund;
	var totalEarned = (portalUniverse == 2) ? game.global.totalRadonEarned : game.global.totalHeliumEarned;
	if (isNumberBad(tempHeliumSpentTemp)){
		if (!isNaN(tempHeliumSpentTemp) && tempHeliumSpentTemp < 0 && (totalEarned > Math.abs(tempHeliumSpentTemp) * 1e14)){
			forceZeroSpent = true;
		}
		else{
			console.log("Trying to set helium spent on perk to " + tempHeliumSpentTemp);
			return;
		}
	}
	var tempTotalSpentTemp = game.resources.helium.totalSpentTemp - refund;
	if (isNaN(tempTotalSpentTemp) || !isFinite(tempTotalSpentTemp)){
		console.log("Trying to set spent helium to " + tempTotalSpentTemp);
		return;
	}
	toBuy.levelTemp -= removeAmt;
	toBuy.heliumSpentTemp -= refund;
	if (forceZeroSpent) {
		toBuy.heliumSpentTemp = perkSpent * -1;
		toBuy.levelTemp = perkLevel * -1;
	}
	if (toBuy.levelTemp + perkLevel == 0){
		var roundingError = toBuy.heliumSpentTemp + perkSpent;
		if (roundingError){
			console.log('rounding error of ' + roundingError + ', adding to refund');
			refund += roundingError;
			toBuy.heliumSpentTemp = perkSpent * -1;
		}
	}
	game.resources.helium.totalSpentTemp -= refund;
	updatePerkLevel(what);
	tooltip(what, "portal", "update");
	var canSpend = game.resources.helium.respecMax;
	document.getElementById("portalHeliumOwned").innerHTML = prettify(canSpend - game.resources.helium.totalSpentTemp);
}

function isNumberBad(number) {
	return (isNaN(number) || typeof number === 'undefined' || number < 0 || !isFinite(number) || number == null);
}

function updatePerkLevel(what){
	var textElem = document.getElementById(what + "Owned");
	if (!textElem) return;
	var nextCostElem = document.getElementById(what + "Price");
	var spentElem = document.getElementById(what + "Spent");
	var perkElem = document.getElementById(what);
	var toBuy = game.portal[what];
	var level = getPerkLevel(what, true);
	if (what == "Tenacity" || what == "Greed") level += game.portal.Masterfulness.radLevel + game.portal.Masterfulness.levelTemp;
	if (what == "Masterfulness"){
		updatePerkLevel('Greed');
		updatePerkLevel('Tenacity');
	}
	var text = level + toBuy.levelTemp;
	if (game.options.menu.formatPerkLevels.enabled) text = prettify(text);
	if (toBuy.levelTemp){
		if (game.options.menu.smallPerks.enabled){
			text += "<br/>(";
		}
		else text += "&nbsp;("
		if (toBuy.levelTemp > 0) text += "+";
		text += ((game.options.menu.formatPerkLevels.enabled) ? prettify(toBuy.levelTemp) : toBuy.levelTemp) + ")";
		swapClass('changing', 'changingOn', perkElem);
	}
	else {
		swapClass('changing', 'changingOff', perkElem);
	}
	if (spentElem !== null){
		spentElem.innerHTML = prettify(getSpentPerkResource(what, true) + toBuy.heliumSpentTemp);
		nextCostElem.innerHTML = (!toBuy.max || toBuy.max > level + toBuy.levelTemp) ? prettify(getPortalUpgradePrice(what)) : "Max";
	}
	textElem.innerHTML = text;
}

function toggleRemovePerks(noUpdate){
	var perkElem = document.getElementById("ptabRemove");
	var perkTextElem = document.getElementById("ptabRemoveText");
	if (!noUpdate) game.global.removingPerks = !game.global.removingPerks;
	if (!game.global.removingPerks){
		perkElem.style.background = "rgba(255, 255, 255, 0.25)";
		perkTextElem.style.color = "red";
	}
	else {
		perkElem.style.background = "rgba(214, 29, 29, 0.75)";
		perkTextElem.style.color = "white";
	}
	updateAllPerkColors();
}

function unlockMapStuff(){
	fadeIn("fragments", 10);
	fadeIn("gems", 10);
	fadeIn("mapsBtn", 10);
	toggleSetting("mapLoot", null, false, true);
	toggleSetting("repeatUntil", null, false, true);
	toggleSetting("exitTo", null, false, true);
	toggleSetting("repeatVoids", null, false, true);
	toggleSetting("mapAtZone", null, false, true);
}

function getPortalUpgradePrice(what, removing, forceAmt){
	var toCheck = game.portal[what];
	var tempLevel;
	var nextLevel;
	var toAmt;
	if (!removing){
		toAmt = (forceAmt) ? forceAmt : getPerkBuyCount(what);
	}
	tempLevel = getPerkLevel(what, true) + toCheck.levelTemp;
	var amt = 0;
	if (toCheck.additive){
		if (removing)
			nextLevel = tempLevel - forceAmt;
		else
			nextLevel = tempLevel + toAmt;
		amt = getAdditivePrice(nextLevel, toCheck) - getAdditivePrice(tempLevel, toCheck);
		if (amt == 0){
			var increase = toCheck.additiveInc
			amt = (toCheck.priceBase + (tempLevel * increase)) * toAmt;
		}
		if (removing) amt = Math.abs(amt);
	}
	else {
		if (removing){
			toAmt = forceAmt;
			tempLevel -= forceAmt;
		}
		if (toAmt > 1000) return Infinity;
		var growth = (toCheck.specialGrowth) ? toCheck.specialGrowth : 1.3;
		//if (portalUniverse == 2 && !toCheck.specialGrowth) growth = 1.5;
		for (var x = 0; x < toAmt; x++){
			amt += Math.ceil(((tempLevel + x) / 2) + toCheck.priceBase * Math.pow(growth, tempLevel + x));
		}
	}
	return amt;
}

function getAdditivePrice(atLevel, portalUpgrade){
	return (((atLevel - 1) * atLevel) / 2 * portalUpgrade.additiveInc) + (portalUpgrade.priceBase * atLevel);
}

function commitPortalUpgrades(usingPortal){
	if (!usingPortal && !canCommitCarpentry()) return false; //And coordinated
	checkHandleResourcefulRespec();
	for (var item in game.portal){
		if (game.portal[item].locked) continue;
		var portUpgrade = game.portal[item];
		if (typeof portUpgrade.level === 'undefined' && portalUniverse == 1) continue;
		if (typeof portUpgrade.radLevel === 'undefined' && portalUniverse == 2) continue;
		if (portalUniverse == 1){
			portUpgrade.level += portUpgrade.levelTemp;
			portUpgrade.heliumSpent += portUpgrade.heliumSpentTemp;
		}
		else if (portalUniverse == 2){
			portUpgrade.radLevel += portUpgrade.levelTemp;
			portUpgrade.radSpent += portUpgrade.heliumSpentTemp;
		}
		if (portUpgrade.levelTemp !== 0 && portUpgrade.onChange) portUpgrade.onChange();
		portUpgrade.levelTemp = 0;
		portUpgrade.heliumSpentTemp = 0;
	}
	if (game.portal.Equality.scalingCount > game.portal.Equality.radLevel) game.portal.Equality.scalingCount = game.portal.Equality.radLevel;
	if (game.portal.Equality.settings.reg.disabledStackCount > game.portal.Equality.radLevel) game.portal.Equality.settings.reg.disabledStackCount = game.portal.Equality.radLevel;
	if (game.portal.Equality.settings.spire.disabledStackCount > game.portal.Equality.radLevel) game.portal.Equality.settings.spire.disabledStackCount = game.portal.Equality.radLevel;
	if (game.global.respecActive || game.global.viewingUpgrades){
		if (portalUniverse == 1){
			game.global.heliumLeftover = game.resources.helium.respecMax - game.resources.helium.totalSpentTemp;
		}
		else if (portalUniverse == 2){
			game.global.radonLeftover = game.resources.helium.respecMax - game.resources.helium.totalSpentTemp;
		}
		game.resources.helium.totalSpentTemp = 0;
		return true;
	}
	if (portalUniverse == 1){
		game.resources.helium.owned -= (game.resources.helium.totalSpentTemp);
	}
	else if (portalUniverse == 2){
		game.resources.radon.owned -= (game.resources.helium.totalSpentTemp);
	}
	game.resources.helium.totalSpentTemp = 0;
	return true;
}

function canCommitCarpentry(noInfinity){ //Uh, and Coordinated. This checks coordinated too.
	//This function cannot just use trimps.realMax(), as it needs to check levelTemp
	var newMax = game.resources.trimps.max;
	if (game.global.challengeActive == "Downsize"){
		newMax = game.global.totalGifts + game.unlocks.impCount.TauntimpAdded + 10;
		newMax += countTotalHousingBuildings();
	}
	newMax *= game.resources.trimps.maxMod;
	newMax = Math.floor(newMax * (Math.pow(1 + game.portal.Carpentry.modifier, getPerkLevel("Carpentry") + game.portal.Carpentry.levelTemp)));
	if (typeof game.portal.Carpentry_II.levelTemp !== 'undefined') newMax = Math.floor(newMax * (1 + (game.portal.Carpentry_II.modifier * (getPerkLevel("Carpentry_II") + game.portal.Carpentry_II.levelTemp))));
	if (game.global.expandingTauntimp) newMax = Math.floor(newMax * game.badGuys.Tauntimp.expandingMult());
	newMax = Math.floor(newMax * (alchObj.getPotionEffect("Elixir of Crafting")));
	if (autoBattle.bonuses.Scaffolding.level > 0) newMax = Math.floor(newMax * autoBattle.bonuses.Scaffolding.getMult());
	if (game.global.universe == 2 && u2Mutations.tree.Trimps.purchased) newMax *= 1.5;
	var error = document.getElementById("portalError");
	error.innerHTML = "";
	var good = true;
	var soldiers = game.resources.trimps.getCurrentSend(true);
    if (newMax < (soldiers * 2.4)) {
        error.innerHTML += "You do not have enough max Trimps with this Perk setup to sustain your Coordination. ";
		error.style.display = "block";
		good = false;
	}
	if (Math.ceil(newMax / 2) < game.resources.trimps.employed){
		var over = (game.resources.trimps.employed - Math.ceil(newMax / 2));
		if (!noInfinity && freeManyWorkspaces(over)){
			return canCommitCarpentry(true);
		}
		error.innerHTML += "You have too many workers assigned for this Perk setup.";
		error.style.display = "block";
		good = false;
	}
	return good;
}

function checkHandleResourcefulRespec(){
	if (getPerkLevel("Resourceful") > game.portal.Resourceful.levelTemp) clearQueue();
}

function clearQueue(specific = false) {
	if (!specific) game.global.clearingBuildingQueue = true;
	let existing = 0;

	for (let x = 0; x < game.global.nextQueueId; x++) {
		const queueItem = document.getElementById(`queueItem${x}`);
		if (!queueItem) continue;

		existing++;

		if (specific && game.global.buildingsQueue[existing - 1].split('.')[0] !== specific) continue;
		else existing--;

		removeQueueItem(`queueItem${x}`, true);
	}

	game.global.clearingBuildingQueue = false;
}

function activatePortal(){
	if (game.global.selectedChallenge == "Daily"){
		if (getDailyChallenge(readingDaily, false, true) !== nextDaily) {
			document.getElementById("portalStory").innerHTML = "<span style='color: red'>The daily challenge has changed since you looked at it. The challenge description has been refreshed, click Activate Portal to run it!</span>";
			getDailyChallenge();
			return;
			}
	}
	if (game.global.challengeActive == "Daily"){
		abandonDaily();
	}
	if (game.global.challengeActive == "Bublé"){
		game.challenges.Bublé.abandon();
	}
	if (game.global.runningChallengeSquared && game.global.challengeActive){
		var challengeList;
		if (game.challenges[game.global.challengeActive].multiChallenge) challengeList = game.challenges[game.global.challengeActive].multiChallenge;
		else challengeList = [game.global.challengeActive];
		for (var x = 0; x < challengeList.length; x++){
			if (game.global.world > game.c2[challengeList[x]])
			game.c2[challengeList[x]] = game.global.world;
		}
		game.global.challengeActive = "";
		if (game.global.capTrimp && game.c2.Trimp > 230) game.c2.Trimp = 230;
	}
	game.global.runningChallengeSquared = (game.global.selectedChallenge) ? challengeSquaredMode : false;
	var refund = game.resources.helium.respecMax - game.resources.helium.totalSpentTemp;
	if (!commitPortalUpgrades(true)) return;
	if (portalUniverse == 1)	game.global.heliumLeftover = refund;
	else if (portalUniverse == 2) game.global.radonLeftover = refund;
	if (game.global.universe == 1 && portalUniverse == 2) game.global.heliumLeftover += game.resources.helium.owned;
	else if (game.global.universe == 2 && portalUniverse == 1) game.global.radonLeftover += game.resources.radon.owned;
	game.global.newUniverse = portalUniverse;
	if (portalUniverse == 2 && game.global.totalRadPortals == 0) {
		setAutoGoldenSetting(0);
		toggleAutoGolden(true);
	}
	cancelPortal(true);
	game.resources.helium.respecMax = 0;
	if (game.global.universe == 2) game.global.totalRadPortals++;
	else game.global.totalPortals++;
	resetGame(true);
	displayPerksBtn();
	handleFinishDailyBtn();
	checkEquipPortalHeirlooms();
	document.getElementById("portalUpgradesHere").innerHTML = "";
	if (game.global.universe == 2) {
		message("A blue shimmer erupts then disappears as you gracefully take its place. You look like you don't belong here... Well, better start gathering some food.", "Story")
	}
	else{
		message("A green shimmer erupts then disappears, and you hit the ground. You look pretty hungry...", "Story");
	}
	if (game.options.menu.richPresence.enabled == 2 && typeof updateDiscordAndSteamRichPresence !== 'undefined') updateDiscordAndSteamRichPresence({}, true);
	if (u2Mutations.respecOnPortal) u2Mutations.respec();
}

function cancelPortal(keep){
	portalUniverse = game.global.universe;
	portalWindowOpen = false;
	if (game.global.kongBonusMode){
		game.global.kongBonusMode = false;
		if (!keep) resetGame();
		message("A green shimmer erupts then disappears, and you hit the ground. You look pretty hungry...", "Story");
	}
	game.global.viewingUpgrades = false;
	game.global.respecActive = false;
	if (!keep)
		game.global.selectedChallenge = "";
	resetPresets();
	document.getElementById("clearPerksBtn").style.display = "none";
	document.getElementById("respecPortalBtn").style.display = "none";
	document.getElementById("portalUpgradesHere").innerHTML = "";
	document.getElementById("portalWrapper").style.display = "none";
	fadeIn("wrapper", 10);
	document.getElementById("challenges").style.display = "none";
	document.getElementById("viewChallenge").style.display = "none";
	document.getElementById("cancelChallengeBtn").style.display = "none";
	document.getElementById("extraChallengeStuff").innerHTML = "";
	document.getElementById("portalError").style.display = "none";
	document.getElementById("ptabRemove").style.display = "none";
	document.getElementById("swapToCurrentChallengeBtn").style.display = "none";
	lookingAtCurrentChallenge = false;
	game.global.removingPerks = false;
	game.resources.helium.respecMax = 0;
	restoreNumTab();
}

function restoreNumTab(){
	if (savedBuyAmt == -1)
		return;
	game.global.buyAmt = savedBuyAmt;
	switch(savedBuyAmt){
		case 1:
			numTab(1);
			break;
		case 10:
			numTab(2);
			break;
		case 25:
			numTab(3);
			break;
		case 100:
			numTab(4);
			break;
		case "Max":
			game.global.buyAmt = 1;
			numTab(6);
			break;
		default:
			numTab(5);
			break;
	}
}

function loadEquipment(oldEquipment){
	//Now with 100% less save breaking on balance tweaks! Flexibility ftw.
	var newEquipment = game.equipment;
	for (var item in oldEquipment){
		//Name changes would go here, I suppose

		if (typeof newEquipment[item] === 'undefined') continue;
		var oldEquip = oldEquipment[item];
		var newEquip = newEquipment[item];
		newEquip.locked = oldEquip.locked;
		newEquip.modifier = oldEquip.modifier;
		newEquip.level = oldEquip.level;
		newEquip.prestige = oldEquip.prestige;
		var stat;
		if (oldEquip.blockNow){
			stat = "block";
			newEquip.blockNow = true;
			newEquip.tooltip = newEquip.blocktip;
		}
		else stat = (typeof newEquip.health !== 'undefined') ? "health" : "attack";

		if (newEquip.prestige > 1) prestigeEquipment(item, newEquip.prestige);

		if (typeof oldEquip[stat + "Calculated"] === 'undefined') oldEquip[stat + "Calculated"] = oldEquip[stat];
		if (newEquip[stat + "Calculated"] != oldEquip[stat + "Calculated"]){
			var dif = newEquip[stat + "Calculated"] - oldEquip[stat + "Calculated"];
			//Leaving the debug stuff for this just in case. This function could be nasty if stuff goes wrong.
/*			console.log("Equipment: " + item + ". Updated from:");
			console.log(oldEquip);
			console.log("Updated to: ");
			console.log(newEquip);
			console.log("dif is " + dif); */
			game.global[stat] += dif * newEquip.level;
		}
	}
}


function getCurrentMapObject() {
    return game.global.mapsOwnedArray[getMapIndex(game.global.currentMapId)];
}

function scaleLootLevel(level, mapLevel) {
    var world = game.global.world;
    if (mapLevel > 0) world = mapLevel;
    level += ((world - 1) * 100);
    return level;
}

function rewardResource(what, baseAmt, level, checkMapLootScale, givePercentage){
    var map;
	var world;
	var cell = level;
    if (checkMapLootScale) {
        map = getCurrentMapObject();
        level = scaleLootLevel(level, map.level);
		world = map.level;
    } else {
        level = scaleLootLevel(level);
		world = game.global.world;
    }
	var amt = 0;
	if (what == "food" || what == "metal" || what == "wood"){
		//Base * speed books
		var maxSpeedBookLevel = (game.global.universe == 2 || (game.global.universe == 1 && game.global.world <= 59)) ? game.global.world : 59;
		var tempModifier = 0.5 * Math.pow(1.25, maxSpeedBookLevel);
		//Mega books
		if (game.global.world >= 60 && game.global.universe == 1) {
			if (game.global.frugalDone) tempModifier *= Math.pow(1.6, game.global.world - 59);
			else tempModifier *= Math.pow(1.5, game.global.world - 59);
		}
		//Bounty
		if (game.global.world >= 15) tempModifier *= 2;
		//Whipimp
		if (game.unlocks.impCount.Whipimp) tempModifier *= Math.pow(1.003, game.unlocks.impCount.Whipimp);
		if ((game.talents.turkimp2.purchased || game.global.turkimpTimer > 0) && (game.global.playerGathering == "food" || game.global.playerGathering == "metal" || game.global.playerGathering == "wood")) tempModifier *= (game.talents.turkimp2.purchased) ? ((game.talents.turkimp2.purchased) ? 1.333 : 1.249) : 1.166;
		//Half of max can work, a little less than third on average are applied to one of these 3 jobs. 0.16 is pretty average.
		var avgSec = tempModifier * (game.resources.trimps.realMax() * 0.16);
		//Base is 7 seconds at 1 baseAmt
		if (game.global.world < 100)
			amt = avgSec * 7 * baseAmt;
		else
			amt = avgSec * 10 * baseAmt;
	}
	else if (what == "fragments"){
		if (game.options.menu.useAverages.enabled && document.getElementById("fragmentsPs").style.opacity == 0) fadeIn("fragmentsPs", 10);
		amt = Math.floor(Math.pow(1.15, game.global.world) * game.global.world * game.global.world * 0.02);
		if (baseAmt > 1) {
			amt *= baseAmt;
		}
	}
	else{
		if (what == "helium") level = Math.round((level - 1900) / 100);
		else if (what == "gems"){
			level = level - 400;
			//Adding 3 seconds worth of dragimp production on top of normal gem resource gains
			amt = game.jobs.Dragimp.modifier * 3 * baseAmt;
		}
		level *= 1.35;
		if (level < 0) level = 0;
		amt += baseAmt * Math.pow(1.23, Math.sqrt(level));
		amt += baseAmt * level;
	}
	//Scale 20% across the Zone, depending on cell number
	if (what != "helium" && what != "fragments"){
		amt = (amt * .8) + ((amt * .002) * (cell + 1));
	}
	if (checkMapLootScale){
		var compare = game.global.world;
		if (world > compare && map.location != "Bionic"){
			amt *= Math.pow(1.1, (world - compare));
		}
		else {
			if (game.talents.mapLoot.purchased)
				compare--;
			if (world < compare){
				//-20% loot compounding for each level below world
				amt *= Math.pow(0.8, (compare - world));
			}
		}
		//Add map loot bonus
		amt = Math.round(amt * map.loot);

	}
	//Add Looting
	
	if (getPerkLevel("Looting")) amt += (amt * getPerkLevel("Looting") * game.portal.Looting.modifier);
	if (getPerkLevel("Looting_II")) amt *= (1 + (getPerkLevel("Looting_II") * game.portal.Looting_II.modifier));
	if (what == "helium") amt *= alchObj.getRadonMult();
	if (what != "fragments" && what != "helium"){
		if (game.global.challengeActive == "Alchemy") amt *= alchObj.getPotionEffect("Potion of Finding");
		amt *= alchObj.getPotionEffect("Elixir of Finding");
	}
	if (getPerkLevel("Greed") || getPerkLevel("Masterfulness")) amt *= game.portal.Greed.getMult();
	if (game.global.challengeActive == "Quagmire") amt *= game.challenges.Quagmire.getLootMult();
	if (Fluffy.isRewardActive("wealthy") && what != "helium") amt *= 2;
	var spireRowBonus = (game.talents.stillRowing.purchased) ? 0.03 : 0.02;
	if (game.global.spireRows > 0) amt *= 1 + (game.global.spireRows * spireRowBonus);
	if (game.global.totalSquaredReward > 0 && what == "helium") amt *= ((game.global.totalSquaredReward / 1000) + 1);
	if (game.unlocks.impCount.Magnimp && what != "helium") amt *= Math.pow(1.003, game.unlocks.impCount.Magnimp);
	if (game.global.mayhemCompletions > 0 && what == "helium") amt *= game.challenges.Mayhem.getTrimpMult();
	if (autoBattle.bonuses.Radon.level > 0 && game.global.universe == 2 && what == "helium") amt *= autoBattle.bonuses.Radon.getMult();
	if (game.global.pandCompletions > 0 && what == "helium") amt *= game.challenges.Pandemonium.getTrimpMult();
	if (game.global.desoCompletions > 0 && what == "helium") amt *= game.challenges.Desolation.getTrimpMult();
	if (game.global.frigidCompletions > 0 && game.global.universe == 1 && what == "helium") amt *= game.challenges.Frigid.getTrimpMult();
	if (game.global.challengeActive == "Archaeology" && what != "helium" && what != "fragments"){
		amt *= game.challenges.Archaeology.getStatMult("science");
	}
	if (game.global.challengeActive == "Archaeology" && what == "helium"){
		amt *= game.challenges.Archaeology.getStatMult("radon");
	}
	if (game.global.challengeActive == "Insanity" && what != "fragments"){
		amt *= game.challenges.Insanity.getLootMult();
	}
	if (game.global.challengeActive == "Desolation" && what != "fragments" && what != "helium") amt *= game.challenges.Desolation.trimpResourceMult();
	if (game.challenges.Nurture.boostsActive() && what != "fragments" && what != "helium") amt *= game.challenges.Nurture.getResourceBoost();
	if (game.global.challengeActive == "Nurture" && what == "helium"){
		amt *= game.challenges.Nurture.getRadonMult();
	}
	if (game.global.challengeActive == "Hypothermia" && what == "helium"){
		amt *= game.challenges.Hypothermia.getRadonMult();
	}
	if (game.global.challengeActive == "Hypothermia" && what == "wood"){
		amt *= game.challenges.Hypothermia.getWoodMult();
	}
	if (challengeActive("Toxicity")){
		var toxMult = (game.challenges.Toxicity.lootMult * game.challenges.Toxicity.stacks) / 100;
		amt *= (1 + toxMult);
	}
	if (what != "helium") {
		if (game.global.universe == 2 && u2Mutations.tree.Loot.purchased){
			amt *= 1.5;
		}
		if (game.global.challengeActive == "Decay" || game.global.challengeActive == "Melt"){
			var challenge = game.challenges[game.global.challengeActive];
			amt *= 10;
			amt *= Math.pow(challenge.decayValue, challenge.stacks);
		}
		amt = calcHeirloomBonus("Staff", what + "Drop", amt);
		if (isScryerBonusActive()) amt *= 2;
		if (game.global.challengeActive == "Daily"){
			if (typeof game.global.dailyChallenge.famine !== 'undefined' && what != "fragments"){
				amt *= dailyModifiers.famine.getMult(game.global.dailyChallenge.famine.strength);
			}
			if (typeof game.global.dailyChallenge.karma !== 'undefined'){
				amt *= dailyModifiers.karma.getMult(game.global.dailyChallenge.karma.strength, game.global.dailyChallenge.karma.stacks);
			}
		}
	}
	if (challengeActive("Watch") && what != "helium") amt /= 2;
	if (challengeActive("Lead") && ((game.global.world % 2) == 1)) amt *= 2;
	if (getEmpowerment() == "Wind"){
		if (what == "helium"){
			if (!game.global.mapsActive){
				amt *= (1 + game.empowerments.Wind.getCombatModifier(true));
			}
		}
		else if (what != "fragments")
			amt *= (1 + (game.empowerments.Wind.getCombatModifier()));
	}
	if (what != "helium" && what != "fragments" && getUberEmpowerment() == "Wind"){
		amt *= 10;
	}
	if (what == "helium"){
		if (game.singleRunBonuses.heliumy.owned) amt *= 1.25;
		if (getSLevel() >= 5) amt *= Math.pow(1.005, game.global.world);
		if (game.goldenUpgrades.Helium.currentBonus > 0) amt *= 1 + game.goldenUpgrades.Helium.currentBonus;
		if (playerSpireTraps.Condenser.owned) amt *= (1 + (playerSpireTraps.Condenser.getWorldBonus() / 100));
		if (game.global.challengeActive == "Quest" && game.challenges.Quest.questComplete) amt *= 2;
		var fluffyBonus = Fluffy.isRewardActive("helium");
		amt += (amt * (fluffyBonus * 0.25));
		if (Fluffy.isRewardActive("radortle")){
			amt *= Fluffy.getRadortleMult();
		}
		if (game.jobs.Meteorologist.vestedHires > 0) amt *= game.jobs.Meteorologist.getMult();
		if (game.global.universe == 2 && game.global.glassDone && game.global.world > 175){
			var useGlassWorld = (game.global.world > 400) ? 400 : game.global.world;
			var glassMult = Math.pow(1.1, useGlassWorld - 175);
			amt *= glassMult;
		}
		if (game.global.universe == 2 && game.global.world >= 201){
			amt *= 400;
			if (u2Mutations.tree.AllRadon.purchased) amt *= 1.5;
		}
		amt *= u2SpireBonuses.basics();
	}
	if (givePercentage > 0) amt *= givePercentage;
	amt = Math.floor(amt);
	if (what == "helium"){
		addHelium(amt);
	}
	else
		addResCheckMax(what, amt);
	if (game.options.menu.useAverages.enabled){
		addAvg(what, amt);
	}
    return amt;
};

function isScryerBonusActive(){
	if (game.global.formation != 4 && game.global.formation != 5) return false;
	if (game.global.mapsActive && game.global.waitToScryMaps) return false;
	if (!game.global.mapsActive && game.global.waitToScry) return false;
	return true;
}

function addHelium(amt){
	if (game.global.challengeActive) distributeToChallenges(amt);
	if (game.global.universe == 2){
		game.resources.radon.owned += amt;
		game.global.totalRadonEarned += amt;
	}
	else{
		game.resources.helium.owned += amt;
		game.global.totalHeliumEarned += amt;
	}
	if (portalWindowOpen && game.global.universe == portalUniverse){
		var heElem = document.getElementById('portalHelium');
		game.resources.helium.respecMax += amt;
		game.global.tempHighHelium += amt;
		var resName = (game.global.universe == 2) ? "Radon" : "Helium";
		if (heElem != null) heElem.innerHTML = '<span id="portalHeliumOwned">' + prettify(game.resources.helium.respecMax - game.resources.helium.totalSpentTemp) + '</span> ' + resName;
	}
	if (game.global.universe == 2) checkAchieve("totalRadon");
	else checkAchieve("totalHelium");
}

function addResCheckMax(what, number, noStat, fromGather, nonFilteredLoot, transmuteReward) {
	if (game.global.challengeActive == "Transmute" && what == "metal" && !transmuteReward){
		return;
	}
	var res = game.resources[what];
	if (nonFilteredLoot && game.options.menu.useAverages.enabled){
		addAvg(what, number);
	}
	if (res.max == -1) {
		res.owned += number;
		if (!noStat && what == "gems") game.stats.gemsCollected.value += number;
		return;
	}
	if (!noStat && what == "food") game.global.zoneRes[0] += number;
	var newMax = getMaxForResource(what);
    if (res.owned + number <= newMax) res.owned += number;
    else {
		if (game.global.autoStorage && game.global.improvedAutoStorage && (what == "food" || what == "wood" || what == "metal")){
			var storage = (what == "food") ? "Barn" : (what == "wood") ? "Shed" : (what == "metal") ? "Forge" : "";
			res.owned += number;
			while (res.owned > newMax){
				if (!buyBuilding(storage, true, true, 1))
					break;
				newMax *= 2;
			}
		}
		else
			res.owned = newMax;
	}
}

function getMaxForResource(what){
	var res = game.resources[what];
	if (!res.max) return 0;
	var newMax = res.max + (res.max * game.portal.Packrat.modifier * getPerkLevel("Packrat"));
	newMax = calcHeirloomBonus("Shield", "storageSize", newMax);
	return newMax;
}

// Exponentially weighted moving average is less jumpy than a normal
// moving average, so we can include jestimps.
// https://en.wikipedia.org/wiki/Moving_average
//
// Averaging smoothness is controlled by `game.settings.ewma_alpha`,
// which should be between 0 and 1 (exclusive). Lower values provide
// more smoothness, higher values have less lag. Default value of 0.05
//
// The time between average updates is now controlled by
// `game.settings.ewma_ticks`, which is the number of ticks between
// updates. The default value is 10, i.e. every 1 second.

function addAvg(what, number) {
	if (game.global.challengeActive == "Transmute" && what == "metal") return;
	var avgA = game.global.lootAvgs[what];
	if (typeof avgA === 'undefined') return;
	avgA.accumulator += number;
}

function getAvgLootSecond(what) {
	var avgA = game.global.lootAvgs[what];
	if (typeof avgA === 'undefined') return 0;
	return (avgA.average > 0.01) ? avgA.average : 0;
}

function curateAvgs() {
	for (var what in game.global.lootAvgs) {
            if (typeof game.global.lootAvgs[what] !== 'object') continue;
            var avgA = game.global.lootAvgs[what];
            avgA.average = avgA.average * (1 - game.settings.ewma_alpha)
                         + avgA.accumulator
                           * game.settings.ewma_alpha
                           / game.settings.ewma_ticks
                           * game.settings.speed;
            avgA.accumulator = 0;
	}
}

function fireMode(noChange) {
    if (!noChange) game.global.firing = !game.global.firing;
    var elem = document.getElementById("fireBtn");
    if (game.global.firing) {
        elem.className = elem.className.replace("fireBtnNotFiring", "fireBtnFiring");
        elem.innerHTML = "Firing";
    } else {
        elem.className = elem.className.replace("fireBtnFiring", "fireBtnNotFiring");
        elem.innerHTML = "Fire";
    }
    if (!noChange && !game.global.lockTooltip)
		 tooltip("Fire Trimps", null, "update");
}

function setGather(what, updateOnly) {
	if (what == "science" && game.global.challengeActive == "Scientist") return;
	if (what == "metal" && game.global.challengeActive == "Transmute") return;
	if (game.options.menu.pauseGame.enabled && !updateOnly) return;
    var toGather = game.resources[what];
    var colorOn = "workColorOn";
	var btnText = "";
	var collectBtn;
	if ((game.talents.turkimp2.purchased || game.global.turkimpTimer > 0) && (what == "food" || what == "wood" || what == "metal")){
		colorOn = "workColorTurkimp";
		btnText = "<span class='icomoon icon-spoon-knife'></span>";
	}
    if (typeof toGather === 'undefined' && what != "buildings") return;
	var toUpdate = (updateOnly) ? what : game.global.playerGathering;
    if (toUpdate !== "") {
		collectBtn = document.getElementById(toUpdate + "CollectBtn");
        collectBtn.innerHTML = setGatherTextAs(toUpdate, false);
        swapClass("workColor", "workColorOff", collectBtn);
    }
    if (updateOnly) return;
	game.global.playerGathering = what;
	updateBuildSpeed();
	collectBtn = document.getElementById(what + "CollectBtn");
    collectBtn.innerHTML = btnText + setGatherTextAs(what, true);
    swapClass("workColor", colorOn, collectBtn);
}

function updateBuildSpeed(){
	var modifier = (game.global.autoCraftModifier > 0) ? game.global.autoCraftModifier : 0;
    if (game.global.playerGathering == "buildings") modifier += getPlayerModifier();
	document.getElementById("buildSpeed").innerHTML = (modifier > 0) ? prettify(Math.floor(modifier * 100)) + "%" : "";
}

function setGatherTextAs(what, on) {
	if (what == "science") game.global.researched = true;
    var trimpTrapText = '(<span id="trimpTrapText">' + prettify(game.buildings.Trap.owned) + '</span>)';
    switch (what) {
    case "food":
        return (on) ? "Gathering" : "Gather";
    case "wood":
        return (on) ? "Chopping" : "Chop";
    case "metal":
        return (on) ? "Mining" : "Mine";
    case "science":
        return (on) ? "Researching" : "Research";
    case "buildings":
        return (on) ? "Building" : "Build";
    case "trimps":
        return (on) ? ("Trapping " + trimpTrapText) : ("Check Traps " + trimpTrapText);
    }
}

function gather() {
	const what = game.global.playerGathering;

	if (game.talents.turkimp2.purchased || game.global.turkimpTimer > 0) {
		updateTurkimpTime();
	}

	let baseValue = 1;
	if (getPerkLevel('Motivation') > 0) baseValue += baseValue * getPerkLevel('Motivation') * game.portal.Motivation.modifier;
	if (challengeActive('Daily') && typeof game.global.dailyChallenge.dedication !== 'undefined') baseValue *= dailyModifiers.dedication.getMult(game.global.dailyChallenge.dedication.strength);

	if (game.global.universe === 1) {
		if (getPerkLevel('Meditation') > 0) baseValue *= 1 + game.portal.Meditation.getBonusPercent() * 0.01;
		if (challengeActive('Balance')) baseValue *= game.challenges.Balance.getGatherMult();
		if (challengeActive('Meditate')) baseValue *= 1.25;
		if (challengeActive('Toxicity')) baseValue *= 1 + (game.challenges.Toxicity.lootMult * game.challenges.Toxicity.stacks) / 100;
		if (challengeActive('Watch')) baseValue /= 2;
		if (challengeActive('Lead') && game.global.world % 2 === 1) baseValue *= 2;
		if (getPerkLevel('Motivation_II') > 0) baseValue *= 1 + getPerkLevel('Motivation_II') * game.portal.Motivation_II.modifier;
		if (challengeActive('Frigid')) baseValue *= game.challenges.Frigid.getShatteredMult();
	}

	if (game.global.universe === 2) {
		if (game.portal.Observation.trinkets > 0) baseValue *= game.portal.Observation.getMult();
		if (Fluffy.isRewardActive('gatherer')) baseValue *= 2;
		if (challengeActive('Downsize')) baseValue *= 5;
		if (challengeActive('Unbalance')) baseValue *= game.challenges.Unbalance.getGatherMult();
		if (game.challenges.Nurture.boostsActive()) baseValue *= game.challenges.Nurture.getResourceBoost();
	}

	if (challengeActive('Decay') || challengeActive('Melt')) {
		const challenge = game.challenges[game.global.challengeActive];
		baseValue *= 10;
		baseValue *= Math.pow(challenge.decayValue, challenge.stacks);
	}

	/* this variable gets used when game.jobs[job].increase !== 'fragments' */
	let noFragments = baseValue;
	if (game.global.pandCompletions) noFragments *= game.challenges.Pandemonium.getTrimpMult();
	if (game.global.desoCompletions) noFragments *= game.challenges.Desolation.getTrimpMult();

	if (game.global.universe === 1) {
		if (getEmpowerment() === 'Wind') noFragments *= 1 + game.empowerments.Wind.getCombatModifier();
	}

	if (game.global.universe === 2) {
		if (challengeActive('Archaeology')) noFragments *= game.challenges.Archaeology.getStatMult('science');
		if (challengeActive('Insanity')) noFragments *= game.challenges.Insanity.getLootMult();
		if (challengeActive('Desolation')) noFragments *= game.challenges.Desolation.trimpResourceMult();
	}

	const multiTaskingMult = game.permaBoneBonuses.multitasking.owned > 0 && game.resources.trimps.owned >= game.resources.trimps.realMax() ? game.permaBoneBonuses.multitasking.mult() : 0;
	const playerModifier = getPlayerModifier();
	const parityBonus = getParityBonus();

	for (let job in game.jobs) {
		let perSec = 0;
		let increase = game.jobs[job].increase;
		if (increase === 'custom') continue;
		if (game.jobs[job].owned > 0) {
			perSec = increase !== 'fragments' ? noFragments : baseValue;
			perSec *= game.jobs[job].owned * game.jobs[job].modifier;
			if (increase !== 'gems') perSec *= 1 + multiTaskingMult;
			if (increase === 'food' || increase === 'metal' || increase === 'wood') perSec *= parityBonus;

			if (game.global.universe === 1) {
				if (game.jobs.Magmamancer.owned > 0 && increase === 'metal') perSec *= game.jobs.Magmamancer.getBonusPercent();
			}

			if (game.global.universe === 2) {
				if (increase !== 'fragments' && increase !== 'science') {
					if (challengeActive('Alchemy')) perSec *= alchObj.getPotionEffect('Potion of Finding');
					perSec *= alchObj.getPotionEffect('Elixir of Finding');
				}
				if (((increase === 'food' || increase === 'wood') && game.buildings.Antenna.owned >= 5) || (increase === 'metal' && game.buildings.Antenna.owned >= 15)) perSec *= game.jobs.Meteorologist.getExtraMult();
				
				if (challengeActive('Hypothermia') && increase === 'wood') perSec *= game.challenges.Hypothermia.getWoodMult(true);
				if (autoBattle.oneTimers.Gathermate.owned && (increase === 'food' || increase === 'metal' || increase === 'wood')) perSec *= autoBattle.oneTimers.Gathermate.getMult();
			}

			if (challengeActive('Daily')) {
				if (typeof game.global.dailyChallenge.famine !== 'undefined' && increase !== 'fragments' && increase !== 'science') perSec *= dailyModifiers.famine.getMult(game.global.dailyChallenge.famine.strength);
			}

			perSec = calcHeirloomBonus('Staff', job + 'Speed', perSec);
		}

		if (what && increase === what) {
			if ((game.talents.turkimp2.purchased || game.global.turkimpTimer > 0) && (what === 'food' || what === 'wood' || what === 'metal')) {
				const tBonus = game.talents.turkimp2.purchased ? 2 : 1.5;
				perSec *= tBonus;
			}
			perSec += playerModifier;
		}

		let amount = perSec / game.settings.speed;
		if (game.options.menu.useAverages.enabled) perSec += getAvgLootSecond(increase);
		addResCheckMax(increase, amount, null, true);

		if (usingRealTimeOffline) continue;
		if (game.resources[increase].max > 0) {
			const timeToFillElem = document.getElementById(increase + 'TimeToFill');
			const timeToMax = calculateTimeToMax(game.resources[increase], perSec, null, true);
			if (timeToFillElem && timeToFillElem.innerHTML !== timeToMax) timeToFillElem.textContent = timeToMax;
		}
	}

	if (challengeActive('Quest') && game.challenges.Quest.questId < 2) game.challenges.Quest.checkQuest();
	if (what === 'trimps') trapThings();
}

function getPlayerModifier(){
	var playerModifier = game.global.playerModifier;
	return calcHeirloomBonus("Shield", "playerEfficiency", playerModifier);
}

function calculateTimeToMax(resource, perSec, toNumber, fromGather) {
	if (perSec <= 0) return "";
	var remaining = (toNumber != null) ? toNumber : calcHeirloomBonus("Shield", "storageSize", ((resource.max * (1 + game.portal.Packrat.modifier * getPerkLevel("Packrat"))))) - resource.owned;
	if (remaining <= 0) return "";
	var toFill = Math.floor(remaining / perSec);
	var years = Math.floor(toFill / 31536000);
	var days = Math.floor(toFill / 86400) % 365;
	var hours = Math.floor( toFill / 3600) % 24;
	var minutes = Math.floor(toFill / 60) % 60;
	var seconds = (toFill % 60) + 1;
	if (seconds == 60){
		minutes++;
		seconds = 0;
		toFill++;
	}
	if (minutes == 60 && hours == 0){
		hours = 1;
		minutes = 0;
		toFill++;
	}
	if (!isFinite(years)) return "Long Time";
	if (toFill < 60) {
		if (toFill < 1 && fromGather) return "";
		return Math.floor(seconds) + " Sec" + ((Math.floor(seconds) == 1) ? "" : "s");
	}
	if (toFill < 3600) return minutes + " Min" + ((minutes == 1) ? "" : "s") + " " + seconds + " Sec" + ((seconds == 1) ? "" : "s");
	if (toFill < 86400) return hours + " Hour" + ((hours == 1) ? "" : "s") + " " + minutes + " Min" + ((minutes == 1) ? "" : "s");
	if (toFill < 31536000) return days + " Day" + ((days == 1) ? "" : "s") + " " + hours + " Hour" + ((hours == 1) ? "" : "s");
	return prettify(years) + " Year" + ((years == 1) ? "" : "s") + " " + days + " Day" + ((days == 1) ? "" : "s");
}

function checkTriggers(force) {
    for (var item in game.triggers) {
        var trigger = game.triggers[item];
        if (force) {
            if ((trigger.done == 1) && (typeof trigger.once === 'undefined')) trigger.fire();
            else if (typeof trigger.once == 'function' && trigger.done == 1) {
                trigger.once();
            }
            continue;
        }
        if (trigger.done === 0 && canAffordTwoLevel(game.triggers[item])) {
            trigger.fire();
            trigger.done = 1;
			if (typeof trigger.message == 'function') message(trigger.message(), "Story");
            else if (typeof trigger.message !== 'undefined') message(trigger.message, "Story");
        }
    }
}

function canAffordTwoLevel(whatObj, takeEm) {
	if (whatObj.specialFilter && !whatObj.specialFilter()) return false;
	if (whatObj.prestiges && game.equipment[whatObj.prestiges].locked) return false;
    for (var costGroup in whatObj.cost) {
        if (costGroup == "special") {
            var toReturn = whatObj.cost.special();
            return toReturn;
        }
        var group = game[costGroup];
        var whatObjCost = whatObj.cost[costGroup];
        for (var res in whatObjCost) {
			if (typeof group === 'undefined') return false;
            var cost = whatObjCost[res];
            if (typeof cost === 'function') cost = cost();
            if (typeof cost[1] !== 'undefined') cost = resolvePow(cost, whatObj);
			var artMult = getEquipPriceMult();
			if (whatObj.prestiges && (res == "metal" || res == "wood")) cost *= artMult;
            if (group[res].owned < cost) return false;
            if (takeEm) group[res].owned -= cost;
        }
    }
    return true;
}

function resolvePow(cost, whatObj, addOwned) {
	if (!addOwned) addOwned = 0;
    var compare;
    if (typeof whatObj.done !== 'undefined') compare = 'done';
    if (typeof whatObj.level !== 'undefined') compare = 'level';
    if (typeof whatObj.owned !== 'undefined') compare = 'owned';
	if (typeof whatObj.purchased !== 'undefined') compare = 'purchased';
    return (Math.floor(cost[0] * Math.pow(cost[1], (whatObj[compare] + addOwned))));
}

function getEquipPriceMult(){
	var artMult = Math.pow(1 - game.portal.Artisanistry.modifier, getPerkLevel("Artisanistry"));
	if (game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.metallicThumb !== 'undefined'){
		artMult *= dailyModifiers.metallicThumb.getMult(game.global.dailyChallenge.metallicThumb.strength);
	}
	if (autoBattle.oneTimers.Artisan.owned && game.global.universe == 2){
		var mod = autoBattle.oneTimers.Artisan.getMult();
		artMult *= mod;
	}
	if (game.global.challengeActive == "Obliterated"){
		artMult *= 1e12;
	}
	if (game.global.challengeActive == "Eradicated"){
		var mod = game.challenges.Eradicated.scaleModifier
		artMult *= mod;
	}
	if (game.global.challengeActive == "Pandemonium"){
		var mod = game.challenges.Pandemonium.getEnemyMult();
		artMult *= mod;
	}
	return artMult;
}

function getEquipResPerStat(what, buyAmt){
	var artMult = getEquipPriceMult();
	var equip = game.equipment[what];
	var pricePerStat = 0;
	if (what == "Shield"){
		var shieldCost = getBuildingItemPrice(equip, "wood", true, buyAmt) * artMult;
		if (equip.blockNow){
			pricePerStat = (shieldCost / (equip.blockCalculated * buyAmt));
		}
		else pricePerStat = (shieldCost / (equip.healthCalculated * buyAmt));
	}
	else if (equip.attack) pricePerStat = (getBuildingItemPrice(equip, "metal", true, buyAmt) * artMult) / (equip.attackCalculated * buyAmt);
	else if (equip.health) pricePerStat = (getBuildingItemPrice(equip, "metal", true, buyAmt) * artMult) / (equip.healthCalculated * buyAmt);
	return pricePerStat;
}

//Now with equipment! buyAmt
function canAffordBuilding(what, take, buildCostString, isEquipment, updatingLabel, forceAmt, autoPerc){
	if (what == "Hub") return;
	var costString = "";
	var toBuy;
	if (!isEquipment) toBuy = game.buildings[what];
	else toBuy = game.equipment[what];
	var purchaseAmt = 1;
	if (forceAmt) purchaseAmt = forceAmt;
	else {
		if (game.global.buyAmt == "Max"){
			if (!updatingLabel) purchaseAmt = calculateMaxAfford(toBuy, !isEquipment, isEquipment);
		}
		else purchaseAmt = game.global.buyAmt;
	}
	if (typeof toBuy === 'undefined') return false;
	if (what == "Antenna"){
		purchaseAmt = 1;
		var canBuyAntenna = (game.buildings.Antenna.purchased + 1) <= Math.floor((game.global.highestRadonLevelCleared - 100) / 5);
		if (!buildCostString && !canBuyAntenna) return false;
		costString += "<span class='color: " + ((canBuyAntenna) ? "green" : "red") + "'>Complete Z" + (100 + (5 * (game.buildings.Antenna.purchased + 1))) + "</span>, "
	}
	for (var costItem in toBuy.cost) {
		var color = "green";
		var price = 0;
		price = parseFloat(getBuildingItemPrice(toBuy, costItem, isEquipment, purchaseAmt));
		if (isEquipment){
			var artMult = getEquipPriceMult();
			price = Math.ceil(price * artMult);
		}
		else if (getPerkLevel("Resourceful")) price = Math.ceil(price * (Math.pow(1 - game.portal.Resourceful.modifier, getPerkLevel("Resourceful"))));
		if (autoPerc > 0){
			if (price > game.resources[costItem].owned * (autoPerc / 100))
				return false;
			continue;
		}
		else if (price > game.resources[costItem].owned || !(isFinite(price))) {
			if (buildCostString) color = "red";
			else return false;
		}
		if (buildCostString) {
			var percent;
			if (color == "red"){
				if ((costItem == "food" || costItem == "wood" || costItem == "metal") && price > getMaxForResource(costItem))
					color = "orange";
				var thisPs = getPsString(costItem, true);
				if (thisPs > 0)
				{
					percent = calculateTimeToMax(null, thisPs, (price - game.resources[costItem].owned));
					percent = "(" + percent + ")";
				}
				else percent = "(<span class='icomoon icon-infinity'></span>)";
			}
			else{
				percent = (game.resources[costItem].owned > 0) ? prettify(((price / game.resources[costItem].owned) * 100).toFixed(1)) : 0;
				percent = "(" + percent + "%)";
			}
			costString += '<span class="' + color + '">' + costItem + ':&nbsp;' + prettify(price) + '&nbsp;' + percent + '</span>, ';
		}
		if (take) game.resources[costItem].owned -= price;
	}
	if (buildCostString) {
		costString = costString.slice(0, -2);
		return costString;
	}
	return true;
}

function getBuildingItemPrice(toBuy, costItem, isEquipment, purchaseAmt){
	var price = 0;
	var compare = (isEquipment) ? "level" : "purchased";
	var thisCost = toBuy.cost[costItem];
		if (typeof thisCost[1] !== 'undefined'){
			price =  Math.floor((thisCost[0] * Math.pow(thisCost[1], toBuy[compare])) * ((Math.pow(thisCost[1], purchaseAmt) - 1) / (thisCost[1] - 1)));
		}
		else if (typeof thisCost === 'function') {
			price = thisCost();
		}
		else {
			price = thisCost * purchaseAmt;
		}
	return price;
}

function buyBuilding(what, confirmed, fromAuto, forceAmt) {
	if (game.options.menu.pauseGame.enabled || what === 'Hub' || game.global.clearingBuildingQueue) return false;
	if (!forceAmt && !confirmed && game.options.menu.lockOnUnlock.enabled === 1 && !usingRealTimeOffline && new Date().getTime() - 1000 <= game.global.lastUnlock) return false;

	const toBuy = game.buildings[what];
	if (typeof toBuy === 'undefined') return false;

	let purchaseAmt = 1;
	if (what === 'Antenna') purchaseAmt = 1;
	else if (forceAmt) purchaseAmt = Math.min(forceAmt, calculateMaxAfford(toBuy, true, false, false, true));
	else if (!toBuy.percent) purchaseAmt = game.global.buyAmt === 'Max' ? calculateMaxAfford(toBuy, true, false) : game.global.buyAmt;
	purchaseAmt = Math.min(purchaseAmt, 1e10);

	const canAfford = forceAmt ? canAffordBuilding(what, false, false, false, false, purchaseAmt) : canAffordBuilding(what);
	if (purchaseAmt === 0 || !canAfford) return false;

	if (what === 'Wormhole' && !confirmed && game.options.menu.confirmhole.enabled && !fromAuto) {
		tooltip('Confirm Purchase', null, 'update', `You are about to purchase ${purchaseAmt} Wormholes, <b>which cost helium</b>. Make sure you can earn back what you spend!`, `buyBuilding('Wormhole', true, false, ${purchaseAmt})`);
		return false;
	}

	if (forceAmt) canAffordBuilding(what, true, false, false, false, purchaseAmt);
	else canAffordBuilding(what, true);
	game.buildings[what].purchased += purchaseAmt;

	if (getCraftTime(game.buildings[what]) === 0) buildBuilding(what, purchaseAmt);
	else startQueue(what, purchaseAmt);

	if (!fromAuto && !usingScreenReader) tooltip(what, 'buildings', 'update');
	return true;
}

function getCraftTime(buildingObj){
	var time = buildingObj.craftTime;
	if (time == 0 && game.options.menu.forceQueue.enabled == 1) {
		return buildingObj.origTime;
	}
	return time;
}

function refundQueueItem(what) {
	var name = what.split('.');
    var struct = game.buildings[name[0]];
	struct.purchased -= parseInt(name[1], 10);
    for (var costItem in struct.cost) {
		var thisCostItem = struct.cost[costItem];
		var refund = 0;
		if (typeof thisCostItem[1] !== 'undefined')
			refund =  Math.floor((thisCostItem[0] * Math.pow(thisCostItem[1], struct.purchased)) * ((Math.pow(thisCostItem[1], name[1]) - 1) / (thisCostItem[1] - 1)));
		else if (typeof struct.cost[costItem] === 'function') refund += struct.cost[costItem]();
		else
			refund = thisCostItem * name[1];
		if (getPerkLevel("Resourceful")) refund = Math.ceil(refund * (Math.pow(1 - game.portal.Resourceful.modifier, getPerkLevel("Resourceful"))));
		addResCheckMax(costItem, parseFloat(refund), true);
    }
}

function startQueue(what, count) {
    game.global.buildingsQueue.push(what + "." + (count));
    addQueueItem(what + "." + count);
}

function craftBuildings(makeUp) {
	const buildingsBar = document.getElementById('animationDiv');
	//if (!buildingsBar && !usingRealTimeOffline) return;
	if (!buildingsBar) return;

	const buildingsQueue = game.global.buildingsQueue;
	const timeRemaining = document.getElementById('queueTimeRemaining');
	const speedElem = document.getElementById('buildSpeed');

	if (game.global.crafting === '' && buildingsQueue.length > 0) {
		setNewCraftItem();
	}

	if ((game.global.autoCraftModifier <= 0 && game.global.playerGathering !== 'buildings') || game.global.crafting === '') {
		if (speedElem.innerHTML !== '') speedElem.innerHTML = '';
		return;
	}

	let modifier = game.global.autoCraftModifier > 0 ? game.global.autoCraftModifier : 0;
	if (game.global.playerGathering === 'buildings') modifier += getPlayerModifier();

	if (!makeUp) {
		let elemText = `${prettify(Math.floor(modifier * 100))}%`;
		if (speedElem.innerHTML !== elemText) speedElem.innerHTML = elemText;
		game.global.timeLeftOnCraft -= (1 / game.settings.speed) * modifier;
		const percent = 1 - game.global.timeLeftOnCraft / getCraftTime(game.buildings[game.global.crafting]);

		let timeLeft = (game.global.timeLeftOnCraft / modifier).toFixed(1);
		if (timeLeft < 0.1 || isNumberBad(timeLeft)) timeLeft = 0.1;
		elemText = ` - ${timeLeft} Seconds`;
		if (timeRemaining && timeRemaining.textContent !== elemText) timeRemaining.textContent = elemText;

		if (buildingsBar) buildingsBar.style.opacity = game.options.menu.queueAnimation.enabled ? percent : '0';
		if (game.global.timeLeftOnCraft > 0) return;
	}

	if (game.global.trapBuildToggled && game.global.trapBuildAllowed && buildingsQueue.length === 1 && buildingsQueue[0] === 'Trap.1') {
		buildBuilding(game.global.crafting);
		autoTrap();
		return;
	}

	removeQueueItem('first');

	if (game.global.buildingsQueue.length === 0) {
		checkEndOfQueue();
	} else {
		setNewCraftItem();
	}
}

function buildBuilding(what, amt = 1) {
	const building = game.buildings[what];
	if (building.owned === 0 && typeof building.first !== 'undefined') building.first();
	building.owned += amt;
	let toIncrease;
	checkAchieve('housing', what);

	const ownedElem = document.getElementById(what + 'Owned');
	if (ownedElem && !usingRealTimeOffline) ownedElem.innerHTML = building.owned;

	if (typeof building.increase !== 'undefined') {
		if (building.increase.what === 'trimps.max') {
			addMaxHousing(building.increase.by * amt, bwRewardUnlocked('AutoStructure'));
		} else {
			const buildingSplit = building.increase.what.split('.');
			if (buildingSplit[0] === 'global') toIncrease = game.global;
			else if (buildingSplit[0] === 'Dragimp') toIncrease = game.jobs.Dragimp;
			else toIncrease = game.resources[buildingSplit[0]];

			if (buildingSplit[2] === 'mult') toIncrease[buildingSplit[1]] = parseFloat(toIncrease[buildingSplit[1]]) * parseFloat(Math.pow(building.increase.by, amt)).toFixed(5);
			else toIncrease[buildingSplit[1]] += parseFloat(building.increase.by) * amt;
		}
	}

	if (typeof building.fire !== 'undefined') {
		for (let x = 0; x < amt; x++) {
			building.fire();
		}
	}

	if (what === 'Wormhole') {
		const [baseCost, costRatio] = building.cost.helium;
		let spent = Math.floor(baseCost * Math.pow(costRatio, building.owned - 1));
		if (getPerkLevel('Resourceful')) spent = Math.ceil(spent * Math.pow(1 - game.portal.Resourceful.modifier, getPerkLevel('Resourceful')));

		game.global.totalHeliumEarned -= parseFloat(spent);
		game.stats.spentOnWorms.value += parseFloat(spent);
		if (game.stats.spentOnWorms.value + game.stats.spentOnWorms.valueTotal > 250000) giveSingleAchieve('Holey');
	}

	numTab();

	if (!game.buildings.Hub.locked) {
		const hubbable = ['Hut', 'House', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Collector'];
		if (!hubbable.includes(what)) return;

		let hubAmt = 1;
		if (what === 'Collector' && autoBattle.oneTimers.Collectology.owned) {
			hubAmt = autoBattle.oneTimers.Collectology.getHubs();
		}
		buildBuilding('Hub', hubAmt * amt);
	}
}

function setNewCraftItem() {
    var queueItem = game.global.buildingsQueue[0].split('.')[0];
    game.global.crafting = queueItem;
    game.global.timeLeftOnCraft = getCraftTime(game.buildings[queueItem]);
	var elem = document.getElementById("queueItemsHere").firstChild;
	var timeLeft = (game.global.timeLeftOnCraft / (game.global.autoCraftModifier + getPlayerModifier())).toFixed(1);
	if (elem){
		var timeElem = document.getElementById("queueTimeRemaining");
		if (timeLeft < 0.1 || isNumberBad(timeLeft)) timeLeft = 0.1;
		if (!timeElem) elem.innerHTML += "<span id='queueTimeRemaining'> - " + timeLeft + " Seconds</span><div id='animationDiv'></div>";
		else timeElem.textContent = " - " + timeLeft + " Seconds";
	}
	if (elem && timeLeft <= 0.1) {timeLeft = 0.1; if (game.options.menu.queueAnimation.enabled) document.getElementById("animationDiv").style.opacity = '1'}
}

function calculatePercentageBuildingCost(what, resourceToCheck, costModifier, replaceMax){
	var struct = game.buildings[what];
	var res = game.resources[resourceToCheck];
	var dif = struct.purchased - struct.owned;
	var max = (replaceMax) ? replaceMax : res.max;
	return Math.floor(costModifier * max * Math.pow(struct.increase.by, dif));
}

function trapThings() {
    var trap = game.buildings.Trap;
    var trimps = game.resources.trimps;
	var trimpsMax = trimps.realMax();
	var TrapOwned = document.getElementById("TrapOwned");
    if (game.global.timeLeftOnTrap == -1) {
        if (trimps.owned < trimpsMax && trap.owned >= 1)
            game.global.timeLeftOnTrap = trimps.speed;
        else {
            document.getElementById("trappingBar").style.width = "0%";
            if (TrapOwned) TrapOwned.innerHTML = trap.owned;
            return;
        }
    }
    game.global.timeLeftOnTrap -= ((1 / game.settings.speed) * getPlayerModifier());
    if (game.global.timeLeftOnTrap <= 0 && trimps.owned < trimpsMax && trap.owned >= 1) {
		trap.owned--;
		var trapValue = 1;
		if (getPerkLevel("Bait") > 0) trapValue += (getPerkLevel("Bait") * game.portal.Bait.modifier);
		if (Fluffy.isRewardActive("trapper")) trapValue *= 10;
        trimps.owned += trapValue;		
		if (trimps.owned > trimpsMax) trimps.owned = trimpsMax;
        game.global.timeLeftOnTrap = -1;
		if (TrapOwned) TrapOwned.innerHTML = trap.owned;
		if (game.global.challengeActive == "Trappapalooza"){
			game.resources.food.owned *= 0.9;
			game.resources.wood.owned *= 0.9;
			game.resources.metal.owned *= 0.9;
			game.resources.science.owned *= 0.9;
			if (game.global.world >= 50) game.challenges.Trappapalooza.trappedAt50 = true;
		}
    }
    if (game.options.menu.progressBars.enabled) document.getElementById("trappingBar").style.width = (100 - ((game.global.timeLeftOnTrap / trimps.speed) * 100)) + "%";
}


function toggleAutoTooltipHelp(){
	var btnElem = document.getElementById('autoTooltipHelpBtn');
	var helpElem = document.getElementById('autoTooltipHelpDiv');
	if (!btnElem || !helpElem) return;
	if (helpElem.style.display == "block"){
		helpElem.style.display = "none";
		btnElem.innerHTML = "Help";
	}
	else {
		helpElem.style.display = "block";
		btnElem.innerHTML = "Hide Help";
	}
	verticalCenterTooltip();
}

var lastAutoJob = 0;
function buyAutoJobs(allowRatios){
	if (game.options.menu.pauseGame.enabled)
		return;
	var setting = getAutoJobsSetting();
	if (!setting.enabled || !bwRewardUnlocked("AutoJobs")) return;
	if (loops - lastAutoJob < 20) return;
	if (allowRatios) lastAutoJob = loops;
	var trimps = game.resources.trimps;
	var breedCount = (trimps.owned - trimps.employed > 2) ? Math.floor(trimps.owned - trimps.employed) : 0;
	var workspaces = game.workspaces;
	if (breedCount < workspaces) workspaces = Math.floor(breedCount * 0.1);
	//Non-ratio jobs
	var others = ["Trainer", "Explorer", "Magmamancer", "Meteorologist", "Worshipper"];
	for (var x = 0; x < others.length; x++){
		var thisSetting = setting[others[x]];
		if (!thisSetting || !thisSetting.enabled) continue;
		if (game.jobs[others[x]].max && game.jobs[others[x]].max <= game.jobs[others[x]].owned) continue;
		var item = others[x];
		if (game.jobs[item].locked) continue;
		autoBuyJob(item, false, thisSetting.value, thisSetting.buyMax);
	}
	//Ratio jobs
	if (!allowRatios || workspaces <= 0) return;
	var ratios = ["Farmer", "Lumberjack", "Miner", "Scientist"];
	var totalRatio = 0;
	//Check all settings and calculate total ratio
	for (var x = 0; x < ratios.length; x++){
		if (game.jobs[ratios[x]].locked) continue;
		var thisSetting = setting[ratios[x]];
		if (!thisSetting || !thisSetting.enabled) continue;
		if (ratios[x] == "Scientist" && thisSetting.buyMax && game.jobs.Scientist.owned >= thisSetting.buyMax) continue;
		totalRatio += thisSetting.ratio;
	}
	//Assign ratio jobs
	for (var x = 0; x < ratios.length; x++){
		var thisSetting = setting[ratios[x]];
		if (!thisSetting || !thisSetting.enabled) continue;
		var item = ratios[x];
		if (game.jobs[item].locked) continue;
		var toBuy = workspaces * (setting[item].ratio / totalRatio);
		if (isNumberBad(toBuy)) {
			console.log('wanted to buy ' + toBuy + ' ' + ratios[x] + 's.');
			continue;
		}
		var useMax = (ratios[x] == "Scientist" && thisSetting.buyMax) ? thisSetting.buyMax : false; 
		autoBuyJob(item, true, Math.floor(toBuy), useMax);
	}
	calculateParityBonus();
}

function autoBalanceJob(which){
	//Fired when miners and scientists are unlocked and maybe other places later, requires autoJobs
	var setting = getAutoJobsSetting();
	if (!setting || !setting.enabled || !bwRewardUnlocked("AutoJobs")) return;
	if (!setting[which] || !setting[which].enabled || !setting.Farmer || !setting.Farmer.enabled || setting.Farmer.ratio == 0) return;
	var want = game.jobs.Farmer.owned * (setting[which].ratio / setting.Farmer.ratio);
	want = Math.floor(want);
	if (setting.buyMax) want = Math.max(want, setting.buyMax);
	var trimps = game.resources.trimps;
	var breedCount = (trimps.owned - trimps.employed > 2) ? Math.floor(trimps.owned - trimps.employed) : 0;
	var workspaces = game.workspaces;
	if (breedCount < workspaces) workspaces = breedCount;
	if (workspaces < want) want = workspaces;
	autoBuyJob(which, true, want);
}

function autoBuyJob(what, isRatio, purchaseAmt, max){
	var owned = game.jobs[what].owned;
	var job = game.jobs[what];
	if (max && owned >= max) return;
	var buyAmt;
	buyAmt = (isRatio) ? purchaseAmt : calculateMaxAfford(job, false, false, true, false, purchaseAmt);
	if (buyAmt <= 0) return;
	var workspaces = game.workspaces;
	var checkAndFix = false;
	var fireAmt = 0;
	if (max && (owned + buyAmt > max)) buyAmt = max - owned;
	if (!isRatio && workspaces < buyAmt) {
		workspaces = game.workspaces;
		fireAmt = buyAmt - workspaces;
		// Check to see if there are enough workers to fire
		if (!((game.jobs.Miner.owned + game.jobs.Farmer.owned + game.jobs.Lumberjack.owned) < fireAmt)) {
			var freed = freeWorkspace(fireAmt);
			if (!freed) {
				return;
			}
			if (workspaces < buyAmt && freed){
				workspaces = buyAmt;
				checkAndFix = true;
			}	
		}
		else return;
	}
	for (var costItem in job.cost) {
        if (checkJobItem(what, true, costItem, null, buyAmt) !== true) return false;
    }
	job.owned += buyAmt;
	if (checkAndFix){
		workspaces = game.workspaces;
		if (workspaces < 0)
			freeWorkspace(Math.abs(workspaces));
	}
}

function fireTrimps(what, amt){
	if (isNumberBad(amt)) return;
	game.jobs[what].owned -= amt;
	game.stats.trimpsFired.value += amt;
	if (game.jobs[what].owned < 0) game.jobs[what].owned = 0;
	if (typeof game.jobs[what].afterFire !== 'undefined') game.jobs[what].afterFire();
	calculateParityBonus();
}

function buyJob(what, confirmed, noTip) {
	if (what == "Amalgamator") return;
	var checkAndFix = false;
	if (game.options.menu.pauseGame.enabled) return;
	if (game.global.challengeActive == "Scientist" && what == "Scientist") return;
	if (game.global.challengeActive == "Corrupted" && what == "Geneticist") game.challenges.Corrupted.hiredGenes = true;
	if (!confirmed && game.options.menu.lockOnUnlock.enabled == 1 && (new Date().getTime() - 1000 <= game.global.lastUnlock)) return;
	var purchaseAmt;
	if (game.global.firing){
		if (game.jobs[what].owned < 1) return;
		purchaseAmt = (game.global.buyAmt == "Max") ? calculateMaxAfford(game.jobs[what], false, false, true) : game.global.buyAmt;
		if (what == "Farmer" || what == "Lumberjack" || what == "Miner" || what == "Scientist" || what == "Geneticist")
			fireTrimps(what, purchaseAmt);
		else{
			var name = what + needAnS(purchaseAmt);
			tooltip("confirm", null, "update", "You are about to fire " + prettify(purchaseAmt) + " " + name + ", are you sure that's what you wanted to do?", "fireTrimps('" + what + "', " + purchaseAmt + ")", "Fire " + name, "Fire");
		}
		return;
	}
	var workspaces = game.workspaces;
	var firingForJobs = false;
	var fireAmt;
	if (game.options.menu.fireForJobs.enabled && game.jobs[what].allowAutoFire){
		purchaseAmt = (game.global.buyAmt == "Max") ? calculateMaxAfford(game.jobs[what], false, false, true) : game.global.buyAmt;
		if (workspaces < purchaseAmt) {
			workspaces = game.workspaces;
			fireAmt = purchaseAmt - workspaces;
			// Check to see if there are enough workers to fire
			if (!((game.jobs.Miner.owned + game.jobs.Farmer.owned + game.jobs.Lumberjack.owned) < fireAmt)) {
				firingForJobs = true;
			}
			// Fire later in case the purchase cannot be afforded
		}
	}


	// Don't explicitly check if workspaces <= 0, delegate that to canAffordJob
	// That way, firingForJobs is accounted for
	// canAffordJob will check workspaces <= 0 anyway

	if (!canAffordJob(what, false, workspaces, firingForJobs)) return;

	if (firingForJobs) {
		// Now that we know if can afford the purchase, we can fire workers

		var freed = freeWorkspace(fireAmt);
		if (!freed) {
			return;
		}

		if (workspaces < purchaseAmt && freed){
			workspaces = purchaseAmt;
			checkAndFix = true;
		}
	}
	var added = canAffordJob(what, true, workspaces);
	game.jobs[what].owned += added;


	if (!noTip && !usingScreenReader) tooltip(what, "jobs", "update");
	if (checkAndFix){
		workspaces = game.workspaces;
		if (workspaces < 0)
			freeWorkspace(Math.abs(workspaces));
	}
	calculateParityBonus();
}

function addGeneticist(amount){
	if (game.global.challengeActive == "Corrupted") game.challenges.Corrupted.hiredGenes = true;
	var workspaces = game.workspaces;
	var owned = game.resources.trimps.owned - game.resources.trimps.employed;
	if (owned < 1) return;
	if (owned < amount)
		amount = owned;
	if (workspaces <= 0) {
		if (!game.options.menu.gaFire.enabled) return;
		//try to free up a workspace if possible
		if (!freeWorkspace(amount)){
			amount = 1;
			if (!freeWorkspace(amount))
				return;
		}
	}
	var cost = game.jobs.Geneticist.cost.food;
	var price = Math.floor((cost[0] * Math.pow(cost[1], game.jobs.Geneticist.owned)) * ((Math.pow(cost[1], amount) - 1) / (cost[1] - 1)));
	if (game.resources.food.owned < price) {
		price = getNextGeneticistCost();
		if (game.resources.food.owned < price) return;
		amount = 1;
	}
	game.resources.food.owned -= price;
	game.jobs.Geneticist.owned += amount;
}

function removeGeneticist(amount){
	if (game.jobs.Geneticist.owned < amount) return;
	game.jobs.Geneticist.owned -= amount;
}

function getNextGeneticistCost(){
	var geneticist = game.jobs.Geneticist;
	return resolvePow(geneticist.cost.food, geneticist, 1);
}

function freeWorkspace(amount){
	if (!amount) amount = 1;
	var toCheck = [];
	if (game.jobs.Miner.owned >= amount) toCheck.push('Miner');
	if (game.jobs.Farmer.owned >= amount) toCheck.push('Farmer');
	if (game.jobs.Lumberjack.owned >= amount) toCheck.push('Lumberjack');
	if (toCheck.length == 0) return false;
	var selected = toCheck[Math.floor(Math.random() * toCheck.length)];
	game.jobs[selected].owned -= amount;
	return true;
}

function freeManyWorkspaces(amount){
	if (amount < 3) return freeWorkspace(amount);
	var toCheck = [];
	var rem = Math.ceil(amount / 3);
	if (game.jobs.Miner.owned >= rem) toCheck.push('Miner');
	if (game.jobs.Farmer.owned >= rem) toCheck.push('Farmer');
	if (game.jobs.Lumberjack.owned >= rem) toCheck.push('Lumberjack');
	if (toCheck.length == 0) return false;
	if (toCheck.length < 3){
		rem = Math.ceil(amount / 2);
		var tempCheck = [];
		for (var y = 0; y < toCheck.length; y++){
			if (game.jobs[toCheck[y]].owned >= rem) tempCheck.push(toCheck[y]);
		}
		toCheck = tempCheck;
	}
	if (toCheck.length == 0) return false;
	else if (toCheck.length == 1){
		if (game.jobs[toCheck[0]].owned < amount) return false;
	}
	for (var x = 0; x < toCheck.length; x++){
		game.jobs[toCheck[x]].owned -= rem;
	}
	return true;
}



function calculateMaxAfford(itemObj, isBuilding, isEquipment, isJob, forceMax, forceRatio){ //don't use forceMax for jobs until you fix that second return. forceMax and forceRatio indicate that they're from an auto, and ignore firing
	if (!itemObj.cost){
		//console.log("no cost", itemObj);
		return 1;
	}
	var mostAfford = -1;
	var currentOwned = (itemObj.purchased) ? itemObj.purchased : ((itemObj.level) ? itemObj.level : itemObj.owned);
	if (!currentOwned) currentOwned = 0;
	if (isJob && game.global.firing && !forceRatio) return Math.floor(currentOwned * game.global.maxSplit);
	//if (itemObj == game.equipment.Shield) console.log(currentOwned);
	for (var item in itemObj.cost){
		var price = itemObj.cost[item];
		var toBuy;
		var resource = game.resources[item];
		var resourcesAvailable = resource.owned;
		if (game.global.maxSplit != 1 && !forceMax && !forceRatio) resourcesAvailable = Math.floor(resourcesAvailable * game.global.maxSplit);
		else if (forceRatio) resourcesAvailable = Math.floor(resourcesAvailable * forceRatio);
		if (!resource || typeof resourcesAvailable === 'undefined'){
			console.log("resource " + item + " not found");
			return 1;
		}
		if (typeof price[1] !== 'undefined'){
			var start = price[0];
			if (isEquipment){
				var artMult = getEquipPriceMult();
				start = Math.ceil(start * artMult);
			}
			if (isBuilding && getPerkLevel("Resourceful")) start = start * (Math.pow(1 - game.portal.Resourceful.modifier, getPerkLevel("Resourceful")));
			toBuy = Math.floor(log10(((resourcesAvailable / (start * Math.pow(price[1], currentOwned))) * (price[1] - 1)) + 1) / log10(price[1]));
			//if (itemObj == game.equipment.Shield) console.log(toBuy);
		}
		else if (typeof price === 'function') {
			return 1;
		}
		else {
			if (isBuilding && getPerkLevel("Resourceful")) price = Math.ceil(price * (Math.pow(1 - game.portal.Resourceful.modifier, getPerkLevel("Resourceful"))));
			toBuy = Math.floor(resourcesAvailable / price);
		}
		if (mostAfford == -1 || mostAfford > toBuy) mostAfford = toBuy;
	}
	if (forceRatio && (mostAfford <= 0 || isNaN(mostAfford))) return 0;
	if (isBuilding && mostAfford > 1000000000) return 1000000000;
	if (mostAfford <= 0) return 1;
	if (isJob && itemObj.max && itemObj.owned + mostAfford > itemObj.max) return (itemObj.max - itemObj.owned);
	return mostAfford;
}

function getTooltipJobText(what, toBuy) {
    var job = game.jobs[what];
	if (toBuy <= 0) toBuy = game.global.buyAmt;
	if (toBuy == "Max") toBuy = calculateMaxAfford(job, false, false, true);
	var fullText = "";
    for (var item in job.cost) {
		var result = (checkJobItem(what, false, item, false, toBuy))
        var color =  (result === 0) ? "orange" : ((result == true) ? "green" : "red");
        fullText += '<span class="' + color + '">' + item + ':&nbsp;' + checkJobItem(what, false, item, true, toBuy) + '</span>, ';
    }
    fullText = fullText.slice(0, -2);
    return fullText;
}

function canAffordJob(what, take, workspaces, updatingLabel, fromAuto) {
	if (game.jobs[what].max <= game.jobs[what].owned) return false;
	var ignoreWorkspaces = (game.jobs[what].allowAutoFire && ((game.options.menu.fireForJobs.enabled && updatingLabel) || fromAuto));
	if (workspaces <= 0 && !ignoreWorkspaces) return false;
    var trimps = game.resources.trimps;
	var toBuy = 1;
	if (game.global.buyAmt == "Max"){
		workspaces = Math.floor(workspaces * game.global.maxSplit);
		if (workspaces <= 0) workspaces++;
		if (!updatingLabel) toBuy = calculateMaxAfford(game.jobs[what], false, false, true);
	}
	else toBuy = game.global.buyAmt;
	if (game.jobs[what].max && game.jobs[what].owned + toBuy > game.jobs[what].max) toBuy = game.jobs[what].max - game.jobs[what].owned;
    if (!ignoreWorkspaces && workspaces >= 0 && workspaces < toBuy) toBuy = workspaces;
    if (!ignoreWorkspaces && (trimps.owned - trimps.employed - toBuy < 0)) return false;
    var job = game.jobs[what];
    for (var costItem in job.cost) {
        if (checkJobItem(what, take, costItem, null, toBuy) !== true) return false;
    }
	if (take) return toBuy;
    return true;
}

function checkJobItem(what, take, costItem, amtOnly, toBuy) {
    var job = game.jobs[what];
    var cost = job.cost[costItem];
    var price = 0;
	if (!toBuy) toBuy = game.global.buyAmt;
	if (typeof cost[1] !== 'undefined')
		price =  Math.floor((cost[0] * Math.pow(cost[1], job.owned)) * ((Math.pow(cost[1], toBuy) - 1) / (cost[1] - 1)));
	else
		price = cost * toBuy;
    if (amtOnly) {
		var percent;
		if (game.resources[costItem].owned < price){
			var thisPs = getPsString(costItem, true);
			if (thisPs > 0)
			{
				percent = calculateTimeToMax(null, thisPs, (price - game.resources[costItem].owned));
				percent = "(" + percent + ")";
			}
			else percent = "(<span class='icomoon icon-infinity'></span>)";
		}
		else{
			percent = (game.resources[costItem].owned > 0) ? prettify(((price / game.resources[costItem].owned) * 100).toFixed(1)) : 0;
			percent = "(" + percent + "%)";
		}
		return prettify(price) + "&nbsp;" + percent;
	}
    if (take) {
        game.resources[costItem].owned -= price;
        return true;
    }
	if (game.resources[costItem].max > 0 && getMaxForResource(costItem) < price){
		return 0;
	}
    if (game.resources[costItem].owned < price) {
        return false;
    }
    return true;
}

function canAffordCoordinationTrimps(){
	if (game.global.challengeActive == "Trappapalooza") return ((game.resources.trimps.owned - game.resources.trimps.employed) >= Math.ceil(game.resources.trimps.getCurrentSend() * 0.25));
	return (game.resources.trimps.realMax() >= (game.resources.trimps.getCurrentSend() * 3))
}


function buyUpgrade(what, confirmed, noTip, heldCtrl) {
	if (game.options.menu.pauseGame.enabled) return;
	if (!confirmed && !noTip && game.options.menu.lockOnUnlock.enabled == 1 && !usingRealTimeOffline && (new Date().getTime() - 1000 <= game.global.lastUnlock)) return;
    if (what == "Coordination") {
       if (!canAffordCoordinationTrimps()) return false;
    }
    var upgrade = game.upgrades[what];
	if (upgrade.locked == 1) return;
	var usingCtrl = (typeof heldCtrl !== 'undefined') ? heldCtrl : (game.options.menu.ctrlGigas.enabled && what == "Gigastation") ? true : ctrlPressed;
	if (upgrade.isRelic && usingCtrl && !noTip) {
		tooltip("Archaeology Automator", null, 'update');
		return;
	}
	if (upgrade.isRelic && game.challenges.Archaeology.getPoints(game.upgrades[what].relic) >= 50){
		return;
	}
    var canAfford = canAffordTwoLevel(upgrade);
    if (!canAfford) return false;
	if (what == "Gigastation" && !confirmed && !noTip && game.options.menu.confirmhole.enabled){
		tooltip('Confirm Purchase', null, 'update', 'You are about to purchase a Gigastation, <b>which is not a renewable upgrade</b>. Make sure you have purchased all of the Warpstations you can afford first!', 'buyUpgrade(\'Gigastation\', true, false, ' + usingCtrl + ')');
		return;
	}
	if (what == "Shieldblock" && !confirmed && game.options.menu.confirmhole.enabled && getHighestLevelCleared() >= 30){
		tooltip('Confirm Purchase', null, 'update', 'You are about to modify your Shield, causing it to block instead of grant health until your next portal. Are you sure?', 'buyUpgrade(\'Shieldblock\', true)');
		return;
	}
	canAfford = canAffordTwoLevel(upgrade, true);
	if (upgrade.isRelic){
		game.challenges.Archaeology.buyRelic(what, noTip);
		return;
	}
	upgrade.fire(usingCtrl, noTip);
	upgrade.done++;
	if (upgrade.prestiges){
		var resName = (what == "Supershield") ? "wood" : "metal";
		upgrade.cost.resources[resName] = getNextPrestigeCost(what);
	}
	if ((upgrade.allowed - upgrade.done) <= 0) upgrade.locked = 1;
	var dif = upgrade.allowed - upgrade.done;
	var ownedElem = document.getElementById(what + "Owned");
    if (dif > 1) {
		dif -= 1;
		if (ownedElem)
        	ownedElem.innerHTML = upgrade.done + "(+" + dif + ")";
		if (!noTip && !usingScreenReader) tooltip(what, "upgrades", "update");
        return true;
    } else if (dif == 1) {
		if (!noTip && !usingScreenReader) tooltip(what, "upgrades", "update");
		if (ownedElem)
        	ownedElem.innerHTML = upgrade.done;
        return true;
	}
	var upgradesHereElem = document.getElementById("upgradesHere")
	var removeElem = document.getElementById(what);
	if (removeElem) upgradesHereElem.removeChild(removeElem);
	if (usingScreenReader){
		var tooltipElem = document.getElementById('srTooltip' + what);
		if (tooltipElem) upgradesHereElem.removeChild(tooltipElem);
	}
    if (!noTip) tooltip("hide");
	return true;
}

function getDesiredGenes(ovr){
	var breed_speed = 0.00085 * Math.pow(1.1,game.upgrades.Potency.done) * Math.pow(1.01,game.buildings.Nursery.owned) * (1 + 0.1*getPerkLevel("Pheromones")) * Math.pow(1.003,game.unlocks.impCount.Venimp);
	var maxGenes = (Math.floor(Math.log(12 * breed_speed * game.resources.trimps.owned / game.resources.trimps.soldiers) / -Math.log(0.98)));
	return maxGenes;
}

var DecimalBreed = Decimal.clone({precision: 30, rounding: 4});
var missingTrimps = new DecimalBreed(0);
var srLastBreedTime = "";
var breedCache = {
	modifiers: {
		trimps: 0,
		book: 0,
		nursery: 0,
		venimp: 0,
		brokenPlanet: 0,
		pheromones: 0,
		quickTrimps: 0,
		dailyDysfunctional: 0,
		dailyToxic: 0,
		chalToxic: 0,
		chalArchaeology: 0,
		chalQuagmire: 0,
		voidBreed: 0,
		heirloom: 0,
		genes: 0,
		mutGeneAttack: 0,
		mutGeneHealth: 0
	},
	potencyMod: 0,
	potencyModInitial: 0,
	logPotencyMod: 0,
	minPotencyMod: new DecimalBreed(1e-15)
};

function breed() {
	const breedElem = document.getElementById('trimpsTimeToFill');
	const trimps = game.resources.trimps;
	checkAchieve('trimps', trimps.owned);

	const trimpsMax = trimps.realMax();
	let employedTrimps = trimps.employed;
	if (game.permaBoneBonuses.multitasking.owned) employedTrimps *= 1 - game.permaBoneBonuses.multitasking.mult();

	const maxBreedable = new DecimalBreed(trimpsMax).minus(employedTrimps);
	if (missingTrimps.cmp(0) === -1) missingTrimps = new DecimalBreed(0);
	let decimalOwned = missingTrimps.add(trimps.owned);
	let breeding = decimalOwned.minus(employedTrimps);
	if (breeding.cmp(2) === -1 || challengeActive('Trapper') || challengeActive('Trappapalooza')) {
		updatePs(0, true);
		if (breedElem.innerHTML !== '') breedElem.innerHTML = '';
		srLastBreedTime = '';
		return;
	}

	const challenges = {
		Daily: challengeActive('Daily'),
		Toxicity: challengeActive('Toxicity'),
		Archaeology: challengeActive('Archaeology'),
		Quagmire: challengeActive('Quagmire')
	};

	let potencyModifiers = {
		trimps: trimps.potency,
		book: game.upgrades.Potency.done,
		nursery: game.buildings.Nursery.owned,
		venimp: game.unlocks.impCount.Venimp,
		brokenPlanet: game.global.brokenPlanet,
		pheromones: getPerkLevel('Pheromones'),
		quickTrimps: game.singleRunBonuses.quickTrimps.owned,
		dailyDysfunctional: challenges.Daily && typeof game.global.dailyChallenge.dysfunctional !== 'undefined' ? dailyModifiers.dysfunctional.getMult(game.global.dailyChallenge.dysfunctional.strength) : 0,
		dailyToxic: challenges.Daily && typeof game.global.dailyChallenge.toxic !== 'undefined' ? dailyModifiers.toxic.getMult(game.global.dailyChallenge.toxic.strength, game.global.dailyChallenge.toxic.stacks) : 0,
		chalToxic: challenges.Toxicity ? game.challenges.Toxicity.stacks : 0,
		chalArchaeology: challenges.Archaeology ? game.challenges.Archaeology.getStatMult('breed') : 1,
		chalQuagmire: challenges.Quagmire ? game.challenges.Quagmire.getExhaustMult() : 1,
		voidBreed: game.global.voidBuff === 'slowBreed',
		heirloom: getHeirloomBonus('Shield', 'breedSpeed'),
		genes: game.jobs.Geneticist.owned,
		mutGeneAttack: game.global.universe === 2 && u2Mutations.tree.GeneAttack.purchased,
		mutGeneHealth: game.global.universe === 2 && u2Mutations.tree.GeneHealth.purchased
	};

	// If modifiers have changed, recalculate potencyMod.
	let potencyMod;
	if (
		Object.keys(potencyModifiers)
			.map((k) => potencyModifiers[k] === breedCache.modifiers[k])
			.every(Boolean)
	) {
		breeding = breedCache.potencyModInitial.mul(breeding);
		potencyMod = breedCache.potencyMod;
	} else {
		potencyMod = trimps.potency;
		if (potencyModifiers.book > 0) potencyMod *= Math.pow(1.1, potencyModifiers.book);
		if (potencyModifiers.nursery > 0) potencyMod *= Math.pow(1.01, potencyModifiers.nursery);
		if (potencyModifiers.venimp) potencyMod *= Math.pow(1.003, potencyModifiers.venimp);
		if (potencyModifiers.brokenPlanet) potencyMod /= 10;
		if (potencyModifiers.pheromones > 0) potencyMod *= 1 + potencyModifiers.pheromones * game.portal.Pheromones.modifier;
		if (potencyModifiers.quickTrimps) potencyMod *= 2;
		if (challenges.Daily && potencyModifiers.dailyDysfunctional > 0) potencyMod *= potencyModifiers.dailyDysfunctional;
		if (challenges.Daily && potencyModifiers.dailyToxic > 0) potencyMod *= potencyModifiers.dailyToxic;
		if (challenges.Toxicity && potencyModifiers.chalToxic > 0) potencyMod *= Math.pow(game.challenges.Toxicity.stackMult, potencyModifiers.chalToxic);
		if (challenges.Archaeology) potencyMod *= potencyModifiers.chalArchaeology;
		if (challenges.Quagmire) potencyMod *= potencyModifiers.chalQuagmire;
		if (potencyModifiers.voidBreed) potencyMod *= 0.2;
		potencyMod = calcHeirloomBonus('Shield', 'breedSpeed', potencyMod); 
		if (potencyModifiers.mutGeneAttack) potencyMod /= 50;
		if (potencyModifiers.mutGeneHealth) potencyMod /= 50;
		
		if (potencyModifiers.genes > 0) potencyMod = DecimalBreed(potencyMod).mul(Math.pow(0.98, potencyModifiers.genes)); // Special care for genes.
		else potencyMod = DecimalBreed(potencyMod);

		breedCache.potencyModInitial = potencyMod;
		breeding = potencyMod.mul(breeding);
		potencyMod = potencyMod.div(10).add(1);
		
		// Cache the results.
		breedCache.modifiers = potencyModifiers;
		breedCache.potencyMod = potencyMod;
		breedCache.logPotencyMod = DecimalBreed.log10(potencyMod).mul(10);

		if (breedCache.logPotencyMod.cmp(0) === 0) {
			breedCache.logPotencyMod = breedCache.minPotencyMod;
		}
	}

	updatePs(breeding.toNumber(), true);
	const logPotencyMod = breedCache.logPotencyMod;

	// Attempt to get these two vars at low precision. if it's zero, recalc using Decimal.
	let timeRemaining = DecimalBreed(Math.log10(maxBreedable / (decimalOwned - employedTrimps)) / logPotencyMod);
	if (missingTrimps.cmp(0) === 1 && timeRemaining == 0) {
		timeRemaining = DecimalBreed.log10(maxBreedable.div(decimalOwned.minus(employedTrimps))).div(logPotencyMod);
	}
	
	// Calculate full breed time
	let fullBreed = '';
	const currentSend = trimps.getCurrentSend();
	let totalTime = DecimalBreed(Math.log10(maxBreedable / (maxBreedable - currentSend)) / logPotencyMod);

	if (totalTime == 0) {
		totalTime = DecimalBreed.log10(maxBreedable.div(maxBreedable.minus(currentSend))).div(logPotencyMod);
	}

	game.global.breedTime = currentSend / breeding;

	if (!game.jobs.Geneticist.locked && game.global.Geneticistassist && game.global.GeneticistassistSetting > 0) {
		const target = new Decimal(game.global.GeneticistassistSetting);
		const now = new Date().getTime();

		let canRun = false;
		if (lastGAToggle === -1) {
			canRun = true;
		} else if (now > lastGAToggle + 2000) {
			lastGAToggle = -1;
			canRun = true;
		}

		let GAElem = document.getElementById('Geneticistassist');
		let GAIndicator = document.getElementById('GAIndicator');
		if (!GAElem && usingRealTimeOffline) {
			drawAllJobs(true);
			GAElem = document.getElementById('Geneticistassist');
			GAIndicator = document.getElementById('GAIndicator');
		}

		if (GAElem && canRun) {
			let thresh = new DecimalBreed(totalTime.mul(0.02));
			if (!thresh.isFinite()) thresh = new Decimal(0);
			let compareTime;
			let htmlMessage = '';

			if (timeRemaining.cmp(1) === 1 && timeRemaining.cmp(target.add(1)) === 1) {
				compareTime = new DecimalBreed(timeRemaining.add(-1));
			} else {
				compareTime = new DecimalBreed(totalTime);
			}

			if (!compareTime.isFinite()) compareTime = new Decimal(999);

			if (compareTime.cmp(target) === -1) {
				let genDif = Decimal.log10(target.div(compareTime)).div(0.00860017176191756).ceil(); // Math.log10(1.02) = 0.00860017176191756
				swapClass('state', 'stateHiring', GAElem);
				if (game.resources.food.owned * 0.01 < getNextGeneticistCost()) {
					htmlMessage = " (<span style='font-size: 0.8em' class='glyphicon glyphicon-apple'></span>)";
				} else if (timeRemaining.cmp(1) === -1 || target.minus((now - game.global.lastSoldierSentAt) / 1000).cmp(timeRemaining) === 1) {
					if (genDif.cmp(0) === 1) {
						if (genDif.cmp(10) === 1) genDif = new Decimal(10);
						addGeneticist(genDif.toNumber());
					}
					htmlMessage = ' (+)';
				} else {
					htmlMessage = " (<span style='font-size: 0.8em' class='icmoon icon-clock3'></span>)";
				}
			} else if (compareTime.add(thresh.mul(-1)).cmp(target) === 1 || potencyMod.cmp(1) === 0) {
				let genDif = Decimal.log10(target.div(compareTime)).div(0.00860017176191756).ceil(); // Math.log10(1.02) = 0.00860017176191756
				if (!genDif.isFinite()) genDif = new Decimal(-1);
				swapClass('state', 'stateFiring', GAElem);
				htmlMessage = ' (-)';
				if (genDif.cmp(0) === -1 && game.options.menu.gaFire.enabled !== 2) {
					if (genDif.cmp(-10) === -1) genDif = new Decimal(-10);
					removeGeneticist(genDif.abs().toNumber());
				}
			} else {
				swapClass('state', 'stateHappy', GAElem);
				htmlMessage = '';
			}

			if (GAIndicator && GAIndicator.innerHTML !== htmlMessage) GAIndicator.innerHTML = htmlMessage;
		}
	}

	timeRemaining = timeRemaining.toNumber();
	totalTime = totalTime.toNumber();
	decimalOwned = decimalOwned.add(breeding.div(10));
	timeRemaining = game.options.menu.showFullBreed.enabled > 0 ? timeRemaining.toFixed(1) : Math.ceil(timeRemaining);
	const remainingTime = timeRemaining;

	// Display full breed time if desired
	const totalTimeText = Math.ceil(totalTime * 10) / 10;

	if (game.options.menu.showFullBreed.enabled) {
        fullBreed = `${totalTimeText} Secs`;
        timeRemaining = `${timeRemaining} / ${fullBreed}`;
    } else {
        timeRemaining += ` Secs`;
    }

	if (decimalOwned.cmp(trimpsMax) >= 0 && trimps.owned >= trimpsMax) {
		trimps.owned = trimpsMax;
		missingTrimps = new DecimalBreed(0);
		let updateGenes = false;
		if (game.options.menu.geneSend.enabled === 3 && game.global.lastBreedTime / 1000 < game.global.GeneticistassistSetting) {
			game.global.lastBreedTime += 100;
			if (remainingTime === 0) updateGenes = true;
		}
		srLastBreedTime = fullBreed ? fullBreed : '';
		if (breedElem.innerHTML !== srLastBreedTime) breedElem.innerHTML = srLastBreedTime;
		if (updateGenes || (!game.global.fighting && totalTimeText === '0.0')) {
			updateStoredGenInfo(breeding.toNumber());
		}
		return;
	}

	srLastBreedTime = timeRemaining;
	if (!usingRealTimeOffline && breedElem.innerHTML !== timeRemaining) breedElem.innerHTML = timeRemaining;
	trimps.owned = decimalOwned.toNumber();

	if (decimalOwned.cmp(trimps.owned) !== 0 && breeding.cmp(0) === 1) {
		missingTrimps = decimalOwned.minus(trimps.owned);
	} else {
		missingTrimps = new DecimalBreed(0);
	}

	if (trimps.owned >= trimpsMax) {
		trimps.owned = trimpsMax;
	} else {
		game.global.realBreedTime += 100;
	}

	game.global.lastBreedTime += 100;
	updateStoredGenInfo(breeding);
}

function updateStoredGenInfo(breeding){
	if (game.jobs.Geneticist.locked == 0) {
		if (game.global.breedBack > 0) game.global.breedBack -= breeding / game.settings.speed;
		if (game.global.lowestGen == -1) game.global.lowestGen = game.jobs.Geneticist.owned;
		else if (game.jobs.Geneticist.owned < game.global.lowestGen) game.global.lowestGen = game.jobs.Geneticist.owned;
	}
}

var lastGAToggle = -1;
var GATimeout;
function toggleGeneticistassist(updateOnly){
	if (ctrlPressed && !updateOnly) {
		cancelTooltip();
		tooltip('Geneticistassist Settings', null, 'update');
		return;
	}
	var steps = game.global.GeneticistassistSteps;
	var currentStep = steps.indexOf(game.global.GeneticistassistSetting);
	var indicatorElem = document.getElementById('GAIndicator');
	if (indicatorElem == null) return;
	if (currentStep == -1){
		game.global.GeneticistassistSetting = steps[0];
		updateOnly = true;
	}
	indicatorElem.innerHTML = "";
	if (!updateOnly){
		currentStep++;
		if (currentStep > (steps.length - 1)) currentStep = 0;
		game.global.GeneticistassistSetting = steps[currentStep];
		if (currentStep > 0){
			indicatorElem.innerHTML = ' (2)';
			clearTimeout(GATimeout);
			GATimeout = setTimeout(function(){ indicatorElem.innerHTML = ' (1)' }, 1000);
			lastGAToggle = new Date().getTime();
		}
		else {lastGAToggle = -1; clearTimeout(GATimeout)};
	}
	var elem = document.getElementById('Geneticistassist');
	if (ctrlPressed) swapClass("thingColor", "thingColorCtrl", elem);
	else swapClass("thingColor", "thingColorNone", elem);
	currentStep = steps[currentStep];
	var text = "";
	if (currentStep == -1) {
		text = "Disabled";
		swapClass("state", "stateDanger", elem);
	}
	else text = "<span class='icomoon icon-target'></span> " + currentStep + " Second" + ((currentStep > 1) ? "s" : "");
	document.getElementById("GeneticistassistSetting").innerHTML = text;
}

function customizeGATargets(){
	var error = "";
	var toKeep = [-1];
	var disableCheck = document.getElementById('disableOnUnlockCheck');
	if (disableCheck != null){
		var checked = readNiceCheckbox(disableCheck);
		game.options.menu.GeneticistassistTarget.disableOnUnlock = checked;
		if (checked && game.jobs.Geneticist.locked) game.global.GeneticistassistSetting = -1;
	}
	for (var x = 1; x <= 3; x++){
		var elem = document.getElementById('target' + x);
		if (!elem) {
			error = "Unable to pull info from input boxes. Try saving and refreshing?";
			break;
		}
		var val = parseFloat(elem.value);
		if (toKeep.indexOf(val) != -1) {
			error = val + " cannot be used twice. Please choose unique numbers!";
			break;
		}
		if (isNumberBad(val)){
			error = elem.value + " seconds would be really difficult to target. Could you pick a slightly more... numerical number?";
			break;
		}
		if (val < 0.5) {
			error = "All numbers must be greater than 0.5. " + elem.value + " is not.";
			break;
		}
		if (val > 5000){
			error = "Sorry, all numbers must be less than or equal to 5000.";
			break;
		}
		toKeep.push(val);
	}
	if (error){
		document.getElementById("GATargetError").innerHTML = error;
		return;
	}
	var currentStep = game.global.GeneticistassistSteps.indexOf(game.global.GeneticistassistSetting);
	if (currentStep == -1) currentStep = 0;
	cancelTooltip();
	game.global.GeneticistassistSteps = toKeep;
	game.global.GeneticistassistSetting = toKeep[currentStep];
	toggleGeneticistassist(true);
}

function log10(val) {
  return Math.log(val) / Math.LN10;
}

function testGymystic(oldPercent) {
	var number = game.buildings.Gym.increase.by;
	game.buildings.Gym.increase.by *= Math.pow(1 - oldPercent, game.buildings.Gym.owned);

	game.buildings.Gym.increase.by *= Math.pow(game.upgrades.Gymystic.modifier, game.buildings.Gym.owned);
	game.global.block -= (game.buildings.Gym.increase.by - number) * game.buildings.Gym.owned;

}

function prestigeEquipment(what, fromLoad = false, noInc = false) {
	const equipment = game.equipment[what];
	if (!fromLoad && !noInc) equipment.prestige++;

	const prestigeMod = equipment.prestige >= 4 ? (equipment.prestige - 3) * 0.85 + 2 : equipment.prestige - 1;
	const resource = what === 'Shield' ? 'wood' : 'metal';
	const cost = equipment.cost[resource];
	cost[0] = Math.round(equipment.oc * Math.pow(1.069, prestigeMod * game.global.prestige.cost + 1));

	const stat = equipment.blockNow ? 'block' : typeof equipment.health !== 'undefined' ? 'health' : 'attack';
	if (!fromLoad) game.global[stat] -= equipment[stat + 'Calculated'] * equipment.level;
	if (!fromLoad) game.global.difs[stat] -= equipment[stat + 'Calculated'] * equipment.level;
	equipment[stat + 'Calculated'] = Math.round(equipment[stat] * Math.pow(1.19, (equipment.prestige - 1) * game.global.prestige[stat] + 1));

	// No need to touch level if it's newNum
	if (fromLoad) return;
	equipment.level = 0;
	if (!noInc) levelEquipment(what, 1);
	if (game.global[stat] <= 0) game.global[stat] = calcBaseStats(stat);

	const numeral = usingScreenReader ? prettify(equipment.prestige) : romanNumeral(equipment.prestige);
	const equipElem = document.getElementById(`${what}Numeral`);
	if (equipElem !== null) equipElem.innerHTML = numeral;

	displayEfficientEquipment();
}

function calcBaseStats(equipType = 'attack') {
	const equipmentTypes = {
		attack: ['Dagger', 'Mace', 'Polearm', 'Battleaxe', 'Greatsword', 'Arbalest'],
		health: ['Shield', 'Boots', 'Helmet', 'Pants', 'Shoulderguards', 'Breastplate', 'Gambeson'],
		block: game.equipment.Shield.blockNow ? ['Shield'] : []
	};

	const bonusValues = {
		attack: 6,
		health: 50,
		block: 0
	};

	let bonus = bonusValues[equipType] || 0;
	let equipmentList = equipmentTypes[equipType] || [];

	for (let i = 0; i < equipmentList.length; i++) {
		const equip = game.equipment[equipmentList[i]];
		if (equip.locked || (equip.blockNow && equipType === 'health')) continue;
		bonus += equip[equipType + 'Calculated'] * equip.level;
	}

	return bonus;
}
	

function getNextPrestigeCost(what){
	var equipment = game.equipment[game.upgrades[what].prestiges];
	var prestigeMod;
	var nextPrestigeCount = equipment.prestige + 1;
	if (nextPrestigeCount >= 4) prestigeMod = (((nextPrestigeCount - 3) * 0.85) + 2);
	else prestigeMod = (nextPrestigeCount - 1);
    return Math.round(equipment.oc * Math.pow(1.069, ((prestigeMod) * game.global.prestige.cost) + 1));
}

function getNextPrestigeValue(what){
	var name = game.upgrades[what].prestiges;
	var equipment = game.equipment[name];
	var stat;
	if (equipment.blockNow) stat = "block";
	else stat = (typeof equipment.health !== 'undefined') ? "health" : "attack";
	var toReturn = Math.round(equipment[stat] * Math.pow(1.19, ((equipment.prestige) * game.global.prestige[stat]) + 1));
	return prettify(toReturn) + " " + stat;
}

function getHighestPrestige(){
	var lowest = -1;
	for (var item in game.equipment) {
		var prestige = game.equipment[item].prestige;
		if (lowest == -1) lowest = prestige;
		else if (lowest < prestige) lowest = prestige;
	}
	return lowest;
}

function createMap(newLevel, nameOverride, locationOverride, lootOverride, sizeOverride,  difficultyOverride, setNoRecycle, messageOverride) {
    game.global.mapsOwned++;
    game.global.totalMapsEarned++;
    var world = (newLevel) ? newLevel : game.global.world;
	//(newLevel > 5 && newLevel <= game.global.world) ? newLevel : game.global.world;
    var mapName = getRandomMapName();
	mapName = mapName.split('.');
	var lootg = parseFloat(getRandomMapValue("loot"));
	if (game.singleRunBonuses.goldMaps.owned) lootg += 1;
	if (lootOverride && game.singleRunBonuses.goldMaps.owned) lootOverride += 1;
	if (typeof mapName[1] === 'undefined') mapName[1] = "All";
	if (nameOverride) mapName[0] = nameOverride;
	else world += getExtraMapLevels();
	var mapDifficulty = (difficultyOverride) ? difficultyOverride : getRandomMapValue("difficulty");
	if (game.global.challengeActive == "Mapocalypse") mapDifficulty = parseFloat(mapDifficulty) + game.challenges.Mapocalypse.difficultyIncrease;
    var newMap = {
        id: "map" + game.global.totalMapsEarned,
        name: mapName[0],
		location: (locationOverride) ? locationOverride : mapName[1],
        clears: 0,
        level: world,
        difficulty: mapDifficulty,
        size: (sizeOverride) ? sizeOverride : Math.floor(getRandomMapValue("size")),
		loot: (lootOverride) ? lootOverride : lootg,
		noRecycle: setNoRecycle ? true : false
	};
	var maxLoot = getMapMinMax('loot', 0)[1];
	if (game.singleRunBonuses.goldMaps.owned) maxLoot++;
	if (!nameOverride && newMap.difficulty == getMapMinMax('difficulty', 0)[0] && newMap.size == getMapMinMax('size', 0)[0] && newMap.loot == maxLoot)
		giveSingleAchieve('Maptastic')
	if (newMap.location == 'Plentiful' && game.global.decayDone){
		newMap.loot += .25;
	}
	if (game.global.farmlandsUnlocked && newMap.location == 'Farmlands' && game.global.universe == 2){
		newMap.loot += 1;
	}
	var specialModifier = getSpecialModifierSetting();
	if (!nameOverride && specialModifier != "0"){
		newMap.bonus = specialModifier;
	}
	if (locationOverride == "Bionic" && game.talents.bionic.purchased){
		newMap.bonus = "fa";
	}
	game.global.mapsOwnedArray.push(newMap);
    if (!messageOverride) message("You just made " + mapName[0] + "!", "Loot", "th-large", null, 'secondary');
    unlockMap(game.global.mapsOwnedArray.length - 1);
}

function checkMapLevelInput(elem){
	var value = parseInt(elem.value, 10);
	if (isNaN(value)) elem.value = game.global.world;
	if (value < 6) elem.value = 6;
	if (value > game.global.world) elem.value = game.global.world;
	updateMapCost();
}

function incrementMapLevel(amt){
	var elem = document.getElementById("mapLevelInput");
	var newNum = parseInt(elem.value, 10) + amt;
	if (newNum < 6 || isNaN(newNum)) elem.value = 6;
	else if (newNum > game.global.world) elem.value = game.global.world;
	else elem.value = newNum;
	updateMapCost();
	hideAdvMaps(true);
	screenReaderAssert("Map level set to " + newNum)
}

function saveAdvMaps(){
	var preset = getMapPreset();
	preset.loot = getMapSliderValue('loot');
	preset.size = getMapSliderValue('size');
	preset.difficulty = getMapSliderValue('difficulty');
	preset.biome = getMapBiomeSetting();
	preset.specMod = getSpecialModifierSetting();
	preset.perf = checkPerfectChecked();
	preset.extra = getExtraMapLevels();
	preset.offset = getMapZoneOffset();
}

function getMapPreset(){
	var name = "mapPresets" + ((game.global.universe == 2) ? "2" : "");
	return game.global[name]["p" + game.global.selectedMapPreset];
}

function selectAdvMapsPreset(num){
	game.global.selectedMapPreset = num;
	resetAdvMaps();
}

function getPresetDescription(num){
	var name = "mapPresets" + ((game.global.universe == 2) ? "2" : "");
	var preset = game.global[name]["p" + num];
	if (!preset) return "Preset " + num;
	var offsetInt = preset.offset;
	if (preset.extra) offsetInt += preset.extra;
	var offset = (offsetInt >= 0) ? "+" : "";
	offset += offsetInt;
	var shortNames = {
		Mountain: "Mtn",
		Forest: "Frst",
		Sea: "Sea",
		Depths: "Depth",
		Plentiful: "Grdn",
		Farmlands: "Farm",
		Random: "Rand"
	}
	var sliders = (preset.perf) ? "Perf" : preset.loot + ", " + preset.size + ", " + preset.difficulty;
	var specMod = (preset.specMod && preset.specMod != "0") ? preset.specMod.toUpperCase() + " " : "";
	var desc = "#" + num + ", " + specMod + offset + " " + shortNames[preset.biome] + ", " + sliders;
	return desc;

}

function updatePresetColor(){
	for (var x = 1; x <= 5; x++){
		var elem = document.getElementById("advMapsPreset" + x);
		var newClass = (game.global.selectedMapPreset == x) ? "presetSelectionOn" : "presetSelectionOff";
		swapClass("presetSelection", newClass, elem);
	}
}

function getMapZoneOffset(){
	var worldInput = (parseInt(document.getElementById('mapLevelInput').value, 10));
	var offset = worldInput - game.global.world;
	return offset;
}

function resetAdvMaps(fromClick) {
	//if !fromClick, loads saved map settings. Otherwise resets to 0
	var preset = getMapPreset();
	//level
	var levelValue = game.global.world;
	if (!fromClick && preset.offset != 'd') levelValue += preset.offset;
	if (fromClick) preset.offset = 'd';
	document.getElementById("mapLevelInput").value = levelValue;
	//sliders
	var inputs = ["loot", "difficulty", "size"];
	for (var x = 0; x < inputs.length; x++){
		var thisVal = (!fromClick && preset[inputs[x]]) ? preset[inputs[x]] : 0;
		document.getElementById(inputs[x] + "AdvMapsRange").value = thisVal;
	}
	//biome
	var biomeElem = document.getElementById("biomeAdvMapsSelect");
	if (game.global.decayDone && document.getElementById('gardenOption') === null) 
		biomeElem.innerHTML += "<option id='gardenOption' value='Plentiful'>Gardens</option>";
	if (game.global.farmlandsUnlocked && document.getElementById('farmlandsOption') === null) 
		biomeElem.innerHTML += "<option id='farmlandsOption' value='Farmlands'>Farmlands</option>";
	biomeElem.value = (preset.biome && !fromClick) ? preset.biome : "Random";
	//bottom row
	hideAdvMaps(true);
	
	document.getElementById('advSpecialSelect').value = (!fromClick && preset.specMod) ? preset.specMod : "0";
	swapNiceCheckbox(document.getElementById('advPerfectCheckbox'), (!fromClick && preset.perf));
	document.getElementById('advExtraLevelSelect').value = (!fromClick && preset.extra > 0) ? preset.extra.toString() : "0";
	updatePresetColor();
	updateMapNumbers();
}

function updateMapNumbers(readChange){
	adjustMap('loot', getMapSliderValue('loot'));
	adjustMap('difficulty', getMapSliderValue('difficulty'));
	adjustMap('size', getMapSliderValue('size'));
	updateMapCost();
	if (usingScreenReader && readChange){
		var text = document.getElementById(readChange + 'AdvMapsText');
		if (text != null){
			let canAfford = game.resources.fragments.owned >= updateMapCost(true)
			screenReaderAssert((canAfford ? "Affordable " : "Can't Afford ") + readChange + " set to " + text.innerHTML);
		}
	}
}


function hideAdvMaps(displayOnly, hideForVoid){
	if (!displayOnly) game.global.hideMapRow = !game.global.hideMapRow;

	//Two lines below disable hiding
	game.global.hideMapRow = false;
	document.getElementById('advMapsHideBtn').style.display = 'none';

	var hidden = (hideForVoid) ? true : game.global.hideMapRow;
	document.getElementById('advMapsHideBtn').className = (hidden) ? "icomoon icon-plus-circle pointer" : "icomoon icon-minus-circle pointer";
	document.getElementById('advMapsRow').style.display = (hidden) ? "none" : "block";
	document.getElementById('mapsCreateRow').style.paddingBottom = (hidden) ? "1vw" : "0";
	var maps2 = checkAdvMaps2(hidden);
	var mapSize = (hidden) ? "0" : ((maps2) ? "2" : "1");
	swapClass('mapSize', 'mapSize' + mapSize, document.getElementById('mapsHere'));
}

function getUnlockZone(what){
	//Accepts special, perfect, and extra
	var levels = {
		u2: {
			special: 14,
			perfect: 29,
			extra: 49
		},
		u1: {
			special: 59,
			perfect: 109,
			extra: 209
		}
	}
	return levels['u' + game.global.universe][what];
}

function setAdvMaps2UnlockText(){
	document.getElementById('advPerfectLockedText').innerHTML = "Unlock at Z" + (getUnlockZone("perfect") + 1);
	document.getElementById('advExtraLockedText').innerHTML = "Unlock at Z" + (getUnlockZone("extra") + 1);
}

function checkAdvMaps2(hidden){
	var elem2 = document.getElementById('advMapsRow2');
	var elem = document.getElementById('advMapsRow');
	var enabled2 = (getHighestLevelCleared() >= getUnlockZone('special'));
	if (hidden){
		elem2.style.display = 'none';
		return false;
	}
	if (!enabled2) {
		elem.style.paddingBottom = '1vw';
		elem2.style.display = 'none';
		return false;
	}
	document.getElementById('advPerfectLocked').style.display = (getHighestLevelCleared() >= getUnlockZone('perfect')) ? 'none' : 'block';
	document.getElementById('advPerfectUnlocked').style.display = (getHighestLevelCleared() >= getUnlockZone('perfect')) ? 'block' : 'none';
	document.getElementById('advExtraLevelLocked').style.display = (getHighestLevelCleared() >= getUnlockZone('extra')) ? 'none' : 'block';
	document.getElementById('advExtraLevelUnlocked').style.display = (getHighestLevelCleared() >= getUnlockZone('extra')) ? 'block' : 'none';
	if (getHighestLevelCleared() >= getUnlockZone('extra')) setAdvExtraZoneText();
	if (getHighestLevelCleared() >= getUnlockZone('perfect')) checkSlidersForPerfect();
	populateSpecialModifiers();
	elem2.style.display = 'block';
	elem.style.paddingBottom = '0.5vw';
	return true;
}

function populateSpecialModifiers(){
	var elem = document.getElementById('advSpecialSelect');
	var setting = elem.value;
	if (!setting) setting = "0";
	elem.innerHTML = "";
	var newOptions = "<option value='0'>No Modifier</option>";
	for (var item in mapSpecialModifierConfig){
		var bonusItem = mapSpecialModifierConfig[item];
		var unlocksAt = (game.global.universe == 2) ? bonusItem.unlocksAt2 : bonusItem.unlocksAt;
		if ((typeof unlocksAt === 'function' && !unlocksAt()) || unlocksAt == -1 || getHighestLevelCleared() + 1 < unlocksAt){
			continue;
		}
		newOptions += "<option value='" + item + "'>" + bonusItem.name + "</option>";
	}
	elem.innerHTML = newOptions;
	elem.value = setting;
}

function setAdvExtraZoneText(){
	var enabled = (parseInt(document.getElementById('mapLevelInput').value, 10) == game.global.world);
	var elem = document.getElementById('advExtraLevelSelect');
	elem.style.display = enabled ? 'inline-block' : 'none';
	if (!enabled) return;
	if (elem.innerHTML == ""){
		var text = ""
		for (var x = 0; x <= 10; x++){
			var className = (affordMaxLevelsPerfect(x)) ? "mapExtraAfford1" : ((affordMaxLevelsCheap(x) ? "mapExtraAfford2" : "mapExtraNoAfford"));
			text += '<option class="' + className + '" id="advExtra' + x + '" value="'+ x + '">+' + x + '</option>';
		}
		elem.innerHTML = text;
	}
	for (var x = 0; x <= 10; x++){
		document.getElementById("advExtra" + x).innerHTML = "+" + x + " (Zone " + (game.global.world + x) + ")";
	}
}

function updateExtraLevelColors(){
	for (var x = 0; x <= 10; x++){
		var elem = document.getElementById('advExtra' + x);
		if (!elem) continue;
		var className = (affordMaxLevelsPerfect(x)) ? "mapExtraAfford1" : ((affordMaxLevelsCheap(x) ? "mapExtraAfford2" : "mapExtraNoAfford"));
		swapClass('mapExtra', className, elem);
	}
}

function affordMaxLevelsPerfect(levels){
	var baseCost = 0;
	baseCost += 27; //sliders
	baseCost *= (game.global.world >= 60) ? 0.74 : 1;
	baseCost += 6; //perfect checkbox
	if (levels > 0) baseCost += (10 * levels);
	if (game.resources.fragments.owned >= updateMapCost(true, baseCost)) return true;
	return false;
}

function affordMaxLevelsCheap(levels){
	var baseCost = 0;
	if (levels > 0) baseCost += (10 * levels);
	if (game.resources.fragments.owned >= updateMapCost(true, baseCost)) return true;
	return false;
}

function getMapSliderValue(what){
	//returns 0-9 as an int
	var val = parseInt(document.getElementById(what + "AdvMapsRange").value, 10);
	if (val >= 0 && val <= 9)
		return val;
	return 0
}

function getMapBiomeSetting(){
	//returns a biome or "Random" as a string
	var val = document.getElementById("biomeAdvMapsSelect").value;
	if (!val) return "Random";
	return val;
}

function getSpecialModifierSetting(){
	//Returns either "0" or the name of the object in mapSpecialModifierConfig
	if (getHighestLevelCleared() < getUnlockZone('special')) return "0";
	var setting = document.getElementById('advSpecialSelect').value;
	if (!setting) return "0";
	return setting;
}

function checkPerfectChecked(){
	//Returns true or false
	if (getHighestLevelCleared() < getUnlockZone('perfect')) return false;
	if (!checkSlidersForPerfect()) return false;
	return (readNiceCheckbox(document.getElementById('advPerfectCheckbox')));
}

function getExtraMapLevels(){
	//Returns an int, 0-10
	if (getHighestLevelCleared() < getUnlockZone('extra')) return 0;
	if (parseInt(document.getElementById('mapLevelInput').value, 10) != game.global.world) return 0;
	var value = document.getElementById('advExtraLevelSelect').value;
	if (!value) return 0;
	return parseInt(value, 10);
}

function checkSlidersForPerfect(){
	var enabled = checkMaxSliders();
	document.getElementById('advPerfectCheckbox').style.display = (enabled) ? 'inline-block' : 'none';
	return enabled;
}

function adjustMap(what, value) {
	var minMax = getMapMinMax(what, value);
	if (what != "size") {
		minMax[0] = Math.floor(minMax[0] * 100) + "%";
		minMax[1] = Math.floor(minMax[1] * 100) + "%";
	}
	var text = "";
	if (checkPerfectChecked())
		text = (what == "loot") ? minMax[1] : minMax[0];
	else 
		text = "Min " + minMax[0] + ", Max " + minMax[1];
	document.getElementById(what + "AdvMapsText").innerHTML = text;
	updateMapCost();
	hideAdvMaps(true);
}

function initializeInputText() {
	adjustMap('loot', 0);
	adjustMap('size', 0);
	adjustMap('difficulty', 0);
}

var mapSpecialModifierConfig = {
	fa: {
		name: "Fast Attacks",
		unlocksAt: 60,
		unlocksAt2: 15,
		get description(){
			var text = "All attacks in this map happen 100ms faster.";
			if (game.talents.hyperspeed2.purchased) text += " <span style='color: red'>Does not stack with Hyperspeed II</span>";
			return text;
		},
		costIncrease: 7,
		abv: "FA"
	},
	lc: {
		name: "Large Cache",
		unlocksAt: 60,
		unlocksAt2: 15,
		description: "Earn 20 seconds of production for either food, wood, or metal at random each time you complete this map.",
		costIncrease: 7,
		cache: true,
		onCompletion: function (){
			cacheReward("random", 20, this.name);
		},
		abv: "LC"
	},
	ssc: {
		name: "Small Savory Cache",
		unlocksAt: 85,
		unlocksAt2: 25,
		description: "Earn 10 seconds of food production each time you complete this map.",
		costIncrease: 10,
		cache: true,
		onCompletion: function () {
			cacheReward("food", 10, this.name);
		},
		abv: "SSC"
	},
	swc: {
		name: "Small Wooden Cache",
		unlocksAt: 85,
		unlocksAt2: 25,
		description: "Earn 10 seconds of wood production each time you complete this map.",
		costIncrease: 10,
		cache: true,
		onCompletion: function () {
			cacheReward("wood", 10, this.name);
		},
		abv: "SWC"
	},
	smc: {
		name: "Small Metal Cache",
		unlocksAt: 85,
		unlocksAt2: 25,
		description: "Earn 10 seconds of metal production each time you complete this map.",
		costIncrease: 10,
		cache: true,
		onCompletion: function () {
			cacheReward("metal", 10, this.name);
		},
		abv: "SMC"
	},
	src: {
		name: "Small Research Cache",
		unlocksAt: -1,
		unlocksAt2: function(){
			return game.global.ArchaeologyDone;
		},
		description: "Earn 10 seconds of science production each time you complete this map.",
		costIncrease: 10,
		cache: true,
		onCompletion: function () {
			cacheReward("science", 10, this.name);
		},
		abv: "SRC"
	},
	p: {
		name: "Prestigious",
		unlocksAt: 135,
		unlocksAt2: 55,
		description: "This map can hold two different equipment prestige upgrades, if two are available.",
		costIncrease: 10,
		abv: "P"
	},
	hc: {
		name: "Huge Cache",
		unlocksAt: 160,
		unlocksAt2: 65,
		description: "Earn 40 seconds of production for either food, wood, or metal at random each time you complete this map.",
		costIncrease: 14,
		cache: true,
		onCompletion: function () {
			cacheReward("random", 40, this.name);
		},
		abv: "HC"
	},
	lsc: {
		name: "Large Savory Cache",
		unlocksAt: 185,
		unlocksAt2: 85,
		description: "Earn 20 seconds of food production each time you complete this map.",
		costIncrease: 18,
		cache: true,
		onCompletion: function () {
			cacheReward("food", 20, this.name);
		},
		abv: "LSC"
	},
	lwc: {
		name: "Large Wooden Cache",
		unlocksAt: 185,
		unlocksAt2: 85,
		description: "Earn 20 seconds of wood production each time you complete this map.",
		costIncrease: 18,
		cache: true,
		onCompletion: function () {
			cacheReward("wood", 20, this.name);
		},
		abv: "LWC"
	},
	lmc: {
		name: "Large Metal Cache",
		unlocksAt: 185,
		unlocksAt2: 85,
		description: "Earn 20 seconds of metal production each time you complete this map.",
		costIncrease: 18,
		cache: true,
		onCompletion: function () {
			cacheReward("metal", 20, this.name);
		},
		abv: "LMC"
	},
	lrc: {
		name: "Large Research Cache",
		unlocksAt: -1,
		unlocksAt2: function(){
			return game.global.ArchaeologyDone;
		},
		description: "Earn 20 seconds of science production each time you complete this map.",
		costIncrease: 18,
		cache: true,
		onCompletion: function () {
			cacheReward("science", 20, this.name);
		},
		abv: "LRC"
	}
};

function cacheReward(resourceName, time, cacheName){
	if (resourceName == "random"){
		var eligible = ["food", "wood", "metal"];
		var roll = Math.floor(Math.random() * eligible.length);
		resourceName = eligible[roll];
	}
	var amt = simpleSeconds(resourceName, time);
	amt = scaleToCurrentMap(amt, false, !game.global.canScryCache);
	addResCheckMax(resourceName, amt, null, null, true);
	message("You open the " + cacheName + " at the end of the map to find " + prettify(amt) + " " + resourceName + "!", "Loot", "*dice", null, "cache");
	if (Fluffy.isRewardActive("lucky")){
		if (Math.floor(Math.random() * 100) < 25) {
			addResCheckMax(resourceName, amt, null, null, true);
			message("Fluffy found another " + cacheName + " with another " + prettify(amt) + " " + resourceName + "!", "Loot", "*dice", null, "cache");
		}
	}
}

function updateMapCost(getValue, forceBaseCost){
	var mapLevel =  parseInt(document.getElementById("mapLevelInput").value, 10);
	var baseCost = 0;
	if (mapLevel > game.global.world || mapLevel < 6 || isNaN(mapLevel)) return;
	if (getValue && forceBaseCost != null){
		baseCost = forceBaseCost;
	}
	else{
		//Sliders: 27 total * 0.74 = ~20
		baseCost += getMapSliderValue("size");
		baseCost += getMapSliderValue("loot");
		baseCost += getMapSliderValue("difficulty");
		baseCost *= (game.global.world >= 60) ? 0.74 : 1;
		//Perfect Checkbox
		if (checkPerfectChecked()){
			baseCost += 6;
		}
		//Extra Levels
		var extraLevels = getExtraMapLevels();
		if (extraLevels > 0){
			baseCost += (10 * extraLevels);
		}
	}
	//Special Modifier
	var specialModifier = getSpecialModifierSetting();
	if (specialModifier != "0"){
		baseCost += mapSpecialModifierConfig[specialModifier].costIncrease;
	}
	baseCost += mapLevel;
	baseCost = Math.floor((((baseCost / 150) * (Math.pow(1.14, baseCost - 1))) * mapLevel * 2) * Math.pow((1.03 + (mapLevel / 50000)), mapLevel));
	if (document.getElementById("biomeAdvMapsSelect").value != "Random") baseCost *= 2;
	if (getValue) return baseCost;
	document.getElementById("mapCostFragmentCost").innerHTML = prettify(baseCost);
	document.getElementById('mapCostFragmentText').innerHTML = " Fragment" + needAnS(baseCost);
	if (getHighestLevelCleared() >= getUnlockZone('extra')) updateExtraLevelColors();
}

function checkMaxSliders(){
	var total = getMapSliderValue("size") + getMapSliderValue("loot") + getMapSliderValue("difficulty");
	if (total == 27) return true;
	return false;
}


function getRandomMapValue(what) { //sliders only. what can be loot, size or difficulty;
	var advValue = getMapSliderValue(what);
	if (advValue > 9) advValue = 9;
	else if (advValue < 0) advValue = 0;
	var minMax = getMapMinMax(what, advValue);
	var min = minMax[0];
	var max = minMax[1];
	if (checkPerfectChecked()) {
		if (what == "loot") return max;
		return min;
	}
	min *= 100;
	max *= 100;
	var x = randomIntInclusive(min, max);
	return (x / 100).toFixed(3)
}

function getMapMinMax(what, value){
	var base = game.mapConfig[what + "Base"];
	var range = game.mapConfig[what + "Range"];
	if (what == "size" && game.talents.mapLoot2.purchased) base -= 5;
	var minMax = [base - range, base + range];
	if (what == "loot"){
		minMax[0] += ((range / 5) * value);
	}
	else{
		minMax[1] -= ((range / 5) * value);
		if (what == "size") minMax[1] = Math.floor(minMax[1]);
	}
	return minMax;
}

function buyMap() {
	if (game.options.menu.pauseGame.enabled == 1) return;
	var cost = updateMapCost(true);
	var newLevel = parseInt(document.getElementById("mapLevelInput").value, 10);
	if (!newLevel || newLevel <= 5 || newLevel > game.global.world || isNaN(newLevel) || isNaN(cost)) {
		message("You must create a map between level 6 and your highest Zone, " + game.global.world + ".", "Notices");
		return -1;
	}
	if (cost > 0 && game.resources.fragments.owned >= cost){
		if (game.global.mapsOwnedArray.length >= 100) {
			message("Woah, that's a lot of maps. You're certain your Scientists will just lose them if you make any more. Better recycle a few of them, it's good for the environment anyways.", "Notices");
			return -2;
		}
		game.resources.fragments.owned -= cost;
		createMap(newLevel);
		if (!game.global.currentMapId) selectMap(game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id);
		return 1;
	}
	else message("You can't afford this map! You need " + prettify(cost) + " fragments but only have " + prettify(game.resources.fragments.owned) + ".", "Notices");
	return -3;
}

function checkVoidMap() {
	if (game.global.universe == 2 && game.global.spireActive) return;
	if (game.global.ShieldEquipped && game.global.ShieldEquipped.rarity >= 10 && game.heirlooms.Shield.voidMaps.currentBonus > 0){
		game.global.hazShieldCredit++;
		if (game.global.hazShieldCredit >= 1000){
			createVoidMap();
			game.global.hazShieldCredit = 0;
		}
	}
	if (game.global.totalPortals < 1) return;
	if (game.global.universe == 2 && game.global.totalRadPortals < 1) return;
	var max = getVoidMaxLevel();
	if (getLastPortal() != -1){
			if (max < game.global.world){
				setVoidMaxLevel(game.global.world);
				if ((getLastPortal() + 25) < game.global.world)
					setVoidMaxLevel(getHighestLevelCleared(false, true));
			}
		if ((max - getLastPortal()) < 25) {
			max = getLastPortal();
		}
	}
	if (max > 200) max = 200;
	var min = (max > 80) ? (1000 + ((max - 80) * 13)) : 1000;
	min *= (1 - (getHeirloomBonus("Shield", "voidMaps") / 100));
	var extraV = 0;
	if (game.challenges.Nurture.boostsActive() && game.challenges.Nurture.getLevel() >= 4) extraV = 0.2;
	min *= (1 - (game.goldenUpgrades.Void.currentBonus + extraV));
	var chance = (Math.floor((game.global.lastVoidMap - min) / 10) / 50000);
	game.global.lastVoidMap++;
	if (chance < 0) return;
	if (seededRandom(game.global.voidSeed++) >= chance) return;
	createVoidMap();
	game.global.lastVoidMap = 0;
	return 1;
}

function seededRandom(seed){
	var x = Math.sin(seed++) * 10000;
	return parseFloat((x - Math.floor(x)).toFixed(7));
}

function getRandomIntSeeded(seed, minIncl, maxExcl) {
	var toReturn = Math.floor(seededRandom(seed) * (maxExcl - minIncl)) + minIncl;
	return (toReturn === maxExcl) ? minIncl : toReturn;
}

function createVoidMap(forcePrefix, forceSuffix, skipMessage, noDupe) {
	var prefixes = ['Deadly', 'Poisonous', 'Heinous', 'Destructive']; //Must match size of void specials
	var suffixes = ['Nightmare', 'Void', 'Descent', 'Pit'];
	//Size/loot/dif
	var profiles = [[100, 3, 4], [90, 2.5, 4], [100, 2.5, 3.5], [85, 2, 4.5]]; //If a difficulty below 3.5 or above 5.5 is ever added, don't forget to work something out with planetBreaker and buffVoidMaps first. Sorry! -Past you
	var voidSpecials = ['doubleAttack', 'slowBreed', 'getCrit', 'bleed'];
	game.global.totalMapsEarned++;
	var prefixNum = (forcePrefix && prefixes.indexOf(forcePrefix) >= 0) ? prefixes.indexOf(forcePrefix) : Math.floor(Math.random() * prefixes.length);
	var suffixNum = (forceSuffix && suffixes.indexOf(forceSuffix) >= 0) ? suffixes.indexOf(forceSuffix) : Math.floor(Math.random() * suffixes.length);
	profiles = profiles[suffixNum];
	if (game.global.world <= 59) {
		//-1 loot and -3 difficulty in U1, -2 difficulty in u2
		profiles[2] -= 2;
		profiles[1] -= 1;
		if (game.global.universe == 1) profiles[2] /= 2;
	}
	else if (game.global.universe == 1 && game.global.world <= 199){
		//u2 up to full difficulty, u1 at -1
		profiles[2] -= 1;
	}
	else if (game.global.universe == 1){
		//u1 +1 to loot above 200, both at full difficulty
		profiles[1]++;
	}
	if (game.global.challengeActive == "Mapocalypse") profiles[2] = profiles[2] + game.challenges.Mapocalypse.difficultyIncrease;
	var mapName = prefixes[prefixNum] + " " + suffixes[suffixNum];
	if (!noDupe && game.permaBoneBonuses.voidMaps.owned > 0) game.permaBoneBonuses.voidMaps.checkDupe(prefixes[prefixNum], suffixes[suffixNum]);
	var stackedMap = false;
	var stackCount = Fluffy.getVoidStackCount();
	if (game.talents.voidMastery.purchased && stackCount > 1) stackCount = 999;
	if (game.global.totalVoidMaps > 0 && stackCount > 1){
		for (var x = 0; x < game.global.mapsOwnedArray.length; x++){
			var newMap = game.global.mapsOwnedArray[x];
			if (newMap.location != "Void" || newMap.name != mapName || (newMap.stacked + 1) >= stackCount) continue;
			newMap.stacked = (newMap.stacked) ? newMap.stacked + 1 : 1;
			stackedMap = true;
			var mapElem = document.getElementById(newMap.id);
			if (mapElem){
				var innerElem = mapElem.getElementsByClassName('stackedVoids');
				if (innerElem.length){
					innerElem[0].innerHTML = "(x" + (newMap.stacked + 1) + ") ";
				}
			}
			break;
		}
	}
	if (!stackedMap){
		var map = ({
			id: "map" + game.global.totalMapsEarned,
			name: mapName,
			location: "Void",
			clears: 0,
			level: -1,
			size: profiles[0],
			loot: (game.singleRunBonuses.goldMaps.owned) ? (profiles[1] + 1) : profiles[1],
			difficulty: profiles[2],
			noRecycle: true,
			voidBuff: voidSpecials[prefixNum],
			stacked: 0
		});
		if (game.talents.voidPower3.purchased)
			map.bonus = 'fa';	
		game.global.mapsOwnedArray.push(map);
	}
	game.global.totalVoidMaps++;
	if (!skipMessage){
		message("A chill runs down your spine, and the Bad Guy quickly frosts over. A purple glow radiates from the ground in front of you, and a Void Map appears.", "Loot", "th-large", "voidMessage", 'voidMaps');
		addVoidAlert();
	}
	if (!stackedMap)
		unlockMap(game.global.mapsOwnedArray.length - 1);
	return mapName;
}

function buffVoidMaps(){
	var difficultyCap = 3.5;
	if (game.global.challengeActive == "Mapocalypse") {
		difficultyCap += 3;
	}
	for (var x = 0; x < game.global.mapsOwnedArray.length; x++){
		var map = game.global.mapsOwnedArray[x];
		if (map.location != "Void" || map.difficulty >= difficultyCap) continue;
		map.loot += 1;
		if (game.global.universe == 2) map.difficulty += 2;
		else{
			map.difficulty *= 2;
			map.difficulty++;
		}
	}
	refreshMaps();
	if (game.global.currentMapId === "") clearMapDescription();
}

function buffVoidMaps200(){
	for (var x = 0; x < game.global.mapsOwnedArray.length; x++){
		var map = game.global.mapsOwnedArray[x];
		if (map.location != "Void") continue;
		map.loot += 1;
		map.difficulty += 1;
	}
	refreshMaps();
	if (game.global.currentMapId === "") clearMapDescription();
}

function addVoidAlert(){
	if (game.global.switchToMaps || game.global.preMapsActive) return;
	var alert = document.getElementById('voidAlert')
	if (alert !== null) {
		alert.innerHTML = game.global.totalVoidMaps;
		return;
	}
	document.getElementById('mapsBtnText').innerHTML += ' <span id="voidAlert" class="alert badge">' + game.global.totalVoidMaps + '</span>';
}

var voidBuffConfig = {
		doubleAttack: {
			icon: 'icomoon icon-pushpin',
			text: 'This Bad Guy attacks twice - once before you, and once again after you.',
			title: 'Void Attack',
		},
		slowBreed: {
			icon: 'icomoon icon-cloudy2',
			text: 'This map is reducing the repopulation speed of your Trimps by 80%.',
			title: 'Void Gas',
		},
		getCrit: {
			icon: 'icomoon icon-heart6',
			text: 'This Bad Guy has a 25% chance to crit you for 400% extra damage.',
			title: 'Void Strength',
		},
		bleed: {
			icon: "icomoon icon-drop",
			text: 'Every time this Bad Guy attacks, you will lose an additional 20% of your <b>current</b> health.',
			title: 'Void Bleed',
		}
}

function setVoidBuffTooltip(){
	var buff = voidBuffConfig[game.global.voidBuff];
	var stackCount = "";
	var elem = document.getElementById('voidBuff');
	elem.innerHTML = makeIconEffectHTML(buff.title, buff.text, buff.icon, "badBadge voidBadge")
}

var heirloomsShown = false;
var selectedMod;
function toggleHeirlooms(){
	cancelTooltip();
	heirloomsShown = !heirloomsShown;
	document.getElementById("heirloomWrapper").style.display = (heirloomsShown) ? "block" : "none";
	document.getElementById("wrapper").style.display = (heirloomsShown) ? "none" : "block";
	document.getElementById("heirloomSpirestoneCount").style.display = (game.global.spiresCompleted >= 1) ? "inline-block" : "none";
	document.getElementById('heirloomDropChances').style.display = 'none';
	document.getElementById('heirloomHelp').style.display = 'none';
	if (heirloomsShown) populateHeirloomWindow();
	else {
		game.global.selectedHeirloom = [];
		if (game.options.menu.autoSave.enabled == 1) save();
	}
}

function scaleHeirloomModUniverse(type, modName, value) {
	if (game.global.universe === 1 || type === 'Core') return value;
	const mod = game.heirlooms[type][modName];
	if (mod.noScaleU2) return value;
	if (!(Fluffy.isRewardActive('heirloopy') && mod.heirloopy)) return value * 0.1;
	return value;
}

function getHeirloomBonus(type, mod){
	if (!game.heirlooms[type] || !game.heirlooms[type][mod]){
		console.log('oh noes', type, mod)
	}
	if (game.global.StaffEquipped.rarity >= 12){
		if (mod == "metalDrop" || mod == "MinerSpeed") mod = "allMetal";
		if (mod == "woodDrop" || mod == "LumberjackSpeed") mod = "allWood";
		if (mod == "foodDrop" || mod == "FarmerSpeed") mod = "allFood";
	}
	var bonus = game.heirlooms[type][mod].currentBonus;
	if (mod == "gammaBurst" && game.global.ShieldEquipped && game.global.ShieldEquipped.rarity >= 10){
		bonus = game.global.gammaMult;
	}
	if (game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.heirlost !== 'undefined'){
		if (type != "FluffyExp" && type != "VoidMaps") bonus *= dailyModifiers.heirlost.getMult(game.global.dailyChallenge.heirlost.strength);
	}
	return scaleHeirloomModUniverse(type, mod, bonus);
}

function getParityBonus(){
	if (!game.global.StaffEquipped || game.global.StaffEquipped.rarity < 10) return 1;
	var amt = game.global.parityBonus;
	if (amt < 1 || isNumberBad(amt)) amt = 1;
	return amt;
}

function calculateParityBonus(updateCost){
	if (!game.global.StaffEquipped || game.global.StaffEquipped.rarity < 10) {
		game.global.parityBonus = 1;
		return;
	}
	var allowed = ["Farmer", "Lumberjack", "Miner"];
	var totalWorkers = 0;
	var workerRatios = [];
	var numWorkers = [];
	for (var x = 0; x < allowed.length; x++){
		var thisWorkers = game.jobs[allowed[x]].owned;
		totalWorkers += thisWorkers;
		numWorkers[x] = thisWorkers;
	}
	for (var x = 0; x < numWorkers.length; x++){
		workerRatios.push(numWorkers[x] / totalWorkers);
	}
	var resourcePop = totalWorkers;
	resourcePop = Math.log(resourcePop) / Math.log(3);
	var largestWorker = Math.log(Math.max(...numWorkers)) / Math.log(3);
	var spreadFactor = resourcePop - largestWorker;
    var preLoomBonus = (spreadFactor*spreadFactor);
	var parityMult = (updateCost) ? getHazardParityMult() : game.global.hazardParityMult;
	var finalWithParity = (1 + preLoomBonus) * parityMult;
	game.global.parityBonus = finalWithParity;
	return finalWithParity;
}

function getHazardParityMult(heirloom){
	var equipped = false;
	if (!heirloom){
		heirloom = game.global.StaffEquipped;
		equipped = true;
	}
	else if (heirloom == game.global.StaffEquipped) equipped = true;
	if (!heirloom || heirloom.type != "Staff" || heirloom.rarity < 10){
		if (equipped) game.global.hazardParityMult = 0;
		return 0;
	}
	var spent = getTotalHeirloomRefundValue(heirloom,true);
	spent += 1e6;
	var mult = (log10(spent) / 5);
	var parityPower = 1;
	if (heirloom.rarity >= 11){
		if (equipped) parityPower = 1 + (game.heirlooms.Staff.ParityPower.currentBonus / 1000);
		else {
			for (var x = 0; x < heirloom.mods.length; x++){
				if (heirloom.mods[x][0] == "ParityPower"){
					parityPower = 1 + (heirloom.mods[x][1] / 1000);
					break;
				}
			}
		}
	}
	mult *= parityPower;
	if (mult < 0) mult = 0;
	if (isNumberBad(mult)) mult = 0;
	if (equipped) game.global.hazardParityMult = mult;
	return mult;
}

function getHazardGammaBonus(heirloom){
	var equipped = false;
	if (!heirloom){
		heirloom = game.global.ShieldEquipped;
		equipped = true;
	}
	else if (heirloom == game.global.ShieldEquipped) equipped = true;
	if (!heirloom || heirloom.type != "Shield" || heirloom.rarity < 10) return 0;
	var spent = getTotalHeirloomRefundValue(heirloom,true);
	spent += 1e6
	var mult = (heirloom.rarity >= 11) ? 10000 : 4000;
	if (heirloom.rarity >= 12) mult *= Math.pow(1.5, (heirloom.rarity - 11));
	var bonus = (log10(spent) * mult);
	if (equipped) game.global.gammaMult = bonus;
	return bonus;
}

function calcHeirloomBonusDecimal(type, name, number, getValueOnly){
	var mod = getHeirloomBonus(type, name);
	if (!mod) return number;
	if (getValueOnly) return mod;
	if (mod <= 0) return number;
	return number.mul((mod / 100) + 1);
}

function calcHeirloomBonus(type, name, number, getValueOnly){
	var mod = getHeirloomBonus(type, name);
	if (!mod) return number;
	if (getValueOnly) return mod;
	if (mod <= 0) return number;
	return (number * ((mod / 100) + 1));
}

function populateHeirloomWindow(){
	//Reset
	hideHeirloomSelectButtons();
	//Equipped hat
	document.getElementById("ShieldEquipped").innerHTML = generateHeirloomIcon(game.global.ShieldEquipped, "Equipped");
	document.getElementById("ShieldEquippedName").innerHTML = (typeof game.global.ShieldEquipped.name !== 'undefined') ? game.global.ShieldEquipped.name : "Nothing.";
	//Equipped staff
	document.getElementById("StaffEquipped").innerHTML = generateHeirloomIcon(game.global.StaffEquipped, "Equipped");
	document.getElementById("StaffEquippedName").innerHTML = (typeof game.global.StaffEquipped.name !== 'undefined') ? game.global.StaffEquipped.name : "Nothing.";
	var coreContainer = document.getElementById('CoreEquippedContainer');
	var staffContainer = document.getElementById('StaffEquippedContainer');
	var shieldContainer = document.getElementById('ShieldEquippedContainer');
	if (game.stats.coresFound.value > 0 || game.stats.coresFound.valueTotal > 0){
		coreContainer.style.display = 'inline-block';
		swapClass('col', 'col-xs-4', staffContainer);
		swapClass('col', 'col-xs-4', shieldContainer);
		document.getElementById("CoreEquipped").innerHTML = generateHeirloomIcon(game.global.CoreEquipped, "Equipped");
		document.getElementById("CoreEquippedName").innerHTML = (typeof game.global.CoreEquipped.name !== 'undefined') ? game.global.CoreEquipped.name : "Nothing.";
	}
	else{
		coreContainer.style.display = 'none';
		swapClass('col', 'col-xs-6', staffContainer);
		swapClass('col', 'col-xs-6', shieldContainer);
	}
	displayAddCarriedBtn();
	displayCarriedHeirlooms();
	displayExtraHeirlooms();
	document.getElementById("nullifiumCount").innerHTML = prettify(game.global.nullifium);
	document.getElementById("recycleAllHeirloomsBtn").style.display = (game.global.heirloomsExtra.length) ? "inline-block" : "none";
	if (game.options.menu.showHeirloomAnimations.enabled){
		var fidgetSpinners = document.getElementsByClassName('heirloomRare8');
		for (var x = 0; x < fidgetSpinners.length; x++){
			fidgetSpinners[x].style.animationDelay = "-" + ((new Date().getTime() / 1000) % 30).toFixed(1) + "s";
		}
	}
	updateHeirloomSpirestoneCount();
}

function heirloomSort(a,b){
    if (a.rarity > b.rarity) return -1;
	if (a.rarity < b.rarity) return 1;
	if (a.type == b.type) return 0;
	if (a.type == "Core") return -1;
	if (b.type == "Core") return 1;
	if (a.type == "Shield") return -1;
	if (b.type == "Shield") return 1;
	return 0;
}

function sortHeirlooms(){
	game.global.heirloomsExtra.sort(heirloomSort);
	populateHeirloomWindow();
}

function displayCarriedHeirlooms(){
	var tempHtml = "";
	for (var x = 0; x < game.global.heirloomsCarried.length; x++){
		if (game.global.heirloomsCarried[x] == null) {
			game.global.heirloomsCarried.splice(x, 1);
			x--;
			continue;
		}
		tempHtml += generateHeirloomIcon(game.global.heirloomsCarried[x], "Carried", x);
	}
	if (!tempHtml) tempHtml += "You are not carrying any Heirlooms";
	document.getElementById("carriedHeirloomsHere").innerHTML = tempHtml;
}

function getNextCarriedCost(){
	return (game.heirlooms.values[game.global.maxCarriedHeirlooms - 1] * 4);
}

function getMaxCarriedHeirlooms(){
	var spires = game.global.spiresCompleted;
	if (spires > 3) spires = 3;
	return game.global.maxCarriedHeirlooms + spires;
}

function displayAddCarriedBtn(){
	var realMaxHeirlooms = getMaxCarriedHeirlooms();
	var text = " - You can carry <b>" + realMaxHeirlooms + "</b> additional Heirloom" + needAnS(realMaxHeirlooms) + " through the Portal.";
	if (game.global.maxCarriedHeirlooms < game.heirlooms.values.length){
		var cost = getNextCarriedCost();
		text += " +1 slot at <b>" + prettify(cost) + "</b> Nu!"
	}
	document.getElementById("carriedHeirloomsText").innerHTML = text;
}

//RIP buying carried slots
// function addCarried(confirmed){ 
// 	if (game.global.maxCarriedHeirlooms > game.heirlooms.values.length){
// 		elem.style.display = "none";
// 		return;
// 	}
// 	var cost = getNextCarriedCost();
// 	if (game.global.nullifium < cost) return;
// 	if (!confirmed) {
// 		tooltip('confirm', null, 'update', 'You are about to purchase 1 extra slot to carry Heirlooms through the Portal for ' + cost + ' Nullifium. Are you sure?' , 'addCarried(true)', 'Upgrade Carried Slots');
// 		return;
// 	}
// 	game.global.nullifium -= cost;
// 	game.global.maxCarriedHeirlooms++;
// 	populateHeirloomWindow();
// }

function toggleHeirloomHelp(){
	if (usingScreenReader){
		var text = "Heirlooms are powerful items that can drop with a variety of bonuses and a variety of rarities. You will earn one Heirloom every time a Void Map is completed, and you have a better chance to get higher rarities if you complete the Void Map at higher zones. You can recycle extra Heirlooms to earn a special new resource called Nullifium, and you can use this Nullifium to upgrade the Heirlooms you want to keep! ";
		text += "To interract with Heirlooms while using a Screen Reader, there are a few keyboard shortcuts. Your Nullifium count is displayed in an H1, so you can always check with 1 or shift 1 while on this screen. Press 2 or shift 2 to move to your equipped Heirlooms, 3 or shift 3 to move to your carried Heirlooms, and 4 or shift 4 to move to your extra Heirlooms. Press B to find selectable Heirlooms."
		text += "Your Extra Heirlooms will be automatically recycled whenever you use your portal. You can carry a limited amount of Heirlooms back through the portal with you, but they must be in your Carried inventory. "
		screenReaderAssert(text);
		return;
	}
	var elem = document.getElementById("heirloomHelp");
	if (elem.style.display == 'block'){
		elem.style.display = 'none';
	}
	else{
		document.getElementById("heirloomDropChances").style.display = 'none';
		elem.style.display = 'block';
	}

}

function toggleHeirloomChances(){
	var chanceElem = document.getElementById('heirloomDropChances');
	if (chanceElem.style.display == 'block'){
		chanceElem.style.display = 'none';
	}
	else{
		document.getElementById("heirloomHelp").style.display = 'none';
		chanceElem.style.display = 'block';
		setHeirRareText(false, true);
	}
}

function displayExtraHeirlooms(){
	var tempHtml = "";
	var extraExtraText = game.global.heirloomsExtra.length;
	if (!extraExtraText) {
		document.getElementById("extraHeirloomsHere").innerHTML = "You have no extra Heirlooms";
		document.getElementById("extraHeirloomsText").innerHTML = "";
		return;
	}
	for (var y = 0; y < extraExtraText; y++){
		tempHtml += generateHeirloomIcon(game.global.heirloomsExtra[y], "Extra", y);
	}
	document.getElementById("extraHeirloomsHere").innerHTML = tempHtml;
	var s = (extraExtraText > 1) ? "s" : "";
	var heirloomExtraText = " - " + extraExtraText + " Heirloom" + s + ", recycled for " + prettify(recycleAllExtraHeirlooms(true)) + " Nu";
	if (game.global.spiresCompleted >= 1) heirloomExtraText += " and " + prettify(recycleAllExtraHeirlooms(false, true)) + " Ss";
	heirloomExtraText += " on Portal";
	document.getElementById("extraHeirloomsText").innerHTML = heirloomExtraText;
	document.getElementById("recycleAllHeirloomsBtn").style.display = (game.global.heirloomsExtra.length) ? "inline-block" : "none";
	if (game.options.menu.showHeirloomAnimations.enabled){
		var fidgetSpinners = document.getElementById("extraHeirloomsHere").getElementsByClassName('heirloomRare8');
		for (var x = 0; x < fidgetSpinners.length; x++){
			fidgetSpinners[x].style.animationDelay = "-" + ((new Date().getTime() / 1000) % 30).toFixed(1) + "s";
		}
	}
}

function selectHeirloom(number, location, noScreenUpdate){
	hideHeirloomSelectButtons();
	game.global.selectedHeirloom = [number, location];
	if (!noScreenUpdate) populateHeirloomWindow();
	var heirloom = game.global[location];
	if (number > -1) heirloom = heirloom[number];
	switch (location){
		case "StaffEquipped":
		case "ShieldEquipped":
		case "CoreEquipped":
			document.getElementById("equippedHeirloomsBtnGroup").style.visibility = "visible";
			if (location != "CoreEquipped"){
				document.getElementById('heirloomPortalBtn').style.display = 'inline-block';
				document.getElementById('heirloomPortalBtn').innerHTML = (heirloom.onPortal) ? "Don't Equip On Portal" : "Equip On Portal";
			}
			else document.getElementById('heirloomPortalBtn').style.display = 'none';
			break;
		case "heirloomsCarried":
			document.getElementById("carriedHeirloomsBtnGroup").style.visibility = "visible";
			document.getElementById("equipHeirloomBtn").innerHTML = (typeof game.global[heirloom.type + "Equipped"].name === 'undefined') ? "Equip" : "Swap";
			break;
		case "heirloomsExtra":
			document.getElementById("extraHeirloomsBtnGroup").style.visibility = "visible";
			document.getElementById("equipHeirloomBtn2").innerHTML = (typeof game.global[heirloom.type + "Equipped"].name === 'undefined') ? "Equip" : "Swap";
			if (game.global.heirloomsCarried.length < getMaxCarriedHeirlooms()) swapClass("heirloomBtn", "heirloomBtnActive", document.getElementById("carryHeirloomBtn"));
			document.getElementById("recycleHeirloomBtn").innerHTML = "Recycle (+" + prettify(getHeirloomRecycleValue(heirloom)) + ((heirloom.type == "Core") ? " Spirestones)" : " Nullifium)");
			break;
	}
	displaySelectedHeirloom(undefined, undefined, undefined, undefined, undefined, undefined, true);
}

function recycleHeirloom(confirmed){
	var heirloom = getSelectedHeirloom();
	if (game.global.selectedHeirloom[0] == -1 || game.global.selectedHeirloom[1] == "heirloomsCarried") return;
	var value;
	var resource;
	value = getHeirloomRecycleValue(heirloom);
	if (heirloom.type == "Core"){
		resource = "Spirestones";
	}
	else{
		resource = "Nullifium";
	}
	if (!confirmed) {
		tooltip('confirm', null, 'update', 'You are about to recycle ' + heirloom.name + ' for ' + prettify(value) + ' ' + resource + '. Are you sure?' , 'recycleHeirloom(true)', 'Recycle Heirloom');
		return;
	}
	if (heirloom.type == "Core") playerSpire.giveSpirestones(value);
	else game.global.nullifium += value;
	game.global.heirloomsExtra.splice(game.global.selectedHeirloom[0], 1);
	if (game.global.maxCarriedHeirlooms < game.heirlooms.values.length){
		var cost = getNextCarriedCost();
		if (game.global.nullifium >= cost) game.global.maxCarriedHeirlooms++;
	}
	populateHeirloomWindow();
}

function recycleAllExtraHeirlooms(valueOnly, checkCores){
	var extraHeirlooms = game.global.heirloomsExtra;
	var value = 0;
	var coreValue = 0;
	for (var item in extraHeirlooms){
		var heirloom = extraHeirlooms[item];
		if (heirloom.type == "Core"){
			if (valueOnly) continue;
			coreValue += getHeirloomRecycleValue(heirloom);
		}
		else {
			if (checkCores) continue;
			value += getHeirloomRecycleValue(heirloom);
		}
	}
	if (valueOnly) return value;
	if (checkCores) return coreValue;
	game.global.nullifium += value;
	playerSpire.giveSpirestones(coreValue);
	game.global.heirloomsExtra = [];
	if (game.global.maxCarriedHeirlooms < game.heirlooms.values.length){
		var cost = getNextCarriedCost();
		if (game.global.nullifium >= cost) game.global.maxCarriedHeirlooms++;
	}
}

function recycleAllHeirloomsClicked(confirmed){
	if (!confirmed){
		var s = (game.global.heirloomsExtra.length == 1) ? "" : "s";
		var spirestones = recycleAllExtraHeirlooms(false, true);
		var messageString = "You have " + game.global.heirloomsExtra.length + " extra Heirloom" + s + ", which will be recycled for " + prettify(recycleAllExtraHeirlooms(true)) + " Nullifium " + ((spirestones > 0) ? " and " + prettify(spirestones) + " Spirestones" : "") + ". Are you sure?";
		tooltip("confirm", null, "update", messageString, "recycleAllHeirloomsClicked(true)", "Recycle All Heirlooms");
		return;
	}
	recycleAllExtraHeirlooms();
	populateHeirloomWindow();
}

function recalculateHeirloomBonuses(){
	for (var item in game.heirlooms.Staff) game.heirlooms.Staff[item].currentBonus = 0;
	for (var item in game.heirlooms.Shield) game.heirlooms.Shield[item].currentBonus = 0;
	for (var item in game.heirlooms.Core) game.heirlooms.Core[item].currentBonus = 0;
	if (game.global.StaffEquipped){
		for (var item in game.global.StaffEquipped.mods){
			var mod = game.global.StaffEquipped.mods[item];
			game.heirlooms.Staff[mod[0]].currentBonus = mod[1];
		}
	}
	if (game.global.ShieldEquipped){
		for (var item in game.global.ShieldEquipped.mods){
			var mod = game.global.ShieldEquipped.mods[item];
			game.heirlooms.Shield[mod[0]].currentBonus = mod[1];
		}
	}
	if (game.global.CoreEquipped){
		for (var item in game.global.CoreEquipped.mods){
			var mod = game.global.CoreEquipped.mods[item];
			game.heirlooms.Core[mod[0]].currentBonus = mod[1];
		}
	}
}


function unequipHeirloom(heirloom, toLocation, noScreenUpdate){
	if (!noScreenUpdate) cancelTooltip();
	if (!heirloom) heirloom = getSelectedHeirloom();
	if (!toLocation) toLocation = "heirloomsCarried";
	if (toLocation == "heirloomsCarried" && game.global.heirloomsCarried.length >= getMaxCarriedHeirlooms()){
		tooltip("Unequip Heirloom", null, 'update');
		return;
	}
	game.global[heirloom.type + "Equipped"] = {};
	if (toLocation == "heirloomsCarried") game.global.heirloomsCarried.push(heirloom);
	else game.global.heirloomsExtra.push(heirloom);
	//Remove bonuses
	for (var item in game.heirlooms[heirloom.type]){
		var stat = game.heirlooms[heirloom.type][item];
		if (item == 'trimpHealth') {
			if (game.global.universe == 2) addSoldierHealth((1 / (1 + (stat.currentBonus / 1000))) - 1);
			else addSoldierHealth((1 / (1 + (stat.currentBonus / 100))) - 1);
		}
		game.heirlooms[heirloom.type][item].currentBonus = 0;
	}
	if (!noScreenUpdate) populateHeirloomWindow();
	updateGammaStacks();
	updateAllBattleNumbers();
	calculateParityBonus(true);
	getHazardGammaBonus();
}

function toggleHeirloomOnPortal(){
	var selected = getSelectedHeirloom();
	var on = (selected.onPortal) ? false : true;
	var id = selected.id;
	var type = selected.type;
	var equipped = game.global[type + "Equipped"];
	if (on && id == equipped.id) equipped.onPortal = true;
	else if (equipped) equipped.onPortal = false;
	
	for (var x = 0; x < game.global.heirloomsCarried.length; x++){
		var heirloom = game.global.heirloomsCarried[x];
		if (on && heirloom.id == id) heirloom.onPortal = true;
		else if (heirloom.type == type) heirloom.onPortal = false;
	}
	selectHeirloom(game.global.selectedHeirloom[0], game.global.selectedHeirloom[1])
}

function checkEquipPortalHeirlooms(){
	var shieldDone = false;
	var staffDone = false;
	var shieldId = -1;
	var staffId = -1;
	if (game.global.StaffEquipped && game.global.StaffEquipped.onPortal) staffDone = true;
	if (game.global.ShieldEquipped && game.global.ShieldEquipped.onPortal) shieldDone = true;
	for (var x = 0; x < game.global.heirloomsCarried.length; x++){
		if (staffDone && shieldDone) break;
		var heirloom = game.global.heirloomsCarried[x];
		if ((staffDone && heirloom.type == "Staff") || (shieldDone && heirloom.type == "Shield")) continue;
		if (heirloom.onPortal){
			if (heirloom.type == "Staff") {
				staffId = heirloom.id;
				staffDone = true;
			}
			else if (heirloom.type == "Shield"){
				shieldId = heirloom.id;
				shieldDone = true;
			}
		}
	}
	if (shieldId > -1) equipHeirloomById(shieldId, "Shield");
	if (staffId > -1) equipHeirloomById(staffId, "Staff");
}

function equipHeirloomById(id, type){
	if (game.global[type + "Equipped"].id == id) return false;
	for (var x = 0; x < game.global.heirloomsCarried.length; x++){
		if (game.global.heirloomsCarried[x].id == id) {
			selectHeirloom(x, 'heirloomsCarried', true);
			equipHeirloom(true);
			return;
		}
	}
}

function equipHeirloom(noScreenUpdate){
	var heirloom = getSelectedHeirloom();
	if (heirloom == game.global.ShieldEquipped || heirloom == game.global.StaffEquipped) return;
	if (game.global.selectedHeirloom[1] == "heirloomsExtra") game.global.heirloomsExtra.splice(game.global.selectedHeirloom[0], 1);
	else game.global.heirloomsCarried.splice(game.global.selectedHeirloom[0], 1);
	if (typeof game.global[heirloom.type + "Equipped"].name !== 'undefined') unequipHeirloom(game.global[heirloom.type + "Equipped"], game.global.selectedHeirloom[1], noScreenUpdate);
	game.global[heirloom.type + "Equipped"] = heirloom;
	//Add bonuses
	for (var item in heirloom.mods){
		var bonus = heirloom.mods[item][1];
		var name = heirloom.mods[item][0];
		game.heirlooms[heirloom.type][heirloom.mods[item][0]].currentBonus = bonus;
		if (name == 'trimpHealth'){
			if (game.global.universe == 2) addSoldierHealth(bonus / 1000);
			else addSoldierHealth(bonus / 100);
		}
	}
	if (!noScreenUpdate) populateHeirloomWindow();
	if (checkLowestHeirloom() >= 5) giveSingleAchieve("Swag");
	if (checkLowestHeirloom() >= 7) giveSingleAchieve("Swagmatic");
	updateAllBattleNumbers();
	calculateParityBonus(true);
	getHazardGammaBonus();
}

function checkLowestHeirloom(){
	if (typeof game.global.StaffEquipped.rarity === 'undefined' || typeof game.global.ShieldEquipped.rarity === 'undefined') return -1;
	var lowest = game.global.StaffEquipped.rarity;
	if (lowest > game.global.ShieldEquipped.rarity) lowest = game.global.ShieldEquipped.rarity;
	return lowest;
}

function carryHeirloom(){
	var heirloom = getSelectedHeirloom();
	if (game.global.heirloomsCarried.length >= getMaxCarriedHeirlooms()) return;
	game.global.heirloomsExtra.splice(game.global.selectedHeirloom[0], 1);
	game.global.heirloomsCarried.push(heirloom);
	populateHeirloomWindow();
}

function stopCarryHeirloom(){
	var heirloom = getSelectedHeirloom();
	heirloom.onPortal = false;
	game.global.heirloomsCarried.splice(game.global.selectedHeirloom[0], 1);
	game.global.heirloomsExtra.push(heirloom);
	populateHeirloomWindow();
}

function getSelectedHeirloom(locationOvr, indexOvr){
	if (typeof locationOvr === 'undefined') locationOvr = game.global.selectedHeirloom[1];
	if (typeof indexOvr === 'undefined') indexOvr = game.global.selectedHeirloom[0];
	var heirloom = game.global[locationOvr];
	if (indexOvr > -1) heirloom = heirloom[indexOvr];
	return heirloom;
}

function hideHeirloomSelectButtons(){
	document.getElementById("equippedHeirloomsBtnGroup").style.visibility = "hidden";
	document.getElementById("carriedHeirloomsBtnGroup").style.visibility = "hidden";
	document.getElementById("extraHeirloomsBtnGroup").style.visibility = "hidden";
	swapClass("heirloomBtn", "heirloomBtnInactive", document.getElementById("carryHeirloomBtn"));
	document.getElementById("selectedHeirloom").innerHTML = "";
	document.getElementById("modBreakdown").style.display = "none";
}

function generateHeirloomIcon(heirloom, location, number){
	if (typeof heirloom.name === 'undefined') return "<span onmouseover='tooltip(\"Empty Slot\", \"customText\", event, \"Click on an Heirloom from your inventory to equip it!\")' onmouseout='tooltip(\"hide\")' class='icomoon icon-sad3'></span>";
	var icon = getHeirloomIcon(heirloom);
	var animated = (game.options.menu.showHeirloomAnimations.enabled) ? "animated " : "";
	var html = '<span role="button" aria-label="' + heirloom.name + '"  class="heirloomThing ' + animated + 'heirloomRare' + heirloom.rarity;
	if (location == "Equipped") html += ' equipped';
	var locText = "";
	if (location == "Equipped") locText += '-1,\'' + heirloom.type + 'Equipped\'';
	else locText += number + ', \'heirlooms' + location + '\'';
	html += '" onmouseover="tooltip(\'Heirloom\', null, event, null, ' + locText + ')" onmouseout="tooltip(\'hide\')" onclick="selectHeirloom(';
	html += locText + ', this)"> <span class="' + icon + '"></span>';
	if (heirloom.onPortal) html += "<span class='icomoon icon-star portalHeirloom'></span>";
	html += '</span>';
	return html;
}

function getHeirloomIcon(heirloom){
	var prefix = "";
	var iconName = heirloom.icon;
	if (!iconName){
		var type = heirloom.type;
		heirloom.icon = ((type == "Core") ? 'adjust' : (type == "Shield") ? '*shield3' : 'grain');
		iconName = heirloom.icon;
	}
	if (iconName.charAt(0) == "*") {
		iconName = iconName.replace("*", "");
		prefix =  "icomoon icon-"
	}
	else prefix = "glyphicon glyphicon-";
	return prefix + iconName;
}

function htmlEncode(text) {
	text = replaceAll(text, "&", "&amp;");
	text = replaceAll(text, "'", "&apos;");
	text = replaceAll(text, '"', "&quot;");
	text = replaceAll(text, "<", "&lt;");
	text = replaceAll(text, ">", "&gt;");
	return text;
}

//from stackoverflow.com/questions/1144783
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function saveHeirloomIcon(icon){
	getSelectedHeirloom().icon = icon;
	populateHeirloomWindow();
	displaySelectedHeirloom();
	cancelTooltip();
}

var lastDisplayedHeirloom = new Date().getTime();
function displaySelectedHeirloom(modSelected, selectedIndex, fromTooltip, locationOvr, indexOvr, fromPopup, fromSelect){
	if (fromPopup && !game.options.menu.voidPopups.enabled) return;
	var heirloom = getSelectedHeirloom(locationOvr, indexOvr);
	var icon = getHeirloomIcon(heirloom);
	var animated = (game.options.menu.showHeirloomAnimations.enabled) ? "animated " : "";
	var html = '<div class="selectedHeirloomItem ' + animated + 'heirloomRare' + heirloom.rarity + '"><div class="row selectedHeirloomRow"><div onclick="tooltip(\'Change Heirloom Icon\', null, \'update\')" class="col-xs-2 selectedHeirloomIcon" id="' + ((fromTooltip) ? 'tooltipHeirloomIcon' : 'selectedHeirloomIcon') + '"><span class="' + icon + '"></span></div><div class="col-xs-10"><h5 onclick="renameHeirloom(';
	if (fromPopup) html += 'false, true';
	html += ')" id="selectedHeirloomTitle" style="margin: 10px 0">' + heirloom.name + '</h5> '
	if (!fromTooltip) html += '<span id="renameContainer"></span>';
	html+= '</div></div>';
	var isEquipped = (game.global.selectedHeirloom[1] == "StaffEquipped" || game.global.selectedHeirloom[1] == "ShieldEquipped" || game.global.selectedHeirloom[1] == "CoreEquipped");
	var addBr = false;
	if (!fromPopup && !fromTooltip && isEquipped){
		html += '<span class="heirloomEquipped">Equipped</span>&nbsp;';
		addBr = true;
	}
	var spent = getTotalHeirloomRefundValue(heirloom, true);
	var res = (heirloom.type == "Core") ? "Ss" : "Nu";
	if (spent <= 0) spent = 0;
	html += "<span class='heirloomSpent'>" + prettify(spent);
	var allowed;
	if (heirloom.type == "Core"){
		allowed = playerSpire.spirestones;
	}
	else{
		allowed = Math.floor(game.global.nullifium * getNuSpendMult());
	}
	html += " / " + (prettify(allowed));
	html += " " + res + " Allocated";
	html += " - " + prettify(Math.max((allowed - spent), 0)) + " Available";
	html += "</span>";
	html += "<br/>";
	var srText = "Selected " + heirloom.name + ", " + ((isEquipped) ? "your equipped " + heirloom.type : "unequipped " + heirloom.type) + ". Has the following mods: ";
	var noneEmpty = true;
	var opacity = (modSelected) ? 'style="opacity: 0.5" ' : '';
	for (var x = 0; x < heirloom.mods.length; x++){
		srText += heirloom.mods[x][0] + " - " + prettify(scaleHeirloomModUniverse(heirloom.type, heirloom.mods[x][0], heirloom.mods[x][1])) + "%. ";
		if (heirloom.mods[x][0] == "empty"){
				html += '- <span role="button" class="heirloomMod heirloomModEmpty" ';
				if (modSelected && selectedIndex != x) html += opacity;
				html += 'onclick="selectMod(' + x;
				if (fromPopup) html += ', true';
				html+= ')">Empty</span><br/>';
			}
		else{
			var nextCost = getModUpgradeCost(heirloom, x, 1);
			var icon2;
			if (heirloom.type == "Core") icon2 = (allowed - spent >= nextCost) ? "!" : "&bull;";
			else icon2 = (allowed - spent >= nextCost) ? "!" : "&bull;";
			html += icon2 + ' <span role="button" class="heirloomMod" ';
			if (modSelected && selectedIndex != x) html += opacity;
			html += 'onclick="selectMod(' + x;
			if (fromPopup) html += ', true';
			html += ')">' + prettify(scaleHeirloomModUniverse(heirloom.type, heirloom.mods[x][0], heirloom.mods[x][1])) + '% ' + game.heirlooms[heirloom.type][heirloom.mods[x][0]].name + ((heirloom.mods[x][0] == 'voidMaps' && heirloom.rarity >= 10) ? "*" : "") + '</span><br/>';
		}
	}
	if (heirloom.type == "Shield" && heirloom.rarity >= 10){
		var innerHtml = prettify(scaleHeirloomModUniverse("Shield", "gammaBurst", getHazardGammaBonus(heirloom))) + '% Gamma Burst (Innate)';
		html += "<span data-set='FEED ME' data-og='" + innerHtml + "' onmouseover='htmlTextReplace(this, true)' onmouseout='htmlTextReplace(this,false)' role='button' class='heirloomMod innate'>";
		html += innerHtml + '</span>'
	}
	if (heirloom.type == "Staff" && heirloom.rarity >= 10){
		var innerHtml = prettify((getHazardParityMult(heirloom) - 1) * 100) + '% Parity (Innate)';
		html += "<span data-set='FEED ME' data-og='" + innerHtml + "' onmouseover='htmlTextReplace(this, true)' onmouseout='htmlTextReplace(this,false)' role='button' class='heirloomMod innate'>";
		html += innerHtml + '</span><span class="heirloomMod innate" style="font-size: 1vw">Gain a gathering bonus based on worker distribution equality</span>'
	}
	if (fromTooltip) return html;
	screenReaderAssert(srText + "<br/><br/>Press 5 or shift 5 then B to view this Heirloom and its mods.");
	if (fromPopup){
		document.getElementById("heirloomsPopupHere").innerHTML = html;
		document.getElementById("heirloomsPopup").style.display = "inline-block";
		return;
	}
	if (fromSelect) html += "<span class='heirloomRenameTip'>Tip: You can click on this Heirloom's name or icon in this window to change them!</span>"
	document.getElementById("selectedHeirloom").innerHTML = html;
	if (heirloom.rarity == 8 && animated)
		document.getElementById('selectedHeirloomIcon').style.animationDelay = "-" + ((new Date().getTime() / 1000) % 30).toFixed(1) + "s";
}

function htmlTextReplace(elem, mouseOn){
	var og = elem.getAttribute('data-og');
	var set = elem.getAttribute('data-set');
	elem.innerHTML = (mouseOn) ? set : og;
}

function renameHeirloom(cancel, fromPopup){
	if (fromPopup && !swapFromPopup()) return;
	var inputText = document.getElementById("heirloomNameInput");
	var heirloom = getSelectedHeirloom();
	var titleElem = document.getElementById("selectedHeirloomTitle");
	var containerElem = document.getElementById("renameContainer");
	if (cancel){
		containerElem.innerHTML = "";
		titleElem.innerHTML = heirloom.name;
		return;
	}
	if (!inputText){
		containerElem.innerHTML = "<input maxlength='25' id='heirloomNameInput' value='" + heirloom.name + "'/> <span onclick='renameHeirloom()' class='renameHeirloomBtn'>Save</span><span class='renameHeirloomBtn' onclick='renameHeirloom(true)'>Cancel</span>";
		titleElem.innerHTML = "";
		return;
	}
	var value = inputText.value;
	if (value.length < 1) return;
	value = htmlEncode(value.substring(0, 25));
	heirloom.name = value;
	titleElem.innerHTML = value;
	if (game.global.selectedHeirloom[1] == (heirloom.type + "Equipped")) document.getElementById(heirloom.type + "EquippedName").innerHTML = value;
	containerElem.innerHTML = "";
}

function closeHeirPopup(){
	document.getElementById("heirloomsPopup").style.display = "none";
}

function swapFromPopup(){
	closeHeirPopup();
	if (!heirloomsShown) toggleHeirlooms();
	if (game.global.heirloomsExtra.length) {
		game.global.selectedHeirloom = [game.global.heirloomsExtra.length - 1, "heirloomsExtra"];
		displaySelectedHeirloom();
		return true;
	}
	return false;
}

function selectMod(which, fromPopup){
	if (fromPopup && !swapFromPopup()) return;
	selectedMod = which;
	displaySelectedHeirloom(true, which);
	var heirloom = getSelectedHeirloom();
	var mod = heirloom.mods[which];
	var resourceShort = "Nu";
	var isCore = (heirloom.type == "Core");
	var resourceCount = game.global.nullifium * getNuSpendMult();
	if (isCore){
		resourceShort = "Ss";
		resourceCount = playerSpire.spirestones;
	}
	resourceCount -= getTotalHeirloomRefundValue(heirloom, true);
	var modConfig = game.heirlooms[heirloom.type][mod[0]];
	document.getElementById("modBreakdown").style.display = "block";
	buildModOptionDdl(heirloom.type, heirloom.rarity, mod[0]);
	document.getElementById("modUpgradeBox").style.display = (mod[0] == "empty" || checkModCap(mod, modConfig, heirloom)) ? "none" : "block";
	var replaceCost = getModReplaceCost(heirloom, mod);
	var upgradeCost = getModUpgradeCost(heirloom, which);
	var replaceBtn = document.getElementById("modReplaceBtn");
	var upgradeBtn = document.getElementById("modUpgradeBtn");
	var upgradeBtn10 = document.getElementById("modUpgradeBtn10");
	var upgradeBtn100 = document.getElementById("modUpgradeBtn100");
	var upgradeCost10 = getModUpgradeCost(heirloom, which, 10);
	var upgradeCost100 = getModUpgradeCost(heirloom, which, 100);
	for (const [cost, elem] of [[replaceCost, replaceBtn], [upgradeCost, upgradeBtn], [upgradeCost10, upgradeBtn10], [upgradeCost100, upgradeBtn100]]) {
		let cantAfford = (cost > resourceCount) 
		let newClass = cantAfford ? "heirloomBtnInactive" : "heirloomBtnActive";
		swapClass("heirloomBtn", newClass, elem);
		elem.setAttribute("aria-disabled", cantAfford)
	}
	replaceBtn.innerHTML = (mod[0] == "empty") ? "Add (" + prettify(replaceCost) + " " + resourceShort + ")" : "Replace (" + prettify(replaceCost) + " " + resourceShort + ")";
	var step = (typeof modConfig.steps !== 'undefined') ? modConfig.steps : game.heirlooms.defaultSteps;
	step = step[heirloom.rarity];
	var upgradeCostText = "Each upgrade adds " + prettify(scaleHeirloomModUniverse(heirloom.type, mod[0], step[2])) + "%";
	if (modConfig.max){
		if (mod[1] < modConfig.max[heirloom.rarity])
			upgradeCostText = "<span class='upgradeCostTextMax'><span>" + upgradeCostText + "</span><span>Max of " + scaleHeirloomModUniverse(heirloom.type, mod[0], modConfig.max[heirloom.rarity]) + "%</span></span>"
		else upgradeCostText = "At Max!";
	}
	document.getElementById("modUpgradeCost").innerHTML = upgradeCostText;
	upgradeBtn.innerHTML = "x1<br/>" + prettify(upgradeCost) + " " + resourceShort + "";
	upgradeBtn10.innerHTML = "x10<br/>" + prettify(upgradeCost10) + " " + resourceShort + "";
	upgradeBtn100.innerHTML = "x100<br/>" + prettify(upgradeCost100) + " " + resourceShort + "";
	var modDescElem = document.getElementById("specialModDescription");
	if (modConfig.specialDescription && (mod[0] != 'voidMaps' || heirloom.rarity >= 10)){
		modDescElem.style.display = "block";
		modDescElem.innerHTML = modConfig.specialDescription(scaleHeirloomModUniverse(heirloom.type, mod[0], mod[1]));
		modDescElem.className = "specDesc" + heirloom.rarity;
	}
	else modDescElem.style.display = "none";
}

function checkModCap(mod, modConfig, heirloom){
	if (!modConfig.cap) return false;
	var steps = (modConfig.steps) ? modConfig.steps : game.heirlooms.defaultSteps;
	steps = steps[heirloom.rarity];
	if (mod[1] >= steps[1]) return true;
	return false;
}

function getModUpgradeValue(heirloom, modIndex, count){
	if (!count) count = 1;
	var mod = heirloom.mods[modIndex]
	var modConfig = game.heirlooms[heirloom.type][mod[0]];
	var step = (typeof modConfig.steps !== 'undefined') ? modConfig.steps : game.heirlooms.defaultSteps;
	step = step[heirloom.rarity];
	var result = parseFloat(mod[1] + (step[2] * count));
	if (modConfig.max && result > modConfig.max[heirloom.rarity]) return false;
	result = (Math.round(result * 100) / 100);
	return (result);
}

function getModUpgradeCost(heirloom, modIndex, count){
	if (!count) count = 1;
	var mod = heirloom.mods[modIndex];
	var modConfig = game.heirlooms[heirloom.type][mod[0]];
	if (modConfig.max && getModUpgradeValue(heirloom, modIndex, count) === false) return Infinity;
	var cost = 0;
	for (var x = 0; x < count; x++){
		var tempCost = (getHeirloomBaseValue(heirloom) / 2);
		tempCost *= getStepPriceIncrease(heirloom, mod, x);
		cost += Math.floor(tempCost);
	}
	return Math.floor(cost);
}

function getStepPriceIncrease(heirloom, mod, add){
	if (!add) add = 0;
	var modConfig = game.heirlooms[heirloom.type][mod[0]];
	var priceIncrease = game.heirlooms.priceIncrease;
	var step = (typeof modConfig.steps !== 'undefined') ? modConfig.steps : game.heirlooms.defaultSteps;
	step = step[heirloom.rarity];
	if (mod[1] + (step[2] * add) <= step[1]) return 1;
	return Math.pow(priceIncrease[heirloom.rarity], (((mod[1] - step[1]) / step[2]) + add));
}

function getTotalHeirloomRefundValue(heirloom, ignoreBase){
	var total = 0;
	for (var x = 0; x < heirloom.mods.length; x++){
		var thisMod = heirloom.mods[x];
		//Create a dummy heirloom with a copy of this mod at 0 upgrades to count price
		var dummyHeirloom = setupDummyHeirloom(heirloom, thisMod);
		total += countPriceOfUpgrades(dummyHeirloom, heirloom.mods[x][3]);
	}
	var baseValue;
	if (game.heirlooms.recycleOverride[heirloom.rarity] != -1) baseValue = game.heirlooms.recycleOverride[heirloom.rarity];
	else baseValue = (getHeirloomBaseValue(heirloom) / 2);
	if (ignoreBase){
		baseValue = 0;
		if (typeof heirloom.replaceSpent === 'number') baseValue += heirloom.replaceSpent;
	}
	var result = Math.floor(total) + Math.floor(baseValue);
	if (isNumberBad(result)) return 0;
	return result;
}

function getHeirloomRecycleValue(heirloom){
	if (heirloom.type == "Core") return (getHeirloomBaseValue(heirloom) / 2);
	var baseValue;
	if (game.heirlooms.recycleOverride[heirloom.rarity] != -1) baseValue = game.heirlooms.recycleOverride[heirloom.rarity];
	else baseValue = (getHeirloomBaseValue(heirloom) / 2);
	if (heirloom.nuMod) baseValue *= heirloom.nuMod;
	return baseValue;
}

function getHeirloomBaseValue(heirloom){
	if (heirloom.type == "Core") return game.heirlooms.coreValues(heirloom.rarity);
	var amt = game.heirlooms.values[heirloom.rarity];
	return amt;
}

function getRecycleValueByRarity(heirloomRarity){
	var base = 0;
	if (game.heirlooms.recycleOverride[heirloomRarity] != -1) base = game.heirlooms.recycleOverride[heirloomRarity];
	else base = (game.heirlooms.values[heirloomRarity] / 2);
	if (game.global.challengeActive == "Daily"){
		base *= (1 + (getDailyHeliumValue(countDailyWeight()) / 100));
	}
	if (autoBattle.oneTimers.Nullicious.owned && game.global.universe == 2) base *= autoBattle.oneTimers.Nullicious.getMult();
	if (game.global.universe == 2 && u2Mutations.tree.Nullifium.purchased) base *= 1.1;
	return base;
}

//Dummy heirloom for mod recycle price calculating
function setupDummyHeirloom(heirloom, mod){
	var modConfig = game.heirlooms[heirloom.type][mod[0]];
	var step = (typeof modConfig.steps !== 'undefined') ? modConfig.steps : game.heirlooms.defaultSteps;
	step = step[heirloom.rarity];
	var dummyMod = [mod[0], mod[1] - (mod[3] * step[2]), mod[2], 0, mod[4]];
	var dummyHeirloom = {rarity: heirloom.rarity, step: step[2], type: heirloom.type, mods: [dummyMod]};
	return dummyHeirloom;
}

function countPriceOfUpgrades(dummyHeirloom, count){
	var total = 0;
	for (var x = 0; x < count; x++){
		var newTotal = Math.ceil(getModUpgradeCost(dummyHeirloom, 0));
		if (newTotal == Infinity){
			console.log(dummyHeirloom); break;
		}
		total += newTotal;
		dummyHeirloom.mods[0][3]++;
		dummyHeirloom.mods[0][1] += dummyHeirloom.step;
		dummyHeirloom.mods[0][1] = (Math.round(dummyHeirloom.mods[0][1] * 100) / 100); //Damn you, javascript
	}
	return total;
}

function upgradeMod(confirmed, count){
	var heirloom = getSelectedHeirloom();
	if (!count) count = 1;
	var cost = Math.ceil(getModUpgradeCost(heirloom, selectedMod, count));
	if (cost == Infinity) return;
	var resource = heirloom.type == "Core" ? playerSpire.spirestones : (game.global.nullifium * getNuSpendMult());
	resource -= getTotalHeirloomRefundValue(heirloom, true);
	var resourceName = heirloom.type == "Core" ? "Spirestones" : "Nullifium";
	if (resource < cost) return;
	if (!confirmed && game.options.menu.boneAlerts.enabled == 1) {
		tooltip('confirm', null, 'update', 'You are about to upgrade ' + game.heirlooms[heirloom.type][heirloom.mods[selectedMod][0]].name + ((count > 1) ? ' ' + count + ' times' : '') + ' for ' + prettify(cost) + ' ' + resourceName + '. Are you sure?' , 'upgradeMod(true, ' + count + ')', 'Upgrade Mod');
		return;
	}
	var newBonus = getModUpgradeValue(heirloom, selectedMod, count);
	var mod = heirloom.mods[selectedMod];
	mod[1] = newBonus;
	mod[3] += count;
	if (game.global.selectedHeirloom[1] == "ShieldEquipped" || game.global.selectedHeirloom[1] == "StaffEquipped" || game.global.selectedHeirloom[1] == "CoreEquipped"){
		game.heirlooms[heirloom.type][heirloom.mods[selectedMod][0]].currentBonus = newBonus;
	}
	displaySelectedHeirloom();
	selectHeirloom(game.global.selectedHeirloom[0], game.global.selectedHeirloom[1]);
	selectMod(selectedMod);
	document.getElementById("nullifiumCount").innerHTML = prettify(game.global.nullifium);
	calculateParityBonus(true);
	getHazardGammaBonus();
}

function getNuSpendMult(){
	var mult = 1;
	if (game.talents.heirloom2.purchased) mult = 1.2;
	else if (game.talents.heirloom.purchased) mult = 1.1;
	if ((game.global.universe == 2 && Fluffy.isRewardActive('biggerbetterheirlooms')) || (game.global.universe == 1 && game.global.fluffyExp2 >= 357913941000)) mult += 0.3;
	return mult;
}

function getModReplaceCost(heirloom, mod){
	var value = getHeirloomBaseValue(heirloom);
	return (mod[0] == "empty") ? value : (value * 3);
}

function replaceMod(confirmed){
	var heirloom = getSelectedHeirloom();
	var resourceLong = "Nullifium";
	var resourceShort = "Nu";
	var isCore = (heirloom.type == "Core");
	var resourceCount = game.global.nullifium * getNuSpendMult();
	if (isCore){
		resourceLong = "Spirestones";
		resourceShort = "Ss";
		resourceCount = playerSpire.spirestones;
	}
	resourceCount -= getTotalHeirloomRefundValue(heirloom, true);
	var mod = heirloom.mods[selectedMod];
	if (!game.heirlooms.canReplaceMods[heirloom.rarity] && mod[0] != "empty") return;
	var cost = getModReplaceCost(heirloom, mod);
	var newModName = document.getElementById("modReplaceSelect").value;
	if (newModName == -1) return;
	var newMod = game.heirlooms[heirloom.type][newModName];
	if (typeof newMod === 'undefined'){
		console.log("something broke");
		return;
	}
	if (resourceCount < cost) return;
	if (!confirmed && game.options.menu.boneAlerts.enabled == 1) {
		var oldName = game.heirlooms[heirloom.type][heirloom.mods[selectedMod][0]].name;
		var text = (oldName == "Empty") ? "You are about to add " : "You are about to replace " + oldName + " with ";
		text += newMod.name + ' for ' + prettify(cost) + ' ' + resourceLong + '. ';
		text += " Are you sure?";
		var tipName = (oldName == "Empty") ? "Add Mod" : "Replace Mod";
		tooltip('confirm', null, 'update', text, 'replaceMod(true)', tipName);
		return;
	}

	if (!heirloom.replaceSpent) heirloom.replaceSpent = 0;
	heirloom.replaceSpent += cost;

	var steps = (typeof newMod.steps !== 'undefined') ? newMod.steps : game.heirlooms.defaultSteps;
	steps = steps[heirloom.rarity];
	mod[0] = newModName;
	if (!heirloom.repSeed)
		heirloom.repSeed = getRandomIntSeeded(game.global.heirloomSeed, 1, 10e6);
	mod[4] = getRandomIntSeeded(heirloom.repSeed++, 1, 10e6);
	steps = getRandomBySteps(steps, mod);
	mod[1] = steps[0];
	mod[2] = steps[1];
	mod[3] = 0;
	if (!game.heirlooms.canReplaceMods[heirloom.rarity]) {
		heirloom.mods.sort(function(a, b){
			a = a[0].toLowerCase();
			b = b[0].toLowerCase();
			if (a == "empty") return 1;
			if (b == "empty" || b > a) return -1;
			return a > b
		})
		var newIndex = heirloom.mods.indexOf(mod);
		if (newIndex >= 0) selectedMod = newIndex;
	}
	recalculateHeirloomBonuses();
	displaySelectedHeirloom();
	selectMod(selectedMod);
	document.getElementById("nullifiumCount").innerHTML = prettify(game.global.nullifium);
	if (game.global.spiresCompleted >= 1){
		updateHeirloomSpirestoneCount();
	}
}

function updateHeirloomSpirestoneCount(){
	document.getElementById("heirloomSpirestoneCount").innerHTML = "&nbsp;and <b>" + prettify(playerSpire.spirestones) + "</b> Spirestones";
}

function buildModOptionDdl(type, rarity, selectedMod){
	if (!game.heirlooms.canReplaceMods[rarity] && selectedMod != "empty"){
		document.getElementById('modReplaceBtn').style.display = 'none';
		document.getElementById('modReplaceSelect').style.display = 'none';
		document.getElementById('modCantReplace').style.display = 'block';
		document.getElementById('modCantReplace').innerHTML = "Can't replace mods other than 'Empty' at this tier."
		return;
	}
	else {
		document.getElementById('modReplaceBtn').style.display = 'block';
		document.getElementById('modReplaceSelect').style.display = 'inline-block';
		document.getElementById('modCantReplace').style.display = 'none';
	}
	var html = '';
	html += '<option value="-1">Select a Mod</option>';
	for (var item in game.heirlooms[type]){
		if (item == 'empty') continue;
		if (checkSelectedModsFor(item)) continue;
		var thisMod = game.heirlooms[type][item];
		if (thisMod.steps && thisMod.steps[rarity] === -1) continue;
		if (thisMod.minTier && rarity < thisMod.minTier) continue;
		if (thisMod.maxTier && rarity > thisMod.maxTier) continue;
		if (typeof thisMod.filter !== 'undefined' && !thisMod.filter()) continue;
		html += '<option value="' + item + '">' + thisMod.name + '</option>';
	}
	document.getElementById("modReplaceSelect").innerHTML = html;
}

var lastMainHeirIndex = -1;
function setHeirRareText(forBones, forMain){
	var nextAt = "";
	var html = "";
	if (!forBones){
		var breakpoint;
		breakpoint = getHeirloomZoneBreakpoint();
		if (forMain && lastMainHeirIndex == -1) lastMainHeirIndex = breakpoint;
		else if (forMain) breakpoint = lastMainHeirIndex;
		if (breakpoint == game.heirlooms.rarityBreakpoints.length) nextAt = "Max Rarity";
		else if (forMain){
			var minZone = (breakpoint > 0) ? game.heirlooms.rarityBreakpoints[breakpoint - 1] : 1;
			var universe = (breakpoint > 0) ? game.heirlooms.universeBreakpoints[breakpoint - 1] : 1;
			if (game.global.universe == 1 && universe == 2) nextAt += "U2 ";
			else if (game.global.universe == 2) nextAt += "U" + universe + " ";
			var maxZone = (game.heirlooms.rarityBreakpoints[breakpoint] - 1);
			if (maxZone == 0) nextAt += "Zones " + minZone + "+"
			else nextAt += "Zones " + minZone + " through " + maxZone;
		}
		else{
			nextAt = "Next Rarity Increase at Z" + game.heirlooms.rarityBreakpoints[getUnbuffedHeirloomZoneBreakpoint()];
			if (game.heirlooms.universeBreakpoints[breakpoint] > game.global.universe) nextAt += " in Universe " + game.heirlooms.universeBreakpoints[breakpoint];
		}
		html = "<b>Current Heirloom Drop Rates</b> - " + nextAt + "<br/>";
	}
	var rarities;
	if (forMain){
		rarities = getHeirloomRarityRanges(game.global.world, false, lastMainHeirIndex);
	}
	else {
		rarities = getHeirloomRarityRanges(game.global.world, forBones);
	}
	for (var x = 0; x < rarities.length; x++){
		var rarity = rarities[x];
		if (rarity == -1) continue;
		if (!forBones) html += "<div class='rarityBdBox heirloomRare" + x + "'>" + game.heirlooms.rarityNames[x] + "<br/>" + (rarity / 100) + "%</div>";
		else html += "<div class='rarityBdBox heirloomRare" + x + " forBones' title='" + game.heirlooms.rarityNames[x] + "'>" + (rarity / 100) + "%</div>";
	}
	if (forBones) document.getElementById("heirloomRarityMisc").innerHTML = html;
	else if (forMain){
		document.getElementById("heirloomRarityMain").innerHTML = html;
		var useZone = (game.global.totalRadPortals > 0) ? (game.global.highestRadonLevelCleared + 1) : (game.global.highestLevelCleared + 1);
		var maxBreakpoint = getHeirloomZoneBreakpoint(useZone, true);
		document.getElementById('heirloomChanceRight').style.display = (lastMainHeirIndex < maxBreakpoint) ? 'inline' : 'none';
		document.getElementById('heirloomChanceLeft').style.display = (lastMainHeirIndex > 0) ? 'inline' : 'none';
	}
	else document.getElementById("heirRare").innerHTML = html;
}

function changeHeirloomRarityRange(amt){
	var useZone = (game.global.totalRadPortals > 0) ? (game.global.highestRadonLevelCleared + 1) : (game.global.highestLevelCleared + 1);
	var maxBreakpoint = getHeirloomZoneBreakpoint(useZone, true);
	var newBreakpoint = lastMainHeirIndex + amt;
	if (newBreakpoint >= 0 && newBreakpoint <= maxBreakpoint){
		lastMainHeirIndex = newBreakpoint;
		setHeirRareText(false, true);
	}
}

function checkSelectedModsFor(what){
	var heirloom = getSelectedHeirloom();
	for (var mod in heirloom.mods){
		if (heirloom.mods[mod][0] == what) return true;
	}
	return false;
}

function createHeirloom(zone, fromBones, spireCore, forceBest){
	var slots = game.heirlooms.slots;
	var rarityNames = game.heirlooms.rarityNames;
	//Determine Type
	var seed = (fromBones) ? game.global.heirloomBoneSeed : game.global.heirloomSeed;
	if (forceBest) seed = game.global.bestHeirloomSeed;
	var type;
	var rarity;
	if (spireCore){
		type = "Core";
		rarity = Math.round((zone - 200) / 100);
		if (rarity > 6) rarity = 6;
		if (rarity < 0) rarity = 0;
		game.stats.coresFound.value++;
		seed = game.global.coreSeed;
	}
	else{
		type = (getRandomIntSeeded(seed++, 0, 2) == 0) ? "Shield" : "Staff";
		//Determine type rarity
		rarity = getHeirloomRarity(zone, seed++, fromBones, forceBest);
	}
	//Sort through modifiers and build a list of eligible items. Check filters if applicable
	var eligible = [];
	for (var item in game.heirlooms[type]){
		var heirloom = game.heirlooms[type][item];
		if (item == "empty" && (rarity == 0 || rarity == 1)) continue;
		if (heirloom.minTier && rarity < heirloom.minTier) continue;
		if (heirloom.maxTier && rarity > heirloom.maxTier) continue;
		if (typeof heirloom.filter !== 'undefined' && !heirloom.filter()) continue;
		if (heirloom.steps && heirloom.steps[rarity] === -1) continue;
		eligible.push(item);
	}

	slots = slots[rarity];
	var name = rarityNames[rarity] + " " + type;
	//Heirloom configuration
	//{name: "", type: "", rarity: #, mods: [[ModName, value, createdStepsFromCap, upgradesPurchased, seed]]}
	var buildHeirloom = {id: (game.stats.totalHeirlooms.valueTotal + game.stats.totalHeirlooms.value), nuMod: 1, name: name, type: type, repSeed: getRandomIntSeeded(seed++, 1, 10e6), rarity: rarity, mods: []};
	if (buildHeirloom.rarity == 12) buildHeirloom.icon = (type == "Shield") ? "*qrcode2" : "*i-cursor";
	else buildHeirloom.icon = ((type == "Core") ? 'adjust' : (type == "Shield") ? '*shield3' : 'grain')
	var x = 0;
	if (!game.heirlooms.canReplaceMods[rarity]){
		x++;
		buildHeirloom.mods.push(["empty", 0, 0, 0, getRandomIntSeeded(seed++, 0, 1000)]);
	}
	for (x; x < slots; x++){
		var roll = getRandomIntSeeded(seed++, 0, eligible.length);
		var thisMod = eligible[roll];
		eligible.splice(roll, 1);
		var steps = (typeof game.heirlooms[type][thisMod].steps !== 'undefined') ? game.heirlooms[type][thisMod].steps : game.heirlooms.defaultSteps;
		steps = getRandomBySteps(steps[rarity], null, seed++);
		buildHeirloom.mods.push([thisMod, steps[0], steps[1], 0, getRandomIntSeeded(seed++, 0, 1000)]);
	}
	seed += 6 - (x * 2);
	buildHeirloom.mods.sort(function(a, b){
		a = a[0].toLowerCase();
		b = b[0].toLowerCase();
		if (a == "empty") return 1;
		if (b == "empty" || b > a) return -1;
		return a > b
	})
	if (game.global.challengeActive == "Daily" && !fromBones){
		buildHeirloom.nuMod *= (1 + (getDailyHeliumValue(countDailyWeight()) / 100));
	}
	if (autoBattle.oneTimers.Nullicious.owned && game.global.universe == 2) buildHeirloom.nuMod *= autoBattle.oneTimers.Nullicious.getMult();
	if (game.global.universe == 2 && u2Mutations.tree.Nullifium.purchased) buildHeirloom.nuMod *= 1.1;
	buildHeirloom.nuMod *= u2SpireBonuses.nullifium();
	game.global.heirloomsExtra.push(buildHeirloom);

	const displayCores = type === 'Core' && rarity >= game.global.spiresCompleted - 1;
	if (game.options.menu.voidPopups.enabled !== 2 || displayCores || getHeirloomRarityRanges(zone, fromBones).length === rarity + 1) {
		displaySelectedHeirloom(false, 0, false, 'heirloomsExtra', game.global.heirloomsExtra.length - 1, true);
	}
	
	if ((game.stats.totalHeirlooms.value + game.stats.totalHeirlooms.valueTotal) == 0) document.getElementById("heirloomBtnContainer").style.display = "block";
	game.stats.totalHeirlooms.value++;
	checkAchieve("totalHeirlooms");
	if (heirloomsShown) displayExtraHeirlooms();
	if (spireCore) game.global.coreSeed = seed;
	else if (fromBones) game.global.heirloomBoneSeed = seed;
	else if (forceBest) game.global.bestHeirloomSeed = seed;
	else game.global.heirloomSeed = seed;
}

function getRandomBySteps(steps, mod, seed){
		if (mod && typeof mod[4] !== 'undefined'){
			seed = mod[4]++;
		}
		var possible = ((steps[1] - steps[0]) / steps[2]);
		var roll = getRandomIntSeeded(seed, 0, possible + 1);
		var result = steps[0] + (roll * steps[2]);
		result = Math.round(result * 100) / 100;
		return ([result, Math.round(possible - roll)]);
}

function getHeirloomZoneBreakpoint(zone, forBones){
	var breakpoint = getUnbuffedHeirloomZoneBreakpoint(zone, forBones);
	if (game.global.universe == 2 && u2Mutations.tree.Heirmazing.purchased && breakpoint < (game.heirlooms.rarities.length - 1)) breakpoint++;
	return breakpoint;
}

function getUnbuffedHeirloomZoneBreakpoint(zone, forBones){
	if (!zone) zone = game.global.world;
	var rarityBreakpoints = game.heirlooms.rarityBreakpoints;
	var universeBreakpoints = game.heirlooms.universeBreakpoints;
	var universe = game.global.universe;
	if (forBones && game.global.totalRadPortals > 0) universe = 2;
	for (var x = 0; x < rarityBreakpoints.length; x++){
		if (zone < rarityBreakpoints[x] && universe <= universeBreakpoints[x]) return x;
		if (universe < universeBreakpoints[x]) return x;
	}
	return rarityBreakpoints.length;
}

function getHeirloomRarityRanges(zone, forBones, forceIndex){
	if (forBones){
		if (game.global.totalRadPortals > 0) zone = game.global.highestRadonLevelCleared + 1;
		else zone = game.global.highestLevelCleared + 1;
	}
	var useBreakpoint = (typeof forceIndex !== 'undefined') ? forceIndex : getHeirloomZoneBreakpoint(zone, forBones); 
	var rarities = game.heirlooms.rarities[useBreakpoint];
	var canLower = 0;
	var addBonus = false;
	if (Fluffy.isRewardActive("stickler") && !(forBones && game.global.universe == 1 && game.global.totalRadPortals > 0)){
		canLower = 500;
		addBonus = true;
	}
	if (game.global.universe == 2 && u2Mutations.tree.Heirlots.purchased && zone >= 201){
		canLower = 500;
		addBonus = true;
	}
	var newRarities = [];
	for (var x = 0; x < rarities.length; x++){
		if (rarities[x] == -1) {
			newRarities.push(-1);
			continue;
		}
		var newRarity = rarities[x];
		if (canLower > 0){
			if (newRarity > canLower){
				newRarity -= canLower;
				canLower = 0;
			}
			else {
				canLower -= newRarity;
				newRarities.push(-1);
				continue;
			}
		}
		if (addBonus && ((rarities.length - 1 == x) || rarities[x + 1] == -1)){
			newRarity += 500;
		}
		newRarities.push(newRarity);
	}
	return newRarities;
}

function getHeirloomRarity(zone, seed, fromBones, forceBest){ //Zone is optional, and will override world
	if (!zone) zone = game.global.world;
	var rarities = getHeirloomRarityRanges(zone, fromBones);
	var nextTest = 0;
	var selectedRarity;
	var rarityRoll = getRandomIntSeeded(seed, 0, 10000);
	if (forceBest) rarityRoll = 9999;
	for (var y = 0; y < rarities.length; y++){
		if (rarities[y] == -1) continue;
		nextTest += rarities[y];
		if (rarityRoll < nextTest) {
			selectedRarity = y;
			break;
		}
	}
	if (zone >= 146 && selectedRarity == 1) giveSingleAchieve("Consolation Prize");
	return selectedRarity;
}

function getRandomMapName() {
    var namesObj = game.mapConfig.names;
    var roll = Math.floor(Math.random() * (namesObj.prefix.length - 1));
    var name = namesObj.prefix[roll];
	var suffix;
	var biome = document.getElementById("biomeAdvMapsSelect").value;
	if (biome != "Random"){
		var possibilities = [];
		for (var item in namesObj.suffix){
			if (namesObj.suffix[item].split('.')[1] == biome) possibilities.push(namesObj.suffix[item]);
		}
		roll = Math.floor(Math.random() * (possibilities.length - 1));
		suffix = possibilities[roll];
	}
	else{
		roll = Math.floor(Math.random() * (namesObj.suffix.length - 1));
		suffix = namesObj.suffix[roll];
		if (suffix == "Farms.Farmland") suffix = "Gardens.Plentiful";
	}
    return name + " " + suffix;
}

function buildMapGrid(mapId) {
	if (game.global.formation === 4 || game.global.formation === 5) game.global.canScryCache = true;
	game.global.mapStarted = getGameTime();

	const map = game.global.mapsOwnedArray[getMapIndex(mapId)];
	const array = new Array(map.size);
	const imports = Object.keys(game.unlocks.imps).filter((item) => game.unlocks.imps[item] && game.badGuys[item].location === 'Maps' && game.badGuys[item].world <= map.level);
	const showSnow = map.location === 'Frozen' || (game.badGuys.Presimpt.locked === 0 && game.options.menu.showSnow && game.options.menu.showSnow.enabled);
	const isVoid = map.location === 'Void';

	let fastTarget = 0;
	let forceNextFast = false;
	let fastEvery = -1;
	let forced = 0;

	if (game.global.universe === 2) {
		fastTarget = map.size / 6;
		const roll = Math.floor(Math.random() * 3);
		if (roll === 0) fastTarget--;
		else if (roll === 2) fastTarget++;

		const highAdd = map.level - game.global.world;
		if (highAdd > 0) fastTarget += highAdd * 0.5;
		if (fastTarget < 1) fastTarget = 1;
		fastEvery = Math.floor(map.size / fastTarget);
	}

	for (let i = 0; i < map.size; i++) {
		const thisFast = fastTarget && (forceNextFast || i % fastEvery === 0);
		const name = getRandomBadGuy(map.location, i + 1, map.size, map.level, imports, false, false, thisFast);
		const isEnemyFast = game.badGuys[name].fast;
		const cell = {
			level: i + 1,
			maxHealth: -1,
			health: -1,
			attack: -1,
			special: '',
			text: '',
			name
		};

		forceNextFast = thisFast && !isEnemyFast;
		if (thisFast && isEnemyFast) forced++;

		if (showSnow) {
			if (isVoid) cell.vm = 'CorruptSnow';
			else cell.vm = 'TrimpmasSnow';
		}
		array[i] = cell;
	}

	game.global.mapGridArray = array;
	addSpecials(true);
	if (challengeActive('Exterminate')) game.challenges.Exterminate.startedMap();
}

function getMapIndex(mapId) {
	for (var x = 0; x < game.global.mapsOwnedArray.length; x++) {
		if (game.global.mapsOwnedArray[x].id == mapId) return x;
	}
}

function getUberEmpowerment(){
	if (game.global.world < getNatureStartZone()) return "";
	return game.global.uberNature;
}

function getEmpowerment(adjust, getNaming){
	var natureStartingZone = getNatureStartZone();
	var adjWorld = game.global.world;
	if (typeof adjust !== 'undefined') adjWorld += adjust;
	if (adjWorld < natureStartingZone) return false;
	var activeEmpowerments = ["Poison", "Wind", "Ice"];
	var naming = ["Toxic", "Gusty", "Frozen"];
	adjWorld = Math.floor((adjWorld - natureStartingZone) / 5);
	adjWorld = adjWorld % activeEmpowerments.length;
	if (getNaming) return naming[adjWorld];
	return activeEmpowerments[adjWorld];
}

function getNatureStartZone(){
	if (game.global.universe == 2) return 9999;
	return (game.global.challengeActive == "Eradicated") ? 1 : 236;
}

function stackPoison(trimpAttack){
	if (Fluffy.isRewardActive("plaguebrought")) trimpAttack *= 2;
	game.empowerments.Poison.currentDebuffPower += Math.ceil(game.empowerments.Poison.getModifier() * trimpAttack);
	if (game.empowerments.Poison.getDamage() > trimpAttack * 1000) giveSingleAchieve("Infected");
	handlePoisonDebuff();
}

function handlePoisonDebuff() {
	let elem = document.getElementById('poisonEmpowermentIcon');

	if (getEmpowerment() !== 'Poison') {
		game.empowerments.Poison.currentDebuffPower = 0;
		if (elem && elem.style.display !== 'none') {
			elem.style.display = 'none';
		}
		return;
	}

	if (usingRealTimeOffline) return;

	if (!elem) {
		document.getElementById('badDebuffSpan').insertAdjacentHTML('beforeend', makeIconEffectHTML("Poisoned", false, "icon-flask", "badBadge", ["poisonEmpowermentIcon", "poisonEmpowermentText"])); 
		elem = document.getElementById('poisonEmpowermentIcon');
	}

	if (elem.style.display !== 'inline-block') {
		elem.style.display = 'inline-block';
	}

	const poisonEmpowermentText = document.getElementById('poisonEmpowermentText');
	const poisonDamage = prettify(game.empowerments.Poison.getDamage());
	if (poisonEmpowermentText && poisonEmpowermentText.innerHTML != poisonDamage) {
		poisonEmpowermentText.innerHTML = poisonDamage;
	}
}

function handleIceDebuff() {
	let elem = document.getElementById('iceEmpowermentIcon');

	if (getEmpowerment() !== 'Ice') {
		game.empowerments.Ice.currentDebuffPower = 0;
		if (elem && elem.style.display !== 'none') {
			elem.style.display = 'none';
		}
		return;
	}

	if (usingRealTimeOffline) return;

	if (!elem) {
		document.getElementById('badDebuffSpan').insertAdjacentHTML('beforeend', makeIconEffectHTML("Chilled", false, "glyphicon-certificate", "badBadge", ["iceEmpowermentIcon", "iceEmpowermentText"])); 
		elem = document.getElementById('iceEmpowermentIcon');
	}

	if (elem.style.display !== 'inline-block') {
		elem.style.display = 'inline-block';
	}

	const iceEmpowermentText = document.getElementById('iceEmpowermentText');
	const newIceEmpowermentText = prettify(game.empowerments.Ice.currentDebuffPower);
	if (iceEmpowermentText && iceEmpowermentText.innerHTML != newIceEmpowermentText) {
		iceEmpowermentText.innerHTML = newIceEmpowermentText;
	}
}

function handleWindDebuff() {
	let elem = document.getElementById('windEmpowermentIcon');
	if (getEmpowerment() !== 'Wind') {
		game.empowerments.Wind.currentDebuffPower = 0;
		if (elem && elem.style.display !== 'none') {
			elem.style.display = 'none';
		}
		return;
	}

	if (usingRealTimeOffline) return;

	if (!elem) {
		document.getElementById('badDebuffSpan').insertAdjacentHTML('beforeend', makeIconEffectHTML("Breezy", false, "icon-air", "badBadge", ["windEmpowermentIcon", "windEmpowermentText"]));
		elem = document.getElementById('windEmpowermentIcon');
	}

	if (elem.style.display !== 'inline-block') {
		elem.style.display = 'inline-block';
	}

	const windMaxStacks = game.empowerments.Wind.stackMax();
	if (game.empowerments.Wind.currentDebuffPower > windMaxStacks) {
		game.empowerments.Wind.currentDebuffPower = windMaxStacks;
	}

	const windEmpowermentText = document.getElementById('windEmpowermentText');
	const newWindEmpowermentText = prettify(game.empowerments.Wind.currentDebuffPower);
	if (windEmpowermentText && windEmpowermentText.innerHTML != newWindEmpowermentText) {
		windEmpowermentText.innerHTML = newWindEmpowermentText;
	}
}

function handleDominationDebuff() {
	var dominating = false;
	var enemy = (game.global.mapsActive) ? getCurrentMapCell() : getCurrentWorldCell();
	if (game.global.mapsActive){
		if (game.global.lastClearedMapCell + 2 == getCurrentMapObject().size) dominating = true;
	}
	else if (game.global.lastClearedCell == 98) dominating = true;
	var elem = document.getElementById('dominationDebuffContainer');
	if (!game.global.challengeActive || enemy.name == "Liquimp"){
		if (elem == null) return;
		elem.style.display = 'none';
		return;
	}
	if (elem == null){
		document.getElementById('badDebuffSpan').insertAdjacentHTML('beforeend', makeIconEffectHTML(`Domination${(dominating ? 'Dominating' : 'Weak')}`, null, `icon-${(dominating ? 'podcast' : 'feed')}`, "badBadge", ["dominationDebuffContainer", , "dominationDebuffIcon"]));
		return;
	}
	elem.style.display = 'inline-block';
	var iconElem = document.getElementById('dominationDebuffIcon');
	if (!iconElem) return;
	if (dominating && iconElem.className != 'icomoon icon-podcast') {
		iconElem.className = 'icomoon icon-podcast';
		if (usingScreenReader) elem.onkeydown = function(){keyTooltip(event, 'DominationDominating', null, 'null')}; 
		else elem.onmouseover = function (){tooltip("DominationDominating", null, event)}
	}
	else if (!dominating && iconElem.className != 'icomoon icon-feed'){
		iconElem.className = 'icomoon icon-feed';
		if (usingScreenReader) elem.onkeydown = function(){keyTooltip(event, 'DominationWeak', null, 'null')};
		else elem.onmouseover = function (){tooltip("DominationWeak", null, event)}
	}
}

function setEmpowerTab() {
	if (usingRealTimeOffline) return;

	const empowerMod = getEmpowerment();
	const empowerTab = document.getElementById('natureTab');
	const natureButton = document.getElementById('natureA');
	const empowerTabDisplay = getHighestLevelCleared() < 235 || game.global.universe === 2 ? 'none' : 'table-cell';
	let newNatureHTML = 'Nature';
	let newEmpowerTabClass = 'empowerTabNone';

	if (empowerTabDisplay === 'table-cell' && empowerMod) {
		const icons = {
			Poison: 'icomoon icon-flask',
			Ice: 'glyphicon glyphicon-certificate',
			Wind: 'icomoon icon-air'
		};

		newEmpowerTabClass = 'empowerTab' + empowerMod;
		newNatureHTML = `<span class='${icons[empowerMod]}'></span> Nature`;
	}

	if (empowerTab.style.display !== empowerTabDisplay) {
		empowerTab.style.display = empowerTabDisplay;
	}

	if (empowerTab.className.indexOf(newEmpowerTabClass) === -1) {
		swapClass('empowerTab', newEmpowerTabClass, empowerTab);
	}

	if (natureButton.innerHTML !== newNatureHTML) {
		natureButton.innerHTML = newNatureHTML;
	}
}

function updateEmpowerCosts(){
	for (var item in game.empowerments){
		var emp = game.empowerments[item];
		document.getElementById('natureUpgrade' + item + 'Cost').innerHTML = checkAndFormatTokens(getNextNatureCost(item), item);
		document.getElementById('natureStackTransfer' + item + 'Cost').innerHTML = (emp.retainLevel >= 80) ? "<span class='red'>Max</span>" : checkAndFormatTokens(getNextNatureCost(item, true), item);
		var uberCost = emp.nextUberCost;
		document.getElementById('natureUberEmpower' + item + 'Cost').innerHTML = (emp.getLevel() < 50) ? "" : checkAndFormatTokens(uberCost, item);
		//Loop again to set conversion prices for this nature type
		var purchaseAmount = ctrlPressed ? Math.floor(emp.tokens / 10) * 10 : 10;
		for (var itemY in game.empowerments){
			if (itemY == item) continue;
			document.getElementById('nature' + item + itemY + 'Cost').innerHTML = checkAndFormatTokens(purchaseAmount, item);
		}
	}
}

function checkAndFormatTokens(tokenCost, empowerment){
	var canAfford = (game.empowerments[empowerment].tokens >= tokenCost);
	return "<span class='" + ((canAfford) ? "green" : "orange") + "'>" + prettify(tokenCost) + "&nbsp;Tokens</span>";
}

function getRetainModifier(empowermentName){
	var empowerment = game.empowerments[empowermentName];
	var bonusLevels = empowerment.getRetainBonus();
	return 0.01 * (empowerment.retainLevel + bonusLevels);
}

function resetEmpowerStacks(){
	var empowerment = getEmpowerment();
	for (var item in game.empowerments){
		if (item == empowerment){
			game.empowerments[item].currentDebuffPower = 1 + (Math.ceil(game.empowerments[item].currentDebuffPower * getRetainModifier(item)));
			continue;
		}
		game.empowerments[item].currentDebuffPower = 1;
	}
	handlePoisonDebuff();
	handleWindDebuff();
	handleIceDebuff();
}

function natureTooltip(event, doing, spending, convertTo){
	var tipTitle = "";
	var tipText = "";
	var tipCost = 0;
	if (doing == 'upgrade'){
		tipTitle = "Upgrade Empowerment of " + spending;
		var emp = game.empowerments[spending];
		tipText = emp.upgradeDescription();
		tipCost = getNextNatureCost(spending);
	}
	else if (doing == 'description'){
		tipTitle = "Empowerment of " + spending;
		tipText = game.empowerments[spending].description();
	}
	else if (doing == 'convert'){
		tipTitle = "Convert " + spending + " to " + convertTo;
		tipCost = ctrlPressed ? Math.floor(game.empowerments[spending].tokens / 10) * 10 : 10;
		var convertRate = (game.talents.nature.purchased) ? 8 : 5;
		tipText = "<p>Trade " + tipCost + " Tokens of " + spending + " and get back " + (tipCost / 10 * convertRate) + " Tokens of " + convertTo + ".</p>";
		if (!ctrlPressed) tipText += "<p><b>Hold Ctrl to convert as many tokens as you can afford!</b></p>";
	}
	else if (doing == 'stackTransfer'){
		tipTitle = "Upgrade " + spending + " Stack Transfer Rate";
		var retainLevel = game.empowerments[spending].retainLevel;
		var cap = 80;
		var bonusLevels = game.empowerments[spending].getRetainBonus();
		retainLevel += bonusLevels;
		cap += bonusLevels;
		if (retainLevel >= cap){
			tipText = "You are currently at the maximum level for Stack Transfer Rate, allowing <b>" + cap + "%</b> of your stacks to transfer.";
			tipCost = 0;
		}
		else{
			tipText = "Currently, a minimum of <b>" + prettify(getRetainModifier(spending) * 100) + "%</b> of your stacks transfer after you kill a Bad Guy during the Empowerment of " + spending + ". Each level of this upgrade will increase the transfer rate by <b>1%</b>, bringing you to <b>" + prettify((getRetainModifier(spending) + 0.01) * 100) + "%</b>. Maximum of " + cap + " levels.";
			tipCost = getNextNatureCost(spending, true);
		}
	}
	else if (doing == 'uberEmpower'){
		if (game.empowerments[spending].getLevel() < 50){
			tipTitle = "Locked";
			tipText = "Upgrade Empowerment of " + spending + " to Level 50 to unlock.";
			tipCost = 0;
		}
		else{
			tipTitle = "Activate Enlightened " + spending;
			tipText = "<p>Sacrifice your Tokens and return them back to Nature, enlightening your Trimps on how to be one with " + spending + "!</p><p>While Enlightened, " + game.empowerments[spending].enlightenDesc + ".";
			var cost = game.empowerments[spending].nextUberCost;
			tipText += "</p><p>This bonus lasts until your next Portal, and only one Enlightenment can be activated per Portal. Enlightenments can be purchased at any point in your run, but the effects will not activate until Nature enters your World.</p><p>Each time this Enlightenment is activated, its cost increases by 150 Tokens of " + spending + ". Each time you start a Daily Challenge, the costs of all 3 Enlightenments will decrease by 33% or 50 Tokens, whichever number is greater, but never more than 100.</p>";
			tipCost = cost;
		}

	}
	else if (doing == 'formation' && game.global.uberNature == "Wind"){
		var emp = getUberEmpowerment();
		tipTitle = "Wind Formation";
		tipText = game.empowerments.Wind.formationDesc;
		tipText += "<br/><br/>" + getExtraScryerText(5);
		tipText += "<br/>(Hotkeys: W or 6)";
		tipCost = "";
	}
	if (tipCost == 0) tipCost = "";
	else tipCost = (game.empowerments[spending].tokens < tipCost) ? "<span class='red'>" + prettify(tipCost) + " Tokens of " + spending + "</span>" : "<span class='green'>" + prettify(tipCost) + " Tokens of " + spending + "</span>";
	if (usingScreenReader && event == "update") return; // don't do updates for screenreaders
	tooltip(tipTitle, 'customText', (usingScreenReader ? "screenRead" : event), tipText, tipCost, null, null, null, null, false);
	tooltipUpdateFunction = function () {natureTooltip(event, doing, spending, convertTo)}
}

function displayNature(){
	updateNatureInfoSpans();
}

function rewardToken(empowerment, countOnly, atZone){
	// if (empowerment == getUberEmpowerment()){
	// 	var noTokenText = ["That empowered enemy was looking a bit ill, and you find no tokens. What a shame!"];
	// 	var useText = Math.floor(Math.random() * noTokenText.length);
	// 	useText = noTokenText[useText];
	// 	message(useText, "Loot", "*medal2", "empoweredCell" + empowerment, 'token');
	// 	return 0;
	// }
	var world = (countOnly) ? atZone : game.global.world;
	var tokens = Math.floor((world - 241) / 15) + 1;
	var unbuffedTokens = tokens;
	if (game.global.challengeActive == "Daily"){
		tokens *= (1 + (getDailyHeliumValue(countDailyWeight()) / 100));
	}
	tokens = Math.floor(tokens);
	if (countOnly) return tokens;
	game.empowerments[empowerment].tokens += tokens;
	message("You found " + prettify(tokens) + " Token" + ((tokens == 1) ? "" : "s") + " of " + empowerment + "!", "Loot", "*medal2", "empoweredCell" + empowerment, 'token');
	if (game.global.buyTab == "nature")
		updateNatureInfoSpans();
	game.stats.bestTokens.value += unbuffedTokens;
	return tokens;
}

function updateNatureInfoSpans(){
	for (var item in game.empowerments){
		var emp = game.empowerments[item];
		document.getElementById('infoSpan' + item).innerHTML = "<span class='icomoon icon-info2'></span>&nbsp" + emp.formatModifier(emp.getModifier(0, true)) + "%";
		document.getElementById('tokenCount' + item).innerHTML = prettify(emp.tokens);
		var bonusLevels = emp.getRetainBonus();
		document.getElementById('natureUpgrade' + item + 'Level').innerHTML = "Lv: " + prettify(emp.getLevel());
		document.getElementById('natureStackTransfer' + item + 'Level').innerHTML = "Lv: " + prettify(emp.retainLevel + bonusLevels);
		document.getElementById('uber' + item + "Name").innerHTML = ((emp.getLevel() < 50) ? "Locked" : (game.global.uberNature != "") ? "<span class='red'>" + game.global.uberNature + " active</span>" : "Enlightened " + item);
		var unlockZone = 235;
		var mainWindow = document.getElementById('tabCol' + item);
		if (item == "Wind") unlockZone = 240;
		else if (item == "Ice") unlockZone = 245;
		if (getHighestLevelCleared() < unlockZone) mainWindow.style.display = 'none';
		else mainWindow.style.display = 'block';
	}
	updateEmpowerCosts();
}

function naturePurchase(doing, spending, convertTo){
	if (doing == 'upgrade'){
		var cost = getNextNatureCost(spending);
		var empowerment = game.empowerments[spending];
		if (empowerment.tokens < cost) return;
		empowerment.tokens -= cost;
		empowerment.level++;
		updateNatureInfoSpans();
		natureTooltip('update', doing, spending);
		return;
	}
	if (doing == "convert"){
		var spendEmp = game.empowerments[spending];
		var amount = ctrlPressed ? Math.floor(game.empowerments[spending].tokens / 10) * 10 : 10;
		if (spendEmp.tokens < amount) return;
		spendEmp.tokens -= amount;
		var convertRate = (game.talents.nature.purchased) ? 8 : 5;
		game.empowerments[convertTo].tokens += amount / 10 * convertRate;
		updateNatureInfoSpans();
		natureTooltip('update', doing, spending, convertTo);
		return;
	}
	if (doing == "stackTransfer"){
		var empowerment = game.empowerments[spending];
		if (empowerment.retainLevel >= 80)
			return;
		var cost = getNextNatureCost(spending, true);
		if (empowerment.tokens < cost) return;
		empowerment.tokens -= cost;
		empowerment.retainLevel++;
		updateNatureInfoSpans();
		natureTooltip('update', doing, spending);
		return;
	}
	if (doing == "uberEmpower"){
		if (game.global.uberNature != "") return;
		var spendingEmpowerment = game.empowerments[spending];
		if (spendingEmpowerment.getLevel() < 50) return;
		var cost = spendingEmpowerment.nextUberCost;
		if (spendingEmpowerment.tokens < cost) return;
		spendingEmpowerment.tokens -= cost;
		spendingEmpowerment.nextUberCost += 150;
		game.global.uberNature = spending;
		updateNatureInfoSpans();
		natureTooltip('update', doing, spending);
		if (spending == "Wind")
			unlockFormation(5);
		screenReaderAssert(spending + " Enlightenment now active.")
	}
}

function dailyReduceEnlightenmentCost(){
	for (var item in game.empowerments){
		var emp = game.empowerments[item];
		var oneThird = Math.floor(emp.nextUberCost / 3);
		if (oneThird > 100) oneThird = 100;
		if (oneThird > 50){
			emp.nextUberCost -= oneThird;
		}
		else{
			emp.nextUberCost -= 50;
		}
		if (emp.nextUberCost < 0) emp.nextUberCost = 0;
	}
	updateNatureInfoSpans();
}

function getNextNatureCost(empowerment, forRetain){
	empowerment = game.empowerments[empowerment];
	var scale = ((forRetain) ? 2 : 4);
	var level = ((forRetain) ? empowerment.retainLevel + 1 : empowerment.level);
	return scale + ((level - 1) * scale);
}

var mutations = {
	Living: {
		active: function () {
			return game.global.challengeActive == "Life";
		},
		randomStart: function (currentArray, fromPattern){
			var seed = game.global.world * 20;
			var directions = [-11, -10, -9, -1, 1, 9, 10, 11];
			var count = 0;
			var passes = 0;
			var last = getRandomIntSeeded(seed++, 0, 100);
			var rolls = getRandomIntSeeded(seed++, 4, 30);
			currentArray[last] = "Living";
			for (var x = 0; x < rolls; x++){
				var dirRoll = getRandomIntSeeded(seed++, 0, 8);
				last = this.checkDirection(directions[dirRoll], last);
				currentArray[last] = "Living";
			}
			if (!fromPattern) this.updateGrid(currentArray);
			this.savePattern(currentArray, true);	
			return currentArray;
		},
		checkDirection: function (amt, x){
			var toCheck = x;
			if ((amt == -11 || amt == 9 || amt == -1) && (x % 10 == 0)){
				if (amt == -1) toCheck += 9;
				else if (amt == -11) toCheck--;
				else toCheck += 19;
			}
			else if ((amt == -9 || amt == 11 || amt == 1) && (x % 10 == 9)){
				if (amt == 1) toCheck -= 9;
				else if (amt == -9) toCheck -= 19;
				else toCheck++;
			}
			else toCheck += amt;
			if (toCheck > 99) toCheck -= 100;
			else if (toCheck < 0) toCheck += 100;
			return toCheck;
		},
		change: function () {
			if (!game.upgrades.Battle.done) return;
			if (game.global.mapsActive || game.global.preMapsActive) return;
			var newArray = [];
			for (var x = 0; x < 100; x++){
				newArray[x] = "";
			}
			if (game.challenges.Life.arrayHolder[0].length == 0 || (game.challenges.Life.arrayHolder.length == 4 && this.checkDuplicates())){
				this.randomStart(newArray);
				return;
			}
			newArray = this.nextMove(newArray);
			this.updateGrid(newArray);
			this.savePattern(newArray);
		},
		savePattern: function (newArray, reset){
			if (reset) game.challenges.Life.arrayHolder = [];
			var toSave = [];
			for (var x = 0; x < 100; x++){
				if (newArray[x] == "Living")
					toSave.push(x);
			}
			game.challenges.Life.arrayHolder.unshift(toSave);
			if (game.challenges.Life.arrayHolder.length > 4)
				game.challenges.Life.arrayHolder = game.challenges.Life.arrayHolder.slice(0, 4);
		},
		getLastArray: function(){
			var lastArray = game.challenges.Life.arrayHolder[0];
			var newArray = [];
			for (var x = 0; x < 100; x++){
				newArray.push("");
			}
			for (var y = 0; y < lastArray.length; y++){
				newArray[lastArray[y]] = "Living";
			}
			return newArray;
		},
		checkDuplicates: function () {
			var arrayHolder = game.challenges.Life.arrayHolder;
			for (var x = 0; x < arrayHolder.length - 1; x++){
				var comparing = arrayHolder[x];
				mid: 
				for (var y = x + 1; y < arrayHolder.length; y++) {
					var compareTo = arrayHolder[y];
					if (comparing.length != compareTo.length) continue;
					for (var z = 0; z < comparing.length; z++){
						if (comparing[z] != compareTo[z])
							continue mid;
					}
					return true;
				}
			}
			return false;
		},
		updateGrid: function (newArray) {
			var lastArray = this.getLastArray();
			for (var y = 0; y < 100; y++){
				var wasAlive = (lastArray[y] == "Living");
				var isAlive = (newArray[y] == "Living");
				if (isAlive && !wasAlive){
					document.getElementById('cell'+ y).className += " Living";
					game.global.gridArray[y].mutation = "Living";
					if (game.global.lastClearedCell + 1 == y){
						var elem = document.getElementById('livingMutationContainer');
						if (elem != null){
							document.getElementById('livingMutationContainer').className = "badNameMutation Living"
							document.getElementById('livingMutationName').innerHTML = "Living ";
						}
					}
				}
				if (wasAlive && !isAlive){
					var elem = document.getElementById('cell' + y);
					var oldClassName = elem.className.split(' Living');
					var newClassName = oldClassName[0];
					if (oldClassName.length > 1) newClassName += oldClassName[1];
					elem.className = newClassName;
					game.global.gridArray[y].mutation = "";
					if (game.global.lastClearedCell + 1 == y){
						var elem = document.getElementById('livingMutationContainer');
						if (elem != null){
							document.getElementById('livingMutationContainer').className = ""
							document.getElementById('livingMutationName').innerHTML = "";
						}
					}
				}			
			}
		},
		nextMove: function (currentArray){
			var lastPattern = this.getLastArray();
			var activeCells = 0;
			for (var x = 0; x < lastPattern.length; x++){
				var neighborCount = 0;
				var directions = [-11, -10, -9, -1, 1, 9, 10, 11];
				for (var y = 0; y < directions.length; y++){
					if (lastPattern[this.checkDirection(directions[y], x)] == "Living")
						neighborCount++;
				}
				if (neighborCount == 3 || (neighborCount == 2 && lastPattern[x] == "Living")){
					currentArray[x] = "Living";
					activeCells++;
				}
			}
			return currentArray;
		},
		pattern: function (currentArray){
			return this.randomStart(currentArray, true);
		}
	},
	Corruption: {
		start: function (ignoreCorrupted){
			if (game.global.universe == 2) return 9999;
			if (game.global.challengeActive == "Eradicated") return 1;
			var start = (game.talents.headstart.purchased && !game.global.runningChallengeSquared) ? ((game.talents.headstart2.purchased) ? ((game.talents.headstart3.purchased) ? 151 : 166) : 176) : 181;
			if (ignoreCorrupted) return start;
			return (game.global.challengeActive == "Corrupted") ? 60 : start;
		},
		active: function (){
			if (game.global.universe != 1) return false;
			return (game.global.world >= this.start());
		},
		cellCount: function(){
			var possible = Math.floor((game.global.world - this.start()) / 3) + 2;
			if (possible > 80) possible = 80;
			return possible;
		},
		pattern: function (currentArray) {
		   var possible = this.cellCount();
		   var spread = (Math.floor(possible / 6) + 1) * 10;
		   if (spread > 100) spread = 100;
		   var addCorrupteds = getAmountInRange(spread, possible);
		   for (var a = 0; a < addCorrupteds.length; a++){
			if (currentArray[addCorrupteds[a]] != "") continue;
			currentArray[addCorrupteds[a]] = "Corruption";
		   }
		   return currentArray;
		  },
		attack: function (cellNum, name) {
			return game.global.getEnemyAttack(cellNum, name, true) * this.statScale(3);
		},
		health: function (cellNum, name) {
			return game.global.getEnemyHealth(cellNum, name, true) * this.statScale(10);
		},
		statScale: function (base){
			var startPoint = (game.global.challengeActive == "Corrupted" || game.global.challengeActive == "Eradicated") ? 1 : 150;
			var scales = Math.floor((game.global.world - startPoint) / 6);
			base *= Math.pow(1.05, scales);
			return base;
		},
		reward: function (effect) {
			if (game.global.world < 20 || game.global.runningChallengeSquared) return;
			var percentage = (game.global.challengeActive == "Corrupted") ? 0.075 : 0.15;
			var baseValue = (game.global.world >= this.start(true)) ? 10 : 5;
			if (mutations.Magma.active()) baseValue *= 3;
			var amt = rewardResource("helium", baseValue, 99, false, percentage);
			var text = "The corruption quickly swirls into the air and dissipates. <span class='helium'>You see " + prettify(amt) + " canisters of Helium left on the ground and pick them up. Useful!</span>";
			message(text, "Loot", heliumIcon(true), "voidMessage", "helium");
		},
		tooltip: function (effectName) {
			var mutText = mutationEffects[effectName].text;
			var text = "";
			if (game.global.spireActive){
				if (effectName == "none") return "This enemy is missing an effect thanks to Fluffy! It will still drop " + ((game.global.challengeActive == "Corrupted") ? "7.5%" : "15%") + " of the helium you would normally get from completing this Zone.";
				text = mutText[0].toUpperCase() + mutText.substring(1);
			}
			else {
				text = "All corrupted enemies currently deal " + prettify(this.statScale(3)) + "X damage and have " + prettify(this.statScale(10)) + "X health. In addition, " + mutText;
			}
			text += " It will also drop " + ((game.global.challengeActive == "Corrupted") ? "7.5%" : "15%") + " of the helium you would normally get from completing this Zone.";
			return text;
		},
		effects: ['corruptDbl', 'corruptBleed', 'corruptStrong', 'corruptTough', 'corruptDodge', 'corruptCrit'],
		namePrefix: 'Corrupt'
	},
	Magma: {
		start: function (){
			if (game.global.universe == 2) return 9999;
			if (game.global.challengeActive == "Eradicated") return 1;
			return 230;
		},
		active: function (){
			if (game.global.universe != 1) return false;
			return (game.global.canMagma && game.global.world >= this.start());
		},
        minBranchLength : 1,
        maxBranchLength : 2,
        get targetCells () {return (game.talents.magmaFlow.purchased) ? 18 : 16},
        get singlePathMaxSize () {return (game.talents.magmaFlow.purchased) ? 18 : 16},
        discardMultiplePaths: true,
        discardMaxThreshold: 20,
		multiplier: -1,
		lastCalculatedMultiplier: -1,
		getTrimpDecay: function (demandRecount){
			if (!this.active) return;
			if (this.multiplier == -1 || demandRecount) {
				var start = this.start();
				var zones = game.global.world - this.start() + 1;
				this.multiplier = 1;
				for (var x = 0; x < zones; x++){
					this.multiplier *= this.getTrimpDecayMult(x + start);
				}
				this.lastCalculatedMultiplier = game.global.world;
			}
			return this.multiplier;
		},
		increaseTrimpDecay: function () {
			if (this.lastCalculatedMultiplier >= game.global.world) return;
			if (this.multiplier == -1) {
				this.getTrimpDecay(true);
				return;
			}
			var newMult = this.getTrimpDecayMult();
			this.multiplier *= newMult;
			this.lastCalculatedMultiplier = game.global.world;
		},
		getTrimpDecayMult: function (world){
			return 0.8;
		},
        getEligibleOrigin: function(currentArray, riversPrior) {
			if(game.global.world % 5 === 0 && riversPrior === 0) {
				if (game.global.spireActive){
					return {x: 0, y: 0};
				}
				return {x: 9, y: 9};
			}
            var b,i,x,y;

            loop:
            for(b = 0; b < 100; b++) { //random a position on the edge
                var random = getRandomIntSeeded(game.global.mutationSeed++, 0, 10);
                var side = getRandomIntSeeded(game.global.mutationSeed++, 0, 4);

                var originX, originY;

                switch(side) {
                    case 0:
                        originX = 0;
                        originY = random;
                        break;
                    case 1:
                        originX = 9;
                        originY = random;
                        break;
                    case 2:
                        originX = random;
                        originY = 0;
                        break;
                    default:
                        originX = random;
                        originY = 9;
                }

                for(x = originX - 1; x <= originX + 1; x++) { //check all 9 cells around the randomed origin; retry if any of them is occupied
                    for(y = originY - 1; y <= originY + 1; y++) {
                        if(x < 0 || x > 9 || y < 0 || y > 9)
                            continue;

                        if(currentArray[x * 10 + y] == "Magma")
                            continue loop;
                    }
                }

                return {x: originX, y: originY};
            }

            return null; //if there is no space available on edges
        },
        addBranch: function(currentArray, arr, length, direction) {
            var count = 0;

            if(direction !== undefined) {
                for(var i = 0; i < length; i++) {
                    var vector; //this is the x,y of the next cell to occupy
                    switch(direction) { //translate direction
                        case 0:
                            vector = {x: arr[arr.length - 1].x + 1, y: arr[arr.length - 1].y}; //up
                            break;
                        case 1:
                            vector = {x: arr[arr.length - 1].x - 1, y: arr[arr.length - 1].y}; //down
                            break;
                        case 2:
                            vector = {x: arr[arr.length - 1].x, y: arr[arr.length - 1].y + 1}; //right
                            break;
                        default:
                            vector = {x: arr[arr.length - 1].x, y: arr[arr.length - 1].y - 1}; //mystery
                    }

                    if(vector.x < 0 || vector.x > 9 || vector.y < 0 || vector.y > 9) //end the branch if out of bounds
                        return count;

                    switch(direction) { //check the 5 cells in the direction of which we're going
                                        //for example going up we'll be checking these cells:
                                        //-----
                                        //-XXX-
                                        //-X|X-
                                        //-----
                        case 0:
                            for(var x = vector.x; x <= vector.x + 1; x++) { //iterating over the 6 cells
                                for(var y = vector.y - 1; y <= vector.y + 1; y++) {
                                    if(x == vector.x && y == vector.y) //ignore origin
                                        continue;

                                    if(x < 0 || x > 9 || y < 0 || y > 9) //ignore out of bounds
                                        continue;

                                    if(currentArray[x * 10 + y] == "Magma") //end the branch if one of the cells is occupied
                                        return count;
                                }
                            }
                            break;
                        case 1:
                            for(var x = vector.x; x >= vector.x - 1; x--) {
                                for(var y = vector.y - 1; y <= vector.y + 1; y++) {
                                    if(x == vector.x && y == vector.y)
                                        continue;

                                    if(x < 0 || x > 9 || y < 0 || y > 9)
                                        continue;

                                    if(currentArray[x * 10 + y] == "Magma")
                                        return count;
                                }
                            }
                            break;
                        case 2:
                            for(var x = vector.x - 1; x <= vector.x + 1; x++) {
                                for(var y = vector.y; y <= vector.y + 1; y++) {
                                    if(x == vector.x && y == vector.y)
                                        continue;

                                    if(x < 0 || x > 9 || y < 0 || y > 9)
                                        continue;

                                    if(currentArray[x * 10 + y] == "Magma")
                                        return count;
                                }
                            }
                            break;
                        default:
                            for(var x = vector.x - 1; x <= vector.x + 1; x++) {
                                for(var y = vector.y; y >= vector.y - 1; y--) {
                                    if(x == vector.x && y == vector.y)
                                        continue;

                                    if(x < 0 || x > 9 || y < 0 || y > 9)
                                        continue;

                                    if(currentArray[x * 10 + y] == "Magma")
                                        return count;
                                }
                            }
                    }

                    currentArray[vector.x * 10 + vector.y] = "Magma"; //if all is okay, continue the branch
                    arr.push(vector);
                    count++;
                }
            }

            return count; //return the number of cells this branch succesfully occupied
        },
        addPrettyRiver: function(currentArray, origin, length) {
            var arr = [origin]; //this is the full array of vectors of the path just as a helper to other functions
            var i,j,l;

            var branchLength, previousDirection = -1, pathDone;

            for(i = 0; i < 100; i++) {
                branchLength = getRandomIntSeeded(game.global.mutationSeed++,
                length < this.minBranchLength ? length : this.minBranchLength,
                length > this.maxBranchLength ? this.maxBranchLength + 1 : length + 1);

                var dirArr;

                if(i == 0) { //always generate first branch facing outwards from edge origin point
                    dirArr = [];
                    dirArr[0] = origin.x == 0 ? 0 : (origin.x == 9 ? 1 : (origin.y == 0 ? 2 : 3));
                }
                else { //next branches use a viable direction determined by this
                    dirArr = getAmountInRange(4, 4); //get a random array of directions
                    l = dirArr.length;
                    for(j = 0; j < l; j++) {
                        if(dirArr[j] == previousDirection ||
                           (dirArr[j] == 0 && previousDirection == 1) ||
                           (dirArr[j] == 1 && previousDirection == 0) ||
                           (dirArr[j] == 2 && previousDirection == 3) ||
                           (dirArr[j] == 3 && previousDirection == 2)
                           ) // don't go the same way as before or opposite
                            dirArr[j] = null;
                    }

                    for(j = 0; j < 4; j++) { //delete the thrown away directions
                        l = dirArr.indexOf(null);
                        if(l > -1)
                            dirArr.splice(l, 1);
                        else
                            break;
                    }

                    if(dirArr[0] === undefined) //if all directions were not viable, quit out of the entire river
                        return length;          //return leftover length
                }


                for(j = 0; j < 4; j++) {
                    pathDone = this.addBranch(currentArray, arr, branchLength, dirArr[0]); //try doing a branch in one of the directions from the array of directions
                    if(pathDone > 0) { //if the branch placed at least one cell, break out and do another branch
                        length -= pathDone; //reduce length leftover by number of cells done by branch
                        previousDirection = dirArr[0];
                        break;
                    }

                    dirArr.splice(0, 1); //if the branch did not place any cells, remove the direction from the direction array

                    if(dirArr[0] === undefined) //if all directions were not viable, quit out of the entire river
                        return length;          //return leftover length
                }

                if(length <= 0) //if there's no leftover length, we're done
                    break;
            }

            return length;
        },
        generateRivers : function (currentArray) {
            var i, origin, riversAmt = 0;

            var targetCells = this.targetCells;
			var singlePathMaxSize = this.singlePathMaxSize;
            for(var i = 0; i < 20; i++) {
                if(targetCells > 0) { //if we're still supposed to be adding cells
                    var newTarget = targetCells > singlePathMaxSize ? singlePathMaxSize : targetCells; //determine target river length

                    origin = this.getEligibleOrigin(currentArray, riversAmt);
                    if(origin === null) { //this will never occur unless the edges of the map are completely filled up
                        return riversAmt;
                    }

                    currentArray[origin.x * 10 + origin.y] = "Magma"; //the origin is not part of the path, so we're adding it here

                    riversAmt++;

                    if(newTarget - 1 <= 0 && targetCells - 1 <= 0) { // if there's only 1 length left to make a path, just do the origin, then leave
                        break;
                    }

                    var cellsLeftOver = this.addPrettyRiver(currentArray, origin, newTarget - 1);
                    targetCells -= newTarget - cellsLeftOver;
                }
                else break;
            }

            return riversAmt;
        },
        pattern: function (currentArray) {
            var i, j, rivers;

            var tempCurrentArray = [];
            for(i = 0; i < currentArray.length; i++)
                tempCurrentArray[i] = currentArray[i];

            var threshold = this.discardMultiplePaths ? this.discardMaxThreshold : 1;

            for(i = 0; i <= threshold; i++) {
                rivers = this.generateRivers(currentArray);
				if(rivers == Math.ceil(this.targetCells / this.singlePathMaxSize))
					break;
                else if(i != threshold) {
                    for(j = 0; j < tempCurrentArray.length; j++)
                        currentArray[j] = tempCurrentArray[j];
                }
            }
           var replacedCorruptions = 0;

            for(i = 0; i < tempCurrentArray.length; i++) {
                if(tempCurrentArray[i] == "Corruption" && currentArray[i] == "Magma")
                    replacedCorruptions++;
            }

            if (replacedCorruptions > 0) {
                for(i = 0; i < currentArray.length; i++) {
                   if(currentArray[i] == "") {
                        currentArray[i] = "Corruption";
                        replacedCorruptions--;

                        if(replacedCorruptions <= 0)
                            break;
                    }
                }
            }
           return currentArray;
          },
		attack: function (cellNum, name) {
			return game.global.getEnemyAttack(cellNum, name);
		},
		health: function (cellNum, name) {
			return game.global.getEnemyHealth(cellNum, name);
		},
		statScale: function (base){
			return base;
		},
		reward: function (effect) {
			if (game.global.genPaused && game.global.challengeActive == "Eradicated") return;
			var amt;
			var text;
			if (!game.global.genPaused && (game.global.generatorMode == 1 || (game.global.generatorMode == 2 && (getGeneratorFuelCap(false, true) - game.global.magmaFuel > 0.01)))){
				amt = game.generatorUpgrades.Supply.modifier;
				var zoneCap = 0.2 + ((game.global.world - this.start()) * 0.01);
				amt = Math.min(amt, zoneCap);
				game.global.magmaFuel = Math.round((game.global.magmaFuel + amt) * 100) / 100;
				var cap = getGeneratorFuelCap(true);
				if (game.global.magmaFuel > cap){
					if (game.generatorUpgrades.Overclocker.upgrades > 0){
						var rate = getFuelBurnRate();
						var aboveCap = game.global.magmaFuel - cap;
						rate = Math.ceil(aboveCap / rate);
						text = "You earned " + prettify(amt) + " fuel, triggering " + rate + " Overclock" + ((rate > 1) ? "s" : "") + "!";
						for (var x = 0; x < rate; x++){
							generatorTick(true);
						}
						if (game.global.magmaFuel > cap)
							game.global.magmaFuel = cap;
					}
					else {
						var dif = game.global.magmaFuel - cap;
						if (dif <= 0) dif = 0;
						amt -= dif;
						if (amt <= 0.001) amt = 0;
						text = "You earned " + prettify(amt) + " fuel! (" + prettify(dif) + " destroyed, not enough capacity)";
						game.global.magmaFuel = cap;
					}
				}
				else
					text = "You earned " + prettify(amt) + " fuel!";
				changeGeneratorState(null, true);
			}
			else{
				amt = getMagmiteReward();
				text = "You earned " + prettify(amt) + " Magmite!";
				game.global.magmite += amt;
				updateGeneratorUpgradeHtml();
				var elem = document.getElementById('upgradeMagmiteTotal');
				if (elem)
					elem.innerHTML = prettify(game.global.magmite) + " Mi";
			}
			updateGeneratorInfo();
			message(text, "Loot", heliumIcon(true), "Magma", "magma");
		},
		effects: ['none'],
		namePrefix: 'Magma'
	},
	Obsidian: {
		start: function (){
			return getObsidianStart();
		},
		active: function (){
			return (game.global.world >= this.start());
		},
		pattern: function (currentArray) {
		   for (var x = 0; x < currentArray.length; x++){
			   if (currentArray[x] == "Corruption" || currentArray[x] == "Healthy" || !currentArray[x]) currentArray[x] = "Obsidian";
		   }
		   return currentArray;
		  },
		tooltip: function () {
			var text = "This enemy is rock solid, and there\\'s no way to get past.";
			if (Fluffy.checkU2Allowed()){
				if (game.global.world == 810) text += " This Zone is even more rocky and solid than anything you\\'ve seen before. You don\\'t think there\\'s any way to get past for now.";
				else text += " Time to go to the Radon Universe and find a way to melt these Zones!";
			}
			else text += " Fluffy suggests that you find a way to get him to Evolution 8 Level 10 as quickly as possible so he can help you melt these Zones!";
			return text;
		},
		effects: ['obsidian'],
		namePrefix: 'Hardened'
	},
	Healthy: {
		active: function (){
			if (game.global.universe != 1) return false;
			return (game.global.lastSpireCleared >= 2);
		},
		cellCount: function(){
			var lastSpire = game.global.lastSpireCleared;
			var world = game.global.world;
			if (lastSpire < 2) 
				return 0;
			lastSpire *= 100;
			if (world > lastSpire + 199) 
				world = lastSpire + 199;
			var possible = Math.floor((world - 300) / 15) + 2;
			if (game.talents.healthStrength2.purchased) possible += game.global.lastSpireCleared;
			if (possible > 80) possible = 80;
			return possible;
		},
		pattern: function (currentArray) {
			var possible = this.cellCount();
			var spread = (Math.floor(possible / 6) + 1) * 10;
			if (spread > 100) spread = 100;
			var corruptions = [];
			for (var x = 0; x < currentArray.length; x++){
				if (currentArray[x] == "Corruption") corruptions.push(x);
				if (corruptions.length >= spread) break;
			}
			var addCorrupteds = getAmountInRange(corruptions.length, possible);
			for (var a = 0; a < currentArray.length; a++){
			 currentArray[corruptions[addCorrupteds[a]]] = "Healthy";
			}
			return currentArray;
		  },
		attack: function (cellNum, name) {
			return game.global.getEnemyAttack(cellNum, name, true) * this.statScale(5);
		},
		health: function (cellNum, name) {
			return game.global.getEnemyHealth(cellNum, name, true) * this.statScale(14);
		},
		statScale: function (base){
			var scales = Math.floor((game.global.world - 150) / 6);
			base *= Math.pow(1.05, scales);
			return base;
		},
		reward: function (effect) {
			if (game.empowerments.Wind.currentDebuffPower >= 200) giveSingleAchieve("Mother Lode");
			if (game.global.world < 20 || game.global.runningChallengeSquared) return;
			var percentage = 0.45;
			var baseValue = 30;
			if (game.talents.healthStrength2.purchased) percentage += .2;
			var amt = rewardResource("helium", baseValue, 99, false, percentage);
			var text = "The land looks even healthier now that the Bad Guy is dead! <span class='helium'>You find " + prettify(amt) + " canisters of Helium and figure it was worth it.</span>";
			message(text, "Loot", heliumIcon(true), "Healthy", "helium");
		},
		tooltip: function (effectName) {
			var mutText = mutationEffects[effectName].text;
			var text = "";
			if (game.global.spireActive){
				if (effectName == "none") return "This enemy is missing an effect thanks to Fluffy! It will still drop 45% of the helium you would normally get from completing this Zone.";
				text = mutText[0].toUpperCase() + mutText.substring(1);
			}
			else {
				text = "All Healthy enemies currently deal " + prettify(this.statScale(5)) + "X damage and have " + prettify(this.statScale(14)) + "X health. In addition, " + mutText;
			}
			var heValue = 45;
			if (game.talents.healthStrength2.purchased) heValue = 65;
			text += " It will also drop " + heValue + "% of the helium you would normally get from completing this Zone.";
			return text;
		},
		effects: ['healthyDbl', 'healthyBleed', 'healthyStrong', 'healthyTough', 'healthyCrit'],
		namePrefix: 'Healthy'
	}
}

var mutationEffects = {
	obsidian: {
		icon: 'icomoon icon-infinity',
		title: 'Obsidian'
	},
	corruptDbl: {
		icon: 'icomoon icon-pushpin',
		text: 'this Bad Guy attacks twice - once before you, and once again after you.',
		title: 'Corrupted Stamina'
	},
	corruptCrit: {
		icon: 'icomoon icon-heart6',
		text: 'this Bad Guy has a 25% chance to crit you for 400% extra damage.',
		title: 'Corrupted Precision'
	},
	corruptBleed: {
		icon: "icomoon icon-drop",
		text: 'every time this Bad Guy attacks, you will lose an additional 20% of your <b>current</b> health.',
		title: 'Corrupted Sharpness'
	},
	corruptStrong: {
		icon: 'icomoon icon-hammer',
		text: 'this Bad Guy has an additional 2x attack.',
		title: 'Corrupted Strength'
	},
	corruptTough: {
		icon: 'icomoon icon-shield2',
		text: 'this Bad Guy has an additional 5x health.',
		title: 'Corrupted Toughness'
	},
	corruptDodge: {
		icon: 'icomoon icon-air',
		text: 'this Bad Guy has a 30% chance to dodge your attacks.',
		title: 'Corrupted Agility'
	},
	healthyDbl: {
		icon: 'icomoon icon-pushpin',
		text: 'this Bad Guy attacks twice for 1.5x damage - once before you, and once again after you.',
		title: 'Healthy and Tireless'
	},
	healthyCrit: {
		icon: 'icomoon icon-heart6',
		text: 'this Bad Guy has a 25% chance to crit you for 600% extra damage.',
		title: 'Healthy and Precise'
	},
	healthyBleed: {
		icon: "icomoon icon-drop",
		text: 'every time this Bad Guy attacks, you will lose an additional 30% of your <b>current</b> health.',
		title: 'Healthy and Sharp'
	},
	healthyStrong: {
		icon: 'icomoon icon-hammer',
		text: 'this Bad Guy has an additional 2.5x attack.',
		title: 'Healthy and Strong'
	},
	healthyTough: {
		icon: 'icomoon icon-shield2',
		text: 'this Bad Guy has an additional 7.5x health.',
		title: 'Healthy and Tough'
	},
	none: {
		icon: 'glyphicon glyphicon-star-empty',
		text: '',
		title: 'Emptiness'
	}
}

var visualMutations = {
	Pumpkimp: {
		active: function (){
			if (!holidayObj.checkActive("Pumpkimp")) return false;
			if (game.global.world == 1) return false;
			if (checkIfSpireWorld()) return false;
			return (getRandomIntSeeded(game.global.holidaySeed++, 0, 100) < 8);
		},
		pattern: function(currentArray) {
			var loc = getRandomIntSeeded(game.global.mutationSeed++, 0, 4);
			var design = [1,2,3,4,5,10,11,12,13,14,15,16,20,21,25,26,30,32,33,34,36,40,41,42,44,45,46,50,51,52,53,54,55,56,60,61,63,65,66,71,72,73,74,75,82,83,84,93];
			for (var x = 0; x < 100 - loc; x++){
				if (currentArray[x + loc] == "" && design.indexOf(x) != -1) currentArray[x + loc] = "Pumpkimp";
			}
            return currentArray;
		},
		highlightMob: "Pumpkimp"
	},
	TrimpmasSnow: {
		active: function() {
			if (!holidayObj.checkActive("Snowy")) return false;
			return (game.options.menu.showSnow.enabled);
		},
		pattern: function(currentArray, mutationArray) {
			var winner, i, l = currentArray.length;
			for(i = 0; i < l; i++) {
				winner = "";
				if (mutationArray[i] === ""){
					if ((i % 10) > 0 && mutationArray[i - 1]){
						winner = mutationArray[i - 1];
					}
					if (winner != "Healthy" && i > 9 && mutationArray[i - 10]){
						winner = mutationArray[i - 10];
					}
					if (winner != "Healthy" && i < 90 && mutationArray[i + 10]){
						winner = mutationArray[i + 10];
					}
					if (winner != "Healthy" && (i % 10 < 9) && mutationArray[i + 1]){
						winner = mutationArray[i + 1];
					}
					if (winner == "Healthy")
						winner = "HealthySnow";
					else if (winner == "Magma")
						winner = "HotSnow";
					else if (winner == "Corruption")
						winner = "CorruptSnow";
					else winner = "";
					currentArray[i] = (winner) ? winner : "TrimpmasSnow";
				}
				else currentArray[i] = "TrimpmasSnow";
			}
			return currentArray;
		},
		namePrefix: "Snowy"
	},
	CorruptSnow: {
		active: function () {
			return false;
		},
		namePrefix: "Snowy"
	},
	HotSnow: {
		active: function () {
			return false;
		},
		namePrefix: "Snowy"
	},
	HealthySnow: {
		active: function () {
			return false;
		},
		namePrefix: "Snowy"
	},
	
}

function startTheMagma(){
	if (game.global.challengeActive == "Obliterated") giveSingleAchieve("Melted");
	var reward = (game.global.runningChallengeSquared) ? 0 : rewardResource("helium", 60, 99);
	tooltip('The Magma', null, 'update', reward);
	var genSetting = game.options.menu.generatorStart.enabled;
	if (game.global.challengeActive == "Eradicated") game.global.generatorMode = 1;
	else if (genSetting){
		if (genSetting == 3 && game.permanentGeneratorUpgrades.Hybridization.owned) game.global.generatorMode = 2;
		else if (genSetting == 2) game.global.generatorMode = 0;
		else if (genSetting == 1) game.global.generatorMode = 1;
		else {
			game.global.generatorMode = 0;
			game.options.menu.generatorStart.enabled = 0;
		}
	}
	drawAllBuildings();
	if (game.global.challengeActive == "Eradicated") return;
	if (game.global.challengeActive != 'Trimp')
		game.upgrades.Coordination.allowed += 100;
	else game.challenges.Trimp.heldBooks += 100;
	drawAllUpgrades();
}

function decayNurseries(){
	if (game.buildings.Nursery.owned <= 0) return;
	var afterDecay = Math.floor(game.buildings.Nursery.owned * 0.9);
	var decayed = (game.buildings.Nursery.owned - afterDecay)
	game.stats.decayedNurseries.value += decayed;
	if (decayed >= 750) giveSingleAchieve("Wildfire");
	game.buildings.Nursery.owned = afterDecay;

}

function getMagmiteReward(){
/* 	var amt = game.global.world - 230;
	amt = Math.floor(amt / 5) + 1;
	return amt; */
	var amt = 1;
	// if (game.global.challengeActive == "Daily"){
	// 	amt *= (1 + (getDailyHeliumValue(countDailyWeight()) / 100));
	// 	amt = Math.floor(amt);
	// }
	return amt;
}

function canAffordGeneratorUpgrade(){
	for (var unlock in game.generatorUpgrades){
		if (game.global.magmite >= game.generatorUpgrades[unlock].cost())
			return true;
	}
	for (var permUnlock in game.permanentGeneratorUpgrades){
		if (!game.permanentGeneratorUpgrades[permUnlock].owned && game.global.magmite >= game.permanentGeneratorUpgrades[permUnlock].cost)
			return true;
	}
	return false;
}


function getGeneratorFuelCap(includeStorage, checkingHybrid){
	var cap = game.generatorUpgrades.Capacity.modifier;
	if (game.permanentGeneratorUpgrades.Supervision.owned && game.global.supervisionSetting < 100){
		cap *= (game.global.supervisionSetting / 100);
	}
	if (checkingHybrid && game.permanentGeneratorUpgrades.Storage.owned){
		return cap * 1.5;
	}
	if (includeStorage && game.permanentGeneratorUpgrades.Storage.owned){
		return cap * 2;
	}
	else return cap;
}

function increaseTheHeat(){
	if (game.resources.trimps.soldiers > 0) {
		var newMult = mutations.Magma.getTrimpDecayMult(game.global.world);
		game.global.soldierCurrentAttack *= newMult;
		game.global.soldierHealthMax *= newMult;
		if (game.global.soldierHealth > game.global.soldierHealthMax)
			game.global.soldierHealth = game.global.soldierHealthMax;
		if (game.global.soldierHealth <= 0) game.global.soldierHealth = 0;
	}
}

function updateGeneratorInfo() {
	if (!mutations.Magma.active()) return;

	if (!document.getElementById('generatorWindow')) {
		document.getElementById('buildingsHere').insertAdjacentHTML('beforeend', getGeneratorHtml(true));
	}

	changeGeneratorState(null, true);
	const hybridBtn = document.getElementById('generatorHybridBtn');
	const stateConfigBtn = document.getElementById('generatorStateConfigBtn');

	if (game.permanentGeneratorUpgrades.Hybridization.owned && hybridBtn.style.display !== 'inline-block') {
		hybridBtn.style.display = 'inline-block';
	}

	if (game.permanentGeneratorUpgrades.Supervision.owned && stateConfigBtn.style.display !== 'inline-block') {
		stateConfigBtn.style.display = 'inline-block';
	}

	if (usingRealTimeOffline) return;

	updateGeneratorFuel();

	const generatorTrimps = document.getElementById('generatorTrimpsPs');
	const nextTickAmount = getGeneratorTickAmount();
	const generatorTrimpsText = prettify(scaleNumberForBonusHousing(nextTickAmount));
	if (generatorTrimps.innerHTML !== generatorTrimpsText) generatorTrimps.innerHTML = generatorTrimpsText;

	const totalMi = document.getElementById('upgradeMagmiteTotal');
	const totalMiText = `${prettify(game.global.magmite)} Mi`;
	if (totalMi.innerHTML !== totalMiText) totalMi.innerHTML = totalMiText;
}

function saveGenStateConfig(){
	var errorElem = document.getElementById('genStateConfigError');
	if (!errorElem) return;
	var inputs = document.getElementsByClassName("genStateConfigInput");
	for (var x = 0; x < inputs.length; x++){
		var scrollElem = document.getElementById('genStateConfigScroll' + x);
		if (!scrollElem || !inputs[x]) return;
		var newSetting = [parseInt(scrollElem.dataset.value, 10), parseInt(inputs[x].value, 10)];
		if (isNumberBad(newSetting[1])){
			errorElem.innerHTML = scrollElem.value + " is not a valid number";
			return;
		}
		if (newSetting[1] < 231 && newSetting[1] != 0) {
			errorElem.innerHTML = "Must use either 0 or a Zone number larger than 230";
			return;
		}
		if (game.global.genStateConfig.length <= x) game.global.genStateConfig.push(newSetting)
		else game.global.genStateConfig[x] = newSetting;
	}
	refreshGenStateConfigTooltip();
	cancelTooltip();
}

function getGenStateConfigTooltip(){
	var tooltipText = "<div id='genStateConfigTop'><div style='font-size: 1.2vw; text-align: right; width: 40%; margin-right: 10%; display: inline-block;'>Starting Setting: </div>" + getSettingHtml(game.options.menu.generatorStart, 'generatorStart', null, "Popup") + "</div>";
	var savedSettings = game.global.genStateConfig;
	var btnsAllowed = 2;
	for (var x = 0; x < btnsAllowed; x++){
		var thisSetting;
		if (savedSettings.length <= x) thisSetting = [-1, 0];
		else thisSetting = savedSettings[x];
		tooltipText += "<div>";
		tooltipText += '<div style="text-align: right; width: 40%; margin-right: 10%; display: inline-block; font-size: 1.2vw;">At Zone <input class="genStateConfigInput" type="number" style="width: 50%; padding-left: 0.6vw;" id="genStateConfigInput' + x + '" value="' + thisSetting[1] + '">: </div>'
		tooltipText += '<button data-value="' + thisSetting[0] + '" style="display: inline-block; width: 50%;" id="genStateConfigScroll' + x + '" class="genStateConfigScroll noselect settingsBtn settingBtn' + (thisSetting[0] + 1) + '" onclick="toggleGenStateConfig(this, ' + x + ')">' + getGenStateConfigBtnText(thisSetting[0]) + '</button>';
		tooltipText += "</div>";
	}
	tooltipText += "</div>";
	return tooltipText;
}

function refreshGenStateConfigTooltip(){
	var elem = document.getElementById('genStateConfigTooltip');
	if (elem) elem.innerHTML = getGenStateConfigTooltip();
}

function toggleGenStateConfig(elem, num){
	var currentSetting = parseInt(elem.dataset.value, 10);
	currentSetting++;
	if (currentSetting == 3) currentSetting = -1;
	elem.dataset.value = currentSetting;
	swapClass('settingBtn', 'settingBtn' + (currentSetting + 1), elem);
	let text = getGenStateConfigBtnText(currentSetting)
	elem.innerHTML = text;
	screenReaderAssert(text)
}

function getGenStateConfigBtnText(num){
	var text;
	switch(num){
		case -1: text = "Don't Change At Zone"; break;
		case 0: text = "Set to Gain Fuel"; break;
		case 1: text = "Set to Gain Mi"; break;
		case 2: text = "Set to Hybrid"; break;
	}
	return text;
}

function checkGenStateSwitch(){
	if (game.global.universe == 2) return;
	if (game.global.genStateConfig.length < 1) return -1;
	if (!game.permanentGeneratorUpgrades.Supervision.owned) return;
	if (game.global.world < 231) return;
	var world = game.global.world;
	for (var x = 0; x < game.global.genStateConfig.length; x++){
		if (game.global.genStateConfig[x][1] == world) {
			var setTo = game.global.genStateConfig[x][0];
			//great, changeGeneratorState has fuel on 1 and mi on 0, and the settings are the opposite.
			if (setTo == 0) setTo = 1;
			else if (setTo == 1) setTo = 0;
			if (setTo >= 0 && setTo <= 2) changeGeneratorState(setTo);
			return;
		}
	}
	
}

function getGeneratorHtml(getContainer){
	var html = "";
	if (getContainer)
		html += "<div class='thing generatorState' id='generatorWindow'>"
	html += "<div id='genTitleContainer'><div id='generatorTitle'>Dimensional Generator</div>";
	html += "<div id='dgChangeBtnContainer'" + ((game.global.challengeActive == "Eradicated") ? " class='eradicatedBtns'" : "") + "><span id='generatorActiveBtn' role='button' onclick='changeGeneratorState(1)' class='dgChangeBtn pointer noselect colorDanger hoverColor'>Gain Fuel</span> <span role='button' onclick='changeGeneratorState(0)' id='generatorPassiveBtn' class='dgChangeBtn pointer noselect colorPrimary hoverColor'>Gain Mi</span> <span role='button' onclick='changeGeneratorState(2)' id='generatorHybridBtn' class='dgChangeBtn pointer noselect colorTeal hoverColor' style='display: none'>Hybrid</span> <div role='button' style='display: none' onclick='tooltip(\"Configure Generator State\", null, \"update\")' id='generatorStateConfigBtn'  aria-label='Configure Supervision' class='pointer noselect hoverColor dgChangeBtn colorDefault'><span class='glyphicon glyphicon-cog'></span></div></div>";
	html += "<div role='button' id='generatorUpgradeBtn' onclick='tooltip(\"Upgrade Generator\", null, \"update\")'class='workBtn pointer noselect colorDark hoverColor'>Upgrade (<span id='upgradeMagmiteTotal'></span>)</div></div><div id='genGaugeContainer'><div class='row'><div class='col-xs-4'><div id='fuelContainer'><div id='fuelBar' class='" + ((game.options.menu.generatorAnimation.enabled == 0) ? "animateOff" : "animateOn") + "'></div><div id='fuelStorageBar' class='" + ((game.options.menu.generatorAnimation.enabled == 0) ? "animateOff" : "animateOn") + "'></div><div id='fuelGlass'></div><div id='fuelOwnedText'>Fuel<br/><span id='generatorFuelOwned'>0</span> / <span id='generatorFuelMax'>0</span></div></div></div>"
	if (game.permanentGeneratorUpgrades.Supervision.owned)
		html += "<div class='col-xs-4 hasSlider' id='generatorProducingColumn'><div id='generatorProducingContainer'>Producing<br/><span id='generatorTrimpsPs'>0</span><br/>Housing/Tick</div><div id='generatorSliderBox'><input id='generatorSlider' onchange='saveSupervisionSetting()' type='range' min='1' max='100' value='" + game.global.supervisionSetting + "' /></div></div>";
	else
		html += "<div class='col-xs-4' id='generatorProducingColumn'><div id='generatorProducingContainer'>Producing<br/><span id='generatorTrimpsPs'>0</span><br/>Housing/Tick</div></div>";
	html += "<div class='col-xs-4'><div id='generatorTickContainer' onclick='pauseGenerator()' onmouseover='updatePauseBtn(true)' onmouseout='updatePauseBtn(false)'" + ((game.permanentGeneratorUpgrades.Supervision.owned) ? " style='cursor: pointer'" : "") + "> <div id='generatorRadialContainer' class='radial-progress'> <div class='radial-progress-circle'> <div class='radial-progress-arrow static''></div></div><div " + ((game.options.menu.generatorAnimation.enabled == 0) ? "style='display: none;' " : "") + "id='generatorRadial' class='radial-progress-circle'> <div class='radial-progress-arrow mobile'></div> </div> <div id='clockKnob' class='radial-progress-knob generatorState'></div></div><span id='generatorNextTick' style='pointer-events: none;'>0</span></div></div></div></div>";
	if (getContainer) html += "</div>";
	return html;
}

var mousedOverClock = false;
function updatePauseBtn(show){
	if (!game.permanentGeneratorUpgrades.Supervision.owned) return;
	mousedOverClock = show;
	var elem = document.getElementById('generatorNextTick');
	if (show && !game.global.genPaused){
		if (elem)
			elem.innerHTML = "<span class='icomoon icon-pause3'></span>";
	}
	else if (show){
		if (elem)
			elem.innerHTML = "<span class='icomoon icon-controller-play'></span>";
	}
	else {
		updateNextGeneratorTickTime();
	}
	
}

function pauseGenerator(updateOnly){
	if (!game.permanentGeneratorUpgrades.Supervision.owned) return;
	if (!updateOnly) game.global.genPaused = !game.global.genPaused;
	updateNextGeneratorTickTime();
	changeGeneratorState(null, true);
}

function saveSupervisionSetting(){
	var elem = document.getElementById('generatorSlider');
	if (!elem) return;
	var value = parseInt(elem.value, 10);
	if (isNaN(value)) return;
	value = Math.round(value);
	if (value < 1) value = 1;
	if (value > 100) value = 100;
	game.global.supervisionSetting = value;
	updateGeneratorInfo();
}

function countTotalHousingBuildings(){
	var buildings = game.buildings;
	return buildings.Hut.owned + buildings.House.owned + buildings.Mansion.owned + buildings.Hotel.owned + buildings.Resort.owned + buildings.Gateway.owned + buildings.Collector.owned + buildings.Hub.owned;
}

function scaleNumberForBonusHousing(num){
	if (getPerkLevel("Carpentry") > 0) num = Math.floor(num * (Math.pow(1 + game.portal.Carpentry.modifier, getPerkLevel("Carpentry"))));
	if (getPerkLevel("Carpentry_II") > 0) num = Math.floor(num * (1 + (game.portal.Carpentry_II.modifier * getPerkLevel("Carpentry_II"))));
	if (game.global.expandingTauntimp) num = Math.floor(num * game.badGuys.Tauntimp.expandingMult());
	num *= alchObj.getPotionEffect("Elixir of Crafting");
	if (autoBattle.bonuses.Scaffolding.level > 0) num *= autoBattle.bonuses.Scaffolding.getMult();
	if (game.global.universe == 2 && u2Mutations.tree.Trimps.purchased) num *= 1.5;
	if (game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.large !== "undefined")
		num = Math.floor(num * dailyModifiers.large.getMult(game.global.dailyChallenge.large.strength));
	if (challengeActive("Size"))
		num *= 0.5;
	return num;
}

function buyGeneratorUpgrade(item){
	if (item == "Overclocker" && (!game.permanentGeneratorUpgrades.Hybridization.owned || !game.permanentGeneratorUpgrades.Storage.owned))
		return;
	var upgrade = game.generatorUpgrades[item];
	if (typeof upgrade === 'undefined') {
		buyPermanentGeneratorUpgrade(item);
		return;
	}
	var cost = upgrade.cost();
	if (game.global.magmite < cost) return;
	game.global.magmite -= cost;
	if (game.global.magmite <= 0) game.global.magmite = 0;
	if (typeof upgrade.nextModifier !== 'undefined')
		upgrade.modifier = upgrade.nextModifier();
	upgrade.upgrades++;
	updateGeneratorUpgradeHtml();
	updateGeneratorInfo();
	if (!usingScreenReader) showGeneratorUpgradeInfo(item);
	else screenReaderAssert(`${item} ${game.generatorUpgrades[item].upgrades} Purchased`)
}

function buyPermanentGeneratorUpgrade(item){
	var upgrade = game.permanentGeneratorUpgrades[item];
	if (typeof upgrade === 'undefined') return;
	var cost = upgrade.cost;
	if (game.global.magmite < cost) return;
	if (upgrade.owned) return;
	game.global.magmite -= cost;
	if (game.global.magmite <= 0) game.global.magmite = 0;
	upgrade.owned = true;
	updateGeneratorUpgradeHtml();
	updateGeneratorInfo();
	if (!usingScreenReader) showGeneratorUpgradeInfo(item, true);
	else screenReaderAssert(`${item} Purchased`) 
	if (typeof upgrade.onPurchase !== 'undefined') upgrade.onPurchase();
}


function updateGeneratorUpgradeHtml(){
	if (document.getElementById('generatorUpgradeTooltip') == null) return;
	for (var item in game.generatorUpgrades){
		var elem = document.getElementById('generatorUpgrade' + item);
		if (elem == null) continue;
		var upgrade = game.generatorUpgrades[item];
		var cost = upgrade.cost();
		var text = (usingScreenReader ? 
			`${item}, Level ${upgrade.upgrades}, ${game.global.magmite >= cost ? "Affordable" : "Not Affordable"}, Cost ${prettify(cost)}Mi` :
			`${item}<br/>${upgrade.upgrades}`
		);
		elem.innerHTML = text;
		var state = (game.global.magmite >= cost) ? "CanAfford" : "CanNotAfford";
		if (item == "Overclocker" && (!game.permanentGeneratorUpgrades.Hybridization.owned || !game.permanentGeneratorUpgrades.Storage.owned))
			state = "CanNotAfford";
		swapClass('thingColor', 'thingColor' + state, elem);
	}
	for (var item in game.permanentGeneratorUpgrades){
		var elem = document.getElementById('generatorUpgrade' + item);
		if (elem == null) continue;
		var upgrade = game.permanentGeneratorUpgrades[item];
		var cost = upgrade.cost;
		var text = item
		if (usingScreenReader) text += `, ${(upgrade.owned) ? "Done" : (game.global.magmite >= cost ? "Affordable" : "Not Affordable") + `, Cost, ${prettify(cost)} Mi` }`
		else text += `</br> ${(upgrade.owned) ? "Done" : `${prettify(cost)} Mi`}`
		elem.innerHTML = text;
		var state;
		if (upgrade.owned)
			state = "Done";
		else
			state = (game.global.magmite >= cost) ? "CanAfford" : "CanNotAfford";
		swapClass('thingColor', 'thingColor' + state, elem);
	}
	var magmiteElem = document.getElementById('magmiteOwned');
	if (magmiteElem != null) magmiteElem.innerHTML = "Magmite: " + prettify(game.global.magmite) + "<br/>";
	if (document.getElementById('magmiteCost') != null && lastViewedDGUpgrade)
		showGeneratorUpgradeInfo(lastViewedDGUpgrade[0], lastViewedDGUpgrade[1]);
}


function getGeneratorTickTime(){
	var baseTick = 60;
	var zoneMult = (game.talents.quickGen.purchased) ? 1.03 : 1.02;
	var tickTime = Math.ceil(1 / Math.pow(zoneMult, Math.floor((game.global.world - mutations.Magma.start()) / 3)) * baseTick * 10) / 10;
	return (tickTime < 5) ? 5 : tickTime;
}

function canGeneratorTick(){
	return (game.global.timeSinceLastGeneratorTick >= (getGeneratorTickTime() * 1000));
}

var lastViewedDGUpgrade;
function showGeneratorUpgradeInfo(item, permanent) {
	const elem = document.getElementById('generatorUpgradeDescription');
	if (!elem) return;

	let description;
	let cost;
	if (permanent) {
		description = game.permanentGeneratorUpgrades[item].description;
		cost = game.permanentGeneratorUpgrades[item].cost;
	} else {
		description = game.generatorUpgrades[item].description();
		cost = game.generatorUpgrades[item].cost();
	}

	let color = game.global.magmite >= cost ? 'Success' : 'Danger';
	if (item === 'Overclocker' && (!game.permanentGeneratorUpgrades.Hybridization.owned || !game.permanentGeneratorUpgrades.Storage.owned)) color = 'Danger';

	let text;
	if (permanent && game.permanentGeneratorUpgrades[item].owned) {
		color = 'Grey';
		text = 'Done';
	} else {
		text = 'Buy: ' + prettify(cost) + ' Magmite';
	}

	const elemText = `<div id='generatorUpgradeName'>${item}</div>${(usingScreenReader ? " " : `<div onclick='buyGeneratorUpgrade("${item}")' id='magmiteCost' class='pointer noSelect hoverColor color${color}'>${text}</div>`)}${description}<br/>`;
	if (elem.innerHTML !== elemText) elem.innerHTML = elemText;
	lastViewedDGUpgrade = [item, permanent];
	verticalCenterTooltip();
}

var thisTime = 0;
function updateNextGeneratorTickTime() {
	const nextTickElem = document.getElementById('generatorNextTick');
	if (game.global.genPaused) {
		const message = mousedOverClock ? "<span class='icomoon icon-controller-play'></span>" : '<span class="icomoon icon-pause3"></span>';
		if (nextTickElem !== message) nextTickElem.innerHTML = message;
		return;
	}

	const tickTime = getGeneratorTickTime();
	let framesPerVisual = 10;
	let nextTickIn = (tickTime * 1000 - game.global.timeSinceLastGeneratorTick) / 1000;
	nextTickIn = isNumberBad(nextTickIn) ? 0 : Math.round(nextTickIn * 10) / 10;
	nextTickIn = Math.round(nextTickIn * 10) / 10;

	if (Math.round((nextTickIn + 0.1) * 10) / 10 === tickTime) {
		thisTime = framesPerVisual - 1;
	}

	const message = mousedOverClock && game.permanentGeneratorUpgrades.Supervision.owned ? "<span class='icomoon icon-pause3'></span>" : usingRealTimeOffline ? 0 : prettify(Math.floor(nextTickIn + 1));
	if (nextTickElem !== message && !usingRealTimeOffline) nextTickElem.innerHTML = message;

	let countingTick = Math.round((tickTime - nextTickIn) * 10) / 10;
	countingTick = Math.round(countingTick * 10) / 10;

	if (game.options.menu.generatorAnimation.enabled === 1 && thisTime >= framesPerVisual - 1) {
		thisTime = 0;
		let timeRemaining = tickTime - countingTick;
		if (timeRemaining !== 0 && timeRemaining <= framesPerVisual / 10) {
			timeRemaining = Math.round((timeRemaining - 0.1) * 10) / 10;
			thisTime = framesPerVisual;
			framesPerVisual = timeRemaining * 10;
			thisTime -= framesPerVisual;
		}
		goRadial(document.getElementById('generatorRadial'), countingTick, tickTime, 100 * framesPerVisual);
	} else {
		thisTime++;
	}
}

function updateGeneratorFuel() {
	const currentFuel = game.global.magmaFuel;
	const maxFuel = getGeneratorFuelCap();
	const elem = document.getElementById('generatorFuelOwned');
	if (elem && elem.innerHTML != prettify(currentFuel)) elem.innerHTML = prettify(currentFuel);
	const elem2 = document.getElementById('generatorFuelMax');
	if (elem2 && elem2.innerHTML != prettify(maxFuel)) elem2.innerHTML = prettify(maxFuel);

	const fuelStorageBar = document.getElementById('fuelStorageBar');
	let percent;
	if (currentFuel > maxFuel) {
		const storageCap = getGeneratorFuelCap(true);
		percent = Math.ceil(((currentFuel - maxFuel) / (storageCap - maxFuel)) * 100);
		if (percent > 100) percent = 100;
		if (percent < 0) percent = 0;
		fuelStorageBar.style.height = percent + '%';
	} else {
		fuelStorageBar.style.height = '0%';
	}

	const fuelBar = document.getElementById('fuelBar');
	percent = Math.ceil((currentFuel / maxFuel) * 100);
	if (percent > 100) percent = 100;
	fuelBar.style.height = percent + '%';
}

function changeGeneratorState(to, updateOnly) {
	if (game.global.universe === 2) return;
	//0 passive, 1 active, 2 hybrid
	const originalMode = game.global.generatorMode;
	const runningEradicated = challengeActive('Eradicated');
	if (runningEradicated) to = 1;
	if (!updateOnly) game.global.generatorMode = to;
	to = game.global.generatorMode;
	if (game.global.genPaused) to = runningEradicated ? 1 : 0;
	if (to === 2 && game.global.magmaFuel < getGeneratorFuelCap(false, true)) to = 3;

	if (to === originalMode && !updateOnly) return;

	const state = ['Passive', 'Active', 'HybridPassive', 'HybridActive'][to];
	swapClass('generatorState', 'generatorState' + state, document.getElementById('generatorWindow'));
	swapClass('generatorState', 'generatorState' + state, document.getElementById('clockKnob'));
}

function generatorTick(fromOverclock) {
	if (!mutations.Magma.active()) return;
	if (game.global.genPaused) {
		updateNextGeneratorTickTime();
		return;
	}

	const fuelRate = getFuelBurnRate();
	if (!fromOverclock) {
		if (game.global.magmaFuel < fuelRate) return;
		game.global.timeSinceLastGeneratorTick += 100;
		updateNextGeneratorTickTime();
		if (!canGeneratorTick()) {
			return;
		}
	}

	checkAchieve('housing', 'Generator');
	let tickAmt = getGeneratorTickAmount();
	if (fromOverclock) tickAmt *= 1 - game.generatorUpgrades.Overclocker.modifier;
	const scaledTick = addMaxHousing(tickAmt, game.permanentGeneratorUpgrades.Simulacrum.owned);
	game.stats.trimpsGenerated.value += scaledTick;
	game.global.trimpsGenerated += tickAmt;
	game.global.magmaFuel = Math.round((game.global.magmaFuel - fuelRate) * 100) / 100;

	if (!fromOverclock) {
		if (game.global.magmaFuel >= fuelRate) game.global.timeSinceLastGeneratorTick = 0;
		else {
			game.global.timeSinceLastGeneratorTick = 0;
			goRadial(document.getElementById('generatorRadial'), 0, 10, 0);
			const nextTickElem = document.getElementById('generatorNextTick');
			if (nextTickElem !== '0') nextTickElem.innerHTML = 0;
		}
	}

	updateGeneratorInfo();
	changeGeneratorState(null, true);
}

function addMaxHousing(amt, giveTrimps){
	var wasFull = (game.resources.trimps.owned == game.resources.trimps.realMax());
	game.resources.trimps.max += amt;
	amt = scaleNumberForBonusHousing(amt);
	if (game.global.challengeActive == "Trapper" || game.global.challengeActive == "Trappapalooza") return amt;
	if (!giveTrimps) return amt;
	if (wasFull){
		game.resources.trimps.owned = game.resources.trimps.realMax();
		return amt;
	}
	game.resources.trimps.owned += amt;
	return amt;
}

function getGeneratorTickAmount(){
	var fuelAmt = getGeneratorFuelCap();
	fuelAmt = (game.global.magmaFuel > fuelAmt) ? fuelAmt : game.global.magmaFuel;
	return game.generatorUpgrades.Efficiency.tickAtFuel(fuelAmt);
}

function getFuelBurnRate(){
	var rate = 0.5;
	if (game.permanentGeneratorUpgrades.Slowburn.owned) rate -= 0.1;
	return rate;
}

function getMagmiteDecayAmt(){
	var rate = 30;
	if (game.permanentGeneratorUpgrades.Shielding.owned)
		rate -= 10;
	return rate;
}

var canSkeletimp = false;
function buildGrid() {
    var world = game.global.world;
    var array = [];
	var imports = [];
	for (var item in game.unlocks.imps){
		if (!game.unlocks.imps[item]) continue;
		var badGuy = game.badGuys[item];
		if (badGuy.location == "World" && badGuy.world <= world){
			imports.push(item);
		}
	}
	canSkeletimp = false;
	var skeleMin = 2700000;
	if (game.talents.skeletimp2.purchased) skeleMin -= 600000
	if ((new Date().getTime() - game.global.lastSkeletimp) >= skeleMin) canSkeletimp = true;
	var corrupteds = [];
	for (var w = 0; w < 100; w++){
		corrupteds.push("");
	}
	for (var item in mutations){
		if (mutations[item].active()){
			corrupteds = mutations[item].pattern(corrupteds);
		}
	}
	var vms = [];
	for (var y = 0; y < 100; y++){
		vms.push("");
	}
	for (var vmItem in visualMutations){
		if (visualMutations[vmItem].active()){
			vms = visualMutations[vmItem].pattern(vms, corrupteds);
		}
	}
	var needsEmpower = false;
	if (game.global.challengeActive != "Eradicated" && game.global.world > 236 && game.global.world % 5 == 1)
		needsEmpower = true;
    for (var i = 0; i < 100; i++) {
        var newCell = {
            level: i + 1,
            maxHealth: -1,
            health: -1,
            attack: -1,
            special: "",
            text: "",
            name: getRandomBadGuy(null, i + 1, 100, world, imports, corrupteds[i], vms[i])
        };
		if (game.global.universe == 2){
			newCell.u2Mutation = [];
		}
		if (corrupteds[i] != "") {
			newCell.mutation = corrupteds[i];
			if ((typeof mutations[corrupteds[i]].effects !== 'undefined'))
				newCell.corrupted = getSeededRandomFromArray(game.global.mutationSeed++, mutations[corrupteds[i]].effects);
		}
		if (vms[i] != "") {
			newCell.vm = vms[i];
		}
		if ((i >= 50 && needsEmpower && typeof newCell.corrupted === 'undefined') || (i == 98 && needsEmpower)){
			newCell.empowerment = getEmpowerment(-1);
			needsEmpower = false;
		}
		array.push(newCell);
    }
	if (game.global.universe == 2){
		array = u2Mutations.addMutations(array);
	}
    game.global.gridArray = array;
	if (!(game.global.spireActive && game.global.universe == 2)){
    	addSpecials();
	}
}

function getSeededRandomFromArray(seed, array){
	return array[getRandomIntSeeded(seed, 0, array.length)];
}

function getAmountInRange(maxRange, toKeep, useU2Seed)
{
	var toShuffle = [];
	for (var w = 0; w < maxRange; w++){
		if (w != 99) toShuffle.push(w);
	}
    for (var x = Math.floor(toShuffle.length / 2); x < toShuffle.length; x++)
    {
		var seed = (useU2Seed) ? game.global.u2MutationSeed++ : game.global.mutationSeed++;
        var random = getRandomIntSeeded(seed, 0, toShuffle.length);
        var hold = toShuffle[x];
        toShuffle[x] = toShuffle[random];
        toShuffle[random] = hold;
    }
    return toShuffle.slice(0, toKeep);
}

function setMutationTooltip(which, mutation) {
	if (usingRealTimeOffline) return;

	const effect = mutationEffects[which];
	if (typeof effect === 'undefined') return;
	const elem = document.getElementById('corruptionBuff');
	if (typeof mutations[mutation].tooltip === 'undefined') return;
	
	const elemText = makeIconEffectHTML(effect.title, mutations[mutation].tooltip(which), effect.icon, ` badBadge ${mutation}`);
	if (elem && elem.innerHTML !== elemText) elem.innerHTML = elemText;
}
function setVoidCorruptionIcon(regularMap) {
	if (usingRealTimeOffline) return;

	const scaleDivider = regularMap || !mutations.Magma.active() ? 2 : 1;
	const attackScale = mutations.Corruption.statScale(3) / scaleDivider;
	const healthScale = mutations.Corruption.statScale(10) / scaleDivider;

	const title = regularMap ? 'Map Corruption' : 'Void Corruption';
	let text = `This ${regularMap ? 'map' : 'Void Map'} has become unstable due to Corruption. Enemy attack increased by ${prettify(attackScale)}X, and health increased by ${prettify(healthScale)}X.`;

	if (!regularMap) {
		text += ' Helium at the end of the map is now double what you would earn from a World Zone, including Corrupted cells!';
	}

	const corruptionElem = document.getElementById('corruptionBuff');
	const elemText = makeIconEffectHTML(title, text, "glyphicon-plus", "voidBadge");
	if (corruptionElem.innerHTML !== elemText) corruptionElem.innerHTML = elemText;
}

function getRandomBadGuy(mapSuffix, level, totalCells, world, imports, mutation, visualMutation, fastOnly) {
	var selected;
	var force = false;
	var enemySeed = (mapSuffix) ? Math.floor(Math.random() * 10000000) : game.global.enemySeed;
	var badGuysArray = [];
	if (mapSuffix == "Darkness") imports = [];
    for (var item in game.badGuys) {
		var badGuy = game.badGuys[item];
		if (badGuy.locked) continue;
		if (badGuy.location == "Maps" && !mapSuffix) continue;
		var locationMatch = false;
		if (mapSuffix && badGuy.location2 && badGuy.location2 == mapSuffix) locationMatch = true;
		if (mapSuffix && badGuy.location == mapSuffix) locationMatch = true;
		if (level == totalCells && badGuy.last && (locationMatch || (!mapSuffix && badGuy.location == "World")) && world >= badGuy.world) {
			if (item == "Blimp" && (world != 5 && world  != 10 && world < 15)) continue;
			if (!mapSuffix && ((game.global.brokenPlanet || (game.global.universe == 2 && game.global.world >= 20)) || game.global.world == 59) && item == "Blimp"){
				if (mutations.Magma.active())
					item = "Omnipotrimp";
				else
					item = "Improbability";
			}
			selected = item;
			force = true;
			break;
		}
		if (!mapSuffix && game.global.challengeActive == "Exterminate" && game.global.world <= game.challenges.Exterminate.completeAfterZone){
			if (badGuy.location == "Exterminate") badGuysArray.push(item);
			continue;
		}
		if (!badGuy.last && (!fastOnly || badGuy.fast) && (typeof badGuy.world === 'undefined' || game.global.world >= game.badGuys[item].world) && (badGuy.location == "All" || (mapSuffix && (badGuy.location == "Maps" || locationMatch)) || (!mapSuffix && badGuy.location == "World"))){
			badGuysArray.push(item);
		}
	}
	if (!mapSuffix && canSkeletimp && !force && (getRandomIntSeeded(enemySeed++, 0, 100) < 5)) {
		canSkeletimp = false;
		game.global.enemySeed = enemySeed;
		return (getRandomIntSeeded(game.global.skeleSeed++, 0, 100) < ((game.talents.skeletimp.purchased) ? 20 : 10)) ? "Megaskeletimp" : "Skeletimp";
	}
	var exoticChance = getExoticChance();
	if (game.global.universe == 2 && game.global.spireActive && !mapSuffix) exoticChance = 0;
	if (imports.length && !force && ((getRandomIntSeeded(enemySeed++, 0, 1000) / 10) < (imports.length * exoticChance))){
		if (!mapSuffix) game.global.enemySeed = enemySeed;
		return imports[getRandomIntSeeded(enemySeed++, 0, imports.length)];
	}
	if (!mapSuffix && !force) {
		var chance = .35 * (1 / (100 - 1 - (exoticChance * imports.length)));
		chance = Math.round(chance * 100000);
		if (game.talents.turkimp.purchased) chance *= 1.33;
		var roll = getRandomIntSeeded(enemySeed++, 0, 100000);
		if (roll < chance) {
			if (!mapSuffix) game.global.enemySeed = enemySeed;
			return "Turkimp";
		}
	}
	if (!(!game.global.mapsActive && game.global.spireActive && game.global.universe == 2) && game.talents.magimp.purchased && mapSuffix != "Darkness" && !force){
		var chance = 2 * (1 / (100 - 1 - (exoticChance * imports.length)));
		chance = Math.round(chance * 100000);
		var roll = getRandomIntSeeded(enemySeed++, 0, 100000);
		if (roll < chance) {
			if (!mapSuffix) game.global.enemySeed = enemySeed;
			return "Magimp";
		}
	}
	//Halloween
	if (!mapSuffix && !force && visualMutation == 'Pumpkimp'){
		if (getRandomIntSeeded(enemySeed++, 0, 10) < 5){
			game.global.enemySeed = enemySeed;
			 return "Pumpkimp";
		}
	}
	if (game.global.challengeActive == "Insanity" && mapSuffix && !force){
		if (getRandomIntSeeded(enemySeed++,0,10000) < (game.challenges.Insanity.getHorrimpChance(world) * 100)) return "Horrimp";
	}
	if (game.global.challengeActive == "Daily"  && typeof game.global.dailyChallenge.mutimps !== 'undefined' && !mapSuffix && !force){
		var mutStr = game.global.dailyChallenge.mutimps.strength;
		if (level <= dailyModifiers.mutimps.getMaxCellNum(mutStr)){
			var mobName = mutStr < 6 ? "Mutimp" : "Hulking_Mutimp";
			if (getRandomIntSeeded(enemySeed++, 0, 10) < 4){
				game.global.enemySeed = enemySeed;
				return mobName;
			}
		}
	}
	if (!force) selected = badGuysArray[getRandomIntSeeded(enemySeed++, 0, badGuysArray.length)];
	if (!mapSuffix) game.global.enemySeed = enemySeed;
	return selected;

}

function getExoticChance(){
	var exoticChance = 3;
	if (Fluffy.isRewardActive("exotic")) exoticChance += 0.5;
	if (game.permaBoneBonuses.exotic.owned > 0) exoticChance += game.permaBoneBonuses.exotic.addChance();
	return exoticChance;
}

function convertUnlockIconToSpan(special){
	var title = "";
	if (special.title) title = `title='${special.title}' aria-label='${special.title}'`;
	var prefix = "";
	var icon = special.icon;
		if (icon && icon.charAt(0) == "*") {
			icon = icon.replace("*", "");
			prefix =  "icomoon icon-"
		}
		else prefix = "glyphicon glyphicon-";
    return '<span ' + title + 'class="' + prefix + icon + '"></span>';
}

function convertIconNameToSpan(iconName){
	var prefix = "";
		if (iconName.charAt(0) == "*") {
			iconName = iconName.replace("*", "");
			prefix =  "icomoon icon-"
		}
		else prefix = "glyphicon glyphicon-";
    return '<span class="' + prefix + iconName + '"></span>';
}

function addSpecialToLast(special, array, item) {
    array[array.length - 1].text = convertUnlockIconToSpan(special);
    array[array.length - 1].special = item;
    return array;
}

function addSpecialToNthLast(special, array, item, n){
	array[array.length - n].text = convertUnlockIconToSpan(special);
	array[array.length - n].special = item;
	return array;
}

function addSpecials(maps, countOnly, map, getPrestiges) { //countOnly must include map. Only counts upgrades set to spawn on "last".
	var specialCount = 0;
	var array;
	var unlocksObj;
	var world;
	var max;
	var prestigeArray = [];
	var hasPrestigious = false;
	if (getPrestiges) map = {location: "All", level: game.global.world, size: 100}
    if (maps) {
        array = game.global.mapGridArray;
        unlocksObj = game.mapUnlocks;
		if (!countOnly) map = game.global.mapsOwnedArray[getMapIndex(game.global.currentMapId)];
		hasPrestigious = (game.global.mapExtraBonus == "p" || (map.location == "Bionic" && game.talents.bionic2.purchased));
		world = map.level;
        max = map.size;
    } else {
        array = game.global.gridArray;
        unlocksObj = game.worldUnlocks;
        world = game.global.world;
        max = 100;
	}
    var canLast = 1;
	var prestigeItemsAvailable = [];
    for (var item in unlocksObj) {
        var special = unlocksObj[item];
		if (special.locked) continue;
		if (game.global.universe == 2 && special.blockU2) continue;
		if (game.global.universe == 1 && special.blockU1) continue;
		if (game.global.challengeActive == "Pandemonium"){
			if (maps && special.prestige && game.challenges.Pandemonium.isEquipBlocked(game.upgrades[item].prestiges)) continue;
			if (!maps && game.challenges.Pandemonium.isEquipBlocked(item)) continue;
		}
		if (item == "easterEgg"){
			game.global.eggSeed += 3;
			if (seededRandom(game.global.eggSeed) >= special.chance) continue;
		}
		if (special.brokenPlanet && ((special.brokenPlanet == 1 && !game.global.brokenPlanet) || special.brokenPlanet == -1 && game.global.brokenPlanet)) continue;
		if (map && game.global.challengeActive == "Frugal" && special.prestige) continue;
		if (special.startAt < 0) continue;
		if (special.lastAt < game.global.world) continue;
		if ((maps) && (special.filterUpgrade)){
			var mapConfigLoc = game.mapConfig.locations[map.location];
			if (typeof mapConfigLoc.upgrade === 'object'){
				var usable = false;
				for (var x = 0; x < mapConfigLoc.upgrade.length; x++){
					if (mapConfigLoc.upgrade[x] != item) continue;
					usable = true;
					break;
				}
				if (!usable) continue;
			}
			else if (mapConfigLoc.upgrade != item) continue;
		}
        if ((special.level == "last" && canLast > 0 && special.world <= world && (special.canRunOnce || special.canRunWhenever))) {
			if (canLast == 2 && !special.prestige) continue;
			if (typeof special.specialFilter !== 'undefined'){
				if (!special.specialFilter(world)) continue;
			}
			if (special.startAt > world) continue;
			if (countOnly){
					specialCount++;
					continue;
				}
			array = addSpecialToLast(special, array, item);
			if (hasPrestigious && canLast == 1 && item == "roboTrimp")
				canLast = 3;
			else
				canLast = 0;
			continue;
        }

        if (typeof special.canRunOnce !== 'undefined' && !special.canRunOnce) continue;

        if (special.world != world && special.world > 0) continue;
        if ((special.world == -2) && ((world % 2) !== 0)) continue;
        if ((special.world == -3) && ((world % 2) != 1)) continue;
        if ((special.world == -5) && ((world % 5) !== 0)) continue;
        if ((special.world == -33) && ((world % 3) !== 0)) continue;
		if ((special.world == -10) && ((world % 10) !== 0)) continue;
		if ((special.world == -20) && ((world % 20) !== 0)) continue;
		if ((special.world == -25) && ((world % 25) !== 0)) continue;
		
		if ((maps) && (special.filter)){
			var mapResType = game.mapConfig.locations[map.location].resourceType;
			if (mapResType == "Scaling") mapResType = getFarmlandsResType(map);
			if (mapResType != item) continue;
		}
		if (typeof special.specialFilter !== 'undefined'){
			if (!special.specialFilter(world)) continue;
		}
        if ((typeof special.startAt !== 'undefined') && (special.startAt > world)) continue;
        if (typeof special.canRunOnce === 'undefined' && (special.level == "last") && canLast > 0 && (special.last <= (world - 5))) {
			if (!countOnly)
			if (canLast == 2 && !special.prestige) continue;
			if (countOnly){
				var tempCount = Math.floor((world - special.last) / 5);
				if (special.prestige && ((game.global.universe == 1 && game.global.sLevel >= 4) || (game.global.universe == 2 && game.buildings.Microchip.owned >= 4))){
					if (tempCount % 2 == 1) tempCount++;
				}
				specialCount += tempCount;
				if (getPrestiges && special.prestige) prestigeArray.push(item);
				continue;
			}
			if (special.prestige && maps && game.options.menu.mapLoot.enabled == 0) {
				prestigeItemsAvailable.push(item);
				continue;
			}
			if (hasPrestigious && special.prestige){
				if (canLast == 1) {
					array = addSpecialToLast(special, array, item);
					canLast = 2;
				}
				else if (canLast == 2){
					addSpecialToNthLast(special, array, item, 2);
					canLast = 0;
				}
				else if (canLast == 3){
					addSpecialToNthLast(special, array, item, 3);
					canLast = 2;
				}
				continue;	
			}
			array = addSpecialToLast(special, array, item);
            canLast = 0;
            continue;
        }
		if (special.level == "last") continue;
		if (special.canRunOnce === true && countOnly) {specialCount++; continue;}
		if (!countOnly)  findHomeForSpecial(special, item, array, max);
		//for repeating items that should be counted
		else if (special.addToCount) specialCount++;
    }
	if (getPrestiges) return prestigeArray;
	if (countOnly) return specialCount;
	if (canLast && prestigeItemsAvailable.length && maps){
		//tier first
		var bestIndex = 0;
		var secondBestIndex = 0;
		var bestZone = game.mapUnlocks[prestigeItemsAvailable[0]].last;
		var secondBestZone = bestZone;
		for (var x = 1; x < prestigeItemsAvailable.length; x++){
			var thisUpgrade = game.mapUnlocks[prestigeItemsAvailable[x]];
			if (thisUpgrade.last < bestZone){
				secondBestIndex = bestIndex;
				secondBestZone = bestZone;
				bestIndex = x;
				bestZone = thisUpgrade.last;
			}
			else if (thisUpgrade.last < secondBestZone || bestIndex == secondBestIndex){
				secondBestIndex = x;
				secondBestZone = thisUpgrade.last;
			}
		}
		array = addSpecialToLast(game.mapUnlocks[prestigeItemsAvailable[bestIndex]], array, prestigeItemsAvailable[bestIndex]);
		if (hasPrestigious && secondBestIndex != bestIndex)
			array = addSpecialToNthLast(game.mapUnlocks[prestigeItemsAvailable[secondBestIndex]], array, prestigeItemsAvailable[secondBestIndex], 2);
	}
}


function getFarmlandsResType(){
	var rota = ["Any", "Metal", "Wood", "Food", "Gems"];
	var index = game.global.world % 5;
	return rota[index];
}

function findHomeForSpecial(special, item, array, max){
	var level;
	var repeat = (typeof special.repeat !== 'undefined');
	var repeatFreq = (repeat) ? special.repeat : 0;
	var x = 0;
	var done = false;
	while (done === false) {
		if (special.prestige) level = array.length - 2;
		else if (typeof special.level === 'object') level = ((Math.floor(Math.random() * (special.level[1] - special.level[0])) + special.level[0]) + (x * repeatFreq));
		else level = special.level + (x * repeatFreq);
		if (level >= max) break;
		//Resolve resource conflicts. Try +5, reverse, -5, then bail out.
		var hax = 5;
		if (typeof array[level] === 'undefined') console.log(level + ", " + item);
		while (array[level].special !== "") {
			if (hax >= 5) {
				hax++;
				level++;
			}
			if (hax <= 4) {
				hax--;
				level--;
			}
			if (hax == 10 || level >= max) {
				hax = 4;
				level -= 6;
			}
			if (hax === 0 || level <= 0) {
				break;
			}
		}
		if (hax !== 0 && level < max) {
			var addClass;
			if (special.addClass) addClass = (typeof special.addClass === 'function') ? special.addClass() : special.addClass;
			else addClass = "";
			var prefix = "";
			var icon = special.icon;
			if (icon && icon.charAt(0) == "*") {
				icon = icon.replace("*", "");
				prefix =  "icomoon icon-"
			}
			else {
				prefix = "glyphicon glyphicon-";
			}
			if (typeof special.title !== 'undefined') {
				let label = (special.title == "Food/Wood/Metal" ? "Any" : special.title);
				array[level].text = `<span aria-label='${label}' title="${special.title}"  class='${prefix + icon + ' ' + addClass}'></span>`;
			}
			else {
				array[level].text = '<span class="' + prefix + icon + ' ' + addClass +  '"></span>';
			}
			array[level].special = item;
		}
		if (!repeat) done = true;
		x++;
		if (x == max) {
			done = true;
			break;
		}
	}
}

function liquifiedZone() {
	return game.global.gridArray && game.global.gridArray[0] && game.global.gridArray[0].name === 'Liquimp';
}

function dropPrestiges() {
	const toDrop = addSpecials(true, true, null, true);
	const sci4 = getSLevel() >= 4 && !challengeActive('Mapology');

	for (let x = 0; x < toDrop.length; x++) {
		unlockUpgrade(toDrop[x]);
		let prestigeUnlock = game.mapUnlocks[toDrop[x]];
		if (sci4 && Math.ceil(prestigeUnlock.last / 5) % 2 === 0) {
			unlockUpgrade(toDrop[x]);
			prestigeUnlock.last += 10;
		} else {
			prestigeUnlock.last += 5;
		}
	}

	if (liquifiedZone()) drawAllUpgrades();
}

function drawGrid(maps) {
	const grid = maps ? document.getElementById('mapGrid') : document.getElementById('grid');
	let map = maps ? getCurrentMapObject() : null;
	let cols = 10;
	let rows = 10;

	if (maps) {
		if (map.size === 150) {
			rows = 10;
			cols = 15;
		} else {
			cols = Math.floor(Math.sqrt(map.size));
			if (map.size % cols === 0) {
				rows = map.size / cols;
			} else {
				const sizeGreaterThanCols = map.size - cols * cols > cols;
				rows = sizeGreaterThanCols ? cols + 2 : cols + 1;
			}
		}
	}

	const width = `${100 / cols}%`;
	const paddingTop = `${100 / cols / 19}vh`;
	const paddingBottom = `${100 / cols / 19}vh`;
	const fontSize = `${cols / 14 + 1}vh`;

	let className = '';
	if (game.global.universe === 1 && !maps && game.global.world >= 60 && game.global.world <= 80) {
		if (game.global.world === 60) className = 'gridOverlayGreenGradient1';
		else if (game.global.world <= 65) className = 'gridOverlayGreenGradient2';
		else if (game.global.world <= 70) className = 'gridOverlayGreenGradient3';
		else if (game.global.world <= 75) className = 'gridOverlayGreenGradient4';
		else className = 'gridOverlayGreenGradient5';
	}

	if (!maps && game.global.gridArray[0].name === 'Liquimp') className += 'liquid';
	else if (!maps && game.global.spireActive) className = 'spire';
	else if (maps && map.location === 'Darkness') className = 'blackMap';

	const idText = maps ? 'mapCell' : 'cell';
	let size = maps ? game.global.mapGridArray.length : 0;
	let counter = 0;
	let rowHTML = '';

	for (let i = 0; i < rows; i++) {
		if (maps && counter >= size) break;
		let html = '';
		for (let x = 0; x < cols; x++) {
			if (maps && counter >= size) break;

			const cell = game.global[maps ? 'mapGridArray' : 'gridArray'][counter];
			const id = `${idText}${counter}`;

			let className = ['battleCell', 'cellColorNotBeaten'];
			let background = '';
			let backgroundColor = '';
			let title = '';
			let role = '';
			let innerHTML = cell.text === '' ? '&nbsp;' : cell.text;

			if (maps) {
				if (cell.name === 'Pumpkimp') className.push('mapPumpkimp');
				if (map.location === 'Void') className.push('voidCell');
				if (cell.vm) className.push(cell.vm);
			} else {
				if (cell.u2Mutation && cell.u2Mutation.length) {
					for (var y = 0; y < cell.u2Mutation.length; y++){
						className.push(cell.u2Mutation[y]);
					}
					className.push('mutatedCell');
					background = 'initial';
					backgroundColor = u2Mutations.getColor(cell.u2Mutation);
				} else if (cell.mutation) className.push(cell.mutation);
				if (cell.vm) className.push(cell.vm);
				if (cell.empowerment) {
					className.push(`empoweredCell${cell.empowerment}`);
					title = `Token of ${cell.empowerment}`;
					innerHTML += `<span class="visually-hidden">${title}</span>`
				} else if (checkIfSpireWorld() && game.global.spireActive) className.push('spireCell');
				if (cell.special === 'easterEgg') {
					game.global.eggLoc = counter;
					className.push('eggCell');
					title = 'Colored Egg';
					role = 'button';
					innerHTML += `<span class="visually-hidden">${title}</span>`
				}
			}

			html += `<li id="${id}" 
						style="width:${width};padding-top:${paddingTop};padding-bottom:${paddingBottom};font-size:${fontSize};background:${background};background-color:${backgroundColor};" 
						class="${className.join(' ')}" 
						title="${title}" 
						aria-label="${title}"
						role="${role}">
						${innerHTML}
					</li>`;
			counter++;
		}

		rowHTML = `<ul aria-label="${maps ? "Maps" : "World"} row ${i+1}" id="row${i}" class="battleRow">${html}</ul>` + rowHTML;
	}

	grid.className = className;
	grid.innerHTML = rowHTML;

	const eggCell = document.querySelector('.eggCell');
	if (eggCell) eggCell.addEventListener('click', easterEggClicked);
}

function easterEggClicked(){
	if (game.global.eggLoc == -1) return;
	var elem = document.getElementById("cell" + game.global.eggLoc);
	var gridLoc = game.global.gridArray[game.global.eggLoc];
	elem.innerHTML = "&nbsp;";
	elem.onclick = "";
	gridLoc.special = "";
	gridLoc.text = "";
	var startText;
	if (game.global.lastClearedCell == game.global.eggLoc - 1) startText = ["Oh, there seems to be an egg on the ground. You throw it really hard to break it, and find "];
	else if (game.global.lastClearedCell > game.global.eggLoc) startText = ["You use your amazing sense of hindsight, and send a Trimp to check behind you for eggs. It found one containing ", "You just remembered you wanted to look for treasure. You send a Trimp backwards to check and it found an egg containing "];
	else startText = ["You see a brightly colored egg off in the distance and send a Trimp to retrieve it for you. Inside is ", "You send a Trimp to sneak forward checking for eggs. After getting turned around multiple times, it found an egg that had ", "Hey there's an egg up there! You send a few Trimps to retrieve it and they bring back "];
	startText = startText[Math.floor(Math.random() * startText.length)];
	var roll = seededRandom(game.global.eggSeed - 1);
	if (game.global.totalPortals < 1){ //Give metal if player doesn't have 5 total portals and VM/Heirloom/Nu was rolled
		if (roll > 0.84 && (roll <= 0.92 || game.global.totalPortals == 0)) roll = 0.84;
	}
	if (roll <= 0.84 || (roll > 0.92 && game.global.runningChallengeSquared)){
		var reward = '';
		var rewardRoll = getRandomIntSeeded(game.global.eggSeed - 2, 1, 6);
		if (roll <= 0.25) reward = "food";
		else if (roll <= 0.54) reward = "wood";
		else reward = "metal";
		var amt = rewardResource(reward, (rewardRoll / 1.5), game.global.eggLoc);
		startText += prettify(amt) + " " + reward.charAt(0).toUpperCase() + reward.slice(1) + "!";
	}
	else if (roll <= 0.89){
		var amt = Math.round(game.global.world / 4);
		if (game.global.universe == 2) amt *= 1000;
		if (amt <= 0) amt = 1;
		game.global.nullifium += amt;
		startText += prettify(amt) + " Nullifium!";
	}
	else if (roll <= 0.91){
		createHeirloom();
		startText += "an Heirloom!";
	}
	else if (roll <= 0.92){
		createVoidMap();
		startText += "a Void Map!";
	}
	else{
		if (game.resources.helium.owned == 0) fadeIn("helium", 10);
		var amt = (game.global.universe == 2) ? 1 : (game.global.world >= 59) ? 5 : 1;
		amt = rewardResource("helium", amt, 99);
		startText += prettify(amt) + ((game.global.universe == 2) ? " Radon!" : " Helium!");
	}
	message(startText, "Loot", "*droplet", "eggMessage easterEgg" + getRandomIntSeeded(game.global.eggSeed + 1, 0, 4));
	game.global.eggLoc = -1;
}

function fightManual() {
	if (game.options.menu.pauseGame.enabled) return;
	if (game.global.time < 1000) return;
    battle(true);
}

function pauseFight(updateOnly) {
    if (!updateOnly) game.global.pauseFight = !game.global.pauseFight;
	var color = (!game.global.pauseFight) ? "btn-success" : "btn-danger";
	var elem = document.getElementById("pauseFight");
	elem.className = "";
	elem.className = "btn fightBtn " + color;
	elem.innerHTML = (!game.global.pauseFight) ? "AutoFight On" : "AutoFight Off";
}

function recycleBelow(confirmed, forceLevel){
	var level = (forceLevel) ? forceLevel : parseInt(document.getElementById("mapLevelInput").value, 10);
	if (isNaN(level) || level < 6) return;
	if (!confirmed) {
		tooltip('confirm', null, 'update', 'You are about to recycle all maps below level ' + level + '. Are you sure?' , 'recycleBelow(true)', 'Mass Recycle');
		return;
	}
	var refund = 0;
	var total = 0;
	for (var x = game.global.mapsOwnedArray.length - 1; x >= 0; x--){
		var item = game.global.mapsOwnedArray[x];
		if (game.global.currentMapId == item.id && game.global.mapsActive) continue;
		if (!item.noRecycle && item.level < level) {
			refund += recycleMap(x, true);
			total++;
			}
	}
	if (total > 0) message("Recycled " + total + " maps for " + prettify(refund) + " fragments.", "Notices");
}

function recycleMap(map, fromMass, killVoid, noRefund) {
    if (typeof map === 'undefined' || map == -1) {
		if (game.global.lookingAtMap === "") return;
		map = getMapIndex(game.global.lookingAtMap);
	}
    if (map === null) return;
	var mapObj = game.global.mapsOwnedArray[map];
	if (game.global.tutorialActive && game.global.tutorialStep < 7 && mapObj && mapObj.name == "Tricky Paradise"){
		message("ADVISOR suggests not recycling this map until you've completed it at least three times. Press V or click ADVISOR's gold star for more info.", "Notices");
		return;
	}
	var loc = "mapsHere";
	if (killVoid){
		game.global.voidBuff = "";
		document.getElementById("voidBuff").innerHTML = "";
	}
	if (mapObj.location == "Void") loc = "voidMapsHere";
	if (mapObj.noRecycle) {
		game.global.currentMapId = "";
		game.global.lastClearedMapCell = -1;
		game.global.mapGridArray = [];
		mapsSwitch(true);
		return;
	}
    document.getElementById(loc).removeChild(document.getElementById(mapObj.id));
    if (game.global.currentMapId == mapObj.id){
		game.global.lookingAtMap = "";
		game.global.currentMapId = "";
		game.global.lastClearedMapCell = -1;
	}
	else if (game.global.lookingAtMap == mapObj.id) game.global.lookingAtMap = "";
	game.global.mapsOwned--;
	var refund;
	if (!killVoid && !noRefund) {
		refund = getRecycleValue(mapObj.level);
		game.resources.fragments.owned += refund;
		if (!fromMass) message("Recycled " + mapObj.name + " for " + prettify(refund) + " fragments.", "Notices");
	}
	game.global.mapsOwnedArray.splice(map, 1);
    if (killVoid) {
		game.global.totalVoidMaps -= (mapObj.stacked) ? mapObj.stacked + 1 : 1;
		return;
	}
	if (!noRefund){
		mapsSwitch(true, true);
	}
	return refund;
}

function getRecycleValue(level) {
	var baseCost = level;
	if (baseCost < 6 || isNaN(baseCost)) return;
	baseCost = Math.floor((((baseCost / 150) * (Math.pow(1.14, baseCost - 1))) * baseCost * 2) * Math.pow((1.03 + (baseCost / 50000)), baseCost));
	baseCost *= 0.8;
	return Math.floor(baseCost);
}

function updateMapCredits() {
	var s = (game.challenges.Mapology.credits == 1) ? "" : "s"
	document.getElementById("mapCreditsLeft").innerHTML = game.challenges.Mapology.credits + " Map Credit" + s;
}

function messageMapCredits() {
	var s = (game.challenges.Mapology.credits == 1) ? "" : "s"
	message("You have " + game.challenges.Mapology.credits + " Map Credit" + s + " left!", "Notices");
}

function mapsClicked(confirmed) {
	if (game.options.menu.pauseGame.enabled) return;
	if (game.global.mapsActive && getCurrentMapObject().location == "Void" && !confirmed && !game.global.switchToMaps){
		tooltip('confirm', null, 'update', 'You are about to abandon this Void Map, which will cause you to lose all current progress in this map. Are you sure?' , 'mapsClicked(true)', 'Abandon Void Map');
		return;
	}
	if (game.global.mapsActive && getCurrentMapObject().location == "Darkness" && !confirmed && !game.global.switchToMaps){
		tooltip('confirm', null, 'update', 'You are about to abandon The Black Bog, which will cause you to lose all current progress in this map. Are you sure?' , 'mapsClicked(true)', 'Abandon Black Bog');
		return;
	}
    if (game.global.switchToMaps || game.global.switchToWorld || game.options.menu.alwaysAbandon.enabled == 1 || confirmed) {
		if (!game.global.preMapsActive){
			if (game.global.spireActive && !game.global.mapsActive && game.global.fighting) deadInSpire();
			game.global.switchToMaps = true;
			if (game.resources.trimps.soldiers > 0){
				game.global.soldierHealth = 0;
				game.stats.trimpsKilled.value += game.resources.trimps.soldiers;
				game.stats.battlesLost.value++;
				game.resources.trimps.soldiers = 0;
			}
			if (game.global.challengeActive == "Berserk") game.challenges.Berserk.trimpDied();
			if (game.global.challengeActive == "Exterminate") game.challenges.Exterminate.trimpDied();
			if (getPerkLevel("Frenzy")) game.portal.Frenzy.trimpDied();
			if (game.global.challengeActive == "Storm"){
				game.challenges.Storm.alpha = 0;
				game.challenges.Storm.drawStacks();
			}
			var bar = document.getElementById("goodGuyBar");
			swapClass("percentColor", "percentColorRed", bar);
			bar.style.width = "0%";
			var healthElem = document.getElementById("goodGuyHealth");
			if (healthElem != null) healthElem.innerHTML = 0;
			if (challengeActive("Nom")) {
				var cell;
				var cellNum;
				if (game.global.mapsActive) {
					cellNum = game.global.lastClearedMapCell + 1;
					cell = game.global.mapGridArray[cellNum];
				} else {
					cellNum = game.global.lastClearedCell + 1;
					cell = game.global.gridArray[cellNum];
				}
				cell.nomStacks = (cell.nomStacks) ? cell.nomStacks + 1 : 1;
				if (cell.nomStacks > 100) cell.nomStacks = 100;
				updateNomStacks(cell.nomStacks);
				if (cell.health > 0) cell.health += (cell.maxHealth * 0.05);
				else cell.health = 0;
				if (cell.health > cell.maxHealth) cell.health = cell.maxHealth;
				updateBadBar(cell);
			}
		}
		mapsSwitch();
        return;
    }
    if (game.global.fighting && !game.global.preMapsActive) {
		message("Waiting to travel until your soldiers are finished.", "Notices");

		document.getElementById("mapsBtn").className = "btn btn-warning fightBtn shrinkBtnText";
		document.getElementById("mapsBtnText").innerHTML = "Abandon Soldiers";
	}
    if (game.global.preMapsActive) {
        mapsSwitch();
        return;
    }
	game.global.switchToMaps = true;
}

function mapsSwitch(updateOnly, fromRecycle) {
	game.global.titimpLeft = 0;
	updateGammaStacks(true);
	updateTitimp();
	if (game.global.challengeActive == "Quagmire") game.challenges.Quagmire.drawStacks();
    if (!updateOnly) {
		//Coming out of maps or world (not necessarily to map chamber)
		game.global.fighting = false;
        game.global.switchToMaps = false;
        game.global.switchToWorld = false;
		game.global.voidBuff = "";
        if (game.global.preMapsActive) {
            game.global.mapsActive = false;
            game.global.preMapsActive = false;
		} 
		else game.global.preMapsActive = true;
	}
	if (!updateOnly)
		game.global.mapExtraBonus = "";

	var currentMapObj;
	if (game.global.spireActive) handleExitSpireBtn();
	handleFinishDailyBtn();
	if (game.global.currentMapId !== "") currentMapObj = getCurrentMapObject();
	var mapsBtnText = document.getElementById("mapsBtnText");
	var recycleBtn = document.getElementById("recycleMapBtn");
	recycleBtn.innerHTML = "Recycle Map";
	document.getElementById("mapsBtn").className = "btn btn-warning fightBtn";
	document.getElementById('togglemapAtZone2').style.display = (game.global.canMapAtZone) ? "block" : "none";
    if (game.global.preMapsActive) {
		// Switching to Map Chamber.
		refreshMaps();
		game.global.mazBw = -1;
		if (currentMapObj && (currentMapObj.location == "Void" || currentMapObj.location == "Darkness")) {
			recycleMap(-1, true, true);
			currentMapObj = false;
		}
		if (game.global.mapCounterGoal > 0) {
			game.global.mapCounterGoal = 0;
			toggleSetting('repeatUntil', null, false, true);
		}
		game.global.mapsActive = false;
		setNonMapBox();
		document.getElementById("battleHeadContainer").style.display = "none";
		document.getElementById("mapsCreateRow").style.display = "block";
		if (!fromRecycle) resetAdvMaps();
        document.getElementById("grid").style.display = "none";
        document.getElementById("preMaps").style.display = "block";
        toggleMapGridHtml();
        mapsBtnText.innerHTML = "World";
        if (game.global.lookingAtMap && !game.global.currentMapId) selectMap(game.global.lookingAtMap, true);
		else if (game.global.currentMapId === "") {
			clearMapDescription();
		} 
		else {
            selectMap(game.global.currentMapId, true);
            document.getElementById("selectMapBtn").innerHTML = "Continue";
            document.getElementById("selectMapBtn").style.visibility = "visible";
            recycleBtn.style.visibility = "visible";
			if (currentMapObj.noRecycle) recycleBtn.innerHTML = "Abandon Map";
		}
	}
	else if (game.global.mapsActive) {
		//Switching to maps
		if (!updateOnly) resetEmpowerStacks();
		if (game.global.formation != 4 && game.global.formation != 5) game.global.waitToScryMaps = true;
		if (game.global.usingShriek) {
			disableShriek();
			game.global.useShriek = true;
		}
		if (currentMapObj.location == "Void"){
			currentMapObj.level = game.global.world;
			document.getElementById("repeatVoidsContainer").style.display = "block";
		}
		else document.getElementById("repeatVoidsContainer").style.display = "none";
		if (currentMapObj.location == "Darkness"){
			currentMapObj.level = game.global.world;
		}
		if (currentMapObj.location == "Bionic"){
			document.getElementById("climbBwContainer").style.display = "block";
			toggleSetting('climbBw', null, false, true);
		}
		else document.getElementById("climbBwContainer").style.display = "none";
		document.getElementById("mapsCreateRow").style.display = "none";
        document.getElementById("grid").style.display = "none";
        document.getElementById("preMaps").style.display = "none";
		u2Mutations.clearStacks();
        toggleMapGridHtml(true, currentMapObj);
	} 
	else {
		//Switching to world
		if (!updateOnly) resetEmpowerStacks();
		game.global.mazBw = -1;
		game.global.mapCounterGoal = 0;
		if (game.global.formation != 4 && game.global.formation != 5) game.global.waitToScry = true;
		if (game.global.lastClearedCell == 98 && game.global.useShriek && !game.global.usingShriek)
			activateShriek();
		document.getElementById("battleHeadContainer").style.display = "block";
		document.getElementById("mapsCreateRow").style.display = "none";
        document.getElementById("grid").style.display = "block";
        document.getElementById("preMaps").style.display = "none";
        toggleMapGridHtml();
		setNonMapBox();
		u2Mutations.checkStacks();
    }
	if (game.global.tutorialActive) tutorial.setWinSize();
	if (game.global.challengeActive == "Smithless") game.challenges.Smithless.drawStacks();
	toggleVoidMaps(true);
}

function toggleMapGridHtml(on, currentMapObj){
	var settings = (on) ? ["block", "2", "8", "block"] : ["none", "off", "10", "none"];
	document.getElementById("mapGrid").style.display = settings[0];
	if (game.options.menu.extraMapBtns.enabled){
		swapClass("col-xs", "col-xs-" + settings[1], document.getElementById("extraMapBtns"));
		swapClass("col-xs", "col-xs-" + settings[2], document.getElementById("gridContainer"));
	}
	document.getElementById("repeatBtn").style.display = settings[3];
	if (!on) return;
	var innerText = game.global.mapBonus;
	if (game.talents.mapBattery.purchased && game.global.mapBonus == 10) innerText = "<span class='mapBonus10'>" + innerText + "</span>";
	document.getElementById("mapsBtnText").innerHTML = (game.global.mapBonus) ? "Maps (" + innerText + ")" : "Maps";
	document.getElementById("mapBonus").innerHTML = "";
	document.getElementById("battleHeadContainer").style.display = "block";
	if (!currentMapObj) return;
	var worldNumElem = document.getElementById("worldNumber");
	worldNumElem.style.display = 'inline';
	worldNumElem.innerHTML = "<br/>Lv: " + currentMapObj.level;
	document.getElementById("worldName").innerHTML = currentMapObj.name;
}

function clearMapDescription(){
	document.getElementById("selectMapBtn").style.visibility = "hidden";
	document.getElementById("recycleMapBtn").style.visibility = "hidden";
	document.getElementById("selectedMapName").innerHTML = "Select a Map!";
	document.getElementById("mapStatsSize").innerHTML = "";
	document.getElementById("mapStatsDifficulty").innerHTML = "";
	document.getElementById("mapStatsLoot").innerHTML = "";
	document.getElementById("mapStatsItems").innerHTML = "";
	document.getElementById("mapStatsResource").innerHTML = "";
}

function setNonMapBox(){
	document.getElementById("mapsBtnText").innerHTML = "Maps";
	if (game.global.totalVoidMaps > 0) addVoidAlert();
	var worldNumElem = document.getElementById("worldNumber");
	worldNumElem.style.display = (game.global.spireActive) ? 'none' : 'inline';
	document.getElementById("worldNumber").innerHTML = game.global.world;
	var mapBonus = document.getElementById("mapBonus");
	var bonus = game.global.mapBonus;
	if (game.talents.mapBattery.purchased && bonus == 10) bonus *= 2;
	if (bonus > 0) mapBonus.innerHTML = prettify(bonus * 20) + "% Map Bonus";
	else mapBonus.innerHTML = "";
	document.getElementById("worldName").innerHTML = (game.global.spireActive) ? ((checkIfSpireWorld(true) == 1) ? "Spire" : "Spire " + romanNumeral(checkIfSpireWorld(true))) + (game.global.universe == 2 ? " Floor " + game.global.spireLevel : "") : "Zone";	
}

function repeatClicked(updateOnly){
	if (!updateOnly) game.global.repeatMap = !game.global.repeatMap;
	var color = (game.global.repeatMap) ? "btn-success" : "btn-danger";
	var elem = document.getElementById("repeatBtn");
	var elem2 = document.getElementById("repeatBtn2");
	elem.className = "";
	elem.className = "btn fightBtn " + color;
	elem.innerHTML = (game.global.repeatMap) ? "Repeat On" : "Repeat Off";
	if (elem2 !== null){
		color = (game.global.repeatMap) ? "settingBtn1" : "settingBtn0"; 
		swapClass("settingBtn", color, elem2);
		elem2.innerHTML = (game.global.repeatMap) ? "Repeat On" : "Repeat Off";
	}
}

function selectMap(mapId, force) {
	if (game.options.menu.pauseGame.enabled && !force) return;
    if (!force && game.global.currentMapId !== "") {
		var curMap = getCurrentMapObject();
        message("You must finish or " + ((curMap.noRecycle) ? "abandon" : "recycle") + " your current map before moving on.", "Notices");
        return;
    }
    var map = getMapIndex(mapId);
    map = game.global.mapsOwnedArray[map];
	if (!map) return;
    document.getElementById("selectedMapName").innerHTML = map.name;
	document.getElementById("mapStatsSize").innerHTML = (Math.floor(map.size));
	document.getElementById("mapStatsDifficulty").innerHTML = Math.floor(map.difficulty * 100) + "%";
	document.getElementById("mapStatsLoot").innerHTML = Math.floor(map.loot * 100) + "%";
	document.getElementById("mapStatsItems").innerHTML = (map.location == "Void") ? "&nbsp;" : addSpecials(true, true, map);
	document.getElementById("mapStatsResource").innerHTML = game.mapConfig.locations[map.location].resourceType;
	if (typeof game.global.mapsOwnedArray[getMapIndex(game.global.lookingAtMap)] !== 'undefined') {
		var prevSelected = document.getElementById(game.global.lookingAtMap);
		prevSelected.className = prevSelected.className.replace("mapElementSelected","mapElementNotSelected");
	}
	var currentSelected = document.getElementById(mapId);
	currentSelected.className = currentSelected.className.replace("mapElementNotSelected", "mapElementSelected");
    game.global.lookingAtMap = mapId;
    document.getElementById("selectMapBtn").innerHTML = "Run Map";
    document.getElementById("selectMapBtn").style.visibility = "visible";
	document.getElementById("recycleMapBtn").style.visibility = (map.noRecycle) ? "hidden" : "visible";
}

function runMap(resetCounter = true) {
	if (game.options.menu.pauseGame.enabled) return;
    if (game.global.lookingAtMap === "") return;
	if (challengeActive("Watch")) game.challenges.Watch.enteredMap = true;
	if (challengeActive("Mapology") && !game.global.currentMapId) {
		if (game.challenges.Mapology.credits < 1){
			message("You are all out of Map Credits! Clear some more Zones to earn some more.", "Notices");
			return;
		}
		game.challenges.Mapology.credits--;
		if (game.challenges.Mapology.credits <= 0) game.challenges.Mapology.credits = 0;
		updateMapCredits();
		messageMapCredits()
	}
	if (game.achievements.mapless.earnable){
		game.achievements.mapless.earnable = false;
		game.achievements.mapless.lastZone = game.global.world;
	}
	if (game.global.challengeActive == "Quest" && game.challenges.Quest.questId == 5 && !game.challenges.Quest.questComplete){
		game.challenges.Quest.questProgress++;
		if (game.challenges.Quest.questProgress == 1) game.challenges.Quest.failQuest();
	}
	if (game.global.formation != 4 && game.global.formation != 5) game.global.canScryCache = false;
    var mapId = game.global.lookingAtMap;
    game.global.preMapsActive = false;
    game.global.mapsActive = true;
	game.global.currentMapId = mapId;
	if (resetCounter) game.global.mapRunCounter = 0;
	mapsSwitch(true);
	var mapObj = getCurrentMapObject();
	if (mapObj.bonus){
		game.global.mapExtraBonus = mapObj.bonus;
	}
    if (game.global.lastClearedMapCell == -1) {
        buildMapGrid(mapId);
        drawGrid(true);
		
		if (mapObj.location == "Void"){
			game.global.voidDeaths = 0;
			game.global.voidBuff = mapObj.voidBuff;
			setVoidBuffTooltip();
		}
	}
	if (game.global.challengeActive == "Insanity") game.challenges.Insanity.drawStacks();
	if (game.global.challengeActive == "Pandemonium") game.challenges.Pandemonium.drawStacks();
}

function getHousingMultiplier(){
	amt = 1;
	if (getPerkLevel("Carpentry")) amt *= Math.pow((1 + game.portal.Carpentry.modifier), getPerkLevel("Carpentry"));
	if (getPerkLevel("Carpentry_II") > 0) amt *= (1 + (game.portal.Carpentry_II.modifier * getPerkLevel("Carpentry_II")));
	if (game.global.expandingTauntimp) amt *= game.badGuys.Tauntimp.expandingMult();
	amt *= alchObj.getPotionEffect("Elixir of Crafting");
	return amt;
}

function battleCoordinator(makeUp) {
    if (!game.global.fighting) {
        battle(null);
        return;
	}
	if (game.options.menu.pauseGame.enabled) return;
    game.global.battleCounter += (1000 / game.settings.speed);
	var num = (getPerkLevel("Agility")) ? 1000 * Math.pow(1 - game.portal.Agility.modifier, getPerkLevel("Agility")) : 1000;
	if (game.talents.hyperspeed.purchased) num -= 100;
	
	if (game.global.mapExtraBonus == "fa") {
		num -= 100;
	} else if (game.talents.hyperspeed2.purchased){
		var hsZoneMod = game.talents.liquification3.purchased ? 0.75 : 0.5;
		if (game.global.world <= Math.floor((getHighestLevelCleared(false, true) + 1) * hsZoneMod)){
			num -= 100;
		}
	}
	
	if (!game.global.mapsActive && game.global.gridArray[0].name == "Liquimp" && num < 400)
		num = 400;
	if (game.global.challengeActive == "Quagmire") num += game.challenges.Quagmire.getSpeedPenalty();
	if (game.global.battleCounter >= num) {
        game.global.battleCounter -= num; //Thanks grabz
        fight(makeUp);
    }
}

function battle(force) {
	var trimps = game.resources.trimps;
	var trimpsMax = trimps.realMax();
	if (game.global.fighting) return;
	if (game.global.soldierHealth <= 0) document.getElementById('critSpan').innerHTML = "";
    if ((game.global.switchToMaps || game.global.switchToWorld) && trimps.soldiers === 0) {
        mapsSwitch();
        return;
    }
    if (game.global.preMapsActive) return;
    var pause = (force) ? false : game.global.pauseFight;
    if (!game.global.autoBattle && !force) return;
	if (pause) return;
    if (trimps.soldiers > 0) {
        startFight();
        return;
	}
	var breeding = (trimps.owned - trimps.employed);
	var currentSend = game.resources.trimps.getCurrentSend();
	if (game.global.justAmalged == true && game.resources.trimps.owned < game.resources.trimps.realMax() && game.global.breedBack > 0 && !force){
		return;
	}
	else {
		game.global.justAmalged = false;
	}
	while(checkAmalgamate()){}
	if (breeding < currentSend) return;
	var gensUp = (game.global.GeneticistassistSetting > 0 && game.jobs.Geneticist.owned > 0);
	if (game.options.menu.geneSend.enabled && gensUp){
		if (game.global.lastBreedTime / 1000 >= game.global.GeneticistassistSetting)
			force = true;
	}
    if (force || game.global.challengeActive == "Trapper" || game.global.challengeActive == "Trappapalooza") {
        trimps.soldiers = currentSend;
        trimps.owned -= currentSend;
    } else {
        //var max = Math.ceil((trimpsMax - trimps.employed) * 0.05);
        if ((game.options.menu.geneSend.enabled != 3 || !gensUp) && (trimps.owned >= trimpsMax || (game.global.breedTime <= 0.1 && (game.options.menu.geneSend.enabled != 2 || !gensUp)))) {
            trimps.soldiers = currentSend;
            trimps.owned -= currentSend;
        }
    }
    if (game.resources.trimps.soldiers < currentSend) {
        return;
    }
    startFight();
}

function checkAmalgamate(){
	if (game.global.universe == 2) return;
	var amalgJoinTexts = [
		"A small black hole opens up in the sky and a shrill noise echoes across the town. A few moments later, an Amalgamator is standing in front of you. It looks around briefly, grabs a few Trimps, and runs off towards your soldiers.", 
		"While out walking a Trimp, you suddenly find yourself teleported back to your ship, standing face to face with an Amalgamator. You introduce yourself but it doesn't seem up for conversation.",
		"Suddenly, the largest rain drops you've ever seen start falling from the sky - each drop is at least 1000 times larger than normal. One particularly large drop hits the ground and an Amalgamator pops out! It sends out a quick telepathic greeting, then goes off to find your Trimps.",
		"You're sitting down about to enjoy a rare dinner break, when an Amalgamator gets interested in your dimension and replaces the spacetime of your meal with itself. You really hope they don't do that again.",
		"As you're helping your Trimps cross a deeper-than-average stream, you notice a column of bubbles coming up near your Trimps. A gurgling sound begins to grow from the source of the bubbles, and your Trimps start to get a little freaked out. Suddenly an Amalgamator bursts to the surface, spits some water at a Trimp, then teleports to your town."];
	var amalgLeaveTexts = [
		"You hear the second or third most chilling sound you've ever heard, and your Amalgamator pops up in front of you. It smacks you with a small stick to show dissatisfaction, then disappears in a puff of smoke.", 
		"While walking through your town, you notice your Amalgamator throwing a fit, kicking over food carts and anything else not tied down. You approach it but before you can ask what's wrong, it smacks you with a small stick to show dissatisfaction, then it scurries away.", 
		"You watch as your Amalgamator struggles to find enough free Trimps, panic searching in places such as under rocks or between the leaves of trees. It suddenly seems to remember that it doesn't have to be there, smacks you with a small stick to show dissatisfaction, and turns into nothing.",
		"While in town, a Scientist approaches you to let you know that your Amalgamator is getting upset and to keep an eye out for him. Just as you're finishing the conversation, the Amalgamator appears in front of you. It smacks you both with a small stick to show dissatisfaction, then turns into a small puddle of water - which you ask the Scientist to clean up."];
	if (game.global.challengeActive == "Trapper" || game.global.challengeActive == "Trappapalooza") return false;
	if (game.global.spireActive) return false;
	var ratio = (game.resources.trimps.realMax() / game.resources.trimps.getCurrentSend());
	if (game.jobs.Amalgamator.owned > 0 && ratio < game.jobs.Amalgamator.getFireThresh()){
		game.jobs.Amalgamator.owned--;
		if (game.jobs.Amalgamator.owned == 0){
			 game.jobs.Amalgamator.locked = 1;
			 drawAllJobs();
		}
		var text = amalgLeaveTexts[Math.floor(Math.random() * amalgLeaveTexts.length)];
		if (game.jobs.Amalgamator.owned > 1) text = text.replace(" your Amalgamator ", " one of your Amalgamators ");
		if (game.global.challengeActive == "Trimp") text = toZalgo(text, 10, game.jobs.Amalgamator.owned);
		game.stats.amalgamators.value--;
		message(text, "Notices");
	}
	else {
		if (ratio < game.jobs.Amalgamator.getTriggerThresh()) return false;
		game.jobs.Amalgamator.locked = 0;
		game.jobs.Amalgamator.owned++;
		if (game.global.world == 1) giveSingleAchieve("M'Algamator");
		if (game.jobs.Amalgamator.owned == 1 && game.stats.amalgamators.valueTotal == 0) tooltip("First Amalgamator", null, 'update');
		var text = amalgJoinTexts[Math.floor(Math.random() * amalgJoinTexts.length)];
		if (game.jobs.Amalgamator.owned > 1) text = text.replace(" an ", " another ");
		if (game.global.challengeActive == "Trimp") text = toZalgo(text, Math.floor(Math.random() * 200), game.jobs.Amalgamator.owned);
		game.stats.amalgamators.value++;
		message(text, "Notices");
	}
	game.global.breedBack = game.resources.trimps.getCurrentSend() / 2;
	game.global.lastLowGen = game.global.lowestGen;
	game.global.lowestGen = -1;
	var toTake = game.resources.trimps.getCurrentSend();
	if (game.resources.trimps.owned / 3 < toTake) toTake = game.resources.trimps.owned / 3;
	game.resources.trimps.owned -= toTake;
	game.global.justAmalged = true;
	return true;
}

function getBadCoordLevel(){
	//For Coordinate challenge
	var world = (game.global.mapsActive) ? getCurrentMapObject().level : game.global.world;
	var amt = 1;
	for (var x = 0; x < world - 1; x++){
		amt = Math.ceil(amt * 1.25);
	}
	return amt;
}

function getPierceAmt(){
	var base = 0.2;
	if (challengeActive("Lead")) base += (Math.min(game.challenges.Lead.stacks, 200) * 0.001);
	if (game.global.formation == 3) base *= 0.5;
	if (game.talents.pierce.purchased) base *= 0.75;
	return base;
}

function makeIconEffectHTML(title, text, icon, spanClasses, ids=[], iconText="", tooltipOverride) {
	if (icon.includes("glyphicon")) icon += " glyphicon"
	else if (icon.includes("icon")) icon += " icomoon"
	let tooltip = ``
	let display = ``
	let containerID = (ids[0] ? `id="${ids[0]}" `: "")
	let textID = (ids[1] ? ` id="${ids[1]}"`: "")
	let iconID = (ids[2] ? `id="${ids[2]}"`: "")
	let tooltipType = ((text) ? "'customText'" :  tooltipOverride ? `'${tooltipOverride}'` : 'null')
	if (usingScreenReader) {
		tooltip = `tabindex="0" onkeydown="keyTooltip(event, '${title}', ${tooltipType}, '${text}')"`
		display = `<span class="visually-hidden"> ${title}. Has tooltip.</span>`
	}
	else {
		tooltip = `onmouseover="tooltip('${title}', ${tooltipType}, event, '${text}')" onmouseout="tooltip('hide')"`
	}
	let html = `<div ${containerID}class="badge ${spanClasses ? spanClasses : ""}" ${tooltip}><span${textID}>${iconText}</span><span ${iconID}class="${icon}"></span>${display}</div>`
	return html
}

function startFight() {
	if (game.global.challengeActive && typeof game.challenges[game.global.challengeActive].onStartFight === 'function') {
		game.challenges[game.global.challengeActive].onStartFight();
	}

	game.global.battleCounter = 0;
	document.getElementById('badGuyCol').style.visibility = 'visible';
	let cellNum;
	let cell;
	let cellElem;
	let badCoord;
	let instaFight = false;
	let ubersmithActive = false;
	let map = false;

	if (game.global.mapsActive) {
		cellNum = game.global.lastClearedMapCell + 1;
		cell = game.global.mapGridArray[cellNum];
		if (!cell) {
			mapsSwitch();
			console.log('Crash from missing map cell averted!');
			return;
		}
		cellElem = document.getElementById('mapCell' + cellNum);
		map = game.global.mapsOwnedArray[getMapIndex(game.global.currentMapId)];
	} else {
		cellNum = game.global.lastClearedCell + 1;
		cell = game.global.gridArray[cellNum];
		cellElem = document.getElementById('cell' + cellNum);
		if (cellElem === null) {
			//Not sure what causes this to be needed, but on very rare occasions, this can prevent some save files from freezing on load
			if (game.global.lastClearedCell !== 99) {
				if (game.global.lastClearedCell === -1) {
					buildGrid();
					drawGrid();
					document.getElementById('battleContainer').style.visibility = 'visible';
					document.getElementById('metal').style.visibility = 'visible';
					console.log('Attempted to fight in World when no grid was initialized. Find an adult');
				}
				return;
			}

			nextWorld();
			game.stats.zonesCleared.value++;
			checkAchieve('totalZones');
			console.log('crisis averted');
			return;
		}
	}

	swapClass('cellColor', 'cellColorCurrent', cellElem);
	let badName = "<span id='actualBadName'>" + cell.name + '</span>';
	let displayedName;
	if (challengeActive('Coordinate')) badCoord = getBadCoordLevel();

	if (cell.name === 'Improbability' && game.global.spireActive) {
		displayedName = 'Druopitee';
		if (game.global.universe === 2) displayedName = game.global.spireLevel === 10 ? 'Stuffy' : 'Echo of Stuffy';
		if (badCoord) displayedName = 'Druopitee and Pals';
	} else if (cell.name === 'Omnipotrimp' && game.global.spireActive) {
		displayedName = 'Echo of Druopitee';
		if (badCoord) displayedName = "<span class='smallEnemyName'>Echoes of Druopitee and Pals</span>";
	} else if (cell.name === 'Improbability' && badCoord) {
		displayedName = 'Improbabilities';
	} else if (typeof game.badGuys[cell.name].displayName !== 'undefined') {
		badName = game.badGuys[cell.name].displayName;
		if (badCoord) badName += `s (${prettify(badCoord)})`;
		displayedName = `<span id='actualBadName'>${badName}</span>`;
	} else if (badCoord && !displayedName) {
		const newName = cell.name.replace('_', ' ') + `s (${prettify(badCoord)})`;
		badName = badName.replace(cell.name, newName);
		displayedName = badName;
	} else {
		displayedName = badName.replace('_', ' ');
	}

	if (challengeActive('Smithless') && !game.global.mapsActive && game.global.world % 25 === 0 && game.global.lastClearedCell === -1 && !cell.failedUber) {
		ubersmithActive = true;
		game.challenges.Smithless.saveName = displayedName;
		displayedName = 'Ubersmith';
	}

	if (displayedName === 'Mutimp' || displayedName === 'Hulking Mutimp') {
		displayedName = "<span class='Mutimp'>" + displayedName + '</span>';
	}

	if (mutations.Living.active()) {
		badName = "<span id='livingMutationContainer'" + (cell.mutation === 'Living' ? " class='badNameMutation Living'" : '') + "><span id='livingMutationName'>" + (cell.mutation === 'Living' ? 'Living ' : '') + '</span>' + displayedName + '</span>';
	} else if (cell.vm && visualMutations[cell.vm].highlightMob && displayedName === visualMutations[cell.vm].highlightMob) {
		const tempName = cell.mutation ? mutations[cell.mutation].namePrefix + ' ' + displayedName : displayedName;
		badName = "<span class='badNameMutation " + cell.vm + "'>" + tempName + '</span>';
	} else if (cell.mutation) {
		badName = "<span class='badNameMutation " + cell.mutation + "'>" + mutations[cell.mutation].namePrefix + ' ' + displayedName + '</span>';
	} else if (cell.u2Mutation && cell.u2Mutation.length) {
		badName = "<span class='badNameMutation u2Mutation' style='color: " + u2Mutations.getColor(cell.u2Mutation) + "'>" + u2Mutations.getName(cell.u2Mutation) + ' ' + displayedName + '</span>';
	} else if (cell.vm && visualMutations[cell.vm].namePrefix) {
		badName = "<span class='badNameMutation " + cell.vm + "'>" + visualMutations[cell.vm].namePrefix + ' ' + displayedName + '</span>';
	} else {
		badName = displayedName;
	}

	if (cell.empowerment) {
		badName = getEmpowerment(-1, true) + ' ' + badName;
		badName = "<span class='badNameMutation badName" + getEmpowerment(-1) + "'>" + badName + '</span>';
	}

	if (cell.name === 'Omnipotrimp' && game.global.world % 5 === 0 && !game.global.spireActive) {
		badName += makeIconEffectHTML("Superheated", "This Omnipotrimp is Superheated, and will explode on death.", "icon-fire2", "badBadge Magma");
	}
	if (game.global.brokenPlanet && !game.global.mapsActive) {
		badName += makeIconEffectHTML("Pierce", prettify(getPierceAmt() * 100) +  "% of the damage from this Bad Guy pierces through block", "glyphicon-tint", "badBadge")
	}
	if (challengeActive('Glass') || challengeActive('Slow') || (cell.u2Mutation && cell.u2Mutation.length) || ((game.badGuys[cell.name].fast || cell.mutation === 'Corruption' || cell.mutation === 'Healthy') && !challengeActive('Coordinate') && !challengeActive('Nom'))) {
		badName += makeIconEffectHTML("Fast", "This Bad Guy is fast and attacks first", "glyphicon-forward", "badBadge");
	}
	if (challengeActive('Electricity') || challengeActive('Mapocalypse')) {
		badName += makeIconEffectHTML("Electric", "This Bad Guy is electric and stacks a debuff on your Trimps", "icon-power-cord", "badBadge")
	}

	const badGuyName = document.getElementById('badGuyName');
	if (badGuyName.innerHTML !== badName) badGuyName.innerHTML = badName;

	if (challengeActive('Domination')) handleDominationDebuff();
	const corruptionStart = mutations.Corruption.start(true);
	const magmaActive = mutations.Magma.active();

	if (cell.maxHealth === -1 && checkIfSpireWorld() && game.global.spireActive && !game.global.mapsActive && cell.corrupted) {
		if (Fluffy.isRewardActive('eliminator')) {
			cell.corrupted = 'none';
		} else if (Fluffy.isRewardActive('purifier')) {
			if (getRandomIntSeeded(game.global.mutationSeed++, 0, 100) < 50) cell.corrupted = 'none';
		}
	}

	if (!usingRealTimeOffline) {
		if (cell.mutation) {
			setMutationTooltip(cell.corrupted, cell.mutation);
		} else if (map && map.location === 'Void' && game.global.world >= corruptionStart) {
			setVoidCorruptionIcon();
		} else if (map && magmaActive) {
			setVoidCorruptionIcon(true);
		} else {
			const corruptionBuffElem = document.getElementById('corruptionBuff');
			if (corruptionBuffElem.innerHTML !== '') corruptionBuffElem.innerHTML = '';
		}
	}

	if (challengeActive('Balance') || challengeActive('Unbalance')) updateBalanceStacks();
	if (challengeActive('Toxicity')) updateToxicityStacks();

	if (cell.maxHealth === -1) {
		refillEnergyShield();
		let overkill = 0;

		if (cell.health !== -1) overkill = cell.health;

		if (cell.u2Mutation && cell.u2Mutation.length) cell.attack = u2Mutations.getAttack(cell);
		else if (cell.mutation && typeof mutations[cell.mutation].attack !== 'undefined') cell.attack = mutations[cell.mutation].attack(cell.level, cell.name);
		else cell.attack = game.global.getEnemyAttack(cell.level, cell.name);

		if (cell.u2Mutation && cell.u2Mutation.length) cell.health = u2Mutations.getHealth(cell);
		else if (cell.mutation && typeof mutations[cell.mutation].health !== 'undefined') cell.health = mutations[cell.mutation].health(cell.level, cell.name);
		else cell.health = game.global.getEnemyHealth(cell.level, cell.name);

		let attackMult = 1;
		let healthMult = 1;

		if (game.global.mapsActive) {
			const difficulty = map.difficulty;
			attackMult *= difficulty;
			healthMult *= difficulty;
		}

		if (challengeActive('Daily')) {
			if (typeof game.global.dailyChallenge.badHealth !== 'undefined') {
				healthMult *= dailyModifiers.badHealth.getMult(game.global.dailyChallenge.badHealth.strength);
			}

			if (typeof game.global.dailyChallenge.badMapHealth !== 'undefined' && game.global.mapsActive) {
				healthMult *= dailyModifiers.badMapHealth.getMult(game.global.dailyChallenge.badMapHealth.strength);
			}

			if (typeof game.global.dailyChallenge.empoweredVoid !== 'undefined' && game.global.mapsActive && map.location === 'Void') {
				const empVoidStr = dailyModifiers.empoweredVoid.getMult(game.global.dailyChallenge.empoweredVoid.strength);
				healthMult *= empVoidStr;
				attackMult *= empVoidStr;
			}

			if (typeof game.global.dailyChallenge.empower !== 'undefined') {
				if (!game.global.mapsActive) healthMult *= dailyModifiers.empower.getMult(game.global.dailyChallenge.empower.strength, game.global.dailyChallenge.empower.stacks);
				updateDailyStacks('empower');
			}
		}

		if (game.global.spireActive && checkIfSpireWorld() && !game.global.mapsActive) {
			cell.origAttack = cell.attack;
			cell.origHealth = cell.health;
			cell.attack = getSpireStats(cell.level, cell.name, 'attack', cell.origAttack);
			cell.health = getSpireStats(cell.level, cell.name, 'health', cell.origHealth);
		}

		if (game.global.universe === 1) {
			if (cell.empowerment) {
				if (cell.mutation !== 'Corruption') {
					cell.health = mutations.Corruption.health(cell.level, cell.name);
					cell.attack = mutations.Corruption.attack(cell.level, cell.name);
				}

				healthMult *= 4;
				attackMult *= 1.2;
			}

			if (cell.corrupted === 'corruptStrong') attackMult *= 2;
			if (cell.corrupted === 'healthyStrong') attackMult *= 2.5;
			if (cell.corrupted === 'corruptTough') healthMult *= 5;
			if (cell.corrupted === 'healthyTough') healthMult *= 7.5;

			if (challengeActive('Meditate')) {
				healthMult *= 2;
			}
			if (challengeActive('Balance')) {
				attackMult *= game.global.mapsActive ? 2.35 : 1.17;
				healthMult *= 2;
			}
			if (challengeActive('Life')) {
				healthMult *= 11;
				attackMult *= 6;
			}
			if (challengeActive('Toxicity')) {
				attackMult *= 5;
				healthMult *= 2;
			}
			if (challengeActive('Lead') && game.challenges.Lead.stacks > 0) {
				healthMult *= 1 + Math.min(game.challenges.Lead.stacks, 200) * 0.04;
			}

			if (challengeActive('Coordinate')) {
				healthMult *= badCoord;
			} else if (challengeActive('Domination')) {
				let dominating = false;
				if (map && map.size === cellNum + 1) dominating = true;
				else if (!map && cellNum === 99) dominating = true;

				if (dominating) {
					attackMult *= 2.5;
					healthMult *= 7.5;
				} else {
					attackMult *= 0.1;
					healthMult *= 0.1;
				}
			} else if (challengeActive('Obliterated') || challengeActive('Eradicated')) {
				let oblitMult = challengeActive('Eradicated') ? game.challenges.Eradicated.scaleModifier : 1e12;
				const zoneModifier = Math.floor(game.global.world / game.challenges[game.global.challengeActive].zoneScaleFreq);
				oblitMult *= Math.pow(game.challenges[game.global.challengeActive].zoneScaling, zoneModifier);
				healthMult *= oblitMult;
				attackMult *= oblitMult;
			} else if (challengeActive('Frigid')) {
				const frigidMult = game.challenges.Frigid.getEnemyMult();
				healthMult *= frigidMult;
				attackMult *= frigidMult;
			} else if (challengeActive('Experience')) {
				const xpMult = game.challenges.Experience.getEnemyMult();
				healthMult *= xpMult;
				attackMult *= xpMult;
			}

			if (game.global.mapsActive && game.global.world >= corruptionStart) {
				if (magmaActive && map.location === 'Void') {
					attackMult *= mutations.Corruption.statScale(3).toFixed(1);
					healthMult *= mutations.Corruption.statScale(10).toFixed(1);
				} else if (map.location === 'Void' || magmaActive) {
					attackMult *= (mutations.Corruption.statScale(3) / 2).toFixed(1);
					healthMult *= (mutations.Corruption.statScale(10) / 2).toFixed(1);
				}
			}

			if (cell.name === 'Improbability' || cell.name === 'Omnipotrimp') {
				if (game.global.roboTrimpLevel && game.global.useShriek) activateShriek();

				if (game.global.world >= corruptionStart) {
					if (game.global.spireActive) {
						cell.origHealth *= mutations.Corruption.statScale(10) * healthMult;
						cell.origAttack *= mutations.Corruption.statScale(3) * attackMult;
					} else {
						cell.health *= mutations.Corruption.statScale(10);
						cell.attack *= mutations.Corruption.statScale(3);
					}
				}
			}
		}

		if (game.global.universe === 2) {
			if (challengeActive('Unbalance')) {
				healthMult *= game.global.mapsActive ? 2 : 3;
				attackMult *= 1.5;
			} else if (challengeActive('Duel')) {
				if (game.challenges.Duel.enemyStacks < 20) healthMult *= game.challenges.Duel.healthMult;
			} else if (challengeActive('Quest')) {
				healthMult *= game.challenges.Quest.getHealthMult();
			} else if (challengeActive('Revenge') && game.global.world % 2 === 0) {
				healthMult *= 10;
			} else if (challengeActive('Mayhem')) {
				const mayhemMult = game.challenges.Mayhem.getEnemyMult();
				healthMult *= mayhemMult;
				attackMult *= mayhemMult;
			} else if (challengeActive('Exterminate')) {
				const extMult = game.challenges.Exterminate.getSwarmMult();
				healthMult *= extMult;
				attackMult *= extMult;
			} else if (challengeActive('Nurture')) {
				healthMult *= map ? 10 : 2;
				healthMult *= game.buildings.Laboratory.getEnemyMult();
			} else if (challengeActive('Alchemy')) {
				const alchMap = Boolean(map);
				const alchVoid = alchMap && map.location === 'Void';
				const alchMult = alchObj.getEnemyStats(alchMap, alchVoid) + 1;
				attackMult *= alchMult;
				healthMult *= alchMult;
			} else if (challengeActive('Glass')) {
				game.challenges.Glass.cellStartHealth = cell.health * healthMult;
				healthMult *= game.challenges.Glass.healthMult();
			} else if (challengeActive('Hypothermia')) {
				const hypMult = game.challenges.Hypothermia.getEnemyMult();
				healthMult *= hypMult;
				attackMult *= hypMult;
			} else if (challengeActive('Desolation')) {
				const desoMult = game.challenges.Desolation.getEnemyMult();
				healthMult *= desoMult;
				attackMult *= desoMult;
			} else if (ubersmithActive) {
				healthMult *= game.challenges.Smithless.uberMult;
				cell.ubersmith = true;
				game.challenges.Smithless.uberAttacks = 0;
				overkill = 0;
			}

			//Mayhem and Storm last so attack and health restore properly
			if ((challengeActive('Mayhem') && cellNum === 99 && !game.global.mapsActive) || challengeActive('Pandemonium')) {
				cell.preMayhemHealth = cell.health * healthMult;
				if (cellNum === 99 && !game.global.mapsActive) healthMult *= game.challenges[game.global.challengeActive].getBossMult();
				else healthMult *= game.challenges.Pandemonium.getPandMult();
			} else if (challengeActive('Storm') && !map) {
				game.challenges.Storm.cellStartAttack = cell.attack * attackMult;
				game.challenges.Storm.cellStartHealth = cell.health * healthMult;
				healthMult *= game.challenges.Storm.getHealthMult();
				cell.attack *= game.challenges.Storm.getAttackMult();
			}
		}

		//End bonuses that alter starting attack/health
		cell.attack *= attackMult;
		cell.health *= healthMult;
		cell.maxHealth = cell.health;

		if (overkill === 'shatter' || overkill === 'compressed') cell.health = 0;
		else if (game.global.universe === 1 && getPerkLevel('Overkill') && !(!map && game.global.gridArray[0].name === 'Liquimp')) cell.health -= overkill * getPerkLevel('Overkill') * 0.005;
		else if (game.global.universe === 2 && (!challengeActive('Wither') || !game.global.runningChallengeSquared) && (u2Mutations.tree.Overkill1.purchased || (game.global.mapsActive && u2Mutations.tree.MadMap.purchased))) {
			if (game.global.mapsActive && u2Mutations.tree.MadMap.purchased) {
				cell.health -= overkill;
			} else {
				if (canU2Overkill()) cell.health -= overkill * 0.005;
			}
		}

		const empowerment = getEmpowerment();
		const empowermentUber = getUberEmpowerment();
		if (cell.health < 1) {
			const overkillerCount = getOverkillerCount();
			if (cell.OKcount <= overkillerCount) {
				const nextCell = game.global.mapsActive ? game.global.mapGridArray[cellNum + 1] : game.global.gridArray[cellNum + 1];
				if (nextCell) {
					nextCell.health = overkill === 'shatter' && (cellNum !== 98 || !game.global.spireActive) ? 'shatter' : Math.abs(cell.health);
					nextCell.OKcount = cell.OKcount + 1;
				}
			}
			cell.health = 0;
			cell.overkilled = true;
			instaFight = true;
			if (cell.name === 'Improbability') giveSingleAchieve('One-Hit Wonder');
			if (cell.name === 'Omnipotrimp') giveSingleAchieve('Mighty');
			if (!game.global.mapsActive) game.stats.cellsOverkilled.value++;
		} else {
			if (cell.plaguebringer) {
				if (cell.health > cell.maxHealth * 0.05) {
					cell.health -= cell.plaguebringer;
					if (cell.health < cell.maxHealth * 0.05) cell.health = cell.maxHealth * 0.05;
				}

				if (empowerment) {
					if (empowerment === 'Poison') {
						/* stackPoison handles the poison debuff and plaguebrought scaling */
						stackPoison(cell.plaguebringer);
					} else {
						let hits = cell.plagueHits;
						if (empowermentUber === empowerment) hits *= 2;
						if (Fluffy.isRewardActive('plaguebrought')) hits *= 2;
						game.empowerments[empowerment].currentDebuffPower += Math.ceil(hits);

						if (empowerment === 'Wind') handleWindDebuff();
						if (empowerment === 'Ice') handleIceDebuff();
					}
				}
			}

			if (game.global.formation === 4 || game.global.formation === 5) {
				if (game.global.mapsActive) game.global.waitToScryMaps = false;
				else game.global.waitToScry = false;
			}
		}
	} else if (challengeActive('Nom') && cell.nomStacks) {
		updateNomStacks(cell.nomStacks);
	}

	const trimpsFighting = game.resources.trimps.maxSoldiers;
	const currentSend = game.resources.trimps.getCurrentSend();

	if (game.global.soldierHealth <= 0) {
		if (getHeirloomBonus('Shield', 'gammaBurst') > 0) {
			game.heirlooms.Shield.gammaBurst.stacks = 0;
			updateGammaStacks();
		}

		game.global.armyAttackCount = 0;
		game.global.fightAttackCount = 0;
		game.global.battleCounter = 0;
		const gameTime = getGameTime();

		if (cell.name === 'Voidsnimp' && !game.achievements.oneOffs.finished[game.achievements.oneOffs.names.indexOf('Needs Block')]) {
			if (!cell.killCount) cell.killCount = 1;
			else cell.killCount++;

			if (cell.killCount >= 50) giveSingleAchieve('Needs Block');
		}

		if (game.global.realBreedTime >= 600000 && game.jobs.Geneticist.owned >= 1) giveSingleAchieve('Extra Crispy');

		if (getPerkLevel('Anticipation')) {
			game.global.antiStacks = game.jobs.Amalgamator.owned > 0 ? Math.floor((gameTime - game.global.lastSoldierSentAt) / 1000) : Math.floor(game.global.lastBreedTime / 1000);
			const maxStacks = game.talents.patience.purchased ? 45 : 30;
			if (game.global.antiStacks > maxStacks) game.global.antiStacks = maxStacks;
			updateAntiStacks();
		}

		game.global.lastSoldierSentAt = gameTime;
		game.global.lastBreedTime = 0;
		game.global.realBreedTime = 0;

		if (challengeActive('Electricity') || challengeActive('Mapocalypse')) {
			game.challenges.Electricity.stacks = 0;
			game.challenges.Electricity.attacksInARow = 0;
			updateElectricityStacks();
		}

		if (challengeActive('Daily')) {
			if (typeof game.global.dailyChallenge.plague !== 'undefined') {
				game.global.dailyChallenge.plague.stacks = 0;
				updateDailyStacks('plague');
			}

			if (typeof game.global.dailyChallenge.weakness !== 'undefined') {
				game.global.dailyChallenge.weakness.stacks = 0;
				updateDailyStacks('weakness');
			}

			if (typeof game.global.dailyChallenge.rampage !== 'undefined') {
				game.global.dailyChallenge.rampage.stacks = 0;
				updateDailyStacks('rampage');
			}
		}

		game.global.difs.attack = 0;
		game.global.difs.health = 0;
		game.global.difs.block = 0;
		game.global.difs.trainers = game.jobs.Trainer.owned;
		game.global.soldierHealthMax = game.global.health;
		game.global.maxSoldiersAtStart = game.resources.trimps.maxSoldiers;
		game.global.soldierCurrentAttack = game.global.attack;

		if (game.jobs.Amalgamator.owned > 0) {
			game.global.soldierHealthMax *= game.jobs.Amalgamator.getHealthMult();
		}

		if (magmaActive) {
			const magMult = mutations.Magma.getTrimpDecay();
			game.global.soldierHealthMax *= magMult;
			game.global.soldierCurrentAttack *= magMult;
		}

		game.global.soldierHealthMax *= trimpsFighting;
		game.global.soldierCurrentAttack *= trimpsFighting;
		game.global.soldierCurrentBlock = getBaseBlock() * trimpsFighting;

		if (game.talents.mapHealth.purchased && game.global.mapsActive) {
			game.global.soldierHealthMax *= 2;
			game.global.mapHealthActive = true;
		} else {
			game.global.mapHealthActive = false;
		}

		if (game.global.lowestGen >= 0) {
			if (game.global.breedBack <= 0) {
				game.global.soldierHealthMax *= Math.pow(1.01, game.global.lowestGen);
				game.global.lastLowGen = game.global.lowestGen;
				game.global.lowestGen = -1;
			} else {
				game.global.lastLowGen = 0;
			}
			game.global.breedBack = currentSend / 2;
		}

		if (getPerkLevel('Power') > 0) game.global.soldierCurrentAttack += game.global.soldierCurrentAttack * getPerkLevel('Power') * game.portal.Power.modifier;
		if (getPerkLevel('Toughness') > 0) game.global.soldierHealthMax += game.global.soldierHealthMax * getPerkLevel('Toughness') * game.portal.Toughness.modifier;
		if (getPerkLevel('Resilience') > 0) game.global.soldierHealthMax *= Math.pow(game.portal.Resilience.modifier + 1, getPerkLevel('Resilience'));
		if (game.goldenUpgrades.Battle.currentBonus > 0) game.global.soldierHealthMax *= game.goldenUpgrades.Battle.currentBonus + 1;
		if (game.global.totalSquaredReward > 0) game.global.soldierHealthMax *= game.global.totalSquaredReward / 100 + 1;

		if (game.talents.voidPower.purchased && game.global.voidBuff) {
			game.global.soldierHealthMax *= game.talents.voidPower.getTotalVP() / 100 + 1;
			game.global.voidPowerActive = true;
		} else {
			game.global.voidPowerActive = false;
		}

		if (game.global.mayhemCompletions) game.global.soldierHealthMax *= game.challenges.Mayhem.getTrimpMult();
		if (game.global.pandCompletions) game.global.soldierHealthMax *= game.challenges.Pandemonium.getTrimpMult();
		if (game.global.desoCompletions) game.global.soldierHealthMax *= game.challenges.Desolation.getTrimpMult();

		if (game.global.universe === 1) {
			if (game.global.formation !== 0 && game.global.formation !== 5) {
				game.global.soldierHealthMax *= game.global.formation === 1 ? 4 : 0.5;
				let formAttackMod = 0.5;
				if (game.global.formation === 2) formAttackMod = 4;
				game.global.soldierCurrentAttack *= formAttackMod;
			}
			if (getPerkLevel('Power_II') > 0) game.global.soldierCurrentAttack *= 1 + game.portal.Power_II.modifier * getPerkLevel('Power_II');
			if (getPerkLevel('Toughness_II') > 0) game.global.soldierHealthMax *= 1 + game.portal.Toughness_II.modifier * getPerkLevel('Toughness_II');
			if (game.global.frigidCompletions > 0) game.global.soldierHealthMax *= game.challenges.Frigid.getTrimpMult();

			if (challengeActive('Balance')) {
				game.global.soldierHealthMax *= game.challenges.Balance.getHealthMult();
			}

			if (challengeActive('Life')) {
				game.global.soldierHealthMax *= game.challenges.Life.getHealthMult();
			}

			if (challengeActive('Revenge')) {
				game.global.soldierHealthMax *= game.challenges.Revenge.getMult();
			}
		}

		if (game.global.universe === 2) {
			if (game.buildings.Smithy.owned > 0) game.global.soldierHealthMax *= game.buildings.Smithy.getMult();
			if (Fluffy.isRewardActive('healthy')) game.global.soldierHealthMax *= 1.5;
			if (Fluffy.isRewardActive('scaledHealth')) game.global.soldierHealthMax *= Fluffy.rewardConfig.scaledHealth.mult();
			if (game.buildings.Antenna.owned >= 10) game.global.soldierHealthMax *= game.jobs.Meteorologist.getExtraMult();
			if (autoBattle.bonuses.Stats.level > 0) game.global.soldierHealthMax *= autoBattle.bonuses.Stats.getMult();
			if (game.portal.Observation.trinkets > 0) game.global.soldierHealthMax *= game.portal.Observation.getMult();
			if (getPerkLevel('Championism') > 0) game.global.soldierHealthMax *= game.portal.Championism.getMult();
			if (u2Mutations.tree.Health.purchased) game.global.soldierHealthMax *= 1.5;
			if (u2Mutations.tree.GeneHealth.purchased) game.global.soldierHealthMax *= 10;
			game.global.soldierHealthMax *= u2SpireBonuses.basics();

			if (challengeActive('Duel') && game.challenges.Duel.trimpStacks < 20) {
				game.global.soldierHealthMax *= game.challenges.Duel.healthMult;
			}

			if (challengeActive('Wither')) {
				game.global.soldierHealthMax *= game.challenges.Wither.getTrimpHealthMult();
			}

			if (challengeActive('Insanity') && game.challenges.Insanity.insanity > 0) {
				game.global.soldierHealthMax *= game.challenges.Insanity.getHealthMult();
			}

			if (challengeActive('Berserk')) {
				game.global.soldierHealthMax *= game.challenges.Berserk.getHealthMult();
			}

			if (game.challenges.Nurture.boostsActive()) {
				game.global.soldierHealthMax *= game.challenges.Nurture.getStatBoost();
			}

			if (challengeActive('Alchemy')) {
				game.global.soldierHealthMax *= alchObj.getPotionEffect('Potion of Strength');
			}

			if (challengeActive('Desolation')) {
				game.global.soldierHealthMax *= game.challenges.Desolation.trimpHealthMult();
			}

			if (challengeActive('Smithless') && game.challenges.Smithless.fakeSmithies > 0) {
				game.global.soldierHealthMax *= game.challenges.Smithless.getTrimpMult();
			}
		}

		if (challengeActive('Daily') && typeof game.global.dailyChallenge.pressure !== 'undefined') game.global.soldierHealthMax *= dailyModifiers.pressure.getMult(game.global.dailyChallenge.pressure.strength, game.global.dailyChallenge.pressure.stacks);
		game.global.soldierHealthMax = calcHeirloomBonus('Shield', 'trimpHealth', game.global.soldierHealthMax);

		//Soldier starting health is determined
		game.global.soldierHealth = game.global.soldierHealthMax;
		//Finished setting up new army
		refillEnergyShield();
		if (challengeActive('Devastation') || challengeActive('Revenge')) {
			const lastOverkill = game.challenges[game.global.challengeActive].lastOverkill;
			if (lastOverkill !== -1) reduceSoldierHealth(lastOverkill * 7.5);
			game.challenges[game.global.challengeActive].lastOverkill = -1;
			if (game.global.soldierHealth < 1) {
				game.global.soldierHealth = 0;
				if (challengeActive('Revenge')) {
					game.challenges.Revenge.addStack();
				}
			}
		}
		if (challengeActive('Lead')) manageLeadStacks();
	} else {
		if (challengeActive('Lead')) manageLeadStacks();

		if (game.resources.trimps.soldiers !== currentSend && game.global.maxSoldiersAtStart > 0) {
			const freeTrimps = game.resources.trimps.owned - game.resources.trimps.employed;
			const newTrimps = (game.resources.trimps.maxSoldiers - game.global.maxSoldiersAtStart) / game.global.maxSoldiersAtStart + 1;
			const requiredTrimps = currentSend - game.resources.trimps.soldiers;
			if (freeTrimps >= requiredTrimps) {
				const oldHealth = game.global.soldierHealthMax;
				game.resources.trimps.owned -= requiredTrimps;
				game.global.soldierHealthMax *= newTrimps;
				game.global.soldierHealth += game.global.soldierHealthMax - oldHealth;
				game.global.soldierCurrentAttack *= newTrimps;
				game.global.soldierCurrentBlock *= newTrimps;
				game.resources.trimps.soldiers = currentSend;
				game.global.maxSoldiersAtStart = game.resources.trimps.maxSoldiers;
			}
		}

		//Check map health differences
		if (game.talents.mapHealth.purchased) {
			if (game.global.mapHealthActive && !map) {
				game.global.soldierHealthMax /= 2;
				if (game.global.soldierHealth > game.global.soldierHealthmax) game.global.soldierHealth = game.global.soldierHealthMax;
				game.global.mapHealthActive = false;
				if (game.global.universe === 2) {
					game.global.soldierEnergyShieldMax /= 2;
					if (game.global.soldierEnergyShield > game.global.soldierEnergyShieldMax) game.global.soldierEnergyShield = game.global.soldierEnergyShieldMax;
				}
			} else if (!game.global.mapHealthActive && map) {
				game.global.soldierHealthMax *= 2;
				game.global.mapHealthActive = true;
				if (game.global.universe === 2) game.global.soldierEnergyShieldMax *= 2;
			}
		}
		if (game.talents.voidPower.purchased) {
			const mod = 1 + game.talents.voidPower.getTotalVP() / 100;
			if (game.global.voidPowerActive && (!map || map.location !== 'Void')) {
				game.global.soldierHealthMax /= mod;
				if (game.global.soldierHealth > game.global.soldierHealthmax) game.global.soldierHealth = game.global.soldierHealthMax;
				game.global.voidPowerActive = false;
			} else if (!game.global.voidPowerActive && map && map.location === 'Void') {
				game.global.soldierHealthMax *= mod;
				game.global.voidPowerActive = true;
			}
		}
		//Check differences in equipment, apply perks, bonuses, and formation
		if (game.global.difs.health !== 0) {
			let healthTemp = trimpsFighting * game.global.difs.health * (game.portal.Toughness.modifier * getPerkLevel('Toughness') + 1);

			if (game.jobs.Amalgamator.owned > 0) healthTemp *= game.jobs.Amalgamator.getHealthMult();
			if (magmaActive) healthTemp *= mutations.Magma.getTrimpDecay();
			if (game.talents.mapHealth.purchased && game.global.mapsActive) healthTemp *= 2;
			if (game.jobs.Geneticist.owned > 0) healthTemp *= Math.pow(1.01, game.global.lastLowGen);

			if (getPerkLevel('Resilience') > 0) healthTemp *= Math.pow(game.portal.Resilience.modifier + 1, getPerkLevel('Resilience'));
			if (game.goldenUpgrades.Battle.currentBonus > 0) healthTemp *= game.goldenUpgrades.Battle.currentBonus + 1;
			if (game.global.totalSquaredReward > 0) healthTemp *= game.global.totalSquaredReward / 100 + 1;

			if (game.global.mayhemCompletions) healthTemp *= game.challenges.Mayhem.getTrimpMult();
			if (game.global.pandCompletions) healthTemp *= game.challenges.Pandemonium.getTrimpMult();
			if (game.global.desoCompletions) healthTemp *= game.challenges.Desolation.getTrimpMult();

			if (game.global.universe === 1) {
				if (game.global.formation !== 0 && game.global.formation !== 5) {
					healthTemp *= game.global.formation === 1 ? 4 : 0.5;
				}
				if (getPerkLevel('Toughness_II')) healthTemp *= 1 + game.portal.Toughness_II.modifier * getPerkLevel('Toughness_II');
				if (game.global.frigidCompletions > 0) healthTemp *= game.challenges.Frigid.getTrimpMult();

				if (challengeActive('Balance')) {
					healthTemp *= game.challenges.Balance.getHealthMult();
				}

				if (challengeActive('Life')) {
					healthTemp *= game.challenges.Life.getHealthMult();
				}

				if (challengeActive('Revenge')) {
					healthTemp *= game.challenges.Revenge.getMult();
				}
			}

			if (game.global.universe === 2) {
				if (game.buildings.Smithy.owned > 0) healthTemp *= game.buildings.Smithy.getMult();
				if (Fluffy.isRewardActive('healthy')) healthTemp *= 1.5;
				if (Fluffy.isRewardActive('scaledHealth')) healthTemp *= Fluffy.rewardConfig.scaledHealth.mult();
				if (game.buildings.Antenna.owned >= 10) healthTemp *= game.jobs.Meteorologist.getExtraMult();
				if (autoBattle.bonuses.Stats.level > 0) healthTemp *= autoBattle.bonuses.Stats.getMult();
				if (game.portal.Observation.trinkets > 0) healthTemp *= game.portal.Observation.getMult();
				if (getPerkLevel('Championism')) healthTemp *= game.portal.Championism.getMult();
				if (u2Mutations.tree.Health.purchased) healthTemp *= 1.5;
				if (u2Mutations.tree.GeneHealth.purchased) healthTemp *= 10;
				healthTemp *= u2SpireBonuses.basics();

				if (challengeActive('Duel') && game.challenges.Duel.trimpStacks < 20) {
					healthTemp *= game.challenges.Duel.healthMult;
				}

				if (challengeActive('Wither')) {
					healthTemp *= game.challenges.Wither.getTrimpHealthMult();
				}

				if (challengeActive('Insanity')) {
					healthTemp *= game.challenges.Insanity.getHealthMult();
				}

				if (challengeActive('Berserk')) {
					healthTemp *= game.challenges.Berserk.getHealthMult();
				}

				if (game.challenges.Nurture.boostsActive()) {
					healthTemp *= game.challenges.Nurture.getStatBoost();
				}

				if (challengeActive('Alchemy')) {
					healthTemp *= alchObj.getPotionEffect('Potion of Strength');
				}

				if (challengeActive('Desolation')) {
					healthTemp *= game.challenges.Desolation.trimpHealthMult();
				}

				if (challengeActive('Smithless') && game.challenges.Smithless.fakeSmithies > 0) {
					healthTemp *= game.challenges.Smithless.getTrimpMult();
				}
			}

			if (challengeActive('Daily') && typeof game.global.dailyChallenge.pressure !== 'undefined') healthTemp *= dailyModifiers.pressure.getMult(game.global.dailyChallenge.pressure.strength, game.global.dailyChallenge.pressure.stacks);

			healthTemp = calcHeirloomBonus('Shield', 'trimpHealth', healthTemp);
			game.global.soldierHealthMax += healthTemp;
			game.global.soldierHealth += healthTemp;
			game.global.difs.health = 0;
			if (game.global.soldierHealth <= 0) game.global.soldierHealth = 0;
		}

		if (game.global.difs.attack !== 0) {
			let attackTemp = trimpsFighting * game.global.difs.attack * (game.portal.Power.modifier * getPerkLevel('Power') + 1);
			if (magmaActive) attackTemp *= mutations.Magma.getTrimpDecay();
			if (getPerkLevel('Power_II')) attackTemp *= 1 + game.portal.Power_II.modifier * getPerkLevel('Power_II');
			if (game.global.formation !== 0 && game.global.formation !== 5) {
				attackTemp *= game.global.formation === 2 ? 4 : 0.5;
			}
			game.global.soldierCurrentAttack += attackTemp;
			game.global.difs.attack = 0;

			if (game.global.soldierCurrentAttack <= 0) game.global.soldierHealth = 0;
		}

		if (game.global.difs.block !== 0) {
			let blockTemp = trimpsFighting * game.global.difs.block * (game.global.difs.trainers * (calcHeirloomBonus('Shield', 'trainerEfficiency', game.jobs.Trainer.modifier) / 100) + 1);
			if (game.global.formation !== 0 && game.global.formation !== 5) {
				blockTemp *= game.global.formation === 3 ? 4 : 0.5;
			}
			blockTemp = calcHeirloomBonus('Shield', 'trimpBlock', blockTemp);
			game.global.soldierCurrentBlock += blockTemp;
			game.global.difs.block = 0;
		}
	}

	if (game.global.soldierHealth > game.global.soldierHealthMax) game.global.soldierHealth = game.global.soldierHealthMax;
	if (!instaFight) updateAllBattleNumbers(game.resources.trimps.soldiers < currentSend);
	game.global.fighting = true;
	game.global.lastFightUpdate = new Date();
	if (instaFight) fight();
}

function getOverkillerCount(getNumber){
	var overkillerCount = 0;
	if (game.global.universe == 1){
		overkillerCount = Fluffy.isRewardActive("overkiller");
		if (game.talents.overkill.purchased) overkillerCount++;
		if (getEmpowerment() == "Ice"){
			if (game.empowerments.Ice.getLevel() >= 50) overkillerCount++;
			if (game.empowerments.Ice.getLevel() >= 100) overkillerCount++;
		}
		if (getUberEmpowerment() == "Ice") overkillerCount += 2;
	}
	else {
		if (!canU2Overkill() && !getNumber) return 0;
		overkillerCount = 0;
		if (u2Mutations.tree.MaxOverkill.purchased) overkillerCount++;
	}
	return overkillerCount;
}

function canU2Overkill(getMult){
	var allowed = .3;
	if (u2Mutations.tree.Overkill2.purchased) allowed += 0.1;
	if (u2Mutations.tree.Overkill3.purchased) allowed += 0.1;
	if (u2Mutations.tree.Liq3.purchased){
		allowed += 0.1;
		if (u2Mutations.tree.Liq2.purchased) allowed += 0.1;
	}
	if (getMult) return allowed;
	if (game.global.world <= ((game.global.highestRadonLevelCleared + 1) * allowed)) return true;
	return false;
}

function refillEnergyShield(){
	game.global.shieldLayersUsed = 0;
	game.global.soldierEnergyShieldMax = getMaxEnergyShield();
	game.global.soldierEnergyShield = game.global.soldierEnergyShieldMax;
}

function updateAllBattleNumbers(skipNum) {
	if (usingRealTimeOffline) return;

	const prefix = game.global.mapsActive ? 'Map' : '';
	const cellNum = game.global[`lastCleared${prefix}Cell`] + 1;
	const cell = game.global[`${prefix ? 'mapGridArray' : 'gridArray'}`][cellNum];
	const cellElem = document.getElementById(`${prefix ? 'mapCell' : 'cell'}${cellNum}`);
	if (!cellElem) return;

	swapClass('cellColor', 'cellColorCurrent', cellElem);
	let elem = document.getElementById('goodGuyHealthMax');
	let elemText = prettify(game.global.soldierHealthMax);
	if (elem.innerHTML != elemText) elem.innerHTML = elemText;
	updateGoodBar();
	updateBadBar(cell);

	elem = document.getElementById('badGuyHealthMax');
	elemText = prettify(cell.maxHealth);
	if (elem.innerHTML != elemText) elem.innerHTML = elemText;

	if (!skipNum) {
		elem = document.getElementById('trimpsFighting');
		elemText = prettify(game.resources.trimps.getCurrentSend());
		if (challengeActive('Trimp') && game.jobs.Amalgamator.owned > 0) elemText = toZalgo(elemText, game.global.world);
		if (elem && elem.innerHTML != elemText) elem.innerHTML = elemText;
	}

	let blockDisplay = '';

	if (game.global.universe === 2) {
		const layers = Fluffy.isRewardActive('shieldlayer');
		let shieldMax = game.global.soldierEnergyShieldMax;
		let shieldMult = getEnergyShieldMult();
		if (layers > 0) {
			shieldMax *= layers + 1;
			shieldMult *= layers + 1;
		}
		blockDisplay = `${prettify(shieldMax)} (${Math.round(shieldMult * 100)}%)`;
	} else {
		blockDisplay = prettify(game.global.soldierCurrentBlock);
	}

	elem = document.getElementById('goodGuyBlock');
	if (elem.innerHTML !== blockDisplay.toString()) elem.innerHTML = blockDisplay;

	elem = document.getElementById('goodGuyAttack');
	elemText = calculateDamage(game.global.soldierCurrentAttack, true, true);
	if (elem.innerHTML != elemText) elem.innerHTML = elemText;

	elem = document.getElementById('badGuyAttack');
	const badGuyAttack = calculateDamage(cell.attack, true, false, false, cell);
	elemText = `${badGuyAttack}${game.global.usingShriek ? ' <span class="icomoon icon-chain"></span>' : ''}`;
	if (elem.innerHTML !== elemText) elem.innerHTML = elemText;

	if (game.global.usingShriek) swapClass('dmgColor', 'dmgColorRed', elem);
}

function toZalgo(string, seed, strength){
	string = string.toString();
	if (!strength) strength = 8;
	var zalgo_table = ['\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0361', '\u0489'];
	seed *= 1000;
	var newString = "";
	for (var x = 0; x < string.length; x++){
		var rand = getRandomIntSeeded(seed - x, 0, 10);
		newString += string[x];
		if (rand < strength){
			newString += zalgo_table[getRandomIntSeeded(seed + x, 0, zalgo_table.length)];
		}
	}
	return newString;
}

function updateGoodBar() {
    document.getElementById("goodGuyHealth").innerHTML = prettify(game.global.soldierHealth);
	if (!game.options.menu.progressBars.enabled) return;
	var barElem = document.getElementById("goodGuyBar");
	if (game.global.universe == 2){
		var maxLayers = (Fluffy.isRewardActive('shieldlayer'));
		var layers = maxLayers - game.global.shieldLayersUsed;
		var esElem = document.getElementById("energyShield");
		var layerElem = document.getElementById("energyShieldLayer");
		var layer2Elem = document.getElementById("energyShieldLayer2");
		if (game.global.soldierEnergyShieldMax <= 0 || game.global.soldierHealth <= 0 || game.global.soldierEnergyShield <= 0){
			esElem.style.width = "0%";
			layerElem.style.width = "0%";
			layer2Elem.style.width = "0%";
		}
		else if (layers > 1){
			esElem.style.width = "100%";
			layerElem.style.width = "100%";
			var es = ((game.global.soldierEnergyShield / game.global.soldierEnergyShieldMax) * 100);
			layer2Elem.style.width = es + "%";
		}
		else if (layers > 0){
			esElem.style.width = "100%";
			var es = ((game.global.soldierEnergyShield / game.global.soldierEnergyShieldMax) * 100);
			layerElem.style.width = es + "%";
			layer2Elem.style.width = "0%";
		}
		else{
			var es = ((game.global.soldierEnergyShield / game.global.soldierEnergyShieldMax) * 100);
			esElem.style.width = es + "%";
			layerElem.style.width = "0%";
			layer2Elem.style.width = "0%";
		}
	}
    var percent = ((game.global.soldierHealth / game.global.soldierHealthMax) * 100);
    barElem.style.width = percent + "%";
	swapClass("percentColor", getBarColorClass(percent), barElem);
}

function getEnergyShieldMult(){
	if (game.global.universe != 2) return 0;
	var total = 0;
	if (game.upgrades.Prismatic.done) total += 0.5; //Prismatic: Drops Z2
	if (game.upgrades.Prismalicious.done) total += 0.5; //Prismalicious: Drops from Prismatic Palace at Z20
	if (getPerkLevel("Prismal") > 0) total += (getPerkLevel("Prismal") * game.portal.Prismal.modifier); //Prismal perk, total possible is 100%
	total += (Fluffy.isRewardActive("prism") * 0.25); //Fluffy Prism reward, 25% each, total of 25% available
	if (game.global.challengeActive == "Bublé") total += 2.5; //Bublé challenge - 100%
	if (autoBattle.oneTimers.Suprism.owned) total += autoBattle.oneTimers.Suprism.getMult();
	if (getHeirloomBonus("Shield", "prismatic") > 0) total += (getHeirloomBonus("Shield", "prismatic") / 100);
	
	return total;
}

function getMaxEnergyShield(){
	return game.global.soldierHealthMax * getEnergyShieldMult();
}

function updateBadBar(cell) {
	document.getElementById("badGuyHealth").innerHTML = prettify(cell.health);
	if (!game.options.menu.progressBars.enabled) return;
	var barElem = document.getElementById("badGuyBar");
	var percent = ((cell.health / cell.maxHealth) * 100);
    barElem.style.width = percent + "%";
	swapClass("percentColor", getBarColorClass(percent), barElem);
}

function getBaseBlock(){
	var baseBlock = Math.floor((game.global.block * (game.jobs.Trainer.owned * (calcHeirloomBonus("Shield", "trainerEfficiency", game.jobs.Trainer.modifier) / 100)) + game.global.block));
	baseBlock = calcHeirloomBonus("Shield", "trimpBlock", baseBlock);
	if (game.global.formation !== 0 && game.global.formation !== 5){
		baseBlock *= (game.global.formation === 3) ? 4 : 0.5;
	}
	return baseBlock;
}

function applyMultipliers(multipliers, stat, challenge, postChallengeCheck) {
	Object.keys(multipliers).forEach((key) => {
		const mult = multipliers[key]();
		if (challenge && postChallengeCheck && key === 'Nurture' && game.challenges.Nurture.boostsActive()) stat *= mult;
		else if (challenge) stat *= challengeActive(key) ? mult : 1;
		else stat *= mult;
	});

	return stat;
}

function applyDailyMultipliers(modifier, value = 1) {
	const dailyChallenge = game.global.dailyChallenge;
	if (typeof dailyChallenge[modifier] === 'undefined') return value;
	return dailyModifiers[modifier].getMult(dailyChallenge[modifier].strength, dailyChallenge[modifier].stacks);
}

function randomIntInclusive(min, max) {
	// Return a random integer between min and max (inclusive on both ends).
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function calculateDamage(baseAttack = 1, buildString, isTrimp, noCheckAchieve, cell, noFluctuation) {
	let fluctuation = 0.2; // % fluctuation
	let maxFluct = -1;
	let minFluct = -1;
	if (getPerkLevel('Equality')) baseAttack *= game.portal.Equality.getMult(isTrimp);

	if (isTrimp) { // Situational Trimp damage increases.
		const fluctChallenge = challengeActive('Discipline') || challengeActive('Unlucky');
		if (fluctChallenge) fluctuation = 0.995;
		if (!fluctChallenge && getPerkLevel('Range') > 0) minFluct = fluctuation - 0.02 * getPerkLevel('Range');
		const heirloomAttack = calcHeirloomBonus('Shield', 'trimpAttack', 1, false);

		const multipliers = {
			achievementBonus: () => 1 + game.global.achievementBonus / 100,
			goldenBattle: () => 1 + game.goldenUpgrades.Battle.currentBonus,
			heirloom: () => heirloomAttack,
			challengeSquared: () => 1 + game.global.totalSquaredReward / 100,
			titimp: () => (game.global.mapsActive && game.global.titimpLeft > 0 ? 2 : 1),
			roboTrimp: () => 1 + 0.2 * game.global.roboTrimpLevel,
			mapBonus: () => (game.global.mapsActive ? 1 : game.talents.mapBattery.purchased && game.global.mapBonus === 10 ? 5 : 1 + game.global.mapBonus * 0.2),
			herbalist: () => (game.talents.herbalist.purchased ? game.talents.herbalist.getBonus() : 1),
			bionic2: () => (game.global.mapsActive && game.talents.bionic2.purchased && getCurrentMapObject().level > game.global.world ? 1.5 : 1),
			voidPower: () => (game.talents.voidPower.purchased && game.global.voidBuff ? 1 + game.talents.voidPower.getTotalVP() / 100 : 1),
			voidMastery: () => (game.talents.voidMastery.purchased && game.global.voidBuff ? 5 : 1),
			fluffy: () => (Fluffy.isActive() ? Fluffy.getDamageModifier() : 1),
			mayhem: () => game.challenges.Mayhem.getTrimpMult(),
			pandemonium: () => game.challenges.Pandemonium.getTrimpMult(),
			desolation: () => game.challenges.Desolation.getTrimpMult(),
			sugarRush: () => (game.global.sugarRush ? sugarRush.getAttackStrength() : 1),
			strengthTowers: () => 1 + playerSpireTraps.Strength.getWorldBonus() / 100,
			sharpTrimps: () => (game.singleRunBonuses.sharpTrimps.owned ? 1.5 : 1)
		};

		baseAttack = applyMultipliers(multipliers, baseAttack);

		if (game.global.universe === 1) {
			const worldCell = getCurrentWorldCell();
			const scryerBonusActive = ['Corruption', 'Healthy'].includes(worldCell.mutation) && game.talents.scry.purchased && !game.global.mapsActive && isScryerBonusActive();

			const multipliers = {
				anticipation: () => (game.global.antiStacks > 0 ? game.global.antiStacks * getPerkLevel('Anticipation') * game.portal.Anticipation.modifier + 1 : 1),
				stillRowing: () => (game.talents.stillRowing2.purchased ? game.global.spireRows * 0.06 + 1 : 1),
				magmamancer: () => (game.talents.magmamancer.purchased ? game.jobs.Magmamancer.getBonusPercent() : 1),
				kerfluffle: () => (Fluffy.isActive() && game.talents.kerfluffle.purchased ? game.talents.kerfluffle.mult() : 1),
				strengthInHealth: () => (game.talents.healthStrength.purchased && mutations.Healthy.active() ? 0.15 * mutations.Healthy.cellCount() + 1 : 1),
				voidSipon: () => (game.stats.totalVoidMaps.value && Fluffy.isRewardActive('voidSiphon') ? 1 + game.stats.totalVoidMaps.value * 0.05 : 1),
				amalgamator: () => game.jobs.Amalgamator.getDamageMult(),
				poisionEmpowerment: () => (getUberEmpowerment() === 'Poison' ? 3 : 1),
				frigid: () => game.challenges.Frigid.getTrimpMult(),
				scryerBonus: () => (scryerBonusActive ? 2 : 1),
				iceEmpowerment: () => (getEmpowerment() === 'Ice' ? 1 + game.empowerments.Ice.getDamageModifier() : 1)
			};

			baseAttack = applyMultipliers(multipliers, baseAttack);

			const challengeMultipliers = {
				Decay: () => 5 * Math.pow(0.995, game.challenges.Decay.stacks),
				Electricity: () => 1 - game.challenges.Electricity.stacks * 0.1,
				Life: () => game.challenges.Life.getHealthMult(),
				Lead: () => (game.global.world % 2 === 1 ? 1.5 : 1)
			};

			baseAttack = applyMultipliers(challengeMultipliers, baseAttack, true);

			if (game.global.antiStacks > 0) updateAntiStacks();
		}

		if (game.global.universe === 2) {
			const multipliers = {
				smithy: () => game.buildings.Smithy.getMult(),
				hunger: () => game.portal.Hunger.getMult(),
				tenacity: () => game.portal.Tenacity.getMult(),
				spireStats: () => autoBattle.bonuses.Stats.getMult(),
				championism: () => game.portal.Championism.getMult(),
				frenzy: () => (game.portal.Frenzy.frenzyActive() ? 1 + 0.5 * getPerkLevel('Frenzy') : 1),
				observation: () => game.portal.Observation.getMult(),
				mutatorAttack: () => (u2Mutations.tree.Attack.purchased ? 1.5 : 1),
				geneAttack: () => (u2Mutations.tree.GeneAttack.purchased ? 10 : 1),
				brainsToBrawn: () => (u2Mutations.tree.Brains.purchased ? u2Mutations.tree.Brains.getBonus() : 1),
				novaStacks: () => (!game.global.mapsActive && game.global.novaMutStacks > 0 ? u2Mutations.types.Nova.trimpAttackMult() : 1),
				spireDaily: () => (challengeActive('Daily') && Fluffy.isRewardActive('SADailies') ? Fluffy.rewardConfig.SADailies.attackMod() : 1),
				stuffySpireStats: () => (game.global.u2SpireCellsBest > 0 ? u2SpireBonuses.basics() : 1),
				sporePenalty: () => (!game.global.mapsActive && game.global.spireActive && game.global.spireMutStacks > 0 ? u2Mutations.types.Spire1.trimpAttackMult() : 1)
			};

			baseAttack = applyMultipliers(multipliers, baseAttack);

			const challengeMultipliers = {
				Unbalance: () => game.challenges.Unbalance.getAttackMult(),
				Duel: () => (game.challenges.Duel.trimpStacks > 50 ? 3 : 1),
				Melt: () => 5 * Math.pow(0.99, game.challenges.Melt.stacks),
				Quagmire: () => game.challenges.Quagmire.getExhaustMult(),
				Revenge: () => game.challenges.Revenge.getMult(),
				Quest: () => game.challenges.Quest.getAttackMult(),
				Archaeology: () => game.challenges.Archaeology.getStatMult('attack'),
				Storm: () => (game.global.mapsActive ? game.challenges.Storm.getMapMult() : 1),
				Berserk: () => game.challenges.Berserk.getAttackMult(),
				Nurture: () => game.challenges.Nurture.getStatBoost(),
				Alchemy: () => alchObj.getPotionEffect('Potion of Strength'),
				Desolation: () => game.challenges.Desolation.trimpAttackMult(),
				Smithless: () => game.challenges.Smithless.getTrimpMult()
			};
			baseAttack = applyMultipliers(challengeMultipliers, baseAttack, true);
		}

		if (challengeActive('Daily')) {
			if (game.talents.daily.purchased) baseAttack *= 1.5;

			if (typeof game.global.dailyChallenge.minDamage !== 'undefined') {
				if (minFluct === -1) minFluct = fluctuation;
				minFluct += dailyModifiers.minDamage.getMult(game.global.dailyChallenge.minDamage.strength);
			}

			if (typeof game.global.dailyChallenge.maxDamage !== 'undefined') {
				if (maxFluct === -1) maxFluct = fluctuation;
				maxFluct += dailyModifiers.maxDamage.getMult(game.global.dailyChallenge.maxDamage.strength);
			}

			baseAttack *= applyDailyMultipliers('weakness', 1);
			baseAttack *= applyDailyMultipliers('rampage', 1);
			if (game.global.world % 2 === 1) baseAttack *= applyDailyMultipliers('oddTrimpNerf', 1);
			if (game.global.world % 2 === 0) baseAttack *= applyDailyMultipliers('evenTrimpBuff', 1);
		}
	} else { // Situational Bad Guy damage increases.
		if (game.global.universe === 1) {
			const challengeMultipliers = {
				Meditate: () => 1.5,
				Coordinate: () => getBadCoordLevel(),
				Nom: () => (typeof cell.nomStacks !== 'undefined' ? Math.pow(1.25, cell.nomStacks) : 1),
				Watch: () => 1.25,
				Lead: () => 1 + Math.min(game.challenges.Lead.stacks, 200) * 0.04,
				Corrupted: () => 3,
				Scientist: () => (getScientistLevel() === 5 ? 10 : 1)
			};
			baseAttack = applyMultipliers(challengeMultipliers, baseAttack, true, false);
			if (game.global.usingShriek) baseAttack *= game.mapUnlocks.roboTrimp.getShriekValue();
		}

		if (game.global.universe === 2) {
			fluctuation = 0.5;
			const challengeMultipliers = {
				Duel: () => (game.challenges.Duel.enemyStacks > 50 ? 3 : 1),
				Wither: () => game.challenges.Wither.getEnemyAttackMult(),
				Archaeology: () => game.challenges.Archaeology.getStatMult('enemyAttack'),
				Mayhem: () => (!game.global.mapsActive && cell && cell.level === 100 ? game.challenges.Mayhem.getBossMult() : 1),
				Nurture: () => 2 * game.buildings.Laboratory.getEnemyMult(),
				Pandemonium: () => (!game.global.mapsActive && cell && cell.level === 100 ? game.challenges.Pandemonium.getBossMult() : game.challenges.Pandemonium.getPandMult()),
				Glass: () => game.challenges.Glass.attackMult()
			};
			baseAttack = applyMultipliers(challengeMultipliers, baseAttack, true, false);

			if (!game.global.mapsActive && game.global.novaMutStacks > 0) baseAttack *= u2Mutations.types.Nova.enemyAttackMult();
			if (!game.global.mapsActive && game.global.spireActive && game.global.spireMutStacks > 0) baseAttack *= u2Mutations.types.Spire1.enemyAttackMult();
			if (cell.u2Mutation && cell.u2Mutation.length && u2Mutations.types.Rage.hasRage(cell)) baseAttack *= u2Mutations.types.Rage.enemyAttackMult();
		}

		if (challengeActive('Daily')) {
			baseAttack *= applyDailyMultipliers('bloodthirst', 1);
			baseAttack *= applyDailyMultipliers('badStrength', 1);
			if (game.global.mapsActive) baseAttack *= applyDailyMultipliers('badMapStrength', 1);
			if (!game.global.mapsActive) baseAttack *= applyDailyMultipliers('empower', 1);
		}

		// Keep ice last for achievements.
		if (getEmpowerment() === 'Ice') {
			baseAttack *= game.empowerments.Ice.getCombatModifier();
			if (baseAttack >= 0 && baseAttack < 1 && !game.global.mapsActive) giveSingleAchieve('Brr');
		}

		if (game.global.world >= getObsidianStart() && !game.global.mapsActive) baseAttack = Infinity;
	}

	if (minFluct > 1) minFluct = 1;
	else if (minFluct < 0) minFluct = fluctuation;
	if (maxFluct < 0) maxFluct = fluctuation;

	const min = Math.floor(baseAttack * (1 - minFluct));
	if (noFluctuation) return min;

	const max = Math.ceil(baseAttack + baseAttack * maxFluct);
	const runningUnlucky = challengeActive('Unlucky');
	let actuallyLucky = false;

	if (buildString || runningUnlucky) {
		let critMin = min;
		let critMax = max;
		if (isTrimp) {
			if (noCheckAchieve) return max;
			const critChance = getPlayerCritChance();

			if (critChance >= 1) {
				const critDamage = getPlayerCritDamageMult();
				baseAttack *= critDamage;
				if (Math.floor(critChance) >= 2) baseAttack *= getMegaCritDamageMult(Math.floor(critChance));
				critMin = Math.floor(baseAttack * (1 - minFluct));
				critMax = Math.ceil(baseAttack + baseAttack * maxFluct);
			}

			if (!buildString && isTrimp) { // Running unlucky, but not building a string.
				if (Number(critMin.toString()[0]) % 2 === 0) actuallyLucky = true;
				game.challenges.Unlucky.lastHitLucky = actuallyLucky;
			} else {
				checkAchieve('damage', critMax);
			}
		}

		if (buildString) { // Maybe running Unlucky, building a string anyways.
			return prettify(critMin) + '-' + prettify(critMax);
		}
	}2

	if (runningUnlucky && isTrimp) {
		let worst = randomIntInclusive(min, max);
		let best = worst;
		for (let x = 0; x < 4; x++) {
			const roll = randomIntInclusive(min, max);
			if (roll < worst) worst = roll;
			if (roll > best) best = roll;
		}
		if (actuallyLucky) return best;
		return worst;
	}

	return randomIntInclusive(min, max);
}

function updateForemenCount(){
	document.getElementById("foremenCount").innerHTML = (game.global.autoCraftModifier * 4) + " Foremen";
	updateBuildSpeed();
}

function tryScry(){
	var roll = getRandomIntSeeded(game.global.scrySeed, 0, 100);
	if (roll < 50 || roll > 52) return;
	var reward = calculateScryingReward();
	if (reward <= 0) return;
	if (countHeliumSpent() <= 0 && game.global.canRespecPerks && !game.global.bonePortalThisRun) giveSingleAchieve("Unessenceted");
	game.global.essence += reward;
	var maxCost = getTotalTalentCost();
	var talentCount = countPurchasedTalents();
	var maxTalents = Object.keys(game.talents).length;
	if (game.global.spentEssence + game.global.essence > maxCost || talentCount == maxTalents){
		if (talentCount == maxTalents){
			game.global.essence = 0;
		}
		else{
			game.global.essence = Math.max(maxCost - game.global.spentEssence, 0);
			game.global.essence = Math.round(game.global.essence);
		}
		message("You have no more use for Dark Essence!", "Loot", "*cloud3", "essenceMessage", "essence");
	}
	else {
		var essenceRemaining = countRemainingEssenceDrops();
		message("You found " + prettify(reward) + " Dark Essence! There " + ((essenceRemaining == 1) ? "is " : "are ") + essenceRemaining + " Essence drop" + needAnS(essenceRemaining) + " left in the current Zone.", "Loot", "*cloud3", "essenceMessage", "essence");
	}
	updateTalentNumbers();
	return reward;
}

function tryWorship(){
	var roll = getRandomIntSeeded(game.global.scrySeed, 0, 10000);
	var chance = game.jobs.Worshipper.getXpChance() * 100;
	if (roll >= chance) return;
	roll = getRandomIntSeeded(game.global.scrySeed * 2,25,51);
	var reward = Fluffy.getExpReward(true, (roll / 100));
	game.global.fluffyExp2 += reward;
	if (game.global.challengeActive == "Nurture"){
		game.challenges.Nurture.gaveExp(reward);
	}
	message("Your Worshippers successfully inspire Scruffy, granting " + prettify(reward) + " Exp!", "Loot", "*library", "expMessage", "exp");
}

function countRemainingEssenceDrops(){
	var cellsRemaining = 100 - game.global.lastClearedCell - 1;
	var count = 0;
	for (var x = 1; x <= cellsRemaining; x++){
		var roll = getRandomIntSeeded(game.global.scrySeed + x, 0, 100);
		if (roll < 50 || roll > 52) continue;
		count++;
	}
	return count;
}

function calculateScryingReward(){
	var scryableLevels = game.global.world - 180;
	if (scryableLevels <= 0) return 0;
	var modAmt = (game.global.canMagma) ? 1.1683885 : 1.11613; //4.0 compatibility
	var num = (1 * Math.pow(modAmt, scryableLevels)) / 3;
	if (num < 1) num = 1;
	if (game.talents.scry.purchased && !game.global.mapsActive){
		var worldCell = getCurrentWorldCell();
		if (worldCell.mutation == "Corruption" || worldCell.mutation == "Healthy"){
			num *= 1.5;
		}
	}
	if (game.global.spiresCompleted >= 1){
		num *= Math.pow(4, game.global.spiresCompleted);
	}
	if (game.global.challengeActive == "Daily"){
		num *= (1 + (getDailyHeliumValue(countDailyWeight()) / 100));
	}
	num = Math.floor(num);
	return (num < 1) ? 1 : num;
}

function getHighestUnlockedTalentTier(){
	var totalTiers = getHighestTalentTier();
	var colsPerTier = 6;

	var affordable = checkAffordableTalents();
	var required = 0;
	for (var x = 2; x <= totalTiers; x++){
		var add = (x > colsPerTier) ? colsPerTier : x;
		required += add;
		if (required > affordable) return x;
	}
	return totalTiers;
}

function getHighestIdealRow(){
	var idealPoints = [16, 22, 28, 34, 40, 46, 51, 55, 58, 60];
	var affordable = checkAffordableTalents();
	for (var x = 0; x < idealPoints.length; x++){
		if (affordable < idealPoints[x]) return x;
	}
	return idealPoints.length;
}

function getTalentsPurchased() {
	let talentsPurchased = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:10, 10:0}
	for (let talent of Object.values(game.talents)) {
		if (talent.purchased) talentsPurchased[talent.tier]++ 
	}
	return talentsPurchased
}

function displayTalents() {
	var tiers = getAllowedTalentTiers();
	var talentsPurchased = getTalentsPurchased();
	var purchasePower = getHighestUnlockedTalentTier();
	var highestBuyoutRow = getHighestPurchaseableRow();
	var highestIdealRow = getHighestIdealRow();
	var rowUnlocked = true;
	var currentTier = 0;
	var makeTooltips = []
	var html = `<table role="grid" class="talentTable">`;
	for (var item in game.talents){
		var talent = game.talents[item];
		if (talent.tier > currentTier) {
			currentTier = talent.tier;
			rowUnlocked = (tiers[currentTier - 1] > 0);
			let rowHeader = (talentsPurchased[currentTier] == 6 ? "Row Finished" : `${6-talentsPurchased[currentTier]} left, ` + ((tiers[currentTier-1] <= 0) ? "Row Locked" : "Row Unlocked"))
			html += `</tr><tr class='talentTierRow talentRow${(rowUnlocked ? 'Unlocked' : 'Locked')}'><th class='visually-hidden' scope='row'>${rowHeader}</th>`;
		}
		var talentClass = ((ctrlPressed && talent.tier <= highestBuyoutRow) ? ((talent.tier <= highestIdealRow) ? "talentIdealRow " : "talentCanBuyRow ") : "") + "talentItem noselect talent" + ((talent.purchased) ? "Purchased" : "NotPurchased");
		if (typeof talent.requires !== 'undefined'){
			var requires = ( Array.isArray(talent.requires) ? talent.requires : [talent.requires] )
			for (var x = 0; x < requires.length; x++) {
				if (!game.talents[requires[x]].purchased){ 
					talentClass += " talentReqNeeded";
					break;
				}
			}
		}
		var statusText = ""
		var tooltip = ""
		var attributes = ""
		var talentString = talent.name
		var icon = (talent.icon.charAt(0) == "*") ? "icomoon icon-" + talent.icon.substr(1) : "glyphicon glyphicon-" + talent.icon;
		if (usingScreenReader) {
			attributes = ((talentClass.search('ReqNeeded') >= 0) ? "aria-disabled='true'" : (!rowUnlocked) ? "aria-disabled='true'" : "")
			statusText = ((talentClass.search('ReqNeeded') >= 0) ? "Requirement Not Met" : (talentClass.search('NotPurchased') >= 0) ? "Not Purchased" : "Purchased")+", "
			talentClass += " screenReadTalent";
			talentString = `${talent.name} ${statusText}`
		}
		else {
			tooltip = `onmouseover='tooltip("${item}", "talents", event)' onmouseout='tooltip("hide")'`
		}
		
		html += `<td class="talentContainer">`;
		if (currentTier > purchasePower){
			html += `<button aria-label='Locked' aria-disabled=true class='talentItem noselect talentNotPurchased talentLocked'><span class='talentIcon'><span class='icomoon icon-locked'></span></span></button>`;
		}
		else {
			html += `<button id='mastery${item}' class='${talentClass}' ${attributes} ${tooltip} onclick='purchaseTalent("${item}")'><span class='talentIcon'><span class='${icon}'></span></span><br/><div class='talentName'>${talentString}</div></button>`;	
			makeTooltips.push(item);
		}
		html += `</td>`
	}
	html += `</tr></table>`;
	document.getElementById('talentsHere').innerHTML = html;
	if (usingScreenReader) {
		for (let item of makeTooltips) {
			makeAccessibleTooltip(`mastery${item}`, [item, "talents"])
		}
	}
	var respecBtn = document.getElementById('talentRespecBtn');
	var respecAvailable = (game.global.b >= 20 || game.global.freeTalentRespecs) ? 'colorDanger' : 'colorBuyOff';
	swapClass('color', respecAvailable, respecBtn)
	if (game.global.freeTalentRespecs > 0) respecBtn.innerHTML = "Respec (" + game.global.freeTalentRespecs + " Free!)";
	else respecBtn.innerHTML = "Respec (20 Bones)";
	updateTalentNumbers();
}

function updateTalentNumbers() {
	const mainEssenceElem = document.getElementById('essenceOwned');
	const nextCostElem = document.getElementById('talentsNextCost');
	const talentsCostElem = document.getElementById('talentsCost');
	const alertElem = document.getElementById('talentsAlert');
	const countElem = document.getElementById('talentsEssenceTotal');
	const affordableElem = document.getElementById('talentsAffordable');

	if (!mainEssenceElem || !nextCostElem) return;

	const nextCost = getNextTalentCost();
	const affordable = checkAffordableTalents() - countPurchasedTalents();

	if (mainEssenceElem.innerHTML != prettify(game.global.essence)) {
		mainEssenceElem.innerHTML = prettify(game.global.essence);
	}

	if (affordable > 0 && affordableElem.innerHTML !== affordable + ' Affordable') {
		affordableElem.innerHTML = affordable + ' Affordable';
	} else if (affordable <= 0 && affordableElem.innerHTML !== '') {
		affordableElem.innerHTML = '';
	}

	if (nextCost === -1) {
		if (talentsCostElem.style.display !== 'none') {
			talentsCostElem.style.display = 'none';
		}
		if (alertElem.innerHTML !== '') {
			alertElem.innerHTML = '';
		}
		if (countElem.innerHTML !== '') {
			countElem.innerHTML = '';
		}
		return;
	}

	if (talentsCostElem.style.display !== 'block') {
		talentsCostElem.style.display = 'block';
	}
	if (nextCostElem.innerHTML !== prettify(nextCost)) {
		nextCostElem.innerHTML = prettify(nextCost);
	}

	if (!alertElem || !countElem) return;

	if ((game.options.menu.masteryTab.enabled === 1 || game.options.menu.masteryTab.enabled === 3) && nextCost <= game.global.essence) {
		if (alertElem.innerHTML !== '!') {
			alertElem.innerHTML = '!';
		}
		if (countElem.innerHTML !== '') {
			countElem.innerHTML = '';
		}
		return;
	}

	const essence = game.options.menu.masteryTab.enabled >= 2 ? ' (' + (game.global.tabForMastery ? prettify(game.global.essence) : prettify(game.global.mutatedSeeds)) + ')' : '';
	if (alertElem.innerHTML !== '') {
		alertElem.innerHTML = '';
	}
	if (countElem.innerHTML !== essence) {
		countElem.innerHTML = essence;
	}
}

function respecTalents(confirmed, force){
	if (!force && game.global.freeTalentRespecs > 0) {
		if (!confirmed){
			tooltip('Confirm Respec Masteries', null, 'update', true);
			return;
		}
		game.global.freeTalentRespecs--;
	}
	else if (!force){
		if (game.global.b < 20) return;
		if (!confirmed){
			tooltip('Confirm Respec Masteries', null, 'update');
			return;
		}
			game.global.b -= 20;
			updateSkeleBtn();
	}
	for (var item in game.talents){
		var wasPurchased = game.talents[item].purchased;
		if (game.talents[item].purchased && typeof game.talents[item].onRespec === 'function') game.talents[item].onRespec();
		game.talents[item].purchased = false;
		if (wasPurchased && typeof game.talents[item].afterRespec === 'function') game.talents[item].afterRespec();
	}
	game.global.essence += game.global.spentEssence;
	game.global.spentEssence = 0;
	displayTalents();
}

function purchaseTalent(what){
	//from user click
	var talent = game.talents[what];
	if (ctrlPressed && canPurchaseRow(talent.tier)){
		purchaseTalentRow(talent.tier);
		return;
	}
	completeTalentPurchase(talent);
}

function completeTalentPurchase(talent){
	//from purchaseTalent or other functions
	if (talent.purchased) return;
	if (getAllowedTalentTiers()[talent.tier - 1] <= 0) return;
	if (typeof talent.requires !== 'undefined'){
		var requires;
		if (Array.isArray(talent.requires)) requires = talent.requires;
		else requires = [talent.requires];
		for (var x = 0; x < requires.length; x++){
			if (!game.talents[requires[x]].purchased){ 
				return;
			}
		}
	}
	var cost = getNextTalentCost();
	if (game.global.essence < cost && prettify(game.global.essence) != prettify(cost)) { 
		screenReaderAssert(`Can't afford, have ${prettify( cost/game.global.essence)}% Dark Essence of next cost`); 
		return; 
	}
	if (game.global.essence < cost) game.global.essence = cost;
	game.global.essence -= cost;
	game.global.spentEssence += cost;
	talent.purchased = true;
	if (typeof talent.onPurchase === 'function') talent.onPurchase();
	if (countPurchasedTalents() == Object.keys(game.talents).length) game.global.essence = 0;
	displayTalents();
	screenReaderAssert(`Purchased ${talent.name}, ${checkAffordableTalents() - countPurchasedTalents()} Affordable`)

}

function purchaseTalentRow(tier){
	for (var item in game.talents){
		var talent = game.talents[item];
		if (talent.tier > tier) return;
		completeTalentPurchase(talent);
	}
}

function canPurchaseRow(tierNumber){
	var totalRequiredPurchases = 0;
	for (var x = tierNumber; x > 0; x--){
		var purchasedThisTier = countPurchasedTalents(x);
		totalRequiredPurchases += (6 - purchasedThisTier);
	}
	if (checkAffordableTalents() - countPurchasedTalents() >= totalRequiredPurchases) 
		return true;
	return false;
}

function getHighestPurchaseableRow(){
	var canBuy = checkAffordableTalents() - countPurchasedTalents();
	var maxTier = getHighestTalentTier();
	var needToSpend = 0;
	for (var x = 1; x <= maxTier; x++){
		needToSpend += (6 - countPurchasedTalents(x));
		if (needToSpend > canBuy) return x - 1;
	}
	return maxTier;
}

function getHighestTalentTier(){
	return game.talents[Object.keys(game.talents)[Object.keys(game.talents).length - 1]].tier;
}

function getAllowedTalentTiers(){
	var totalTiers = getHighestTalentTier();
	var colsPerTier = 6;

	var ownedLastTier = countPurchasedTalents(1);
	var allowed = [colsPerTier - ownedLastTier];
	for (var x = 2; x <= totalTiers; x++){
		var ownedThisTier = countPurchasedTalents(x);
		if (ownedLastTier <= 1){
			//-1 means the tier is locked
			allowed.push(-1);
		}
		else if (ownedLastTier == colsPerTier) {
			//previous tier is maxxed out, so anything in this tier can be purchased
			allowed.push(colsPerTier - ownedThisTier);
		}
		else{
			//previous tier is not maxxed out. 0 is possible and means the tier is displayed (not locked), but not greyed out and not purchaseable
			allowed.push(ownedLastTier - ownedThisTier - 1);
		}
		ownedLastTier = ownedThisTier;
	}
	return allowed;
}

function initTalents(){
	for (var item in game.talents){
		if (!game.talents[item].purchased) continue;
		if (typeof game.talents[item].onPurchase === 'function') game.talents[item].onPurchase();
	}
}

function countPurchasedTalents(tier){
	var count = 0;
	for (var item in game.talents){
		if ((!tier || game.talents[item].tier == tier) && game.talents[item].purchased) count++;
	}
	return count;
}

function checkAffordableTalents(){
	var totalEssence = game.global.spentEssence + game.global.essence;
	var talentCount = Object.keys(game.talents).length;
	var totalPrice = 0;
	for (var x = 0; x < talentCount; x++){
		totalPrice += getNextTalentCost(x);
		if (totalPrice > totalEssence) return x;
	}
	return talentCount;
}

function getNextTalentCost(forceAmt){
	var count = (isNaN(forceAmt)) ? countPurchasedTalents() : forceAmt;
	if (count == Object.keys(game.talents).length) return -1;
	if (count >= 25){
		//2824295364810 == Math.floor(10 * Math.pow(3, 24)) == cost of talent 25
		return Math.floor(2824295364810 * Math.pow(6, count - 24));
	}
	return Math.floor(10 * Math.pow(3, count));
}

function getTotalTalentCost(){
	var count = Object.keys(game.talents).length;
	//1412147682400 == 10 * (Math.pow(3, 24) - 1) / 2 == cost of 1-25
	return 1412147682400 + (2824295364810 * (Math.pow(6, count - 24) - 1) / 5);
}

function checkAverageExotics(which){
	var exoticChance = getExoticChance();
	var cells = (game.global.world - 1) * 100
	var expectedExotics = cells * (exoticChance / 100);
	expectedExotics += (cells * 0.02) / (5 / game.badGuys.Magimp.lootCount()); //randimp
	expectedExotics += Math.floor(game.global.world / 10) * 2;
	expectedExotics = Math.floor(expectedExotics);
	var needExotic = expectedExotics - game.unlocks.impCount[which];
	if (needExotic <= 0) return 0;
	if (which == "Tauntimp"){
		var addTrimps = 0;
		for (var x = 0; x < needExotic; x++){
			addTrimps += game.badGuys.Tauntimp.loot(null, false, true);
		}
		var text = "Your Trimps noticed they were a little light on Tauntimps for housing, so they bred " + needExotic + " more! " + ((needExotic == 1) ? "This" : "These") + " new Tauntimp" + needAnS(needExotic) + ((needExotic == 1) ? " is" : " are") + " granting room for " + prettify(addTrimps) + " more Trimps."; 
		message(text, "Loot", "gift", "exotic", "exotic");
	}
	else{
		for (var x = 0; x < needExotic; x++){
			game.badGuys[which].loot(null, false, true);
		}
		return needExotic;
	}

}


function checkIfSpireWorld(getNumber){
	if (game.global.universe == 2) {
		if (game.global.world == 300) {
			if (getNumber) return 1;
			return true;
		}
		return false;	
	}
	if (game.global.world >= 200 && (game.global.world % 100) == 0){
		var spireNumber = (Math.round(game.global.world / 100) - 1);
		if (spireNumber > (game.global.lastSpireCleared + 1)){
			return false
		}
		if (getNumber){
			return spireNumber;
		}
		return true;
	}
	return false;
}

function rewardLiquidZone() {
	game.stats.battlesWon.value += 99;

	const messages = game.global.messages.Loot;
	const initialResources = {
		food: game.resources.food.owned,
		wood: game.resources.wood.owned,
		metal: game.resources.metal.owned,
		helium: game.resources.helium.owned,
		fragments: game.resources.fragments.owned,
		trimpsCount: game.resources.trimps.realMax()
	};
	const trackedImps = {
		Feyimp: 0,
		Magnimp: 0,
		Tauntimp: 0,
		Venimp: 0,
		Whipimp: 0,
		Skeletimp: 0,
		Megaskeletimp: 0
	};

	let voidMaps = 0;
	let unlocks = ['', ''];
	let text = '';
	let tokText;

	messageLock = true;
	const scryBonus = isScryerBonusActive();
	const hiddenUpgrades = new Set(['fiveTrimpMax', 'Map', 'fruit', 'groundLumber', 'freeMetals', 'Foreman', 'FirstMap']);

	for (let x = 1; x < 100; x++) {
		game.global.voidSeed++;
		game.global.scrySeed++;
		if (scryBonus) tryScry();
		if (checkVoidMap() === 1) voidMaps++;
		const cell = game.global.gridArray[x];

		if (cell.special !== '') {
			let unlock = game.worldUnlocks[cell.special];
			if (typeof unlock !== 'undefined' && typeof unlock.fire !== 'undefined') {
				unlock.fire(x);
				if (!hiddenUpgrades.has(cell.special)) {
					let index = unlock.world < 0 ? 1 : 0;
					if (unlocks[index] !== '') unlocks[index] += ', ';
					if (typeof unlock.displayAs !== 'undefined') unlocks[index] += unlock.displayAs;
					else unlocks[index] += cell.special;
				}
			} else {
				unlockEquipment(cell.special);
			}
		}

		if (cell.mutation && typeof mutations[cell.mutation].reward !== 'undefined') mutations[cell.mutation].reward(cell.corrupted);
		if (cell.empowerment) {
			const tokReward = rewardToken(cell.empowerment);
			if (messages.token && messages.enabled && tokReward) {
				tokText = `<span class='message empoweredCell${cell.empowerment}'>Found ${prettify(tokReward)} Token${tokReward === 1 ? '' : 's'} of ${cell.empowerment}!</span>`;
			}
		}
		if (typeof game.badGuys[cell.name].loot !== 'undefined') game.badGuys[cell.name].loot(cell.level);
		if (typeof trackedImps[cell.name] !== 'undefined') trackedImps[cell.name]++;
	}

	messageLock = false;

	const addUniques = unlocks[0] !== '' && game.global.messages.Unlocks.unique;
	const addRepeateds = unlocks[1] !== '' && game.global.messages.Unlocks.repeated;

	if ((addUniques || addRepeateds) && game.global.messages.Unlocks.enabled) {
		let unlockText = [];
		if (addUniques) {
			unlockText.push(unlocks[0]);
		}
		if (addRepeateds) {
			unlockText.push(unlocks[1]);
		}
		text += `Unlocks Found: ${unlockText.join(', ')}<br/>`;
	}

	if (messages.enabled && (messages.primary || messages.secondary)) {
		let resourceText = [];
		const heCount = game.resources.helium.owned - initialResources.helium;

		if (messages.helium && heCount > 0) {
			resourceText.push(` Helium - ${prettify(heCount)}`);
		}
		if (messages.secondary) {
			resourceText.push(` Max Trimps - ${prettify(game.resources.trimps.realMax() - initialResources.trimpsCount)}`);
			resourceText.push(` Fragments - ${prettify(game.resources.fragments.owned - initialResources.fragments)}`);
		}
		if (messages.primary) {
			resourceText.push(` Food - ${prettify(game.resources.food.owned - initialResources.food)}`);
			resourceText.push(` Wood - ${prettify(game.resources.wood.owned - initialResources.wood)}`);
			resourceText.push(` Metal - ${prettify(game.resources.metal.owned - initialResources.metal)}`);
		}

		text += `Resources Found:${resourceText.join(',')}<br/>`;
	}

	const trackedList = [];
	let bones;
	for (let item in trackedImps) {
		if (trackedImps[item] > 0) {
			if (item === 'Skeletimp' || item === 'Megaskeletimp') {
				bones = item;
				continue;
			}
			trackedList.push(` ${item} - ${trackedImps[item]}`);
		}
	}

	if (trackedList && messages.exotic && messages.enabled) {
		text += `Rare Imps: ${trackedList}<br/>`;
	}

	if (bones && messages.bone && messages.enabled) {
		text += `Found a ${bones}!<br/>`;
	}

	if (tokText) {
		text += `${tokText}<br/>`;
	}

	if (text) {
		text = `You liquified a Liquimp!<br/>${text}`;
		text = text.slice(0, -5);
		message(text, 'Notices', 'star', 'LiquimpMessage');
	}

	if (challengeActive('Lead')) {
		game.challenges.Lead.stacks -= 100;
		manageLeadStacks();
	}

	game.stats.zonesLiquified.value++;
	nextWorld();
	drawAllUpgrades();
}


function checkIfLiquidZone(getMult){
	if (game.options.menu.liquification.enabled == 0 || game.global.challengeActive == "Obliterated" || game.global.challengeActive == "Eradicated") return false;
	var liqCap = 0;
	if (game.global.universe == 2) {
		if (!u2Mutations.tree.Liq1.purchased) return;
		var amt = 0.1;
		if (u2Mutations.tree.Liq2.purchased) amt = 0.2;
		if (getMult) return amt;
		liqCap = ((getHighestLevelCleared(false, true) + 1) * amt);
		if (game.global.world > liqCap) return false;
		return true;
	}
	var spireCount = game.global.spiresCompleted;
	if (game.talents.liquification.purchased) spireCount++;
	if (game.talents.liquification2.purchased) spireCount++;
	if (game.talents.liquification3.purchased) spireCount += 2;
	spireCount += (Fluffy.isRewardActive("liquid") * 0.5);
	var liquidAmount = ((spireCount) / 20);
	if (getMult) return liquidAmount;
	liqCap = ((getHighestLevelCleared(false, true) + 1) * liquidAmount);
	if (game.global.world > liqCap || checkIfSpireWorld()){
		return false;
	}
	return true;
}

function liquifyZone(){
	if (!checkIfLiquidZone()) return;
	var grid = game.global.gridArray;
	var trackedImps = {
		Feyimp: 0,
		Tauntimp: 0,
		Whipimp: 0,
		Venimp: 0,
		Magnimp: 0,
		Skeletimp: 0,
		Megaskeletimp: 0
	};
	//Move first resource/unlock
	if (grid[0].special !== ""){
		for (var x = 1; x < grid.length; x++){
			if (grid[x].special === ""){
				grid[x].text = grid[0].text;
				grid[x].special = grid[0].special;
				grid[0].text = "";
				grid[0].special = "";
				break;
			}
		}
	}
	//If the first enemy is important, move it
	if (typeof trackedImps[grid[0].name] !== 'undefined'){
		for (var y = 1; y < grid.length; y++){
			if (typeof trackedImps[grid[y].name] === 'undefined'){
				grid[y].name = grid[0].name;
				break;
			}
		}
	}
	grid[0].name = "Liquimp";
}

function nextU2SpireFloor(){
	game.global.spireLevel++;
	if (game.global.spireLevel > 10) {
		checkAchieve("stuffySpireTimed");
		finishU2Spire();
		return;
	}
	u2Mutations.types.Spire1.removeStacks();
	game.global.lastClearedCell = -1;
	game.global.gridArray = [];
	document.getElementById("grid").innerHTML = "";
	buildGrid();
	drawGrid();
	setNonMapBox();
	return;
}

function nextWorld() {
	if (game.global.spireActive && game.global.universe === 2) {
		nextU2SpireFloor();
		return;
	}

	if (game.global.world > getHighestLevelCleared()) {
		if (game.global.universe === 2) {
			game.global.highestRadonLevelCleared = game.global.world;
		} else {
			game.global.highestLevelCleared = game.global.world;
		}

		setVoidMaxLevel(game.global.world);
		if (game.global.universe === 1) {
			if (game.global.world === 199) addNewSetting('mapsOnSpire');
			else if (game.global.world === 180) {
				unlockFormation(4);
				filterTabs('talents');
				addNewSetting('masteryTab');
			} else if (game.global.world === 64) tooltip('UnlockedChallenge2', null, 'update');
			else if (game.global.world === 60) addNewSetting('ctrlGigas');
			else if (game.global.world === 79) addNewSetting('bigPopups');
		} else if (game.global.universe === 2) {
			if (game.global.world === 49) tooltip('UnlockedChallenge3', null, 'update');
			countChallengeSquaredReward();
			if (game.global.world === 74) autoBattle.firstUnlock();
			if (game.global.world === 201) {
				game.global.tabForMastery = false;
				document.getElementById('MasteryTabName').innerHTML = 'Mutators';
			}
		}
	}
	if (game.global.universe === 2 && game.global.novaMutStacks > 0) u2Mutations.types.Nova.removeStacks();
	Fluffy.rewardExp();
	game.global.world++;
	document.getElementById('worldNumber').innerHTML = game.global.world;
	game.global.mapBonus = 0;
	const mapBonusElem = document.getElementById('mapBonus');
	if (mapBonusElem.innerHTML !== '') document.getElementById('mapBonus').innerHTML = '';
	game.global.lastClearedCell = -1;
	game.global.gridArray = [];
	if (checkIfSpireWorld()) startSpire();
	buildGrid();
	liquifyZone();
	drawGrid();
	buyAutoJobs(true);
	let msgText = getWorldText(game.global.world);
	if (msgText) {
		let extraClass = null;
		if (Array.isArray(msgText)) {
			extraClass = msgText[1];
			msgText = msgText[0];
		}
		message('Z:' + game.global.world + ' ' + msgText, 'Story', null, extraClass);
	}
	if (game.global.canMagma) checkAchieve('zones');
	checkGenStateSwitch();
	if (challengeActive('Scientist') && game.global.highestLevelCleared >= 129 && getSLevel() >= 4 && game.global.world === 76) {
		giveSingleAchieve('AntiScience');
	}
	if (getPerkLevel('Tenacity')) {
		if (game.portal.Tenacity.timeLastZone !== -1) game.portal.Tenacity.timeLastZone *= game.portal.Tenacity.getCarryoverMult();
		game.portal.Tenacity.timeLastZone += getZoneMinutes();
	}
	game.global.zoneStarted = getGameTime();
	if (challengeActive('Mapology')) {
		game.challenges.Mapology.credits++;
		updateMapCredits();
	}
	if (game.global.roboTrimpLevel && game.global.brokenPlanet) {
		if (game.global.roboTrimpCooldown > 0) game.global.roboTrimpCooldown--;
		displayRoboTrimp();
	}
	if (challengeActive('Toxicity')) {
		game.challenges.Toxicity.stacks = 0;
		updateToxicityStacks();
	}
	if (challengeActive('Watch')) {
		if (game.global.world > 6) dropPrestiges();
		if (!getAutoJobsSetting().enabled) assignExtraWorkers();
	}
	if (challengeActive('Lead')) {
		if (game.global.world % 2 === 0) game.challenges.Lead.stacks = 200;
		manageLeadStacks();
	}
	if (challengeActive('Decay') || challengeActive('Melt')) {
		let challenge = game.challenges[game.global.challengeActive];
		challenge.stacks = 0;
	}
	if (challengeActive('Daily')) {
		if (typeof game.global.dailyChallenge.toxic !== 'undefined') {
			game.global.dailyChallenge.toxic.stacks = 0;
			updateDailyStacks('toxic');
		}
		if (typeof game.global.dailyChallenge.karma !== 'undefined') {
			game.global.dailyChallenge.karma.stacks = 0;
			updateDailyStacks('karma');
		}
		if (typeof game.global.dailyChallenge.pressure !== 'undefined') {
			dailyModifiers.pressure.resetTimer();
		}
	}
	if (game.talents.blacksmith.purchased && (!challengeActive('Mapology') || !game.global.runningChallengeSquared)) {
		let smithWorld = 0.5;
		if (game.talents.blacksmith3.purchased) smithWorld = 0.9;
		else if (game.talents.blacksmith2.purchased) smithWorld = 0.75;
		smithWorld = Math.floor((getHighestLevelCleared(false, true) + 1) * smithWorld);
		if (game.global.world <= smithWorld) {
			dropPrestiges();
		}
	}
	if (game.talents.bionic.purchased && game.global.universe === 1) {
		let bTier = (game.global.world - 126) / 15;
		if (game.global.world >= 126) game.mapUnlocks.BionicWonderland.canRunOnce = false;
		if (bTier % 1 === 0 && bTier === game.global.bionicOwned && game.global.roboTrimpLevel >= bTier) {
			game.mapUnlocks.roboTrimp.createMap(bTier);
			refreshMaps();
		}
	}
	if (game.talents.housing.purchased) {
		autoUnlockHousing();
	}
	if (game.global.universe === 2 && getPerkLevel('Prismal') >= 20 && game.global.world === 21 && game.upgrades.Prismalicious.locked === 1) {
		unlockUpgrade('Prismalicious');
		game.mapUnlocks.Prismalicious.canRunOnce = false;
	}
	if (game.talents.explorers.purchased) {
		if (Math.floor((game.global.world - game.mapUnlocks.Speedexplorer.next) / 10)) {
			game.mapUnlocks.Speedexplorer.fire(0, true);
			if (game.global.currentMapId) {
				for (let x = 0; x < game.global.mapGridArray.length; x++) {
					if (game.global.mapGridArray[x].special === 'Speedexplorer') game.global.mapGridArray[x].special = '';
				}
			}
		}
	}
	if (game.talents.portal.purchased && game.global.world === 21 && game.mapUnlocks.Portal.canRunOnce) {
		game.mapUnlocks.Portal.fire(0, true);
		game.mapUnlocks.Portal.canRunOnce = false;
		refreshMaps();
	}
	if (game.talents.bounty.purchased && game.global.world === 16 && game.mapUnlocks.Bounty.canRunOnce) {
		game.mapUnlocks.Bounty.fire();
		game.mapUnlocks.Bounty.canRunOnce = false;
		refreshMaps();
	}
	if (game.global.universe === 1 && game.global.world === mutations.Corruption.start(true)) {
		tooltip('Corruption', null, 'update');
	}
	if (mutations.Magma.active()) {
		if (game.global.world === mutations.Magma.start()) {
			startTheMagma();
		}
		mutations.Magma.increaseTrimpDecay();
		increaseTheHeat();
		decayNurseries();
	}
	if (challengeActive('Eradicated') && game.global.world <= 101) unlockUpgrade('Coordination');
	if (game.global.world === 30 && game.global.canRespecPerks && !game.global.bonePortalThisRun && countHeliumSpent() <= 60) giveSingleAchieve('Underachiever');
	else if (game.global.world === 10 && game.stats.trimpsKilled.value <= 5) giveSingleAchieve('Peacekeeper');
	else if (game.global.world === 60) {
		if (game.stats.trimpsKilled.value <= 1000) giveSingleAchieve('Workplace Safety');
		if (game.stats.cellsOverkilled.value + game.stats.zonesLiquified.value * 50 === 2950) giveSingleAchieve('Gotta Go Fast');
		if (getHighestPrestige() <= 3) giveSingleAchieve('Shaggy');
		//Without Hiring Anything
		let jobCount = 0;
		for (let job in game.jobs) jobCount += game.jobs[job].owned; //Dragimp adds 1
		if (jobCount - game.jobs.Dragimp.owned - game.jobs.Amalgamator.owned === 0 && game.stats.trimpsFired.value === 0) giveSingleAchieve('Unemployment');
		if (game.global.universe === 2) buffVoidMaps();
	} else if (game.global.world === 65) checkChallengeSquaredAllowed();
	else if (game.global.world === 75 && checkHousing(true) === 0) giveSingleAchieve('Tent City');
	else if (game.global.world === 120 && !game.global.researched) giveSingleAchieve('No Time for That');
	else if (game.global.world === 200 && game.global.universe === 1) buffVoidMaps200();
	if (game.global.world === 201 && game.global.universe === 2) {
		tooltip('The Mutated Zones', null, 'update');
	}
	if (challengeActive('Life')) {
		if (game.global.world >= 100 && game.challenges.Life.lowestStacks === 150) giveSingleAchieve('Very Sneaky');
		game.challenges.Life.lowestStacks = game.challenges.Life.stacks;
	}
	displayGoldenUpgrades();
	if (game.achievements.humaneRun.earnable) {
		if (game.stats.battlesLost.value > game.achievements.humaneRun.lastZone + 1) {
			game.achievements.humaneRun.lastZone = game.global.world - 1;
			game.achievements.humaneRun.earnable = false;
		} else {
			checkAchieve('humaneRun');
			game.achievements.humaneRun.lastZone = game.stats.battlesLost.value;
		}
	}
	setEmpowerTab();
	if (game.global.buyTab === 'nature') updateNatureInfoSpans();
	if (game.global.world === 236 && getUberEmpowerment() === 'Wind') unlockFormation(5);
	if (game.global.world >= 241 && game.global.world % 5 === 1) {
		resetEmpowerStacks();
	}
	game.stats.zonesCleared.value++;
	checkAchieve('totalZones');
	if (game.global.universe === 2) {
		checkAchieve('mapless');
		checkAchieve('shielded');
		checkAchieve('zones2');
	}

	if (game.global.challengeActive) {
		let challenge = game.challenges[game.global.challengeActive];
		if (!game.global.runningChallengeSquared && challenge.completeAfterZone && challenge.completeAfterZone === game.global.world - 1 && typeof challenge.onComplete !== 'undefined') challenge.onComplete();
		else if (typeof challenge.onNextWorld !== 'undefined') challenge.onNextWorld();
	}
	if (challengeActive('Exterminate') && game.challenges.Exterminate.swarmStacks >= 100 && game.global.world <= 120) game.challenges.Exterminate.achieveDone = true;
	if (challengeActive('Hypothermia') && game.global.world > game.challenges.Hypothermia.failAfterZone) game.challenges.Hypothermia.onFail();
	game.jobs.Meteorologist.onNextWorld();
	game.jobs.Worshipper.onNextWorld();
	if (!game.portal.Observation.radLocked && game.global.universe === 2) game.portal.Observation.onNextWorld();
	if (game.global.capTrimp) message("I'm terribly sorry, but your Trimp<sup>2</sup> run appears to have more than one Trimp fighting, which kinda defeats the purpose. Your score for this Challenge<sup>2</sup> will be capped at 230.", 'Notices');
	if (game.global.world >= getObsidianStart()) {
		let next = game.global.highestRadonLevelCleared >= 99 ? '50' : '10';
		let text;
		if (!Fluffy.checkU2Allowed()) text = " Fluffy has an idea for remelting the world, but it will take a tremendous amount of energy from a place Fluffy isn't yet powerful enough to send you. Fluffy asks you to help him reach the <b>10th Level of his 8th Evolution</b>, and he promises he'll make it worth your time.";
		else if (game.global.world === 810) text = '';
		else text = ' However, all is not lost! Every ' + next + ' Zones of progress you make in the Radon Universe will allow you to harness enough energy for Fluffy to slow down the hardening of your World for an extra 10 Zones in this Universe.';
		message('The Magma has solidified into impenetrable Obsidian; your Trimps have no hope of progressing here right now.' + text, 'Notices', null, 'obsidianMessage');
	}
	game.global.zoneRes.unshift(0);
	if (game.global.zoneRes.length > 5) game.global.zoneRes.pop();
	if (game.global.world === 60 && game.global.universe === 2 && game.global.exterminateDone && game.buildings.Hub.locked) {
		unlockBuilding('Hub');
	}
	if (game.global.world === 175 && game.global.universe === 2) {
		message('You see a strange light radiating out of a strange ice cube in a strange spot in the Zone. You have a nearby Trimp crack it open, and find a map to a Frozen Castle!', 'Story');
		createMap(175, 'Frozen Castle', 'Frozen', 10, 100, 5, true, true);
	}
	if (game.global.world >= 176 && game.global.world <= 200 && game.global.universe === 2) {
		for (let z = 0; z < game.global.mapsOwnedArray.length; z++) {
			if (game.global.mapsOwnedArray[z].location === 'Frozen') {
				game.global.mapsOwnedArray[z].level = game.global.world;
				if (game.global.currentMapId === game.global.mapsOwnedArray[z].id) {
					game.global.currentMapId = '';
					game.global.lastClearedMapCell = -1;
					game.global.mapGridArray = [];
				}
				break;
			}
		}
	}

	u2Mutations.tree.Tauntimps.check();
	u2Mutations.tree.AvgExotic.check();
}

function checkMapAtZoneWorld(runMap){
	var nextCell = game.global.lastClearedCell;
	if (nextCell == -1) nextCell = 1;
	else nextCell += 2;
	var currentSetting = game.options.menu.mapAtZone.getSetZone();
	var totalPortals = getTotalPortals();
	var doneStr = totalPortals + "_" + game.global.world + "_" + nextCell;
	if (game.global.universe == 2 && game.global.spireActive) doneStr += "_" + game.global.spireLevel;
	if (game.options.menu.mapAtZone.enabled && game.global.canMapAtZone && !game.global.preMapsActive){
		for (var x = 0; x < currentSetting.length; x++){
			if (x >= game.options.menu.mapAtZone.getMaxSettings()) break;
			if (currentSetting[x].done == doneStr) continue;
			if (currentSetting[x].through < game.global.world) continue;
			var nextRepeat = false;
			if (currentSetting[x].times > -1){
				if (game.global.world > currentSetting[x].world && (game.global.world - currentSetting[x].world) % currentSetting[x].times == 0) nextRepeat = true;
			}
			else if (currentSetting[x].times == -2 && game.global.world > currentSetting[x].world){
				if ((game.global.world - currentSetting[x].world) % currentSetting[x].tx == 0) nextRepeat = true;
			}
			if (currentSetting[x].on !== false && (nextRepeat || game.global.world == currentSetting[x].world) && ((!currentSetting[x].cell && nextCell == 1) || nextCell == currentSetting[x].cell)){
				if (runMap){
					currentSetting[x].done = doneStr;
					runMapAtZone(x);
					return true;
				}
				return currentSetting[x];
			}
		}
	}
	return false;
}

function runMapAtZone(index){
	var setting = game.options.menu.mapAtZone.getSetZone()[index];
	if (setting.preset == 5 && !game.global.challengeActive == "Quagmire" && setting.check){
		checkMapAtZoneWorld(true);
		return;
	}
	if (setting.preset == 4 && !getNextVoidId() && setting.check){
		checkMapAtZoneWorld(true);
		return;
	}
	if (setting.cell == 100 && (game.global.challengeActive == "Mayhem" || game.global.challengeActive == "Pandemonium")) startFight();
	mapsClicked(true);
	if (game.global.spireActive && game.global.lastClearedCell != -1) deadInSpire();
	toggleSetting('mapAtZone', null, false, true);
	if (!setting || !setting.check) {
		checkMapAtZoneWorld(true);
		return;
	}
	if (game.global.challengeActive == "Quest" && game.challenges.Quest.questId == 5 && !game.challenges.Quest.questComplete){
		if (game.global.lastClearedCell == 98) game.challenges.Quest.checkQuest();
		else{
			game.challenges.Quest.questProgress++;
			if (game.challenges.Quest.questProgress == 1) game.challenges.Quest.failQuest();
		}
	}
	//Don't change repeat if the setting is to run void maps, instead change void repeat
	if (setting.repeat && setting.preset != 4) {
		game.global.repeatMap = (setting.repeat == 1);
		if (usingRealTimeOffline) offlineProgress.repeatSetting = game.global.repeatMap;
		repeatClicked(true);
	}
	if (setting.exit){
		game.options.menu.exitTo.enabled = (setting.exit - 1);
		if (usingRealTimeOffline) offlineProgress.exitTo = game.options.menu.exitTo.enabled;
		toggleSetting('exitTo', null, false, true);
	}
	if (setting.until && setting.until != 5){
		if (setting.until >= 6){
			game.options.menu.repeatUntil.enabled = 0;
		}
		else game.options.menu.repeatUntil.enabled = (setting.until - 1);
		if (usingRealTimeOffline) offlineProgress.repeatUntil = game.options.menu.repeatUntil.enabled;
		toggleSetting('repeatUntil', null, false, true);
	}
	if (setting.preset == 3){
		var nextBw = getNextBwId();
		if (nextBw) {
			game.options.menu.climbBw.enabled = (setting.until == 5) ? 1 : 0;
			toggleSetting('climbBw', null, false, true);
			if (setting.until == 5){ //climbing
				game.global.mazBw = setting.bwWorld;
				//if repeating on zones
				if ((setting.times > 0 || setting.times == -2) && game.global.world > setting.world){			
					//see how many times this has repeated by zone, increase target climb level by appropriate amount for zones skipped
					var times = (setting.times == -2) ? setting.tx : setting.times;
					var repeats = Math.round((game.global.world - setting.world) / times);
					if (repeats > 0) game.global.mazBw += (times * repeats);
				}					
				game.options.menu.repeatUntil.enabled = 2;
				if (usingRealTimeOffline) offlineProgress.repeatUntil = game.options.menu.repeatUntil.enabled;
				toggleSetting('repeatUntil', null, false, true);
			}
			else if (setting.until == 6) game.global.mapCounterGoal = 25;
			else if (setting.until == 7) game.global.mapCounterGoal = 50;
			else if (setting.until == 8) game.global.mapCounterGoal = 100;
			else if (setting.until == 9) game.global.mapCounterGoal = setting.rx;
			toggleSetting('repeatUntil', null, false, true);
			if (game.global.currentMapId) recycleMap();
			selectMap(nextBw);
			runMap();
		}
		return;
	}
	else if (setting.preset == 4){
		var nextVoid = getNextVoidId();
		if (nextVoid){
			if (setting.repeat){
				game.options.menu.repeatVoids.enabled = ((setting.repeat == 1) ? 1 : 0);
			}
			if (game.global.currentMapId) recycleMap();
			selectMap(nextVoid);
			runMap();
		}
		return;
	}
	else if (setting.preset == 5){
		if (game.global.challengeActive == "Quagmire"){
			var bogMap = game.challenges.Quagmire.getBogMap();
			if (bogMap){
				if (game.global.currentMapId) recycleMap();
				selectMap(bogMap.id);
				runMap();
			}
			if (setting.until == 6) game.global.mapCounterGoal = 25;
			if (setting.until == 7) game.global.mapCounterGoal = 50;
			if (setting.until == 8) game.global.mapCounterGoal = 100;
			if (setting.until == 9) game.global.mapCounterGoal = setting.rx;
		}
		return;
	}
	else if (setting.preset >= 8){
		var locs = ["Melting", "Frozen", "Atlantis"];
		var location = locs[setting.preset - 8];
		var meltMap = -1;
		for (var x = 0; x < game.global.mapsOwnedArray.length; x++){
			if (game.global.mapsOwnedArray[x].location == location){
				meltMap = game.global.mapsOwnedArray[x];
				break;
			}
		}
		if (meltMap != -1){
			if (game.global.currentMapId) recycleMap();
			selectMap(meltMap.id);
			runMap();
		}
		else{
			mapsClicked(true);
			return;
		}
		if (setting.until == 6) game.global.mapCounterGoal = 25;
		if (setting.until == 7) game.global.mapCounterGoal = 50;
		if (setting.until == 8) game.global.mapCounterGoal = 100;
		if (setting.until == 9) game.global.mapCounterGoal = setting.rx;
		return;
	}
	if (game.global.mapsOwnedArray.length >= 50){
		recycleBelow(true, game.global.world - 3);
	}
	var preset = setting.preset;
	if (preset > 5) preset -= 3;
	selectAdvMapsPreset(preset + 1);
	var mapStatus = buyMap();
	if (mapStatus == 1){
		if (game.global.currentMapId) recycleMap();
		selectMap(game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id);
		runMap();
	}
	if (setting.until == 6) game.global.mapCounterGoal = 25;
	if (setting.until == 7) game.global.mapCounterGoal = 50;
	if (setting.until == 8) game.global.mapCounterGoal = 100;
	if (setting.until == 9) game.global.mapCounterGoal = setting.rx;
	toggleSetting('repeatUntil', null, false, true);
}

function purgeBionics(){
	var bionicMaps = game.global.mapsOwnedArray.filter(function(map){return map.location == "Bionic";});
	if (bionicMaps.length > 3){
		var trim = bionicMaps.length - 3;
		for (var x = 0; x < trim; x++){
			var index = game.global.mapsOwnedArray.indexOf(bionicMaps[x]);
			if (game.global.mapsOwnedArray[index].id == game.global.currentMapId){
				if (game.global.mapsActive) continue;
				game.global.currentMapId = "";
				game.global.mapGridArray = [];
				game.global.lookingAtMap = "";
				game.global.lastClearedMapCell = -1;
			}
			message("Recycled " + bionicMaps[x].name + ".", "Notices");
			game.global.mapsOwnedArray.splice(index, 1);
		}
	}
}

function getHighestBionic(){
	if (game.global.roboTrimpLevel == 0) return 0;
	return 125 + ((game.global.roboTrimpLevel - 1) * 15);
}

function bwRewardUnlocked(name){
	if (getHighestBionic() >= game.bwRewards[name].requires) return true;
	return false;
}

function getNextLockedBwReward(){
	var bwLevel = getHighestBionic();
	for (var item in game.bwRewards){
		if (bwLevel < game.bwRewards[item].requires) return item;
	}
	return -1;
}

function checkNewBionicUpgrades(level){
	if (level > getHighestBionic()){
		for (var item in game.bwRewards){
			if (level == game.bwRewards[item].requires){
				if (typeof game.bwRewards[item].fire !== 'undefined') game.bwRewards[item].fire();
				//skip tooltip at 125 as it is included in the first robotrimp popup
				if (level != 125) tooltip(item, 'customText', 'lock', game.bwRewards[item].description);
			}
		}
	}
}

function autoUnlockHousing(){
	var house = "";
		switch (game.global.world) {
			case 9:
				house = "Mansion";
				break;
			case 15:
				house = "Hotel";
				break;
			case 19:
				house = "UberHut";
				break;
			case 24:
				house = "Nursery";
				break;
			case 26:
				house = "Resort";
				break;
			case 30:
				house = "UberHouse";
				break;
			case 31:
				house = "Gateway";
				break;
			case 35:
				house = "UberMansion";
				break;
			case 37:
				house = "Wormhole";
				break;
			case 41:
				house = "UberHotel";
				break;
			case 48:
				house = "UberResort";
				break;
			case 51:
				house = "Collector";
				break;
			default: return;
		}
		if (!house) return;
		house = game.mapUnlocks[house];
		if (!house.canRunOnce) return;
		if (game.global.universe == 2 && house.blockU2) return;
		house.fire();
		house.canRunOnce = false;
		message(house.message, "Unlocks", null, null, 'unique', convertUnlockIconToSpan(house));
}

function startSpire(confirmed){
	var spireNum = checkIfSpireWorld(true);
	if (!confirmed){
		game.global.spireDeaths = 0;
		game.global.spireActive = true;
		if (game.global.universe == 2){
			game.global.spireLevel = Math.floor(game.global.u2SpireCellsBest / 100) + 1;
			if (game.global.spireLevel > 10) game.global.spireLevel = 10;
			if (game.portal.Equality.settings.spire.scalingActive) game.portal.Equality.scalingCount = game.portal.Equality.settings.spire.disabledStackCount;
			if (game.portal.Equality.scalingCount == -1) game.portal.Equality.scalingCount = game.portal.Equality.radLevel;
			manageEqualityStacks();
		}
		setNonMapBox();
		var spireSetting = game.options.menu.mapsOnSpire.enabled;
		if (spireSetting && !checkMapAtZoneWorld()){
			var highestSpire;
			if (game.global.universe == 1) highestSpire = Math.floor((getHighestLevelCleared() - 99) / 100);
			else highestSpire = Math.floor((getHighestLevelCleared() - 225) / 75)
			if (spireSetting == 1 || (spireSetting == 2 && spireNum >= highestSpire - 1) || (spireSetting == 3 && spireNum >= highestSpire)){
				game.global.fighting = false;
				mapsSwitch();
				if (challengeActive('Berserk')) game.challenges.Berserk.trimpDied();
			}
			else handleExitSpireBtn();
		}
		else handleExitSpireBtn();
		if (spireNum == 1){
			cancelTooltip();
			var uSpire = (game.global.universe == 2) ? "Stuffy's Spire" : "The Spire";
			tooltip(uSpire, null, 'update');
		}
		return;
	}
	cancelTooltip();
}

function handleExitSpireBtn(){
	var display = (game.global.spireActive && !game.global.mapsActive && !game.global.preMapsActive) ? "block" : "none";
	document.getElementById('exitSpireBtnContainer').style.display = display;
}

function getSpireStats(cellNum, name, what, origAmt){
	if (game.global.universe == 2){
		//if (what == "attack") return origAmt * Math.pow(100, game.global.spireLevel + 1);
		return origAmt * Math.pow(200, game.global.spireLevel + 1);
	}
	var base = (what == "attack") ? game.global.getEnemyAttack(100, null, true) : (game.global.getEnemyHealth(100, null, true) * 2);
	var mod = (what == "attack") ? 1.17 : 1.14;
	var spireNum = checkIfSpireWorld(true);
	if (spireNum > 1){
		var modRaiser = 0;
		modRaiser += ((spireNum - 1) / 100);
		if (what == "attack") modRaiser *= 8;
		if (what == "health") modRaiser *= 2;
		mod += modRaiser;
	}
	base *= Math.pow(mod, cellNum);
	base *= game.badGuys[name][what];
	return base;
}

function finishU2Spire(){
	game.global.spireActive = false;
	game.global.lastClearedCell = -1;
	buildGrid();
	drawGrid();
	setNonMapBox();
	handleExitSpireBtn();
	u2Mutations.types.Spire1.removeStacks();
	manageEqualityStacks();
}

function deadInSpire(){
	game.global.spireDeaths++;
	if (game.global.spireDeaths >= 10) {
		var msgText = "";
		if (game.global.universe == 2) msgText = "You're suddenly standing outside of the Spire with a feeling that it's best to move on for now. Scruffy seems confident that you'll get it next time! (You made it to Cell " + (game.global.lastClearedCell + 2) + " on Floor " + game.global.spireLevel + ")";
		else msgText = "You're not yet ready. Maybe you'll be of use in the next lifetime (You made it to cell " + (game.global.lastClearedCell + 2) + ")."
		message(msgText, "Story");
		endSpire();
		return;
	}
	var s = (game.global.spireDeaths > 1) ? "s" : "";
	var has = (game.global.spireDeaths > 1) ? "have" : "has";
	message(game.global.spireDeaths + " group" + s + " of Trimps " + has + " perished in the Spire.", "Notices");
}

function endSpire(cancelEarly){
	if (game.global.universe == 2){
		finishU2Spire();
		return;
	}
	game.global.spireActive = false;
	var cell = getCurrentWorldCell();
	if (!cell) return;
	cell.health = cell.origHealth;
	cell.attack = cell.origAttack;
	cell.maxHealth = cell.origHealth;
	document.getElementById('grid').className = "";
	if (game.global.lastClearedCell == 98) {
		var elem = document.getElementById("actualBadName");
		if (!elem) elem = document.getElementById("badGuyName");
		if (elem && cell.name == "Omnipotrimp") elem.innerHTML = elem.innerHTML.replace("Echo of Druopitee", "Omnipotrimp");
		else if (elem) elem.innerHTML = elem.innerHTML.replace("Druopitee", "Improbability");
	}
	clearSpireMetals();
	setNonMapBox();
	handleExitSpireBtn();
}

function getCurrentWorldCell(){
	return game.global.gridArray[game.global.lastClearedCell + 1];
}

function getCurrentMapCell(){
	return (game.global.mapGridArray.length > game.global.lastClearedMapCell) ? game.global.mapGridArray[game.global.lastClearedMapCell + 1] : -1;
}

function clearSpireMetals(){
	var spireMetal = document.getElementsByClassName('spireMetals');
	for (var x = 0; x < spireMetal.length; x++){
		spireMetal[x].style.visibility = 'hidden';
	}
}

//Big storyline spoilers in the function below, be careful if you care

function getSpireStory(spireNum, row, getAll){
	var spires = {
		spire2: {
			r2: "Everything in this Spire seems less tidy than the last, he never thought the first was something you could pass. You find a small note amongst some Nullifium.<br/><span class='spirePoem'>Healthy mutation bad...<br/>Slows delirium</span>Well that doesn't really sound like a bad thing. ",
			r4: "As you near the halfway point without too much strife, the Spire itself seems to become alive. You don't know what could be activating it since Druopitee is dead, so you keep your head down and you watch where you tread.<br/><br/>There's also some little containers floating a tiny bit off the ground, so you go check em out. " ,
			r6: "A humming vibration suddenly fills the air, and a voice booms from the walls. <span class='spirePoem'>There is a piece of me in every last Spire<br/>I will ensure that Corruption is never retired<br/>Though your resolve is something that I admire<br/>Your little plan will surely backfire<br/></span>So it seems like all of the Spires are actually sentient thanks to Druopitee. You're just glad the narrator isn't trying to do the poetry anymore. Hey wait...<br/><br/>",
			r7: "<span class='spirePoem'>I see you found my notes on my Healthy mutation<br/>I bet you even think it could be your salvation<br/>Improving this world must be quite the temptation<br/>But your journey will surely end in frustration</span>Well, you definitely want to get your hands on some of that Healthy mutation now. ",
			r8: "Nothing here but a bunch of boxes, so you decide to rummage through them. ",
			r9: "<span class='spirePoem'>Even if you were able, which you surely are not<br/>A Healthier world would not hasten your trot<br/>For there's strength in Health and you would be distraught<br/>At the difficult challenge you yourself had wrought</span>It sounds like he's trying to tell you that the Healthy mutation would make your enemies even stronger. Still seems like releasing it would be the right thing to do, though. ",
			r10: "As the Echo of Druopitee falls, you notice a large tank of some brown looking liquid, and you see pipes and tubes running from it to the top of the Spire. A label on the tank seems to indicate that this is the Healthy mutation and that you shouldn't touch it. But you know that what you want and what Druopitee wants are different things, so you start turning all the nozzles you can find. A fine brown mist begins to spout from the top of the Spire and you can tell that the world is finally healing. Now you just hope he was lying about this making the enemies stronger... "
		},
		spire3: {
			r2: "There seems to be a pattern here of each spire looking considerably more trashed than the one before it. The walls feel cold and the vibration inside is very faint. Nobody's watching you, so you dig around looking for some stuff to take. ",
			r4: "The vibrations within the walls grow stronger with each step you take towards the top. The air has become noticeably warmer, and you expect the walls to start talking to you again soon. ",
			r6: "<span class='spirePoem'>WHAT<br/>WHO<br/>How...</span>That didn't seem very coherent. It seems like destroying his Echo in the last Spire has made some sort of impact. ",
			r7: "<span class='spirePoem'>I see that you're attempting some planetary healing<br/>Leaving me steaming in an unappealing feeling<br/>Your freewheeling and stealing has just reached the ceiling<br/>Now commence kneeling or be sent off reeling</span>At least he's gained enough consciousness back to continue with the threats. You know that now is not the time to back down. ",
			r8: "<span class='spirePoem'>It's obvious that you want the Corruption to slow<br/>So I'll point out something you might not yet know<br/>My Spires are infinite, there is no plateau<br/>You are doomed and you've been so since long long ago</span>His Spires might be infinite, but it's not possible for his consciousness to be. You decide you'll worry about the rest of the spires once you've beaten Druopitee into nothingness. ",
			r9: "<span class='spirePoem'>Still you climb on, won't your strength ever waver?<br/>You're determined to be this planet's true savior?<br/>Stop to reconsider, we could be something greater<br/>Or continue your path as a time traveling slaver</span>Slaver?! Your Trimps all know that they're free to leave whenever they want. He's just trying to get under your skin! ",
			r10: "Well, that's one Druopitee and two Echoes of Druopitee down now. He says that he has infinite Spires and infinite versions of himself, but you could tell at the end there that his Echoes are losing power. You might be able to knock the sentience out of all of his Spires by just clearing one more! You set your sights 100 Zones forward, turn some more nozzles to spread some more Health around the world, you take your helium, spit on the floor of the Spire, and move on. "
		},
		spire4: {
			r2: "As you guessed before you even stepped in, this Spire is in even worse condition than the one before. The air is colder, the walls are more still, and there's a feeling of vacancy. Might as well look for stuff to take! ",
			r4: "You wonder if the Echo of Druopitee will even be able to speak anymore. You know he'll be at the top waiting, just like the infinite other Spires, but maybe he'll just leave you be this time. ",
			r6: "The Spire is warming up again. Maybe Druopitee will make his final appearance soon. ",
			r7: "<span class='spirePoem'>Please just go around, there's nothing to see<br/>Why is my demise something you must guarantee?<br/>I beg you once more, please hear my plea<br/>We could rule for all time, just you and me</span>No thanks, Druopitee. It's kinda nice to see him scared though! ",
			r8: "<span class='spirePoem'>Well here is something I wouldn't normally say<br/>Since it seems like you won't be going away<br/>Each of my Echoes you slay makes my mind decay<br/>I may not be able to communicate after today</span>Yes, that was becoming pretty obvious. His mind must really be decaying fast if he thought this admission would be anything other than motivating. ",
			r9: "<span class='spirePoem'>Why don't you care that you're making things harder?<br/>To repair the planet you'd give enemies armor?<br/>When I brought you here, I thought you'd be smarter<br/>But it seems like there's no room left to barter</span>No, there's not. You're almost there. ",
			r10: "As this third Echo of Druopitee falls, the Spire suddenly feels twice as cold. Druopitee told you that he placed infinite versions of himself in infinite Spires, but his will should no longer be conscious in any of them. You turn another set of knobs to release some more of the Healthy mutation into the world, and you figure there's nothing better to do than to keep looking for more to release. You just wouldn't be surprised to not hear from Druopitee again, at least not in this timeline. "
		},
		spire5: {
			r2: "While you walk through the Spire, you whistle a tune. You haven't yet tired, your motivations zoom. As Fluffy checks for loot in this dark, dusty room, you suddenly see fire and hear a huge boom. ",
			r6: "Against your better judgment, you continue to climb. Heat fills this dungeon, and doubt fills your mind. You feel a great evil that's long been confined, but with reluctance you move on for the good of Trimpkind. ",			
			r4: "The fires still grow, but they leave a clear path. Just one direction shown, the thought makes you laugh. Unwisely Druopitee tried to rig this booby trap, but the fire shows the way to go so you thank him for the map. ",			
			r7: "You're close to the top of this large, awful tower. Your fearful thoughts drop, your will is empowered. Luckily you have Fluffy to support you in this hour, you two will never stop until these echoes are devoured.",
			r8: "The presence here is unique from what you felt before. You know it can't speak but it's not done for. An intrusive thought knocks on your mind's back door:<br/><span class='spirePoem'>You are weak. I'll be on the top floor.</span> ",
			r9: "Another thought enters your mind, this time louder than before:<br/><span class='spirePoem'>Your death warrant's signed, soon you'll be no more.<br/>I gave you everything you have, it was no easy chore.<br/>Your Trimps are MINE, prepare for war!</span><br/>Even in death this guy's a dick. ",
			r10: "As yet another Echo of Druopitee fades into nothingness, you feel something urging you to check underneath a loose stone in the corner of the room. After lifting it up, you find a small notebook with the words \"Global Domination\" written on it. The text all seems to be in Druopitee's handwriting, which you instantly recognize from the books you've found around the planet. The first few pages all discuss Druopitee's success with various creatures here, followed by multiple pages documenting failures at attempts to control the Trimps. The very last page with any writing in it indicates that Druopitee intended to create leaders they'd be more likely to follow, by creating clones of himself mixed with varying amounts of Trimp DNA. Is this where Fluffy came from?! "
		},
		spire6: {
			r2: "You think you can hear a little whimper coming from the walls as you climb the Spire. Druopitee's Echoes are really not doing well. ",
			r7: "All of the color seems to have drained from the Spire, and all the creatures seem like black and white zombies. You really want to clean this place up and get out. ",
			get r10(){
				var text = "You look out at the lands ahead of you from the top of the Spire. ";
				var obs = getObsidianStart();
				if (obs <= 800){
					var obsZones = obs - 700;
					text += "You think you can see the tip of another Spire over the Horizon, but the impenetrable wall of Obsidian " + obsZones + " Zone" + needAnS(obsZones) + " away makes getting there impossible right now. ";
					if (!Fluffy.checkU2Allowed()) text += " You have no idea how to get past the Obsidian. Fluffy seems agitated, like he wants to do something about it but can't quite manage to. Maybe if he was more powerful... ";
					else text += " Fluffy suggests that you should be able to melt the wall, if you can channel enough power into this Universe. Guess you better get to it !";
				}
				else text += " It's charred and burned and broken, but you can see the tip of another Spire over the horizon, and the way before you is clear. ";
				return text;
			}
		},
		spire7: {
			r2: "While the Bad Guys here are still heavily mutated and strong, the Spire itself feels like a husk of the earlier ones. The silence makes you shiver but you press on. ",
			get r10(){
				var text = "The Echo was so weak that the Spire barely feels different after defeating it. There is an Obsidian wasteland beyond the Spire, and you can't see anything of note out there. Good thing too, because it's grown increasingly more difficult to push the obsidian back. ";
				var obs = getObsidianStart();
				if (obs < 810) text += "With Fluffy's help and a little bit more effort, you could probably push the Obsidian back a few more Zones.";
				else text += "The path through a few Zones just beyond the Spire is clear, but the not-so-distant Obsidian wall doesn't look like it will ever melt."
				return text + " ";
			}
		},
		spireU21: {
			r1: "Scruffy congratulates you on the first step taken on the long journey through this Spire. Your Trimps already feel a little bit stronger!",
			r5: "Your Trimps have a simultaneous coughing fit as Spores erupt from that Natural enemy and fill the room. You hear Stuffy attempt evil laughter on the Floor above you, but it honestly humors you more than it does intimidate. This combined with the effect of the Spores causes you to burst out laughing, and you hear an embarrassed Stuffy run further up the Spire.",
			r10: "Scruffy lets you know that you're one tenth of one tenth of the way to the top. You consider finally giving him that lesson he's been asking for on multiplication of fractions but decide now is probably not the time.",
			r15: "Another Natural enemy and another stack of the Spores. Your Trimps aren't acting quite as bothered by this one, but they definitely seem to have gotten weaker. Scruffy reminds you that at least there were only two Natural enemies on this Floor and they're both dead. Just gotta get to the next Floor to get out of this cloud, and your Trimps strength should fully return!",
			r50: "You're halfway through the first Floor! Stuffy doesn't stand a chance.",
			r90: "About 10 cells ahead, you see a small device emitting some sort of gas. Scruffy lets you know that smashing that will permanently remove this entire Floor from the Universe which sounds like a good thing to you!",
			r100: "You've done it! That's one whole Floor cleared and removed completely from the Universe. Stuffy might be able to run for now, but as long as you can keep chipping away at his Spire, you'll reach him some day, in some timeline. As you begin to start work on the second Floor, you notice a chest containing four Mutated Heirlooms!", //4 mutated heirlooms
			r105: "The first Natural enemy is down, but it looks like there's a few more of them on this Floor than the last. Scruffy says that the Natural mutation itself is actually a living entity, and that it's growing as we climb the Spire. Creepy!",
			r120: "You hear Stuffy on the Floor above you yelling something about how much he hates pollution, but you don't think there's actually anything natural about this 'Natural' mutation.",
			r140: "Stuffy pops out from behind the corpse of the recently destroyed Bad Guy and slaps a Dagger out of the hands of a nearby bewildered Trimp. He asks if you know how much damage was done to the planet to create that Dagger, and you guess not very much. He doesn't seem to have a response and retreats further into the Spire.",
			r175: "The worst part of all of this is that you kind of agree with Stuffy's message about not destroying the planet but this Spire seems to be doing a lot more damage than you are, plus he's kind of a jerk.",
			r190: "You've almost reached the end of another Floor, and once again you spot the small, strange, gas-emitting device. You need to destroy it as quickly as possible!",
			r200: "Another Floor down, another Floor erased from existence. Scruffy points out that you may not remember anything about this Spire after your next Portal, but assures you that he can fill you in whenever you need it. You have gained a lot of knowledge on the Mutations now, and will permanently gain 2x Mutated Seeds.", //2x seeds
			r205: "The Natural Mutation is still growing! What is it becoming!?",
			r225: "Despite all the toxic spore clouds and Mutations, your Trimps are in good spirits. As long as they get to kill Bad Guys, they're usually pretty happy.",
			r250: "You're officially a quarter of the way through the entire Spire. Scruffy tells you that Fluffy would be proud.",
			r275: "You can't stop thinking about how Scruffy told you the Mutation here was alive, what is it going to grow in to?!",
			r290: "You can finally see the gas-emitting device at the end of this Floor! You ask Scruffy what it actually is, and he states that it's a Spire Stabilizer. Apparently the Spires and Mutation spreaders are based on some wild dimension-bending technology that will simply cease existing without the right precautions.",
			r300: "You've done it! 3 Floors of this wretched place have been scrubbed from existence. Scruffy seems to be growing more powerful with every Floor cleared, and now permanently gains +50% experience!", //+50% scruffy xp
			r306: "The Mutation here seems to become more plantlike the higher you climb. Scruffy says that's probably what Stuffy was going for.",
			r330: "Stuffy shows up again and tries once more to shame you for the damage you've done to the planet. You just kinda ignore him and he eventually goes away.",
			r360: "The spores tickle the inside of your brain!",
			r390: "This Floor's Stabilizer is finally within viewing distance! You can't wait to see what goodies await you at the end of this Floor.",
			r400: "One more Floor, one more Stabilizer. Only one Floor from the halfway point now, you're really making a dent in this Spire! Just as you were escaping the evaporating Floor, you found a strange blue orb and naturally you grabbed it. It didn't seem to react to your touch, but when you tossed it to a nearby Trimp it released an intense burst of energy and caused all your Trimps to look a bit stronger. Your Trimps permanently gained +10% Crit Chance!", //+10% crit
			r407: "The Mutation grows...",
			r430: "You ask Scruffy what actually happens if 10 groups of Trimps die here, and he reveals that he actually teleports you out himself. You ask why, and he tells you it's better not to waste time on an impossible task.",
			r460: "After some thought about your last conversation with Scruffy, you approach him and ask if he could at least hold off on the teleport if you're like really close to finishing Stuffy off or something. He tells you only a clean kill will suffice.",
			r470: "You lost all your Trimps! Oh no wait there they are.",
			r490: "Just as you expected, there's another Stabilizer on this Floor, and you have located it with your eyeballs.",
			r500: "Scruffy congratulates you on destroying half of Stuffy's Spire! He has a good laugh thinking about how mad Stuffy must be. After waiting an uncomfortable amount of time for him to stop laughing, you ask if he knows anything about this strange device you found at the end of the last Floor. He pushes a button on it, straps it on his arm, and tells you that the bonus Attack, Health and Radon your Trimps were gaining from this Spire are all now doubled!", //2x basic
			r507: "As Scruffy predicted, the Mutation continues to grow larger. Is it starting to look a little bit like a tree?",
			r525: "You ask Scruffy where Mutations actually came from. He says that it must have been created after he and Fluffy rebelled so he doesn't know much, but that the seeds are extremely energy-dense.",
			r560: "You spot Stuffy hiding behind an incredibly out of place looking bush and decide to just ask him why he's releasing all this Mutation on the planet he claims to love so much. He tells you he's making Nature stronger and that the planet would thank him if it could. Just as you were about to respond, both Stuffy and the bush vanish.",
			r590: "Is the Stabilizer on this Floor dancing on 8 legs or are the Spores just starting to get to you? Either way you should probably go break that thing.",
			r600: "As you emerge from the non-existent space of the previous Floor, you take in a deep Spore-free breath and pat yourself on the back. Out of the corner of your eye you notice a small yellow shard, and touching it fills you with ancient knowledge allowing you to gain an extra 20% Nullifium when recycling Heirlooms!", //Needs reward
			r607: "Ok that Mutation is definitely a tree. A big scary tree!",
			r630: "Scruffy seems to be growing tired of making notes of everything that has happened in this Spire.",
			r660: "Stuffy comes by once again but you can't really understand what he's saying. You're not sure if it's the spores or if he's just messing with you.",
			r690: "Once again you spot a Stabilizer! You really want to clear it fast, the spores are not very enjoyable.",
			r700: "As you finish up the Floor and the Floor drains away, you take a look at your Trimps and realize they're pretty great. That's seven whole floors and one mad Stuffy, and now Scruffy earns another 50% XP!", //+50% scruffy xp
			r707: "One of the Mutated cells here looks different! You ask Scruffy about it and he tells you that the orange ones have a much higher concentration of Spores, and will release 10x the normal amount of Spores when attacked and killed. You're not liking the sound of that...",
			r750: "You've made it three quarters of the way through the Spire! This evil structure is now a small fragment of what it once was, thanks to you. Scruffy offers you a small, strange berry as congratulations.",
			r775: "Stuffy stops by again and asks you really nicely to just leave. He says he won't mess with you anymore, but that he can't stand to let Druopitee down. You tell him you'll leave if he destroys the rest of the Spire, but he just makes a weird noise and runs off.",
			r790: "You know the deal, another Stabilizer spotted for your Spire-Destroying pleasure!",
			r800: "That's eight Floors down, two to go! You found another strange blue orb which you toss directly to a Trimp and show no surprise when they gain another +15% Crit Chance! Scruffy points forward, you nod your head, and continue on.", //+15% crit
			r807: "The Mutation continues to grow and organize. You let out a deep sigh thinking about how many Spores will be in the air at the end of this Floor.",
			r830: "Stuffy tried to take a Trimp hostage in order to force you to leave, but he dropped the Trimp and it ran back like nothing happened.",
			r860: "Stuffy's making some odd noises up ahead, it seems like you've thoroughly frightened him.",
			r890: "Is that another Stabilizer down there? Don't mind if you do.",
			r900: "You've actually done it! You've made it to the final Floor! Scruffy tells you that this Floor was stabilized by Druopitee himself and cannot be permanently removed from all timelines, but that you can certainly remove it and Stuffy from this timeline. Now that you can think properly without the Spores of the previous Floor, you realize there's some new knowledge in your head that will allow you to gain 2x more Seeds!", //2x seeds
			r907: "You can sense Stuffy at the end of this Floor. The little fella has nowhere else to run! It's time to finish this.",
			r930: "A Trimp walks up to you and offers you a small stick he found as a good luck charm. With the power of this stick, you basically can't lose now.",
			r960: "You're so close you can almost taste the impending victory. Or maybe that's just all the spores in the air.",
			r990: "Just as Scruffy predicted, there's no Stabilizer at the end of this Floor. But there is a Stuffy, and destroying him will be good enough for you.",
			r1000: "Stuffy lets out a shriek as your Trimps finish him off. You smash the Mutation spreader into a thousand pieces, and the air begins to clear. However you still see a large amount of Mutation ahead of you in the World, and it becomes apparent that you'll be needing to pay a visit to Buffy next. Scruffy lets you know that you've done an amazing thing for the timeline, and that the ruins of the Spire are now acting as a beacon increasing your Trimps Attack, Health, and your Radon gain by 10x until you Portal. You've done something amazing here, and with a massive sense of accomplishment you continue on to the next one." //10x basic
		}
	}
	var spire = spires['spire' + spireNum];
	if (getAll) return spire;
	if (typeof spire == 'undefined') return '';
	var rowText = spire['r' + row];
	if (typeof rowText == 'undefined') return '';
	return rowText;
}

var u2SpireBonuses = {
	scruffyXp: function(){
		var mult = 1;
		if (game.global.universe != 2) return mult;
		if (game.global.u2SpireCellsBest >= 300) mult += 0.5;
		if (game.global.u2SpireCellsBest >= 700) mult += 0.5;
		return mult;
	},
	seedDrop: function(){
		var mult = 1;
		if (game.global.u2SpireCellsBest >= 200) mult *= 2;
		if (game.global.u2SpireCellsBest >= 900) mult *= 2;
		return mult;
	},
	critChance: function(){
		var add = 0;
		if (game.global.universe != 2) return add;
		if (game.global.u2SpireCellsBest >= 400) add += 0.10;
		if (game.global.u2SpireCellsBest >= 800) add += 0.15;
		return add;
	},
	nullifium: function(){
		var mult = 1;
		if (game.global.u2SpireCellsBest >= 600) mult *= 1.2;
		return mult;
	},
	basics: function(){
		//attack, health, radon
		var mult = 1;
		if (game.global.universe != 2) return mult;
		if (game.global.u2SpireCellsBest <= 0) return mult;
		var credit = this.cellCredit();
		mult = Math.pow(1.005, credit);
		if (credit >= 500) mult *= 2;
		if (game.global.u2SpireCells >= 1000) mult *= 10; //10x for completing floor 10 each run, not based on credit
		return mult;
	},
	cellCredit: function(){
		return (game.global.u2SpireCellsBest > game.global.u2SpireCells) ? Math.floor(game.global.u2SpireCellsBest / 100) * 100 : game.global.u2SpireCells;
	}
}

function scruffySpireStory(){
	var text = "<div style='max-height: 50vh; overflow-y: auto'>You may not remember every Floor in Stuffy's Spire, but Scruffy does! He offers you the following recap of everything that has happened so far:";
	var max = u2SpireBonuses.cellCredit();
	var stories = getSpireStory("U21", null, true);
	var lastFloor = 0;
	for(var item in stories){
		var cell = parseInt(item.split('r')[1], 10);
		if (cell > max) break;
		var thisFloor = Math.ceil(cell / 100);
		if (thisFloor > lastFloor){
			let tagName = (usingScreenReader ? "h1" : "b")
			text += `<hr/><${tagName} style='font-size: 1.2em'>Floor ${thisFloor}</${tagName}><br/>`;
			lastFloor++;
		}
		text += "<b>Cell " + cell + "</b>: " + stories[item] + "<br/>";
	}
	text += "</div>";
	tooltip('confirm', null, 'update', text, "tooltip('Fluffy', null, 'update')", "Stuffy's Spire", 'Back', true)
}

function rewardU2Spire(level){
	var totalCells = (100 * (game.global.spireLevel - 1)) + level;
	if (game.global.u2SpireCells < totalCells){
		var increase = u2SpireBonuses.basics();
		game.global.u2SpireCells = totalCells;
		increase = ((u2SpireBonuses.basics() / increase) - 1);
		addSoldierHealth(increase);
	}
	if (game.global.u2SpireCellsBest < totalCells) game.global.u2SpireCellsBest = totalCells;
	var text = getSpireStory("U21", totalCells);
	if (text == '') return;
	switch(totalCells){
		case(100):
			for (var x = 0; x < 4; x++){
				createHeirloom(300, false, false, true);
			}
			break;
	}
	message(text, "Story");
}

function giveSpireReward(level){
	if (game.global.universe == 2) {
		rewardU2Spire(level);
		return;
	}
	var spireWorld = checkIfSpireWorld(true);
	if (level != 0 && level % 10 == 0) game.global.spireRows++;
	if (spireWorld == 1){
		rewardSpire1(level);
		return;
	}
	//Spire 2+ only here
	var text = "";
	switch(level){
		case(20):
			var nuReward = 200 * Math.pow(2, spireWorld - 2);
			game.global.nullifium += nuReward;
			message(getSpireStory(spireWorld, 2) + "You found " + nuReward + " Nullifium!", "Story");
			break;
		case(40):
			if (!game.global.runningChallengeSquared){
				amt = giveHeliumReward(15);
				message(getSpireStory(spireWorld, 4) + "You help yourself to a container filled with " + prettify(amt) + " Helium!", "Story");
			}
			else message(getSpireStory(spireWorld, 4) + ((spireWorld == 2) ? "Gah! They're all empty!" : ""), "Story");
			break;
		case(50):
			if (spireWorld == 2){
				if (Fluffy.getCapableLevel() > 0){
					message("Out of the corner of your eye, you notice a creature who doesn't seem like he belongs. You walk up closer and notice that it's Fluffy! You turn around expecting to see your other Fluffy, but there is only one. You turn back as he waves at you in recognition, you feel a bit lightheaded, but you've had weirder things happen on this planet. You decide to keep moving up the Spire with your new old friend.", "Story");					
				}
				else {
					message("Out of the corner of your eye, you notice a creature who doesn't seem like he belongs. You walk up closer and notice that it's a Trimp! Only this Trimp is purple instead of blue, obviously a result of some experiments by Druopitee. You let him know not to worry, and that you'll keep him safe. You name him Fluffy, and vow to never let any harm come to him. <b>Gained 1 Trimp!</b>", "Story");
					//I know that adding 1 trimp doesn't do anything at all, but I'm no liar (on purpose)
					game.resources.trimps.owned++;
				}
				Fluffy.handleBox();
			}
			else{
				//Spire III+
				var fluffReward = Fluffy.rewardExp(2);
				if (fluffReward)
					message("Fluffy suddenly drops to all of his extremities and begins closely inspecting the walls. After a few moments he chooses a location and smashes a hole in it, then pulls a small book out of said hole. Without even opening it up, he eats the book and gains " + prettify(fluffReward) + " experience! What a magnificent creature.", "Story");
			}
			break;
		case(60):
			var nuReward = 300 * Math.pow(2, spireWorld - 2);
			game.global.nullifium += nuReward;
			message(getSpireStory(spireWorld, 6) + "You found " + nuReward + " Nullifium!</span>", "Story");
			break;
		case(70):			
			var heirloomLevel = 400;
			if (spireWorld > 3) heirloomLevel = ((spireWorld + 1) * 100);
			message(getSpireStory(spireWorld, 7) + "You found a Z" + heirloomLevel + " Heirloom!", "Story");
			createHeirloom(heirloomLevel);
			break;
		case(80):
			var tokReward = 5 * (spireWorld - 1);
			game.empowerments.Poison.tokens += tokReward;
			game.empowerments.Wind.tokens += tokReward;
			game.empowerments.Ice.tokens += tokReward;
			game.stats.bestTokens.value += (tokReward * 3);
			message(getSpireStory(spireWorld, 8) + "You found " + tokReward + " of each type of Nature Token!", "Story");
			if (game.global.buyTab == "nature")
				updateNatureInfoSpans();
			break;
		case(90):
			if (!game.global.runningChallengeSquared){
				amt = giveHeliumReward(30);
				message(getSpireStory(spireWorld, 9) + "You figure you'll help yourself to another container filled with " + prettify(amt) + " Helium!", "Story");
			}
			else message(getSpireStory(spireWorld, 9) + "You search around for some more resources but find nothing. Lame.", "Story");
			break;
		case(100):
			if (game.global.spireDeaths == 0) giveSingleAchieve("Invincible");
			if (spireWorld >= 5 && game.global.spireDeaths == 0) giveSingleAchieve("Invisible");
			var text = getSpireStory(spireWorld, 10);
			if (!game.global.runningChallengeSquared){
				var amt = giveHeliumReward(100);
				text += " You find a large stockpile of <b>" + prettify(amt) + " Helium</b> and <b>a brand new Spire Core</b>!";
			}
			else text += " You find a <b>brand new Spire Core</b>!";
			if (spireWorld == 6){
				var talentCount = countPurchasedTalents();
				var maxTalents = Object.keys(game.talents).length;
				if (talentCount < maxTalents){
					var maxCost = getTotalTalentCost();
					if (game.global.spentEssence + game.global.essence < maxCost){
						var oldEssence = game.global.essence;
						game.global.essence = Math.max(maxCost - game.global.spentEssence, 0);
						game.global.essence = Math.round(game.global.essence);
						if (game.global.essence > oldEssence)
						text += "<br/><span class='fullDarkEssence'>At the top of this Spire, you found a gigantic, pitch-black cache with " + prettify(game.global.essence - oldEssence) + " Dark Essence inside, just enough to complete your entire collection!</span><br/>";
					}
				}
			}
			createHeirloom(game.global.world, false, true);
			if (game.global.spiresCompleted < spireWorld){
				game.global.spiresCompleted = spireWorld;
				game.global.b += 20;
				updateBones();
				text += " For your first time killing this Echo in any timeline, you have permanently added another 5% to your Liquification bonus, increased your Dark Essence gains by 4x, and earned <b>20 bones!</b>"
				switch (spireWorld){
					case 2: 
						text += " You have also unlocked the <b>Capable</b> perk and can carry an additional Heirloom!";
						game.portal.Capable.locked = false;
						break;
					case 3:
						text += " You have also unlocked the <b>Cunning</b> perk and can carry an additional Heirloom!"
						game.portal.Cunning.locked = false;
						break;
					case 4:
						text += " You have also unlocked the <b>Curious</b> perk!"
						game.portal.Curious.locked = false;
						break;
					case 5:
						text += " You have also unlocked the <b>Classy</b> perk!<b>";
						game.portal.Classy.locked = false;
				}
			}
			if (spireWorld == 2 && game.global.canRespecPerks && !game.global.bonePortalThisRun && countHeliumSpent() <= 1e9) giveSingleAchieve("Nerfeder");
			if (game.global.challengeActive == "Coordinate") giveSingleAchieve("Hypercoordinated");
			game.global.lastSpireCleared = spireWorld;
			message(text, "Story");
			game.global.spireActive = false;
			setNonMapBox();
			handleExitSpireBtn();
			var spireAchieve = "spire" + spireWorld + "Timed";
			if (typeof game.achievements[spireAchieve] !== 'undefined'){
				checkAchieve(spireAchieve);
			}
			break;
		default:
			if (game.global.runningChallengeSquared) return;
			amt = 0.5;
			amt *= Math.pow(1.01, level);
			amt = giveHeliumReward(amt);
			message("As you're leaving, you find " + prettify(amt) + " helium!", "Loot", heliumIcon(true), "helium", "helium");
			return;				
	}
}

function rewardSpire1(level){
	var amt = 0;
	var text = "";
	switch(level){
		case 10:
			text = "The voice booms again, and sounds as if it is coming from the walls themselves.<br/><br/><span class='spirePoem'>It has been forever, yet now we meet,<br/>I'm not surprised you don't remember me.<br/>I believe it is I who you currently seek,<br/>Lifetimes ago I was Druopitee.</span>";
			if (game.portal.Toughness_II.locked) text += "<br/>You're glad you remembered his name correctly! You feel tougher as memories begin to flood back, and <b>unlocked Toughness II</b>!";
			message(text, "Story");
			game.portal.Toughness_II.locked = false;
			break;
		case 20:
			message("<span class='spirePoem'>On our planet you and I studied time,<br/>We realized Warp Speed could affect that line.<br/>I took our work in a ship of my own design,<br/>To test the effects of our new paradigm.</span><br/>Oh yeah. That's where you knew him from! Wait doesn't he owe you some money? You feel fair taking a vial of <b>40 Nullifium</b> from a research table.", "Story");
			game.global.nullifium += 40;
			break;
		case 30:
			text += "<span class='spirePoem'>My tests made other dimensions appear,<br/>I found this planet in one and flew here.<br/>There were hordes of enemies, if that wasn't clear,<br/>The finding was huge but the threat severe.</span><br/>Ah, so you're in a different dimension than your friends and family, comforting.";
			if (game.portal.Power_II.locked) text += " Your desire to go home some day causes strength to flow through you, and you <b>unlocked Power II</b>!";
			message(text, "Story");
			game.portal.Power_II.locked = false;
			break;
		case 40:

			text = "<span class='spirePoem'>To stay safe, I built many large towers.<br/>I'd climb up, and I'd peer out for hours.<br/>I searched for lifetimes, my mind became devoured,<br/>then one day I found a way to gain power.</span><br/>Dammit Druopitee. This is all going to end up being his fault, isn't it? ";
			if (!game.global.runningChallengeSquared){
				amt = giveHeliumReward(15);
				text += "You help yourself to a container filled with " + prettify(amt) + " Helium, and figure he'll owe you a lot more than that once you hear some more.";
				}
			else
				text += "You look for something to steal to try and even the playing field, but can't find anything. Oh well.";
			message(text, "Story");
			break;
		case 50:
			text = "<span class='spirePoem'>After many lifetimes of observation,<br/>I had finally found my salvation.<br/>An airborne chemical to cause great mutation,<br/>the Corruption was my new creation.</span><br/>Yup, totally his fault.";
			if (game.portal.Motivation_II.locked) text += "Your desire to stop him is so strong that you've <b>unlocked Motivation II</b>!"
			message(text, "Story");
			game.portal.Motivation_II.locked = false;
			break;
		case 60:
			game.global.nullifium += 60;
			message("<span class='spirePoem'>I pumped Corruption up from my spires,<br/>I watched as it spread outward like wildfires.<br/>They now bowed to me, their brains freshly rewired,<br/>I had almost all that I desired.</span><br/>You feel like anyone willing to pump something called 'Corruption' into a planet's atmosphere probably qualifies as a supervillain. You feel no remorse taking another vial filled with <b>60 Nullifium</b>!", "Story");
			break;
		case 70:
			message("<span class='spirePoem'>But Trimps, who in numbers are tough as stone,<br/>weren't changed and I couldn't control them alone.<br/>So I got in my ship and I went to our home,<br/>I brought you here to the native Trimp Zones.</span><br/>You don't remember that, but are pretty sure you weren't OK with it. Kidnapping definitely justifies taking this research <b>Heirloom</b> you just found. ", "Story");
			createHeirloom(201);
			break;
		case 80:
			text = "<span class='spirePoem'>You disliked my plan and had to be forced,<br/>so I wiped your mind and plotted your course.<br/>I came up with plans for equipment and resorts,<br/>I wrote all I knew and left you reports.</span><br/>Oh HE wrote those? Now that you think about it, you can see a lot of ways the designs could be improved";
			text += (game.portal.Carpentry_II.locked) ? ", and <b>unlocked Carpentry II</b>!" : ".";
			message(text, "Story");
			game.portal.Carpentry_II.locked = false;
			break;
		case 90:
			text = "<span class='spirePoem'>Your Trimps grew strong while I watched and waited,<br/>Their loyalty can not be debated.<br/>You knew not of my plan, yet participated,<br/>Now bow to me or be terminated.</span><br/>Yeah you don't really feel too much like bowing and probably won't be doing that.";
			if (!game.global.runningChallengeSquared){
				amt = giveHeliumReward(30);
				text += " You did however find " + prettify(amt) + " more Helium just sitting around, which you feel no qualms about taking.";
			}
			message(text, "Story");
			break;
		case 100:
			if (game.global.spireDeaths == 0) giveSingleAchieve("Invincible");
			text = "Druopitee collapses to the floor. You were hoping he'd be a little more sane, but whatever. You shut down the corruption device and hope the planet will repair itself soon, then you rummage through his stuff and find keys, surely for the ship!";
			if (!game.global.runningChallengeSquared){
				amt = giveHeliumReward(100);
				text += " You also find a massive stockpile of <b>" + prettify(amt) + " Helium</b>.";
			}
			if (game.portal.Looting_II.locked) text += " Your skills at salvaging things from this Spire have helped you <b>unlock Looting II</b>.";
			if (game.global.spiresCompleted < 1){
				text += "<br/><br/>You notice a small timeworn chest in the back of the room, where Druopitee had been storing the Skeletimp bones that he had collected over many timelines. You open it and find <b>20 Perfect Skeletimp Bones!</b> You can tell though that these bones won't be here next time. The Spire's power grants you a permanent 4x bonus to all Dark Essence you collect, you can carry an additional Heirloom back through the Portal, and your Portal has also modified itself to now Liquify Zones equal to 5% of your highest Zone reached. You're not quite sure what a liquify is, but you're excited to find out! "
				game.global.b += 20;
				updateSkeleBtn();
				game.global.spiresCompleted = 1;
				text += "<br/><br/><b>You've also found a large, pulsing core that seems to be powering the Spire. You try to carefully remove it but instead smash it into 20 still-humming pieces! You give the pieces to your Scientists, who name the magical new material \"Spirestones\" and use them to begin construction on your own Spire!</b>"
				playerSpire.init();
				playerSpire.rewardSpirestones(1);
			}
			else{
				createHeirloom(200, false, true);
				text += "<br/><br/><b>You were able to properly remove the Core this time, and have found a Basic Spire Core Heirloom!</b>";
			}
			text += "<br/><br/>You've helped the Trimps establish a legendary population and economy, and have brought down the man responsible for the chaos in this world. You could leave now and the Universe will forever be better because you existed. Trimps will erect statues of you as long as their civilization survives. But you know there are still other spires out there, pumping Corruption into the planet. Maybe the statues would be bigger if you stayed and helped out?";
			message(text, "Story");
			game.portal.Looting_II.locked = false;
			checkAchieve("spireTimed");
			if (game.global.canRespecPerks && !game.global.bonePortalThisRun && countHeliumSpent() <= 100e6) giveSingleAchieve("Nerfed");
			game.global.spireActive = false;
			game.global.lastSpireCleared = 1;
			setNonMapBox();
			handleExitSpireBtn();
			break;
		default:
			if (game.global.runningChallengeSquared) return;
			amt = 0.5;
			amt *= Math.pow(1.01, level);
			amt = giveHeliumReward(amt);
			message("You found " + prettify(amt) + " helium!", "Loot", heliumIcon(true), "helium", "helium");
	}
}

var goldenUpgradesShown = false;
function displayGoldenUpgrades(redraw) {
	if (usingRealTimeOffline && goldenUpgradesShown) return false;
	if (goldenUpgradesShown && !redraw) return false;
	if (getAvailableGoldenUpgrades() <= 0) return false;
	if (!goldenUpgradesShown) game.global.lastUnlock = new Date().getTime();

	const elem = document.getElementById('upgradesHere');
	if (elem && elem.children[0] && elem.children[0].id.includes('Golden')) return false;

	var html = "";
	for (var item in game.goldenUpgrades){
		var upgrade = game.goldenUpgrades[item];
		if (item == "Void" && (game.global.totalPortals < 1 || (game.global.universe == 2 && game.global.totalRadPortals < 1))) continue;
		var color = "thingColorGoldenUpgrade";
		if (
			(item == "Void" && (parseFloat((game.goldenUpgrades.Void.currentBonus + game.goldenUpgrades.Void.nextAmt()).toFixed(2)) > 0.72)) ||
			(item == "Helium" && game.global.runningChallengeSquared)
		){
			color = "thingColorCanNotAfford";
		}
		var displayName = item;
		if (displayName == "Helium" && game.global.universe == 2) displayName = "Radon";
		if (usingScreenReader){
			html += '<button class="' + color + ' thing goldenUpgradeThing noselect pointer upgradeThing" id="' + item + 'Golden" onclick="buyGoldenUpgrade(\'' + item + '\')"><span class="thingName">Golden ' + displayName + ' ' + prettify(game.global.goldenUpgrades + 1) + '</span>, <span class="thingOwned" id="golden' + item + 'Owned">' + upgrade.purchasedAt.length + '</span></button>';
		}
		else{
			html += '<div onmouseover="tooltip(\'' + item + '\', \'goldenUpgrades\', event)" onmouseout="tooltip(\'hide\')" class="' + color + ' thing goldenUpgradeThing noselect pointer upgradeThing" id="' + item + 'Golden" onclick="buyGoldenUpgrade(\'' + item + '\'); tooltip(\'hide\')"><span class="thingName">Golden ' + displayName + ' ' + romanNumeral(game.global.goldenUpgrades + 1) + '</span><br/><span class="thingOwned" id="golden' + item + 'Owned">' + upgrade.purchasedAt.length + '</span></div>';
		}
	}
	elem.insertAdjacentHTML('afterbegin', html)
	for (var item in game.goldenUpgrades) {
		makeAccessibleTooltip(item + 'Golden', [item, 'goldenUpgrades'])
	}
	goldenUpgradesShown = true;
	return true;
}

function removeGoldenUpgrades() {
	if (!goldenUpgradesShown) return false;
	var elems = document.getElementsByClassName('goldenUpgradeThing');
	var parent = document.getElementById('upgradesHere');
	for (var x = elems.length - 1; x >= 0; x--){
		parent.removeChild(elems[x]);
	}
	goldenUpgradesShown = false;
	return true;
}

function getAvailableGoldenUpgrades(){
	var tier = getAchievementStrengthLevel();
	if (tier == 0) return 0;
	return Math.floor(game.global.world / getGoldenFrequency(tier)) - game.global.goldenUpgrades + countExtraAchievementGoldens();
}

function getGoldenFrequency(fluffTier){
	if (fluffTier > 6) fluffTier = 6;
	return 50 - ((fluffTier - 1) * 5);
}

function buyGoldenUpgrade(what) {
	if (what == "Helium" && game.global.runningChallengeSquared) return;
	if (game.options.menu.lockOnUnlock.enabled == 1 && (new Date().getTime() - 1000 <= game.global.lastUnlock)) return;
	var totalAvailable = getAvailableGoldenUpgrades();
	if (totalAvailable <= 0) return false;
	if (what == "Void" && (parseFloat((game.goldenUpgrades.Void.currentBonus + game.goldenUpgrades.Void.nextAmt()).toFixed(2)) > 0.72)) return;
	var upgrade = game.goldenUpgrades[what];
	if (!upgrade) {
		setAutoGoldenSetting(0);
		toggleAutoGolden(true);
		return;
	}
	var oldBonus = upgrade.currentBonus;
	upgrade.currentBonus += upgrade.nextAmt();
	if (what == "Battle"){
		var increase = (((1 + upgrade.currentBonus) / (1 + oldBonus)) - 1);
		addSoldierHealth(increase);
	}
	upgrade.purchasedAt.push(game.global.goldenUpgrades);
	game.global.goldenUpgrades++;
	removeGoldenUpgrades();
	game.stats.goldenUpgrades.value++;
	if (game.stats.goldenUpgrades.valueTotal + game.stats.goldenUpgrades.value >= 77 && getAutoGoldenSetting() == -1){
		unlockAutoGolden();
	}
	if (totalAvailable > 1) displayGoldenUpgrades();
	return true;
}

function unlockAutoGolden(){
	tooltip('AutoGolden Unlocked', null, 'update');
	game.global.autoGolden = 0;
	game.global.autoGoldenU2 = 0;
	toggleAutoGolden(true);
}

function giveHeliumReward(mod){ //used for spire only
	var amt = rewardResource("helium", mod, 99);
	return amt;
}

function checkHousing(getHighest, skipU2){
	//returns the lowest number of housing buildings
	var count = -1;
	for (var item in game.buildings){
		var building = game.buildings[item];
		if (building.increase && building.increase.what == "trimps.max") {
			if (count == -1) count = building.owned;
			else if (skipU2 && building.blockU1){
				continue;
			}
			else if (getHighest){
				if (count < building.owned) count = building.owned;
			}
			else {
				if (count > building.owned) count = building.owned;
			}
		}
	}
	return count;
}

function assignExtraWorkers(){
	var workspaces = game.workspaces;
	var freeTrimps = (game.resources.trimps.owned - game.resources.trimps.employed);
	//Won't leave you with less than 15% of your max as breeders
	if (freeTrimps - workspaces < Math.floor(game.resources.trimps.realMax() * 0.15)) return;
	if (freeTrimps < workspaces) workspaces = freeTrimps;
	if (workspaces <= 0) return;
	var jobs = ["Farmer", "Lumberjack", "Miner"];
	var split = Math.floor(workspaces / 3);
	if (game.resources.food.owned < (split * 30)) split = Math.floor(game.resources.food.owned / 30);
	for (var x = 0; x < jobs.length; x++){
		game.jobs[jobs[x]].owned += split;
	}
	game.resources.food.owned -= (split * 30);
}

function distributeToChallenges(amt) {
	var challenge = game.global.challengeActive;
	if (challenge == "Mapocalypse") challenge = "Electricity";
	if (!challenge || typeof game.challenges[challenge].heliumThrough === 'undefined') return;
	var challengeObj = game.challenges[challenge];
	if (game.global.world <= challengeObj.heliumThrough) challengeObj.heldHelium += amt;
}

var dailyModifiers = {
	minDamage: {
            description: function (str) {
                return "Trimp min damage reduced by " + prettify(this.getMult(str) * 100) + "% (additive).";
            },
            getMult: function (str) {
                return 0.1 + ((str - 1) * 0.01);
            },
            getWeight: function (str) {
				return (1 / ((1.2 + (1 - this.getMult(str))) / 2 / 1.1)) - 1;
            },
            minMaxStep: [41, 90, 1],
            chance: 1
        },
        maxDamage: {
            description: function (str) {
                return "Trimp max damage increased by " + prettify(this.getMult(str) * 100) + "% (additive).";
            },
            getMult: function (str) {
                return str;
            },
            getWeight: function (str) {
                return (1 - ((1.2 + (1 + str)) / 2 / 1.1));
            },
            minMaxStep: [1, 5, 0.25],
            chance: 1
        },
		plague: { //Half of electricity
			description: function (str) {
                return "Enemies stack a debuff with each attack, damaging Trimps for " + prettify(this.getMult(str, 1) * 100) + "% of total health per turn per stack, resets on Trimp death."
            },
            getMult: function (str, stacks) {
                return 0.01 * str * stacks;
			},
			getWeight: function (str) {
				var count = Math.ceil((1 + Math.sqrt(1 + 800/str))/2);
				return (6 - (0.1 * count) + (0.8 / count) + (str / 8)) / 1.75;
			},
			minMaxStep: [1, 10, 1],
			chance: 0.3,
			icon: "*bug2",
			incompatible: ["rampage", "weakness"],
			stackDesc: function (str, stacks) {
				return "Your Trimps are taking " + prettify(this.getMult(str, stacks) * 100) + "% damage after each attack.";
			}
        },
		weakness: {
			description: function (str) {
				return "Enemies stack a debuff with each attack, reducing Trimp attack by " + prettify(100 - this.getMult(str, 1) * 100) + "% per stack. Stacks cap at 9 and reset on Trimp death.";
			},
			getMult: function (str, stacks) {
				return 1 - (0.01 * str * stacks);
			},
			getWeight: function (str) {
				return str / 4;
			},
			minMaxStep: [1, 10, 1],
			chance: 0.6,
			icon: "fire",
			incompatible: ["bogged", "plague"],
			stackDesc: function (str, stacks) {
				return "Your Trimps have " + prettify(100 - this.getMult(str, stacks) * 100) + "% less attack.";
			}
		},
		large: {
            description: function (str) {
                return "All housing can store " + prettify(100 - this.getMult(str) * 100) + "% fewer Trimps";
            },
            getMult: function(str) {
                return 1 - (0.01 * str);
            },
            getWeight: function (str) {
                return (1 / this.getMult(str) - 1) * 2;
            },
            start: function (str) {
                game.resources.trimps.maxMod = this.getMult(str);
            },
            abandon: function (str) {
                game.resources.trimps.maxMod = 1;
            },
            minMaxStep: [10, 60, 1],
            chance: 1
        },
		dedication: {
			description: function (str) {
				return "Gain " + prettify((this.getMult(str) * 100) - 100) + "% more resources from gathering";
			},
			getMult: function(str) {
				return 1 + (0.1 * str);
			},
			getWeight: function (str) {
				return 0.075 * str * -1;
			},
			incompatible: ["famine"],
			minMaxStep: [5, 40, 1],
			chance: 0.75
		},
		famine: {
            description: function (str) {
                return "Gain " + prettify(100 - (this.getMult(str) * 100)) + "% less Metal, Food, Wood, and Gems from all sources";
            },
            getMult: function (str) {
                return 1 - (0.01 * str);
            },
            getWeight: function (str) {
                return (1 / this.getMult(str) - 1) / 2;
			},
			incompatible: ["dedication"],
            minMaxStep: [40, 80, 1],
            chance: 2
        },
		badStrength: {
			description: function (str) {
				return "Enemy attack increased by " + prettify((this.getMult(str) * 100) - 100) + "%.";
			},
			getMult: function (str) {
				return 1 + (0.2 * str);
			},
			getWeight: function (str){
				return 0.1 * str;
			},
			minMaxStep: [5, 15, 1],
			chance: 1
		},
		badHealth: {
			description: function (str) {
				return "Enemy health increased by " + prettify((this.getMult(str) * 100) - 100) + "%.";
			},
			getMult: function (str) {
				return 1 + (0.2 * str);
			},
			getWeight: function (str){
				return 0.2 * str;
			},
			minMaxStep: [3, 15, 1],
			chance: 1
		},
		badMapStrength: {
            description: function (str) {
                return "Enemy attack in maps increased by " + prettify((this.getMult(str) * 100) - 100) + "%.";
            },
            getMult: function (str) {
                return 1 + (0.3 * str);
            },
            getWeight: function (str){
                return (0.1 * (1 + 1/3)) * str;
            },
            minMaxStep: [3, 15, 1],
            chance: 1
        },
        badMapHealth: {
            description: function (str) {
                return "Enemy health in maps increased by " + prettify((this.getMult(str) * 100) - 100) + "%.";
            },
            getMult: function (str) {
                return 1 + (0.3 * str);
            },
            getWeight: function (str){
                return (0.3 * str) * (5 / 8);
            },
            minMaxStep: [3, 10, 1],
            chance: 1
        },
		crits: {
            description: function (str) {
                return "Enemies have a 25% chance to crit for " + prettify(this.getMult(str) * 100) + "% of normal damage.";
            },
            getMult: function (str) {
                return 1 + (0.5 * str);
            },
            getWeight: function (str) {
                return 0.15 * this.getMult(str);
            },
            minMaxStep: [1, 24, 1],
            chance: 0.75
		},
		trimpCritChanceUp: {
			description: function (str) {
				return "Your Trimps have +" + prettify(this.getMult(str) * 100) + "% Crit Chance.";
			},
			getMult: function(str) {
				return str / 10;
			},
			getWeight: function (str) {
				return .25 * str * -1;
			},
			minMaxStep: [5, 10, 1],
			incompatible: ["trimpCritChanceDown"],
			chance: 1.25
		},
		trimpCritChanceDown: {
            description: function (str) {
                return "Your Trimps have -" + prettify(this.getMult(str) * 100) + "% Crit Chance.";
            },
            getMult: function (str) {
                return str / 10;
            },
            getWeight: function (str) {
				return (str  / 4.5);
            },
			minMaxStep: [2, 7, 1],
			incompatible: ["trimpCritChanceUp"],
            chance: 0.75
		},
        bogged: {
            description: function (str) {
                return "Your Trimps lose " + prettify(this.getMult(str) * 100) + "% of their max health after each attack.";
            },
            getMult: function (str) {
                return 0.01 * str;
            },
            getWeight: function (str) {
                var count = Math.ceil(1 / this.getMult(str));
                return (6 - ((0.2 * (count > 60 ? 60 : count) / 2)) + ((((500 * count + 400) / count) / 500)-1)) / 1.5;
			},
			incompatible: ["rampage", "weakness"],
            minMaxStep: [1, 5, 1],
            chance: 0.3
        },
		dysfunctional: {
            description: function (str) {
                return "Your Trimps breed " + prettify(100 - (this.getMult(str) * 100)) + "% slower";
            },
            getMult: function (str) {
                return 1 - (str * 0.05);
            },
            getWeight: function (str){
                return ((1 / this.getMult(str))-1)/6;
            },
            minMaxStep: [10, 18, 1],
            chance: 1
        },
		oddTrimpNerf: {
            description: function (str) {
                return "Trimps have " + prettify(100 - (this.getMult(str) * 100)) + "% less attack on odd numbered Zones";
            },
            getMult: function (str) {
                return 1 - (str * 0.02);
            },
            getWeight: function (str){
                return (1 / this.getMult(str) - 1) / 1.5;
            },
            minMaxStep: [15, 40, 1],
            chance: 1
        },
        evenTrimpBuff: {
            description: function (str) {
                return "Trimps have " + prettify((this.getMult(str) * 100) - 100) + "% more attack on even numbered Zones";
            },
            getMult: function (str) {
                return 1 + (str * 0.2);
            },
            getWeight: function (str){
                return (this.getMult(str) - 1) * -1;
            },
            minMaxStep: [1, 10, 1],
            chance: 1
        },
		karma: {
			description: function (str) {
				return 'Gain a stack after killing an enemy, increasing all non ' + heliumOrRadon(false, true) + ' loot by ' + prettify((this.getMult(str, 1) * 100) - 100) + '%. Stacks cap at ' + this.getMaxStacks(str) + ', and reset after clearing a Zone.';
			},
			stackDesc: function (str, stacks){
				return "Your Trimps are finding " + prettify((this.getMult(str, stacks) * 100) - 100) + "% more loot!";
			},
			getMaxStacks: function (str) {
				return Math.floor((str % 9) * 25) + 300;
			},
			getMult: function (str, stacks) {
				var realStrength = Math.ceil(str / 9);
				return 1 + (0.0015 * realStrength * stacks);
			},
			getWeight: function (str){
				return (this.getMult(str, this.getMaxStacks(str)) - 1) / -2;
			},
			icon: "*arrow-up",
			minMaxStep: [1, 45, 1],
			chance: 1
		},
		toxic: {
			description: function (str) {
				return "Gain a stack after killing an enemy, reducing breed speed by " + prettify(100 - (this.getMult(str, 1) * 100)) + '% (compounding). Stacks cap at ' + this.getMaxStacks(str) + ', and reset after clearing a Zone.';
			},
			stackDesc: function (str, stacks){
				return "Your Trimps are breeding " + prettify(100 - (this.getMult(str, stacks) * 100)) + "% slower.";
			},
			getMaxStacks: function (str) {
				return Math.floor((str % 9) * 25) + 300;
			},
			getMult: function (str, stacks) {
				var realStrength = Math.ceil(str / 9);
				return Math.pow((1 - 0.001 * realStrength), stacks);
			},
			getWeight: function (str){
				return (1 / this.getMult(str, this.getMaxStacks(str)) - 1) / 6;
			},
			icon: "*radioactive",
			minMaxStep: [1, 45, 1],
			chance: 1
		},
		bloodthirst: {
			description: function (str) {
				return "Enemies gain a stack of Bloodthirst whenever Trimps die. Every " + this.getFreq(str) + " stacks, enemies will heal to full and gain an additive 50% attack. Stacks cap at " + this.getMaxStacks(str) + " and reset after killing an enemy.";
			},
			stackDesc: function (str, stacks) {
				var freq = this.getFreq(str);
				var max = this.getMaxStacks(str);
				var text = "This Bad Guy";
				if (stacks < max) {
					var next = (freq - (stacks % freq));
					text += " will heal to full and gain attack in " + next + " stack" + ((next == 1) ? "" : "s") + ", " + ((stacks >= freq) ? "" : " and") + " gains 1 stack whenever Trimps die";
				}
				if (stacks >= freq){
					if (stacks < max) text += ", and";
					text += " currently has " + prettify((this.getMult(str, stacks) * 100) - 100) + "% more attack";
				}
				text += ".";
				return text;
			},
			getMaxStacks: function (str) {
				return (this.getFreq(str) * (2 + Math.floor(str / 2)));
			},
			getFreq: function(str){
				return 10 - str;
			},
			getMult: function (str, stacks){
				var count = Math.floor(stacks / this.getFreq(str));
				return 1 + (0.5 * count);
			},
			getWeight: function (str) {
				return 0.5 + (0.25 * Math.floor(str / 2));
			},
			minMaxStep: [1, 7, 1],
			chance: 1,
			icon: "*flask",
			iconOnEnemy: true
		},
		explosive: {
			description: function (str) {
				var text = "Enemies instantly deal " + prettify(this.getMult(str) * 100) + "% of their attack damage when killed";
				if (str > 15) {
					text += " unless your block is as high as your maximum health";
				}
				text += ".";
				return text;
			},
			getMult: function (str) {
				return str;
			},
			getWeight: function (str) {
				var mult = this.getMult(str);
				if (str <= 15){
					return (3/20 * mult) + (1/4);
				}
				else {
					return (1/14 * mult) - (1/7);
				}
			},
			get minMaxStep(){
				if (portalUniverse == 1) return [5, 30, 1];
				return [5, 10, 1];
			},
			chance: 1
		},
		slippery: {
			description: function (str) {
				return "Enemies have a " + prettify(this.getMult(str) * 100) + "% chance to dodge your attacks on " + ((str <= 15) ? "odd" : "even") + " Zones.";
			},
			getMult: function (str){
				if (str > 15) str -= 15;
				return 0.02 * str;
			},
			getWeight: function (str) {
				return (1 / (1 - this.getMult(str)) - 1) * 10 / 1.5;
			},
			minMaxStep: [1, 30, 1],
			chance: 1
		},
		rampage: {
			description: function (str) {
				return "Gain a stack after killing an enemy, increasing Trimp attack by " + prettify((this.getMult(str, 1) * 100) - 100) + '% (additive). Stacks cap at ' + this.getMaxStacks(str) + ', and reset when your Trimps die.';
			},
			stackDesc: function (str, stacks){
				return "Your Trimps are dealing " + prettify((this.getMult(str, stacks) * 100) - 100) + "% more damage.";
			},
			getMaxStacks: function (str) {
				return Math.floor((str % 10 + 1) * 10);
			},
			getMult: function (str, stacks) {
				var realStrength = Math.ceil(str / 10);
				return 1 + (0.01 * realStrength * stacks);
			},
			getWeight: function (str){
				return (1 - this.getMult(str, 1)) * this.getMaxStacks(str);
			},
			icon: "*fire",
			incompatible: ["plague", "bogged"],
			minMaxStep: [1, 40, 1],
			chance: 1
		},
		mutimps: {
			description: function (str) {
				var size = str % 5;
				if (size == 0) size = "";
				else size = "the first " + prettify(size * 2) + " rows of";

				var name = (str < 4) ? "Mutimps" : "Hulking Mutimps";
				return "40% of Bad Guys in " + size + " the World will be mutated into " + name + ".";
			},
			getWeight: function (str) {
				return (str / 10) * 1.5;
			},
			getMaxCellNum: function (str) {
				if (str > 5) str -= 5;
				str--;
				var values = [19, 39, 59, 79, 99];
				return values[str];
			},
			minMaxStep: [1, 10, 1],
			chance: 1
		},
		empower: {
			description: function (str) {
				var s = (str == 1) ? "" : "s";
				return "All enemies gain " + str + " stack" + s + " of Empower whenever your Trimps die in the World. Empower increases the attack and health of Bad Guys in the World by 0.2% per stack, can stack to 9999, and never resets.";
			},
			getWeight: function (str) {
				return (str / 6) * 2;
			},
			stackDesc: function (str, stacks){
				return "This Bad Guy is Empowered and has " + prettify((this.getMult(str, stacks) * 100) - 100) + "% more health and attack.";
			},
			stacksToAdd: function (str){
				return str;
			},
			getMult: function (str, stacks){
				return 1 + (0.002 * stacks);
			},
			getMaxStacks: function (str) {
				return 9999;
			},
			worldStacksOnly: true,
			iconOnEnemy: true,
			icon: "baby-formula",
			minMaxStep: [1, 10, 1],
			chance: 1
		},
		pressure: {
			description: function (str) {
				return "Trimps gain a stack of Pressure every " + Math.round(this.timePerStack(str)) + " seconds. Each stack of pressure reduces Trimp health by 1%. Max of " + Math.round(this.getMaxStacks(str)) + " stacks, stacks reset after clearing a Zone.";
			},
			getWeight: function(str){
				var time = (105 - this.timePerStack(str));
				var stacks = this.getMaxStacks(str);
				return (((time * 1.3) + stacks) / 200);
			},
			getMult: function(str, stacks){
				return Math.pow(0.99, stacks);
			},
			addSecond: function(){
				var modifier = game.global.dailyChallenge.pressure;
				modifier.timer = (modifier.timer) ? modifier.timer + 1 : 1;
				if (modifier.timer >= 60){
					this.addStack();
					modifier.timer = 0;
				}
				updateDailyStacks('pressure');
			},
			addStack: function() {
				var global = game.global;
				var challenge = global.dailyChallenge.pressure;
				if (this.getMaxStacks(challenge.strength) <= challenge.stacks) {
					return;
				}
				challenge.stacks++;
				if (global.fighting){
					global.soldierHealthMax *= 0.99;
					if (global.soldierHealthMax < global.soldierHealth)
						global.soldierHealth = global.soldierHealthMax;
					if (global.soldierHealth < 0)
						global.soldierHealth = 0;
				}
			},
			timePerStack: function(str){
				var thisStr = Math.ceil(str / 4) - 1;
				return (45 + (thisStr * 5));
			},
			resetTimer: function(){
				var modifier = game.global.dailyChallenge.pressure;
				modifier.timer = 0;
				modifier.stacks = 0;
				updateDailyStacks('pressure');
			},
			stackDesc: function(str, stacks){
				return "Your Trimps are under a lot of pressure. Maximum health is reduced by " + prettify((1 - this.getMult(str, stacks)) * 100) + "%.";
			},
			getMaxStacks: function(str){
				var thisStr = Math.floor(str % 4);
				return (45 + (thisStr * 5));
			},
			icon: "*heart3",
			minMaxStep: [1, 16, 1],
			chance: 1
		},
		mirrored: {
			description: function (str) {
				var reflectChance = this.getReflectChance(str);
				return "Enemies have a" + (reflectChance.toString()[0] == '8' ? 'n' : '') + " " + prettify(reflectChance) + "% chance to reflect an attack, dealing " + prettify(this.getMult(str) * 100) + "% of damage taken back to your Trimps (will not reflect damage done above the Enemy's max health).";
			},
			getReflectChance: function(str){
				return (Math.ceil(str / 10)) * 10;
			},
			getMult: function(str){
				return ((str % 10) + 1) / 10;
			},
			getWeight: function(str){
				return ((((this.getReflectChance(str) + 90) / 100) * 0.85) * ((this.getMult(str) + 0.9) * 0.85));
			},
			testWeights: function(){
				var min = 0;
				var max = 0;
				for (var x = this.minMaxStep[0]; x <= this.minMaxStep[1]; x += this.minMaxStep[2]){
					var result = this.getWeight(x);
					if (min == 0)
						min = result;
					else if (result < min)
						min = result;
					if (result > max)
						max = result;
				}
				return "Min: " + min + ", Max: " + max;
			},
			reflectDamage: function(str, attack){
				if (Math.floor(Math.random() * 100) >= this.getReflectChance(str))
					return 0;
				return this.getMult(str) * attack;
			},
			minMaxStep: [1, 100, 1],
			chance: 1,
			blockU2: true
		},
		heirlost: {
			description: function (str) {
				return "Heirloom combat and resource bonuses are reduced by " + str + "%.";
			},
			getWeight: function(str){
				return ((str / 10) + 0.5)
			},
			getMult: function(str){
				return ((100 - str) / 100);
			},
			minMaxStep: [5, 20, 1],
			chance: 1,
			blockU1: true
		},
		metallicThumb: {
			description: function (str) {
				return "Equipment is " + prettify((1 - this.getMult(str)) * 100) + "% cheaper.";
			},
			getWeight: function (str) {
				return ((str + 3) / 26);
			},
			getMult: function(str){
				return 1 - (str/100 * 5);
			},
			minMaxStep: [1, 10, 1],
			chance: 1
		},
		empoweredVoid: {
			description: function (str){
				return "Enemies in Void Maps have +" + prettify((this.getMult(str) - 1) * 100) + "% increased Attack and Health";
			},
			getWeight: function (str){
				return ((str / 10) + 0.5);
			},
			getMult: function(str){
				return (1 + (str / 10));
			},
			minMaxStep: [10, 25, 1],
			chance: 1,
			blockU1: true
		},
		hemmorrhage: { //This mod can no longer roll
			description: function (str){
				var res = this.getResources(str);
				var text = "Every 30 seconds, your stored ";
				for (var x = 1; x < res.length; x++){
					if (x == 2){
						if (res.length == 3) text += " and ";
						else text += ", ";
					}
					else if (x == 3){
						text += ", and ";
					}
					text += res[x].charAt(0).toUpperCase() + res[x].slice(1);
				}
				text += " is reduced by " + prettify(res[0]) + "%";
				return text;
			},
			getResources: function(str){
				str = str + "";
				var strength = (str.length >= 4) ? parseInt(str[3], 0) : 0;
				strength = 25 + (strength * 5);
				var res = [strength];
				if (parseInt(str[0], 10) < 7) res.push('food');
				if (str.length < 2) {
					if (res.length < 2) res.push('food');
					return res;
				}
				if (parseInt(str[1], 10) < 7) res.push('wood');
				if (str.length < 3) {
					if (res.length < 2) res.push('wood');
					return res;
				}
				if (parseInt(str[2], 10) < 7) res.push('metal');
				if (res.length < 2) res.push('metal');
				return res;
			},
			getWeight: function(str){
				var res = this.getResources(str);
				var base = (0.3 * res.length) * (1 + (res[0] / 50));
				return base;
			},
			reduceTimer: function(str){
				game.global.hemmTimer--;
				if (game.global.hemmTimer <= 0){
					this.takeStuff();
					game.global.hemmTimer = 300;
				}
			},
			takeStuff: function(){
				var res = this.getResources(game.global.dailyChallenge.hemmorrhage.strength);
				var mult = 1 - (res[0] / 100);
				for (var x = 1; x < res.length; x++){
					game.resources[res[x]].owned *= mult;
				}
			},
			blockU1: true,
			blockU2: true,
			minMaxStep: [0,9999,1],
			chance: 0
		},
/* 		disarmed: {
			equipmentList: ["Boots", "Mace", "Helmet", "Polearm", "Pants", "Battleaxe", "Shoulderguards", "Greatsword", "Breastplate", "Arbalest", "Gambeson"],
			description: function (str) {
				return "You can't use something"
			},
			getBannedEquipment(str, checkOne){
				if (checkOne) return (this.equipmentList.indexOf(checkOne) < str);
			},
			minMaxStep: [1, 11, 1],
			chance: 1
		} */
	};

function getCurrentDailyDescription(){
	var daily = game.global.dailyChallenge;
	if (!daily) return "";
	var returnText = "<ul style='text-align: left'>";
	for (var item in daily){
		if (item == 'seed') continue;
		returnText += "<li>" + dailyModifiers[item].description(daily[item].strength) + "</li>";
	}
	var portalUni = (game.global.viewingUpgrades) ? game.global.universe : portalUniverse;
	returnText += "</ul>Challenge has no end point, and grants an <u><b>additional "  + prettify(getDailyHeliumValue(countDailyWeight())) + "%</b></u> of all " + getDailyRewardText(portalUni) + " earned before finishing.";
	return returnText;
}

function testAllWeights(){
	for (var item in dailyModifiers){
		console.log(item, dailyModifiers[item].getWeight(dailyModifiers[item].minMaxStep[0]), dailyModifiers[item].getWeight(dailyModifiers[item].minMaxStep[1]));
	}
}

function startDaily(){
	for (var item in game.global.dailyChallenge){
		if (item == "seed") continue;
		if (typeof dailyModifiers[item].start !== 'undefined') dailyModifiers[item].start(game.global.dailyChallenge[item].strength, game.global.dailyChallenge[item].stacks);
	}
	game.global.recentDailies.push(game.global.dailyChallenge.seed);
	if (game.global.recentDailies.length == 7) giveSingleAchieve("Now What");
	handleFinishDailyBtn();
	dailyReduceEnlightenmentCost();
}

function countDailyWeight(dailyObj){
	var weight = 0;
	if (!dailyObj) dailyObj = game.global.dailyChallenge;
	for (var item in dailyObj){
		if (item == "seed") continue;
		weight += dailyModifiers[item].getWeight(dailyObj[item].strength);
	}
	return weight;
}

function getDailyHeliumValue(weight, portalUni){
	//min 2, max 6
	var value = 75 * weight + 20;
	if (value < 100) value = 100;
	else if (value > 500) value = 500;
	var hasPetBonus = false;
	if (!portalUni) hasPetBonus = Fluffy.isRewardActive("dailies");
	//Big thanks to Dr Nye for the below code!
	else if(portalUni == 2){
	    var scruffXP = game.global.fluffyExp2 / 1000;
	    var scruffLvl = Math.log(scruffXP) / Math.log(4);
	    if(game.talents.fluffyAbility.purchased){scruffLvl++}
	    if(scruffLvl >= 8){hasPetBonus = true;}
	}
	else if (portalUni == 1)
	{
	    var fluffyPrestigeCount = game.global.fluffyPrestige;
        var fluffXP = game.global.fluffyExp / (1000 * Math.pow(5, fluffyPrestigeCount));
        var fluffLvl = Math.log(fluffXP) / Math.log(4);
        if(game.talents.fluffyAbility.purchased){fluffLvl++}
        var fluffLvl = fluffLvl + fluffyPrestigeCount;
        if(fluffLvl >= 11){hasPetBonus = true;}
	}

	if (hasPetBonus) value += 100;
	return value;
}

function handleFinishDailyBtn(forceHide){
	var display = (game.global.challengeActive == "Daily" && !game.global.mapsActive && !game.global.preMapsActive && !forceHide) ? "block" : "none";
	document.getElementById('finishDailyBtnContainer').style.display = display;
}

//Use abandonChallenge(), not abandonDaily(). abandonChallenge will already call this function, and will also clean up other challenge things.
function abandonDaily(){
	if (Object.keys(game.global.dailyChallenge).length === 0) return;
	for (var item in game.global.dailyChallenge){
		if (item == "seed") continue;
		if (typeof dailyModifiers[item].abandon !== 'undefined') dailyModifiers[item].abandon(game.global.dailyChallenge[item].strength, game.global.dailyChallenge[item].stacks);
		if (typeof dailyModifiers[item].icon !== 'undefined'){
			var stackElem = document.getElementById(item + 'DailyStacks');
			if (stackElem != null) stackElem.style.display = 'none';
		}
	}
	var reward = game.challenges.Daily.getCurrentReward();
	if (!isNumberBad(reward)){
		addHelium(reward);
		game.global.dailyHelium += reward;
		if (game.global.universe == 1)	game.stats.dailyBonusHelium.value += reward;
		else if (game.global.universe == 2) game.stats.dailyBonusRadon.value += reward;
		checkAchieve('dailyHelium');
	}
	else console.log('attempted to give ' + reward + ' as daily challenge reward.');
	message("You have completed the Daily challenge! You have been rewarded with " + prettify(reward) + " extra " + heliumOrRadon() + "!", "Notices");
	game.global.dailyChallenge = {};
	handleFinishDailyBtn(true);
	return reward;
}

function checkCompleteDailies(){
	var currentCompleteObj = game.global.recentDailies;
	var newCompleteObj = [];
	for (var x = 0; x > -7; x--){
		var timeString = getDailyTimeString(x);
		if (currentCompleteObj.indexOf(timeString) != -1)
			newCompleteObj.push(timeString);
	}
	game.global.recentDailies = newCompleteObj;
}

function updateDailyStacks(what){
	var elem = document.getElementById(what + "DailyStacks");
	if (game.global.dailyChallenge[what].stacks == 0 || (dailyModifiers[what].worldStacksOnly && game.global.mapsActive)){
		if (elem == null) return;
		else elem.style.display = "none";
		return;
	}
	if (elem == null){
		var icon = (dailyModifiers[what].icon.charAt(0) == "*") ? "icomoon icon-" + dailyModifiers[what].icon.substr(1) : "glyphicon glyphicon-" + dailyModifiers[what].icon;
		var html = makeIconEffectHTML(what, false, icon, "antiBadge", [what + 'DailyStacks', what + 'DailyStacksCount'], game.global.dailyChallenge[what].stacks, "dailyStack")
		var target = (dailyModifiers[what].iconOnEnemy) ? document.getElementById('badDebuffSpan') : document.getElementById('debuffSpan');
		target.insertAdjacentHTML("beforeend", html)
		return;
	}
	else {
		let stackElem = document.getElementById(what + "DailyStacksCount")
		if (stackElem.innerHTML != game.global.dailyChallenge[what].stacks) stackElem.innerHTML = game.global.dailyChallenge[what].stacks;
	}
	elem.style.display = "inline-block";
}

function updateDailyClock(justTime){
	var elem = document.getElementById('dailyResetTimer');
	if (elem == null && !justTime) return;
	var now = new Date();
	var secondsRemaining = 59 - now.getUTCSeconds();
	var minutesRemaining = 59 - now.getUTCMinutes();
	var hoursRemaining = 23 - now.getUTCHours();
	if (secondsRemaining <= 9) secondsRemaining = "0" + secondsRemaining;
	if (minutesRemaining <= 9) minutesRemaining = "0" + minutesRemaining;
	if (hoursRemaining <= 9) hoursRemaining = "0" + hoursRemaining;
	var timeRemaining = hoursRemaining + ":" + minutesRemaining + ":" + secondsRemaining;
	if (justTime) return timeRemaining;
	elem.innerHTML = timeRemaining;
}

function getDailyTimeString(add, makePretty, getDayOfWeek){
	var today = new Date();
	if (!add) add = 0;
	today.setUTCDate(today.getUTCDate() + add + lastAdd);
	if (getDayOfWeek) return today.getUTCDay();
	var year = today.getUTCFullYear();
	var month = today.getUTCMonth() + 1; //For some reason January is month 0? Why u do dis?
	if (month < 10) month = "0" + month;
	var day = today.getUTCDate();
	if (day < 10) day = "0" + day;
	if (makePretty) return year + "-" + month + "-" + day;
	var seedStr = String(year) + String(month) + String(day);
	seedStr = parseInt(seedStr, 10);
	return seedStr;
}

function dayOfWeek(number){
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return days[number];
}

function getDailyTopText(add){
	readingDaily = add;
	var returnText = "";
	returnText += "<ul class='row dailyTopRow' aria-label='Available Dailies' aria-live='off'>";
	var checkedDayDone = false;
	var todayOfWeek = getDailyTimeString(0, false, true);
	for (var x = 0; x < 7; x++){
		var dayIndex = (todayOfWeek * -1) + x;
		if (dayIndex > 0)
			dayIndex = (x - todayOfWeek) - 7;
		var dayDone = (game.global.recentDailies.indexOf(getDailyTimeString(dayIndex)) != -1);
		if (add == dayIndex) checkedDayDone = dayDone;
		returnText += "<div role='listitem' onmouseover='tooltip(\"Switch Daily\", null, event, " + dayIndex + ")' onmouseout='cancelTooltip()' onclick='getDailyChallenge(" + dayIndex + ")' class='col-xs-1 seventhColumn noselect lowPad pointer dailyTop ";
		if (add == dayIndex)
			returnText += 'colorInfo';
		else if (dayDone)
			returnText += 'colorGrey';
		else
			returnText += 'colorSuccess';
		let dayText = dayOfWeek(getDailyTimeString(dayIndex, false, true))
		dayText = (usingScreenReader ? dayText : dayText.charAt(0))
		returnText += "'>" + dayText;
		if (!dayDone){
			var heliumValue = getDailyHeliumValue(countDailyWeight(getDailyChallenge(dayIndex, true)));
			returnText += "<br/>" + prettify(heliumValue) + "%";
		}
		else returnText += "<br/>Done";
		returnText += "</div>";
	}
	returnText += "</ul>";
	//returnText += "<div style='text-align: left; padding: 10px;'><span class='btn btn-md btn-primary' onclick='lastAdd += 7; selectChallenge(\"Daily\");'>Test Server Only - Travel To Next Week</span></div>"
	returnText += "<div class='row' style='margin: 0'><div class='col-xs-6 lowPad dailyTop' style='font-weight: bold'>" + dayOfWeek(getDailyTimeString(add, false, true)) + " " + getDailyTimeString(add, true) + "</div><div class='col-xs-6 dailyTop lowPad' aria-live='off'>" + dayOfWeek(getDailyTimeString(1, false, true)) + " resets in <span id='dailyResetTimer'>00:00:00</span></div></div>";

	if (checkedDayDone)
		returnText += "<b class='redText'>You have already attempted this Daily Challenge!</b><br/><br/>";
	return [returnText, !checkedDayDone];
}

var nextDaily = "";
var lastAdd = 0; //internal starting seed
var readingDaily = 0;
function getDailyChallenge(add, objectOnly, textOnly){
	checkCompleteDailies();
	var now = new Date().getTime();
	var dateSeed  = getDailyTimeString(add);
	var returnText = "";
	var portalUni = (game.global.viewingUpgrades) ? game.global.universe : portalUniverse;
	if (!objectOnly){
		returnText = getDailyTopText(add);
		if (!returnText[1]){
			//if (document.getElementById('specificChallengeDescription') != null) document.getElementById('specificChallengeDescription').innerHTML = returnText[0];
			document.getElementById('activatePortalBtn').style.display = 'none';
			//return returnText[0];
		}
		else document.getElementById('activatePortalBtn').style.display = 'inline-block';
		returnText = returnText[0];
		returnText += "<ul style='text-align: left'>";
	}
	var seedStr = getRandomIntSeeded(dateSeed + 2, 1, 1e9);
	//seedStr = getRandomIntSeeded(seedStr, 1, 1e9);
	var weightTarget = getRandomIntSeeded(seedStr++, 25, 51) / 10;
	//Build a list of all modifiers to choose from
	var modifierList = [];
	var totalChance = 0;
	var dailyObject = {};

	for (var item in dailyModifiers){
		if (portalUni == 1 && dailyModifiers[item].blockU1) continue;
		if (portalUni == 2 && dailyModifiers[item].blockU2) continue;
		modifierList.push(item);
		totalChance += dailyModifiers[item].chance;
	}
	var chanceMod = 1000 / totalChance;
	var currentWeight = 0;
	var maxLoops = modifierList.length;
	var sizeCount = [0,0,0];// < 0.3, < 1, >= 1
	var sizeTarget = [getRandomIntSeeded(seedStr++, 0, 2), getRandomIntSeeded(seedStr++, 1, 5), getRandomIntSeeded(seedStr++, 2, 6)]
	if (weightTarget < 2.75) {
		sizeTarget[2] = 0; sizeTarget[0] += 2;
	}
	mainLoop:
	for (var x = 0; x < maxLoops; x++){
		var maxZLoops = modifierList.length;
		var firstChoice = [];
		modLoop:
		for (var z = 0; z < maxZLoops; z++){
			var roll = getRandomIntSeeded(seedStr++, 0, 1000);
			var selectedIndex;
			var checkedTotal = 0;
			lookupLoop:
			for (var y = 0; y < modifierList.length; y++){
				checkedTotal += dailyModifiers[modifierList[y]].chance * chanceMod;
				if ((roll < checkedTotal) || y == modifierList.length - 1){
					totalChance -= dailyModifiers[modifierList[y]].chance;
					chanceMod = 1000 / totalChance;
					selectedIndex = y;
					break lookupLoop;
				}
			}
			var selectedMod = modifierList[selectedIndex];
			var modObj = dailyModifiers[selectedMod];
			var str = modObj.minMaxStep[0] + (getRandomIntSeeded(seedStr++, 0, Math.floor(((modObj.minMaxStep[1] + modObj.minMaxStep[2]) * (1 / modObj.minMaxStep[2]))) - modObj.minMaxStep[0]) * modObj.minMaxStep[2]);
			var modWeight = modObj.getWeight(str);
			var modSize = (modWeight < 0.85) ? 0 : ((modWeight < 1.85) ? 1 : 2);
			if ((modWeight + currentWeight > weightTarget + 1) ) continue;
			if (everythingInArrayGreaterEqual(sizeTarget, sizeCount)){
				//use it and stuff
			}
			else if (sizeCount[modSize] >= sizeTarget[modSize] && z != maxZLoops - 1){
				if (!firstChoice.length) firstChoice = [selectedMod, str, selectedIndex, modSize, modWeight];
				continue modLoop;
			}
			else if (z == maxZLoops - 1 && firstChoice.length){
				selectedMod = firstChoice[0];
				modObj = dailyModifiers[selectedMod];
				selectedIndex = firstChoice[2];
				str = firstChoice[1];
				modSize = firstChoice[3];
				modWeight = firstChoice[4];
			}

			//It's been officially selected by this point
			sizeCount[modSize]++;
			if (!objectOnly) returnText += "<li>" + modObj.description(str) + "</li>";
			dailyObject[modifierList[selectedIndex]] = {strength: str, stacks: 0};
			//console.log(selectedMod + "(strength: " + str + ", weight: " + modObj.getWeight(str) + "): " + modObj.description(str));
			currentWeight += modWeight;
			if (x > 0 && (currentWeight > weightTarget || (currentWeight >= weightTarget - 0.5 && currentWeight <= weightTarget + 0.5))){
				break mainLoop;
			}
			modifierList.splice(selectedIndex, 1);
			if (modObj.incompatible){
				for (var x = 0; x < modObj.incompatible.length; x++){
					var incompatibleIndex = modifierList.indexOf(modObj.incompatible[x]);
					if (incompatibleIndex >= 0){
						modifierList.splice(incompatibleIndex, 1);
					}
				}
			}
			break modLoop;
		}

	}
	dailyObject.seed = dateSeed;
	if (objectOnly) return dailyObject;
	if (countDailyWeight(dailyObject) != currentWeight) console.log('mismatch, objectCount = ' + countDailyWeight(dailyObject) + ", current = " + currentWeight);
	returnText += "</ul>Challenge has no end point, and grants an <u><b>additional "  + prettify(getDailyHeliumValue(currentWeight, portalUni)) + "%</b></u> of all ";
	returnText += getDailyRewardText(portalUni);
	returnText += " earned before finishing. <b>Can only be run once!</b> Reward does not count toward Bone Portals or affect best " + ((portalUni == 2) ? "Rn" : "He") + "/Hr stat.";
	if (textOnly) return returnText;
	nextDaily = returnText;
	if (document.getElementById('specificChallengeDescription') != null) document.getElementById('specificChallengeDescription').innerHTML = returnText;
	updateDailyClock();
/* 	console.log("");
	console.log("Attempted challenge with weight of " + weightTarget + ", built challenge with weight of " + currentWeight);
	console.log("Target max for small, medium, large mods were: ", sizeTarget[0], sizeTarget[1], sizeTarget[2]);
	console.log("Actually made for small, medium large: ", sizeCount[0], sizeCount[1], sizeCount[2]);
	console.log("");
	console.log("Took " + (new Date().getTime() - now) + "ms");
	console.log("");
	console.log(""); */
	return returnText;
}

function getDailyRewardText(portalUni){
	var returnText = "";
	if (portalUni == 2){
		returnText += "Radon, Nu from Heirlooms earned during the run,";
		if (game.global.highestRadonLevelCleared >= 200) returnText += " Mutated Seeds, and Scruffy Exp";
		else returnText += " and Scruffy Exp";
	}
	else {
		returnText += "Helium" + ((game.global.highestLevelCleared >= 179) ? ", " : ", and") + " Nu from Heirlooms earned during the run";
		if (game.global.highestLevelCleared >= 179) returnText += ((game.global.highestLevelCleared >= 235) ? ", " : ", and ") + "Dark Essence";
		if (game.global.highestLevelCleared >= 235) returnText += ((game.portal.Capable.locked == false) ? ", " : ", and ") + "Nature Tokens";
		if (game.portal.Capable.locked == false) returnText += ", and Fluffy Exp";
	} 
	return returnText;
}

var testLastAdd = 0;
function testDailySpread(){
	for (var x = 0; x < 7; x++){
		var testObj = getDailyChallenge(testLastAdd, true);
		for (var item in testObj){
			if (item == "plague" || item == "bogged") console.log(item, testLastAdd);
		}
		testLastAdd++;
	}
}

function everythingInArrayGreaterEqual(smaller, bigger){
	if (bigger.length < smaller.length) return false;
	for (var x = 0; x < smaller.length; x++){
		if (smaller[x] > bigger[x]) return false;
	}
	return true;
}

var fightLoops = 0;
var rewardingTimeoutHeirlooms = false;
var redCritCounter = 0;
function fight(makeUp) {
	fightLoops++;
	const currentMapObj = game.global.mapsActive ? getCurrentMapObject() : undefined;
	let cellNum;
	let cell;
	let cellElem;
	let isVoid = false;
	game.global.passive = false;

	if (game.global.mapsActive) {
		cellNum = game.global.lastClearedMapCell + 1;
		cell = game.global.mapGridArray[cellNum];
		cellElem = document.getElementById('mapCell' + cellNum);
		if (currentMapObj.location === 'Void') isVoid = true;
	} else {
		cellNum = game.global.lastClearedCell + 1;
		cell = game.global.gridArray[cellNum];
		cellElem = document.getElementById('cell' + cellNum);
	}

	if (game.global.soldierHealth <= 0) {
		if (isVoid) game.global.voidDeaths++;
		game.stats.trimpsKilled.value += game.resources.trimps.soldiers;
		game.stats.battlesLost.value++;
		if (challengeActive('Daily')) {
			if (typeof game.global.dailyChallenge.bloodthirst !== 'undefined') {
				game.global.dailyChallenge.bloodthirst.stacks++;
				const maxStacks = dailyModifiers.bloodthirst.getMaxStacks(game.global.dailyChallenge.bloodthirst.strength);
				if (game.global.dailyChallenge.bloodthirst.stacks > maxStacks) {
					game.global.dailyChallenge.bloodthirst.stacks = maxStacks;
				} else if (game.global.dailyChallenge.bloodthirst.stacks % dailyModifiers.bloodthirst.getFreq(game.global.dailyChallenge.bloodthirst.strength) === 0) {
					cell.health = cell.maxHealth;
				}
				updateDailyStacks('bloodthirst');
			}

			if (!game.global.passive && typeof game.global.dailyChallenge.empower !== 'undefined') {
				if (!game.global.mapsActive) {
					game.global.dailyChallenge.empower.stacks += dailyModifiers.empower.stacksToAdd(game.global.dailyChallenge.empower.strength);
					const maxStack = dailyModifiers.empower.getMaxStacks(game.global.dailyChallenge.empower.strength);
					if (game.global.dailyChallenge.empower.stacks >= maxStack) game.global.dailyChallenge.empower.stacks = maxStack;
				}
				updateDailyStacks('empower');
			}
		}

		let s = game.resources.trimps.soldiers > 1 ? 's ' : ' ';
		const randomText = game.trimpDeathTexts[Math.floor(Math.random() * game.trimpDeathTexts.length)];
		let msgText = `${prettify(game.resources.trimps.soldiers)} Trimp${s} just ${randomText}.`;
		if (usingScreenReader) msgText = `Cell ${cellNum}: ${msgText}`;
		message(msgText, 'Combat', null, null, 'trimp');
		if (game.global.spireActive && !game.global.mapsActive) deadInSpire();
		game.global.fighting = false;
		game.resources.trimps.soldiers = 0;

		if (challengeActive('Nom')) {
			cell.nomStacks = cell.nomStacks ? cell.nomStacks + 1 : 1;
			if (cell.nomStacks > 100) cell.nomStacks = 100;
			updateNomStacks(cell.nomStacks);
			if (cell.health > 0) cell.health += cell.maxHealth * 0.05;
			else cell.health = 0;
			if (cell.health > cell.maxHealth) cell.health = cell.maxHealth;
			updateBadBar(cell);
		}

		return;
	}

	if (cell.health <= 0 || !isFinite(cell.health)) {
		game.stats.battlesWon.value++;

		if (!game.global.mapsActive) {
			game.global.voidSeed++;
			game.global.scrySeed++;
		}

		if ((game.global.formation === 4 || game.global.formation === 5) && !game.global.mapsActive && !game.global.waitToScry) tryScry();
		if (game.jobs.Worshipper.owned > 0 && !game.global.mapsActive) tryWorship();
		if (challengeActive('Nom') && cell.nomStacks === 100) giveSingleAchieve('Great Host');
		if (challengeActive('Obliterated')) giveSingleAchieve('Obliterate');
		if (challengeActive('Eradicated')) giveSingleAchieve('Eradicate');
		if (game.global.usingShriek) disableShriek();
		if (game.global.universe === 2) u2Mutations.types.Rage.clearStacks();

		// Death message.
		const randomText = game.badGuyDeathTexts[Math.floor(Math.random() * game.badGuyDeathTexts.length)];
		let displayName = cell.name;
		if (typeof game.badGuys[cell.name].displayName !== 'undefined') displayName = game.badGuys[cell.name].displayName;
		let firstChar = displayName.charAt(0);
		const vowels = new Set(['A', 'E', 'I', 'O', 'U']);
		let aAn = vowels.has(firstChar) ? ' an ' : ' a ';
		let killedText = `You ${randomText}${aAn}${displayName}${challengeActive('Coordinate') ? ' group' : ''}!`;
		if (usingScreenReader) killedText = `Cell ${cellNum}: ${killedText}`;
		if (!game.global.spireActive || cellNum !== 99 || game.global.mapsActive) message(killedText, 'Combat', null, null, 'enemy');
		try {
			if (typeof kongregate !== 'undefined' && !game.global.mapsActive) kongregate.stats.submit('HighestLevel', game.global.world * 100 + cell.level);
		} catch (err) {
			console.debug(err);
		}
		if (usingRealTimeOffline) offlineProgress.lastEnemyKilled = offlineProgress.ticksProcessed;

		// Challenge shenanigans.
		if (challengeActive('Lead') && cell.name !== 'Liquimp') manageLeadStacks(!game.global.mapsActive);
		if ((challengeActive('Balance') || challengeActive('Unbalance')) && game.global.world >= 6) {
			const chal = challengeActive('Balance') ? game.challenges.Balance : game.challenges.Unbalance;
			if (game.global.mapsActive) chal.removeStack();
			else chal.addStack();
			updateBalanceStacks();
		}
		if (challengeActive('Smithless') && cell.ubersmith && !cell.failedUber) {
			game.challenges.Smithless.addStacks(3);
		}
		if (challengeActive('Daily')) {
			if (typeof game.global.dailyChallenge.karma !== 'undefined') {
				game.global.dailyChallenge.karma.stacks++;
				const maxStack = dailyModifiers.karma.getMaxStacks(game.global.dailyChallenge.karma.strength);
				if (game.global.dailyChallenge.karma.stacks >= maxStack) game.global.dailyChallenge.karma.stacks = maxStack;
				updateDailyStacks('karma');
			}
			if (typeof game.global.dailyChallenge.toxic !== 'undefined') {
				game.global.dailyChallenge.toxic.stacks++;
				const maxStack = dailyModifiers.toxic.getMaxStacks(game.global.dailyChallenge.toxic.strength);
				if (game.global.dailyChallenge.toxic.stacks >= maxStack) game.global.dailyChallenge.toxic.stacks = maxStack;
				updateDailyStacks('toxic');
			}
			if (typeof game.global.dailyChallenge.rampage !== 'undefined') {
				game.global.dailyChallenge.rampage.stacks++;
				const maxStack = dailyModifiers.rampage.getMaxStacks(game.global.dailyChallenge.rampage.strength);
				if (game.global.dailyChallenge.rampage.stacks >= maxStack) game.global.dailyChallenge.rampage.stacks = maxStack;
				updateDailyStacks('rampage');
			}
			if (typeof game.global.dailyChallenge.bloodthirst !== 'undefined') {
				game.global.dailyChallenge.bloodthirst.stacks = 0;
				updateDailyStacks('bloodthirst');
			}
		}
		if (challengeActive('Wither')) {
			game.challenges.Wither.addStacks();
		}
		// All inclusive challenge shenanigans.
		if (game.global.challengeActive && game.challenges[game.global.challengeActive].onEnemyKilled) game.challenges[game.global.challengeActive].onEnemyKilled();
		if (game.global.mapsActive && game.global.challengeActive && game.challenges[game.global.challengeActive].onMapEnemyKilled) game.challenges[game.global.challengeActive].onMapEnemyKilled(currentMapObj.level);
		// Html stuff.
		if (cell.overkilled && game.options.menu.overkillColor.enabled) {
			if (game.options.menu.overkillColor.enabled === 2) {
				const prevCellElem = document.getElementById((game.global.mapsActive ? 'mapCell' : 'cell') + (cellNum - 1));
				if (prevCellElem) swapClass('cellColor', 'cellColorOverkill', prevCellElem);
			}
			swapClass('cellColor', 'cellColorOverkill', cellElem);
		} else {
			swapClass('cellColor', 'cellColorBeaten', cellElem);
		}

		if (game.global.mapsActive) game.global.lastClearedMapCell = cellNum;
		else game.global.lastClearedCell = cellNum;

		game.global.fighting = false;
		document.getElementById('badGuyCol').style.visibility = 'hidden';
		// Loot!
		if (cell.empowerment) {
			rewardToken(cell.empowerment);
		}
		let unlock;
		if (game.global.mapsActive) {
			unlock = game.mapUnlocks[cell.special];
		} else {
			checkVoidMap();
			unlock = game.worldUnlocks[cell.special];
		}
		let noMessage = false;
		if (typeof unlock !== 'undefined' && typeof unlock.fire !== 'undefined') {
			if (!game.global.mapsActive || !game.mapUnlocks[cell.special].last || game.mapUnlocks[cell.special].last + 5 <= currentMapObj.level){
				unlock.fire(cell.level);
				if (game.global.mapsActive) {
					if (typeof game.mapUnlocks[cell.special].last !== 'undefined') {
						game.mapUnlocks[cell.special].last += 5;
						if (typeof game.upgrades[cell.special].prestige && getSLevel() >= 4 && !challengeActive('Mapology') && Math.ceil(game.mapUnlocks[cell.special].last / 5) % 2 === 1) {
							unlock.fire(cell.level);
							game.mapUnlocks[cell.special].last += 5;
							message(unlock.message.replace('a book', 'two books'), 'Unlocks', null, null, 'repeated', cell.text);
							noMessage = true;
						}
					}
					if (typeof game.mapUnlocks[cell.special].canRunOnce !== 'undefined') game.mapUnlocks[cell.special].canRunOnce = false;
					if (unlock.filterUpgrade) refreshMaps();
				}
			}
			else {
				message("Your Scientists have already read that book! Better look elsewhere for some new reading material.", "Notices")
			}
		} else if (cell.special !== '') {
			unlockEquipment(cell.special);
		}
		if (cell.mutation && typeof mutations[cell.mutation].reward !== 'undefined') mutations[cell.mutation].reward(cell.corrupted);
		let doNextVoid = false;
		if (typeof unlock !== 'undefined' && typeof unlock.message !== 'undefined' && !noMessage) message(unlock.message, 'Unlocks', null, null, unlock.world > 0 ? 'unique' : 'repeated', cell.text);
		if (typeof game.badGuys[cell.name].loot !== 'undefined') game.badGuys[cell.name].loot(cell.level);
		if (!game.global.mapsActive && game.global.spireActive && checkIfSpireWorld()) {
			giveSpireReward(cell.level);
		}
		if (cell.u2Mutation && cell.u2Mutation.length) u2Mutations.rewardMutation(cell);
		// Post loot.
		resetEmpowerStacks();

		// Map and World split here for non-loot stuff, anything for both goes above.
		// Map only.
		if (game.global.mapsActive && cellNum === game.global.mapGridArray.length - 1) {
			// ayy you beat a map.
			if (usingRealTimeOffline && offlineProgress.countThisMap) {
				offlineProgress.mapsAllowed--;
				offlineProgress.countThisMap = false;
			}
			game.stats.mapsCleared.value++;
			checkAchieve('totalMaps');
			alchObj.mapCleared(currentMapObj);
			let shouldRepeat = game.global.repeatMap;
			let nextBw = false;
			let mazBw = -1;
			game.global.mapRunCounter++;
			if (game.options.menu.repeatUntil.enabled === 0 && game.global.mapCounterGoal > 0) toggleSetting('repeatUntil', null, false, true);
			if (game.global.challengeActive && game.challenges[game.global.challengeActive].clearedMap) game.challenges[game.global.challengeActive].clearedMap(currentMapObj.level);
			let mapBonusEarned = 0;
			if (currentMapObj.level >= game.global.world - getPerkLevel('Siphonology') && game.global.mapBonus < 10) mapBonusEarned = 1;
			game.global.mapBonus += mapBonusEarned;
			if (challengeActive('Quest') && game.challenges.Quest.questId === 2) {
				game.challenges.Quest.questProgress += mapBonusEarned;
				game.challenges.Quest.checkQuest();
			}
			const mapBonusReached = game.global.mapBonus === 10;
			const allItemsEarned = addSpecials(true, true, currentMapObj) === 0;

			if (currentMapObj.name.search('Bionic Wonderland') > -1 && allItemsEarned && game.options.menu.climbBw.enabled === 1 && game.global.repeatMap) {
				if (game.global.mazBw > 0 && game.global.mazBw <= currentMapObj.level) {
					nextBw = false;
				} else {
					nextBw = getNextBwId();
					mazBw = game.global.mazBw;
				}
			}

			if (game.options.menu.repeatUntil.enabled === 0 && game.global.mapCounterGoal > 0 && game.global.mapRunCounter >= game.global.mapCounterGoal) shouldRepeat = false;
			else if (game.options.menu.repeatUntil.enabled === 1 && mapBonusReached) shouldRepeat = false;
			else if (game.options.menu.repeatUntil.enabled === 2 && allItemsEarned) shouldRepeat = false;
			else if (game.options.menu.repeatUntil.enabled === 3 && allItemsEarned && (mapBonusReached || mapBonusEarned === 0)) shouldRepeat = false;

			if (currentMapObj.bonus && mapSpecialModifierConfig[currentMapObj.bonus].onCompletion) {
				mapSpecialModifierConfig[currentMapObj.bonus].onCompletion();
			}

			let skip = false;
			if (isVoid) {
				if (currentMapObj.stacked > 0) {
					let timeout = 750;
					if (currentMapObj.stacked > 3) timeout = 300;
					if (currentMapObj.stacked > 6) timeout = 100;
					if (usingRealTimeOffline || !game.options.menu.voidPopups.enabled) timeout = 10;
					rewardingTimeoutHeirlooms = true;

					for (let x = 0; x < currentMapObj.stacked; x++) {
						setTimeout(
							(function (z) {
								return function () {
									if (rewardingTimeoutHeirlooms) createHeirloom(z);
								};
							})(game.global.world),
							timeout * (x + 1)
						);
					}

					game.badGuys.Cthulimp.loot(99, true, currentMapObj.stacked);
				}
				currentMapObj.noRecycle = false;
				recycleMap(-1, true, true);
				if (game.options.menu.repeatVoids.enabled === 1) {
					if (game.global.totalVoidMaps > 0) doNextVoid = getNextVoidId();
				}
				skip = true;
			}
			if (!game.global.runningChallengeSquared && game.global.challengeActive && game.challenges[game.global.challengeActive].completeAfterMap) {
				const challenge = game.challenges[game.global.challengeActive];
				if (currentMapObj.name === challenge.completeAfterMap && typeof challenge.onComplete !== 'undefined') {
					challenge.onComplete();
				}
			}
			if (challengeActive('Insanity')) {
				game.challenges.Insanity.completeMap(currentMapObj.level);
			}
			if (currentMapObj.location !== 'Frozen' && !nextBw && shouldRepeat && !game.global.switchToMaps && !skip && (!challengeActive('Mapology') || game.challenges.Mapology.credits >= 1)) {
				if (game.global.mapBonus > 0) {
					let innerText = game.global.mapBonus;
					if (game.talents.mapBattery.purchased && game.global.mapBonus === 10) innerText = "<span class='mapBonus10'>" + innerText + '</span>';
					const mapBtnElem = document.getElementById('mapsBtnText');
					const mapBtnText = `Maps (${innerText})`;
					if (mapBtnElem.innerHTML !== mapBtnText && !usingRealTimeOffline) mapBtnElem.innerHTML = mapBtnText;
				}
				game.global.lastClearedMapCell = -1;
				buildMapGrid(game.global.currentMapId);
				drawGrid(true);
				if (challengeActive('Mapology')) {
					game.challenges.Mapology.credits--;
					if (game.challenges.Mapology.credits <= 0) game.challenges.Mapology.credits = 0;
					updateMapCredits();
					messageMapCredits();
				}
				battle(true);
				return;
			} else {
				if (game.global.switchToMaps) {
					game.global.soldierHealth = 0;
					game.resources.trimps.soldiers = 0;
					updateGoodBar();
				}

				game.global.preMapsActive = game.options.menu.exitTo.enabled && !nextBw ? false : true;
				game.global.mapsActive = false;
				game.global.lastClearedMapCell = -1;
				game.global.currentMapId = '';
				game.global.mapGridArray = [];
				game.global.fighting = false;
				game.global.switchToMaps = false;
				game.global.mapExtraBonus = '';
				mapsSwitch(true);

				if (nextBw) {
					game.global.lookingAtMap = nextBw;
					runMap();
					game.global.mazBw = mazBw;
				} else if (doNextVoid) {
					game.global.lookingAtMap = doNextVoid;
					runMap();
				} else if (isVoid && game.global.preMapsActive && game.global.totalVoidMaps > 0) {
					toggleVoidMaps();
				} else if (currentMapObj.location === 'Frozen') {
					document.getElementById('mapsHere').removeChild(document.getElementById(currentMapObj.id));
					game.global.mapsOwnedArray.splice(getMapIndex(currentMapObj.id), 1);
					game.global.lookingAtMap = '';
					mapsSwitch(true);
				} else {
					checkMapAtZoneWorld(true);
				}

				return;
			}
		}
		if (!game.global.mapsActive && cellNum === 99) { // World only.
			nextWorld();
		}
		let startMaZ = false;
		if (!game.global.mapsActive) startMaZ = checkMapAtZoneWorld(true);
		if (!startMaZ && game.global.soldierHealth > 0) battle(true);
		return;
	}

	const empowerment = getEmpowerment();
	const empowermentUber = getUberEmpowerment();

	let cellAttack = calculateDamage(cell.attack, false, false, false, cell);
	const badAttackElem = document.getElementById('badGuyAttack');
	const badAttackText = calculateDamage(cell.attack, true, false, false, cell);
	if (badAttackElem.innerHTML != badAttackText && !usingRealTimeOffline) badAttackElem.innerHTML = badAttackText;
	let badCrit = false;

	if (challengeActive('Crushed')) {
		if (checkCrushedCrit()) {
			cellAttack *= 5;
			badCrit = true;
			if (game.global.world > 5) game.challenges.Crushed.critsTaken++;
		}
	}

	if (challengeActive('Duel')) {
		const critChance = game.challenges.Duel.trimpStacks;
		const roll = Math.floor(Math.random() * 100);
		if (roll < critChance) {
			cellAttack *= 10;
			badCrit = true;
		}
	}

	if (game.global.voidBuff === 'getCrit' || cell.corrupted === 'corruptCrit' || cell.corrupted === 'healthyCrit') {
		if (Math.floor(Math.random() * 4) === 0) {
			cellAttack *= cell.corrupted === 'healthyCrit' ? 7 : 5;
			badCrit = true;
		}
	}

	if (challengeActive('Daily')) {
		if (typeof game.global.dailyChallenge.crits !== 'undefined') {
			if (Math.floor(Math.random() * 4) === 0) {
				cellAttack *= dailyModifiers.crits.getMult(game.global.dailyChallenge.crits.strength);
				badCrit = true;
			}
		}
	}

	let attackAndBlock = cellAttack - game.global.soldierCurrentBlock;
	let pierce = 0;

	if (game.global.brokenPlanet && !game.global.mapsActive) {
		pierce = getPierceAmt();
		const atkPierce = pierce * cellAttack;
		if (attackAndBlock < atkPierce) attackAndBlock = atkPierce;
	}

	if (attackAndBlock < 0) attackAndBlock = 0;
	if (getPerkLevel('Frenzy') > 0) game.portal.Frenzy.beforeAttack();

	let trimpAttack = calculateDamage(game.global.soldierCurrentAttack, false, true);
	const goodAttackElem = document.getElementById('goodGuyAttack');
	const goodAttackText = calculateDamage(game.global.soldierCurrentAttack, true, true);
	if (goodAttackElem.innerHTML != goodAttackText && !usingRealTimeOffline) goodAttackElem.innerHTML = goodAttackText;

	updateTitimp();
	let critTier = 0;
	let critChance = getPlayerCritChance();
	let doubleCritChance = getPlayerDoubleCritChance();

	if (critChance > 0) {
		critTier = Math.floor(critChance);
		critChance = critChance % 1;
		if (Math.random() < critChance) {
			critTier++;
		}

		if (doubleCritChance > 0 && Math.random() < doubleCritChance) {
			critTier++;
		}

		if (critTier > 0) {
			trimpAttack *= getPlayerCritDamageMult();
			if (critTier > 1) trimpAttack *= getMegaCritDamageMult(critTier);
		}
	}

	if (critChance < 0) {
		if (Math.random() < Math.abs(critChance)) {
			critTier = -1;
			trimpAttack *= 0.2;
		}
	}

	let attacked = false;
	let wasAttacked = false;
	let badDodge = false;

	if (cell.corrupted === 'corruptDodge') {
		if (Math.random() < 0.3) badDodge = true;
	}

	if (challengeActive('Daily') && typeof game.global.dailyChallenge.slippery !== 'undefined') {
		const slipStr = game.global.dailyChallenge.slippery.strength;
		if ((slipStr > 15 && game.global.world % 2 === 0) || (slipStr <= 15 && game.global.world % 2 === 1)) {
			if (Math.random() < dailyModifiers.slippery.getMult(slipStr)) badDodge = true;
		}
	}

	let overkill = 0;
	let plaguebringer = 0;
	let impOverkill = 0;
	const trimpsWereFull = game.global.soldierHealth === game.global.soldierHealthMax;
	const enemyWasFull = cell.health === cell.maxHealth;
	const getPlayerModifier = getPlaguebringerModifier();

	const thisKillsTheTrimp = function () {
		impOverkill -= game.global.soldierHealth;
		game.global.soldierHealth = 0;
		if (challengeActive('Mayhem')) {
			game.challenges.Mayhem.poison = 0;
			game.challenges.Mayhem.drawStacks();
		}
		if (challengeActive('Storm') && !game.global.mapsActive) {
			game.challenges.Storm.alpha = 0;
		}
	};

	const thisKillsTheBadGuy = function () {
		cell.health = 0;
	};

	// Angelic heal.
	const spireNo = Math.floor((game.global.world - (game.global.universe === 2 ? 200 : 100)) / 100);
	const spireClearedU1 = spireNo <= game.global.spiresCompleted;
	const spireClearedU2 = spireNo <= game.global.u2SpireCellsBest / 1000;
	const spireAngelic = game.universe === 2 ? spireClearedU2 : spireClearedU1; // Angelic works in U2 Spires. Unsure if intentional but Angelic tooltip says it should be disabled. Use this in the if statement below to fix.
	if (game.talents.angelic.purchased && !challengeActive('Berserk') && (!game.global.spireActive || game.global.mapsActive || Math.floor((game.global.world - 100) / 100) <= game.global.spiresCompleted)) {
		game.global.soldierHealth += game.global.soldierHealth / 2;
		if (game.global.soldierHealth > game.global.soldierHealthMax) game.global.soldierHealth = game.global.soldierHealthMax;
	}

	if (challengeActive('Wither')) {
		if (game.challenges.Wither.healImmunity <= 0 && !enemyWasFull) {
			const heal = Math.floor(cell.maxHealth / 4);
			cell.health += heal;
			if (cell.health >= cell.maxHealth) {
				game.global.soldierHealth = 0;
				game.challenges.Wither.witherTrimps();
				cell.health = cell.maxHealth;
			}
		}
	}

	if (game.global.world >= getObsidianStart() && !game.global.mapsActive) {
		game.global.soldierHealth = 0;
	}

	let forceSlow = false;
	let checkFast = challengeActive('Glass') || challengeActive('Slow') || ((((game.badGuys[cell.name].fast || cell.mutation === 'Corruption') && !challengeActive('Nom')) || game.global.voidBuff === 'doubleAttack') && !challengeActive('Coordinate'));
	if (game.global.soldierHealth <= 0) checkFast = false;
	if (checkFast && challengeActive('Exterminate') && game.challenges.Exterminate.experienced) checkFast = false;

	if (challengeActive('Duel')) {
		if (game.challenges.Duel.enemyStacks < 10) checkFast = true;
		else if (game.challenges.Duel.trimpStacks < 10 && !game.global.runningChallengeSquared) forceSlow = true;
	}
	if (challengeActive('Smithless') && cell.ubersmith && !cell.failedUber) checkFast = true;
	if (cell.u2Mutation && cell.u2Mutation.length) checkFast = true;

	if (trimpAttack > 0 && checkFast && !forceSlow) { // Fighting a fast enemy, Trimps attack last.
		reduceSoldierHealth(attackAndBlock, true);
		wasAttacked = true;
		if (game.global.soldierHealth > 0) {
			if (!badDodge) {
				if (empowerment === 'Poison') {
					cell.health -= game.empowerments.Poison.getDamage();
					stackPoison(trimpAttack);
				}

				if (trimpAttack >= cell.health) {
					overkill = trimpAttack - cell.health;
					if (cell.name === 'Improbability' && enemyWasFull) giveSingleAchieve('One-Hit Wonder');
					if (enemyWasFull && challengeActive('Unlucky') && game.global.mapsActive && currentMapObj.name === 'Dimension of Rage') {
						if (!game.challenges.Unlucky.lastHitLucky) giveSingleAchieve("Don't Need Luck");
					}
					if (!game.global.mapsActive && enemyWasFull && challengeActive('Quest') && game.challenges.Quest.questId === 3) game.challenges.Quest.questProgress++;
				} else if (getPlayerModifier > 0) {
					plaguebringer = trimpAttack * getPlayerModifier;
				}

				if (challengeActive('Glass') && trimpAttack < cell.health) game.challenges.Glass.notOneShot();
				cell.health -= trimpAttack;
				attacked = true;

				if ((game.global.voidBuff === 'doubleAttack' || cell.corrupted === 'corruptDbl' || cell.corrupted === 'healthyDbl') && cell.health > 0) {
					reduceSoldierHealth(cell.corrupted === 'healthyDbl' ? attackAndBlock * 1.5 : attackAndBlock, true);
					if (game.global.soldierHealth < 0) thisKillsTheTrimp();
				}
			}
		} else {
			thisKillsTheTrimp();
		}

		if (cell.health < 1 && game.global.formation === 5 && empowerment === 'Wind' && empowermentUber === 'Wind' && game.empowerments.Wind.currentDebuffPower < game.empowerments.Wind.stackMax()) {
			cell.health = 1;
		}

		if (cell.health <= 0) {
			thisKillsTheBadGuy();
		}
	} else {
		if (game.global.soldierHealth > 0) { // Fighting a slow enemy, Trimps attack first.
			if (!badDodge) {
				if (empowerment === 'Poison') {
					cell.health -= game.empowerments.Poison.getDamage();
					stackPoison(trimpAttack);
				}
				if (trimpAttack >= cell.health) {
					overkill = trimpAttack - cell.health;
					if (cell.name === 'Improbability' && enemyWasFull) giveSingleAchieve('One-Hit Wonder');
					if (enemyWasFull && challengeActive('Unlucky') && game.global.mapsActive && currentMapObj.name === 'Dimension of Rage') {
						if (!game.challenges.Unlucky.lastHitLucky) giveSingleAchieve("Don't Need Luck");
					}
					if (!game.global.mapsActive && enemyWasFull && challengeActive('Quest') && game.challenges.Quest.questId === 3) game.challenges.Quest.questProgress++;
				} else if (getPlayerModifier > 0) {
					plaguebringer = trimpAttack * getPlayerModifier;
				}
				cell.health -= trimpAttack;
				attacked = true;
			}

			if (cell.health < 1 && game.global.formation === 5 && empowerment === 'Wind' && empowermentUber === 'Wind' && game.empowerments.Wind.currentDebuffPower < game.empowerments.Wind.stackMax()) {
				cell.health = 1;
			}

			if (cell.health > 0) {
				reduceSoldierHealth(attackAndBlock, true);
				wasAttacked = true;
			} else {
				thisKillsTheBadGuy();
			}

			if (game.global.soldierHealth < 0) thisKillsTheTrimp();
		}
	}

	// After attack stuff.
	if (wasAttacked && !game.global.mapsActive && cellNum === 99 && game.global.challengeActive && game.challenges[game.global.challengeActive].onBossAttack) game.challenges[game.global.challengeActive].onBossAttack();

	if (challengeActive('Mayhem') && attacked) {
		game.global.soldierHealth -= game.challenges.Mayhem.poison;
		if (game.global.soldierHealth < 0) thisKillsTheTrimp();
	}

	if (game.global.soldierHealth > 0 && getHeirloomBonus('Shield', 'gammaBurst') > 0) {
		let burst = game.heirlooms.Shield.gammaBurst;
		burst.stacks++;
		let triggerStacks = autoBattle.oneTimers.Burstier.owned ? 4 : 5;
		if (Fluffy.isRewardActive('scruffBurst')) triggerStacks--;
		if (burst.stacks >= triggerStacks) {
			burst.stacks = triggerStacks;
			if (cell.health > 0) {
				let burstDamage = calcHeirloomBonus('Shield', 'gammaBurst', trimpAttack);
				if (challengeActive('Storm') && game.challenges.Storm.mutations > 0) burstDamage *= game.challenges.Storm.getGammaMult();
				cell.health -= burstDamage;
				burst.stacks = 0;
				if (cell.health > 0 && getPlayerModifier > 0) {
					plaguebringer += burstDamage * getPlayerModifier;
				}

				if (game.global.formation === 5 && empowerment === 'Wind' && empowermentUber === 'Wind' && cell.health < 1) {
					cell.health = 1;
				} else if (cell.health <= 0) {
					overkill = Math.abs(cell.health);
					thisKillsTheBadGuy();
				}

				if (empowerment === 'Poison') stackPoison(burstDamage);
			}
		}
		updateGammaStacks();
	}

	if (game.global.formation === 5 && empowerment === 'Wind' && empowermentUber === 'Wind') {
		overkill = 0;
		if (plaguebringer === 0) plaguebringer = 1;
	}

	if (cell.health / cell.maxHealth < 0.5 && empowerment === 'Ice' && empowermentUber === 'Ice' && game.empowerments.Ice.currentDebuffPower > 20) {
		cell.health = 0;
		thisKillsTheBadGuy();
		overkill = 'shatter';
	}

	if (challengeActive('Daily')) {
		if (typeof game.global.dailyChallenge.mirrored !== 'undefined' && attacked && game.global.soldierHealth > 0) {
			reduceSoldierHealth(dailyModifiers.mirrored.reflectDamage(game.global.dailyChallenge.mirrored.strength, Math.min(cell.maxHealth, trimpAttack)));
			if (game.global.soldierHealth <= 0) thisKillsTheTrimp();
		}
		if (typeof game.global.dailyChallenge.plague !== 'undefined') {
			if (attacked) {
				game.global.soldierHealth -= game.global.soldierHealthMax * dailyModifiers.plague.getMult(game.global.dailyChallenge.plague.strength, game.global.dailyChallenge.plague.stacks);
				if (game.global.soldierHealth < 0) thisKillsTheTrimp();
			}
			if (wasAttacked) {
				game.global.dailyChallenge.plague.stacks++;
				updateDailyStacks('plague');
			}
		}
		if (typeof game.global.dailyChallenge.bogged !== 'undefined') {
			if (attacked) {
				game.global.soldierHealth -= game.global.soldierHealthMax * dailyModifiers.bogged.getMult(game.global.dailyChallenge.bogged.strength);
				if (game.global.soldierHealth < 0) thisKillsTheTrimp();
			}
		}
		if (typeof game.global.dailyChallenge.weakness !== 'undefined') {
			if (wasAttacked) {
				game.global.dailyChallenge.weakness.stacks++;
				if (game.global.dailyChallenge.weakness.stacks >= 9) game.global.dailyChallenge.weakness.stacks = 9;
				updateDailyStacks('weakness');
			}
		}
	}

	if (game.global.universe === 1) {
		if ((challengeActive('Electricity') || challengeActive('Mapocalypse')) && attacked) {
			game.global.soldierHealth -= game.global.soldierHealthMax * (game.challenges.Electricity.stacks * 0.1);
			if (game.global.soldierHealth < 0) thisKillsTheTrimp();
			if (challengeActive('Electricity')) {
				game.challenges.Electricity.attacksInARow++;
				if (game.challenges.Electricity.attacksInARow >= 20) giveSingleAchieve('Grounded');
			}
		}

		if ((challengeActive('Electricity') || challengeActive('Mapocalypse')) && wasAttacked) {
			game.challenges.Electricity.stacks++;
			updateElectricityStacks();
		}

		if (challengeActive('Domination')) {
			let dominating = false;
			if (game.global.mapsActive && currentMapObj.size === cellNum + 1) dominating = true;
			else if (!game.global.mapsActive && cellNum === 99) dominating = true;

			if (cell.health > 0 && dominating) {
				if (cell.health / cell.maxHealth < 0.95) cell.health += cell.maxHealth * 0.05;
				if (cell.health > cell.maxHealth) cell.health = cell.maxHealth;
			}
		}

		if (challengeActive('Toxicity') && attacked) {
			let tox = game.challenges.Toxicity;
			tox.stacks++;
			if (tox.stacks > tox.maxStacks) tox.stacks = tox.maxStacks;
			if (tox.stacks > tox.highestStacks) tox.highestStacks = tox.stacks;
			updateToxicityStacks();
		}

		if (!game.global.mapsActive && challengeActive('Life') && attacked) {
			let life = game.challenges.Life;
			const oldStacks = life.stacks;
			if (cell.mutation === 'Living') life.stacks -= 5;
			else life.stacks++;
			if (life.stacks > life.maxStacks) life.stacks = life.maxStacks;
			if (life.stacks < 0) life.stacks = 0;
			if (life.stacks !== oldStacks) {
				game.global.soldierHealthMax = (game.global.soldierHealthMax / (1 + oldStacks / 10)) * (1 + life.stacks / 10);
				game.global.soldierHealth = (game.global.soldierHealth / (1 + oldStacks / 10)) * (1 + life.stacks / 10);
				if (game.global.soldierHealthMax < game.global.soldierHealth) {
					game.global.soldierHealth = game.global.soldierHealthMax;
				}
				if (game.global.soldierHealth < 0) thisKillsTheTrimp();
				updateAllBattleNumbers();
			}
			updateLivingStacks();
		}

		if ((challengeActive('Nom') || challengeActive('Toxicity')) && attacked) {
			game.global.soldierHealth -= game.global.soldierHealthMax * 0.05;
			if (game.global.soldierHealth < 0) thisKillsTheTrimp();
		}

		if (challengeActive('Lead') && attacked && cell.health > 0) {
			game.global.soldierHealth -= game.global.soldierHealthMax * Math.min(game.challenges.Lead.stacks, 200) * 0.0003;
			if (game.global.soldierHealth < 0) thisKillsTheTrimp();
		}

		if (empowerment === 'Ice' && attacked) {
			let addStacks = 1;
			if (empowermentUber === 'Ice') addStacks *= 2;
			if (Fluffy.isRewardActive('plaguebrought')) addStacks *= 2;
			game.empowerments.Ice.currentDebuffPower += addStacks;
			handleIceDebuff();
		}

		if (empowerment === 'Wind' && attacked) {
			let addStacks = 1;
			if (empowermentUber === 'Wind') addStacks *= 2;
			if (Fluffy.isRewardActive('plaguebrought')) addStacks *= 2;
			game.empowerments.Wind.currentDebuffPower += addStacks;
			if (game.empowerments.Wind.currentDebuffPower > game.empowerments.Wind.stackMax()) game.empowerments.Wind.currentDebuffPower = game.empowerments.Wind.stackMax();
			handleWindDebuff();
		}
	}

	if (game.global.universe === 2) {
		if (getPerkLevel('Frenzy') > 0 && attacked && game.global.soldierHealth > 0) {
			game.portal.Frenzy.trimpAttacked();
		}

		if (challengeActive('Duel')) {
			const challenge = game.challenges.Duel;
			let trimpPoints = 0;
			let enemyPoints = 0;
			if (badCrit) enemyPoints++;
			if (critTier > 0) trimpPoints++;
			if (game.global.soldierHealth <= 0) {
				if (trimpsWereFull) enemyPoints += 5;
				else enemyPoints += 2;
			}
			if (cell.health <= 0) {
				if (enemyWasFull) trimpPoints += 5;
				else trimpPoints += 2;
			}
			challenge.enemyStacks += enemyPoints - trimpPoints;
			challenge.trimpStacks += trimpPoints - enemyPoints;
			if (challenge.enemyStacks > 100) {
				challenge.enemyStacks = 100;
				challenge.trimpStacks = 0;
			}
			if (challenge.trimpStacks > 100) {
				challenge.trimpStacks = 100;
				challenge.enemyStacks = 0;
			}
			challenge.drawStacks();
		}

		if (challengeActive('Storm') && !game.global.mapsActive) {
			if (game.global.soldierHealth > 0) {
				game.challenges.Storm.alpha++;
				game.global.soldierHealth -= game.global.soldierHealthMax * (game.challenges.Storm.alpha * game.challenges.Storm.alphaLoss);
				if (game.global.soldierHealth < 0) thisKillsTheTrimp();
			}
			if (cell.health > 0) {
				game.challenges.Storm.enemyAttacked(cell);
			}
			game.challenges.Storm.drawStacks();
		}

		if (challengeActive('Berserk') && attacked) {
			game.challenges.Berserk.attacked();
		}

		if (challengeActive('Glass') && attacked && game.global.soldierHealth > 0) {
			game.challenges.Glass.checkReflect(cell, trimpAttack);
			if (game.global.soldierHealth <= 0) thisKillsTheTrimp();
		}

		if (challengeActive('Smithless') && cell.ubersmith) {
			game.challenges.Smithless.attackedUber();
		}

		if (challengeActive('Desolation')) {
			if (wasAttacked && !game.global.mapsActive) {
				game.challenges.Desolation.addChilledStacks(1);
				game.challenges.Desolation.drawStacks();
			}
			if (attacked && game.global.mapsActive) {
				game.challenges.Desolation.mapAttacked(currentMapObj.level);
			}
		}

		if (game.global.universe === 2 && attacked && cell.u2Mutation && cell.u2Mutation.length) {
			if (u2Mutations.types.Nova.hasNova(cell)) u2Mutations.types.Nova.attacked();
			if (u2Mutations.types.Rage.hasRage(cell)) u2Mutations.types.Rage.attacked();
			if (game.global.spireActive && u2Mutations.types.Spire1.hasMut(cell)) u2Mutations.types.Spire1.attacked(cell);
		}
	}

	if ((game.global.voidBuff === 'bleed' || cell.corrupted === 'corruptBleed' || cell.corrupted === 'healthyBleed') && wasAttacked) {
		const bleedMod = cell.corrupted === 'healthyBleed' ? 0.3 : 0.2;
		game.global.soldierHealth -= game.global.soldierHealth * bleedMod;
		if (game.global.soldierHealth < 1) thisKillsTheTrimp();
	}

	const critSpanElem = document.getElementById('critSpan');
	const critSpanText = getCritText(critTier);
	if (critSpanElem.innerHTML !== critSpanText && !usingRealTimeOffline) critSpanElem.innerHTML = critSpanText;

	if (critTier >= 3) redCritCounter++;
	else redCritCounter = 0;

	if (redCritCounter >= 10) giveSingleAchieve('Critical Luck');

	let badCritText;

	if (badDodge) badCritText = 'Dodge!';
	else if (badCrit && wasAttacked) badCritText = 'Crit!';
	else badCritText = '';

	const badCritElem = document.getElementById('badCrit');
	if (badCritElem.innerHTML !== badCritText && !usingRealTimeOffline) badCritElem.innerHTML = badCritText;
	if (cell.health <= 0) game.global.battleCounter = 800;

	if (!game.global.mapsActive && getPerkLevel('Hunger')) {
		game.portal.Hunger.storedDamage += overkill;
	}

	if (overkill) {
		const nextCell = game.global.mapsActive ? game.global.mapGridArray[cellNum + 1] : game.global.gridArray[cellNum + 1];
		if (nextCell && nextCell.health !== 'compressed') {
			nextCell.health = overkill;
			nextCell.OKcount = 1;
		}
	} else if (plaguebringer > 0) {
		const nextCell = game.global.mapsActive ? game.global.mapGridArray[cellNum + 1] : game.global.gridArray[cellNum + 1];
		if (nextCell) {
			if (!nextCell.plaguebringer) nextCell.plaguebringer = plaguebringer;
			else nextCell.plaguebringer += plaguebringer;
			if (!nextCell.plagueHits) nextCell.plagueHits = getPlayerModifier;
			else nextCell.plagueHits += getPlayerModifier;
		}
	}

	if (challengeActive('Devastation') && impOverkill) {
		game.challenges.Devastation.lastOverkill = impOverkill;
	}

	if (challengeActive('Revenge') && impOverkill) {
		game.challenges.Revenge.lastOverkill = impOverkill;
	}

	if (cell.health <= 0 && typeof game.global.dailyChallenge.explosive !== 'undefined') {
		if (game.global.dailyChallenge.explosive.strength <= 15 || game.global.soldierHealthMax > game.global.soldierCurrentBlock) {
			const explodeDamage = cellAttack * dailyModifiers.explosive.getMult(game.global.dailyChallenge.explosive.strength);
			let explodeAndBlock = explodeDamage - game.global.soldierCurrentBlock;
			if (explodeAndBlock < 0) explodeAndBlock = 0;
			if (pierce > 0) {
				const explodePierce = pierce * explodeDamage;
				if (explodeAndBlock < explodePierce) explodeAndBlock = explodePierce;
			}
			reduceSoldierHealth(explodeAndBlock);
			if (game.global.soldierHealth <= 0) thisKillsTheTrimp();
		}
	}

	if (game.global.universe === 2) {
		if (cell.health <= 0 && challengeActive('Storm')) {
			game.challenges.Storm.enemyDied();
		}
		if (cell.health <= 0 && challengeActive('Berserk')) {
			game.challenges.Berserk.enemyDied();
		}
		if (game.global.soldierHealth <= 0 && challengeActive('Berserk')) {
			game.challenges.Berserk.trimpDied();
		}
		if (game.global.soldierHealth <= 0 && challengeActive('Exterminate')) {
			game.challenges.Exterminate.trimpDied();
		}
		if (getPerkLevel('Frenzy') && game.global.soldierHealth <= 0) {
			game.portal.Frenzy.trimpDied();
		}
	}

	if (cell.health > 0) {
		game.global.fightAttackCount++;
	} else {
		game.global.fightAttackCount = 0;
	}

	if (game.global.soldierHealth > 0) {
		game.global.armyAttackCount++;
	}
	else if (game.portal.Equality.getSetting('scalingActive') && game.global.armyAttackCount <= game.portal.Equality.getSetting('scalingSetting')) {
		game.portal.Equality.scalingCount++;
		manageEqualityStacks();
	}

	if (game.global.fightAttackCount > 0 && game.portal.Equality.getSetting('scalingActive') && game.portal.Equality.getSetting('scalingReverse') && game.global.fightAttackCount % game.portal.Equality.getSetting('reversingSetting') === 0 && game.global.armyAttackCount > game.portal.Equality.getSetting('scalingSetting') && cell.health > 0) {
		game.portal.Equality.scalingCount--;
		manageEqualityStacks();
	}

	if (makeUp) return;
	updateGoodBar();
	updateBadBar(cell);
}

function reduceSoldierHealth(amt, directAttack){
	if (game.global.soldierHealth <= 0) return;
	if (game.global.challengeActive == "Mayhem" && (game.global.mapsActive || game.global.lastClearedCell == 98)){
		game.challenges.Mayhem.poison += (amt * .2);
		game.challenges.Mayhem.drawStacks();
	}
	var wasFull = (game.global.soldierHealth >= game.global.soldierHealthMax)
	if (game.global.universe == 2){
		if (game.global.soldierEnergyShield > 0){
			var maxLayers = (Fluffy.isRewardActive("shieldlayer") + 1);
			var layers = maxLayers - game.global.shieldLayersUsed;
			for (var x = 0; x < layers; x++){
				game.global.soldierEnergyShield -= amt;
				if (game.global.soldierEnergyShield > 0){
					var pctRemaining = Math.ceil(game.global.soldierEnergyShield / game.global.soldierEnergyShieldMax * 100);
					if (game.global.lowestShield > pctRemaining) game.global.lowestShield = pctRemaining;
					return;
				}
				game.global.shieldLayersUsed++;
				amt = Math.abs(game.global.soldierEnergyShield);
				if (game.global.shieldLayersUsed < maxLayers) game.global.soldierEnergyShield = game.global.soldierEnergyShieldMax;

			}

			if (game.global.challengeActive == "Bublé") game.challenges.Bublé.onFail();
			if (game.global.challengeActive == "Quest" && game.challenges.Quest.questId == 4 && !game.challenges.Quest.questComplete){
				game.challenges.Quest.questProgress++;
				if (game.challenges.Quest.questProgress == 1) game.challenges.Quest.failQuest();
			}
		}
		game.global.lowestShield = 0;
	}
	if (game.global.challengeActive == "Frigid" && game.challenges.Frigid.warmth <= 0 && amt >= (game.global.soldierHealthMax / 5)) {
		game.challenges.Frigid.shatterTrimp()
		amt = game.global.soldierHealthMax;
	}
	game.global.soldierHealth -= amt;
	if (game.global.soldierHealth <= 0 && !wasFull && Fluffy.isRewardActive("reincarnate")){
		var roll = getRandomIntSeeded(game.global.reincarnateSeed++, 0, 10);
		if (roll == 6 || roll == 9) game.global.soldierHealth = game.global.soldierHealthMax;
	}
}

function addSoldierHealth(modifier){
	if (game.global.soldierHealth > 0){
		var increase = game.global.soldierHealthMax * modifier;
		game.global.soldierHealth += increase;
		game.global.soldierHealthMax += increase;
		if (game.global.soldierHealth > game.global.soldierHealthMax) game.global.soldierHealth = game.global.soldierHealthMax;
	}
}

function getPlaguebringerModifier(){
	if (game.global.challengeActive == "Wither" && game.global.runningChallengeSquared) return 0;
	var amt = 0;
	var shieldBonus = (getHeirloomBonus("Shield", "plaguebringer") / 100);
	if (shieldBonus > 0) amt += shieldBonus;
	if (Fluffy.isRewardActive("plaguebrought")) amt += 0.5;
	return amt;
}

function getNextVoidId(){
	for (var x = 0; x < game.global.mapsOwnedArray.length; x++){
		 if (game.global.mapsOwnedArray[x].location == "Void") return game.global.mapsOwnedArray[x].id;
	}
	return false;
}

function getNextBwId(){
	var currLevel = 124;
	var map = getCurrentMapObject();
	if (map && map.name.search("Bionic Wonderland") > -1){
		currLevel = map.level;
	}
	for (var x = (game.global.mapsOwnedArray.length - 1); x >= 0; x--){
		var map = game.global.mapsOwnedArray[x];
		if (map.level > currLevel && map.name.search("Bionic Wonderland") > -1) return map.id;
	}
	return false;
}

function getCritText(critTier){
	switch(critTier){
		case -1:
			return "<span style='color: cyan'>Weak!</span>";
		case 1: 
			return "Crit!";
		case 2:
			return "<span style='color: orange'>CRIT!</span>";
		case 3:
			return "<span style='color: red'>CRIT!!</span>";
		case 4:
			return "<span class='critTier4'>CRIT<span class='icomoon icon-atom'></span></span>";
		case 5:
			return "<span class='critTier5'><span class='icomoon icon-bomb'></span> CRIT</span>";
		case 6:
			return "<span class='critTier6'><span class='icomoon icon-diamond'></span> CRIT!</span>";
		case 7:
			return "<span class='critTier7'><span class='icomoon icon-bolt'></span> CRIT!!</span>";
		case 8:
			return "<span class='critTier8'><span class='icomoon icon-eye4'></span> CRIT!!</span>";
		case 9:
			return "<span class='critTier9'><span class='icomoon icon-radioactive'></span> CRIT!!</span>";

	}
	return "";
}

function getPlayerDoubleCritChance(){
	var amt = getHeirloomBonus("Shield", "doubleCrit") / 100;
	if (Fluffy.isRewardActive("doubleCrit")) amt += 0.2;
	return amt;
}

function getPlayerCritChance(){ //returns decimal: 1 = 100%
	if (game.global.challengeActive == "Frigid" && game.challenges.Frigid.warmth <= 0) return 0;
	if (game.global.challengeActive == "Duel") return (game.challenges.Duel.enemyStacks / 100);
	var critChance = 0;
	critChance += (game.portal.Relentlessness.modifier * getPerkLevel("Relentlessness"));
	critChance += (getHeirloomBonus("Shield", "critChance") / 100);
	if (game.talents.crit.purchased && getHeirloomBonus("Shield", "critChance")) critChance += (getHeirloomBonus("Shield", "critChance") * 0.005);
	if (Fluffy.isRewardActive("critChance")) critChance += (0.5 * Fluffy.isRewardActive("critChance"));
	if (game.challenges.Nurture.boostsActive() && game.challenges.Nurture.getLevel() >= 5) critChance += 0.35;
	if (game.global.universe == 2 && u2Mutations.tree.CritChance.purchased) critChance += 0.25;
	if (game.global.challengeActive == "Daily"){
		if (typeof game.global.dailyChallenge.trimpCritChanceUp !== 'undefined'){
			critChance += dailyModifiers.trimpCritChanceUp.getMult(game.global.dailyChallenge.trimpCritChanceUp.strength);
		}
		if (typeof game.global.dailyChallenge.trimpCritChanceDown !== 'undefined'){
			critChance -= dailyModifiers.trimpCritChanceDown.getMult(game.global.dailyChallenge.trimpCritChanceDown.strength);
		}
		if (Fluffy.isRewardActive('SADailies')) critChance += Fluffy.rewardConfig.SADailies.critChance();
	}
	critChance += u2SpireBonuses.critChance();
	if (critChance > 9) critChance = 9;
	return critChance;
}

function getPlayerCritDamageMult() {
	const relentLevel = getPerkLevel('Relentlessness');
	const eoaEffect = alchObj.getPotionEffect('Elixir of Accuracy');

	let critMult = game.portal.Relentlessness.otherModifier * relentLevel + getHeirloomBonus('Shield', 'critDamage') / 100 + 1;
	critMult += getPerkLevel('Criticality') * game.portal.Criticality.modifier;
	if (relentLevel > 0) critMult += 1;
	if (game.challenges.Nurture.boostsActive() && game.challenges.Nurture.getLevel() >= 5) critMult += 0.5;
	/* if (eoaEffect > 1) */ critMult += eoaEffect;
	return critMult;
}

function getMegaCritDamageMult(critTier){
	//critTier 1 is yellow and returns 1 from this. critTier 2 is orange, 3 is red, 4 is purple.
	var base = 5;
	if (Fluffy.isRewardActive("megaCrit")) base += 2;
	if (game.talents.crit.purchased) base += 1;
	return Math.pow(base, critTier - 1);
}

function manageLeadStacks(remove) {
	const challenge = game.challenges.Lead;
	const elem = document.getElementById('leadBuff');
	let determinedBuff = document.getElementById('determinedBuff');

	if (game.global.world % 2 === 1) {
		if (determinedBuff === null) {
			const goodGuyElem = document.getElementById('goodGuyName');
			const htmlMessage = makeIconEffectHTML("Determined", "Your Trimps are determined to succeed. They gain 50% attack and earn double resources from all sources.", "icon-sun2", "antiBadge", ["determinedBuff"])
			if (!goodGuyElem.innerHTML.includes(htmlMessage)) goodGuyElem.insertAdjacentHTML('beforeend', htmlMessage);
			determinedBuff = document.getElementById('determinedBuff');
		}
		determinedBuff.style.display = 'inline';
	} else if (determinedBuff !== null) {
		determinedBuff.style.display = 'none';
	}

	if (challenge.stacks <= 0) return;
	if (remove && challenge.stacks) challenge.stacks--;

	if (!elem) {
		const badGuyElem = document.getElementById('badGuyName');
		const htmlMessage = makeIconEffectHTML("Momentum", false, "icon-hourglass", "badBadge", ["leadBuff", "leadStacks", "momentumIcon"], challenge.stacks)
		if (badGuyElem.innerHTML !== htmlMessage) badGuyElem.insertAdjacentHTML('beforeend', htmlMessage);
	} else {
		const stacksElem = document.getElementById('leadStacks');
		if (stacksElem.innerHTML !== challenge.stacks) stacksElem.innerHTML = challenge.stacks;
	}

	swapClass('icon-hourglass', 'icon-hourglass-' + (3 - Math.floor(challenge.stacks / 67)), document.getElementById('momentumIcon'));
}

function updateToxicityStacks() {
	if (usingRealTimeOffline) return;

	const elem = document.getElementById('toxicityBuff');
	const stackCount = game.challenges.Toxicity.stacks;

	if (!elem) {
		const badGuyElem = document.getElementById('badGuyName');
		const htmlMessage = makeIconEffectHTML("Toxic", false, "icon-radioactive", "badBadge", ["toxicityBuff", "toxicityStacksText"], stackCount)
		if (badGuyElem.innerHTML != htmlMessage) badGuyElem.insertAdjacentHTML('beforeend', htmlMessage);
	} else {
		const stacksElem = document.getElementById('toxicityStacksText');
		if (stacksElem.innerHTML != stackCount) stacksElem.innerHTML = stackCount;
	}
}

function updateLivingStacks() {
	if (usingRealTimeOffline) return;

	const elem = document.getElementById('livingBuff');
	const stackCount = game.challenges.Life.stacks;
	if (stackCount < game.challenges.Life.lowestStacks) game.challenges.Life.lowestStacks = stackCount;

	if (!elem) {
		const goodGuyElem = document.getElementById('goodGuyName');
		const htmlMessage = makeIconEffectHTML("Unliving", false, "icon-shareable", "antiBadge", ["livingBuff", "livingStacks"], stackCount + "&nbsp;")
		if (!goodGuyElem.innerHTML.includes(htmlMessage)) goodGuyElem.insertAdjacentHTML('beforeend', htmlMessage);
	} else {
		const stacksElem = document.getElementById('livingStacks');
		if (stacksElem.innerHTML != stackCount) stacksElem.innerHTML = stackCount;
	}
}

function checkCrushedCrit() {
	let badCrit = false;
	let elemDisplay = 'none';
	const canCritElem = document.getElementById('badCanCrit');

	if (game.global.soldierHealth > game.global.soldierCurrentBlock) {
		elemDisplay = 'inline-block';
		if (Math.floor(Math.random() * 2) === 0) badCrit = true;
	}

	if (!usingRealTimeOffline && canCritElem.style.display !== elemDisplay) canCritElem.style.display = elemDisplay;
	return badCrit;
}

function updateElectricityStacks(tipOnly) {
	if (usingRealTimeOffline && (challengeActive('Electricity') || challengeActive('Mapocalypse'))) return;

	const elem = document.getElementById('debuffSpan');
	if (game.challenges.Electricity.stacks > 0) {
		const number = game.challenges.Electricity.stacks * 10;
		const addText = 'Your Trimps are dealing ' + number + '% less damage and taking ' + number + '% of their total health as damage per attack.';
		const htmlMessage = makeIconEffectHTML("Electrified", addText, "icon-power", "trimpBadge", false, game.challenges.Electricity.stacks)
		if (elem && elem.innerHTML != htmlMessage) elem.innerHTML = htmlMessage;

		if (tipOnly) {
			const tooltip = document.getElementById('tipText');
			if (tooltip.innerHTML != addText) tooltip.innerHTML = addText;
			return;
		}

		const goodGuyAttack = calculateDamage(game.global.soldierCurrentAttack, true, true);
		const goodGuyElem = document.getElementById('goodGuyAttack');
		if (goodGuyElem.innerHTML != goodGuyAttack) goodGuyElem.innerHTML = goodGuyAttack;
	} else if (elem && elem.innerHTML !== '') elem.innerHTML = '';
}

function updateElectricityTip(){
	tooltipUpdateFunction = function () {
		updateElectricityStacks(true);
	};
}

function updateAntiStacks() {
	if (usingRealTimeOffline) return;

	const elem = document.getElementById('anticipationSpan');
	let elemText = '';

	if (game.global.antiStacks > 0) {
		let number = game.global.antiStacks * getPerkLevel('Anticipation') * game.portal.Anticipation.modifier;
		number = Math.floor(number * 100);
		const verb = game.jobs.Amalgamator.owned > 0 ? 'prepare' : 'populate';
		const s = game.global.antiStacks === 1 ? '' : 's';
		elemText = makeIconEffectHTML("Anticipation", `Your Trimps are dealing ${number}% extra damage for taking ${game.global.antiStacks} second${s} to ${verb}.`, "icon-target2", "antiBadge", false, game.global.antiStacks)
	}
	if (elem && elem.innerHTML != elemText) elem.innerHTML = elemText;
}

function updateTitimp() {
	if (usingRealTimeOffline) return;

	let message;
	if (game.global.titimpLeft < 1) {
		message = '';
	} else {
		const timer = Math.floor(game.global.titimpLeft);
		message = makeIconEffectHTML('Titimp', 'Your Trimps are dealing double damage, thanks to the Titimp!', "icon-hammer", "antiBadge", false, timer)
	}

	const elem = document.getElementById('titimpBuff');
	if (elem && elem.innerHTML != message) elem.innerHTML = message;
}

function updateNomStacks(number) {
	if (usingRealTimeOffline) return;

	const elem = document.getElementById('nomStackText');
	if (!elem) {
		document.getElementById('badGuyName').insertAdjacentHTML('beforeend', 
			makeIconEffectHTML("Nom", 'This Bad Guy is nice and plump from eating Trimps. Increases attack damage by 25% per stack', "glyphicon-scale", "badBadge", [, "nomStackText"], number));
	} else {
		if (elem.innerHTML != number) elem.innerHTML = number;
	}
}

function updateBalanceStacks() {
	if (usingRealTimeOffline && (challengeActive('Balance') || challengeActive('Unbalance'))) return;

	let elem = document.getElementById('balanceSpan');
	if (!elem) {
		document.getElementById('goodGuyName').insertAdjacentHTML('beforeend', `<span id='balanceSpan'></span>`);
		elem = document.getElementById('balanceSpan');
	}

	const isUnbalanceActive = challengeActive('Unbalance');
	const challenge = isUnbalanceActive ? game.challenges.Unbalance : game.challenges.Balance;
	const statFunction = isUnbalanceActive ? challenge.getAttackMult.bind(challenge) : challenge.getHealthMult.bind(challenge);
	const statMessage = isUnbalanceActive ? 'less attack' : 'less health';

	if (challenge.balanceStacks > 0) {
		const text = `Your Trimps have ${statFunction(true)} ${statMessage}, but all Trimps can gather ${challenge.getGatherMult(true)} faster. You will gain one stack from killing Bad Guys in the world, and lose one stack for killing Bad Guys in maps.`
		const htmlMessage = makeIconEffectHTML("Unbalance", text, "icon-balance-scale", "antiBadge", false, challenge.balanceStacks) 
		if (elem.innerHTML != htmlMessage) {
			elem.style.display = 'inline-block';
			elem.innerHTML = htmlMessage;
		}
	} else {
		elem.style.display = 'none';
	}
}

function updateGammaStacks(reset) {
	const bonus = getHeirloomBonus('Shield', 'gammaBurst');
	
	let hide = false;
	if (bonus <= 0 || reset) {
		game.heirlooms.Shield.gammaBurst.stacks = 0;
		hide = true;
	}

	if (usingRealTimeOffline) return;

	let triggerStacks = autoBattle.oneTimers.Burstier.owned ? 4 : 5;
	if (Fluffy.isRewardActive('scruffBurst')) triggerStacks--;

	const tipText = `Your Trimps are charging up for a Gamma Burst! When Charging reaches ${triggerStacks} stacks, your Trimps will release a burst of energy, dealing ${prettify(bonus)}% of their attack damage.`;
	manageStacks('Charging', game.heirlooms.Shield.gammaBurst.stacks, true, 'gammaSpan', 'glyphicon glyphicon-flash', tipText, hide);
}

function manageStacks(stackName, stackCount, isTrimps, elemName, icon, tooltipText, forceHide, addSpace, addClass) {
	const parentName = isTrimps ? 'goodGuyName' : 'badDebuffSpan';
	const parent = document.getElementById(parentName);
	let elem = document.getElementById(elemName);

	if (forceHide) {
		if (elem) parent.removeChild(elem);
		return;
	}

	if (!elem) {
		let className = addClass ? " class='" + addClass + "'" : '';
		if (parent) parent.insertAdjacentHTML('beforeend', `<span id="${elemName}"${className}></span>`);
		elem = document.getElementById(elemName);
	}

	if (stackCount === -1) stackCount = '';
	const space = addSpace ? '&nbsp;' : '';
	const elemText = makeIconEffectHTML(stackName, tooltipText, icon, "antiBadge", false, stackCount + space)
	if (elem.innerHTML != elemText) elem.innerHTML = elemText;
}

function buyEquipment(what, confirmed, noTip, forceAmt) {

	if (game.options.menu.pauseGame.enabled) return;
	if (!confirmed && game.options.menu.lockOnUnlock.enabled == 1 && (new Date().getTime() - 1000 <= game.global.lastUnlock)) return;
	var toBuy = game.equipment[what];
	var purchaseAmt = 1;
	if (forceAmt) purchaseAmt = forceAmt;
	else if (!toBuy.percent) purchaseAmt = (game.global.buyAmt == "Max") ? calculateMaxAfford(toBuy, false, true) : game.global.buyAmt;
	if (typeof toBuy === 'undefined') return;
	var canAfford = canAffordBuilding(what, false, false, true, false, purchaseAmt);
	if (canAfford) {
		canAffordBuilding(what, true, false, true, false, purchaseAmt);
		levelEquipment(what, purchaseAmt);
	}
	if (!noTip && !usingScreenReader) tooltip(what, "equipment", "update");
	displayEfficientEquipment();
}

function levelEquipment(what, manualNumber) {
	var toBuy = game.equipment[what];
	var number = (manualNumber) ? manualNumber : game.global.buyAmt;
	toBuy.level += number;
	var stat;
	if (toBuy.blockNow) stat = "block";
	else stat = (typeof toBuy.health !== 'undefined') ? "health" : "attack";
	var toAdd = (toBuy[stat + "Calculated"] * number);
	game.global[stat] += toAdd;
	game.global.difs[stat] += toAdd;
}

function affordOneTier(what, whereFrom, take) {
    //take, true/false to take resources or not or something like that probably
    //don't send shit in here to take without checking first though
    var buyFrom = game[whereFrom];
    var toBuy = game.equipment[what];
    for (var item in toBuy.cost) {
        var cost;
        if (typeof toBuy.cost[item] === 'function') cost = toBuy.cost[item]();
        if (typeof toBuy.cost[item][1] !== 'undefined') cost = resolvePow(toBuy.cost[item], toBuy);
        if (cost > buyFrom[item].owned) return false;
        if (take) buyFrom[item].owned -= cost;
    }
    return true;
}

function fadeIn(elem, speed) {
	elem = document.getElementById(elem);
	if (elem.style.display != "none" && elem.style.visibility != "hidden" && elem.style.opacity != 0) return;
    elem.style.opacity = 0;
    if (elem.style.display == "none") elem.style.display = "block";
    if (elem.style.visibility == "hidden") elem.style.visibility = "visible";
	if (typeof game.options.menu.fadeIns && game.options.menu.fadeIns.enabled == 0) {
		elem.style.opacity = 1;
		return;
	}
	var total = 100 * speed;
	var start = performance.now();
    var fadeCallback = function (timer) {
		var opacity = (timer - start) / total;
        elem.style.opacity = opacity;
        if (opacity < 1) {
            requestAnimationFrame(fadeCallback);
        }
    };
	requestAnimationFrame(fadeCallback);
}

function autoTrap() {
	if (game.resources.food.owned >= 10 && game.resources.wood.owned >= 10){
		game.resources.food.owned -= 10;
		game.resources.wood.owned -= 10;
		game.buildings.Trap.purchased++;
		if (game.global.buildingsQueue[0] == "Trap.1"){
			setNewCraftItem();
			return;
		}
		startQueue("Trap", 1);
	}
}

function planetBreaker(){
	if (game.global.challengeActive == "Eradicated") giveSingleAchieve("Screwed");
	if (game.global.roboTrimpLevel > 0) document.getElementById("chainHolder").style.visibility = "visible";
	game.stats.planetsBroken.valueTotal++;
	game.global.brokenPlanet = true;
//	document.getElementById("wrapper").style.background = "url(css/bg2_vert.png) center repeat-y";
	document.getElementById("wrapper").className = "wrapperBroken";
	tooltip("The Improbability", null, 'update');
	if (!game.global.autoUpgradesAvailable){
		game.global.autoUpgradesAvailable = true;
		document.getElementById("autoUpgradeBtn").style.display = "block";
	}
	game.global.prestige.cost = 53;
	document.getElementById("upgradesHere").innerHTML = "";
	for (var item in game.equipment){
		prestigeEquipment(item, true, true);
	}
	unlockUpgrade("Formations");
	buffVoidMaps();
	if (game.stats.battlesLost.value <= 5) giveSingleAchieve("Unbroken");
}

function restoreGrid(){
	document.getElementById("extraGridInfo").style.display = "none";
	document.getElementById("grid").style.display = "block";
}

function setFormation(what) {
	if (what) {
		if (game.options.menu.pauseGame.enabled) return;
		what = parseInt(what, 10);
		swapClass("formationState", "formationStateDisabled", document.getElementById("formation" + game.global.formation));

		if ((what == 4 || what == 5) && game.global.formation != 5 && game.global.formation != 4){
			if (game.global.mapsActive) game.global.waitToScryMaps = true;
			else game.global.waitToScry = true;
		}
		if (game.global.mapsActive){
			if (what != 4 && what != 5) game.global.canScryCache = false;
			else if (game.global.lastClearedMapCell == -1) game.global.canScryCache = true;
		}
		if (game.global.soldierHealth > 0) {
			var health = 1;
			var block = 1;
			var attack = 1;
			switch (game.global.formation){
				case 1:
					health /= 4;
					attack *= 2;
					block *= 2;
					break;
				case 2:
					health *= 2;
					attack /= 4;
					block *= 2;
					break;
				case 3:
					health *= 2;
					attack *= 2;
					block /= 4;
					break;
				case 4:
					health *= 2;
					attack *= 2;
					block *= 2;
					break;
			}
			switch (what){
				case 1:
					health *= 4;
					attack /= 2;
					block /= 2;
					break;
				case 2:
					health /= 2;
					attack *= 4;
					block /= 2;
					break;
				case 3:
					health /= 2;
					attack /= 2;
					block *= 4;
					break;
				case 4:
					health /= 2;
					attack /= 2;
					block /= 2;
					break;
			}
			var oldHealth = game.global.soldierHealthMax;
			game.global.soldierHealthMax *= health;
			game.global.soldierHealth -= oldHealth - game.global.soldierHealthMax;
			if (game.global.soldierHealth <= 0) game.global.soldierHealth = 0;
			game.global.soldierCurrentBlock *= block;
			game.global.soldierCurrentAttack *= attack;
			game.global.formation = what;
			updateAllBattleNumbers(true);
		}
		game.global.formation = what;
	}
	else swapClass("formationState", "formationStateDisabled", document.getElementById("formation0"));
	var toSet = (what) ? what : game.global.formation;
	swapClass("formationState", "formationStateEnabled", document.getElementById("formation" + toSet));
	if (usingScreenReader) document.FormationInput.formations.value = toSet;
	if (usingRealTimeOffline) offlineProgress.updateFormations();
}

function unlockFormation(what){
	if (what == 5 || ((what == "start" || what == "all") && game.global.uberNature == "Wind")){
		if (game.global.uberNature){
			for (var x = 0; x < 5; x++){
				swapClass('form', 'formSixth', document.getElementById('form' + x + 'Container'));
			}
			document.getElementById('form5Container').style.display = "inline-block";
			var uberElem = document.getElementById('formation5');
			uberElem.innerHTML = "W";
			uberElem.style.display = "block";
		}
	}
	if (what != "start" && !game.upgrades.Formations.done) return;
	if (what == "start" || (what == "all" && game.upgrades.Formations.done == 1)){
		document.getElementById("formation0").style.display = "block";
		document.getElementById("formation1").style.display = "block";
	}
	if (what == 2 || (game.upgrades.Dominance.done == 1)){
		document.getElementById("formation2").style.display = "block";
	}
	if (what == 3 || (game.upgrades.Barrier.done == 1)){
		document.getElementById("formation3").style.display = "block";
	}
	if ((game.global.world >= 60 && getHighestLevelCleared() >= 180) && (what == "start" || what == "all" || what == 4)){
		document.getElementById("formation4").style.display = "block";
	}
	if (usingRealTimeOffline) offlineProgress.updateFormations(true);
}

function hideFormations() {
	for (var x = 0; x < 5; x++){
		document.getElementById("formation" + x).style.display = "none";
		swapClass('form', 'formFifth', document.getElementById('form' + x + 'Container'));
	}
	document.getElementById('form5Container').style.display = "none";
}

//Bones

var boneTemp = {
	selectedBoost: 0,
	selectedImport: "",
	selectedMisc: "",
	bundle: [],
	bundleMode: false
};

var bonesShown = false;
function showBones() {
	cancelTooltip();
	bonesShown = true;
	document.getElementById("boneWrapper").style.display = "block";
	updateBones();
	boneTemp.selectedImport = "";
	updateImports(0);
	hidePurchaseBones();
	boneTemp.bundle = [];
	if (getTotalPortals() < 1) {
		document.getElementById("buyHeliumArea").style.display = "none";
		document.getElementById("buyHeirloomArea").style.display = "none";
	}
	else {
		document.getElementById("buyHeliumArea").style.display = "block";
		if (game.stats.totalHeirlooms.value + game.stats.totalHeirlooms.valueTotal > 0) {
			document.getElementById("buyHeirloomArea").style.display = "block";
			setHeirRareText(true);
		}
		else document.getElementById("buyHeirloomArea").style.display = "none";
	}
	updateImportButton("First, select an Imp", false);
	var heliumGainedArea = document.getElementById("heliumGainedMisc");
	var heDescElem = document.getElementById("bonePortalDescription");
	var heText = "+ " + prettify(boostHe(true)) + " " + heliumOrRadon();
	var heDesc = "Automatically gain " + heliumOrRadon();
	var fluffyStat = Fluffy.getBestExpStat();
	if (game.stats.bestTokens.valueTotal >= 3 && game.global.universe == 1) {
		heDesc += (fluffyStat > 0) ? ", " : " and ";
		heDesc += "Nature Tokens";
		heText += ", " + prettify(Math.floor(game.stats.bestTokens.valueTotal / 3)) + "x each Token";
	}
	if (fluffyStat.valueTotal > 0 && Fluffy.canGainExp()) {
		heDesc += " and " + Fluffy.getName() + " Exp";
		heText += ", " + prettify(fluffyStat.valueTotal) + " " + Fluffy.getName() + " Exp";
	}
	else document.getElementById('boneBuyRow').style.height = "27vw";
	heDesc += " equal to the amount you earned on your best run.";
	if (fluffyStat > 0){
		if (!Fluffy.canGainExp()) {
			heDesc += "<br/><b>" + Fluffy.getName() + " is at Level 10 and will not gain Exp!";
		}
		else
			heDesc += "<br/>(" + Fluffy.getName() + " Exp does not include bonuses from Dailies)";
		document.getElementById('boneBuyRow').style.height = "28vw";
	}
	heliumGainedArea.innerHTML = heText;
	heDescElem.innerHTML = heDesc;
	var impSpawnChance = 3;
	if (Fluffy.isRewardActive('exotic')) impSpawnChance += 0.5;
	if (game.permaBoneBonuses.exotic.owned > 0) impSpawnChance += game.permaBoneBonuses.exotic.addChance();
	document.getElementById('exoticImpSpawnChance').innerHTML = prettify(impSpawnChance);
	var unpurchasedImps = countUnpurchasedImports();
	if (unpurchasedImps == 0){
		document.getElementById('permaBonesDesc').innerHTML = 'These upgrades all persist through Portals, each one can be purchased a maximum of 10 times. Prices increase by 10 Bones per purchase.';
		document.getElementById('permaBoneBonuses').style.display = 'block';
		// document.getElementById('permaBonesDesc').innerHTML = 'These are locked on Steam until the test server is complete and web is running the same version. Check the in-game patch notes for descriptions of what they do!';
		// document.getElementById('permaBoneBonuses').style.display = 'none';
	}
	else{
		document.getElementById('permaBonesDesc').innerHTML = 'The Bone Trader saves these bad boys for his best customers. Unlock all 10 Exotic Imports and you\'ll be judged worthy.';
		document.getElementById('permaBoneBonuses').style.display = 'none';
	}
	if (typeof kongregate === 'undefined') return;
	if (unpurchasedImps < 4) {
		document.getElementById("bundleRow").style.display = "none";
		document.getElementById("getBundleBtn").style.display = "none";
	}
}

function heliumOrRadon(addStorage, usePortalUniverse){
	var universe = game.global.universe;
	if (usePortalUniverse) universe = portalUniverse;
	var name = (universe == 2) ? "Radon" : "Helium";
	if (!addStorage) return name;
	name += (universe == 2) ? " Vial" : " Canister";
	return name;
}

function heliumIcon(includePrefix){
	if (includePrefix){
		return (game.global.universe == 1) ? "glyphicon glyphicon-oil" : "icomoon icon-battery";
	}
	return (game.global.universe == 1) ? "oil" : "*battery";
}

function updateImportButton(text, enabled){
	var elem = document.getElementById("importPurchaseBtn");
	elem.innerHTML = text + " (50 bones)";
	swapClass('boneBtnState', 'boneBtnState' + ((enabled) ? 'On' : 'Off'), elem);
}

function updateImports(which) {
	var count = 0;
	var world = document.getElementById("importsTableWorld" + which);
	var maps = document.getElementById("importsTableMaps" + which);
	world.innerHTML = "";
	maps.innerHTML = "";
	for (var item in game.unlocks.imps){
		var badGuy = game.badGuys[item];
		var elem = (badGuy.location == "World") ? world : maps;
		count++;
		var row = elem.insertRow();
		var toRun = (which == 1) ? 'addToBundle' : 'selectImp';
		toRun += '("' + item + '")';
		if (game.unlocks.imps[item]){
			row.className = 'importOwned';
		}
		else
		row.setAttribute('onclick', toRun);
		row.id = (which == 1) ? item + "1" : item;
		var name = row.insertCell();
		name.className = "importPreviewName";
		name.innerHTML = item;
		var loot = row.insertCell();
		loot.className = "importPreviewLoot";
		loot.innerHTML = badGuy.dropDesc;
	}
}

function selectImp(name){
	if (boneTemp.selectedImport) document.getElementById(boneTemp.selectedImport).className = "";
	document.getElementById(name).className = "tealColor";
	boneTemp.selectedImport = name;
	updateImportButton("Buy " + name, true);

}


function hideBones() {
	bonesShown = false;
	document.getElementById("boneWrapper").style.display = "none";
	var elem3 = document.getElementById("boneWrapper3");
	if (elem3){
		elem3.style.display = "none";
	}
	updateSkeleBtn();
}

function simpleSeconds(what, seconds) {
	//Come home to the impossible flavour of balanced resource gain. Come home, to simple seconds.
		var compatible = ["Farmer", "Lumberjack", "Miner", "Dragimp", "Explorer"];
		var jobName;
		switch (what) {
			case "food":
				jobName = "Farmer";
				break;
			case "wood":
				jobName = "Lumberjack";
				break;
			case "metal":
				jobName = "Miner";
				break;
			case "gems":
				jobName = "Dragimp";
				break;
			case "fragments":
				jobName = "Explorer";
				break;
			case "science":
				jobName = "Scientist";
				break;
		}
		var job = game.jobs[jobName];
		var amt = job.owned * job.modifier * seconds;
		amt += (amt * getPerkLevel("Motivation") * game.portal.Motivation.modifier);
		if (getPerkLevel("Motivation_II") > 0) amt *= (1 + (getPerkLevel("Motivation_II") * game.portal.Motivation_II.modifier));
		if (what != "gems" && game.permaBoneBonuses.multitasking.owned > 0 && (game.resources.trimps.owned >= game.resources.trimps.realMax())) amt *= (1 + game.permaBoneBonuses.multitasking.mult());
		if (what != "science" && what != "fragments"){
			if (game.global.challengeActive == "Alchemy") amt *= alchObj.getPotionEffect("Potion of Finding");
			amt *= alchObj.getPotionEffect("Elixir of Finding");
		}
		if (game.global.pandCompletions && what != "fragments") amt *= game.challenges.Pandemonium.getTrimpMult();
		if (game.global.desoCompletions && what != "fragments") amt *= game.challenges.Desolation.getTrimpMult();
		if (!game.portal.Observation.radLocked && game.global.universe == 2 && game.portal.Observation.trinkets > 0) amt *= game.portal.Observation.getMult();
		if (getPerkLevel("Meditation") > 0) amt *= (1 + (game.portal.Meditation.getBonusPercent() * 0.01));
		if (what == "food" || what == "wood" || what == "metal"){
			amt *= getParityBonus();
			if (autoBattle.oneTimers.Gathermate.owned && game.global.universe == 2) amt *= autoBattle.oneTimers.Gathermate.getMult();
		}
		if (((what == "food" || what == "wood") && game.buildings.Antenna.owned >= 5) || (what == "metal" && game.buildings.Antenna.owned >= 15)) amt *= game.jobs.Meteorologist.getExtraMult();
		if (Fluffy.isRewardActive('gatherer')) amt *= 2;
		if (game.jobs.Magmamancer.owned > 0 && what == "metal") amt *= game.jobs.Magmamancer.getBonusPercent();
		if (game.global.challengeActive == "Frigid") amt *= game.challenges.Frigid.getShatteredMult();
		if (challengeActive("Meditate")) amt *= 1.25;
		else if (challengeActive("Size") && (what == "food" || what == "wood" || what == "metal")) amt *= 1.5;
		if (challengeActive("Toxicity")){
			var toxMult = (game.challenges.Toxicity.lootMult * game.challenges.Toxicity.stacks) / 100;
			amt *= (1 + toxMult);
		}
		if (challengeActive("Watch")) amt /= 2;
		if (challengeActive("Lead") && ((game.global.world % 2) == 1)) amt *= 2;
		if (challengeActive("Balance")){
			amt *= game.challenges.Balance.getGatherMult();
		}
		if (what == "wood" && game.global.challengeActive == "Hypothermia") amt *= game.challenges.Hypothermia.getWoodMult();
		if (game.global.challengeActive == "Unbalance"){
			amt *= game.challenges.Unbalance.getGatherMult();
		}
		if (game.global.challengeActive == "Daily"){
			if (typeof game.global.dailyChallenge.famine !== 'undefined' && what != "fragments" && what != "science"){
				amt *= dailyModifiers.famine.getMult(game.global.dailyChallenge.famine.strength);
			}
			if (typeof game.global.dailyChallenge.dedication !== 'undefined'){
				amt *= dailyModifiers.dedication.getMult(game.global.dailyChallenge.dedication.strength);
			}
		}
		if (game.global.challengeActive == "Decay" || game.global.challengeActive == "Melt"){
			var challenge = game.challenges[game.global.challengeActive];
			amt *= 10;
			amt *= Math.pow(challenge.decayValue, challenge.stacks);
		}
		if (game.global.challengeActive == "Desolation" && what != "fragments") amt *= game.challenges.Desolation.trimpResourceMult();
		if (game.challenges.Nurture.boostsActive()) amt *= game.challenges.Nurture.getResourceBoost();
		if (getEmpowerment() == "Wind"){
			amt *= (1 + (game.empowerments.Wind.getCombatModifier()));
		}
		amt = calcHeirloomBonus("Staff", jobName + "Speed", amt);
		if (game.global.playerGathering == what){
			if ((game.talents.turkimp2.purchased || game.global.turkimpTimer > 0) && (what == "food" || what == "metal" || what == "wood")){
				var tBonus = 1.5;
				if (game.talents.turkimp2.purchased) tBonus = 2;
				else if (game.talents.turkimp2.purchased) tBonus = 1.75;
				amt *= tBonus;
			}
			amt += getPlayerModifier() * seconds;
		}
		return amt;
}

function scaleToCurrentMap(amt, ignoreBonuses, ignoreScry) {
    var map = getCurrentMapObject();
	var world = map.level;
	var compare = game.global.world;
	if (world > compare && map.location != "Bionic"){
		amt *= Math.pow(1.1, (world - compare));
	}
	else {
		if (game.talents.mapLoot.purchased)
			compare--;
		if (world < compare){
			//-20% loot compounding for each level below world
			amt *= Math.pow(0.8, (compare - world));
		}
	}
	//Add map loot bonus
	amt = Math.round(amt * map.loot);
	if (ignoreBonuses) return amt;
	amt = scaleLootBonuses(amt, ignoreScry);
	return amt;
}

function scaleLootBonuses(amt, ignoreScry){
	if (game.unlocks.impCount.Magnimp) amt *= Math.pow(1.003, game.unlocks.impCount.Magnimp);
	if (getPerkLevel("Looting")) amt += (amt * getPerkLevel("Looting") * game.portal.Looting.modifier);
	if (getPerkLevel("Looting_II")) amt *= (1 + (getPerkLevel("Looting_II") * game.portal.Looting_II.modifier));
	if (game.global.universe == 2 && u2Mutations.tree.Loot.purchased) amt *= 1.5;
	if (game.global.challengeActive == "Alchemy") amt *= alchObj.getPotionEffect("Potion of Finding");
	amt *= alchObj.getPotionEffect("Elixir of Finding");
	if (getPerkLevel("Greed") || getPerkLevel("Masterfulness")) amt *= game.portal.Greed.getMult();
	if (Fluffy.isRewardActive("wealthy")) amt *= 2;
	if (getUberEmpowerment() == "Wind") amt *= 10;
	if (!ignoreScry && isScryerBonusActive()) amt *= 2;
	if (game.global.challengeActive == "Quagmire") amt *= game.challenges.Quagmire.getLootMult();
	if (game.global.challengeActive == "Archaeology") amt *= game.challenges.Archaeology.getStatMult("science");
	if (game.global.challengeActive == "Insanity") amt *= game.challenges.Insanity.getLootMult();
	if (game.global.challengeActive == "Desolation") amt *= game.challenges.Desolation.trimpResourceMult();
	if (game.challenges.Nurture.boostsActive()) amt *= game.challenges.Nurture.getResourceBoost();
	if (game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.karma !== 'undefined'){
		amt *= dailyModifiers.karma.getMult(game.global.dailyChallenge.karma.strength, game.global.dailyChallenge.karma.stacks);
	}
	return amt;
}

//12 - 43200
//36 - 129600
function addBoost(level, previewOnly) {
	var compatible = ["Farmer", "Lumberjack", "Miner", "Dragimp", "Explorer"];
	var storage = ["Barn", "Shed", "Forge"];
	var add = 43200;
	if (level == 1) add *= 3;
	for (var x = 0; x < compatible.length; x++){
		var job = game.jobs[compatible[x]];
		var resource = game.resources[job.increase];
		var amt = job.owned * job.modifier * add;
		amt += (amt * getPerkLevel("Motivation") * game.portal.Motivation.modifier);
		if (getPerkLevel("Motivation_II") > 0) amt *= (1 + (getPerkLevel("Motivation_II") * game.portal.Motivation_II.modifier));
		if (resource != "gems" && game.permaBoneBonuses.multitasking.owned > 0 && (game.resources.trimps.owned >= game.resources.trimps.realMax())) amt *= (1 + game.permaBoneBonuses.multitasking.mult());
		if (job != "Explorer"){
			if (game.global.challengeActive == "Alchemy") amt *= alchObj.getPotionEffect("Potion of Finding");
			amt *= alchObj.getPotionEffect("Elixir of Finding");
		}
		if (game.global.challengeActive == "Frigid") amt *= game.challenges.Frigid.getShatteredMult();
		if (game.global.pandCompletions && job != "Explorer") amt *= game.challenges.Pandemonium.getTrimpMult();
		if (game.global.desoCompletions && job != "Explorer") amt *= game.challenges.Desolation.getTrimpMult();
		if (!game.portal.Observation.radLocked && game.global.universe == 2 && game.portal.Observation.trinkets > 0) amt *= game.portal.Observation.getMult();
		if (getPerkLevel("Meditation") > 0) amt *= (1 + (game.portal.Meditation.getBonusPercent() * 0.01));
		if (Fluffy.isRewardActive('gatherer')) amt *= 2;
		if (resource == "food" || resource == "wood" || resource == "metal"){
			amt *= getParityBonus();
			if (autoBattle.oneTimers.Gathermate.owned && game.global.universe == 2) amt *= autoBattle.oneTimers.Gathermate.getMult();
		}
		if (game.jobs.Magmamancer.owned > 0 && job.increase == "metal") amt *= game.jobs.Magmamancer.getBonusPercent();
		if (challengeActive("Meditate")) amt *= 1.25;
		if (challengeActive("Toxicity")){
			var toxMult = (game.challenges.Toxicity.lootMult * game.challenges.Toxicity.stacks) / 100;
			amt *= (1 + toxMult);
		}
		if (challengeActive("Watch")) amt /= 2;
		if (challengeActive("Lead") && ((game.global.world % 2) == 1)) amt *= 2;
		if (game.global.challengeActive == "Archaeology" && resource != "fragments") amt *= game.challenges.Archaeology.getStatMult("science");
		if (game.global.challengeActive == "Insanity") amt *= game.challenges.Insanity.getLootMult();
		if (game.global.challengeActive == "Desolation" && resource != "fragments") amt *= game.challenges.Desolation.trimpResourceMult();
		if (game.challenges.Nurture.boostsActive()) amt *= game.challenges.Nurture.getResourceBoost();
		amt = calcHeirloomBonus("Staff", compatible[x] + "Speed", amt);
		if (typeof storage[x] !== 'undefined'){
			var tempTotal = amt + resource.owned;
			var tempMax = resource.max;
			var structCount = 0;
			var storageBuilding = game.buildings[storage[x]];
			var packMod = getPerkLevel("Packrat") * game.portal.Packrat.modifier;
			while (tempTotal > calcHeirloomBonus("Shield", "storageSize", tempMax + (tempMax * packMod))){
				var nextCost = calculatePercentageBuildingCost(storage[x], job.increase, 0.25, tempMax);
				if (!previewOnly){
					resource.max *= 2;
					storageBuilding.purchased++;
					storageBuilding.owned++;
				}
				tempMax *= 2;
				tempTotal -= nextCost;
				amt -= nextCost;
				structCount++;
			}
			document.getElementById(storage[x] + "Added").innerHTML = structCount;
		}
		if (amt < 0) toggleMinusRes(true);
		if (!previewOnly) resource.owned += amt;
		if (!previewOnly && job.increase == "gems"){
			game.stats.gemsCollected.value += amt;
			checkAchieve("totalGems");
		}
		document.getElementById(job.increase + "BoostPreview").innerHTML = prettify(amt);
	}
}

function toggleMinusRes(on){
	document.getElementById("minusRes").style.display = (on) ? "block" : "none";
	document.getElementById("boostPreview").style.display = (on) ? "none" : "table";
}

function checkBundleForImp(what, justHighlight){
	for (var x = 0; x < boneTemp.bundle.length; x++) {
		if (boneTemp.bundle[x] == what) {
			if (!justHighlight) return true;
			document.getElementById("what").style.border = "2px solid green";
		}
	}
	return false;
}
//#337ab7
function addToBundle(what) {
	var bundleCount = boneTemp.bundle.length;
	var bundleBtn = document.getElementById("addBundleBtn");
	var bundleTitle = document.getElementById("bundleTitle");
	var bundleBtnColor;
	var bundleBtnText;
	var titleText;
	var rowColor;
	if (checkBundleForImp(what)){
		bundleCount--;
		rowColor = "";
		boneTemp.bundle.splice(boneTemp.bundle.indexOf(what), 1);
	}
	else {
		if (bundleCount == 4) return;
		boneTemp.bundle.push(what);
		bundleCount++;
		rowColor = "tealColor";
	}
	if (bundleCount == 4){
		bundleBtnColor = "#337ab7";
		bundleBtnText = 'Buy Bundle And 100 Bones (100 <span class="kredSpan"><img class="kredImg" src="imgs/kred_single.png"></img></span>)';
		titleText = "Everything seems to be in order here";
	}
	else{
		bundleBtnColor = "grey";
		bundleBtnText = "Select " + (4 - bundleCount) + " more Imps!";
		titleText = "Select " + (4 - bundleCount) + " Exotic Imports!";
	}
	bundleBtn.style.backgroundColor = bundleBtnColor;
	bundleBtn.innerHTML = bundleBtnText;
	bundleTitle.innerHTML = titleText;
	document.getElementById(what + "1").className = rowColor;
}

function purchaseBundleClicked(){
	if (boneTemp.bundle.length != 4) return;
	kredPurchase("0.imports");
}

function purchaseBundle(){
	game.global.b += 100;
	boneTemp.selectedImport = "";
	for (var x = 0; x < boneTemp.bundle.length; x++){
		game.unlocks.imps[boneTemp.bundle[x]] = true;
	}
	showBones();
	boneTemp.bundle = [];
}

function purchaseImport(){
	if (game.global.b < 50) return;
	if (!boneTemp.selectedImport) return;
	game.global.b -= 50;
	game.unlocks.imps[boneTemp.selectedImport] = true;
	showBones();
	boneTemp.bundle = [];
}

function purchaseMisc(what){
	switch (what){
		case "helium":
			if (game.global.b < 100) return;
			game.global.b -= 100;
			boostHe();
			break;
		case "heirloom":
			if (game.global.b < 30) return;
			game.global.b -= 30;
			createHeirloom(game.global.highestLevelCleared + 1, true);
			break;
	}
	showBones();
	successPurchaseFlavor();
}

function purchaseSingleRunBonus(what){
	if (what == "heliumy" && game.global.runningChallengeSquared) return;
	if (what == "quickTrimps" && (game.global.challengeActive == "Trapper" || game.global.challengeActive == "Trappapalooza")) return;
	var bonus = game.singleRunBonuses[what];
	if (!bonus) return;
	if (bonus.owned) return;
	if (game.global.b < bonus.cost) {
		showPurchaseBones();
		return;
	}
	game.global.b -= bonus.cost;
	bonus.owned = true;
	if (bonus.fire) bonus.fire();
	updateBones();
	successPurchaseFlavor();
}

function displaySingleRunBonuses(){
	var anyPortals = (getTotalPortals() == 0);
	var html = "<div class='boneBuyTitle'>Single Run Bonuses</div><div class='boneBuyDesc'>These all last until your next " + ((anyPortals) ? "soft reset" : "Portal") + ". Use them wisely!</div>";
	for (var item in game.singleRunBonuses){
		var bonus = game.singleRunBonuses[item];
		html += "<div id='" + item + "SingleBonusBox' class='singleBonusBox'>";
		document.getElementById('singleRunBonuses').style.marginTop = (anyPortals) ? "0" : "-2.5%";
		var btnClass;
		var btnText;
		if (bonus.owned){
			 btnClass = 'boneBtnStateOff';
			 btnText = 'Active!';
		}
		else {
			if (item == "heliumy" && game.global.runningChallengeSquared){
				btnClass = 'boneBtnStateOff';
				btnText = "Disabled on C<sup>" + ((game.global.universe == 1) ? 2 : 3) + "</sup>";
			}
			else if (item == "quickTrimps" && (game.global.challengeActive == "Trapper" || game.global.challengeActive == "Trappapalooza")){
				btnClass = 'boneBtnStateOff';
				btnText = "Disabled on " + game.global.challengeActive;
			}
			else{
				if (game.global.b < bonus.cost)
					btnClass = 'boneBtnStateOff'
				else 
					btnClass = 'boneBtnStateOn';
				btnText = bonus.name + " (" + bonus.cost + " bones)";
			}
		}
		html += "<div class='boneBtn " + btnClass + " pointer noselect' id='" + item + "PurchaseBtn'";
		if (btnClass == 'boneBtnStateOn'){
			var confText = bonus.confirmation;
			html += " onclick='tooltip(\"Confirm Purchase\", null, \"update\", \"" + confText + "\", \"purchaseSingleRunBonus(&#39;" + item + "&#39;)\", 20)'>" + btnText + "</div>";
		}
		else
			html += ">" + btnText + "</div>";
		html += bonus.text;
		html += "</div>";
	}
	document.getElementById("singleRunBonuses").innerHTML = html;
}

function displayPermaBoneBonuses(){
	var html = "";
	for (var item in game.permaBoneBonuses){
		var bonus = game.permaBoneBonuses[item];
		html += "<div id='" + item + "permaBonusBox' class='singleBonusBox'>";
		var btnClass;
		var btnText;
		var desc;
		if (item == "voidMaps" && game.global.totalPortals < 1){
			btnClass = 'boneBtnStateOff';
			btnText = '<span class="icomoon icon-lock"></span>';
			desc = "Locked until your first Portal!"
		}
		else if (bonus.owned == 10){
			 btnClass = 'boneBtnStateOff';
			 btnText = bonus.name + ' (10/10)';
			 desc = bonus.text;
		}
		else {
			var cost = getNextPermaBonePrice(item);
			desc = bonus.text;
			if (game.global.b < cost)
				btnClass = 'boneBtnStateOff'
			else 
				btnClass = 'boneBtnStateOn';
				btnText = bonus.name + " (" + bonus.owned +  "/10, " + cost + " Bones)";
		}
		html += "<div class='boneBtn " + btnClass + " pointer noselect' id='" + item + "PurchaseBtn'";
		if (btnClass == 'boneBtnStateOn'){
			var confText = bonus.confirmation;
			var cost = getNextPermaBonePrice(item);
			html += " onclick='tooltip(\"Confirm Purchase\", null, \"update\", \"" + confText + "\", \"purchasePermaBoneBonus(&#39;" + item + "&#39;)\"," + cost + ")'>" + btnText + "</div>";
		}
		else
			html += ">" + btnText + "</div>";
		html += desc;
		html += "</div>";
	}
	document.getElementById("permaBoneBonuses").innerHTML = html;
}

function getNextPermaBonePrice(what){
	var bonus = game.permaBoneBonuses[what];
	return Math.round((bonus.owned + 1) * 10);
}

function purchasePermaBoneBonus(what){
	var bonus = game.permaBoneBonuses[what];
	if (!bonus) return;
	if (bonus.owned >= 10) return;
	var cost = getNextPermaBonePrice(what);
	if (game.global.b < cost) return;
	game.global.b -= cost;
	bonus.owned++;
	if (typeof bonus.onPurchase !== 'undefined') bonus.onPurchase();
	showBones();
}

function successPurchaseFlavor(){
	document.getElementById("boneFlavorRow").innerHTML = "The Bone Trader takes the bones, casts a spell, then begins to make soup";
}

function updateBones() {
	document.getElementById("bonesOwned").innerHTML = prettify(game.global.b) + " " + ((game.global.b == 1) ? "Bone" : "Bones");
	updateSkeleBtn();
	displaySingleRunBonuses();
	displayPermaBoneBonuses();
	updateBoneBtnColors();
}

function updateBoneBtnColors(){
	var prices = {
		heliumPurchaseBtn: 100,
		heirloomPurchaseBtn: 30
	}
	for (var item in prices){
		var elem = document.getElementById(item);
		if (!elem) continue;
		var swapTo = game.global.b >= prices[item] ? "boneBtnStateOn" : "boneBtnStateOff";
		swapClass("boneBtnState", swapTo, elem);
	}
}

function boostHe(checkOnly) {
	var level = getHighestLevelCleared() - 19;
	var amt = (game.global.universe == 2) ? game.global.bestRadon : 30;
	if (!checkOnly) {
		if (!game.global.canRespecPerks) game.global.bonePortalThisRun = true;
		game.global.canRespecPerks = true;
	}
	if (level <= 0 && game.global.universe == 1) {
		if (checkOnly) return amt;
		game.global.heliumLeftover += amt;
		game.global.totalPortals++;
		checkAchieve("portals", null, false, true);
		displayPerksBtn();
		return;
	}
	for (var x = 0; x < level; x++) {
		amt += Math.round(Math.pow(1.23, Math.sqrt(x + 1)));
		amt += (x + 1);
	}
	if (game.global.universe != 2) {
		amt = (amt > game.global.bestHelium) ? amt : game.global.bestHelium;
	}
	if (checkOnly) return amt;
	if (amt >= 1189998819991197253) giveSingleAchieve("HeMergency");
	if (game.global.universe == 2){
		game.global.radonLeftover += amt;
		game.global.totalRadonEarned += amt;
	}
	else{
		game.global.heliumLeftover += amt;
		game.global.totalHeliumEarned += amt;
	}
	var fluffyStat = Fluffy.getBestExpStat();
	if (fluffyStat.valueTotal > 0){
		if (game.global.universe == 2) game.global.fluffyExp2 += fluffyStat.valueTotal;
		else game.global.fluffyExp += fluffyStat.valueTotal;
		Fluffy.handleBox();
	}
	if (game.stats.bestTokens.valueTotal >= 3 && game.global.universe == 1){
		var tokenReward = Math.floor(game.stats.bestTokens.valueTotal / 3)
		game.empowerments.Poison.tokens += tokenReward;
		game.empowerments.Wind.tokens += tokenReward;
		game.empowerments.Ice.tokens += tokenReward;
		if (game.global.buyTab == "nature")
			updateNatureInfoSpans();
	}
	if (game.global.universe == 2) game.global.totalRadPortals++;
	else game.global.totalPortals++;
	checkAchieve("portals", null, false, true);
	checkAchieve("totalHelium");
	checkAchieve("totalRadon");
	displayPerksBtn();
}

function countUnpurchasedImports(){
	var count = 0;
	for (var item in game.unlocks.imps){
		if (!game.unlocks.imps[item]) count++;
	}
	return count;
}

function showPurchaseBones() {
	if (typeof kongregate === 'undefined' && typeof greenworks === 'undefined') return;
	document.getElementById("boneWrapper0").style.display = "none";
	document.getElementById("boneWrapper1").style.display = "block";
	var steamBonesElem = document.getElementById('steamBonesReceived');
	if (steamBonesElem != null){
		steamBonesElem.innerHTML = game.global.SB;
	}
}

function hidePurchaseBones() {
	document.getElementById("boneWrapper0").style.display = "block";
	var elem1 = document.getElementById("boneWrapper1");
	if (elem1){
		elem1.style.display = "none";
		document.getElementById("boneWrapper2").style.display = "none";
	}
	var elem3 = document.getElementById("boneWrapper3");
	if (elem3){
		elem3.style.display = "none";
	}
}

function kredPurchase(what) {
	if (typeof kongregate === 'undefined') return;
	boneTemp.waitingFor = what;
	if (what == "0.imports" && boneTemp.bundle.length != 4) {
		hidePurchaseBones();
		document.getElementById("addToBundleRow").style.border = "1px solid green";
		return;
	}
	kongregate.mtx.purchaseItems([what], onPurchaseResult);
}

function startBundling(){
	document.getElementById("boneWrapper1").style.display = "none";
	document.getElementById("boneWrapper2").style.display = "block";
	document.getElementById("bundleTitle").innerHTML = "Select 4 Exotic Imports!";
	var btn = document.getElementById("addBundleBtn");
	btn.innerHTML = "First, Select 4 Imps";
	btn.style.backgroundColor = "grey";
	boneTemp.bundle = [];
	updateImports(1);
}

function onPurchaseResult(result) {
	if (!result.success)	{
		boneTemp.waitingFor = "";
		return;
	}
	if (result.success){
		var split = boneTemp.waitingFor.split('.');
		if (split[1] == "bones") game.global.b += parseInt(split[0], 10);
		if (split[1] == "imports") purchaseBundle();
		updateBones();
		hidePurchaseBones();
		var num = (split[0] > 0) ? split[0] : "";
		var tooltipText = "Your purchase of ";
		tooltipText += (split[0] > 0) ? split[0] + " bones has completed successfully!" : "the Exotic Imp-Ort Bundle has completed successfully, and your new Bad Guys will start spawning in your next Zone/map!";
		tooltipText += " Below is the export code for your save file. <b>Please copy, paste, and back this up to somewhere safe, just in case.</b> Thank you for your support!";
		tooltip('Export', null, 'update', tooltipText);
		boneTemp.waitingFor = "";
	}
}

var sugarRush = {
	getAttackStrength: function () {
		var minWorld = (game.global.universe == 2) ? 60 : 200;
		return (2 + Math.floor((game.global.world - minWorld) / 100));
	},
	icon: 'icomoon icon-bag',
	timeEach: 600,
	maxTime: 1500,
	iconEnabled: false,
	start: function () {
		game.global.sugarRush += this.timeEach;
		if (game.global.sugarRush > this.maxTime)
			game.global.sugarRush = this.maxTime;
		this.enableIcon();
	},
	getIconElement: function (){
		return document.getElementById('sugarRushBuff');
	},
	enableIcon: function () {
		var elem = this.getIconElement();
		if (!elem){
			document.getElementById('goodGuyName').innerHTML += ' <span class="badge antiBadge sugarRushBadge" id="sugarRushBuff" onmouseover="tooltip(\'Sugar Rush\', \'customText\', event, sugarRush.tooltipText())" onmouseout="tooltip(\'hide\')"><span class="' + this.icon + '"></span></span>';			
			return;
		}
		elem.style.display = 'inline-block';
		this.iconEnabled = true;
	},
	disableIcon: function () {
		var elem = this.getIconElement();
		if (!elem)
			return;
		elem.style.display = 'none';
		this.iconEnabled = false;
	},
	tick: function () {
		game.global.sugarRush--;
		if (game.global.sugarRush <= 0){
			game.global.sugarRush = 0;
			this.disableIcon();
			return;
		}
		if (!this.iconEnabled) this.enableIcon();
	},
	tooltipText: function () {
		var timeLeft = game.global.sugarRush;
		if (timeLeft < 60) {
			timeLeft += " second" + ((timeLeft == 1) ? "" : "s");
		}
		else {
			timeLeft = Math.floor(timeLeft / 60);
			timeLeft += " minute" + ((timeLeft == 1) ? "" : "s");
		}
		return "Trimps are not at all used to sugar, but they seem to be really enjoying it! <b>Attack is increased " + this.getAttackStrength() + "X for the next " + timeLeft + "</b>.";
	}
}

function givePumpkimpLoot(){
	var eligible = ["food", "food", "food", "nothing", "nothing", "nothing", "nothing", "nothing", "wood", "metal"];
	var success = [
		"Oops, that Pumpkimp just wanted to give you some candy. You found ",
		"When checking the Pumpkimp for loot, you find a pouch that says to take one. You take all ",
		"That Pumpkimp gave you ",
		"Right before you finish the Pumpkimp off, it throws a large bag at you and rolls away. Inside, you find ",
		"This Pumpkimp was still in pretty good shape, so you let your Trimps carve it. Inside, they found ",
		"That Pumpkimp was so smashed that he gave you ",
		"You dig through what's left of the Pumpkimp and find ",
		"Aww man, there's seeds and orange stuff everywhere. At least you found ",
		"You're not wearing a costume, but you'll still take this ",
		"Heck yes, this Pumpkimp has your favorite treat! You picked up ",
		"What a haunting sight! The Pumpkimp was punted by a plump Trimp after the fight. As it flies away, it drops "
	];
	var failures = [
		"That Pumpkimp gave you nothing! What a jerk!",
		"Lame, this one just has stringy stuff in it.",
		"You crack open your newly captured Pumpkimp and find... Nothing!",
		"Right before you finish the Pumpkimp off, it winks at you and rolls away. That was pretty weird.",
		"As the Pumpkimp takes his final breath, he manages to mutter the word 'Trick'. No loot here.",
		"You search the Pumpkimp for loot, but find nothing. Someone wasn't in the holiday spirit!",
		"That Pumpkimp rolled away before you could finish him off, yelling stuff about tricks.",
		"Thanks, you hate getting tricks instead of treats.",
		"You might have hit that Pumpkimp a bit too hard, there's nothing left to give you candy."
	];
	var attackBuff = [
		"The Pumpkimp suddenly bursts, spewing huge amounts of candy into the air. Your Trimps scramble about to pick up all they can and gain Sugar Rush!",
		"This Pumpkimp was so large that your Trimps could feast for weeks on all the candy inside. Oh, nope, looks like they'll be done in about 10 minutes. In the mean time, they should have a bit of extra energy!",
		"This Pumpkimp was totally stuffed with various types of sugary things. You give them all to your Trimps, which results in a huge boost of energy!",
		"Your Trimps have begun carrying pillowcases with them in hopes of a legendary Pumpkimp like the one you just found. Filled to the brim with sugary goodies, this Pumpkimp should sate your Trimps for a few minutes!"
	];
	if (game.jobs.Dragimp.owned > 0) eligible.push("gems");
	if (game.upgrades.Explorers.allowed > 0) eligible.push("fragments");
	if (game.global.universe == 1){
		if (game.global.world > 200 && !game.global.mapsActive) eligible.push("attack");
	}
	else if (game.global.universe == 2){
		if (game.global.world > 60 && !game.global.mapsActive) eligible.push("attack");
	}
	//I really wanted to call it Pumpkin Seed, but this can probably be useful for other holidays without bogging down the save file more.
	var roll = (game.global.mapsActive) ? Math.floor(Math.random() * eligible.length) : getRandomIntSeeded(game.global.holidaySeed++, 0, eligible.length);
	var item = eligible[roll];
	if (item == "metal" && (challengeActive("Metal") || game.global.challengeActive == "Transmute")) item = "nothing";
	if (item == "nothing") {
		var failNumber = Math.floor(Math.random() * failures.length);
		message(failures[failNumber], "Loot", "*magic-wand", "pumpkimp", "events");
		return;
	}
	if (item == "attack"){
		sugarRush.start();
		var rollNumber = Math.floor(Math.random() * attackBuff.length);
		message(attackBuff[rollNumber], "Loot", "*bag", "pumpkimp", "events");
		return;
	}
	var lootStrength = (game.global.mapsActive) ? 3 : 20;
	var minRoll = (game.global.mapsActive) ? 1 : 30;
	var seconds = Math.floor(Math.random() * lootStrength) + minRoll;
	var lootRoll = Math.floor(Math.random() * lootStrength) + minRoll;
	var amt = simpleSeconds(item, seconds);
	if (item != "science") amt += rewardResource(item, 0.5 * lootRoll, 50);
	if (game.global.mapsActive){
		amt = scaleToCurrentMap(amt, true);
	}
	addResCheckMax(item, amt);
	var messageNumber = Math.floor(Math.random() * success.length);
	message(success[messageNumber] + prettify(amt) + " " + item + "!", "Loot", "*magic-wand", "pumpkimp", "events");
}

function activateTurkimpPowers() {
	//15 mins = 900K ms
	//25 mins = 1.5M ms
	var addEach = (game.talents.turkimp.purchased) ? 1200000 : 900000;
	var maxTurk = (game.talents.turkimp.purchased) ? 2100000 : 1500000;
	var timeToExpire = game.global.turkimpTimer;
	timeToExpire += addEach;
	if (timeToExpire > maxTurk) timeToExpire = maxTurk;
	game.global.turkimpTimer = timeToExpire;
	if (game.talents.turkimp2.purchased) return;
	document.getElementById("turkimpBuff").style.display = "block";
	if (game.global.playerGathering) setGather(game.global.playerGathering);
	var possibilities = [
	"Yum, Turkimp! You eat some and put some in your pockets for later.",
	"You seem very happy to see that this land came with free food too! You gobble up some turkimp.",
	"You're quite grateful to finally eat some protein! You eat a bunch of Turkimp and find a Trimp to carry the rest back for you.",
	"Apparently your scientists are vegetarians. Hurray, more Turkimp for you!",
	"You hear a loud gobbling sound in the distance, it sounds angry. You disregard it because this Turkimp is delicious!",
	"Ah, Turkimp. Nature's version of a Chickimp with a weirder head. Sure is tasty! You eat your fill and save some for later."
	];
	var roll = Math.floor(Math.random() * possibilities.length);
	message(possibilities[roll], "Loot", "*spoon-knife", "turkimp", "secondary");

}

function givePresimptLoot(){
	var eligible = ["food", "food", "wood", "wood", "metal",  "metal", "metal", "metal", "metal", "metal", "metal"];
	var boneTime = 30;
	boneTime *= 60000;
	if (new Date().getTime() > (game.global.lastBonePresimpt + boneTime))
		eligible.push("bones");
	var success = [
		"Your fingers are cold and numb, but that won't stop them from opening up this Presimpt! Inside you find ",
		"You contemplate saving this Presimpt to give to a Trimp, but you really really like opening them yourself. So you do, and you find ",
		"Imagine losing a fight to a Presimpt. You got this one though, and inside you see ",
		"You wonder what actually created these evil sentient gifts. However you instantly forget your concerns when you see the ",
		"You were hoping for a TV or something, but you'll have to make do with the ",
		"You run to the motionless Presimpt and give him a good shake. Sounds like ",
		"One of your Trimps excitedly grabs the Presimpt and brings it to you. You let him open it to find ",
		"Nothing like some global conquest during the Holidays! You open your Presimpt and find ",
		"You're a bit curious as to where the Presimpts hide during the rest of the year, but you forget about it when you see your new shiny ",
		"You'll never complain about free stuff, and this Presimpt is full of it! Found ",
		"You hurriedly open up the Presimpt, and find ",
		"Ooh look, a Presimpt! You tear it open and receive ",
		"Nifty! That Presimpt was carrying around ",
		"Presimpts for everyone! Wait there's only one. Presimpt for you! With ",
		"This Presimpt has little snowman markings all over it! Inside, you find "];
	if (game.global.spireRows >= 15 || game.global.universe == 2){
		var name = Fluffy.getName();
		success.push(name + " seems really excited about all the Presimpts, so you let him open this one to find ");
		success.push("Without even a second of pause, " + name + " zooms to the Presimpt and tears it open. He brings you back the ");
		success.push(name + " is too busy eating the purple snow to open this one, so you do it yourself. Inside, you find ");
	}
	if (game.jobs.Dragimp.owned > 0) eligible.push("gems", "gems", "gems", "gems");
	else eligible.push("food", "food", "wood", "metal");
	if (game.upgrades.Explorers.allowed > 0) eligible.push("fragments", "fragments", "fragments");
	else eligible.push("food", "wood", "metal");
	var roll = Math.floor(Math.random() * eligible.length);
	var item = game.global.presimptStore;
	game.global.presimptStore = eligible[roll];
	if (item == "bones") {
		message("You shake the Presimpt before opening it, and can tell there's something special in this one. Yup! That thoughtful Presimpt gave you a perfectly preserved bone!", "Loot", "*gift", "presimpt presimptBones");
		game.global.lastBonePresimpt = new Date().getTime();
		game.global.b++;
		updateSkeleBtn();
		return;
	}
	var randomBoost = Math.floor(Math.random() * 4) + 2;
	var amt = rewardResource(item, randomBoost, (game.global.lastClearedCell + 1));
	var messageNumber = Math.floor(Math.random() * success.length);
	message(success[messageNumber] + prettify(amt) + " " + item + "!", "Loot", "*gift", "presimpt", "events");
}

function updateTurkimpTime(drawIcon = false) {
	const elem = document.getElementById('turkimpTime');

	if (game.talents.turkimp2.purchased) {
		const icon = `<span class="icomoon icon-infinity"></span>`;
		if (elem && elem.innerHTML !== icon) elem.innerHTML = icon;
		return;
	}

	if (game.global.turkimpTimer <= 0) return;

	if (!drawIcon) game.global.turkimpTimer -= 100;
	let timeRemaining = game.global.turkimpTimer;

	if (timeRemaining <= 0) {
		game.global.turkimpTimer = 0;
		document.getElementById('turkimpBuff').style.display = 'none';
		if (game.global.playerGathering) setGather(game.global.playerGathering);
		elem.innerHTML = '00:00';
		return;
	}

	timeRemaining /= 1000;
	let mins = Math.floor(timeRemaining / 60);
	let seconds = Math.ceil(timeRemaining % 60);

	if (seconds === 60) {
		seconds = 0;
		mins++;
	}

	const formattedMins = mins < 10 ? `0${mins}` : mins;
	const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
	const formattedTime = `${formattedMins}:${formattedSeconds}`;
	if (elem && elem.innerHTML !== formattedTime) elem.innerHTML = formattedTime;
}

function formatMinutesForDescriptions(number){
	var text;
	var minutes = Math.floor(number % 60);
	var hours = Math.floor(number / 60);
	if (hours == 0) text = minutes + " min" + ((minutes == 1) ? "" : "s");
	else if (minutes > 0) {
		if (minutes < 10) minutes = "0" + minutes;
		text = hours + ":" + minutes;
	}
	else {
		var s = (hours == 1) ? "" : "s";
		text = hours + " hour" + s;
	}
	return text;
}

function formatSecondsForDescriptions(number){
	var text;
	var seconds = Math.round(number % 60);
	var minutes = Math.floor(number / 60);
	if (minutes == 0) text = seconds + " sec" + ((seconds == 1) ? "" : "s");
	else if (seconds > 0) {
		if (seconds < 10) seconds = "0" + seconds;
		text = minutes + ":" + seconds;
	}
	else {
		var s = (minutes > 1) ? "s" : "";
		text = minutes + " min" + s;
	}
	return text;	
}

function formatSecondsForZoneTime(number){
	var text;
	var seconds = Math.round(number % 60);
	var minutes = Math.round(Math.floor(number / 60) % 60);
	var hours = Math.floor(number / 3600);
	if (minutes == 0 && hours == 0) text = seconds + " second" + needAnS(seconds);
	else if (minutes < 60 && hours == 0){
		text = minutes + " min" + needAnS(minutes) + ", " + seconds + " sec" + needAnS(seconds);
	}
	else {
		if (seconds < 10) seconds = "0" + seconds;
		if (minutes < 10) minutes = "0" + minutes;
		if (hours < 10) hours = "0" + hours;
		text = hours + ":" + minutes + ":" + seconds;
	}
	return text;	
}

function getMinutesThisPortal(){
	var timeSince = getGameTime() - game.global.portalTime;
	timeSince /= 1000;
	return Math.floor(timeSince / 60);
}



//Timeouts
function costUpdatesTimeout() {
	checkButtons("buildings");
    checkButtons("jobs");
    checkButtons("equipment");
    checkButtons("upgrades");
    checkTriggers();
	if (tooltipUpdateFunction && !usingScreenReader) tooltipUpdateFunction();
	setTimeout(costUpdatesTimeout, 250);
}

function toggleVoidMaps(updateOnly){
	var elem = document.getElementById("voidMapsBtn");
	var mapsHere = document.getElementById("mapsHere");
	var voidMapsHere = document.getElementById("voidMapsHere");
	var mapsCreate = document.getElementById("mapsCreateRow");
	var heirRare = document.getElementById("heirRare"); //it rhymes
	if (!updateOnly) game.global.voidMapsToggled = !game.global.voidMapsToggled;
	else if (!game.global.preMapsActive) game.global.voidMapsToggled = false;
	if (!game.global.voidMapsToggled){
		voidMapsHere.style.display = "none";
		mapsHere.style.display = "block";
		mapsCreate.style.display = "block";
		heirRare.style.display = "none";
		elem.innerHTML = "Void Maps (" + game.global.totalVoidMaps + ")";
		elem.style.display = (game.global.totalVoidMaps <= 0 || !game.global.preMapsActive) ? "none" : "block";
		hideAdvMaps(true);
		return;
	}
	elem.style.display = "block";
	voidMapsHere.style.display = "block";
	mapsHere.style.display = "none";
	mapsCreate.style.display = "none";
	heirRare.style.display = "block";
	setHeirRareText();
	hideAdvMaps(true, true);
	elem.innerHTML = "Back";
}

function toggleAllAutoStructures(btnElem){
	var elems = document.getElementsByClassName('autoCheckbox');
	var nextOn = btnElem.dataset.nexton == 'true';
	for (var x = 0; x < elems.length; x++){
		swapNiceCheckbox(elems[x], nextOn);
	}
	btnElem.dataset.nexton = !nextOn;
	btnElem.innerHTML = "Toggle All Structures " + ((nextOn) ? "Off" : "On");
	var newClass = (nextOn) ? "colorDanger" : "colorPrimary";
	swapClass("color", newClass, btnElem);
}

function setAllAutoStructurePercent(selectElem){
	var value = selectElem.value;
	var elems = document.getElementsByClassName('structSelect');
	var options = ["0.1", "1", "5", "10", "25", "50", "99"];
	var selectedIndex = options.indexOf(value);
	for (var x = 0; x < elems.length; x++){
		var elem = elems[x];
		elem.selectedIndex = selectedIndex;
	}
}

function getAutoStructureSetting(){
	return (game.global.universe == 2) ? game.global.autoStructureSettingU2 : game.global.autoStructureSetting;
}

function toggleAutoStructure(noChange, forceOff){
	var setting = getAutoStructureSetting();
	if (!noChange) setting.enabled = !setting.enabled;
	var btnElem = document.getElementById('autoStructureBtn');
	if (bwRewardUnlocked("AutoStructure") && !forceOff)
		btnElem.style.display = 'block';
	else{
		btnElem.style.display = 'none';
		return;
	}
	var color = (setting.enabled) ? "colorSuccess" : "colorDanger";
	swapClass("color", color, btnElem);
	var text = (setting.enabled) ? "AutoStructure On" : "AutoStructure Off";
	document.getElementById('autoStructureText').innerHTML = text;
}

function getAutoJobsSetting(){
	return (game.global.universe == 2) ? game.global.autoJobsSettingU2 : game.global.autoJobsSetting;
}

function toggleAutoJobs(noChange, forceOff){
	var setting = getAutoJobsSetting();
	if (!noChange) setting.enabled = !setting.enabled;
	var btnElem = document.getElementById('autoJobsBtn');
	if (bwRewardUnlocked("AutoJobs") && !forceOff)
		btnElem.style.display = 'block';
	else{
		btnElem.style.display = 'none';
		return;
	}
	var color = (setting.enabled) ? "colorSuccess" : "colorDanger";
	swapClass("color", color, btnElem);
	var text = (setting.enabled) ? "AutoJobs On" : "AutoJobs Off";
	document.getElementById('autoJobsText').innerHTML = text;
}

function toggleAutoEquip(noChange, forceOff){
	var setting = getAutoEquipSetting();
	if (!noChange) setting.enabled = !setting.enabled;
	var btnElem = document.getElementById('autoEquipBtn');
	if (game.global.autoEquipUnlocked && !forceOff)
		btnElem.style.display = 'block';
	else{
		btnElem.style.display = 'none';
		return;
	}
	var color = (setting.enabled) ? "colorSuccess" : "colorDanger";
	swapClass("color", color, btnElem);
	var text = (setting.enabled) ? "AutoEquip On" : "AutoEquip Off";
	document.getElementById('autoEquipText').innerHTML = text;
}

function getAutoGoldenSetting(){
	return (game.global.universe == 1) ? game.global.autoGolden : game.global.autoGoldenU2;
}

function setAutoGoldenSetting(setTo){
	if (game.global.universe == 1) game.global.autoGolden = setTo;
	else game.global.autoGoldenU2 = setTo;
}

var lastAutoGoldenToggle = -1;
function toggleAutoGolden(noChange){
	if (!noChange && ctrlPressed && game.global.canGuString){
		archoGolden.popup();
		return;
	}
	var max = (getTotalPortals() > 0) ? 5 : 3;
	if (game.global.canGuString) max++;
	if (getAutoGoldenSetting() >= max) setAutoGoldenSetting(0);
	if (!noChange && getAutoGoldenSetting() != -1){
		setAutoGoldenSetting(getAutoGoldenSetting() + 1);
		if (getAutoGoldenSetting() == max)
			setAutoGoldenSetting(0);
		lastAutoGoldenToggle = new Date().getTime();
	}
	var setting = getAutoGoldenSetting();
	var btnElem = document.getElementById('autoGoldenBtn');
	if (setting != -1)
		btnElem.style.display = 'block';
	else{
		btnElem.style.display = 'none';
		return;
	}
	var color = "settingBtn" + setting;
	swapClass("settingBtn", color, btnElem);
	var texts = ["AutoGold Off", "AutoGold Helium", "AutoGold Battle"];
	if (getTotalPortals() > 0){
		texts.push("AutoGold Voidlium");
		texts.push("AutoGold Voidtle")
	}
	if (game.global.universe == 2){
		texts[1] = "AutoGold Radon";
		if (texts.length > 3) texts[3] = "AutoGold Voidon";
	}
	if (game.global.canGuString){
		texts.push("Custom AutoGold");
	}
	var text = texts[setting];
	if (!noChange && setting != 0) text += ' <span id="autoGoldenTimeLeft">(4)</span>';
	document.getElementById('autoGoldenText').innerHTML = text;
}

function saveAutoJobsConfig(){
	var setting = getAutoJobsSetting();
	var checkboxes = document.getElementsByClassName('autoCheckbox');
	var quantboxes = document.getElementsByClassName('jobConfigQuantity');
	var ratios = ["Farmer", "Lumberjack", "Miner", "Scientist"];
	if (!validateJobRatios()) return;
	for(var x = 0; x < checkboxes.length; x++){
		var name = checkboxes[x].id.split('autoJobCheckbox')[1];
		var checked = checkboxes[x].dataset.checked == 'true';
		if (!checked && !setting[name]) continue;
		if (!setting[name]) setting[name] = {};
		setting[name].enabled = checked;
		if (ratios.indexOf(name) != -1){
			setting[name].ratio = parseFloat(quantboxes[x].value);
			if (name == "Scientist") {
				var max = quantboxes[quantboxes.length - 1].value;
				max = convertNotationsToNumber(max);
				max = isNumberBad(max) ? 0 : max;
				setting.Scientist.buyMax = max;
			}
			continue;
		}
		setting[name].value = parseFloat(document.getElementById('autoJobSelect' + name).value) / 100;
		var max = convertNotationsToNumber(quantboxes[x].value);
		max = (isNumberBad(max)) ? 0 : max;
		if (game.jobs[name].max && max > game.jobs[name].max) max = game.jobs[name].max;
		setting[name].buyMax = max;
	}
	var gatherElem = document.getElementById('autoJobSelfGather');
	if (gatherElem){
		if (gatherElem.value) setting.portalGather = gatherElem.value;
		else delete setting.portalGather;
	}
	cancelTooltip();
}

function validateJobRatios(){
	var ratios = ["Farmer", "Lumberjack", "Miner", "Scientist"];
	var errorElem = document.getElementById('autoJobsError');
	for (var x = 0; x < ratios.length; x++){
		var check = document.getElementById('autoJobCheckbox' + ratios[x]);
		var quant = document.getElementById('autoJobQuant' + ratios[x]);
		if (check == null || quant == null) return false;
		if (!check.checked) continue;
		quant = parseFloat(quant.value);
		if (quant < 0){
			errorElem.innerHTML = "Cannot use a number smaller than 0 for " + ratios[x] + " ratio.";
			return false;
		}
		if (isNumberBad(quant)){
			errorElem.innerHTML = "Must use an actual number for " + ratios[x] + " ratio.";
			return false;
		}
	}
	errorElem.innerHTML = "";
	return true;
}

function saveAutoStructureConfig(){
	var setting = getAutoStructureSetting();
	var checkboxes = document.getElementsByClassName('autoCheckbox');
	var quantboxes = document.getElementsByClassName('structConfigQuantity');
	for(var x = 0; x < checkboxes.length; x++){
		var name = checkboxes[x].id.split('structConfig')[1];
		var checked = (checkboxes[x].dataset.checked == 'true');
		if (!checked && !setting[name]) continue;
		if (!setting[name]) setting[name] = {};
		setting[name].enabled = checked;
		setting[name].value = document.getElementById('structSelect' + name).value;
		var max = parseInt(quantboxes[x].value, 10);
		if (max > 10000) max = 10000;
		max = (isNumberBad(max)) ? 0 : max;
		setting[name].buyMax = max;
	}
	if (game.global.universe == 1 && getHighestLevelCleared() >= 229){
		var nurseryZoneElem = document.getElementById('structZoneNursery');
		if (nurseryZoneElem !== null && nurseryZoneElem.value >= 1 && !isNumberBad(nurseryZoneElem.value)){
			setting.NurseryZones = nurseryZoneElem.value;
		}
		else if (typeof setting.NurseryZones !== 'undefined') 
			delete setting.NurseryZones;
	}
	cancelTooltip();
}

function saveAutoEquipConfig(){
	var setting = getAutoEquipSetting();
	var checkboxes = document.getElementsByClassName('autoCheckbox');
	var quantboxes = document.getElementsByClassName('equipConfigQuantity');
	for(var x = 0; x < checkboxes.length; x++){
		var name = checkboxes[x].id.split('equipConfig')[1];
		var checked = (checkboxes[x].dataset.checked == 'true');
		if (!checked && !setting[name]) continue;
		if (!setting[name]) setting[name] = {};
		setting[name].enabled = checked;
		setting[name].value = document.getElementById('equipSelect' + name).value;
		var max = parseInt(quantboxes[x].value, 10);
		if (max > 10000) max = 10000;
		max = (isNumberBad(max)) ? 0 : max;
		setting[name].buyMax = max;
	}
	var highestTierElem = document.getElementById('highestTierOnlyBtn');
	setting.highestTier = (highestTierElem.dataset.on == 'true');
	cancelTooltip();
}

function buyAutoStructures(){
	if (game.options.menu.pauseGame.enabled)
		return;
	var setting = getAutoStructureSetting();
	var maxBuild = 1;
	if (bwRewardUnlocked("DoubleBuild")) maxBuild = 2;
	if (bwRewardUnlocked("DecaBuild")) maxBuild = 10;
	if (!setting.enabled || !bwRewardUnlocked("AutoStructure")) return;
	var order = ["Tribute", "Smithy", "Nursery", "Laboratory", "Gym", "Warpstation", "Hut", "House", "Mansion", "Hotel", "Resort", "Gateway", "Collector", "Wormhole"];
	for (var x = 0; x < order.length; x++){
		var item = order[x];
		if (!setting[item]) continue;
		if (typeof setting.NurseryZones !== 'undefined' && game.global.world < setting.NurseryZones && item == "Nursery")
			continue;
		var building = game.buildings[item];
		if (building.locked) continue;
		var purchased = building.purchased;
		var buyMax = setting[item].buyMax;
		if (item == "Nursery" && (game.global.world >= 230 || game.global.challengeActive == "Eradicated"))
			purchased -= game.stats.decayedNurseries.value;
		if (typeof buyMax !== 'undefined' && buyMax > 0){
			if (purchased >= buyMax)
				continue;
			if (maxBuild + purchased > buyMax) maxBuild = buyMax - purchased;
		}
		if (!game.buildings[item].locked && setting[item].enabled){
			var settingValue = parseFloat(setting[item].value);
			var wantToBuy = calculateMaxAfford(game.buildings[item], true, false, false, setting[item].buyMax, settingValue / 100);
			if (wantToBuy > maxBuild) wantToBuy = maxBuild;
			if (game.global.buildingsQueue.length < 10 && wantToBuy > 0){
				if (canAffordBuilding(item, false, false, false, false, wantToBuy, settingValue)){
					buyBuilding(item, true, true, wantToBuy);
				}
				else if (canAffordBuilding(item, false, false, false, false, 1, settingValue)){
					buyBuilding(item, true, true, 1);
				}
			}
		}
	}
	if (setting.Gigastation && setting.Gigastation.enabled && game.upgrades.Gigastation.allowed > game.upgrades.Gigastation.done && game.buildings.Warpstation.owned >= setting.Gigastation.buyMax){
		var costMult = parseFloat(setting.Gigastation.value);
		costMult /= 100;
		var costs = game.upgrades.Gigastation.cost.resources;
		var owned = game.upgrades.Gigastation.done;
		if (
			(game.resources.science.owned * costMult) >= (costs.science[0] * Math.pow(costs.science[1], owned)) &&
			(game.resources.gems.owned * costMult) >= (costs.gems[0] * Math.pow(costs.gems[1], owned)) &&
			(game.resources.metal.owned * costMult) >= (costs.metal[0] * Math.pow(costs.metal[1], owned))
		) autoBuyUpgrade('Gigastation');
	}
}

function getAutoEquipSetting(){
	return (game.global.universe == 2) ? game.global.autoEquipSettingU2 : game.global.autoEquipSetting;
}

function setAllAutoEquipPercent(type, selectElem){
	var value = selectElem.value;
	var elems = document.getElementsByClassName('equipSelect' + type);
	var options = ["0.1", "1", "5", "10", "25", "50", "99"];
	var selectedIndex = options.indexOf(value);
	for (var x = 0; x < elems.length; x++){
		var elem = elems[x];
		elem.selectedIndex = selectedIndex;
	}
}

function toggleAutoEquipHighestTier(btnElem){
	var on = btnElem.dataset.on == 'true';
	btnElem.dataset.on = !on;
	btnElem.innerHTML = "Only Buy From Highest Tier " + ((on) ? "Off" : "On");
	var newClass = (on) ? "colorDanger" : "colorSuccess";
	swapClass("color", newClass, btnElem);
}

function uncheckAutoEquip(type, btnElem){
	var elems = document.getElementsByClassName('checkbox' + type);
	var nextOn = btnElem.dataset.nexton == 'true';
	for (var x = 0; x < elems.length; x++){
		swapNiceCheckbox(elems[x], nextOn);
	}
	btnElem.dataset.nexton = !nextOn;
	btnElem.innerHTML = "Toggle All " + ((type == "Wep") ? "Weapons" : "Armor") + " " + ((nextOn) ? "Off" : "On");
	var newClass = (nextOn) ? "colorDanger" : "colorPrimary";
	swapClass("color", newClass, btnElem);
}

function buyAutoEquip(){
	if (loops - 20 < lastPurchasedPrestige) return;
	if (game.options.menu.pauseGame.enabled)
		return;
	var setting = getAutoEquipSetting();
	if (!setting.enabled || !game.global.autoEquipUnlocked) return;
	var highestPrestige = 0;
	if (setting.highestTier){
		for (var item in game.equipment){
			if (!setting[item]) continue;
			if (!setting[item].enabled) continue;
			var equip = game.equipment[item];
			if (equip.prestige > highestPrestige) highestPrestige = equip.prestige;
		}
	}
	for (var item in game.equipment){
		if (!setting[item]) continue;
		if (!setting[item].enabled) continue;
		var equip = game.equipment[item];
		if (setting.highestTier & equip.prestige < highestPrestige) continue;
		if (equip.locked) continue;
		var level = equip.level;
		var buyMax = setting[item].buyMax;
		if (buyMax > 0 && level >= buyMax) continue;
		var settingValue = parseFloat(setting[item].value);
		var wantToBuy = calculateMaxAfford(game.equipment[item], false, true, false, buyMax, settingValue / 100);
		if (buyMax != 0 && (wantToBuy > (buyMax - equip.level))) wantToBuy = buyMax - equip.level;
		if (wantToBuy > 0) buyEquipment(item, true, true, wantToBuy);
	}	
}


function toggleAutoTrap(updateOnly) {
	var elem = document.getElementById("autoTrapBtn");
	if (!game.global.trapBuildAllowed){
		elem.style.display = "none";
		elem.innerHTML = "AutoTraps Off";
		swapClass("color", "colorDanger", elem);
		return;
	}
	else if (elem.style.display == "none") fadeIn("autoTrapBtn", 10);
	if (!updateOnly) game.global.trapBuildToggled = !game.global.trapBuildToggled;
	if (game.global.trapBuildToggled){
		swapClass("color", "colorSuccess", elem);
		elem.innerHTML = "AutoTraps On";
		return;
	}
	swapClass("color", "colorDanger", elem);
	elem.innerHTML = "AutoTraps Off";
}

function toggleAutoStorage(noChange){
	if (!noChange) game.global.autoStorage = !game.global.autoStorage;
	var elem = document.getElementById("autoStorageBtn");
	if (game.global.autoStorage) {
		swapClass("color", "colorSuccess", elem);
		elem.innerHTML = "AutoStorage On";
	}
	else {
		swapClass("color", "colorDanger", elem);
		elem.innerHTML = "AutoStorage Off";
	}
}


function autoStorage(){
	var toCheck = ["food", "wood", "metal"];
	var storage = ["Barn", "Shed", "Forge"];
	for (var x = 0; x < 3; x++){
		var resource = game.resources[toCheck[x]];
		var max = Math.floor(resource.max + (resource.max * game.portal.Packrat.modifier * getPerkLevel("Packrat")));
		max = calcHeirloomBonus("Shield", "storageSize", max);
		if (resource.owned >= (max * 0.99) && canAffordBuilding(storage[x], false)) {
			buyBuilding(storage[x], false, true);
			break;
		}
	}
}

function toggleAutoUpgrades(noChange){
	if (!game.global.autoUpgradesAvailable) {
		game.global.autoUpgrades = 0;
		noChange = true;
	}
	var autoUpgradeToggles = ["AutoUpgrade Off", "AutoUpgrade On"];
	var autoUpgradeColors = [ "colorDanger", "colorSuccess", "colorYellow"];
	if (game.stats.highestVoidMap.valueTotal >= 250) autoUpgradeToggles.push("Auto No Coords")
	var elem = document.getElementById("autoUpgradeBtn");
	if (!noChange) game.global.autoUpgrades++;
	if (game.global.autoUpgrades >= autoUpgradeToggles.length) game.global.autoUpgrades = 0;
	swapClass("color", autoUpgradeColors[game.global.autoUpgrades], elem);
	elem.innerHTML = autoUpgradeToggles[game.global.autoUpgrades];
}

var lastAutoPrestigeToggle = -1;
var pantsMode = false;
function toggleAutoPrestiges(noChange){
	var autoPrestigeToggles = ["AutoPrestige Off", "AutoPrestige All", "Weapons Only", "Weapons First"];
	if (pantsMode) autoPrestigeToggles.push("PANTS ONLY");
	if (!noChange) {
		game.global.autoPrestiges++;
		lastAutoPrestigeToggle = new Date().getTime();
	}
	if (game.global.autoPrestiges >= autoPrestigeToggles.length) game.global.autoPrestiges = 0;
	var elem = document.getElementById("autoPrestigeBtn");
	swapClass("settingBtn", "settingBtn" + game.global.autoPrestiges, elem);
	elem.innerHTML = autoPrestigeToggles[game.global.autoPrestiges];
}

function autoUpgrades() {
	autoGoldenUpgrades();
	var autoUpgradeSetting = game.global.autoUpgrades;
	var autoPrestigeSetting = game.global.autoPrestiges;
	if (!autoUpgradeSetting && !autoPrestigeSetting) return;
	if (game.options.menu.pauseGame.enabled == 1) return;
	var timerCheck = (lastAutoPrestigeToggle == -1 || (new Date().getTime() - lastAutoPrestigeToggle >= 2000));
	if (timerCheck) lastAutoPrestigeToggle = -1;
	var equipmentAvailable = {armor: [], weapons: []}
	var boughtUpgrade = false;
	for (var item in game.upgrades){
		var upgradeObj = game.upgrades[item];
		if (autoUpgradeSetting == 2 && item == "Coordination") continue;
		if (upgradeObj.locked || item == "Shieldblock" || item == "Gigastation" || upgradeObj.isRelic) continue;
		if (upgradeObj.prestiges){
			if (autoPrestigeSetting == 0) continue;
			if (game.equipment[upgradeObj.prestiges].locked == 1) continue;
			var type = (typeof game.equipment[upgradeObj.prestiges].health === 'undefined') ? "weapons" : "armor";
			equipmentAvailable[type].push(item);
			continue;
		}
		if (!autoUpgradeSetting) continue;
		if ((!boughtUpgrade || game.global.gridArray[0].name == "Liquimp") && autoBuyUpgrade(item)){
			if (autoUpgradeSetting != 0 && timerCheck)
				boughtUpgrade = true;
			else
				return;
		}
	}
	if (autoPrestigeSetting != 0 && timerCheck) autoPrestiges(equipmentAvailable);
}

var archoGolden = {
	popup: function(){
		var text = "<div id='ArchaeologyAutomatorError' style='color: red'></div>";
		text += "<div>Below you'll need to enter a string for the Automator to parse. Your string should be separated by commas, and will indicate priority for Golden Upgrade purchases.<br/><br/>An example of a viable string would be '8v,10b,10r,10b'. <b>Use 'r' for Golden Radon (interchangeable with 'h' for Golden Helium), 'b' for Golden Battle, and 'v' for Golden Void.</b><br/><br/>As previously stated, each rule (separated by commas) in this string dictates the priority of that particular upgrade. With the given example string, the Automator will first buy 8 Golden Voids, then 10 Golden Battle, then 10 Golden Radon, then 10 Golden Battle. Requests to buy Golden Void will be skipped above 72%.</div>";
		text += "<br/><input style='width: 100%' value='" + game.global.guString + "' type='text' id='ArchaeologyAutomatorInput'/>"
		tooltip('confirm', null, 'update', text, 'archoGolden.save()', 'Custom AutoGolden', 'Save', true);
	},
	getDefs: function(){
		return {
			r: "Helium",
			h: "Helium",
			b: "Battle",
			v: "Void",
		}
	},
	save: function(){
		var elem = document.getElementById('ArchaeologyAutomatorInput');
		var error = "";
		var val = "";
		if (elem !== null) val = htmlEncode(elem.value);
		val = val.replace(/\s/g, '')
		if (val == "" || !val){
			game.global.guString = "";
			return;
		}
		var defs = this.getDefs();
		var split = val.split(',');
		if (!split.length) {
			game.global.guString = "";
			cancelTooltip();
			return;
		}
		if (split.length > 25){
			error += "You can only have a maximum of 25 separate Automator rules for this Challenge. You currently have " + split.length + " in your string.<br/>"
		}
		for (var x = 0; x < split.length; x++){
			var rule = split[x];
			rule = rule.split(/(\d+)/);
			var letter = rule[2];
			var number = parseInt(rule[1], 10);
			if (isNumberBad(number)){
				error += "Unable to parse number in rule " + (x + 1) + " at '" + split[x] + "'. Please make sure this is a valid number.<br/>";
				continue;
			}
			if (rule[0] == "-" || number == 0){
				error += "Unable to parse rule " + (x + 1) + " at '" + split[x] + "'. Please use numbers greater than 0";
			}
			if (!defs[letter]) {
				error += "Unable to parse rule " + (x + 1) + " at '" + split[x] + "'. Please use r, h, b, or v as the only letters in your string.<br/>";
				continue;
			}
			if (number > 999) {
				error += "Rule " + (x + 1) + " is attempting to set a value of " + number + ", but the maximum is 999. Please use a number less than or equal to 999.<br/>";
				continue;
			}
		}
		if (error != "") {
			var errElem = document.getElementById('ArchaeologyAutomatorError');
			if (!errElem) return;
			errElem.innerHTML = error;
			return;
		}
		game.global.guString = val;
		cancelTooltip();
	},
	getNext: function(){
		if (game.global.guString == "") return false;		
		var defs = this.getDefs();
		var split = game.global.guString.split(',');
		var done = {};
		for (var x = 0; x < split.length; x++){
			var rule = split[x];
			rule = rule.split(/(\d+)/);
			var name = defs[rule[2]];
			var number = parseInt(rule[1], 10);
			var purchased = game.goldenUpgrades[name].purchasedAt.length;
			var old = done[name] ? done[name] : 0;
			if (purchased < (number + old)) {
				return name;
			}
			if (done[name]) done[name] += number;
			else done[name] = number;
		}
		return false;
	}
}

function autoGoldenUpgrades(){
	if (getAutoGoldenSetting() <= 0)
		return;
	if (lastAutoGoldenToggle != -1){
		var timeRemaining = Math.floor((new Date().getTime() - lastAutoGoldenToggle) / 1000);
		var timeLeftElem = document.getElementById('autoGoldenTimeLeft');
		if (timeRemaining <= 3){
			timeRemaining = 4 - timeRemaining;
			if (timeLeftElem === null)
				document.getElementById('autoGoldenText').innerHTML += ' <span id="autoGoldenTimeLeft">(' + timeRemaining + ')</span>';
			else timeLeftElem.innerHTML = '(' + timeRemaining + ')';
			return;
		}
		else{
			lastAutoGoldenToggle = -1;
			if (timeLeftElem !== null)
				timeLeftElem.innerHTML = "";
		}

	}
	if (!goldenUpgradesShown || getAvailableGoldenUpgrades() <= 0)
		return;
	var selections = ["", "Helium", "Battle", "Void", "Void"];
	var selected;
	var setting = getAutoGoldenSetting();
	if (setting == 5){
		selected = archoGolden.getNext();
		if (!selected) return;
	}
	else{
		selected = selections[setting];
		if (selected == "Void" && (parseFloat((game.goldenUpgrades.Void.currentBonus + game.goldenUpgrades.Void.nextAmt()).toFixed(2)) > 0.72)){
			if (getAutoGoldenSetting() == 3) selected = "Helium";
			else selected = "Battle";
		}
		if (selected == "Helium" && game.global.runningChallengeSquared){
			return;
		}
	}
	buyGoldenUpgrade(selected);
}

function autoPrestiges(equipmentAvailable) {
	var autoPrestigeSetting = game.global.autoPrestiges;
	if (typeof game.global.gridArray[0] !== 'undefined' && game.global.gridArray[0].name == "Liquimp"){
		for (var w = 0; w < equipmentAvailable.weapons.length; w++){
			autoBuyUpgrade(equipmentAvailable.weapons[w]);
		}
		if (autoPrestigeSetting == 2) return;
		for (var a = 0; a < equipmentAvailable.armor.length; a++){
			autoBuyUpgrade(equipmentAvailable.armor[a]);
		}
		return;
	}
	var cheapestWeapon = getCheapestPrestigeUpgrade(equipmentAvailable.weapons);
	if (autoPrestigeSetting == 2) { //Weapons Only
		if (cheapestWeapon[0])	autoBuyUpgrade(cheapestWeapon[0]);
		return;
	}
	if (autoPrestigeSetting == 4){ // Pants only
		if (equipmentAvailable.armor.indexOf("Pantastic") != -1) autoBuyUpgrade("Pantastic");
		return;
	}
	var cheapestArmor = getCheapestPrestigeUpgrade(equipmentAvailable.armor);
	if (!cheapestWeapon[0]) {
		if (cheapestArmor[0]){
			if (autoPrestigeSetting == 3 && ((cheapestArmor[0] == "Supershield" && game.resources.wood.owned < cheapestArmor[1] * 20) || (cheapestArmor[0] != "Supershield" && game.resources.metal.owned < cheapestArmor[1] * 20))) return;
			autoBuyUpgrade(cheapestArmor[0]);
		}
		return;
	}
	if (!cheapestArmor[0]){
		autoBuyUpgrade(cheapestWeapon[0]);
		return;
	}
	var toBuy;
	if (autoPrestigeSetting == 1) //All
		toBuy = (cheapestWeapon[1] < cheapestArmor[1]) ? cheapestWeapon[0] : cheapestArmor[0];
	else if (autoPrestigeSetting == 3) //Weapons First
		toBuy = (cheapestWeapon[1] < (cheapestArmor[1] * 20)) ? cheapestWeapon[0] : cheapestArmor[0];
	if (!toBuy) return;
	var bought = autoBuyUpgrade(toBuy);
	if (toBuy == "Supershield" && !bought && (autoPrestigeSetting == 1 || autoPrestigeSetting == 3)) autoBuyUpgrade(cheapestWeapon[0]);
	else if (cheapestArmor[0] == "Supershield" && !bought && autoPrestigeSetting == 1) autoBuyUpgrade(cheapestArmor[0]);
}

function getCheapestPrestigeUpgrade(upgradeArray) {
	var cheapest = [false, -1]; //0 is name, 1 is cost
	var shieldCheck = false;
	var shieldCost = -1;
	var artMult = getEquipPriceMult();
	for (var x = 0; x < upgradeArray.length; x++) {
		var upgradeObj = game.upgrades[upgradeArray[x]];
		if (!upgradeObj || upgradeObj.locked) continue;
		var res = (typeof upgradeObj.cost.resources.metal !== 'undefined') ? 'metal' : 'wood';
		var thisCost = upgradeObj.cost.resources[res];
		if  (artMult != -1) thisCost *= artMult;
		if (res == "wood"){
			var wepFirstMult = 1;
			if (game.global.autoPrestiges == 3) wepFirstMult = 20;
			//If weapons first is on, only allow Supershield to be considered as cheapest if its cost is < 5% of total wood
			if (upgradeArray.length > 1 && game.resources.wood.owned < thisCost * wepFirstMult) continue;
			shieldCheck = true;
			shieldCost = thisCost;
		}
		
		if (cheapest[1] == -1 || thisCost < cheapest[1]) cheapest = [upgradeArray[x], thisCost];
	}
	if (cheapest[0] && cheapest[0] != 'Supershield' && shieldCheck && shieldCost != -1 && game.resources.metal.owned < cheapest[1]) cheapest = ['Supershield', shieldCost];
	return cheapest;
}

var lastPurchasedPrestige = -1;
function autoBuyUpgrade(item){
	var purchase = buyUpgrade(item, false, true);
	if (!purchase) return false;
	if (game.upgrades[item].locked){
		game.upgrades[item].alert = false;
		if (countAlertsIn("upgrades") <= 0) document.getElementById("upgradesAlert").innerHTML = "";
	}
	if (game.upgrades[item].prestiges) lastPurchasedPrestige = loops;
	return true;
}

var Fluffy = {
	firstLevel: 1000,
	getFirstLevel: function () {
		var prestigeRequire = Math.pow(this.prestigeExpModifier, this.getCurrentPrestige());	
		return this.firstLevel * prestigeRequire;
	},
	growth: 4,
	specialExpModifier: 1, //For events, test server, etc
	specialModifierReason: "",
	get baseExp(){
		if (game.global.universe == 2) return 2.5;
		return 50;
	},
	get expGrowth(){
		if (game.global.universe == 2) return 1.02;
		return 1.015
	},
	currentLevel: 0,
	prestigeDamageModifier: 5,
	prestigeExpModifier: 5,
	currentExp: [],
	damageModifiers: [1, 1.1, 1.3, 1.6, 2, 2.5, 3.1, 3.8, 4.6, 5.5, 6.5],
	damageModifiers2: [1, 1.1, 1.3, 1.6, 2, 2.5, 3.1, 3.8, 4.6, 5.5, 25.5, 30.5, 38, 48, 61, 111, 171, 241, 321, 411, 511, 621, 741, 871, 1011, 1511, 2111, 2811, 3611, 4511, 5511, 5511],
	rewards: ["stickler", "helium", "liquid", "purifier", "lucky", "void", "helium", "liquid", "eliminator", "overkiller"],
	prestigeRewards: ["dailies", "voidance", "overkiller", "critChance", "megaCrit", "superVoid", "voidelicious", "naturesWrath", "voidSiphon", "plaguebrought"],
	rewardsU2: ["trapper", "prism", "heirloopy", "radortle", "healthy", "wealthy", "critChance", "gatherer", "dailies", "exotic", "shieldlayer", "tenacity", "megaCrit", "critChance", "smithy", "biggerbetterheirlooms", "shieldlayer", "void", "moreVoid", "tenacity", "SADailies", "bigDust", "bigSeeds", "radortle2", "scruffBurst", "scaledHealth", "tenacity", "evenMoreVoid", "doubleCrit", "justdam", "justdam"],
	prestigeRewardsU2: [],
	checkU2Allowed: function(){
		if (game.global.universe == 2) return true;
		var prestige = this.getCurrentPrestige();
		if (prestige > 8) return true;
		if (prestige < 8) return false;
		if (this.currentLevel >= 10) return true;
		return false;
	},
	getDamageModifiers: function(){
		if (game.global.universe == 1) return this.damageModifiers;
		return this.damageModifiers2;
	},
	prestige: function () {
		if (game.global.universe == 2) return;
		this.calculateLevel();
		if (this.currentLevel < 10) return;
		this.setCurrentExpTo(0);
		this.addToPrestige(1);
		this.handleBox();
	},
	abortPrestige: function () {
		if (this.getCurrentPrestige() < 1) return;
		this.addToPrestige(-1);
		this.setCurrentExpTo(Math.floor(this.getFirstLevel() * ((Math.pow(this.growth, 10) - 1) / (this.growth - 1))));
		this.handleBox();
	},
	canGainExp: function () {
		if (!this.isCapableHighEnough(this.currentLevel, true)) return false;
		return true;
	},
	isCapableHighEnough: function(fluffyLevel, notEqual){
		var capableLevel = this.getCapableLevel();
		if (notEqual) return (fluffyLevel < capableLevel);
		return (fluffyLevel <= capableLevel);
	},
	isActive: function(){
		return (game.global.spireRows >= 15 || this.getCapableLevel() > 0);
	},
	isMaxLevel: function() {
		return (this.currentLevel == this.getRewardList().length);
	},
	getBestExpStat: function(){
		if (game.global.universe == 2) return game.stats.bestFluffyExp2;
		return game.stats.bestFluffyExp;
	},
	getBestExpHourStat: function(){
		if (game.global.universe == 2) return game.stats.bestFluffyExpHour2;
		return game.stats.bestFluffyExpHour;
	},
	getCurrentExp: function(){
		if (game.global.universe == 2) return game.global.fluffyExp2;
		return game.global.fluffyExp;
	},
	setCurrentExpTo: function(amt){
		if (game.global.universe == 2) game.global.fluffyExp2 = amt;
		else game.global.fluffyExp = amt;
	},
	getCurrentPrestige: function(){
		if (game.global.universe == 2) return game.global.fluffyPrestige2;
		return game.global.fluffyPrestige;
	},
	addToPrestige: function(amt){
		if (game.global.universe == 2) game.global.fluffyPrestige2 += amt;
		else game.global.fluffyPrestige += amt;
	},
	getCapableLevel: function(){
		if (game.global.universe == 2) return this.rewardsU2.length;
		return getPerkLevel("Capable");
	},
	getRewardList: function(){
		if (game.global.universe == 2) return this.rewardsU2;
		return this.rewards;
	},
	getPrestigeRewardList: function(){
		if (game.global.universe == 2) return this.prestigeRewardsU2;
		return this.prestigeRewards;
	},
	lastPat: 0,
	patSeed: Math.floor(Math.random() * 1000),
	pat: function(){
		var stat = (game.global.universe == 1) ? game.stats.fluffyPats : game.stats.scruffyPats;
		stat.valueTotal++;
		this.lastPat = new Date().getTime();
		this.patSeed++;
		this.refreshTooltip();
		if (usingScreenReader) screenReaderAssert(this.getFluff()); // by far the silliest SR addition, but c'mon, everyone deserves to know Fluffy enjoys pats -Q 
	},
	getFluff: function () {
		var possibilities = [];
		var timeSeed = Math.floor(new Date().getTime() / 1000 / 30);
		var name = this.getName();
		if (new Date().getTime() - this.lastPat < 15000){
			var stat = (game.global.universe == 1) ? game.stats.fluffyPats.valueTotal : game.stats.scruffyPats.valueTotal;
			var extra = "You've pet " + name + " " + stat + " time" + needAnS(stat) + ".";
			possibilities = [name + " makes a purr-like sound. " + extra, name + " reminds you to scratch behind the ears. " + extra, name + " appreciates the pat! " + extra, name + " thinks you're the best. " + extra, name + " frickin loves pats! " + extra, name + " looks quite happy. " + extra];
			timeSeed = this.patSeed;
		}
		else if (this.currentLevel == this.getRewardList().length){
			possibilities = [name + "'s just chillin.", name + " can now predict the future, though he won't tell you what's going to happen.", name + "'s looking pretty buff.", name.toUpperCase() + " SMASH", name + "'s smelling great today.", name + " is a model Trimp.", name + " can do anything.", name + " once killed a Snimp with a well-timed insult.", name + " can juggle 3 dozen scientists without breaking a sweat.", name + " does a barrel roll.", name + "'s thinking about writing a book."];
		}
		else {
			possibilities = ["He's enjoying the grind.", "He can't wait to get stronger.", "He could probably use a shower.", "He's growing up so fast.", "His fur is looking healthy today.", "He's feeling quite capable.", "He still drools a bit in his sleep.", "He loves a good game of fetch.", "He's been practicing juggling.", "He does a flip.", "He's the only Trimp not scared by your campfire ghost stories."];
		}
		return possibilities[getRandomIntSeeded(timeSeed, 0, possibilities.length)];
	},
	getExp: function(){
		if (this.currentExp.length != 3) this.handleBox();
		return this.currentExp;
	},
	getName: function(){
		if (game.global.universe == 2) return "Scruffy";
		else return "Fluffy";
	},
	calculateExp: function(){
		var level = this.currentLevel;
		var experience = this.getCurrentExp();
		var removeExp = 0;
		if (level > 0){
			removeExp = Math.floor(this.getFirstLevel() * ((Math.pow(this.growth, level) - 1) / (this.growth - 1)));
		}
		var totalNeeded = Math.floor(this.getFirstLevel() * ((Math.pow(this.growth, level + 1) - 1) / (this.growth - 1)));
		experience -= removeExp;
		totalNeeded -= removeExp;
		this.currentExp = [level, experience, totalNeeded];
	},
	calculateLevel: function(){
		var level = Math.floor(log10(((this.getCurrentExp() / this.getFirstLevel()) * (this.growth - 1)) + 1) / log10(this.growth));
		if (!this.isCapableHighEnough(level)) level = this.getCapableLevel();
		if (game.global.universe == 1 && game.global.fluffyPrestige == 8 && this.currentLevel == 9 && level == 10){
			tooltip("A Whole New World", null, 'update');
		}
		this.currentLevel = level;
	},
	calculateInfo: function(){
		if (!this.isActive()){
			this.currentLevel = 0;
			this.currentExp = [];
			return;
		}
		this.calculateLevel();
		this.calculateExp();
		this.updateExp();
		if (this.currentLevel >= 1) giveSingleAchieve("Consolation Prize");
	},
	updateExp: function() {
		const expElem = document.getElementById('fluffyExp');
		const lvlElem = document.getElementById('fluffyLevel');
		const fluffyInfo = this.cruffysTipActive() ? game.challenges.Nurture.getExp() : this.getExp();
		let width = Math.ceil((fluffyInfo[1] / fluffyInfo[2]) * 100);
	
		if (width > 100) width = 100;
		expElem.style.width = width + '%';
	
		if (lvlElem.innerHTML !== fluffyInfo[0]) {
			lvlElem.innerHTML = fluffyInfo[0];
		}
	},
	rewardExp: function(count){
		if (!this.canGainExp()) return;
		if ((game.global.world < (this.getMinZoneForExp() + 1)) && !count) return;
		var reward = this.getExpReward(true, count);
		if (game.global.universe == 2) game.global.fluffyExp2 += reward;
		else game.global.fluffyExp += reward;
		if (game.global.challengeActive == "Nurture") game.challenges.Nurture.gaveExp(reward);
		if (game.global.challengeActive == "Experience") game.challenges.Experience.heldExperience += reward;
		this.handleBox();
		return reward;
	},
	getMinZoneForExp: function(){
		if (game.global.universe == 2) return 0;
		var zone = 300;
		if (getPerkLevel("Classy")) zone -= (getPerkLevel("Classy") * game.portal.Classy.modifier);
		return Math.floor(zone);
	},
	getExpReward: function(givingExp, count) {
		var xpZone = game.global.world - this.getMinZoneForExp();
		if (game.global.universe == 2) xpZone *= 3;
		var reward = (this.baseExp + (getPerkLevel("Curious") * game.portal.Curious.modifier)) * Math.pow(this.expGrowth, xpZone) * (1 + (getPerkLevel("Cunning") * game.portal.Cunning.modifier));
		reward *= this.specialExpModifier;
		if (game.talents.fluffyExp.purchased)
			reward *= 1 + (0.25 * this.getCurrentPrestige());
		if (playerSpireTraps.Knowledge.owned){
			var knowBonus = playerSpireTraps.Knowledge.getWorldBonus();
			reward *= (1 + (knowBonus / 100));
		}
		if (autoBattle.oneTimers.Battlescruff.owned && game.global.universe == 2){
			reward *= (1 + ((autoBattle.maxEnemyLevel - 1) / 50));
		}
		if (game.global.universe == 2 && u2Mutations.tree.Scruffy.purchased){
			reward *= 1.3;
		}
		if (game.global.universe == 1 && game.global.frigidCompletions > 0){
			reward *= game.challenges.Frigid.getTrimpMult();
		}
		reward *= u2SpireBonuses.scruffyXp();
		if (count) reward *= count;
		if (getHeirloomBonus("Staff", "FluffyExp") > 0){
			reward *= (1 + (getHeirloomBonus("Staff", "FluffyExp") / 100));
		}
		if (givingExp) this.getBestExpStat().value += reward;
		//----Modifiers below this comment will not apply to best fluffy exp bone portal credit or stats----
		if (game.global.challengeActive == "Daily")
			reward *= (1 + (getDailyHeliumValue(countDailyWeight()) / 100));
		if (getUberEmpowerment() == "Ice") reward *= (1 + (game.empowerments.Ice.getLevel() * 0.0025));
		return reward;
	},
	getLevel: function(ignoreCapable){
		if (this.currentExp.length != 3) this.handleBox();
		var level = this.currentLevel;
		var capableLevels = this.getCapableLevel();
		if (ignoreCapable){
			level = Math.floor(log10(((this.getCurrentExp() / this.getFirstLevel()) * (this.growth - 1)) + 1) / log10(this.growth));
			if (level >= this.getRewardList().length) level = this.getRewardList().length;
			return level;
		}
		if (!this.isCapableHighEnough(level)) level = capableLevels;
		return level;
	},
	getDamageModifier: function () {
		var exp = this.getExp();
		var prestigeBonus = Math.pow(this.prestigeDamageModifier, this.getCurrentPrestige());
		var minLevel = (game.talents.fluffyAbility.purchased) ? 0 : 1;
		if (exp[0] < minLevel || exp.length != 3) return 1;
		var damageModifiers = this.getDamageModifiers();
		var bonus = damageModifiers[exp[0]];
		if (exp[0] >= damageModifiers.length || (exp[0] == this.getCapableLevel() && !(game.global.universe == 2 && this.getCapableLevel() == 10))) return 1 + ((bonus - 1) * prestigeBonus);
		var remaining = (damageModifiers[exp[0] + 1] - bonus);
		bonus += ((exp[1] / exp[2]) * remaining);
		return 1 + ((bonus - 1) * prestigeBonus);
	},
	getBonusForLevel: function(level) {
		var prestigeBonus = Math.pow(this.prestigeDamageModifier, this.getCurrentPrestige());
		var damageModifiers = this.getDamageModifiers();
		var possible = (damageModifiers[level] - damageModifiers[level - 1]) * 100 * prestigeBonus;
		if (this.currentLevel >= level) {
			return prettify(Math.round(possible)) + "%";
		}
		if (level == this.currentLevel + 1 && this.isCapableHighEnough(this.currentLevel, true)) {
			var earned = possible * (this.currentExp[1] / this.currentExp[2]);
			return prettify(earned) + "% / " + prettify(Math.round(possible)) + "%";
		}
		return "0% / " + prettify(Math.round(possible)) + "%";
	},
	isRewardActive: function(reward){
		var calculatedPrestige = this.getCurrentPrestige();
		if (game.talents.fluffyAbility.purchased) calculatedPrestige++;
		if (this.currentLevel + calculatedPrestige == 0) return 0;
		var indexes = [];
		var rewardsList = this.getRewardList();
		var prestigeRewardsList = this.getPrestigeRewardList();
		for(var x = 0; x < rewardsList.length; x++){
			if (rewardsList[x] == reward)
				indexes.push(x);
		}
		for (var z = 0; z < prestigeRewardsList.length; z++){
			if (prestigeRewardsList[z] == reward)
				indexes.push(rewardsList.length + z)
		}
		var count = 0;
		for (var y = 0; y < indexes.length; y++){
			if (this.currentLevel + calculatedPrestige > indexes[y]) count++;
		}
		return count;
	},
	handleBox: function(){
		var boxElem = document.getElementById('fluffyBox');
		var xpElem = document.getElementById('fluffyExpContainer');
		if (Fluffy.isActive()){
			boxElem.style.display = 'block';
			this.calculateInfo();
			if (this.currentLevel == this.getRewardList().length)
				xpElem.style.display = 'none';
			else
				xpElem.style.display = 'block';
		}
		else {
			boxElem.style.display = 'none';
		}
	},
	refreshTooltip: function (justOnce) {
		if (openTooltip != "Fluffy") return;
		var fluffyTip = Fluffy.tooltip(true);
		var topElem = document.getElementById('fluffyTooltipTopContainer');
		var bottomElem = document.getElementById('fluffyLevelBreakdownContainer');
		if (topElem && bottomElem) {
			topElem.innerHTML = fluffyTip[0];
			bottomElem.innerHTML = fluffyTip[1];
			if (!justOnce) setTimeout(Fluffy.refreshTooltip, 1000);
		}
		
	},
	checkAndRunVoidance: function() {
		if (!this.isRewardActive('voidance')) return;
		for (var x = 0; x < 2; x++){
			var map = createVoidMap();
			var mapName = map.split(' ');
			createVoidMap(mapName[0], mapName[1]);
		}
	},
	checkAndRunVoidelicious: function () {
		if (!this.isRewardActive('voidelicious')) return;
		var prefixes = ['Deadly', 'Poisonous', 'Heinous', 'Destructive'];
		var suffixes = ['Nightmare', 'Void', 'Descent', 'Pit'];
		for (var x = 0; x < prefixes.length; x++){
			for (var y = 0; y < suffixes.length; y++){
				createVoidMap(prefixes[x], suffixes[y]);
			}
		}

	},
	expBreakdown: function (what) {
		var elem = document.getElementById("fluffyExpBreakdown");
		switch(what){
			case "clear":
				elem.innerHTML = "";
				return;
			case "daily":
				var text = 'Applies when running a Daily Challenge, and matches the extra ' + heliumOrRadon() + ' from your Daily.' 
				text += ((game.global.challengeActive == "Daily") ? ' Currently ' + prettify(1 + (getDailyHeliumValue(countDailyWeight()) / 100)) + '.' : ' Currently 1.');
				text += " Does not apply to Best " + Fluffy.getName() + " Exp."
				elem.innerHTML = text;
				return;
			case "zone":
				elem.innerHTML = 'Your Zone number. Currently ' + game.global.world + '.';
				return;
			case "cunning":
				elem.innerHTML = 'The amount of levels placed in the Cunning Perk. Currently ' + getPerkLevel("Cunning") + '.';
				return;
			case "curious":
				elem.innerHTML = 'The amount of levels placed in the Curious Perk. Currently ' + getPerkLevel("Curious") + '.';
				return;
			case "classy":
				elem.innerHTML = 'The Zone Fluffy can start earning Experience at. This value is normally 301, and is currently reduced by ' + Math.floor(getPerkLevel("Classy") * game.portal.Classy.modifier) + ' thanks to ' + ((game.portal.Classy.modifier > 1) ? getPerkLevel("Classy") + " level" + ((getPerkLevel("Classy") == 1) ? "" : "s") + " of " : "") + 'Classy.';
				return;
			case "special":
				elem.innerHTML = this.specialModifierReason;
				return;
			case "staff":
				elem.innerHTML = 'The bonus modifier applied from "Pet Exp" on a Plagued or higher tier Staff. Currently ' + (1 + (getHeirloomBonus("Staff", "FluffyExp") / 100)).toFixed(2) + '.';
				return;
			case "flufffocus":
				elem.innerHTML = 'The bonus modifier from the Flufffocus Mastery (+25% exp per Prestige). ' + Fluffy.getName() + ' has evolved ' + this.getCurrentPrestige() + ' time' + ((this.getCurrentPrestige() == 1) ? '' : 's') + ', bringing this modifier to ' + prettify(1 + (0.25 * this.getCurrentPrestige())) + '.';
				return;
			case "knowledge":
				elem.innerHTML = 'The bonus from your Knowledge Towers. You have ' + playerSpireTraps.Knowledge.owned + ' Knowledge Tower' + needAnS(playerSpireTraps.Knowledge.owned) + ', granting a bonus of ' + playerSpireTraps.Knowledge.getWorldBonus(true) + '% each, bringing this modifier to ' + (1 + (playerSpireTraps.Knowledge.getWorldBonus() / 100)) + ".";
				return;
			case "ice":
				elem.innerHTML = 'From Enlightened Ice. Equal to (1 + (0.0025 * Ice Levels)), currently ' + prettify((1 + (0.0025 * game.empowerments.Ice.getLevel()))) + '. Does not apply to Best Fluffy Exp.'
				return;
			case "labs":
				elem.innerHTML = 'From Nurture. Increases Exp gain by 10% (compounding) per constructed Laboratory. Currently granting ' + prettify(game.buildings.Laboratory.getExpMult()) + 'x.';
				return;
			case "battlescruff":
				elem.innerHTML = 'From the Battlescruff Spire Assault reward. Increases Scruffy XP gained by 2% per level cleared, currently granting ' + prettify(1 + ((autoBattle.maxEnemyLevel - 1) / 50)) + 'x.';
				return;
			case "mutators":
				elem.innerHTML = 'From Mutators. Currently granting 1.3x.';
				return;
			case "frigid":
				elem.innerHTML = 'From the Frigid Challenge. Currently granting ' + prettify(game.challenges.Frigid.getTrimpMult()) + 'x.';
				return;
			case "stuffy":
				elem.innerHTML = "From knowledge gained in Stuffy's Spire. Currently granting " + prettify(u2SpireBonuses.scruffyXp()) + "x.";
		}
	},
	cruffysToggled: false,
	cruffysTipActive: function(){
		if (!this.cruffysToggled) return false;
		if (game.challenges.Nurture.boostsActive()) return true;
		this.cruffysToggled = false;
		return false;
	},
	toggleCruffys: function(){
		var tipTitle = document.getElementById('tipTitle');
		this.cruffysToggled = !this.cruffysToggled;
		if (tipTitle != null) tipTitle.innerHTML = (this.cruffysToggled) ? "<b>IT'S CRUFFYS</b>" : this.getName();
		this.handleBox();
		this.refreshTooltip();
		var toggleBtn = document.getElementById('toggleCruffyTipBtn');
		if (toggleBtn != null) toggleBtn.innerHTML = "Show " + ((this.cruffysToggled) ? "Scruffy" : "Cruffys") + " Info";
		var patBtn = document.getElementById('fluffyPatBtn');
		if (patBtn != null) patBtn.style.display = (this.cruffysToggled) ? "none" : "inline-block";
	},
	tooltip: function (big){
		var showCruffys = (this.cruffysTipActive());
		var savedLevel = Fluffy.getLevel(true);
		var fluffyInfo = Fluffy.getExp();
		var rewardsList = this.getRewardList();
		var prestigeRewardsList = this.getPrestigeRewardList();
		var calculatedPrestige = this.getCurrentPrestige();
		var name = this.getName();
		if (game.talents.fluffyAbility.purchased) 
			calculatedPrestige++;
		if (calculatedPrestige > prestigeRewardsList.length) 
			calculatedPrestige = prestigeRewardsList.length + 1;

		if (showCruffys){
			rewardsList = game.challenges.Nurture.rewardsList;
			savedLevel = game.challenges.Nurture.getLevel();
			calculatedPrestige = 0;
			fluffyInfo = game.challenges.Nurture.getExp();
			name = "Cruffys";
		}

		var bottomText = "";
		var topText = "<div style='width: 100%; font-size: 0.95em;'><div class='fluffyThird'>";
		var minZoneForExp = Fluffy.getMinZoneForExp() + 1;
		if (game.global.universe == 1 && (this.getCurrentPrestige() > 0 || this.currentLevel == rewardsList.length)) topText += "<span style='color: #740774'>Evolution " + this.getCurrentPrestige() + " </span>";
		topText += "Level " + fluffyInfo[0] + "</div><div class='fluffyThird'>";
		if (savedLevel >= rewardsList.length && (!showCruffys || fluffyInfo[0] >= 19)) {
			topText += "Max"
		}
		else {
			topText += (Fluffy.canGainExp()) ? "<span>" : "<span class='red'>"
			topText += prettify(fluffyInfo[1]) + " / " + prettify(fluffyInfo[2]) + " Exp";
			topText += "</span>";
		}
		if (!showCruffys) topText += "</div><div class='fluffyThird'>+" + prettify((Fluffy.getDamageModifier() - 1) * 100) + "% damage"
		topText += "</div></div>";
		if (showCruffys && game.global.challengeActive != "Nurture"){
			topText += "- Cruffys cannot gain Experience after the Nurture Challenge ends, but will stick around for " + (game.challenges.Nurture.cruffysUntil - game.global.world) + " more Zones.<br/>- " + Fluffy.getFluff();
		}
		else if (!Fluffy.isMaxLevel() && (!showCruffys || fluffyInfo[0] < 19)){
			if (savedLevel > fluffyInfo[0]) topText += "<span class='red'>- " + name + "'s level and damage bonus are currently reduced. " + name + " will return to level " + savedLevel + " when points are placed back in Capable.</span>";
			else if (!Fluffy.canGainExp()) topText += "<span class='red'>- " + name + " needs " + ((this.getCapableLevel() == 0) ? " at least one point of Capable to gain any Exp" + ((game.portal.Capable.locked) ? ". Complete Spire II to unlock Capable!" : "") : " more points in Capable to gain Exp above level " + this.getCapableLevel() + ".") + "</span>";
			else {
				if (game.global.world < minZoneForExp) topText += "<span class='red'>- " + name + " cannot gain any Experience from Zones lower than " + minZoneForExp + "</span>";
				else{
					var remainingXp = fluffyInfo[2] - fluffyInfo[1];
					var xpReward = Fluffy.getExpReward();
					if (showCruffys) xpReward *= game.buildings.Laboratory.getExpMult();
					var fluffyStat = Fluffy.getBestExpStat();
					var remainingRuns = (fluffyStat.value > 0) ? Math.ceil(remainingXp / fluffyStat.value) : -1;
					topText += "- " + name + " is earning " + prettify(xpReward) + " Exp per Zone. " + name + " needs " + prettify(remainingXp) + " more Exp to level";
					if (remainingRuns > -1 && !showCruffys) topText += ", equivalent to repeating your current run to this zone about " + prettify(remainingRuns) + " more time" + needAnS(remainingRuns) + ".";
					else topText += ".";
					topText += "<br/>- " + Fluffy.getFluff();
				}
			}
			
		}
		else topText += "- " + Fluffy.getFluff();
		topText += "</br>";
		if (!big) return topText;
		//clicked

		if (Fluffy.currentLevel == 10 && this.getCurrentPrestige() < prestigeRewardsList.length)
			topText += "<span class='fluffyEvolveText'>" + name + " is ready to Evolve! This will reset his damage bonus and most abilities back to level 0, but he will regrow to be stronger than ever. You can cancel this Evolution at any point to return to level 10.<br/><span class='btn btn-md btn-success' onclick='Fluffy.prestige(); Fluffy.refreshTooltip(true);'>Evolve!</span></span><br/>";
		if (Fluffy.canGainExp() && game.global.world >= minZoneForExp && (!showCruffys || fluffyInfo[0] < 19)) {
			topText += "- " + name + "'s Exp gain at the end of each Zone is equal to: ";
			var fluffFormula = "<br/><span style='padding-left: 1em'>";
			var startNumber = Fluffy.getMinZoneForExp();
			if (isPerkUnlocked("Classy")) startNumber = '<span class="fluffFormClassy" onmouseover="Fluffy.expBreakdown(\'classy\')" onmouseout="Fluffy.expBreakdown(\'clear\')">' + (startNumber + 1) + "</span> - 1";
			if (isPerkUnlocked("Curious")) fluffFormula += "(" + Fluffy.baseExp + " + (Curious * " + game.portal.Curious.modifier + ")) * (" + Fluffy.expGrowth + "^(Zone - " + startNumber + ")) * (1 + (Cunning * " + game.portal.Cunning.modifier + "))";
			else if (isPerkUnlocked("Cunning")) fluffFormula += Fluffy.baseExp + " * (" + Fluffy.expGrowth + "^(Zone - " + startNumber + ")) * (1 + (Cunning * " + game.portal.Cunning.modifier + "))";
			else if (game.global.universe == 2) fluffFormula += Fluffy.baseExp + " * (" + Fluffy.expGrowth + "^(Zone * 3))";
			else fluffFormula += Fluffy.baseExp + " * (" + Fluffy.expGrowth + "^(Zone - " + startNumber + "))";
			fluffFormula += "</span>";
			if (getHighestLevelCleared() >= 29) fluffFormula += ' * <span class="fluffFormDaily" onmouseover="Fluffy.expBreakdown(\'daily\')" onmouseout="Fluffy.expBreakdown(\'clear\')">daily' + heliumOrRadon() + 'Modifier</span>';
			if (game.talents.fluffyExp.purchased && game.global.universe == 1) fluffFormula += ' * <span class="fluffFormFlufffocus" onmouseover="Fluffy.expBreakdown(\'flufffocus\')" onmouseout="Fluffy.expBreakdown(\'clear\')">Flufffocus</span>';
			if (getHeirloomBonus("Staff", "FluffyExp") > 0) fluffFormula += ' * <span class="fluffFormStaff" onmouseover="Fluffy.expBreakdown(\'staff\')" onmouseout="Fluffy.expBreakdown(\'clear\')">Staff</span>';
			if (playerSpireTraps.Knowledge.owned) fluffFormula += ' * <span class="fluffFormKnowledge" onmouseover="Fluffy.expBreakdown(\'knowledge\')" onmouseout="Fluffy.expBreakdown(\'clear\')">Knowledge</span>';
			if (game.global.frigidCompletions > 0 && game.global.universe == 1) fluffFormula += ' * <span class="fluffFormFrigid" onmouseover="Fluffy.expBreakdown(\'frigid\')" onmouseout="Fluffy.expBreakdown(\'clear\')">Frigid</span>';
			if (Fluffy.specialExpModifier > 1) fluffFormula += ' * <span class="fluffFormSpecial" onmouseover="Fluffy.expBreakdown(\'special\')" onmouseout="Fluffy.expBreakdown(\'clear\')">' + Fluffy.specialExpModifier + "</span>";
			if (getUberEmpowerment() == "Ice") fluffFormula += ' * <span class="fluffFormIce" onmouseover="Fluffy.expBreakdown(\'ice\')" onmouseout="Fluffy.expBreakdown(\'clear\')">Ice</span>';
			if (showCruffys) fluffFormula += ' * <span class="fluffFormLab" onmouseover="Fluffy.expBreakdown(\'labs\')" onmouseout="Fluffy.expBreakdown(\'clear\')">Labs</span>';
			if (game.global.universe == 2 && autoBattle.oneTimers.Battlescruff.owned) fluffFormula += ' * <span class="fluffFormBattlescruff" onmouseover="Fluffy.expBreakdown(\'battlescruff\')" onmouseout="Fluffy.expBreakdown(\'clear\')">Battlescruff</span>';
			if (game.global.universe == 2 && u2Mutations.tree.Scruffy.purchased) fluffFormula += ' * <span class="fluffFormMutators" onmouseover="Fluffy.expBreakdown(\'mutators\')" onmouseout="Fluffy.expBreakdown(\'clear\')">Mutators</span>';
			if (game.global.universe == 2 && u2SpireBonuses.scruffyXp() > 1) fluffFormula += ' * <span class="fluffFormStuffy" onmouseover="Fluffy.expBreakdown(\'stuffy\')" onmouseout="Fluffy.expBreakdown(\'clear\')">Stuffy\'s Spire</span>';
			fluffFormula = fluffFormula.replace('Zone', '<span onmouseover="Fluffy.expBreakdown(\'zone\')" onmouseout="Fluffy.expBreakdown(\'clear\')" class="fluffFormZone">Zone</span>');
			fluffFormula = fluffFormula.replace('Cunning', '<span onmouseover="Fluffy.expBreakdown(\'cunning\')" onmouseout="Fluffy.expBreakdown(\'clear\')" class="fluffFormCunning">Cunning</span>');
			fluffFormula = fluffFormula.replace('Curious', '<span onmouseover="Fluffy.expBreakdown(\'curious\')" onmouseout="Fluffy.expBreakdown(\'clear\')" class="fluffFormCurious">Curious</span>');
			topText += fluffFormula;
		}
		if (calculatedPrestige > 0 && Fluffy.currentLevel < 10 && !(calculatedPrestige == 1 && game.talents.fluffyAbility.purchased))
			topText += "<br/><span class='btn btn-sm btn-warning' onmousedown='cancelTooltip(); tooltip(\"confirm\", null, \"update\", \"You are about to abort " + name + "&#39;s Evolution. This will return you to level 10 on your last Evolution, but you will permanently lose all Experience earned towards the current Evolution. Are you sure you want to abort?\", \"Fluffy.abortPrestige()\", \"Abort Evolution\")'>Abort Evolution</span>"
		var xpBreakdownFill = (document.getElementById('fluffyExpBreakdown') ? document.getElementById('fluffyExpBreakdown').innerHTML : "");
		topText += "<div id='fluffyExpBreakdown'>" + xpBreakdownFill + "</div>";
		bottomText += "<table id='fluffyLevelBreakdown'><tbody><tr style='font-weight: bold; font-size: 1.25em; text-align: center;'><td style='padding: 0 1em'>Level</td><td>Ability</td><td style='padding: 0 1em'>+Damage</td></tr>";
		for (var x = 0; x < rewardsList.length; x++){
			var highlighted;
			// if (showCruffys) highlighted = (cruffysLevel >= (x + 1));
			// else 
			highlighted = ((fluffyInfo[0] + calculatedPrestige) >= (x + 1));
			bottomText += (highlighted) ? "<tr class='fluffyRowComplete'>" : "<tr>";
			if (savedLevel < x && calculatedPrestige == 0 && game.global.universe == 1)
				bottomText += "<td>Lv " + (x + 1) + "</td><td>????</td><td></td>"
			else{
				var levelDisplay = (x + 1) - calculatedPrestige;
				if (levelDisplay < 0) levelDisplay = 0;
				var description = (fluffyInfo[0] < levelDisplay - 2) ? "????" : Fluffy.rewardConfig[rewardsList[x]].description;
				bottomText += "<td>Lv " + levelDisplay + "</td><td>" + description + "</td>";
				if (showCruffys) bottomText += "<td></td></tr>"
				else bottomText += "<td style='text-align: center'>" + ((levelDisplay > 0) ? Fluffy.getBonusForLevel(levelDisplay) : "&nbsp;") + "</td></tr>";
			}
		}
		var countedPrestige = calculatedPrestige;
		if (fluffyInfo[0] == rewardsList.length) countedPrestige++;
		if (countedPrestige > 0){
			for (var y = 0; y < prestigeRewardsList.length; y++){
				var levelDisplay = rewardsList.length + (y + 1) - countedPrestige;
				if (levelDisplay > rewardsList.length) continue;
				if (levelDisplay < 0) levelDisplay = 0;
				bottomText += (fluffyInfo[0] >= rewardsList.length - calculatedPrestige + (y + 1)) ? "<tr class='fluffyRowComplete'>" : "<tr>";
				levelDisplay = ((countedPrestige - 1 == y && countedPrestige != calculatedPrestige) ? levelDisplay : ((countedPrestige == calculatedPrestige) ? levelDisplay : levelDisplay + 1));
				var displayedPrestige = y + 1;
				if (calculatedPrestige != this.getCurrentPrestige()) {
					displayedPrestige -= (calculatedPrestige - this.getCurrentPrestige())
				}
				bottomText += "<td><b>E" + displayedPrestige + "</b> Lv " + levelDisplay + "</td><td>" + Fluffy.rewardConfig[prestigeRewardsList[y]].description + "</td>";
				bottomText += "<td style='text-align: center'>" + ((levelDisplay > 0 && calculatedPrestige > y) ? Fluffy.getBonusForLevel(levelDisplay) : "&nbsp;") + "</td></tr>";
			}
		}
		bottomText += "</tbody></table>"
		return [topText, bottomText];
	},
	getVoidStackCount: function () {
		var count = 1;
		if (this.isRewardActive('void')) count++;
		else return 1;
		if (this.isRewardActive('superVoid')) count += 4;
		if (game.talents.voidSpecial2.purchased) count++;
		return count;
	},
	getRadortleMult: function(){
		var useLevel = Fluffy.isRewardActive('radortle2') ? (game.global.highestRadonLevelCleared + 1) : game.global.lastRadonPortal;
		return Math.pow(1.03, useLevel);
	},
	rewardConfig: {
		stickler: {
			description: "Adds a 5% chance to earn the highest available heirloom tier, and subtracts a 5% chance from the lowest tier."
		},
		purifier: {
			description: "Corrupt and Healthy enemies in active Spires have a 50% chance to be missing their special ability."
		},
		lucky: {
			description: "When completing a map with a cache, you have a +25% chance to find a second cache."
		},
		overkiller: {
			description: "Overkill can now reach one extra enemy."
		},
		helium: {
			get description(){
			return heliumOrRadon() + " gain from all sources is increased by 25%."
			}
		},
		void: {
			get description(){
				return "Allows up to two Void Maps with the same name to stick together. After completing this 2x Void Map, " + Fluffy.getName() + " will clear the extra one instantly, granting 50% more " + heliumOrRadon() + " than normal and a second Heirloom.";
			}
		},
		moreVoid: {
			get description(){
				return "Start each U2 run with 1 extra Void Map for every 5 Void Maps cleared on your last U2 run. (" + game.stats.totalVoidMaps.value + " cleared so far this run, granting " + Math.floor(game.stats.totalVoidMaps.value / 5) + " extra next run)";
			}
		},
		eliminator: {
			description: "Corrupt and Healthy enemies in active Spires no longer have any special abilities."
		},
		liquid: {
			description: "Adds 2.5% to your liquification bonus (half of a Spire)."
		},
		voidance: {
			description: "Each Portal, start with two double stacked Void Maps."
		},
		dailies: {
			get description(){
				return "Adds 100% to the reward modifier of all Daily Challenges.";
			}
		},
		critChance: {
			description: "Gives your Trimps an additional 50% crit chance."
		},
		megaCrit: {
			get description(){
				var chance = Math.ceil(getPlayerCritChance());
				var text = "Adds +2x to your MegaCrit multiplier, increasing ";
				if (chance < 3) chance = 3;
				var current = [getMegaCritDamageMult(chance - 1), getMegaCritDamageMult(chance)];
				var start = getMegaCritDamageMult(2);
				if (!Fluffy.isRewardActive('megaCrit')) current = [Math.pow(start + 2, chance - 2), Math.pow((start + 2), chance - 1)];
				var counted = 0;
				for (var x = chance - 1; x < chance + 1; x++){
					text += "<span class='critSpan' style='background-color: #5f5f5f; padding: 0.3%;'>" + getCritText(x) + "</span> damage to " + current[counted] + "x";
					if (counted == 0) text += " and ";
					else text += ".";
					counted++;
				}
				return text;
			}
		},
		superVoid: {
			get description(){
				var count = 6;
				if (game.talents.voidSpecial2.purchased) count++;
				return "Allows an additional 4 Void Maps with the same name to stick together, bringing the max stack size to " + count + ". Each map in the stack that Fluffy clears grants an additional 50% Helium to all other maps in the stack, giving a bonus of up to +" + Math.floor((count - 1) * 50) + "% to each of the " + (count - 1) + " Fluffy maps from a " + count + " stack."
			}
		},
		voidelicious: {
			description: "Start each Portal with 1 of each uniquely named Void Map (16 total)."
		},
		naturesWrath: {
			description: "Improves Empowerments of Nature! Poison gains +10 to Stack Transfer rate, Helium rewards from Wind are increased by 5x, and the damage bonus from Ice is doubled."
		},
		voidSiphon: {
			description: "Your Trimps gain 5% attack each time you clear a Void Map. This bonus stacks additively and resets on Portal."
		},
		plaguebrought: {
			description: "Your Trimps gain +50% to their Plaguebringer modifier, and all Nature stacks accumulate twice as fast."
		},
		trapper: {
			description: "Traps are 10x larger and more effective."
		},
		healthy: {
			description: "Your Trimps gain +50% health."
		},
		wealthy: {
			get description(){
				return "Doubles the amount of resources gained from Battle (excluding " + heliumOrRadon() + ").";
			}
		},
		prism: {
			description: "Adds 25% of your Trimps' max health to their Prismatic Shield."
		},
		gatherer: {
			description: "Resources gathered by your Trimps are doubled."
		},
		exotic: {
			get description(){
				var boneInc = game.permaBoneBonuses.exotic.addChance();
				return "Increases the chance of finding Exotic Imports, bringing the average from " + (3 + boneInc) + " per zone to " + (3.5 + boneInc) + ".";
			}
		},
		reincarnate: {
			description: "When a group of Trimps would die, they have a 20% chance to be restored to full health instead. Cannot trigger if Trimps were killed in one hit."
		},
		heirloopy: {
			description: "Pet Exp, Plaguebringer, Void Map Drop Chance and Crit Chance mods on Heirlooms no longer suffer a penalty in Universe 2."
		},
		radortle: {
			get description(){
				if (!Fluffy.isRewardActive('radortle2')) return "Increases Radon gain from all sources by 3% for each Zone you reached on your last Portal in this Universe (compounding). You reached Z" + game.global.lastRadonPortal + " last Portal, worth +" + prettify((Fluffy.getRadortleMult() - 1) * 100) + "% Radon.";
				return "Increases Radon gain from all sources by 3% for each Zone you reached on your best Portal in this Universe (compounding). Your highest Zone reached is Z" + (game.global.highestRadonLevelCleared + 1) + ", worth +" + prettify((Fluffy.getRadortleMult() - 1) * 100) + "% Radon.";
			}
		},
		shieldlayer: {
			description: "Gives your Prismatic Shield an additional layer."
		},
		tenacity: {
			description: "Start each zone with 15% more of last zone's Tenacity time already applied."
		},
		smithy: {
			description: "Reduces the compounding cost increase of all Smithy materials by 20% (from x50 per Smithy purchased to x40)."
		},
		biggerbetterheirlooms: {
			description: "Allows you to spend an additional 30% of your total earned Nullifium on all of your Heirlooms."
		},
		justdam: {
			description: "Provides no bonus other than damage. Will some day evolve into a more powerful boost!"
		},
		SADailies: {
			get description(){
				var cleared = autoBattle.maxEnemyLevel - 1;
				return "Your Trimps gain +4% Attack and +0.25% Crit Chance per Spire Assault level cleared while on a Daily Challenge. You have cleared " + cleared + " SA levels, granting +" + prettify((this.attackMod() - 1) * 100) + "% Attack and +" + prettify(this.critChance() * 100) + "% Crit Chance on Daily Challenges." 
			},
			critChance: function(){
				return (0.0025 * (autoBattle.maxEnemyLevel - 1));
			},
			attackMod: function(){
				return 1 + (0.04 * (autoBattle.maxEnemyLevel - 1));
			}
		},
		bigSeeds: {
			description: "Gain x10 Mutated Seed Drops."
		},
		bigDust: {
			description: "Scruffy teaches Huffy how to find 5x Dust from SA enemies"
		},
		scruffBurst: {
			description: "Gamma Burst requires 1 fewer attack before triggering."
		},
		radortle2: {
			description: "Scruffy's level 3 bonus that increases Radon gain based on last Portal's highest Zone is no longer based on last Portal, and is now based on your highest Zone ever reached in Universe 2."
		},
		evenMoreVoid: {
			get description(){
				return "Scruffy's level 18 bonus that grants extra Void Maps now starts each U2 run with <b>1.5</b> extra Void Maps for every 5 Void Maps cleared on your BEST U2 run. (" + game.stats.mostU2Voids.valueTotal + " cleared on your best run, granting " + Math.floor(1.5 * Math.floor(game.stats.mostU2Voids.valueTotal / 5)) + " extra next run)";
			}
		},
		scaledHealth: {
			get description(){
				return "Your Trimps gain +50% Health per Scruffy level. Scruffy is currently level " + Fluffy.getLevel() + ", granting +" + prettify((this.mult() - 1) * 100) + "% Health.";
			},
			mult: function(){
				return 1 + (Fluffy.getLevel() * 0.5)
			}
		},
		doubleCrit: {
			description: "Your Trimps gain +20% Double Crit."
		},
		//Cruffys
		cruf1: {
			description: "Multiplies Radon earned by 1.5."
		},
		cruf2: {
			description: "Multiplies Radon earned by 2, and grants 5% increased health and attack to your Trimps."
		},
		cruf3: {
			description: "Multiplies Radon earned by 2.5, and increases all looted or gathered resources by 15%."
		},
		cruf4: {
			description: "Multiplies Radon earned by 3, and grants 20% Void Map Drop Chance."
		},
		cruf5: {
			description: "Grants 35% Crit Chance and adds 50% to base Crit Damage."
		},
		cruf6: {
			description: "Multiplies Radon earned by 1.75, and increases Cruffys' Trimp health and attack bonuses by 10%."
		},
		cruf7: {
			description: "Multiplies Radon earned by 2, and adds 25% to the Level 3 Resource bonus."
		},
		cruf8: {
			description: "Multiplies Radon earned by 1.1, and Cruffys will stick around for 5 Zones after Nurture ends, granting all non-Radon bonuses."
		},
		cruf9: {
			description: "Multiplies Radon earned by 1.1, and increases Cruffys' Trimp attack, health, and resource bonuses by an additional 20%. Cruffys will stay in your Universe for 5 additional Zones after Nurture ends."
		},
		cruf10: {
			get description(){
				var text = "Multiplies Radon earned by 1.04, and increases Cruffys' Trimp attack, health, and resource bonuses by an additional 10%. Cruffys will stay in your Universe for 1 additional Zone after Nurture ends for every 2 levels earned (11, 13, 15 etc). This is repeatable up to 10 times to a max level of 19."
				var level = game.challenges.Nurture.getLevel();
				if (level > 10){
					var stick = Math.floor((level - 9) / 2);
					text += "<br/><br/><b>Currently multiplying Radon earned by " + prettify(Math.pow(1.04, (level - 9))) + ", increasing attack, health and resources by " + prettify((level - 9) * 10) + "% and Cruffys will stay for " + stick + " additional Zone" + needAnS(stick) + ".</b>";
				}
				return text;
			}
		}
	}
}
//PlayFab Stuff

var playFabId = -1;

function enablePlayFab(){
	var loggedIn = (playFabId != -1);
	if (!loggedIn){
		tooltip("PlayFab Login", null, "update");
		loggedIn = tryPlayFabAutoLogin();
	}
	if (playFabId == -1) {
		return false;
	}
	return true;
}

function tryPlayFabAutoLogin(){
	var type = game.global.playFabLoginType;
	//-1 = not set, 1 = Kongregate, 2 = PlayFab
	if (type == -1) return false;
	if (type == 1){
		playFabLoginWithKongregate();
		return true;
	}
	if (type == 2){
		var info = readPlayFabInfo();
		if (!info) return false;
		playFabLoginWithPlayFab(info[0], info[1], (type == 2));
		game.global.playFabLoginType = type;
		return true;
	}
	return false;
}


function getPlayFabLoginHTML(){
	var tipHtml = [];
	tipHtml[0] = "<div id='playFabLoginError'></div><div class='row playFabRow'>";
	if (typeof kongregate !== 'undefined'){
		var userId = (kongregate && kongregate.services && kongregate.services.getUserId) ? kongregate.services.getUserId() : 0;
		tipHtml[0] += "<div id='playFabKongregateContainer' class='col-xs-6'><b>Login With Kongregate</b><br/>"
		if (userId > 0){
			tipHtml[0] += "<div id='playFabKongLoggedIn'>Click the button below to link a PlayFab account to your Kongregate account and begin or resume backing up your save online!<br/><br/><div class='alignCenter'><span class='btn btn-sm btn-primary' onclick='playFabLoginWithKongregate()'>Connect Kongregate<br/>To PlayFab</span></div></div>";
		}
		else
			tipHtml[0] += "<div id='playFabKongNotLoggedIn'>You are playing from Kongregate, but not logged in.<span class='inactiveBtn''>Must Be Logged In</span></div>";
		tipHtml[0] += "</div>";
	}
	else {
	var info = false;
	if (game.global.rememberInfo) {
		info = readPlayFabInfo();
	}
		tipHtml[0] += "<div id='playFabLoginContainer' class='col-xs-6'><b id='playFabLoginTitle'>Login to PlayFab</b><br/><span id='playFabEmailHidden' style='display: none'>Your Email<br/><span id='emailNotice' style='font-size: 0.8em'>(For recovery, not required)<br/></span><input type='text' id='registerEmail' /></span><span id='usernameBox'>PlayFab Username<br/><input type='text' id='loginUserName' " + ((info) ? "value='" + info[0] + "'" : "") + "/></span><span id='playFabPasswordBox'><br/>Password <span style='font-size: 0.8em'>(6-30 Chars)</span><br/><input type='password' id='loginPassword'" + ((info) ? " value='" + info[1] + "'" : "") + "/></span><br/><div id='playFabConfirmPasswordHidden' style='display: none'>Confirm Password<br/><input type='password' id='confirmPassword' /><br/></div><label id='rememberInfoBox'>Remember Account Info<br/>" + buildNiceCheckbox("rememberInfo", false, (info ? true : false)) +  "<br/></label><div id='playFabLoginBtn' class='btn btn-sm btn-info' onclick='playFabLoginWithPlayFab()'>Login</div><div id='playFabRegisterBtn' class='btn btn-sm btn-info' style='display: none' onclick='playFabRegisterPlayFabUser()'>Register</div><span style='display: none' id='playFabRecoverBtns'><div class='btn btn-sm btn-info' onclick='playFabRecoverInfo(false)' style='display: none'>Get Username</div><div class='btn btn-sm btn-primary' onclick='playFabRecoverInfo(true)'>Send Password Reset Email</div></span><div id='playFabSwitchRegisterBtn' onclick='switchForm(true)' class='btn btn-sm btn-primary'>Register Playfab Account</div><div id='playFabSwitchRecoveryBtn' onclick='switchForm(false)' class='btn btn-sm btn-warning'>Recover Account Info</div></div>"
	}
	tipHtml[0] += "<div id='playFabLoginInfo' class='col-xs-6'><ul><li>While connected to PlayFab, every time you manually save and <b>once per 30 minutes when auto-saving</b>, your file will also be sent to PlayFab's servers.</li><li>Data will be cleared from PlayFab's servers after 3 months of inactivity, this is not a permanent save!</li></ul>"
	tipHtml[1] = "<div class='btn btn-sm btn-danger' onclick='cancelTooltip()'>Cancel</div>";
	return tipHtml;
}

function switchForm(register){ //true for register, false for recovery
	var title = document.getElementById("playFabLoginTitle");
	var emailInput = document.getElementById("playFabEmailHidden");
	var loginBtn = document.getElementById("playFabLoginBtn");
	var registerBtn = document.getElementById("playFabRegisterBtn");
	var recoverBtn = document.getElementById("playFabRecoverBtns");
	var switchBtn = document.getElementById("playFabSwitchRegisterBtn");
	var passBox = document.getElementById("playFabPasswordBox");
	var nameBox = document.getElementById("usernameBox");
	var rememberBox = document.getElementById("rememberInfoBox");
	var emailNotice = document.getElementById("emailNotice");
	var switchRecoveryBtn = document.getElementById("playFabSwitchRecoveryBtn");
	var confirmPasswordBtn = document.getElementById("playFabConfirmPasswordHidden");
	if (emailInput != null) emailInput.style.display = "block";
	if (loginBtn != null) loginBtn.style.display = "none";
	if (registerBtn != null && register) registerBtn.style.display = "inline-block";
	else if (recoverBtn != null && !register) recoverBtn.style.display = "inline-block";
	if (nameBox != null && !register) nameBox.style.display = "none";
	if (emailNotice != null && !register) emailNotice.style.display = "none";
	if (switchBtn != null) switchBtn.style.display = "none";
	if (passBox != null && !register) passBox.style.display = "none";
	if (rememberBox != null && !register) rememberBox.style.display = "none";
	if (switchRecoveryBtn != null) switchRecoveryBtn.style.display = "none";
	if (confirmPasswordBtn != null && register) confirmPasswordBtn.style.display = "block";
	if (title != null) title.innerHTML = (register) ? "Register a PlayFab Account" : "Recover PlayFab Account Info - <i>Must have provided Email during registration</i>";
}

function playFabRecoverInfo(needsPassword){
	var error = document.getElementById("playFabLoginError");
	var emailElem = document.getElementById("registerEmail");
	var requestData = {
			TitleId: "9186",
			Email: emailElem.value
		}
	if (needsPassword){
		try {
			PlayFab.ClientApi.SendAccountRecoveryEmail(requestData, playFabRecoverCallback);
		}
		catch (e) {
			if (error != null) error.innerHTML = e.errorMessage;
		}
		return;
	}
	try {
		PlayFab.ClientApi.GetAccountInfo(requestData, playFabRecoverCallback);
	}
	catch (e) {
		console.log(e);
		if (error != null) error.innerHTML = e.errorMessage;
	}
}

function playFabRecoverCallback(data, error){
	var errorElem = document.getElementById("playFabLoginError");
	console.log(data, error);
	if (errorElem == null) return;
	if (error) {
		errorElem.innerHTML = error.errorMessage;
		return;
	}
	if (data.Username) {
		errorElem.innerHTML = "<span style='color: green'>Username is " + data.Username + "</span>";
		return;
	}
	if (data.status == "OK") errorElem.innerHTML = "<span style='color: green'>Recovery Email Sent!</span>";

}

function switchFormToRecovery(){
	var title = document.getElementById("playFabLoginTitle");
	if (title != null)
	var emailInput = document.getElementById("playFabEmailHidden");
	if (emailInput != null) emailInput.style.display = block;

}

function playFabRegisterPlayFabUser(){
	var error = document.getElementById("playFabLoginError");
	if (typeof PlayFab === 'undefined' || typeof PlayFab.ClientApi === 'undefined'){
		error.innerHTML = "Unable to Initialize the PlayFab API. Please check to make sure third-party scripts are enabled for Trimps, and that PlayFab is not blocked.";
		return;
	}
	var saveLogin = false;
	var nameElem = document.getElementById("loginUserName");
	var passElem = document.getElementById("loginPassword");
	var emailElem = document.getElementById("registerEmail");
	var rememberElem = document.getElementById("rememberInfo");
	var confirmPasswordElem = document.getElementById("confirmPassword");
	if (rememberElem && rememberElem.dataset.checked == "true") saveLogin = true;
	if (nameElem == null || passElem == null || emailElem == null || rememberElem == null || confirmPasswordElem == null){
		//Elements required to register are missing, rebuild login screen
		tooltip("PlayFab Login", null, "update");
		return;
	}
	if (confirmPasswordElem.value != passElem.value){
		error.innerHTML = "Passwords do not match!";
		return;
	}
	var requestData = {
		TitleId: "9186",
		Username: nameElem.value,
		Password: passElem.value,
		RequireBothUsernameAndEmail: false
	}
	if (emailElem.value) {
		requestData.Email = emailElem.value;
		requestData.RequireBothUsernameAndEmail = true;
	}
	try {
		PlayFab.ClientApi.RegisterPlayFabUser(requestData, playFabLoginCallback);
		if (saveLogin) {
			storePlayFabInfo(username, pass);
			game.global.playFabLoginType = 2;
		}
		else game.global.playFabLoginType = -1;
	}
	catch (e){
		error.innerHTML = "Unable to send registration request to PlayFab.";
	}
}

function playFabLoginWithPlayFab(username, pass){
	var error = document.getElementById("playFabLoginError");
	if (typeof PlayFab === 'undefined' || typeof PlayFab.ClientApi === 'undefined'){
		error.innerHTML = "Unable to Initialize the PlayFab API. Please check to make sure third-party scripts are enabled for Trimps, and that PlayFab is not blocked.";
		return;
	}
	var saveLogin = false;
	if (!username || !pass){
		var nameElem = document.getElementById("loginUserName");
		var passElem = document.getElementById("loginPassword");
		var rememberElem = document.getElementById("rememberInfo");
		if (rememberElem && rememberElem.dataset.checked == "true") saveLogin = true;
		if (nameElem == null || passElem == null){
			//Elements required to login are missing, rebuild login screen
			tooltip("PlayFab Login", null, "update");
			return;
		}
		else{
			username = nameElem.value;
			pass = passElem.value;
		}
	}
	var requestData = {
		TitleId: "9186",
		Username: username,
		Password: pass
	}
	try {
		PlayFab.ClientApi.LoginWithPlayFab(requestData, playFabLoginCallback);
		if (saveLogin) {
			storePlayFabInfo(username, pass);
			game.global.playFabLoginType = 2;
			game.global.rememberInfo = true;
		}
		else {
			game.global.playFabLoginType = -1;
			game.global.rememberInfo = false;
			}
	}
	catch (e){
		error.innerHTML = "Unable to send login request to PlayFab.";
	}
}


function playFabLoginWithKongregate(attempt){
	var error = document.getElementById("playFabLoginError");
	if (typeof PlayFab === 'undefined' || typeof PlayFab.ClientApi === 'undefined'){
		if (error != null) error.innerHTML = "Unable to Initialize the PlayFab API. Please check to make sure third-party scripts are enabled for Trimps, and that PlayFab is not blocked.";
		return;
	}
	if (typeof kongregate === 'undefined'){
		console.log("something went wrong... Kongregate defined but not defined?");
		//This should really never get to this function if Kongregate isn't defined
		return;
	}
	var userId = (kongregate && kongregate.services && kongregate.services.getUserId) ? kongregate.services.getUserId() : 0;
	if (userId == 0){
			if (!error) tooltip("PlayFab Login", null, "update");
			if (error) error.innerHTML = "You must be logged in to Kongregate to do that.";
			if (kongregate && (typeof kongregate.services === 'undefined' || typeof kongregate.services.getUserId === 'undefined')) {
				if (!attempt) attempt = 2;
				else attempt++;
				if (attempt < 6) {
					if (error) error.innerHTML += "&nbsp;<span class='greenText'>Attempting to Connect again, attempt: " + attempt + "/5</span>";
					setTimeout(function() {
						playFabLoginWithKongregate(attempt);
					}, 1500)
				}
				else if (error) error.innerHTML += " Unable to connect after 5 tries.";
			}
		return;
	}
	var authTicket = kongregate.services.getGameAuthToken();
	var requestData = {
		TitleId: "9186",
		KongregateId: userId,
		AuthTicket: authTicket,
		CreateAccount: true
	}
	try {
		PlayFab.ClientApi.LoginWithKongregate(requestData, playFabLoginCallback);
		game.global.playFabLoginType = 1;
	}
	catch (e){
		error.innerHTML = "Unable to send login request to PlayFab.";
		//Not sure if this will ever trigger, better safe
	}
}

function playFabLoginCallback(data, error){
	if (error){
		var errorElem = document.getElementById("playFabLoginError");
		if (errorElem != null && error.errorMessage){
			errorElem.style.display = "block";
			errorElem.innerHTML = error.errorMessage;
		}
		return;
	}
	if (data){
		playFabId = data.data.PlayFabId;
		if (playFabSaveErrors > 0) {
			playFabAttemptReconnect(true);
			return;
		}
		cancelTooltip();
		playFabSaveCheck();
	}
}

function cancelPlayFab(){
	cancelTooltip();
	playFabId = -1;
	game.global.playFabLoginType = -1;
}

function playFabSaveCheck(){
	if (playFabId == -1) return false;
	if (typeof PlayFab === 'undefined' || typeof PlayFab.ClientApi === 'undefined'){
		//Should never get this far without the api
		console.log(error);
		return;
	}
	var requestData = {
		Keys: ["saveString"],
		PlayFabId: playFabId
	}
	try {
		PlayFab.ClientApi.GetUserData(requestData, playFabSaveCheckCallback);
	}
	catch (e){console.log(e);}
}

function playFabSaveCheckCallback(data, error){
	if (error || !data){
		console.log("error checking existing PlayFab data");
		console.log(error);
		return;
	}
	if (data){
		var playFabSave;
		try{
			playFabSave = JSON.parse(LZString.decompressFromBase64(data.data.Data.saveString.Value));
		}
		catch(e){
			console.log(e);
			return;
		}
		if (!playFabSave || !playFabSave.global) return;
		var playFabHelium = (playFabSave.global.totalHeliumEarned) ? playFabSave.global.totalHeliumEarned : 0;
		var playFabRadon = (playFabSave.global.totalRadonEarned) ? playFabSave.global.totalRadonEarned : 0;
		var playFabTotalZones = (playFabSave.stats.zonesCleared.value) ? (playFabSave.stats.zonesCleared.value + playFabSave.stats.zonesCleared.valueTotal) : 0;
		var playFabHighestZone = (playFabSave.global.highestLevelCleared) ? playFabSave.global.highestLevelCleared : 0;
		if (playFabRadon > parseFloat(game.global.totalRadon) || playFabHelium > parseFloat(game.global.totalHeliumEarned) || playFabHighestZone > parseFloat(game.global.highestLevelCleared) || (playFabTotalZones > (game.stats.zonesCleared.value + game.stats.zonesCleared.valueTotal))){
			tooltip("PlayFab Conflict", null, "update", playFabHelium, playFabHighestZone, playFabTotalZones);
			return;
		}
		playFabFinishLogin(false);
	}
}

function playFabFinishLogin(downloadFirst){
	if (downloadFirst){
		loadFromPlayFab();
		return;
	}
	cancelTooltip();
	game.options.menu.usePlayFab.enabled = 1;
	toggleSetting("usePlayFab", null, false, true);
}

function saveToPlayFab(saveString){
	if (game.global.isBeta) return;
	if (!playFabId || typeof PlayFab === 'undefined' || typeof PlayFab.ClientApi === 'undefined') return false;
	var requestData = {
		TitleId: "9186",
		Data: {
			saveString: saveString		}
	}
	try{
		PlayFab.ClientApi.UpdateUserData(requestData, saveToPlayFabCallback);
	}
	catch(e){console.log(e);}

}

var playFabSaveErrors = 0;

function saveToPlayFabCallback(data, error){
	if (error){
		playFabSaveErrors++;
		message("Unable to back up your save to PlayFab! Double check your internet connection, and don't forget to back up your save manually.", "Notices");
		swapClass("iconState", "iconStateBad", document.getElementById('playFabIndicator'));
		console.log(error);
		if (playFabId != -1) {
			playFabAttemptReconnect();
		}
		return false;
	}
	if (data){
		swapClass("iconState", "iconStateGood", document.getElementById('playFabIndicator'));
		lastOnlineSave = performance.now();
		message("Game saved and backed up to PlayFab! Next automatic online save in 2 hours.", "Notices", null, "save");
		return true;
	}
}

function playFabAttemptReconnect(reconnected){
	console.log((reconnected) ? "Reconnected" : "Attempting to reconnect");
	if (reconnected){
		playFabSaveErrors = 0;
		message("Reconnected to PlayFab!", "Notices", null, "save");
		swapClass("iconState", "iconStateGood", document.getElementById('playFabIndicator'));
		return;
	}
	if (game.global.playFabLoginType >= 1) tryPlayFabAutoLogin();
}

function loadFromPlayFab(){
	if (!playFabId || typeof PlayFab === 'undefined' || typeof PlayFab.ClientApi === 'undefined') return false;
	var requestData = {
		Keys: ["saveString"],
		PlayFabId: playFabId
	}
	try{
		PlayFab.ClientApi.GetUserData(requestData, loadFromPlayFabCallback);
	}
	catch(e){console.log(e);}
}

function loadFromPlayFabCallback(data, error){
	if (error){
		console.log(error);
		return;
	}
	if (data){
		var id = playFabId;
		if (load(data.data.Data.saveString.Value, false, true)){
			playFabId = id;
			playFabFinishLogin();
			game.options.displayed = (document.getElementById('settingsHere').style.display == "block");
			return;
		}
		game.options.menu.usePlayFab.enabled = 0;
		toggleSetting("usePlayFab", null, false, true);
		playFabId = -1;
	}
}

function storePlayFabInfo(name, pass){
	try{
		localStorage.setItem("playFabName", name);
		localStorage.setItem("playFabPass", pass);
	}
	catch(e){console.log(e)}
	return false;
}

function readPlayFabInfo(){
	var info = [false, false];
	try {
		info[0] = localStorage.getItem("playFabName");
		info[1] = localStorage.getItem("playFabPass");
	}
	catch (e) {console.log(e)}
	if (info[0] && info[1]) return info;
	return false;
}

var loops = 0;
function gameLoop(makeUp, now) {
    gather(makeUp);
    craftBuildings();
	if (game.global.trapBuildToggled && game.global.trapBuildAllowed && game.global.buildingsQueue.length === 0) autoTrap();
    breed(makeUp);
    battleCoordinator(makeUp);
	if (game.global.titimpLeft) game.global.titimpLeft -= 0.1;
	loops++;
	//every 300ms
	if (loops % 3 == 0){
		autoBattle.update();
	}
	//every 400ms
	if (loops % 4 == 0){
		buyAutoStructures();
	}
	//every half second
	if (loops % 5 == 0){
		if (game.global.autoUpgradesAvailable) autoUpgrades();
	}
	//every second
	if (loops % 10 == 0){
		runEverySecond(makeUp);
	}
	//every 2 seconds
	if (loops % 20 == 0){
		if (mutations.Living.active()){
			mutations.Living.change();
		}
		if (usingScreenReader && !usingRealTimeOffline) screenReaderSummary();
		if ((game.global.alchemyUnlocked && game.global.universe == 2) || game.global.challengeActive == "Alchemy") alchObj.autoCraft();
		if (game.permaBoneBonuses.boosts.owned > 0) game.permaBoneBonuses.boosts.checkCharges();
	}
	if (bwRewardUnlocked("AutoJobs")){
		//Ratio jobs every 30 seconds (or every zone, see nextWorld)
		if (loops % 300 == 0){
			buyAutoJobs(true);
		}
		//Non ratio jobs every 2 seconds (non ratio jobs are still purchased with buyAutoJobs(true))
		else if (loops % 20 == 0){
			buyAutoJobs();
		}
	}
	if (game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.hemmorrhage !== 'undefined'){
		dailyModifiers.hemmorrhage.reduceTimer();
	}
	//loot averages
	if (loops % game.settings.ewma_ticks == 0){
		if (game.options.menu.useAverages.enabled) curateAvgs();
	}

	if (mutations.Magma.active()) generatorTick();
	if (!makeUp) postMessages();
	if (!makeUp && !usingRealTimeOffline && typeof steamCanvas !== 'undefined') steamCanvasContext.clearRect(0, 0, steamCanvas.width, steamCanvas.height);
}

function runEverySecond(makeUp) {
	// Change game state.
	if (challengeActive('Decay') || challengeActive('Melt')) updateDecayStacks(true);
	if (challengeActive('Daily') && typeof game.global.dailyChallenge.pressure !== 'undefined') dailyModifiers.pressure.addSecond();
	if (challengeActive('Archaeology')) game.challenges.Archaeology.checkAutomator(true);
	if (game.global.autoStorage) autoStorage();
	if (game.global.sugarRush > 0) sugarRush.tick();

	// Achieves.
	checkAchieve('totalGems');
	if (game.buildings.Trap.owned > 1000000) giveSingleAchieve('Hoarder');
	const heHr = game.stats.heliumHour.value();
	if (Math.floor(heHr) === 1337) {
		if (game.global.universe === 1) giveSingleAchieve('Elite Feat');
		if (game.global.universe === 2) giveSingleAchieve('Eliter Feat');
	}

	// Display and stats.
	if (savedOfflineText && !game.global.lockTooltip) {
		tooltip('Trustworthy Trimps', null, 'update', savedOfflineText);
		savedOfflineText = '';
	}
	if (trimpStatsDisplayed) displayAllStats();
	if (game.resources.helium.owned > 0 || game.resources.radon.owned > 0) {
		game.stats.bestHeliumHourThisRun.evaluate();
		const newHeliumPhHTML = `${prettify(heHr)}/hr`;
		const heliumPhElem = document.getElementById('heliumPh');
		if (heliumPhElem.innerHTML !== newHeliumPhHTML && !usingRealTimeOffline) {
			heliumPhElem.innerHTML = newHeliumPhHTML;
		}
		if (game.global.universe === 1) checkAchieve('heliumHour');
	}
	if (Fluffy.getBestExpStat().value > 0) game.stats.bestFluffyExpHourThisRun.evaluate();
	if (game.global.selectedChallenge === 'Daily') updateDailyClock();
	if (game.global.autoEquipUnlocked) buyAutoEquip();
	Fluffy.handleBox();
	updatePortalTimer();
	if (playerSpire.initialized) playerSpire.moveEnemies(makeUp);
	trackAchievement();
	holidayObj.checkAll();
	if (game.global.tutorialActive) tutorial.check();
}

function getGameTime(){
	return game.global.start + game.global.time;
}

function gameTimeout() {
	if (game.options.menu.pauseGame.enabled) {
		setTimeout(gameTimeout, 100);
		return;
	}
	var now = new Date().getTime();
	//4432
	if ((now - game.global.start - game.global.time) > 3600000){	
		checkOfflineProgress();
		game.global.start = now;
		game.global.time = 0;
		game.global.lastOnline = now;
		setTimeout(gameTimeout, (1000 / game.settings.speed));
		return;
	}
	game.global.lastOnline = now;
    var tick = 1000 / game.settings.speed;
    game.global.time += tick;
	var dif = (now - game.global.start) - game.global.time;
    while (dif >= tick) {
        runGameLoop(true, now);
        dif -= tick;
        game.global.time += tick;
		ctrlPressed = false;
	}
    runGameLoop(null, now);
    updateLabels();
    setTimeout(gameTimeout, (tick - dif));
}

/**
 * Passes parameters to gameLoop, handles errors.
 * @param  {bool} makeUp makeUp causes the function to loop to exhaust ticks
 * @param  {Date} now    Date.now()
 */
function runGameLoop(makeUp, now) {
	if (usingRealTimeOffline) return;
	try {
		gameLoop(makeUp, now);
	} catch (e) {
		unlockTooltip(); // Override any other tooltips
		tooltip('hide');
		tooltip('Error', null, 'update', e.stack);
		throw(e);
	}
}
function updatePortalTimer(justGetTime) {
	if (game.global.portalTime < 0) return;
	var timeSince = getGameTime() - game.global.portalTime;
	timeSince /= 1000;
	var timeString = formatSecondsAsClock(timeSince);
	if (justGetTime) return timeString;
	if (game.options.menu.pauseGame.enabled) timeString = timeString + " (PAUSED)";
	document.getElementById("portalTime").textContent = timeString;
}

function formatSecondsAsClock(timeSince, maxOutputs){
	var days = Math.floor(timeSince / 86400);
	var hours = Math.floor( timeSince / 3600) % 24;
	var minutes = Math.floor(timeSince / 60) % 60;
	var seconds = Math.floor(timeSince % 60);
	var timeArray = [days, hours, minutes, seconds];
	var timeString = "";
	var startAt = (maxOutputs) ? maxOutputs : 0;
	for (var x = startAt; x < 4; x++){
		var thisTime = timeArray[x];
		thisTime = thisTime.toString();
		timeString += (thisTime.length < 2) ? "0" + thisTime : thisTime;
		if (x != 3) timeString += ":";
	}
	return timeString;
}

function preventZoom(elem){
	elem.addEventListener("wheel", zoomShortcut); //add the event
}
  
function zoomShortcut(e){
	if(e.ctrlKey){
		event.preventDefault();
	}
}

function mapLevelHotkey(up){
	if (!game.global.preMapsActive) return;
	if (!game.options.menu.hotkeys.enabled) return;
	if (usingScreenReader) return;
	var worldInput = (parseInt(document.getElementById('mapLevelInput').value, 10));
	var extraLevelsAvailable = (getHighestLevelCleared() >= getUnlockZone('extra'));
	var extraElem = document.getElementById('advExtraLevelSelect');
	var extraSetting = parseInt(extraElem.value, 10);
	if (worldInput > game.global.world) {
		document.getElementById("mapLevelInput").value = game.global.world;
		updateMapCost();
		return;
	}
	if (worldInput < 6){
		document.getElementById("mapLevelInput").value = 6;
		updateMapCost();
		return;
	}
	if (up){
		if (worldInput < game.global.world) incrementMapLevel(1);
		else if (extraLevelsAvailable && extraSetting < 10) {
			extraElem.value = extraSetting + 1;
		}
		updateMapCost();
		return;
	}
	if (extraLevelsAvailable && extraSetting > 0){
		extraElem.value = extraSetting - 1;
	}
	else {
		if (worldInput > 6) incrementMapLevel(-1);
	}
	updateMapCost();
}

var shiftPressed = false;
var ctrlPressed = false;
// X = 88, h = 72, d = 68, b = 66
document.addEventListener('keydown', function (e) {
	var checkStatus = function () {
		return !(usingScreenReader && playerSpire.popupOpen) && game.options.menu.hotkeys.enabled == 1 && !game.global.preMapsActive && !game.global.lockTooltip && !ctrlPressed && !heirloomsShown && !geneMenuOpen && !game.options.displayed && !portalWindowOpen && !trimpStatsDisplayed && !trimpAchievementsOpen && !u2Mutations.open;
	};
	var checkLettersOk = function () {
		return !(usingScreenReader && playerSpire.popupOpen) && game.options.menu.hotkeys.enabled == 1 && !game.global.lockTooltip && !ctrlPressed && (document.getElementById('heirloomNameInput') == null) && !game.options.displayed && !portalWindowOpen && !trimpStatsDisplayed && !trimpAchievementsOpen && !usingRealTimeOffline && !u2Mutations.open;
	};
	switch(e.keyCode){
		case 27: //escape
			if (game.global.lockTooltip || geneMenuOpen) cancelTooltip();
			else if (playerSpire.popupOpen) playerSpire.closePopup();
			else if (heirloomsShown) toggleHeirlooms();
			else if (trimpStatsDisplayed) toggleStats();
			else if (trimpAchievementsOpen) toggleAchievementWindow();
			else if (game.options.displayed) toggleSettingsMenu();
			else if (portalWindowOpen || game.global.viewingUpgrades) cancelPortal();
			else if (bonesShown) hideBones();
			else if (u2Mutations.open) u2Mutations.closeTree();
			//last
			else if (!game.global.usingRealTimeOffline) toggleSettingsMenu();
			break;
		case 16:
			shiftPressed = true;
			if (typeof onShift === 'function') onShift();
			onShift = null;
			break;
		case 17:
		case 224:
		case 91:
		case 93:
			var wasCtrl = ctrlPressed;
			ctrlPressed = true;
			if (!wasCtrl){
				toggleGeneticistassist(true);
				checkButtons("upgrades");
				if (game.global.buyTab == "nature")
					updateNatureInfoSpans();
				if (game.global.buyTab == "talents") displayTalents();
			}
			e.preventDefault();
			break;
		
		case 192: // `
		case 48: //0
		case 96: //num0
			if (playerSpire.popupOpen && !usingScreenReader)
				playerSpire.selectTrap("sell");
			break;
		case 49: //1
		case 97: //num1
			if (playerSpire.popupOpen && !playerSpireTraps.Fire.locked && !usingScreenReader){
				playerSpire.selectTrap("Fire");
				break;
			}
		case 88: //x
			if (checkStatus() && game.upgrades.Formations.done) setFormation('0');
			break;
		case 50: //2
		case 98: //num2
			if (playerSpire.popupOpen && !playerSpireTraps.Frost.locked && !usingScreenReader){
				playerSpire.selectTrap("Frost");
				break;
			}
		case 72: //h
			if (checkStatus() && game.upgrades.Formations.done) setFormation('1');
			break;
		case 51: //3
		case 99: //num3
			if (playerSpire.popupOpen && !playerSpireTraps.Poison.locked && !usingScreenReader){
				playerSpire.selectTrap("Poison");
				break;
			}
		case 68: //d
			if (checkStatus() && game.upgrades.Dominance.done) setFormation('2');
			break;
		case 52: //4
		case 100: //num4
			if (playerSpire.popupOpen && !playerSpireTraps.Lightning.locked && !usingScreenReader){
				playerSpire.selectTrap("Lightning");
				break;
			}
		case 66: //b
			if (checkStatus() && game.upgrades.Barrier.done) setFormation('3');
			break;
		case 53: //5
		case 101: //num5
			if (playerSpire.popupOpen && !playerSpireTraps.Strength.locked && !usingScreenReader){
				playerSpire.selectTrap("Strength");
				break;
			}
		case 83: //s
			if (checkStatus() && game.global.world >= 60 && getHighestLevelCleared() >= 180 && game.global.universe == 1) setFormation('4');
			break;
		case 54: //6
		case 102: //num6
			if (playerSpire.popupOpen && !playerSpireTraps.Condenser.locked && !usingScreenReader){
				playerSpire.selectTrap("Condenser");
				break;
			}
		case 87: //W
			if (checkStatus() && game.global.uberNature == "Wind") setFormation('5');
		case 55: //7
		case 103: //num7
			if (playerSpire.popupOpen && !playerSpireTraps.Knowledge.locked && !usingScreenReader)
				playerSpire.selectTrap("Knowledge");
			break;
		case 13: //enter
			if (usingScreenReader && document.activeElement.id == "spireScreenReadInput"){
				playerSpire.screenReadCommand();
				return;
			}
			var confirmCheck = document.getElementById("confirmTooltipBtn");
			if (confirmCheck !== null && typeof confirmCheck.onclick == 'function'){
				confirmCheck.onclick();
			}
			break;
		case 77:
			// M for maps
			if (checkLettersOk() && game.global.mapsUnlocked) {
				mapsClicked();
			}
			break;
		case 82:
			// R for repeat
			if (checkLettersOk() && game.global.mapsActive) {
				repeatClicked();
			}
			break;
		case 65:
			// A for AutoFight
			if (checkLettersOk() && game.global.autoBattle) {
				pauseFight();
			}
			break;
		case 67:
			// C for Heirloom Chances and Continue/Run Map
			if (checkLettersOk() && heirloomsShown){
				lastMainHeirIndex = -1;
				toggleHeirloomChances();
			}
			else if (checkLettersOk() && game.global.lookingAtMap && game.global.preMapsActive){
				runMap();
			}
			break;
		case 32:
			// Space for pause
			if (checkLettersOk()){
				toggleSetting('pauseGame');
			}
			break;
		case 70:
			// F for fight
			if (checkLettersOk() && game.upgrades.Battle.done) {
				fightManual();
			}
			break;
		case 73: 
			//i for spIre Assault
			if (game.global.highestRadonLevelCleared >= 74){
				if (game.global.lockTooltip && lastTooltipTitle == "Spire Assault") cancelTooltip();
				else if (checkLettersOk()) autoBattle.popup();
			}
			break;
		case 80: //p for sPire
			if (checkLettersOk() && playerSpire.initialized){
				if (playerSpire.popupOpen) playerSpire.closePopup();
				else playerSpire.openPopup();
			}
			break;
		case 90: //z for map at zone
			if (game.global.lockTooltip && lastTooltipTitle == "Set Map At Zone") {
				var confirmCheck = document.getElementById("confirmTooltipBtn");
				if (confirmCheck !== null && typeof confirmCheck.onclick == 'function'){
					confirmCheck.onclick();
				}
			}
			else if (checkLettersOk() && game.global.canMapAtZone){
				cancelTooltip();
				toggleSetting("mapAtZone", undefined, false, false, false, true);
			}
			break;
		case 37: //Left arrow for - heirloom rarity, advisor
			if (checkLettersOk()){
				if (heirloomsShown && document.getElementById('heirloomDropChances').style.display != 'none'){
					changeHeirloomRarityRange(-1);
				}

			}
			break;
		case 39: //Right arrow for opposites of left arrow
			if (checkLettersOk()){
				if (heirloomsShown && document.getElementById('heirloomDropChances').style.display != 'none'){
					changeHeirloomRarityRange(1);
				}

			}
			break;
		case 38: 
			//Up arrow for map levels
			mapLevelHotkey(true);
			break;
		case 40: 
			//Down arrow for map levels
			mapLevelHotkey(false);
			break;
		case 84: //t
			if (checkLettersOk() && game.global.portalActive) portalClicked();
			break;
		case 69: //e
			if (game.global.lockTooltip && lastTooltipTitle.startsWith("Scale Equality Scaling")) {
				cancelTooltip();
				break;
			}
			if (checkLettersOk() && !game.portal.Equality.radLocked){tooltip('hide'); tooltip('Scale Equality Scaling', null, 'update', true);}
			break;
		case 116: //f5 to reload on desktop version
			if (typeof nw !== 'undefined') nw.Window.get().reload();
			break;
		case 86: //v for adVisor
			if (checkLettersOk()) tutorial.popup();
			break;
		case 75: //k for hotKeys
			if (game.global.lockTooltip && lastTooltipTitle == "Hotkeys") cancelTooltip();
			else if (checkLettersOk()) {cancelTooltip(); tooltip('Hotkeys', null, 'update');}
			break;
		case 76: //L for heirLooms
			if (checkLettersOk() && (game.stats.totalHeirlooms.valueTotal + game.stats.totalHeirlooms.value > 0)) toggleHeirlooms();
			break;
		case 79: //O for wOrship shrine
			if (checkLettersOk() && game.permaBoneBonuses.boosts.owned > 0) game.permaBoneBonuses.boosts.consume();
			break;
		case 122: //f11 for fullscreen on desktop version
			if (typeof nw !== 'undefined'){
				nw.Window.get().toggleFullscreen();
			}
	}
}, true);


function gameUnfocused(){
	ctrlPressed = false;
	shiftPressed = false;
}

document.addEventListener('keyup', function(e) {
	if (e.keyCode == 16){
		if (game.options.menu.tooltips.enabled == false) tooltip('hide');
		shiftPressed = false;
	}
	if (e.keyCode == 17 || e.keyCode == 224 || e.keyCode == 91 || e.keyCode == 93){
		ctrlPressed = false;
		checkButtons("upgrades");
		toggleGeneticistassist(true);
		if (game.global.buyTab == "nature")
			updateNatureInfoSpans();
		if (game.global.buyTab == "talents") 
			displayTalents();
	}

}, true);

if (typeof greenworks !== 'undefined'){
	loadFromSteam();
}
else load();

if (game.global.isBeta) message("Note: You are playing on the beta/dev version. You will be unable to export your save from this version to the live version, and this server may go down or change without warning. Thank you for helping test!", "Notices");
holidayObj.checkAll();
displayPerksBtn();

autoSaveTimeout = setTimeout(autoSave, 60000);
costUpdatesTimeout();
setTimeout(gameTimeout, (1000 / game.settings.speed));
game.options.menu.darkTheme.onToggle();

if (usingScreenReader) {
	// disable perf settings for SR. No eye candy here.
	let perfSettings = ['queueAnimation', 'progressBars', 'generatorAnimation', 'fadeIns', 'showHeirloomAnimations']
	perfSettings.forEach((setting) => { game.options.menu[setting].enabled = 0; })
	
	screenReaderSummary();
	makeScreenreaderTooltips();
	let infoElem = document.getElementById("screenReaderInfo")
	let text = `<span>${buildNiceCheckbox("srTooltipMode", false, srTooltipMode == "button",
			'srTooltipMode = (srTooltipMode == "click" ? "button" : "click"); makeScreenreaderTooltips();', "Enable Info Buttons")}</span>`
	infoElem.insertAdjacentHTML("beforeend", text) 
}

preventZoom(document.getElementById('talentsContainer'));
document.getElementById('mapLevelInput').addEventListener('keydown', function(e) {
    if (e.which === 38 || e.which === 40) {
        e.preventDefault();
    }
});

(function() {
    mutTreeWrapper.addEventListener('pointerdown', function(e) {
        u2Mutations.lastX = null;
        u2Mutations.lastY = null;
    })
    mutTreeWrapper.addEventListener('wheel', function(e) {
        if(e.deltaY > 0) {
            u2Mutations.scale -= 0.1;
        }
        else if(e.deltaY < 0) {
            u2Mutations.scale += 0.1;
        }
        if(u2Mutations.scale > 1.5) u2Mutations.scale = 1.5;
        if(u2Mutations.scale < 0.5) u2Mutations.scale = 0.5;
        u2Mutations.update();
    })
    mutTreeWrapper.addEventListener('pointermove', function(e) {
        if(Date.now() - u2Mutations.lastEvent >= 1000/60) {
            u2Mutations.lastEvent = Date.now();
            u2Mutations.reset();
            u2Mutations.dragging(e);
        }
    })
})()

function makeScreenreaderTooltips() {
	// Screen Reader Tooltips
	// This could be used to make mouseover events too, to get them out of the html files
	const tooltips = {
		// battleside buttons
		fightBtn: ['Fight', null], 
		pauseFight: ['AutoFight', null], 
		mapsBtn: ['Maps', null], 
		portalBtn: ['Portal', null], 
		repeatBtn: ['Repeat Map', null], 
		finishDailyBtn: ['Finish Daily', null], 
		// nature tab, these have additional handling required
		natureInfoPoison: ['description', 'Poison'],
		natureUpgradePoisonBtn: ['upgrade', 'Poison'],
		natureStackTransferPoisonBtn: ['stackTransfer', 'Poison'],
		uberPoisonContainer: ['uberEmpower', 'Poison'],
		naturePoisonWindBtn: ['convert', 'Poison', 'Wind'],
		naturePoisonIceBtn: ['convert', 'Poison', 'Ice'],
		natureInfoWind: ['description', 'Wind'],
		natureUpgradeWindBtn: ['upgrade', 'Wind'],
		natureStackTransferWindBtn: ['stackTransfer', 'Wind'],
		uberWindContainer: ['uberEmpower', 'Wind'],
		natureWindPoisonBtn: ['convert', 'Wind', 'Poison'],
		natureWindIceBtn: ['convert', 'Wind', 'Ice'],
		natureInfoIce: ['description', 'Ice'],
		natureUpgradeIceBtn: ['upgrade', 'Ice'],
		natureStackTransferIceBtn: ['stackTransfer', 'Ice'],
		uberIceContainer: ['uberEmpower', 'Ice'],
		natureIcePoisonBtn: ['convert', 'Ice', 'Poison'],
		natureIceWindBtn: ['convert', 'Ice', 'Wind'],
		// Map Chamber
		advSpecialSelect: ['Special Modifier', 'advMaps'],
		advPerfectCheckbox: ['Perfect Sliders', 'advMaps'],
		advExtraLevelSelect: ['Extra Zones', 'advMaps'],
		biomeAdvMapsSelect: ['Biome', 'advMaps'],
		difficultyAdvMapsRange: ['Difficulty', 'advMaps'],
		sizeAdvMapsRange: ['Size', 'advMaps'],
		lootAdvMapsRange: ['Loot', 'advMaps'],
		// All other in-html tooltips (auto generated-ish)
		boneShrineBtn: ['Bone Shrine', null],
		portalTimer: ['Pause the game', 'customText', game.options.menu['pauseGame'].description],
		fluffyBox: ['Fluffy', null],
		heliumPh: ['Helium Per Hour', null],
		turkimpBuff: ['Well Fed', null],

		talentsTab: ['Mastery', null],
		equalityTab: ['Equality Scaling', null, true],
		natureTab: ['Empowerments of Nature', null],
		tab6: ['Buy Max', 'customText', 'Switching to this option will spend the majority of your resources with each purchase. Click twice to customize.'],

		autoStructureText: ["AutoStructure", null],
		autoStorageBtn: ['AutoStorage', 'customText', 'Enabling this will cause your Trimps to automatically add a storage building to the queue if you reach max capacity. This will work on and offline if enabled.'],
		autoJobsText: ["AutoJobs", null],
		fireBtn: ['Fire Trimps', null],
		autoGoldenText: ['AutoGold', null],
		autoPrestigeBtn: ['AutoPrestige', null],
		autoUpgradeBtn: ['AutoUpgrade', null],
		autoEquipText: ["AutoEquip", null],
		talentRespecBtn: ["Respec Masteries", null],

		formation0: ['No Formation', 'customText', 'Clear your formations, return to normal stats, and derp around the battlefield. (Hotkeys: X or 1)'],
		formation1: ['Heap Formation', 'customText', 'Trimps gain 4x health but lose half of their attack and block. (Hotkeys: H or 2)'],
		formation2: ['Dominance Formation', 'customText', 'Trimps gain 4x attack but lose half of their health and block. (Hotkeys: D or 3)'],
		formation3: ['Barrier Formation', 'customText', 'Trimps gain 4x block and 50% block pierce reduction but lose half of their health and attack. (Hotkeys: B or 4)'],
		formation4: ['Scryer Formation', null],
		formation5: ['formation', 'Wind'],

		chainHolder: ['MagnetoShriek', null],
		badCanCrit: ['Crushing Blows', 'customText', 'Your current health is higher than your block, making you vulnerable to critical strikes from your enemies. Better fix that...'],

		advMapsHideBtn: ['Show/Hide Map Config', 'advMaps'],
		advMapsPreset1: ['Map Preset', 'advMaps'],
		advMapsPreset2: ['Map Preset', 'advMaps'],
		advMapsPreset3: ['Map Preset', 'advMaps'],
		advMapsPreset4: ['Map Preset', 'advMaps'],
		advMapsPreset5: ['Map Preset', 'advMaps'],
		advMapsSaveBtn: ['Save Map Settings', 'advMaps'],	
		advMapsResetBtn: ['Reset Map Settings', 'advMaps'],											
		advMapsRecycleBtn: ['Recycle All', null],

		swapPortalUniverseBtn: ['Change Universe', null],
		presetTab1: ['Perk Preset', null, 1],
		presetTab2: ['Perk Preset', null, 2],
		presetTabSave: ['Perk Preset', null, 'Save'],
		presetTabLoad: ['Perk Preset', null, 'Load'],							
		presetTabRename: ['Perk Preset', null, 'Rename'],
		presetTabExport: ['Perk Preset', null, 'Export'],
		presetTabImport: ['Perk Preset', null, 'Import'],
		ptab6: ['Buy Max', 'customText', 'Switching to this option will spend the majority of your Helium with each purchase. Click twice to customize.'],
		challengeSquaredViewBtn: ['Challenge2', null, true],
		inPortalC2Button: ['Challenge2', null],
		respecPortalBtn: ['Respec', null],
		swapToCurrentChallengeBtn: ['View Current Challenge', 'customText', 'Swap the Challenge Selection pane to instead display your current challenge, or vice versa'],
		respecMutatorsBtn: ['Respec Mutators', null],
	}; 
	if (usingScreenReader) {
		for (const [elemID, args] of Object.entries(tooltips)) {
			makeAccessibleTooltip(elemID, args)
		}
	}
}

function makeAccessibleTooltip(elemID, args) {
	// args is an array of [what, isItIn, textString, attachFunction, numCheck, renameBtn, noHide, hideCancel, ignoreShift]
	if (usingScreenReader) {
		// This contains no less than three different options for how to show tooltips. I may have gone mad.
		// Pick one. Or two.  Or tie it to a setting. 
		let elem = document.getElementById(elemID);
		if (!elem) { console.warn(`Attempted to add an event listener to ${elem} but it doesn't exist`); return; }
		
		// ? tooltip
		elem.addEventListener("keydown", function (event) {keyTooltip(event, ...args)});
		elem.setAttribute("tabindex", 0);

		// Shift-Enter(aka shift-click) 
		// Because of NVDA strangeness, this only works on true <button>s, so limit it to those, not just role=button 
		// Because of Javascript scope issues, the wrapper breaks `this` scope. So, future self, if you find yourself tearing your hair out because you have a button with a tooltip that uses `this` in the onclick callback, this is why. Good luck to you.
		if (elem.tagName === "BUTTON") {
			let callback = elem.onclick;
			elem.onclick = () => {
				if(shiftPressed) {
					keyTooltip({key: "?"}, ...args)
					return;
				}
				if (callback) { callback() }
			}
		}
		// Separate info buttons
		if (srTooltipMode == "button" && elem.style.visibility !== "hidden" && elem.style.display !== "none") {
			let infoElem = document.createElement("div");
			infoElem.innerText = "Info";
			infoElem.className = "visually-hidden SRinfoButton"
			infoElem.addEventListener("click", function (event) { keyTooltip({key: "?"}, ...args) } );
			elem.insertAdjacentElement("afterend", infoElem);
		}
		else if (srTooltipMode == "click") { // remove all added info buttons (if they exist) when using click mode
			document.querySelectorAll(".SRinfoButton").forEach((elem) => {elem.remove()})
		}
	}
	else {
		if (true === false && !elem.onmouseover) { // TODO very cheeky way of saying this should work but I'm not doing it. (also needs the nature tooltip handling from keytooltip before it will all actually work)
			elem.addEventListener("onmouseover", function (event) { tooltip(...Object.values(arguments).slice(0,2), event, ...Object.values(arguments).slice(2,) ); });
			elem.addEventListener("onmouseout", function (event)  { tooltip("hide"); });
		}
	}
}

function keyTooltip(keyEvent, what, isItIn, event, textString, attachFunction, numCheck, renameBtn, noHide, hideCancel, ignoreShift){
	// wrapper for tooltips to show screen reader tooltips using onkeydown
	if (usingScreenReader && keyEvent && keyEvent.key == "?") {
		const natureTooltips = ["Poison", "Wind", "Ice"]
		if (natureTooltips.includes(isItIn)) natureTooltip(...Object.values(arguments))
		else if (isItIn == "trapTooltip") { playerSpire.trapTooltip(what, "screenRead") }
		else if (isItIn == "upgradeTooltip") { playerSpire.upgradeTooltip(what, "screenRead") }
		else if (isItIn == "infoTooltip") { playerSpire.infoTooltip(what, "screenRead") }
		else if (isItIn == "messageConfigHover") { messageConfigHover(what) }
		else if (isItIn == "showGeneratorUpgradeInfo") { showGeneratorUpgradeInfo(...what) }
		
		else tooltip(what, isItIn, "screenRead", ...Object.values(arguments).slice(3,))
	}
}
