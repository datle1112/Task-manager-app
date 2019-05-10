const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math');
test('Should calculcate total with tip', () => { // Setup new test. First argument is test's name, second one is function 
    const total = calculateTip(10, .3);
    expect(total).toBe(13);
});

test('Should calculate total with default tip', () => {
    const total = calculateTip(10);
    expect(total).toBe(12.5);
});

test('Should convert 32 F to 0 C', () => {
    const tempCel = fahrenheitToCelsius(32);
    expect(tempCel).toBe(0);
});

test('Should convert 0 C to 32 F', () => {
    const tempFah = celsiusToFahrenheit(0);
    expect(tempFah).toBe(32);
});

test('Async test demo', (done) => { 
    // Argument "done" is added to tell Jest we test asynchronous function. 
    // Jest need to wait for "done()" function is called before figuring out the test is success or fail
    setTimeout(() => {
        expect(1).toBe(1);
        done();
    },500);
});
// Using Promise 
test('Async add function', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5);
        done();
    })
})
// Using async-await 
test('Async await add function', async () => {
    const sum = await add(2, 3);
    expect(sum).toBe(6);
})