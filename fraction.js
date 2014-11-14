/* An immutable Fraction datatype */

// Example parameters: Fraction(1,2), Fraction(3), Fraction('3/2'), 
var Fraction = (function(){ 
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    function lcm(a, b) { return !a||!b ? 0 : a*b/gcd(a,b); }
    function normalize(frac) {
        if(frac.numerator==0)  return frac;
        if(frac.denominator==1) return frac;
        if(frac.denominator!==-1) {
                var divisor = gcd(frac.numerator, frac.denominator);
                frac.numerator /= divisor;
                frac.denominator /= divisor;
        }
        if ((frac.numerator < 0 && frac.denominator < 0) || (frac.numerator > 0 && frac.denominator < 0)) {
            frac.numerator *= -1;
            frac.denominator *= -1;
        }
        return frac;
    };
    return function(numerator, denominator) { 
        if(denominator===0)
            throw '[error] Invalid fraction: ' + numerator + '/0';
        if(numerator===undefined)
            numerator = 1; // value is 1 by default
        if(typeof numerator == 'string' && denominator===undefined) {
            var vals = numerator.split('/');
            numerator = +vals[0];
            denominator = (vals.length==2) ? +vals[1] : 1;
        }
        this.numerator = +numerator;
        this.denominator = denominator===undefined ? 1 : +denominator;
        normalize(this);
    }
})();
Fraction.prototype = {
    toString: function() {
        if(this.numerator==0) return '0';
        if(this.denominator==1) return this.numerator.toString();
        return this.numerator + '/' + this.denominator;
    },
    toNumber: function() {
        if(this.numerator==0) return 0;
        if(this.denominator==1) return this.numerator;
        return this.numerator/this.denominator;
    },
    clone: function() {
        return new Fraction(this.numerator, this.denominator);
    },
    /* multiply an integer */
    time: function(n) {
        if(typeof n != 'number') return this.mul(n);
        return new Fraction(this.numerator*n, this.denominator);
    },
    add: function(that) {
        if(typeof that == 'number')
            return new Fraction(this.numerator+that*this.denominator);
        if(this.numerator==0) return that;
        if(that.numerator==0) return this;
        var n = this.numerator*that.denominator + that.numerator*this.denominator;
        var d = this.denominator * that.denominator;
        return new Fraction(n,d);
    },
    subtract: function(that) {
        return this.add(that.time(-1));
    },
    mul: function(that) {
        if(typeof that == 'number') return this.time(that);
        if(this.numerator==0 || that.numerator==0) return Fraction.zero;
        if(this.numerator==1 && this.denominator==1) return that;
        if(that.numerator==1 && that.denominator==1) return this;
        var n = this.numerator * that.numerator;
        var d = this.denominator * that.denominator;
        return new Fraction(n,d);
    },
    lt: function(that) {
        if(typeof that == 'number')
            return this.numerator < that*this.denominator;
        else
            return this.subtract(that).numerator < 0;
    },
    le: function(that) {
        if(typeof that == 'number')
            return this.numerator <= that*this.denominator;
        else
            return this.subtract(that).numerator <= 0;
    },
    eq: function(that) {
      if(typeof that == 'number')
            return this.numerator == that*this.denominator;
        else
            return this.subtract(that).numerator == 0;
    },
    gt: function(that) {
        return !this.le(that);
    },
    ge: function(that) {
        return !this.lt(that);
    },
    isZero: function() {
        return this.numerator == 0;
    }
};
Fraction.ZERO = new Fraction(0);
Fraction.ONE = new Fraction(1);
module.exports = Fraction;
