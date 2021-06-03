var gasWorkCalcs = {
    straight: {
        k: function(x1, y1, x2, y2) {
            return -((y2-y1)/(x1-x2))
        },
        b: function(x1, y1, x2, y2) {
            return -(((x2*y1)-(x1*y2))/(x1-x2))
        },
        area: function(V1, V2, k, b) {
            return (k*V2*V2/2)+(b*V2)-(k*V1*V1/2)-(b*V1)
        },
        y: function(x, param1, param2) {
            return param1*x + param2
        },
    },
    parabola: {
        c: function(x1, y1, x2, y2, a) {
            return ((x2*y1-x1*y2)/((x2-x1)))+(a*x1*x2)
        },
        b: function(x1, y1, x2, y2, a) {
            return ((y2-y1)/(x2-x1))-(a*((x1+x2)))
        },
        area: function(V1, V2, a, b, c) {
            a = a / 100
            return (V2*V2*V2*a/3)+(V2*V2*b/2)+(c*V2)-(V1*V1*V1*a/3)-(V1*V1*b/2)-(c*V1)
        },
        y: function(x, param1, param2, param3) {
            return param1*x*x/100 + param2*x + param3
        },
        y0: function(a, b, c) {
            return ((4*a*c/100)-b*b)/(4*a/100)
        },
    },
    hyperbola: {
        k: function(x1, y1, x2, y2) {
            return (((y1-y2)*x1*x2)/(x2-x1))
        },
        b: function(x, y, k) {
            return (y - (k/x))
        },
        area: function(V1, V2, k, b) {
            return (k*Math.log(V2))+V2*b-(k*Math.log(V1))-V1*b
        },
        y: function(x, param1, param2) {
            return (param1/x)+ param2
        },
    },
    exponent: {
        a: function (x1, y1, x2, y2, g) {
            var E = Math.E
            return ((y1-y2)/(Math.pow(E, g*x1)-(Math.pow(E, g*x2))))
        },
        b: function(x, y, g, a) {
            return (y - (a*Math.pow(Math.E, g*x)))
        },
        area: function(V1, V2, a, b, y) {
            var E = Math.E
            return (a*(Math.pow(E, y*V2))/y) + b*V2 - (a*(Math.pow(E, y*V1))/y) - b*V1
        },
        y: function(x, param1, param2, param3) {
            return (param1*Math.pow(Math.E, param3*x))+param2
        },
    },
}