/**
 * 
 * @param {string} expr 
 */
export function parse(expr) {
    expr = expr.replace(/\s/g, '');
    let equalsSplit = expr.split("=");
    if(equalsSplit.length === 2) {
        let node = new EqualsNode();
        equalsSplit.forEach(e => node.children.push(parse(e)));
        return node;
    } else if(equalsSplit.length > 2) throw new Error("Illegal state: more than one equals sign.")

    let addPositions = getAddOperands(expr);
    let children = expr.split(/\s?[+-]{1}\s?/g);
    if(children.length != addPositions.length + 1) throw new Error("Illegal state: add operand count not valid with childcount");

    if(children.length === 1) {
        let multPositions = getMultOperands(expr);
        let multChildren = children[0].split(/\s?[*/]{1}\s?/g);
        if(multChildren.length != multPositions.length + 1) throw new Error("Illegal state: mult operand count not valid with childcount");

        if(multChildren.length === 1) return new ValueNode(children[0]);
        else {
            let rootNode = new MultiplicativeNode(parse(multChildren[0]));
            let node = rootNode;
            for(let i = 1; i < multChildren.length - 1; i++) {
                let childNode = new MultiplicativeNode(parse(multChildren[i]));
                if(i - 1 >= 0 && !multPositions[i - 1].mult) childNode.inverse();
                node.children.push(childNode);
                node = childNode;
            }
            let endNode = parse(multChildren[multChildren.length - 1]);
            if(!multPositions[multPositions.length - 1].mult) endNode.inverse();
            node.children.push(endNode);

            return rootNode;
        }
    }
    else {
        let node = new AdditiveNode();
        for(let i = 0; i < children.length; i++) {
            let childNode = parse(children[i]);
            if(i - 1 >= 0 && !addPositions[i - 1].plus) childNode.multiply(-1);
            node.children.push(childNode);
        }
        return node;
    }
}

/**
 * 
 * @param {string} expr 
 */
function getAddOperands(expr) {
    let positions = [];
    for(let i = 0; i < expr.length; i++) {
        let char = expr.charAt(i);
        if(char === "+" || char === "-") positions.push({ index: i, plus: char === "+" });
    }
    return positions;
}

/**
 * 
 * @param {string} expr 
 */
function getMultOperands(expr) {
    let positions = [];
    for(let i = 0; i < expr.length; i++) {
        let char = expr.charAt(i);
        if(char === "*" || char === "/") positions.push({ index: i, mult: char === "*" });
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
        this.children.forEach(x => value += x.calculate());
        return value;
    }
}

export class ValueNode extends Node {
    constructor(value) {
        super();
        this.value = Number(value);
    }

    calculate() {
        return this.value;
    }

    multiply(x) {
        this.value *= x;
    }

    inverse() {
        this.value = 1 / this.value;
    }
}

/*export class FunctionNode extends Node {
    constructor(transformer) {
        super();
        this.transformer = transformer;
    }

    calculate() {
        if(this.children.length != 1) throw new Error("Children count must be = 1");
        return this.transformer(this.children[0]);
    }

    multiply(x) {
        let newChild = new FunctionNode(this.transformer);
        newChild.children = this.children.map(x => x); // Clone the children array
        this.transformer = y => x * y.calculate();
        this.children.length = 0;
        this.children.push(newChild);
    }

    inverse() {
        let newChild = new FunctionNode(this.transformer);
        newChild.children = this.children.map(x => x); // Clone the children array
        this.transformer = x => 1 / x.calculate();
        this.children.length = 0;
        this.children.push(newChild);
        return newChild;
    }
}*/

export class MultiplicativeNode extends Node{
    constructor(factor) {
        super();
        this.factor = factor;
    }

    calculate() {
        if(this.children.length != 1) throw new Error("Children count must be = 1");
        return this.children[0].calculate() * this.factor.calculate();
    }

    multiply(x) {
        this.factor.multiply(x);
    }

    inverse() {
        this.factor.inverse();
    }
}