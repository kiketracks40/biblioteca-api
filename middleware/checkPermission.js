function checkPermission(action) {
    return (req, res, next) => {
        // For now, we'll allow all actions
        // You can implement proper permission checking later
        next();
    };
}

module.exports = { checkPermission };