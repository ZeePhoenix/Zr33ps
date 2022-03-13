
export function updateRoomHistory(room:Room){
	if (room.controller === undefined) {
		throw new Error ('${room.name} has no controller');
	}
	room.memory.history.push({
		time: Game.time,
		realTime: `${new Date().toLocaleTimeString()}`,
		controllerLevel: room.controller.level,
		controllerProgress: room.controller.progress,
		controllerProgressTotal: room.controller.progressTotal,
	});
}
