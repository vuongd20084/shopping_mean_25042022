const Html = require('./C_Html')

class Categories extends Html {
    get_html_categories(array = []) {
        var str = ''
        array.forEach(e => {
            if (e.element == 'input') {
                str += this.html_input(e.type, e.name, e.id, e.class, e.placeholder, e.required, e.changeTitleToSlug);

            } else if (e.element == 'select') {
                str += this.html_select(e.array, e.name, e.id, e.class, e.required);
            }
        })
        return str;
    }
}

module.exports = Categories;