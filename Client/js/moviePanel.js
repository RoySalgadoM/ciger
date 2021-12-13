const url = "http://localhost:4000/movie";

if (localStorage.getItem('token') == null) {
    location.href = "/index.html";
} else if (localStorage.getItem('role') != null) {
    bytes = CryptoJS.AES.decrypt(localStorage.getItem('role'), 'A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv');
    role = bytes.toString(CryptoJS.enc.Utf8);
    if (role != 1) {
        location.href = "/index.html";
    }
}

let castRegister = new bootstrap.Modal(document.getElementById('castRegister'), {
    keyboard: false
})

let addC = new bootstrap.Modal(document.getElementById('addCast'), {
    keyboard: false
})
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            resolve(reader.result.split(',')[1]);
        }
    })
}
let idMovie;
let arrCast;
const register = async () => {
    let title = document.getElementById('title').value;
    let originalTitle = document.getElementById('originalTitle').value;
    let description = document.getElementById('description').value;
    let runningTime = document.getElementById('runningTime').value;
    let price = document.getElementById('price').value;
    let id_category = document.getElementById('categoryCont').value;
    let imageGet = document.getElementById('image').files[0];

    if (title === '' || originalTitle === '' || description === '' || imageGet == null || runningTime === '' || image === '' || price === '' || id_category === '') {

        Swal.fire({
            title: 'Primero llena los campos',
            icon: 'error',
        })
    } else {
        const image = await blobToBase64(imageGet)
        
        data = { title, originalTitle, description, runningTime, image, price, id_category }
        await $.ajax({
            method: "POST",
            url: url + "/create",
            data: data
        }).done(res => {
            Swal.fire({
                title: 'Se ha registrado correctamente',
                confirmButtonText: 'Recargar tabla',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    getAll();
                    cleanData()
                    document.getElementById("closeRegister").click();
                    getAllCast()
                }
            })
        });
    }

}
const getAll = async () => {
    let content;
    await $.ajax({
        method: "GET",
        url: url
    }).done(async (res) => {
        movie = res.movie
        let nameCategory;
        for (let i = 0; i < movie.length; i++) {
            await $.ajax({
                method: "GET",
                url: 'http://localhost/symfonyServer/ciger/public/index.php/category/' + movie[i].id_category
            }).done(res => {
                category = res.category
                nameCategory = category[0].name
            })
            content += `
                        <tr>
                            <td>${movie[i].idMovie}</td>
                            <td>${movie[i].title}</td>
                            <td>${movie[i].description}</td>
                            <td>${movie[i].runningTime}</td>
                            <td>${movie[i].price}</td>
                            <td>${nameCategory}</td>
                            <td>${movie[i].status}</td>
                            <td>${movie[i].date_created}</td>
                            <td>${movie[i].date_updated}</td>
                            <td>
                                <button type="button" onclick="getAllCast(${movie[i].idMovie})" data-bs-toggle="modal" data-bs-target="#castRegister" class="btn btn-outline-primary"><i class="fas fa-plus"></i>
                                </button>
                            </td>
                            <td>
                                <button type="button" onclick="getById(${movie[i].idMovie})" data-bs-toggle="modal" data-bs-target="#modify" class="btn btn-outline-warning"><i class="fas fa-edit"></i></button>
                            </td>
                            <td>
                                <button onclick="runDelete(${movie[i].idMovie})" class="btn btn-outline-danger"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
        }
        $("#table > tbody").html(content);
    });

}
const getCast = async () => {
    let content;
    await $.ajax({
        method: "GET",
        url: 'http://localhost/symfonyServer/ciger/public/index.php/cast'
    }).done(function (res) {
        cast = res.cast
        
        for (let i = 0; i < cast.length; i++) {
            let exist = false;
            console.log(arrCast)
            for(let r=0; r< arrCast.length ;r++){
                if((cast[i].idcast==arrCast[r])){
                    exist=true;
                }
            }
            if(!exist){
                content += `<option value="${cast[i].idcast}">${cast[i].name}</option>`;
            }
            
        }
        $("#cast").html(content);
    });

}
const addCast = async () => {
    let content;
    let id_cast = document.getElementById('cast').value
    let id_movie = idMovie;
    let data = {id_movie,id_cast}
    await $.ajax({
        method: "POST",
        url: 'http://localhost:4000/movieCast/create',
        data
    }).done(function (res) {
        Swal.fire({
            title: 'Se añadió el actor a la película',
            confirmButtonText: 'Ver actores',
            icon: 'success',
        }).then((result) => {
            if (result.isConfirmed) {
                addC.hide();
                getAllCast(idMovie)
                castRegister.show()
            }
        })
    });

}


const getAllCast = async (id) => {
    let content;
    idMovie = id;
    $("#tableCast > tbody").html("");
    await $.ajax({
        method: "GET",
        url: 'http://localhost:4000/movieCast/cast/'+id
    }).done(async (res) => {
        cast = res.cast
        arrCast = new Array(cast.length)
        for (let i = 0; i < cast.length; i++) {
            arrCast[i] = cast[i].idCast
            content += `
                        <tr>
                            <td>${cast[i].name}</td>
                            <td>
                                <button type="button" onclick="deleteCast(${cast[i].idCast})" class="btn btn-outline-danger"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
        }
        $("#tableCast > tbody").html(content);
    });

}

