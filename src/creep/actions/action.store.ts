export function storeNearby(creep:Creep, loc:Structure){
	creep.transfer(loc, RESOURCE_ENERGY);
}

export function store(creep:Creep){
	// Get location to store
	// if close enough => storeNearby(creep, store)
	// else moveTo (store)
}

