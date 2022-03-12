import { TaskRunner, TaskProgressContext, BuildingPlanType } from "../../../definitions";

type Offset = [number, number];

const REL_POSITION_STORAGE: Offset = [2,0];
const REL_POSITION_TOWER_1: Offset = [1,1];
const REL_POSITION_TOWER_2: Offset = [1,-1];
const REL_POSITION_ROADS: Offset[] =[
	// Clockwise from left
	[-1,0],
	[0,-1],
	[1,-2],
	[2,-1],
	[3,0],
	[2,1],
	[1,2],
	[0,1]
];

const planBase: TaskRunner = {
	delayCheck: false,

	init: (context: TaskProgressContext, room: Room) => {
		const spawns = room.find(FIND_MY_SPAWNS);
		if (!spawns.length){
			return;
		}
		const spawn = spawns[0];
		const storagePos = relativePosition(spawn.pos, REL_POSITION_STORAGE);
		placeBuildingPlanFlag(room, storagePos, 'STORAGE');
		const tower1Pos = relativePosition(spawn.pos, REL_POSITION_TOWER_1);
		placeBuildingPlanFlag(room, tower1Pos, 'TOWER')
		const tower2Pos = relativePosition(spawn.pos, REL_POSITION_TOWER_2);
		placeBuildingPlanFlag(room, tower2Pos, 'TOWER')
		for(let i=0; i<REL_POSITION_ROADS.length; ++i){
			const roadPos = relativePosition(spawn.pos, REL_POSITION_ROADS[i]);
			placeBuildingPlanFlag(room, roadPos, 'ROAD');
		}
	},
	check: (context: TaskProgressContext, room: Room) => { return true; }
};

export default planBase;

function relativePosition(pos: RoomPosition, offset: Offset){
	return new RoomPosition(pos.x + offset[0], pos.y + offset[1], pos.roomName);
}

function placeBuildingPlanFlag(room: Room, pos: RoomPosition, type: BuildingPlanType){
	switch (type){
		case 'STORAGE':
			room.createFlag(pos, 'StorageSite${Math.random()}', COLOR_BLUE);
		case 'TOWER':
			room.createFlag(pos, 'StorageSite${Math.random()}', COLOR_ORANGE);
		case 'ROAD':
			room.createFlag(pos, 'StorageSite${Math.random()}', COLOR_GREY);
	}
}
