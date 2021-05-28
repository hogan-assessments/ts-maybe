import { Maybe, None, Some } from "../src/index";

describe("Maybe", () => {
    describe("ofVal", () => {
        it("should return 'None' when the value is null", () => {
            expect(Maybe.ofVal<string>(null).kind).toBe('None');
        })

        it("should return 'None' when the value is undefined", () => {
            expect(Maybe.ofVal<string>(undefined).kind).toBe('None')
        })

        it("should return 'None' when the value is falsy and useTruthyCheck is true", () => {
            expect(Maybe.ofVal(0, true).kind).toBe('None');
        })

        it("should return 'Some' with falsy value when useTruthyCheck is false", () => {
            expect(Maybe.ofVal(0)).toEqual({ kind: 'Some', value: 0 });
        })

        it("should return 'Some' with value when the value is present", () => {
            expect(Maybe.ofVal("abc")).toEqual({ kind: 'Some', value: "abc" });
        })

        it("should return 'Some' with value when the value is truthy and useTruthyCheck is true", () => {
            expect(Maybe.ofVal("I'm truthy", true)).toEqual({ kind: 'Some', value: "I'm truthy" });
        })
    })

    describe("ofNullable", () => {
        it("should return 'None' when value of union type is set to null", () => {
            const val: string | null = null;
            expect(Maybe.ofNullable(val).kind).toBe('None');
        })

        it("should return 'None' when the value of union type is undefined", () => {
            const val: string | null = undefined;
            expect(Maybe.ofNullable(val).kind).toBe('None');
        })

        it("should return 'Some' with value when the value of union type is set to value type", () => {
            const val: string | null = "foo";
            expect(Maybe.ofNullable(val)).toEqual({ kind: 'Some', value: "foo" });
        })
    })

    describe("ofUndefinable", () => {
        it("should return 'None' when value of union type is set to undefined", () => {
            const val: string | undefined = undefined;
            expect(Maybe.ofUndefinable(val).kind).toBe('None');
        })

        it("should return 'None' when value of union type is set to null", () => {
            const val: string | undefined = null;
            expect(Maybe.ofUndefinable(val).kind).toBe('None');
        })

        it("should return 'Some' with value when the value of union type is set to value type", () => {
            const val: string | undefined = "foo";
            expect(Maybe.ofUndefinable(val)).toEqual({ kind: 'Some', value: "foo" });
        })
    })

    describe("toNullable", () => {
        it("should return null when the input Maybe is 'None'", () => {
            expect(Maybe.toNullable(None<string>())).toBeNull();
        })

        it("should return wrapped value when the input Maybe is 'Some'", () => {
            expect(Maybe.toNullable(Some<string>("foo"))).toBe("foo");
        })
    })

    describe("isSome", () => {
        it("should return true when the input Maybe is 'Some'", () => {
            expect(Maybe.isSome(Some<string>("foo"))).toBeTrue();
        })

        it("should return false when the input Maybe is 'None'", () => {
            expect(Maybe.isSome(None<string>())).toBeFalse();
        })
    })

    describe("isNone", () => {
        it("should return true when the input Maybe is 'None'", () => {
            expect(Maybe.isNone(None<string>())).toBeTrue();
        })

        it("should return false when the input Maybe is 'Some'", () => {
            expect(Maybe.isNone(Some<string>("foo"))).toBeFalse();
        })
    })

    describe("get", () => {
        it("should return wrapped value when the input Maybe is 'Some'", () => {
            expect(Maybe.get(Some<string>("foo"))).toBe("foo");
        })

        it("should throw an error when the input Maybe is 'None'", () => {
            expect(() => Maybe.get(None<string>())).toThrowError();
        });
    })

    describe("map", () => {
        it("should return 'None' when the input Maybe is 'None'", () => {
            expect(Maybe.map(value => value, None<string>()).kind).toBe('None');
        })

        it("should return 'Some' with transformed value when the input Maybe is 'Some'", () => {
            expect(Maybe.map(value => "transformed", Some<string>("input"))).toEqual({ kind: 'Some', value: "transformed" });
        })
    })

    describe("map2", () => {
        it("should return 'None' when the first input Maybe is 'None'", () => {
            expect(Maybe.map2((v1, v2) => "bar", None<string>(), Some<string>("foo")).kind).toBe('None');
        })

        it("should return 'None' when the second input Maybe is 'None'", () => {
            expect(Maybe.map2((v1, v2) => "bar", Some<string>("foo"), None<string>()).kind).toBe('None');
        })

        it("should return 'Some' with transformed value when both input Maybes are 'Some'", () => {
            expect(Maybe.map2((v1, v2) => `${v1}-${v2}`, Some<string>("foo"), Some<string>("bar"))).toEqual({ kind: 'Some', value: 'foo-bar' });
        })
    })

    describe("map3", () => {
        it("should return 'None' when the first input Maybe is 'None'", () => {
            expect(Maybe.map3((v1, v2, v3) => "abc", None<string>(), Some<string>("foo"), Some<string>("bar")).kind).toBe('None');
        })

        it("should return 'None' when the second input Maybe is 'None'", () => {
            expect(Maybe.map3((v1, v2, v3) => "abc", Some<string>("foo"), None<string>(), Some<string>("bar")).kind).toBe('None');
        })

        it("should return 'None' when the third input Maybe is 'None'", () => {
            expect(Maybe.map3((v1, v2, v3) => "abc", Some<string>("foo"), Some<string>("bar"), None<string>()).kind).toBe('None');
        })

        it("should return 'Some' with transformed value when all input Maybes are 'Some'", () => {
            expect(Maybe.map3((v1, v2, v3) => `${v1}${v2}${v3}`, Some<string>("foo"), Some<string>("bar"), Some<string>("baz"))).toEqual({ kind: 'Some', value: 'foobarbaz' });
        })
    })

    describe("bind", () => {
        it("should return 'None' when the input Maybe is 'None'", () => {
            expect(Maybe.bind(v1 => Some<string>("foo"), None<string>()).kind).toBe('None');
        })

        it("should return 'None' when the result from binder yields 'None'", () => {
            expect(Maybe.bind(v1 => None<string>(), Some<string>("foo")).kind).toBe('None');
        })

        it("should return 'Some' with value when the input Maybe is 'Some' and binder yields 'Some'", () => {
            expect(Maybe.bind(v1 => Some<string>(`${v1}bar`), Some<string>("foo"))).toEqual({ kind: "Some", value: "foobar" })
        })
    })

    describe("bind2", () => {
        it("should return 'None' when the first input Maybe is 'None'", () => {
            expect(Maybe.bind2((v1, v2) => Some<string>(`${v1}${v2}`), None<string>(), Some<string>("bar")).kind).toBe('None');
        })

        it("should return 'None' when the second input Maybe is 'None'", () => {
            expect(Maybe.bind2((v1, v2) => Some<string>(`${v1}${v2}`), Some<string>("foo"), None<string>()).kind).toBe('None');
        })

        it("should return 'None' when the binder yields 'None'", () => {
            expect(Maybe.bind2((v1, v2) => None<string>(), Some<string>("foo"), Some<string>("bar")).kind).toBe('None');
        })

        it("should return 'Some' with transformed value when both input Maybes and binder yield 'Some'", () => {
            expect(Maybe.bind2((v1, v2) => Some<string>(`${v1}${v2}`), Some<string>("foo"), Some<string>("bar"))).toEqual({ kind: 'Some', value: "foobar" });
        })
    })

    describe("combine", () => {
        it("should return 'None' when the first input Maybe is 'None'", () => {
            expect(Maybe.combine([None<string>(), Some<string>("foo"), Some<string>("bar")]).kind).toBe('None');
        })

        it("should return 'None' when the second input Maybe is 'None'", () => {
            expect(Maybe.combine([Some<string>("foo"), None<string>(), Some<string>("bar")]).kind).toBe('None');
        })

        it("should return 'None' when the last input Maybe is 'None'", () => {
            expect(Maybe.combine([Some<string>("foo"), Some<string>("bar"), None<string>()]).kind).toBe('None');
        })

        it("should return 'Some' with an array of all Maybe values when all input Maybes are 'Some'", () => {
            expect(Maybe.combine([Some<string>("foo"), Some<string>("bar"), Some<string>("baz")])).toEqual({ kind: 'Some', value: ["foo", "bar", "baz"] })
        })
    })

    describe("iter", () => {
        it("should not call action when the input Maybe is 'None'", () => {
            const spy = jasmine.createSpy('action');
            Maybe.iter(spy, None<string>());
            expect(spy).not.toHaveBeenCalled();
        })

        it("should call action when the input Maybe is 'Some'", () => {
            const spy = jasmine.createSpy('action');
            Maybe.iter(spy, Some<string>("foo"));
            expect(spy).toHaveBeenCalledWith("foo");
        })
    })
})