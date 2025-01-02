export const renderBurgerMenu = async (ctx) => {
    ctx.response.body = await ctx.nunjucks.render("burgermenutest.html");
    ctx.response.headers.set("content-type", "text/html");
    ctx.response.status = 200;
};


document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('myTopnav');

    burgerMenu.addEventListener('click', () => {
        if (navLinks.classList.contains('responsive')) {
            navLinks.classList.remove('responsive');
        } else {
            navLinks.classList.add('responsive');
        }
    });
});
