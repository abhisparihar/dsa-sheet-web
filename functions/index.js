module.exports.paginationQuery = function (req, withLoadMore = false) {
    try {

        let limit = req.query.limit ? Number(req.query.limit) : 10;
        let page = req.query.page ? Number(req.query.page) : 1;
        let skip = limit * (page - 1);
        if (withLoadMore) {
            skip = 8 * ((req.query.page ? Number(req.query.page) : 1) - 1);
        } else {
            skip = limit * ((req.query.page ? Number(req.query.page) : 1) - 1);
        }
        if (!isNaN(limit) && !isNaN(skip) && limit >= 0 && skip >= 0) {
            // Set sorting object
            const sort = {};
            // Check if sort object is set in body and sort field's direction is not normal then prepare the sort object related to mongodb requirement
            const order =
                req.query.sortOrder && req.query.sortOrder == "desc" ? -1 : 1;
            req.query.sortField
                ? (sort[req.query.sortField] = order)
                : (sort["_id"] = -1);

            return {
                limit,
                skip,
                sort,
                page,
            };
        }
        throw new Error();
    } catch (error) {
        console.log("🚀 ~ error:", error)
        return false;
    }
};