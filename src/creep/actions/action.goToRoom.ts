import { debugCreep } from '../../utils/debugCreep';

interface goToRoomOptions {
	flatCosts? : boolean
}

export function isInRoom(creep: Creep, targetRoom: string): boolean{
	return (creep.room.name === targetRoom);
}

export function goToRoom(creep: Creep, targetRoom: string){
	const exit = creep.room.findExitTo(targetRoom);
	// @ts-ignore
	const found = creep.pos.findClosestByPath(exit);
	// @ts-ignore
	creep.moveTo(found);
}
