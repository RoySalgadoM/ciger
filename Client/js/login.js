if (localStorage.getItem('token') != null) {
    location.href = "/index.html";
} else {

}
let codeRes;
let email;

let modalCode = new bootstrap.Modal(document.getElementById('forgot'), {
    keyboard: false
})
const login = async () => {
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;
    let data = { email, password };
    if (password != '' && email != '') {
        await $.ajax({
            method: "POST",
            url: 'http://localhost:4000/user/login/',
            data: data
        }).done(res => {
            console.log(res)
            if (res.status === '200') {
                localStorage.setItem('token', res.token);
                localStorage.setItem('role', res.roleUser);
                localStorage.setItem('name', res.name);
                location.href = "/index.html";
            } else if (res.status === '500') {
                Swal.fire({
                    title: 'Correo o contraseña incorrectos',
                    confirmButtonText: 'Aceptar',
                    icon: 'error',
                })
            }
        });
    } else {
        Swal.fire({
            title: 'Rellena los campos primero',
            confirmButtonText: 'Aceptar',
            icon: 'error',
        })
    }
}

const sendCode = async () => {

    let response = grecaptcha.getResponse();
    console.log('a')
    if (response.length != 0) {
        email = document.getElementById('emailRecover').value;
        data = { email }
        let content = "";
        let response;
        if (email != '') {
            await $.ajax({
                method: "POST",
                url: 'http://localhost:4000/user/chkEmail/',
                data: data
            }).done(res => {
                response = res;
            });
            if (response === 'Not found') {
                Swal.fire({
                    title: 'El correo electrónico ingresado no se encuentra registrado',
                    icon: 'error',
                })
            } else {
                await $.ajax({
                    method: "POST",
                    url: 'http://localhost:4000/use/recover/',
                    data: data
                }).done(res => {
                    Swal.fire({
                        title: 'Código enviado con exito',
                        confirmButtonText: 'Aceptar',
                        icon: 'success',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            content = ` <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="staticBackdropLabel">El código ha sido enviado a su correo</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="mb-3 text-center">
                                                    <label for="exampleInputEmail1" class="form-label">Código</label>
                                                    <input required type="number" class="form-control text-center" id="code"
                                                        aria-describedby="emailHelp">
                                                    <button type="button" onclick="chkCode()" class="btn green-btn mt-3">Comprobar código</button>
                                                </div>
                            
                                            </div>
                                        </div>
                                    </div>`;
                            $("#forgot").html(content);
                        }
                    })
                    codeRes = res.code;
                    return false;
                });
            }

        } else {
            Swal.fire({
                title: 'Rellena los campos primero',
                confirmButtonText: 'Aceptar',
                icon: 'error',
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: `El captcha no ha sido aceptado`,
            text: 'Deberá aceptar el captcha para continuar'
        })
        return false;
    }

}

const chkCode = () => {
    let code = document.getElementById('code').value;
    if (codeRes != code) {
        Swal.fire({
            title: 'El código ingresado no coincide',
            confirmButtonText: 'Aceptar',
            icon: 'error',
        })
    } else {
        content = ` <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticBackdropLabel">Ingrese la nueva contraseña</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center">
                    <div class="mb-4">
                        <label for="exampleInputPassword1" class="form-label">Contraseña</label>
                        <input
                            title="Debe incluir minusculas y como minimo un numero, un signo y una mayuscula"
                            pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{4,16}$"
                            required type="password" class="form-control" id="passwordR">
                        <div id="emailHelp" class="form-text">Ingresa una contraseña segura
                        </div>
                    </div>
                    <div class="mb-4 text-center">
                        <label for="exampleInputPassword1" class="form-label">Confirmar contraseña</label>
                        <input
                            title="Debe incluir minusculas y como minimo un numero, un signo y una mayuscula"
                            pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{4,16}$"
                            required type="password" class="form-control mb-4" id="confirmPassword">
                            <button type="submit" onclick="chPass()" class="btn green-btn">Cambiar contraseña</button>
                    </div>
                    

                </div>
                        </div>
                    </div>`;
        $("#forgot").html(content);
    }
}


const chPass = async () => {
    let password = document.getElementById('passwordR').value;
    let confPass = document.getElementById('confirmPassword').value;
    let data = { password, email }
    if (password != confPass) {
        Swal.fire({
            title: 'Las contraseñas no coinciden',
            confirmButtonText: 'Aceptar',
            icon: 'error',
        })
    } else {
        await $.ajax({
            method: "POST",
            url: 'http://localhost:4000/user/password/',
            data: data
        }).done(res => {
            Swal.fire({
                title: 'La contraseña ha sido modificada',
                confirmButtonText: 'Aceptar',
                icon: 'success',
            })
            modalCode.hide();
        });
    }
}