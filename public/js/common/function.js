var notify = function (type, message, titleText = null) {
    let title;
    if (!titleText) {
        title = 'Success';
        if (type === 'error') {
            title = 'Error'
        }
    } else {
        title = titleText;
    };

    console.log("🚀 ~ notify ~ title:", title)
    toastr[type](message, title, { progressBar: !0, showMethod: "slideDown", hideMethod: "slideUp", timeOut: 2e3, preventDuplicates: true })
};
