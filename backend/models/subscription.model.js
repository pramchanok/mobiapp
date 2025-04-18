const subscriptions = [];

module.exports = {
    save: (sub) => subscriptions.push(sub),
    getAll: () => subscriptions,
};
