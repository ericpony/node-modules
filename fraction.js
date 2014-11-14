/* An immutable Fraction datatype */

/**
* Constructor: Take integer or string parameters
* Example: Fraction(1,2), Fraction(-3), Fraction('3/2')
*/
var Fraction = (function(){ 
    function assert(val, msg) { if(!val) throw msg }
    function gcd(a, b) { return b ? gcd(b, a % b) : a } // this definition is informal
    function normalize(frac) {
        if(frac.numerator===0) return;
        if(frac.denominator===1) return;
        if(frac.denominator!==-1) {
            var divisor = gcd(frac.numerator, frac.denominator);
            frac.numerator /= divisor;
            frac.denominator /= divisor;
        }
        // put the negative sign (if any) in numerator
        if (frac.denominator<0) {
            frac.numerator = -frac.numerator;
            frac.denominator = -frac.denominator;
        }
    }
    return function(numerator, denominator) { 
        assert(denominator!==0, 'Invalid fraction: ' + numerator + '/0');
        assert(arguments.length!==0, 'Invalid fraction: no parameters');
        if(typeof numerator == 'string' && denominator===undefined) {
            var vals = numerator.split('/');
            assert(vals.length<=2, 'Invalid fraction: ' + numerator);
            numerator = +vals[0];
            denominator = (vals.length==2) ? +vals[1] : 1;
        }
        this.numerator = +numerator;
        this.denominator = denominator===undefined ? 1 : +denominator;
        // NaN check
        assert(isNaN(this.numerator)||isNaN(this.denominator), 'Invalid fraction parameters: ' + arguments);
        normalize(this);
    };
})();
Fraction.prototype = {
    toString: function() {
        if(this.numerator===0) return '0';
        if(this.denominator===1) return this.numerator.toString();
        return this.numerator + '/' + this.denominator;
    },
    toNumber: function() {
        if(this.numerator===0) return 0;
        if(this.denominator===1) return this.numerator;
        return this.numerator/this.denominator;
    },
    clone: function() {
        return new Fraction(this.numerator, this.denominator);
    },
    times: function(n) {
        return new Fraction(this.numerator*n, this.denominator);
    },
    add: function(that) {
        if(typeof that == 'number')
            return new Fraction(this.numerator + that*this.denominator);
        if(this.numerator===0) return that;
        if(that.numerator===0) return this;
        var n = this.numerator*that.denominator + that.numerator*this.denominator;
        var d = this.denominator * that.denominator;
        return new Fraction(n,d);
    },
    subtract: function(that) {
        if(typeof that == 'number')
            return new Fraction(this.numerator - that*this.denominator);
        if(this.numerator===0) return that.times(-1);
        if(that.numerator===0) return this;
        var n = this.numerator*that.denominator - that.numerator*this.denominator;
        var d = this.denominator * that.denominator;
        return new Fraction(n,d);
    },
    mul: function(that) {
        if(typeof that == 'number') return this.times(that);
        if(this.numerator===0 || that.numerator===0) return Fraction.ZERO;
        if(this.numerator===1 && this.denominator===1) return that;
        if(that.numerator===1 && that.denominator===1) return this;
        var n = this.numerator * that.numerator;
        var d = this.denominator * that.denominator;
        return new Fraction(n,d);
    },
    lt: function(that) {
        if(typeof that == 'number')
            return this.numerator < that*this.denominator;
        else
            return (this.numerator*that.denominator < that.numerator*this.denominator);
    },
    le: function(that) {
        if(typeof that == 'number')
            return this.numerator <= that*this.denominator;
        else
            return (this.numerator*that.denominator <= that.numerator*this.denominator);
    },
    eq: function(that) {
      if(typeof that == 'number')
            return this.numerator === that*this.denominator;
        else
            return (this.numerator===that.numerator && this.numerator===that.numerator);
    },
    gt: function(that) {
        return !this.le(that);
    },
    ge: function(that) {
        return !this.lt(that);
    },
    isZero: function() {
        return this.numerator === 0;
    }
};
Fraction.ZERO = new Fraction(0);
Fraction.ONE = new Fraction(1);
module.exports = Fraction;