const deleteCast=async(id)=>{
    cast=id
    data = {cast}
    await $.ajax({
        method: "POST",
        url: 'http://localhost:4000/movieCast/delete/'+idMovie,
        data:data
    }).done(res => {
        Swal.fire({
            title: 'Se eliminado este actor de la película',
            confirmButtonText: 'Recargar la tabla',
            icon: 'success',
        }).then((result) => {
            if (result.isConfirmed) {
                
                getAllCast(idMovie)
                castRegister.show()
            }
        })
    });
}

const getAllCategory = async (id) => {
    let content;
    await $.ajax({
        method: "GET",
        url: 'http://localhost/symfonyServer/ciger/public/index.php/category/'
    }).done(res => {
        category = res.category
        for (let i = 0; i < category.length; i++) {
            content += `<option value="${category[i].idcategory}">${category[i].name}</option>`;
        }
        $("#categoryCont").html(content);
    })
};

const getById = async (id) => {
    let idCategory;
    await $.ajax({
        method: "GET",
        url: url + '/' + id
    }).done(res => {
        document.getElementById("idM").value = res.movie[0].idMovie;
        document.getElementById("titleM").value = res.movie[0].title;
        document.getElementById("originalTitleM").value = res.movie[0].originalTitle;
        document.getElementById("descriptionM").value = res.movie[0].description;
        document.getElementById("runningTimeM").value = res.movie[0].runningTime;
        document.getElementById("priceM").value = res.movie[0].price;
        document.getElementById("categoryContM").value = res.movie[0].categoryCont;
        idCategory = res.movie[0].id_category
        let array8 = new Uint8Array(res.movie[0].image.data);
        var image = new TextDecoder().decode(array8);
        document.getElementById("imgM").src = `data:image/*;base64,${image}`
    });

    let content;
    await $.ajax({
        method: "GET",
        url: 'http://localhost/symfonyServer/ciger/public/index.php/category/'
    }).done(res => {
        category = res.category
        for (let i = 0; i < category.length; i++) {
            if (category[i].idcategory == idCategory) {
                content += `<option selected value="${category[i].idcategory}">${category[i].name}</option>`;
            } else {
                content += `<option value="${category[i].idcategory}">${category[i].name}</option>`;
            }

        }
        $("#categoryContM").html(content);
    })
};

const modify = async () => {
    let id = document.getElementById("idM").value
    let getImg = document.getElementById("imageM").files[0]
    let movie = new Object();
    movie.title = document.getElementById("titleM").value
    movie.originalTitle = document.getElementById("originalTitleM").value;
    movie.description = document.getElementById("descriptionM").value
    movie.runningTime = document.getElementById("runningTimeM").value;
    movie.price = document.getElementById("priceM").value
    movie.id_category = document.getElementById("categoryContM").value;
    if(getImg!=null){
        movie.image = await blobToBase64(getImg)
    }else{
        movie.image = 'NoRequired'
    }
    if (
    document.getElementById("titleM").value === '' ||
    document.getElementById("originalTitleM").value === '' ||
    document.getElementById("descriptionM").value === '' ||
    document.getElementById("runningTimeM").value === '' ||
    document.getElementById("priceM").value === '' ||
    document.getElementById("categoryContM").value === '') {
        Swal.fire({
            title: 'Primero llena los campos',
            icon: 'error',
        })
    } else {
        await $.ajax({
            method: "POST",
            url: url + '/update/' + id,
            data: movie
        }).done(res => {
            Swal.fire({
                title: 'Modificación realizada con exito',
                confirmButtonText: 'Recargar la tabla',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    getAll();
                    cleanData();
                    document.getElementById("closeModify").click();
                }
            })
        });
    }
}
const cleanData=()=>{
    document.getElementById("titleM").value = ''
    document.getElementById("originalTitleM").value =''
    document.getElementById("descriptionM").value = ''
    document.getElementById("runningTimeM").value =''
    document.getElementById("priceM").value =''
    document.getElementById("categoryContM").value =''
    document.getElementById("imageM").value =''

    document.getElementById("title").value = ''
    document.getElementById("originalTitle").value =''
    document.getElementById("description").value = ''
    document.getElementById("runningTime").value =''
    document.getElementById("price").value =''
    document.getElementById("categoryCont").value =''
    document.getElementById("image").value =''
}

const runDelete = async (id) => {
    await $.ajax({
        method: "POST",
        url: url + '/delete/' + id
    }).done(res => {
        Swal.fire({
            title: 'Se ha dado de baja correctamente',
            confirmButtonText: 'Recargar la tabla',
            icon: 'success',
        }).then((result) => {
            if (result.isConfirmed) {
                getAll();
            }
        })
    });
}


