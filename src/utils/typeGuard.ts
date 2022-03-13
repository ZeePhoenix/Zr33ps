export function isExtension(struct: Structure):boolean{
	return (struct.structureType === STRUCTURE_EXTENSION);
}

export function isBuffer(struct:StructureContainer):boolean{
	let sources = struct.room.find(FIND_SOURCES);
	for (let i = 0; i < sources.length; i++){
		let range = struct.pos.getRangeTo(sources[i])
		if (range == 2) { return true; }
	}
	return false;
}
