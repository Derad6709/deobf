"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function composeClassName(tokens) {
    return tokens
        .reduce(function (classNames, token) {
        if (typeof token === 'string')
            classNames.push(token);
        else {
            var predicate = token[0], className = token[1];
            if (predicate)
                classNames.push(className);
        }
        return classNames;
    }, [])
        .join(' ');
}
exports.default = composeClassName;
//# sourceMappingURL=composeClassName.js.map