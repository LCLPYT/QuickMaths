/**
 * 
 * @param {string} expr 
 */
export function parse(expr) {
    let equalsSplit = expr.split("=");
    if(equalsSplit.length === 2) {
        let node = new EqualsNode();
        equalsSplit.forEach(e => node.children.push(parse(e)));
        return node;
    } else if(equalsSplit.length > 2) throw new Error("Illegal state: more than one equals sign.")

    let operandPositions = getOperands(expr);
    let children = expr.split(/\s?[+-]{1}\s?/g);
    if(children.length != operandPositions.length + 1) throw new Error("Illegal state: operand count not valid with childcount");

    if(children.length === 1) return new NonAdditiveNode(children[0]);
    else {
        let node = new AdditiveNode();
        for(let i = 0; i < children.length; i++) {
            let elem = children[i];
            let childNode = parse(elem);
            if(i - 1 >= 0 && !operandPositions[i - 1].plus) childNode.multiply(-1);
            node.children.push(childNode);
        }
        return node;
    }
}

/**
 * 
 * @param {string} expr 
 */
function getOperands(expr) {
    let positions = [];
    for(let i = 0; i < expr.length; i++) {
        let char = expr.charAt(i);
        if(char === "+" || char === "-") positions.push({ index: i, plus: char === "+" });
    }
    return positions;
}

class Node {
    constructor() {
        this.children = [];
    }
}

export class EqualsNode extends Node {
    constructor() {
        super();
    }
}

export class AdditiveNode extends Node {
    constructor() {
        super();
    }

    calculate() {
        let value = 0;
        this.children.forEach(x => value += x.getValue());
        return value;
    }
}

export class NonAdditiveNode extends Node {
    constructor(value) {
        super();
        this.value = Number(value);
    }

    getValue() {
        return this.value;
    }

    multiply(x) {
        this.value *= x;
    }
}