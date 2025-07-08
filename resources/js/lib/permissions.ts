/**
 * Evaluates a logical expression for permissions or roles.
 *
 * This function can parse a logical string with the following operators:
 * - `&`: Logical AND
 * - `|`: Logical OR
 * - `!`: Logical NOT
 * - `()`: Grouping
 *
 * It replaces permission/role names in the string with `true` or `false`
 * based on whether the user has them, and then safely evaluates the
 * resulting boolean expression.
 *
 * @param expression The logical expression string.
 * @param availableItems The list of permissions or roles the user has.
 * @returns {boolean} The result of the evaluated expression.
 */
function evaluateExpression(expression: string, availableItems: string[]): boolean {
    // Find all unique permission/role names in the expression.
    const requiredItems = [...new Set(expression.match(/[a-zA-Z0-9\s._-]+/g) || [])]
        .map(item => item.trim())
        .filter(item => item && !/^(true|false)$/i.test(item));

    let booleanExpression = expression;

    // Replace each item with `true` or `false` based on user's items.
    for (const item of requiredItems) {
        const hasItem = availableItems.includes(item);
        // Use a regex to replace the item as a whole word to avoid partial matches.
        booleanExpression = booleanExpression.replace(new RegExp(`\\b${item}\\b`, 'g'), String(hasItem));
    }

    // Sanitize for JavaScript evaluation.
    const sanitizedExpression = booleanExpression
        .replace(/&/g, '&&')
        .replace(/\|/g, '||');

    // Ensure the entire string consists only of allowed tokens.
    // This is safer than the previous character-based check.
    const validationRegex = /^(true|false|&&|\|\||!|\(|\)|\s)+$/;
    if (!validationRegex.test(sanitizedExpression)) {
        console.error('Invalid characters or structure in permission expression:', sanitizedExpression);
        return false;
    }

    try {
        // Safely evaluate the sanitized boolean expression.
        return new Function(`return ${sanitizedExpression}`)();
    } catch (e) {
        console.error('Error evaluating permission expression:', e);
        return false; // On error, deny access.
    }
}

/**
 * Checks if a user's permissions satisfy a logical expression.
 * If an array is passed, it defaults to requiring all of them (old behavior).
 *
 * @param requiredPermissions The logical expression string or an array of permissions.
 * @param userPermissions The permissions the user possesses.
 * @returns {boolean} True if the user meets the requirements.
 */
export const checkPermissions = (requiredPermissions?: string | string[], userPermissions: string[] = []): boolean => {
    if (!requiredPermissions || (Array.isArray(requiredPermissions) && requiredPermissions.length === 0)) {
        return true;
    }

    const expression = Array.isArray(requiredPermissions)
        ? requiredPermissions.join(' & ')
        : requiredPermissions;

    return evaluateExpression(expression, userPermissions);
};

/**
 * Checks if a user's roles satisfy a logical expression.
 * If an array is passed, it defaults to requiring all of them (old behavior).
 *
 * @param requiredRoles The logical expression string or an array of roles.
 * @param userRoles The roles the user possesses.
 * @returns {boolean} True if the user meets the requirements.
 */
export const checkRoles = (requiredRoles?: string | string[], userRoles: string[] = []): boolean => {
    if (!requiredRoles || (Array.isArray(requiredRoles) && requiredRoles.length === 0)) {
        return true;
    }

    const expression = Array.isArray(requiredRoles)
        ? requiredRoles.join(' & ')
        : requiredRoles;

    return evaluateExpression(expression, userRoles);
};
