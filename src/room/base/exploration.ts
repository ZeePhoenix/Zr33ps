import { RoomBaseMemory } from "room/roles/role.Base"

export interface RoomExploration {
	rooms: RoomMeta[]
}

export interface RoomMeta {
	name: string;
	lastExplored: number;
	distanceFromHome: number;
	sources: IRoomPosition[];
	controller: IRoomPosition | null;
	ownership: RoomOwnership;
}

export type RoomOwnership =
	| { type: 'UNEXPLORED' }
	| { type: 'UNAVAILIBLE' }
	| { type: 'AVAILIBLE' }
	| { type: 'RESERVED', player:string }
	| { type: 'OWNED', player:string, rcl:number }

export interface IRoomPosition {
	roomName: string;
	x: number;
	y: number;
}

function createRoomOwnership(room:Room): RoomOwnership{
	if (room.controller){
		if (room.controller.owner){
			return { type: 'OWNED', player:room.controller.owner.username, rcl:room.controller.level };
		} else if (room.controller.reservation){
			return { type: 'RESERVED', player:room.controller.reservation.username };
		} else return { type: 'AVAILIBLE' };
	} else {
		return { type: 'UNAVAILIBLE' };
	}
}

function calculateDistanceFromHomeRoom(room:Room, baseRoom:Room):number{
	if (room === baseRoom){
		return 0;
	} else {
		const route = Game.map.findRoute(baseRoom, room);
		if (route === ERR_NO_PATH){
			throw new Error('Cannot find route to newly explored room ${room}')
		} else {
			return route.length;
		}
	}

}


export function createRoomMeta(room:Room, baseRoom:Room):RoomMeta{
	const controllerPosition =
	room.controller
	? room.controller.pos
	: null;
	const sourcePositoins =
	room.find(FIND_SOURCES)
	.map(source => source.pos)

	return {
		name: room.name,
		lastExplored: Game.time,
		distanceFromHome: calculateDistanceFromHomeRoom(room, baseRoom),
		sources: sourcePositoins,
		controller: controllerPosition,
		ownership: createRoomOwnership(room)
	};
}

export function getNextRoomToExplore(creep:Creep, baseRoom:Room):string|null{
	// TODO implementation
	return null;
}
