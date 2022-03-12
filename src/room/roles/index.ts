import { RoomRole } from '../../definitions';
import { updateRoomHistory } from '../../utils/roomHistory';
import roleBase from './role.Base';
import roleExplored from './role.Explored';

const HISTORY_TICKS = 100;

interface RoleLookup {
	[roleName:string]: RoomRole;
}

const ROLES: RoleLookup = {
	'base' : roleBase,
	'explored': roleExplored
}

export function getRole(room:Room): RoomRole | null{
	return ROLES[room.memory.role] || null;
}

export function runRoomRole(room:Room){
	const role = getRole(room);
	if (role){
		role.run(room)
	} else {
		throw new Error('Role not defined for room ${room.name}')
	}

	if (Game.time % HISTORY_TICKS === 0){
		updateRoomHistory(room);
	}
}
