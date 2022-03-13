import { getRole } from "./roles";

export interface StateMachine<T> {
	initialContext: any
	states: any
}

export function runCreepStateMachine(creep:Creep, machine:StateMachine<StateContext>, creepRole:string){
	if (!creep.memory.context){
		creep.memory.context = machine.initialContext();
	}
	let context = creep.memory.context;
	context.previousState = context.state;
	// run the current state
	let result = machine.states[context.state].tick(context);
	if (result !== null){
		context.state = result;
	}

}


interface StateContext{
	state: string;
	previousState: string | null;
	[name:string]: any
}

