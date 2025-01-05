const handlebar = require('handlebars');
const helpers = require('handlebars-helpers')({
    handlebars: handlebar
})
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

module.exports = {
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(handlebar),
    helpers: {
        ...helpers,
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },

        flashMe: function (data) {
            const title = (data.type == 'error' ? 'Error' : (data.type == 'success' ? 'Success' : ''));
            const str = `<script >toastr.${data.type}("${data.message}", "${title}" ,{progressBar: !0,showMethod: "slideDown",hideMethod: "slideUp",timeOut: 2e3})</script>`;
            return new handlebar.SafeString(str);
        },
        pagination: function (pagination) {
            // Return null if there's only one page or no pages.
            if (pagination.totalPage <= 1) {
                return null;
            }

            let limit = parseInt(pagination.limit);
            let start = parseInt(((parseInt(pagination.page) - 1) * limit)) + 1;
            let end = limit * (parseInt(pagination.page) - 1) + parseInt(pagination.currentRecords);

            // Parse and reconstruct the URL.
            const qs = require('qs');
            let url_parts = pagination.url.split("?");
            let params = qs.parse(url_parts[1]);
            delete params['page'];
            delete params['for'];
            let new_qry = qs.stringify(params);
            let new_url = url_parts[0] + "?" + new_qry;

            // Build the "Showing X to Y of Z entries" message HTML.
            let infoString = `<div class="col"><div class="dataTables_info" role="status" aria-live="polite">Showing ${start} to ${end} of ${pagination.totalRecords} entries</div></div>`;

            // Build pagination HTML.
            let paginationString = '<div class="col-auto mr-auto"><div class="demo-inline-spacing">';
            paginationString += '<nav aria-label="Page navigation"><ul class="pagination">';

            // First page link.
            paginationString += `<li class="page-item first ${pagination.page === 1 ? 'disabled' : ''}">
                <a class="page-link" href="${new_url}&page=1"><i class="tf-icon bx bx-chevrons-left"></i></a>
            </li>`;

            // Previous page link.
            paginationString += `<li class="page-item prev ${pagination.page === 1 ? 'disabled' : ''}">
                <a class="page-link" href="${new_url}&page=${pagination.page - 1}"><i class="tf-icon bx bx-chevron-left"></i></a>
            </li>`;

            // Page number links.
            for (let i = 1; i <= pagination.totalPage; i++) {
                paginationString += `<li class="page-item ${i === pagination.page ? 'active' : ''}">
                    <a class="page-link" href="${new_url}&page=${i}">${i}</a>
                </li>`;
            }

            // Next page link.
            paginationString += `<li class="page-item next ${pagination.page === pagination.totalPage ? 'disabled' : ''}">
                <a class="page-link" href="${new_url}&page=${pagination.page + 1}"><i class="tf-icon bx bx-chevron-right"></i></a>
            </li>`;

            // Last page link.
            paginationString += `<li class="page-item last ${pagination.page === pagination.totalPage ? 'disabled' : ''}">
                <a class="page-link" href="${new_url}&page=${pagination.totalPage}"><i class="tf-icon bx bx-chevrons-right"></i></a>
            </li>`;

            paginationString += '</ul></nav></div></div>';

            // Combine both parts into a single row.
            let string = '<div class="card-body"><div class="row align-items-center">';
            string += infoString + paginationString;
            string += '</div></div>';

            // Return combined HTML.
            return new handlebar.SafeString(string);
        },
        includes: (array, value) => {
            return Array.isArray(array) && array.includes(value.toString());
        }
    }
}