import { getRole } from "./roles";

export interface StateMachine<T> {
	initialContext: any
	states: State
}

export function runCreepStateMachine(creep:Creep, machine:StateMachine<StateContext>, creepRole:string){
	// Store the previous state
	machine.initialContext.previousState = machine.initialContext.state;
	// run the state
	let result = machine.initialContext.state.tick(machine.initialContext);
	if (result !== null){
		// store the new state
		machine.initialContext.state = result;
	}
}

interface StateContext{
	state: string;
	previousState: string | null;
	[name:string]: any
}

export type State =
	| {'HARVESTING' : TICK}
	| {'STORING': TICK}
	| {'WAITING': TICK}
	| {'EXPLORING': TICK}

interface TICK {
	tick: (context: StateContext) => string | null
}
