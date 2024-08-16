import { type Writable, writable } from "svelte/store";

/**
 * @description create and return a writable Svelte rune
 */
export const createSignal = <T>(val: T) => {
  let value = $state(val);
  return {
    get value(): T {
      return value;
    },
    set value(v: T) {
      value = v;
    },
  };
};

// export const createArraySignal = <Type>(): WritableArray<Type> => {
// 	const { subscribe, set, update } = writable<Type[]>([]);
//   return {
// 		subscribe,
// 		set,
// 		update,
// 		push: (el: Type): void => update(arr => {
// 			arr.push(el);
// 			return arr;
// 		}),
// 		pop: (): Type | undefined => {
// 			let result: Type | undefined;
// 			update(arr => { result = arr.pop(); return arr; });
// 			return result;
// 		},
// 	};
// };

/**
 * @description the type definition for the create function below
 */
export type WritableArray<Type> = Writable<Type[]> & {
  push: (el: Type) => void;
  pop: () => Type | undefined;
};

/**
 * @description this simply creates a writable<Type[]>() where the
 * type is an array type, with subscribe, set, and update, but also
 * with a "push" and "pop" method.
 */
export const createArrayStore = <Type>(): WritableArray<Type> => {
  const { subscribe, set, update } = writable<Type[]>([]);
  return {
    subscribe,
    set,
    update,
    push: (el: Type): void =>
      update((arr) => {
        arr.push(el);
        return arr;
      }),
    pop: (): Type | undefined => {
      let result: Type | undefined;
      update((arr) => {
        result = arr.pop();
        return arr;
      });
      return result;
    },
  };
};
