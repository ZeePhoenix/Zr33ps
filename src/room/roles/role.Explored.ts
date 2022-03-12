import { RoomRole } from "definitions"

export interface RoomExploredMemory{

}

const INITIAL_MEMORY: RoomExploredMemory = {

}

const roleExplored: RoomRole = {
	run: (room:Room) => {
		if (!room.memory.context){
			room.memory.context = INITIAL_MEMORY
		}
	}
}

export default roleExplored;
