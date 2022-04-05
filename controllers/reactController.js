//+ React controller
module.exports = (req, res) => {
    res.sendFile(`${__dirname}/views/build/index.html`);
};
