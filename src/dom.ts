
export type AttrMap = Map<string, string>;

interface ElementData {
    tag_name: string;
    attributes: AttrMap;
}

class NodeType {
    type: number = -1;
    value: string | ElementData = "";

    static Text: number = 1;
    static Element: number = 2;

    constructor(id: number, value: any) {
        switch(id) {
            case NodeType.Text:
                this.createText(value);
                break;
            case NodeType.Element:
                this.createElement(value);
                break;
        }
    }

    createText(value: string) {
        this.type = NodeType.Text;
        this.value = value;
    }

    createElement(element: ElementData) {
        this.type = NodeType.Element;
        this.value = element;
    }
}

export interface DOMNode {
    children: Array<DOMNode>;
    node_type: NodeType;
}

export function text(data: string): DOMNode {
    return {
        children: [],
        node_type: new NodeType(NodeType.Text, data)
    }
}

export function elem(name: string, attrs: AttrMap, children: Array<DOMNode>): DOMNode {
    return {
        children,
        node_type: new NodeType(NodeType.Element, {
            tag_name: name,
            attributes: Object.fromEntries(attrs),
        })
    }
}