let role;
let bytes;
let locationIndex = "";
let locationCategory = "";

let locationNumber;

if (locationNumber == 1) {
    locationIndex = "active";
    locationCategory = "";
} else if (locationNumber == 2) {
    locationIndex = "";
    locationCategory = "active";
}

if (localStorage.getItem('role') != null) {
    bytes = CryptoJS.AES.decrypt(localStorage.getItem('role'), 'A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv');
    role = bytes.toString(CryptoJS.enc.Utf8);

}

if (localStorage.getItem('token') != null) {
    let content = "";
    if (role == 1) {
        content = ` <a class="navbar-brand" href="#">Navbar</a>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav">
                            <a class="nav-link ${locationIndex}" aria-current="page" href="/index.html">Inicio</a>
                            <a class="nav-link" ${locationCategory} href="/view/category.html">Categorías</a>
                        </div>
                    </div>
                    <div id="contLog">
                        <ul class="navbar-nav me-lg-3">
                            <li class="nav-item dropdown">
                                <a id="imgNameUser" style="color: white !important;" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"  aria-expanded="false">
                                    
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown" id="menu">
                                    <a class="dropdown-item" href="/view/dashboard.html" onclick="">Panel de administración</a>
                                    <a class="dropdown-item" href="/view/sales.html" onclick="">Tus compras</a>
                                    <a class="dropdown-item" href="/view/profile.html" onclick="">Tu perfil</a>
                                    <a class="dropdown-item" onclick="closeSesion()">Cerrar sesión</a>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>`;
        $("#nav").html(content);
    } else {
        content = ` <a class="navbar-brand" href="#">Navbar</a>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav">
                        <a class="nav-link ${locationIndex}" aria-current="page" href="/index.html">Inicio</a>
                        <a class="nav-link" ${locationCategory} href="/view/category.html">Categorías</a>
                        </div>
                    </div>
                    <div id="contLog">
                        <ul class="navbar-nav me-lg-3">
                            <li class="nav-item dropdown">
                                <a id="imgNameUser" style="color: white !important;" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"  aria-expanded="false">
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown" id="menu">
                                <a class="dropdown-item" href="/view/sales.html" onclick="">Tus compras</a>
                                <a class="dropdown-item" href="/view/profile.html" onclick="">Tu perfil</a>
                                    <a class="dropdown-item" onclick="closeSesion()">Cerrar sesión</a>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>`;
        $("#nav").html(content);
    }

    content = `<span style="font-size: 1rem">
                        ${localStorage.getItem('name')}
                   </span>`;
    $("#imgNameUser").html(content);


} else {
    let content = "";
    content = ` <a class="navbar-brand" href="#">Navbar</a>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <a class="nav-link" aria-current="page" href="/index.html">Inicio</a>
                        <a class="nav-link" href="/view/category.html">Categorías</a>
                    </div>
                 </div>
                <div class="flex-row-reverse bd-highlight green-btn" id="contLog">
                    <a class="btn green-btn" href="/view/login.html">Iniciar sesión</a>
                </div>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>`;
    $("#nav").html(content);
}





const closeSesion = async () => {
    let token = localStorage.getItem('token');
    getToken = { token }
    console.log('object')
    await $.ajax({
        method: "POST",
        url: 'http://localhost:4000/user/delToken',
        data: getToken
    }).done(res => {
        localStorage.removeItem('name')
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        location.href = "/index.html";
    });

}