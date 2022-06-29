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

// Closure를 이용한 접근 권한 제어(정보 은닉)
// 1. 함수에서 지역변수 및 내부함수 등을 생성
// 2. 외부에 접근권한을 주고자 하는 대상들로 구성된 참조형 데이터
//    (대상이 여럿일 때는 객체 또는 배열, 하나일 때는 함수)를 return
// -> return한 변수들은 공개 멤버가 되고, 그렇지 않은 변수들은 비공개 멤버가 됨.
var createCar = function () {
    var fuel = Math.ceil(Math.random() * 10 + 10);   // 연료(L)
    var power = Math.ceil(Math.random() * 3 + 2);    // 연비(km/L)
    var moved = 0;                                   // 총 이동거리
    var publicMembers = {
        get moved() {
            return moved;
        },
        run: function () {
            var km = Math.ceil(Math.random() * 6);
            var wasteFuel = km / power;
            if (fuel < wasteFuel) {
                console.log('이동불가');
                return;
            }
            fuel -= wasteFuel;
            moved += km;
            console.log(km + 'km 이동 (총 ' + moved + 'km). 남은 연료: ' + fuel);
        },
    };
    Object.freeze(publicMembers);
    return publicMembers;
};
var car = createCar();

car.run();              // 정상
console.log(car.moved); //

// Closure를 이용한 부분 적용 함수
// 미리 일부 인자를 넘겨두어 기억하게끔 하고 추후 필요한 시점에 기억했던 인자들까지
// 함께 실행하게 한다.
var partial = function () {
    var originalPartialArgs = arguments;
    var func = originalPartialArgs[0];
    if (typeof func !== 'function') {
        throw new Error('첫 번째 인자가 함수가 아닙니다.');
    }
    return function () {
        var partialArgs = Array.prototype.slice.call(originalPartialArgs, 1);
        var restArgs = Array.prototype.slice.call(arguments);
        for (let i = 0; i < partialArgs.length; i++) {
            if (partialArgs[i] === Symbol.for('EMPTY_SPACE')) {
                partialArgs[i] = restArgs.shift();
            }
        }
        return func.apply(this, partialArgs.concat(restArgs));
    };
};

var add = function () {
    var result = 0;
    for (let i = 0; i < arguments.length; i++) {
        result += arguments[i];
    }
    return result;
};
var _ = Symbol.for('EMPTY_SPACE');
var addPartial = partial(add, 1, 2, _, 4, 5, _, _, 8, 9);
console.log(addPartial(3, 6, 7, 10));

var dog = {
    name: '강아지',
    greet: partial(function (prefix, suffix) {
        return prefix + this.name + suffix;
    }, '왈왈, ')
};
console.log(dog.greet(' 배고파요!'));

// Closure를 이용한 부분 적용 함수2 디바운스.
// 짧은 시간 동안 동일한 이벤트가 많이 발생할 경우 이를 전부 처리하지 않고
// 처음 또는 마지막에 발생한 이벤트에 대해 한 번만 처리하는 것.
// 프런트엔드 성능 최적화에 큰 도움을 주는 기능 중 하나.
// scroll, wheel, mousemove, resize 등에 적용하기 좋음.
// 클로저로 처리되는 변수 : eventName, func, wait, timeoutId
var debounce = function (eventName, func, wait) {
    var timeoutId = null;
    return function (event) {
        var self = this;
        console.log(eventName, 'event 발생');
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func.bind(self, event), wait);
    };
};

var moveHandler = function (e) {
    console.log('move event 처리');
};
var wheelHandler = function (e) {
    console.log('wheel event 처리');
};
document.body.addEventListener('mousemove', debounce('move', moveHandler, 500));
document.body.addEventListener('wheel', debounce('wheel', wheelHandler, 700));

// 클로저를 사용한 커링 함수
// 여러 개의 인자를 받는 함수를 하나의 인자만 받는 함수로 나눠서 순차적으로 호출될 수 있게
// 체인 형태로 구성한 것
// 한 번에 하나의 인자만 전달
// 중간 과정상의 함수를 실행한 결과는 그다음 인자를 받기 위해 대기할 뿐,
// 마지막 인자가 전달되기 전까지는 원본 함수가 실행되지 않는다.
// 부분 적용 함수는 여러 개의 인자를 전달할 수 있고, 실행 결과를 재실행할 때 원본 함수가 무조건 실행
//
// 당장 필요한 정보만 받아서 전달하고.... 마지막 인자가 넘어갈 때까지 함수 실행을 미루는 셈
// 함수형 프로그래밍의 지연실행(lazy execution)
/*
    // ES5
    var getInformation = function (baseUrl) {            // 서버에 요청할 주소의 기본 URL
        return function (path) {                            // path 값
            return function (id) {                          // id 값
                return fetch(baseUrl + path + '/' + id);    // 실제 서버에 정보를 요청
            };
        };
    };
*/

// ES6
var getInformation = baseUrl => path => id => fetch(baseUrl + path + '/' + id);

var imageUrl = 'https://imageAddress.com/';
var productUrl = 'https://productAddress.com/';

// 이미지 타입별 요청 함수 준비
var getImage = getInformation(imageUrl);         // https://imageAddress.com/
var getEmoticon = getImage('emoticon');     // https://imageAddress.com/emoticon
var getIcon = getImage('icon');             // https://imageAddress.com/icon

// 제품 타입별 요청 함수 준비
var getProduct = getInformation(productUrl);
var getFruit = getProduct('fruit');
var getVegetable = getProduct('vegetable');

// 실제 요청
var emoticon1 = getEmoticon(100);           // https://imageAddress.com/emoticon/100
var emoticon2 = getEmoticon(102);
var icon1 = getIcon(205);                   // https://imageAddress.com/icon/205
var icon2 = getIcon(234);
var fruit1 = getFruit(300);                 // https://prodictAddress.com/fruit/300
var fruit2 = getFruit(400);
var vegetable1 = getVegetable(456);         // https://productAddress.com/vegetable/456
var vegetable2 = getVegetable(789);
