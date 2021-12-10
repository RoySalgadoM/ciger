const url = "http://localhost/symfonyServer/ciger/public/index.php/cast";

if (localStorage.getItem('token') == null) {
    location.href = "/index.html";
}



const register = async () => {

    let name = document.getElementById('name').value;
    let role = document.getElementById('role').value;
    let biographyURL = document.getElementById('url').value;

    data = {name,role,biographyURL}
    if(name===''||role===''||biographyURL===''){
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
        cast = res.cast
        for (let i = 0; i < cast.length; i++) {
            content += `
                        <tr>
                            <td>${cast[i].idcast}</td>
                            <td>${cast[i].name}</td>
                            <td>${cast[i].role}</td>
                            <td>${cast[i].biographyurl}</td>
                            <td>${cast[i].status}</td>
                            <td>${cast[i].dateCreated.date}</td>
                            <td>${cast[i].dateUpdated.date}</td>
                            <td>
                                <button type="button" onclick="getById(${cast[i].idcast})" data-bs-toggle="modal" data-bs-target="#modify" class="btn btn-outline-primary"><i class="fas fa-edit"></i></button>
                            </td>
                            <td>
                                <button onclick="runDelete(${cast[i].idcast})" class="btn btn-outline-danger"><i class="fas fa-trash"></i></button>
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
        document.getElementById("idM").value = res.cast[0].idcast;
        document.getElementById("nameM").value = res.cast[0].name;
        document.getElementById("roleM").value = res.cast[0].role;
        document.getElementById("urlM").value = res.cast[0].biographyurl;
    });
};

const modify = async () => {
    let cast = new Object();
    cast.id =  document.getElementById("idM").value
    cast.name = document.getElementById("nameM").value;
    cast.role = document.getElementById("roleM").value;
    cast.biographyURL = document.getElementById("urlM").value;

    if (document.getElementById("nameM").value === '' || document.getElementById("roleM").value === '' || document.getElementById("urlM").value === '') {
        Swal.fire({
            title: 'Primero llena los campso',
            icon: 'error',
        })
    }else{
        await $.ajax({
            method: "POST",
            url: url + '/update',
            data: cast
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