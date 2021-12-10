if(localStorage.getItem('token')!=null){
    location.href ="/index.html";
}else{

}

let modalCode = new bootstrap.Modal(document.getElementById('code'), {
    keyboard: false
})
let codeRes;
const code = async() => {
    let password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    let response;
    data = {email}
    let confirmPassword = document.getElementById('confirmPassword').value;
    let name = document.getElementById('name').value;
    let surname = document.getElementById('surname').value;
    let secondSurname = document.getElementById('secondSurname').value;
    if(!(password ==='' || email ==='' || name ==='' || surname ==='')){
        if(password===confirmPassword){
            await $.ajax({
                method: "POST",
                url: 'http://localhost:4000/user/chkEmail/',
                data: data
            }).done(res =>{
                response = res;
            });
            if(response==='Exist'){
                Swal.fire({
                    title: 'El correo electrónico ingresado ya existe',
                    icon: 'error',
                })
            }else{
                await $.ajax({
                    method: "POST",
                    url: 'http://localhost:4000/use/mail/',
                    data: data
                }).done(res =>{
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
            
        }else{
            Swal.fire({
                title: 'Las contraseñas ingresadas no son iguales',
                icon: 'error',
            })
            return false;
        }
        return false;
    }
}

const register = async() =>{

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    let name = document.getElementById('name').value;
    let surname = document.getElementById('surname').value;
    let secondSurname = document.getElementById('secondSurname').value;
    let codeN = document.getElementById('codeN').value;
    
    if(codeRes===codeN){
        person ={email,password,name,surname,secondSurname};
        await $.ajax({
            method: "POST",
            url: 'http://localhost:4000/person/create/',
            data: person
        }).done(res =>{
            Swal.fire({
                title: 'Te has registrado correctamente',
                confirmButtonText: 'Ir a la página de inicio de sesión',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    location.href ="/view/login.html";
                }
            })
        });
    }else{
        Swal.fire({
            title: 'El código ingresado no coincide',
            icon: 'error',
        })
    }
}