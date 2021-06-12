import { DOMNode, text, elem, AttrMap } from './dom';

class Parser {
    pos: number = -1;
    input: string = ""; 

    constructor(source: string) {
        this.input = source;
    }

    public next_char(): string {
        return this.input[this.pos + 1];
    }

    public start_with(s: string): boolean {
        return this.input.substr(this.pos + 1).startsWith(s);
    }

    public eof(): boolean {
        return this.pos === this.input.length - 1;
    }

    public consume_char(): string {
        return this.input[++this.pos];
    }

    public consume_while(test: Function): string {
        let result: string = '';
        while (!this.eof() && test(this.next_char()))
            result += this.consume_char();
        return result;
    }

    private consume_whitespace() {
        this.consume_while(isWhiteSpace);
    }

    public parse_tag_name(): string {
        return this.consume_while((char: string) => (/[a-zA-Z0-9]/.test(char)));
    }

    private parse_node(): DOMNode {
        let nextChar: string = this.next_char();
        if (nextChar === '<') {
            return this.parse_element();
        } else {
            return this.parse_text();
        }
    }

    public parse_nodes(): Array<DOMNode>{
        let nodes: Array<DOMNode> = [];
        while(true) {
            this.consume_whitespace();
            if (this.eof() || this.start_with('</')) break;
            nodes.push(this.parse_node());
        }
        return nodes;
    }

    private parse_text(): DOMNode {
        return text(this.consume_while((c: string) => c !== '<'));
    }

    private parse_attr(): { name: string, value: string } {
        let name = this.parse_tag_name();
        assertIfNot(this.consume_char() === '=');
        let value = this.parse_attr_value();
        return {
            name,
            value,
        }
    }

    private parse_attr_value(): string {
        let open_quote = this.consume_char();
        assertIfNot(open_quote === '"' || open_quote === "'");
        let value = this.consume_while((c: string) => c !== open_quote);
        assertIfNot(this.consume_char() === open_quote);
        return value;
    }

    private parse_attributes(): AttrMap {
        let attributes = new Map<string, string>();
        while(true) {
            this.consume_whitespace();
            if (this.next_char() === '>') break;
            let { name, value } = this.parse_attr();
            if (name !== undefined && value !== undefined) {
                attributes.set(name, value);
            }
        }
        return attributes;
    }

    private parse_element(): DOMNode {
        // opening tags
        assertIfNot(this.consume_char() === '<');
        let tag_name = this.parse_tag_name();
        let attrs = this.parse_attributes();
        assertIfNot(this.consume_char() === '>');

        // contents
        let children = this.parse_nodes();

        // closing tag
        assertIfNot(this.consume_char() === '<');
        assertIfNot(this.consume_char() === '/');
        assertIfNot(this.parse_tag_name() === tag_name);
        assertIfNot(this.consume_char() === '>');

        return elem(tag_name, attrs, children);
    }
}

function isWhiteSpace(char: string) {
    return /\s/.test(char);
}

function assertIfNot(condition: boolean) {
    if (condition === false) {
        throw new Error("assert error!!!");
    }
}

export function parse(source: string): DOMNode {
    let nodes = new Parser(source).parse_nodes();
    if (nodes.length === 1) {
        return nodes[0];
    } else {
        return elem("html", new Map<string, string>(), nodes);
    }
}
