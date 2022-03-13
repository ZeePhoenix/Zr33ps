import { debugCreep } from '../../utils/debugCreep';

interface goToRoomOptions {
	flatCosts? : boolean
}

// TODO 1:18:40 starting on combat

export function isInRoom(creep: Creep, targetRoom: string): boolean{
	return (creep.room.name === targetRoom);
}
// goToRoom
export function goToRoom(creep: Creep, targetRoom: string){
	throw new Error('Function not implemented');
}

function isOnRoomBorder(creep: Creep){
	throw new Error('Function not implemented');
}
