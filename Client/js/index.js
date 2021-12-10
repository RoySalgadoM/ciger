const url = "http://localhost:4000/movie";

const getAllNav = async () => {
    let content=1;
    await $.ajax({
        method: "GET",
        url: url+ '/ultimateMovies'
    }).done(function (res) {
        movie = res.movie

        for (let i = 0; i < movie.length; i++) {
            if (movie[i].status == 1) {
                if (content == 1) {
                    content = `<div class="carousel-item active" data-bs-interval="3000">
                    <img src="${movie[i].image}" class="d-block w-100" alt="">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${movie[i].title}</h5>
                        <p>${movie[i].description}</p>
                    </div>
                </div>`;
                } else {
                    content += `<div class="carousel-item active" data-bs-interval="3000">
                    <img src="${movie[i].image}" class="d-block w-100" alt="">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${movie[i].title}</h5>
                        <p>${movie[i].description}</p>
                    </div>
                </div>`;
                }

            }

        }

    });
    $("#carouselItems").html(content);
}


const getAll = async () => {
    let content=1;
    await $.ajax({
        method: "GET",
        url: url
    }).done(function (res) {
        movie = res.movie

        for (let i = 0; i < movie.length; i++) {
            if (movie[i].status == 1) {
                if (content == 1) {
                    content = `<div class="col-md-6 col-sm-12 col-lg-3 mb-3">
                    <div class="card text-center">
                        <img src="${movie[i].image}" class="rounded mx-auto d-block m-2" width="200px" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${movie[i].title}</h5>
                            <p class="card-text">${movie[i].originalTitle}</p>
                            <p class="card-text">${movie[i].description}</p>
                            <p class="card-text" style="font-size: 20px; color: red !important;">$${movie[i].price}</p>
                            <a href="#" class="btn green-btn">Comprar</a>
                        </div>
                    </div>
                </div>`;
                } else {
                    content += `<div class="col-md-6 col-sm-12 col-lg-3 mb-3">
            <div class="card text-center">
                <img src="${movie[i].image}" class="rounded mx-auto d-block m-2" width="200px" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${movie[i].title}</h5>
                    <p class="card-text">${movie[i].originalTitle}</p>
                    <p class="card-text">${movie[i].description}</p>
                    <p class="card-text" style="font-size: 20px; color: red !important;">$${movie[i].price}</p>
                    <a href="#" class="btn green-btn">Comprar</a>
                </div>
            </div>
        </div>`;
                }

            }

        }

    });
    $("#cardContainer").html(content);
    getAllNav();
}