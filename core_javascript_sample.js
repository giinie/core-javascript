/**
 * 기존 정보를 복사해서 새로운 객체를 반환하는 함수(얕은 복사, shallow copy)
 *
 * 아쉬운 점
 * 프로토타입 체이닝 상의 모든 프로퍼티를 복사,
 * getter/setter는 복사하지 않는 점,
 * 얕은 복사만 수행
 *
 * @param target
 * @returns {any}
 */
var copyObject = function (target) {
    var result = {};
    for (var prop in target) {
        result[prop] = target[prop];
    }
    return result;
};

/**
 * 객체의 깊은 복사(deep copy)를 수행하는 범용 함수
 *
 * 추가로 hasOwnProperty 메서드를 활용해 프로토타입 체이닝을 통해
 * 상속된 프로퍼티를 복사하지 않게끔 할 수도 있다.
 * ES5의 getter/setter를 복사하는 방법은
 * ES6 또는 ES2017의 Object.getOwnPropertyDescriptor 외에는 마땅한 방법이 없다.
 *
 * @param target
 * @returns {{}}
 */
var copyObjectDeep = function (target) {
    var result = {};
    if (typeof target === 'object' && target !== null) {
        for (var prop in target) {
            result[prop] = copyObjectDeep(target[prop]);
        }
    } else {
        result = target;
    }
    return result;
};

/**
 * JSON을 활용한 간단한 깊은 복사(deep copy)
 *
 * 메서드(함수)나 숨겨진 프로퍼티인 __Proto__, getter/setter 등과 같이
 * JSON으로 변경할 수 없는 프로퍼티들은 모두 무시한다.
 * httpRequest로 받은 데이터를 저장한 객체를 복사할 때 등
 * 순수한 정보만 다룰 때 활요하기 좋은 방법
 *
 * @param target
 * @returns {any}
 */
var copyObjectViaJSON = function (target) {
    return JSON.parse(JSON.stringify(target));
};

/**
 * 유사배열객체(array-like object)에 배열 메서드를 적용
 * call/apply 메서드의 활용
 *
 * 유사배열객체 :
 *  키가 0 또는 양의 정수인 프로퍼티가 존재하고
 *  length 프로퍼티 값이 0 또는 양의 정수인 객체
 *
 * @type {{"0": string, "1": string, "2": string, length: number}}
 */
var obj = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
};
Array.prototype.push.call(obj, 'd');
console.log(obj);   // {0:'a', 1:'b', 2:'c', 3:'d', length:4}

var arr = Array.prototype.slice.call(obj);
console.log(arr);   // ['a', 'b', 'c', 'd']

/**
 * ES6 Array.from 메소드
 */
var obj = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
};
var arr = Array.from(obj);
console.log(arr);   // ['a', 'b', 'c']

/**
 * 유사배열객체(array-like object, arguments, NodeList)에 배열 메서드를 적용
 */
function a() {
    var argv = Array.prototype.slice.call(arguments);
    argv.forEach(function (arg) {
        console.log(arg);
    });
}

a(1, 2, 3);

/**
 * ES6 Array.from 메소드
 */
var obj = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
};
var arr = Array.from(obj);
console.log(arr);

/**
 * ES6 spread operator(...)를 이용하여
 * 여러 인수를 묶어 하나의 배열로 전달하는 apply 활용 단순화 방식
 * apply(null, ) -> (...)
 * @type {number[]}
 */
var numbers = [10, 20, 3, 16, 45];
var max = numbers[0];
var min = max;

numbers.forEach(function (number) {
    if (number > max) {
        max = number;
    }
    if (number < min) {
        min = number;
    }
});

console.log(max, min);

max = Math.max.apply(null, numbers);
min = Math.min.apply(null, numbers);
console.log(max, min);

// ES6 펼치기 연산자(spread operator)
const max2 = Math.max(...numbers);
const min2 = Math.min(...numbers);
console.log(max2, min2);
