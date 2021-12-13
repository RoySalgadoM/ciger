const url = "http://localhost:4000/movie";

const getUrl = window.location.search;
const urlParams = new URLSearchParams(getUrl);
let nameCategory = urlParams.get('name');



const executePayment = async () => {
    if (pay_id != null && payer_id != null) {
        let id_person;
        let id_movie = localStorage.getItem('idBuy')
        let token = localStorage.getItem('token')

        let getToken = {token};
        await $.ajax({
            method: "POST",
            url: 'http://localhost:4000/user/returnId',
            data:getToken
        }).done(res => {
            id_person =res.idPerson
        });

        let data = { pay_id, payer_id ,id_person, id_movie};
        await $.ajax({
            method: "POST",
            url: 'http://localhost:4000/paypal/execute-payment',
            data: data
        }).done(res => {
            console.log(res)
        });

        Swal.fire({
            title: 'Tu pago fue realizado con éxito, ¡Gracias!',
            confirmButtonText: 'Ir a compras',
            icon: 'success',
        }).then((result) => {
            if (result.isConfirmed) {
                location.href = "/view/sales.html";
            }
        })
    }

}
let buyModal = new bootstrap.Modal(document.getElementById('buy'), {
    keyboard: false
})

const getAll = async () => {
    let content = 1;
    await $.ajax({
        method: "GET",
        url: url + "/category/"+ nameCategory
    }).done(function (res) {
        if(res.message ==="No exist"){
            location.href = "/view/category.html";
        }else{
            movie = res.movie
            for (let i = 0; i < movie.length; i++) {
                let array8 = new Uint8Array(movie[i].image.data);
                var image = new TextDecoder().decode(array8);
                if (movie[i].status == 1) {
                    if (content == 1) {
                        content = `<div class="col-md-6 col-sm-12 col-lg-3 mb-3">
                        <div class="card text-center">
                            <img src="data:image/*;base64,${image}" class="rounded mx-auto d-block m-2" width="200px" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${movie[i].title}</h5>
                                <p class="card-text">${movie[i].originalTitle}</p>
                                <p class="card-text">${movie[i].description}</p>
                                <p class="card-text" style="font-size: 20px; color: red !important;">$${movie[i].price}</p>
                                <a onclick="buy(${movie[i].idMovie})" class="btn green-btn">Comprar</a>
                            </div>
                        </div>
                    </div>`;
                    } else {
                        content += `<div class="col-md-6 col-sm-12 col-lg-3 mb-3">
                <div class="card text-center">
                    <img src="data:image/*;base64,${image}" class="rounded mx-auto d-block m-2" width="200px" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${movie[i].title}</h5>
                        <p class="card-text">${movie[i].originalTitle}</p>
                        <p class="card-text">${movie[i].description}</p>
                        <p class="card-text" style="font-size: 20px; color: red !important;">$${movie[i].price}</p>
                        <a onclick="buy(${movie[i].idMovie})" class="btn green-btn">Comprar</a>
                    </div>
                </div>
            </div>`;
                    }
    
                }
    
            }
            $("#cardContainer").html(content);
        }
        
        
        

    });
    
}

const buy = async (id) => {
    let nameCategory;
    let content = ``;
    if (localStorage.getItem('token') == null) {
        Swal.fire({
            title: 'Primero inicia sesión',
            confirmButtonText: 'Ir',
            icon: 'info',
        }).then((result) => {
            if (result.isConfirmed) {
                location.href = "/view/login.html";
            }
        })
    } else {
        await $.ajax({
            method: "GET",
            url: url + '/' + id
        }).done(async (res) => {
            let array8 = new Uint8Array(res.movie[0].image.data);
            var image = new TextDecoder().decode(array8);
            await $.ajax({
                method: "GET",
                url: 'http://localhost/symfonyServer/ciger/public/index.php/category/' + res.movie[0].id_category
            }).done(res => {
                category = res.category
                nameCategory = category[0].name
            })
            content += `  
                        <div class="col-12">
                            <input type="hidden" value="${res.movie[0].idMovie}" id="id">
                            <input type="hidden" value="${res.movie[0].title}" id="name">
                            <input type="hidden" value="${res.movie[0].price}" id="price">
                            <h2>${res.movie[0].title}</h2>
                            <h4 class="text-muted">${res.movie[0].originalTitle}</h4>
                        </div>
                        <div class="col-12">
                            <div class="mb-4">
                                <img id="imgM" src="data:image/*;base64,${image}" class="w-75" alt="">
                            </div>
                         </div>
                        <div class="col-12 text-start fst-normal" >
                            <h5>${res.movie[0].description}</h5>
                            <h5>Duracion: ${res.movie[0].runningTime}</h5>
                            <h5>Categoría: ${nameCategory}</h5>
                            <br>
                        </div>  
                        <div class="col-12">
                            <div class="mb-4">
                                <h5>Total: $${res.movie[0].price}</h5>
                                <h5>Paga ahora con</h5>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="mb-4">
                                <table border="0" cellpadding="10" cellspacing="0" align="center"><tr><td align="center"></td></tr><tr><td align="center"><a onclick="createPayment()"><img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg" border="0" alt="PayPal Logo"></a></td></tr></table>
                            </div>
                        </div>`;

            $("#buyContainer").html(content);
            buyModal.show()
        });
    }
}

const createPayment = async () => {
    let name = document.getElementById('name').value
    let total = document.getElementById('price').value
    let data = { name, total };
    await $.ajax({
        method: "POST",
        url: 'http://localhost:4000/paypal/create-payment',
        data: data
    }).done(res => {
        localStorage.setItem('idBuy', document.getElementById('id').value)
        location.href =res.body.links[1].href;
    });
}