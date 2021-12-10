const urlPerson = "http://localhost:4000/person";
const urlUser = "http://localhost:4000/user";

if (localStorage.getItem('token') == null) {
    location.href = "/index.html";
}

let modalCode = new bootstrap.Modal(document.getElementById('code'), {
    keyboard: false
})
let codeRes;
const code = async () => {
    let password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    let response;
    data = { email }
    let confirmPassword = document.getElementById('confirmPassword').value;
    let name = document.getElementById('name').value;
    let surname = document.getElementById('surname').value;
    let secondSurname = document.getElementById('secondSurname').value;
    if (!(password === '' || email === '' || name === '' || surname === '')) {
        if (password === confirmPassword) {
            await $.ajax({
                method: "POST",
                url: 'http://localhost:4000/user/chkEmail/',
                data: data
            }).done(res => {
                response = res;
            });
            if (response === 'Exist') {
                Swal.fire({
                    title: 'El correo electrónico ingresado ya existe',
                    icon: 'error',
                })
            } else {
                await $.ajax({
                    method: "POST",
                    url: 'http://localhost:4000/use/mail/',
                    data: data
                }).done(res => {
                    Swal.fire({
                        title: 'Código enviado con exito',
                        confirmButtonText: 'Aceptar',
                        icon: 'success',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            modalCode.show();
                        }
                    })
                    codeRes = res.code;
                    return false;
                });
            }

        } else {
            Swal.fire({
                title: 'Las contraseñas ingresadas no son iguales',
                icon: 'error',
            })
            return false;
        }
        return false;
    } else {
        Swal.fire({
            title: 'Hay campos vacios, llenelos primero',
            icon: 'error',
        })
    }
}

const register = async () => {

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    let name = document.getElementById('name').value;
    let surname = document.getElementById('surname').value;
    let secondSurname = document.getElementById('secondSurname').value;
    let codeN = document.getElementById('codeN').value;
    let role;
    if (document.getElementById("roleR").value == 1) {
        role = 1;
    } else {
        role = 2;
    }
    if (codeRes === codeN) {
        person = { email, password, name, surname, secondSurname, role };
        await $.ajax({
            method: "POST",
            url: 'http://localhost:4000/person/create/',
            data: person
        }).done(res => {
            Swal.fire({
                title: 'Se ha registrado correctamente',
                confirmButtonText: 'Recargar tabla',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    getAll();
                    modalCode.hide();
                    document.getElementById("closeRegister").click();
                }
            })
        });
    } else {
        Swal.fire({
            title: 'El código ingresado no coincide',
            icon: 'error',
        })
    }
}
const getAll = async () => {
    let persons;
    let content;
    await $.ajax({
        method: "GET",
        url: urlPerson
    }).done(function (resPerson) {
        content = "";
        persons = resPerson.people
    });
    await $.ajax({
        method: "GET",
        url: urlUser
    }).done(resUser => {
        users = resUser.users
        for (let i = 0; i < persons.length; i++) {
            if (persons[i].secondSurname === null) {
                persons[i].secondSurname = ''
            }
            content += `
                        <tr>
                            <td>${persons[i].idPerson}</td>
                            <td>${persons[i].name} ${persons[i].surname} ${persons[i].secondSurname}</td>
                            <td>${users[i].email}</td>
                            <td>${users[i].role}</td>
                            <td>${persons[i].status}</td>
                            <td>${persons[i].date_created}</td>
                            <td>${persons[i].date_updated}</td>
                            <td>
                                <button type="button" onclick="getById(${persons[i].idPerson})" data-bs-toggle="modal" data-bs-target="#modify" class="btn btn-outline-primary"><i class="fas fa-edit"></i></button>
                            </td>
                            <td>
                                <button onclick="runDelete(${persons[i].idPerson})" class="btn btn-outline-danger"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
        }
        $("#table > tbody").html(content);
    });

};

const getById = async (id) => {
    await $.ajax({
        method: "GET",
        url: urlPerson + '/' + id
    }).done(resPersons => {
        document.getElementById("idM").value = resPersons.person[0].idPerson;
        document.getElementById("nameM").value = resPersons.person[0].name;
        document.getElementById("surnameM").value = resPersons.person[0].surname;
        if (resPersons.person[0].secondSurname != null) {
            document.getElementById("secondSurnameM").value = resPersons.person[0].secondSurname;
        } else {
            document.getElementById("secondSurnameM").value = ""
        }
    });

    await $.ajax({
        method: "GET",
        url: urlUser + '/' + id,
    }).done(resUser => {
        document.getElementById("emailM").value = resUser.user[0].email;
        if (resUser.user[0].role == 1) {
            document.getElementById("role").selectedIndex = 0;
        } else {
            document.getElementById("role").selectedIndex = 1;
        }

    });
};

const modify = async () => {
    let user = new Object();
    user.name = document.getElementById("nameM").value;
    user.surname = document.getElementById("surnameM").value;
    if (document.getElementById("secondSurnameM").value != '') {
        user.secondSurname = document.getElementById("secondSurnameM").value;
    }
    await $.ajax({
        method: "POST",
        url: urlPerson + '/update/' + document.getElementById("idM").value,
        data: user
    });

    let userRol = new Object();
    userRol.role = document.getElementById("role").value;
    await $.ajax({
        method: "POST",
        url: urlUser + '/update/' + document.getElementById("idM").value,
        data: userRol
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
const runDelete = async (id) => {
    await $.ajax({
        method: "POST",
        url: urlPerson + '/delete/' + id
    });
    await $.ajax({
        method: "POST",
        url: urlUser + '/delete/' + id
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