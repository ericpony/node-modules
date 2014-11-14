/**
* Define the base class
*/
var Node = function() {
    var nodes = [];
    for(var i=0; i<arguments.length; i++) nodes.push(arguments[i]);
    this.children = nodes;
}
/**
* create a subclass of class Node
*/
Node.create = function(name) {
    var subclass = function() { Node.apply(this, arguments) };
    subclass.prototype = Object.create(Node.prototype); // keeps the prototype clean
    subclass.prototype.constructor = subclass; // repair the inherited constructor
    subclass.prototype.name = name;
    var cname = name.toUpperCase();
    if((GLOBAL||window)[cname])
      throw 'Class ' + cname + ' is aleady defined.';
    (GLOBAL||window)[cname] = function() { // simulate case class
        var obj = {};
        obj.__proto__ = subclass.prototype;
        subclass.apply(obj, arguments);
        return obj;
    };
    return subclass;
}

Node.prototype.toString = function() { return this.name + '(' + this.children + ')' }

/**
* Get the formula represented by a node in Z3 format
*/
Node.to_z3_formula = function(string_parser) {
    return function parse(node) {
        switch(node.constructor) {
            case Node.Not:
                return 'Not(' + parse(node.children[0]) + ')';
            case Node.Or:
                var sub_expr = node.children.map(parse).join(', ');
                /* At least one of the arguments must be a Z3 expression */
                if(!/[()a-zA-Z]/.test(sub_expr))
                    return eval('('+sub_expr.replace(/,/g,')||(')+')') ? 'True' : 'False';
                else
                    return 'Or(' + sub_expr + ')';
            case Node.And:
                var sub_expr = node.children.map(parse).join(', ');
                /* At least one of the arguments must be a Z3 expression */
                if(!/[()a-zA-Z]/.test(sub_expr))
                    return eval('('+sub_expr.replace(/,/g,')&&(')+')') ? 'True' : 'False';
                else
                    return 'And(' + sub_expr + ')';
            case Node.Imp:
                return 'Implies(' + parse(node.children[0]) + ', ' + parse(node.children[1]) + ')';
            case String:
                return string_parser(node);
            default:
                return node.toString();
        }
    }
}
/**
* Get the formula represented by a node in Redlog format
*/
Node.to_redlog_formula = function(string_parser) {
    return function parse(node) {
        switch(node.constructor) {
            case Node.Not:
                return 'not (' + parse(node.children[0]) + ')';
            case Node.Or:
                return '(' + node.children.map(parse).join(') or (') + ')';
            case Node.And:
                return '(' + node.children.map(parse).join(') and (') + ')';
            case Node.Imp:
                return '(' + parse(node.children[0]) + ') impl (' + parse(node.children[1]) + ')';
            case String:
                return string_parser(node.replace(/==/g,'=').replace(/!=/g,'<>'));
            default:
                return node.toString();
        }
    }
}

Node.Not = Node.create('Not');
Node.And = Node.create('And');
Node.Or  = Node.create('Or');
Node.Imp = Node.create('Imp');
module.exports = Node;

if(0){ // demo
  var node = AND('x*y>=100, IMP(AND('10<x', 'x<y'), '2*x<y^2'), IMP(OR('x<=0', 'x>=y'),'x^2<=y^2'));
  console.log(Node.to_redlog_formula(function(x){ return x })(node));
}
