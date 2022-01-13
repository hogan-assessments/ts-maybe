/**
 * A Union type representing a value that may exist. If the value exists, the Maybe 'kind' will be 'Some' and will contain the
 * present value; otherwise the Maybe 'kind' will be 'None'.
 * 
 * Example:
 * ```typescript
 * const maybeValue: Maybe<string> = Maybe.ofVal("abc");
 * 
 * switch(maybeValue.kind) {
 *  case 'None': 
 *      console.log("We have no value!");
 *      break;
 *  case 'Some':
 *      console.log(`We have a value and it is ${maybeValue.value}!`);
 *      break;  
 * }
 * ```
 */
export type Maybe<T> =
    | { kind: 'None' }
    | { kind: 'Some', value: T };

/**
* 'Some' constructor for a {@link Maybe}.
* 
* @param val The value to wrapping in a {@link Maybe}.
* @returns A {@link Maybe} set to 'Some'
*/
export function Some<T>(val: T): Maybe<T> {
    return { kind: 'Some', value: val };
}

/**
* 'None' constructor for a {@link Maybe}.
* 
* @returns A {@link Maybe} set to 'None'
*/
export function None<T>(): Maybe<T> {
    return { kind: 'None' };
}

/**
 * Wraps a value in a {@link Maybe}.
 * 
 * @param val The value to wrap in a {@link Maybe}
 * @param useTruthyCheck If true it will use the traditional truthy check 
 * to evaluate if a value is present; otherwise it will check against only 
 * 'null' or 'undefined'. (default: false)
 * @returns The wrapping {@link Maybe}
 */
export function ofVal<T>(val: T, useTruthyCheck: boolean = false): Maybe<T> {
    const check: (value: T) => boolean = useTruthyCheck
        ? value => !!value
        : value => value != null && value != undefined;

    return check(val) ? Some(val) : None<T>();
}

/**
 * Functionally similar to {@link ofVal} but handles the case when the 
 * type of val is set to a Union of type and null (i.e. Nullable type)
 * 
 * @param val The value to wrap in a {@link Maybe}
 * @returns The wrapping {@link Maybe}
 */
export function ofNullable<T>(val: T | null): Maybe<T> {
    return val == null
        ? None<T>()
        : ofVal(val);
}

/**
 * Functionally similar to {@link ofVal} but handles the case when the 
 * type of val is set to a Union of type and undefined
 * 
 * @param val The value to wrap in a {@link Maybe}
 * @returns The wrapping {@link Maybe}
 */
export function ofUndefinable<T>(val: T | undefined): Maybe<T> {
    return val == undefined
        ? None<T>()
        : ofVal(val);
}

/**
 * Unpacks a {@link Maybe} into an explicitly typed nullable object.
 * 
 * @param maybe The {@link Maybe} to unpack
 * @returns The result of the {@link Maybe} typed to a nullable object
 */
export function toNullable<T>(maybe: Maybe<T>): T | null {
    switch (maybe.kind) {
        case 'None':
            return null;
        case 'Some':
            return maybe.value;
    }
}

/**
 * Checks the {@link Maybe} to see if it contains a value.
 * 
 * @param maybe The {@link Maybe} to test
 * @returns 'true' if the {@link Maybe} is 'Some'; otherwise 'false'
 */
export function isSome<T>(maybe: Maybe<T>): boolean {
    return maybe.kind == 'Some';
}

/**
 * Checks the {@link Maybe} to see if it is empty.
 * 
 * @param maybe The {@link Maybe} to test
 * @returns 'true' if the {@link Maybe} is 'None'; otherwise 'false'
 */
export function isNone<T>(maybe: Maybe<T>): boolean {
    return maybe.kind == 'None';
}

/**
 * WARNING: This function may throw an error! 
 *   
 * It forces the {@link Maybe} to produce a value and throws an error 
 * if it cannot. This should only be used when you are 
 * certain the {@link Maybe} has a value. 
 *
 * Example using rxjs Observable:
 * ```typescript
 * const maybe: Maybe<string> = Maybe.ofVal("abc");
 *
 * of(maybe).pipe(
 *     filter(Maybe.isSome),
 *     map(Maybe.get)
 * );
 * ``` 
 *   
 * @param maybe The {@link Maybe} to unwrap
 * @returns The value extracted from 'maybe'
 */
export function get<T>(maybe: Maybe<T>): T {
    switch (maybe.kind) {
        case 'None':
            throw new Error("Expected 'Some' but was given 'None'");
        case 'Some':
            return maybe.value;
    }
}

/**
 * Maps a {@link Maybe} of the input type to a {@link Maybe} of the output type. Consider using {@link bind} if the 
 * 'mapper' parameter may fail to yield a value.
 * 
 * @param mapper A mapping function to transform the input value to the output type. This is only 
 * called if the parameter 'maybe' is 'Some'.
 * @param maybe The {@link Maybe} to transform
 * @returns A {@link Maybe} with the transformed output value if the parameter 'maybe' is 'Some'; otherwise 'None'
 */
export function map<IN, OUT>(mapper: (val: IN) => OUT, maybe: Maybe<IN>): Maybe<OUT> {
    switch (maybe.kind) {
        case 'None':
            return None<OUT>();
        case 'Some':
            return Some<OUT>(mapper(maybe.value));
    }
}

