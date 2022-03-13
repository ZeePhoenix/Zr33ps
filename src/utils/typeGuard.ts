export function isExtension(struct: Structure){
	return (struct.structureType === STRUCTURE_EXTENSION);
}

export function isBuffer(struct:StructureContainer){
	throw new Error('isBuffer is not implemented');
}
