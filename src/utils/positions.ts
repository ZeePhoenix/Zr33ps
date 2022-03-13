import { debugCreep } from '../utils/debugCreep';
import { PathFinderGoal } from '../definitions';
//import { isBuffer } from '../utils/typeGuard';

export function isAdjacent(pos1: RoomPosition, pos2: RoomPosition): boolean{
	return isWithinRange(pos1, pos2, 1);
}

export function isWithinRange(pos1: RoomPosition, pos2: RoomPosition, maxRange: number):boolean{
	if (pos1.roomName !== pos2.roomName){
		return false;
	} else {
		const negRange = maxRange * -1;
		const dx = pos2.x - pos1.x;
		const dy = pos2.y - pos1.y;
		return (
			dx >= negRange && dx <= maxRange &&
			dy >= negRange && dy <= maxRange
		);
	}
}

export function isDiagonal(pos1: RoomPosition, pos2: RoomPosition): boolean{
	return (pos1.x !== pos2.x && pos1.y !== pos2.y);
}

export function positionIsEmpty(pos: RoomPosition, terrain: RoomTerrain): boolean{
	const positionTerrain = terrain.get(pos.x, pos.y);
	switch(positionTerrain){
		case 0: // Plain
			return true;
		case 1: // Wall
			return false;
		case 2: // Swamp
			return false;
		default:
			throw new Error('Unreachable!');
	}
}

export function getClosestToCreep<T extends AnyStructure | Creep>(creep: Creep, objects: T[],range: number): T | null {
	debugCreep(creep, 'getClosestToCreep');
	const goals: PathFinderGoal[] = objects.map(object =>({
		pos: object.pos,
		range
	}));
	const result = PathFinder.search(creep.pos, goals);
	if (result.incomplete){
		debugCreep(creep, 'could not find a result');
		return null;
	} else if (result.path.length === 0) {
		debugCreep(creep, 'already adjacent');
		const closestObject = objects.find(o=> isAdjacent(o.pos, creep.pos)) || null;
			return closestObject;
	} {
		const position = result.path[result.path.length-1];
		const closestObject = objects.find(o=> isAdjacent(o.pos, creep.pos)) || null;
		debugCreep(creep, `chose ${closestObject ? closestObject.id : null}`);
		return closestObject;
	}
}

export function positionsEqual(pos1: RoomPosition, pos2: RoomPosition){
	return pos1.x === pos2.x
		&& pos1.y === pos2.y
		&& pos1.roomName === pos2.roomName;
}

export function getPositionsNear(pos: RoomPosition, maxDistance: number){
	const results = [];
	for(let y = pos.y - maxDistance; y <= pos.y + maxDistance; y++){
		for(let x = pos.x - maxDistance; x <= pos.x + maxDistance; x++){
			const roomPosition = new RoomPosition(x,y,pos.roomName);
			results.push(roomPosition);
		}
	}
	return results;
}

export function isPositionIncluded(pos: RoomPosition, positions: RoomPosition[]){
	for(let p of positions){
		if (pos.x === p.x &&
			pos.y === p.y &&
			pos.roomName === p.roomName){
				return true;
			}
	}
	return false;
}

export const sortByDistanceTo = (targetPos: RoomPosition) => (a: RoomPosition, b:RoomPosition)=>{
	const distanceA = a.getRangeTo(targetPos);
	const distanceB = b.getRangeTo(targetPos);
	return distanceA - distanceB;
};

export function getNearbyAvalibleBuffer(creep:Creep): StructureContainer{
	// Get all containers in same room as creep
	// Filter containers for a buffer
	// return closest buffer to creep
	throw new Error('Function not implemented');
}
