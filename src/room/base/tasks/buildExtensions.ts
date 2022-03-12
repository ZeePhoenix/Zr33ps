import { TaskProgressContext, TaskRunner } from "../../../definitions";
import { isExtension } from '../../../utils/typeGuard';
import { getPositionsNear, positionIsEmpty, isPositionIncluded, sortByDistanceTo } from '../../../utils/positions';

type CheckerboardType = 'MODS_EQUAL' | 'MODS_DIFFERENT';

const DRY_RUN = false;

const EXTENSIONS_ALLOWED: { [rcl: number]: number } = {
	0: 0,
	1: 0,
	2: 5,
	3: 10,
	4: 20,
	5: 30,
	6: 40,
	7: 50,
	8: 60,
};
const ROOM_ELEMENT_RESERVED_DISTANCE = 2;

const buildExtensions: TaskRunner = {
	delayCheck: true,
	init: (context: TaskProgressContext, room: Room) => {
		const extensionsAllowed = EXTENSIONS_ALLOWED[room.controller!.level];
		const extensionsPlaced = room.find(FIND_MY_STRUCTURES, {
			filter: (structure) => isExtension(structure)
		}).length;
		const extensionsToPlan = extensionsAllowed - extensionsPlaced;

		const validPositions = getValidPositions(room);

		const spawns = room.find(FIND_MY_SPAWNS);
		const spawn = spawns[0];
		const sortedPositions = validPositions.sort(sortByDistanceTo(spawn.pos));

		for (let i=0; i< extensionsToPlan; i++){
			console.log('Planning Extension');
			const extensionPos = sortedPositions[i];
			if (DRY_RUN){
				room.createFlag(extensionPos, 'Free Extension+${Math.randon()}');
			} else {
				room.createConstructionSite(extensionPos, STRUCTURE_EXTENSION)
			}
		}
	},
	check: (context: TaskProgressContext, room:Room) => {
		const extensionsInProgress = room.find(FIND_MY_CONSTRUCTION_SITES, {
			filter: (site) => site.structureType === 'extension'
		});
		return extensionsInProgress.length === 0;
	}
};

export default buildExtensions;

function getValidPositions(room: Room){
	const spawns = room.find(FIND_MY_SPAWNS);
	const spawn = spawns[0];
	const checkerboardType = getCheckerboardType(spawn.pos);

	// Exclude bad terrain
	const roomTerrain = new Room.Terrain(room.name);

	// Exclude structures
	const structurePositions = room.find(FIND_STRUCTURES).map(structure => structure.pos);
	// Exclude construction sites
	const constructionSitePositions = room.find(FIND_CONSTRUCTION_SITES).map(site => site.pos);
	// Exclude planned structures
	// TODO make better way to sort flags
	const buildingPlanPositions = room.find(FIND_FLAGS).map(flag => flag.pos);

	// TODO fix this
	// Supposed to exclude spaces within 2 of our sources and controller
	const roomElementPositions = [
		...room.find(FIND_SOURCES).map(source => source.pos),
		room.controller!.pos
	];
	const roomElementNearbyPositions = flatMap(roomElementPositions,
		(pos) => getPositionsNear(pos, ROOM_ELEMENT_RESERVED_DISTANCE))[0];


	const validPositions = createCheckerboardPositions(room, checkerboardType)
		.filter(pos =>
			positionIsEmpty(pos, roomTerrain)
			&& !isPositionIncluded(pos, structurePositions)
			&& !isPositionIncluded(pos, constructionSitePositions)
			&& !isPositionIncluded(pos, buildingPlanPositions)
			//&& !isPositionIncluded(pos, roomElementNearbyPositions) //does not contain push pop?
		);
	return validPositions;
}

function getCheckerboardType(pos: RoomPosition): CheckerboardType {
	if (pos.x % 2 === pos.y % 2) {
		return 'MODS_EQUAL';
	} else {
		return 'MODS_DIFFERENT';
	}
}

function createCheckerboardPositions(room: Room, checkerboardType: CheckerboardType) {
	const results = []
	for (let y = 0; y <= 49; y++){
		for (let x = 0; x <= 49; x++){
			const pos = new RoomPosition(x,y,room.name);
			if (getCheckerboardType(pos) === checkerboardType){
				results.push(pos);
			}
		}
	}
	return results;
}


function flatMap<I, O>(arr:I[], fn: (elem: I) => O[]): O[] {
	const results: O[] = [];
	for(let elem of arr) {
		const elemResults = fn(elem);
		for(let result of elemResults){
			results.push(result);
		}
	}
	return results;
}
