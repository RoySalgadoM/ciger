if (localStorage.getItem('token') == null) {
    location.href = "/index.html";
} else {

}

const getData = async () => {
    let token = localStorage.getItem('token');
    data = { token }
    await $.ajax({
        method: "POST",
        url: 'http://localhost:4000/person/token/',
        data: data
    }).done(res => {
        document.getElementById('name').value = res.person[0].name
        document.getElementById('surname').value = res.person[0].surname
        document.getElementById('secondSurname').value = res.person[0].secondSurname
        document.getElementById('email').value = res.person[0].email
    });

}

const modifyPerson = async () => {
    let token = localStorage.getItem('token');
    getToken = {token}
    let name = document.getElementById('name').value
    let surname = document.getElementById('surname').value
    let secondSurname = document.getElementById('secondSurname').value
    let id;
    let status = 1;
    let idUser;

    await $.ajax({
        method: "POST",
        url: 'http://localhost:4000/user/returnId',
        data: getToken
    }).done(res => {
        id = res.idPerson
        idUser = id
        data = { name, surname, secondSurname, status, idUser }
    });

    await $.ajax({
        method: "POST",
        url: 'http://localhost:4000/person/update/' + id,
        data: data
    }).done(res => {
        Swal.fire({
            title: 'Se ha modificado correctamente, inicie sesión nuevamente',
            confirmButtonText: 'Ir',
            icon: 'success',
        }).then((result) => {
            if (result.isConfirmed) {
                closeSesion();
            }
        })
    });
}

const deleteProfile = async () => {
    let token = localStorage.getItem('token');
    let oldPassword = document.getElementById('oldPasswordR').value
    data = { token, oldPassword }
    
    data = { token, oldPassword }
    await $.ajax({
        method: "POST",
        url: 'http://localhost:4000/person/delAccUser',
        data: data
    }).done(res => {
        if (res === 'Success') {
            closeSesion();
        } else {
            Swal.fire({
                title: 'La contraseña ingresada es incorrecta',
                icon: 'erro'
            })
        }
    });

}

const chgPass = async () => {
    let token = localStorage.getItem('token');
    let oldPassword = document.getElementById('oldPassword').value
    let password = document.getElementById('newPassword').value
    let confirmPassword = document.getElementById('confirmPassword').value
    data = { token, password, oldPassword };
    if (oldPassword != null && password != null && confirmPassword != null) {
        if (confirmPassword === password) {
            await $.ajax({
                method: "POST",
                url: 'http://localhost:4000/user/chgPassword',
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
                        title: 'La contraseña actual no es correcta',
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