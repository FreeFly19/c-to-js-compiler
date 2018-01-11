import * as fs from 'fs';
import * as ts from 'typescript';
import {Runtime} from "inspector";


interface Token {
    value: string;
}

class NumberLiteral implements Token {
    public constructor(public value: string) {
    }
}
class StringLiteral implements Token {
    public constructor(public value: string) {
    }
}
class OpenBanana implements Token {
    public constructor(public value: string) {
    }
    static instance = new OpenBanana('(');
}
class ClosedBanana implements Token {
    public constructor(public value: string) {
    }
    static instance = new ClosedBanana(')');
}
class OpenCurlyBracket implements Token {
    public constructor(public value: string) {
    }
    static instance = new OpenCurlyBracket('{');
}
class ClosedCurlyBracket implements Token {
    public constructor(public value: string) {
    }
    static instance = new ClosedCurlyBracket('}');
}
class OpenRectBracket implements Token {
    public constructor(public value: string) {
    }
    static instance = new OpenRectBracket('[');
}
class ClosedRectBracket implements Token {
    public constructor(public value: string) {
    }
    static instance = new ClosedRectBracket(']');
}
class LeftAngleBracket implements Token {
    public constructor(public value: string) {
    }
    static instance = new LeftAngleBracket('<');
}
class RightAngleBracket implements Token {
    public constructor(public value: string) {
    }
    static instance = new RightAngleBracket('>');
}
class PlusToken implements Token {
    public constructor(public value: string) {
    }
    static instance = new PlusToken('+');
}
class MinusToken implements Token {
    public constructor(public value: string) {
    }
    static instance = new MinusToken('-');
}
class AsteriskToken implements Token {
    public constructor(public value: string) {
    }
    static instance = new AsteriskToken('*');
}
class QuestionMarkToken implements Token {
    public constructor(public value: string) {
    }
    static instance = new QuestionMarkToken('?');
}
class ExclamationMarkToken implements Token {
    public constructor(public value: string) {
    }
    static instance = new ExclamationMarkToken('!');
}
class EqualsToken implements Token {
    public constructor(public value: string) {
    }
    static instance = new EqualsToken('=');
}
class CommaToken implements Token {
    public constructor(public value: string) {
    }
    static instance = new CommaToken(',');
}
class Whitespace implements Token {
    public constructor(public value: string) {
    }
    static instance = new Whitespace(' ');
}
class Semicolon implements Token {
    public constructor(public value: string) {
    }
    static instance = new Semicolon(';');
}
class SlashToken implements Token {
    public constructor(public value: string) {
    }
    static instance = new SlashToken('/');
}
class AmpersandToken implements Token {
    public constructor(public value: string) {
    }
    static instance = new AmpersandToken('&');
}
class DotToken implements Token {
    public constructor(public value: string) {
    }
    static instance = new DotToken('.');
}
class PipeToken implements Token {
    public constructor(public value: string) {
    }
    static instance = new PipeToken('|');
}
class Identifier implements Token {
    public constructor(public value: string) {
    }
}
class InlineComment implements Token {
    public constructor(public value: string) {
    }
}



