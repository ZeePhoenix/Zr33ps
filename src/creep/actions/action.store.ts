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

