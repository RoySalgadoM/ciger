const url = "http://localhost/symfonyServer/ciger/public/index.php/category";

if (localStorage.getItem('token') == null) {
    location.href = "/index.html";
}



const register = async () => {

    let name = document.getElementById('name').value;
    data = {name}
    if(name===''){
        Swal.fire({
            title: 'Primero llena los campos',
            icon: 'error',
        })
    }else{
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
                    document.getElementById("closeRegister").click();
                }
            })
        });
    }
    
}
const getAll = async () => {
    let persons;
    let content;
    await $.ajax({
        method: "GET",
        url: url
    }).done(function (res) {
        category = res.category
        for (let i = 0; i < category.length; i++) {
            content += `
                        <tr>
                            <td>${category[i].idcategory}</td>
                            <td>${category[i].name}</td>
                            <td>${category[i].status}</td>
                            <td>${category[i].dateCreated.date}</td>
                            <td>${category[i].dateUpdated.date}</td>
                            <td>
                                <button type="button" onclick="getById(${category[i].idcategory})" data-bs-toggle="modal" data-bs-target="#modify" class="btn btn-outline-primary"><i class="fas fa-edit"></i></button>
                            </td>
                            <td>
                                <button onclick="runDelete(${category[i].idcategory})" class="btn btn-outline-danger"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
        }
        $("#table > tbody").html(content);
    });

}

const getById = async (id) => {
    await $.ajax({
        method: "GET",
        url: url + '/' + id
    }).done(res => {
        document.getElementById("idM").value = res.category[0].idcategory;
        document.getElementById("nameM").value = res.category[0].name;
    });
};

const modify = async () => {
    let category = new Object();
    category.id =  document.getElementById("idM").value
    category.name = document.getElementById("nameM").value;

    if (document.getElementById("nameM").value === '') {
        Swal.fire({
            title: 'Primero llena los campso',
            icon: 'error',
        })
    }else{
        await $.ajax({
            method: "POST",
            url: url + '/update',
            data: category
        }).done(res => {
            Swal.fire({
                title: 'Modificación realizada con exito',
                confirmButtonText: 'Recargar la tabla',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    getAll();
                    document.getElementById("closeModify").click();
                }
            })
        });
    }
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



const chgPass = async () => {
    let password = document.getElementById('newPassword').value
    let confirmPassword = document.getElementById('confirmPasswordM').value
    let id = document.getElementById('idM').value

    data = { id, password };
    if (password != '' && confirmPassword != '') {
        if (confirmPassword === password) {
            await $.ajax({
                method: "POST",
                url: 'http://localhost:4000/user/chgPasswordAdmin',
                data: data
            }).done(res => {
                console.log(res)
                if (res === 'Success') {
                    Swal.fire({
                        title: 'Se ha modificado correctamente la contraseña, inicie sesión nuevamente',
                        confirmButtonText: 'Ir',
                        icon: 'success',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            closeSesion();
                        }
                    })
                } else {
                    Swal.fire({
                        title: 'Fallo al actualizar la contraseña',
                        icon: 'error',
                    })
                }

            });

        } else {
            Swal.fire({
                title: 'Las contraseñas no son iguales',
                icon: 'error',
            })
        }
    }
}