function getTokens(code: String) {
    const tokens = [];

    let i = -1;
    while(++i < code.length) {
        const c = code[i];

        if (c == '"') {
            let literal = '';
            while(true) {
                if (code[++i] == '"' && code[i - 1] != '\\') break;
                if (i >= code.length) {
                    throw new Error("String literal is not closing: \"" + literal);
                }

                literal += code[i];
            }
            tokens.push(new StringLiteral('"'+ literal + '"'));
            // --i;
            continue;
        }

        if(c == '!'){
            tokens.push(ExclamationMarkToken.instance);
            continue;
        }

        if(c == '?'){
            tokens.push(QuestionMarkToken.instance);
            continue;
        }

        if(c == '*'){
            tokens.push(AsteriskToken.instance);
            continue;
        }

        if(c == '('){
            tokens.push(OpenBanana.instance);
            continue;
        }

        if(c == ')'){
            tokens.push(ClosedBanana.instance);
            continue;
        }

        if(c == '{'){
            tokens.push(OpenCurlyBracket.instance);
            continue;
        }

        if(c == '}'){
            tokens.push(ClosedCurlyBracket.instance);
            continue;
        }

        if(c == '['){
            tokens.push(OpenRectBracket.instance);
            continue;
        }

        if(c == ']'){
            tokens.push(ClosedRectBracket.instance);
            continue;
        }

        if(c == '<'){
            tokens.push(LeftAngleBracket.instance);
            continue;
        }

        if(c == '>'){
            tokens.push(RightAngleBracket.instance);
            continue;
        }

        if(c == '&'){
            tokens.push(AmpersandToken.instance);
            continue;
        }

        if(c == '+'){
            tokens.push(PlusToken.instance);
            continue;
        }

        if(c == '-'){
            tokens.push(MinusToken.instance);
            continue;
        }

        if(c == '.'){
            tokens.push(DotToken.instance);
            continue;
        }

        if(c == ','){
            tokens.push(CommaToken.instance);
            continue;
        }

        if(c == '/'){
            if (code[i + 1] == '/') {
                const start = i;
                while(code[++i] && code[i] !== '\n');
                tokens.push(new InlineComment(code.substring(start, i) + "\n"));
                if (i + 1 !== code.length) --i;
                continue;
            }
            tokens.push(SlashToken.instance);
            continue;
        }

        if(c == '='){
            tokens.push(EqualsToken.instance);
            continue;
        }

        if(c == ';'){
            tokens.push(Semicolon.instance);
            continue;
        }

        if(c == '|'){
            tokens.push(PipeToken.instance);
            continue;
        }

        if(c.match(/\s/)) {
            while(code[++i] && code[i].match(/\s/));
            tokens.push(Whitespace.instance);
            if (i !== code.length) --i;
            continue;
        }

        if (!isNaN(parseInt(c))) {
            const start = i;
            while(!isNaN(parseInt(code[++i])));
            tokens.push(new NumberLiteral(code.substring(start, i)));
            --i;
            continue;
        }

        if(c.match("[a-zA-Z]")) {
            const start = i;
            while(code[++i] && code[i].match("[a-zA-Z0-9\_]"));
            tokens.push(new Identifier(code.substring(start, i)));
            if (i !== code.length ) --i;
            continue;
        }


        throw new Error("Dunno: \"" + c + "\"");
    }


    return tokens;
}









function extracted(data: String) {
    const pureTokens = getTokens(data).filter(t => !(t instanceof InlineComment) && !(t instanceof Whitespace));


    console.log(parseBlock(pureTokens));

    function parseBlock(tokens: Token[]) {
        const tokenStack = [];

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token instanceof Identifier) {
                if (token.value == "if") {
                    if (!(tokens[++i] instanceof OpenBanana)) {
                        console.error("Invalid if statement: " + tokens.slice(i, i + 10).map(t => t.value).join(' '));
                        process.exit(0);
                    }

                    let condition = findPair(tokens, i, OpenBanana.instance, ClosedBanana.instance);
                    i += condition.length;
                    console.log("if condition: ");
                    console.log(condition.map(t => t.value).join(' '));

                    const localStack = [];
                    while (!(tokens[++i] instanceof Semicolon)) {
                        localStack.push(tokens[i]);
                    }
                }
            }

            if (token instanceof OpenCurlyBracket) {
                const localStack = [];
                let openCurlyBracketCounter = 0;

                while(true) {
                    i++;
                    if (tokens[i] instanceof ClosedCurlyBracket && openCurlyBracketCounter === 0) break;
                    if (tokens[i] instanceof OpenCurlyBracket) openCurlyBracketCounter++;
                    if (tokens[i] instanceof ClosedCurlyBracket) openCurlyBracketCounter--;
                    localStack.push(tokens[i]);
                }

                parseBlock(localStack);
                continue;
            }

            if (token instanceof Identifier) {
                tokenStack.push(token);
                continue;
            }

            tokenStack.push(token);
        }

        return [];
    }

}


// console.log('RES: ',findPair(getTokens("1([2())(asd()d)fds])"), 1, OpenBanana.instance, ClosedBanana.instance));

function findPair(tokens: Token[], curPos: number, open: Token, close: Token): Token[] {
    let counter = 0;

    const res = [];

    while(true) {
        curPos++;
        if (curPos > tokens.length) throw Error(`There is no closing token pair: "${close.value}"`);
        if (tokens[curPos] == close && counter === 0) break;
        if (tokens [curPos] == open) counter++;
        if (tokens[curPos] == close) counter--;
        res.push(tokens[curPos]);
    }

    return res;
}


console.log('Compiling: "' + process.argv[2] + '" file...');
fs.readFile(process.argv[2], 'utf-8', (err, data: String) => extracted(data));