/**
 * Maps the parameters 'maybe1' and 'maybe2' to one {@link Maybe} of the output type.
 * 
 * @param mapper A mapping function to transform the input value to the output type. This is only 
 * called if the parameters 'maybe1' and 'maybe2' are 'Some'.
 * @param maybe1 The first {@link Maybe} to transform
 * @param maybe2 The second {@link Maybe} to transform
 * @returns A {@link Maybe} containing the result of 'mapper' if both 'maybe1' and 'maybe2' are 'Some'; otherwise 'None'
 */
export function map2<IN1, IN2, OUT>(mapper: (val1: IN1, val2: IN2) => OUT, maybe1: Maybe<IN1>, maybe2: Maybe<IN2>): Maybe<OUT> {
    return map(
        values => mapper(values.value1, values.value2),
        bind(
            value1 => map(value2 => ({ value1: value1, value2: value2 }), maybe2),
            maybe1
        )
    );
}

/**
 * Maps the parameters 'maybe1', 'maybe2', and 'maybe3' to one {@link Maybe} of the output type using the 'mapper'. 
 * 
 * @param mapper A mapping function to transform the input value to the output type, This is only 
 * called if 'maybe1', 'maybe2', and 'maybe3' are 'Some'.
 * @param maybe1 The first {@link Maybe} to transform
 * @param maybe2 The second {@link Maybe} to transform
 * @param maybe3 The third {@link Maybe} to transform
 * @returns A {@link Maybe} containing the result of 'mapper' if 'maybe1', 'maybe2', and 'maybe3' are 'Some'; otherwise 'None'
 */
export function map3<IN1, IN2, IN3, OUT>(mapper: (val1: IN1, val2: IN2, val3: IN3) => OUT, maybe1: Maybe<IN1>, maybe2: Maybe<IN2>, maybe3: Maybe<IN3>): Maybe<OUT> {
    return map(
        values => mapper(values.value1, values.value2, values.value3),
        bind2(
            (value1, value2) => map(value3 => ({ value1: value1, value2: value2, value3: value3 }), maybe3),
            maybe1,
            maybe2
        )
    );
}

/**
 * Binds the parameter 'maybe' to a new {@link Maybe} of the output type using 'binder'.
 * 
 * @param binder Function whose transform operation may not result in a value. This is only called if 'maybe'
 * is 'Some'.
 * @param maybe The input {@link Maybe}
 * @returns A {@link Maybe} with the transformed output. This can be 'None' if either 'maybe' or the 
 * result of 'binder' was 'None'.
 */
export function bind<IN, OUT>(binder: (val: IN) => Maybe<OUT>, maybe: Maybe<IN>): Maybe<OUT> {
    switch (maybe.kind) {
        case 'None':
            return None<OUT>();
        case 'Some':
            return binder(maybe.value);
    }
}

/**
 * Binds the parameters 'maybe1' and 'maybe2' to an output Maybe using 'binder'.  
 * 
 * @param binder Function whose transform operation may not result in a value. This is only called if 'maybe1'
 * and 'maybe2' are 'Some'.
 * @param maybe1 The first input {@link Maybe}
 * @param maybe2 The second input {@link Maybe}
 * @returns A {@link Maybe} with the transformed output. This can be 'None' if either 'maybe1', 'maybe2', or
 * the result of 'binder' yielded 'None'.
 */
export function bind2<IN1, IN2, OUT>(binder: (value1: IN1, value2: IN2) => Maybe<OUT>, maybe1: Maybe<IN1>, maybe2: Maybe<IN2>): Maybe<OUT> {
    return bind(
        values => binder(values.value1, values.value2),
        bind(
            value1 => map(value2 => ({ value1: value1, value2: value2 }), maybe2),
            maybe1
        )
    );
}

/**
 * Combines a list of {@link Maybe} into a single {@link Maybe} whose value is the concatenation
 * of all values from the parameter 'maybes'.
 * 
 * @param maybes List of {@link Maybe} to combine
 * @returns A {@link Maybe} whose value is a list of all values contained within 
 * 'maybes' or 'None' if any 'maybes' are 'None'.
 */
export function combine<T>(maybes: Array<Maybe<T>>): Maybe<Array<T>> {
    return maybes
        .reduce((acc, curr) =>
            bind(
                value => map(value2 => [...value, value2], curr),
                acc
            ),
            Some<Array<T>>([])
        );
}

/**
 * Executes the parameter 'action' with the value from 'maybe' if it is 'Some'.
 * 
 * @param action The action to execute with the {@link Maybe} value
 * @param maybe The {@link Maybe} to unwrap
 */
export function iter<T>(action: (val: T) => void, maybe: Maybe<T>): void {
    switch (maybe.kind) {
        case 'Some':
            action(maybe.value);
            break;
    }
}

/**
 * Attempts to unwrap the value from 'maybe'. Returns the provided default when 'maybe' is 'None'.
 * 
 * @param def The default value
 * @param maybe The {@link Maybe} to unwrap
 * @returns The value from 'maybe' or 'def' if 'maybe' is 'None'
 */
export function withDefault<T>(def: T, maybe: Maybe<T>): T {
    switch(maybe.kind) {
        case 'Some':
            return maybe.value;
        case 'None':
            return def;
    }
}

/**
 * Api for interacting with {@link Maybe}
 */
export const Maybe = {
    ofVal: ofVal,
    ofNullable: ofNullable,
    ofUndefinable: ofUndefinable,
    toNullable: toNullable,
    isSome: isSome,
    isNone: isNone,
    get: get,
    map: map,
    map2: map2,
    map3: map3,
    bind: bind,
    bind2: bind2,
    combine: combine,
    iter: iter,
    withDefault: withDefault
};