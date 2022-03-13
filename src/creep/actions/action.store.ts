export function storeNearby(creep:Creep, loc:Structure){
	creep.transfer(loc, RESOURCE_ENERGY);
}

export function store(creep:Creep){
	let spawn = creep.room.find(FIND_MY_SPAWNS)[0];

	if (spawn){
		let range = creep.pos.getRangeTo(spawn.pos);
		if (range < 2){
			creep.transfer(spawn, RESOURCE_ENERGY);
		} else {
			creep.moveTo(spawn);
		}
	} else {
		throw new Error(`No spawn for ${creep.name}`);

	}

}

export function storeAtPos(creep:Creep, loc:Structure){
	let range = creep.pos.getRangeTo(loc);
	if (range < 2){
		creep.transfer(loc, RESOURCE_ENERGY);
	} else {
		creep.moveTo(loc);
	}
}


export function getUnfilledExtension(creep:Creep): StructureExtension | null{
	let room = creep.memory.baseRoom;
	//@ts-ignore
	const extensions:StructureExtension[] = Game.rooms[room]
		.find(FIND_STRUCTURES).filter(r => r.structureType === STRUCTURE_EXTENSION &&
			r.store.getFreeCapacity(RESOURCE_ENERGY) != 0);
	if (extensions.length > 1){
		const extension = extensions.sort((a,b) => {
			let energyA = a.store.getFreeCapacity(RESOURCE_ENERGY);
			let energyB = b.store.getFreeCapacity(RESOURCE_ENERGY);
			return energyA - energyB;
		})[0];
		return extension;
	} else if (extensions.length === 1){
		return extensions[0];
	} else {
		return null;
	}
}
