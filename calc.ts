function calc(input: string): string{
    const data: string[] = input.replaceAll('(', " ").replaceAll(')', " ").split(" ");
    const stack: number[] = [];
    for (let i = data.length - 1; i >= 0; i--) {
        const element = data[i];
        if (element == " " || element == '') {
            continue;
        }
        if (!isNaN(Number(element))) {
            stack.push(Number(element));
        } else {
            const firstNum = stack.pop();
            const secNum = stack.pop();

            if (firstNum === undefined || secNum === undefined) {
                return("Недостаточно операндов для операции");
            }

            switch (element) {
                case "+":
                    stack.push(firstNum + secNum);
                    break;
                case "-":
                    stack.push(firstNum - secNum);
                    break;
                case "*":
                    stack.push(firstNum * secNum);
                    break;
                case "/":
                    stack.push(firstNum / secNum);
                    break;
                default: {
                    return(`Неизвестный оператор: ${element}`);
                }
            }
        }
    }
    const result = stack.pop();
    if (result === undefined || stack.length > 0) {
        return("Некорректное выражение");
    }
    return String(result);
}

console.log(`Результат: ${calc("* - (33.5 -2 - 6 4")}`);        