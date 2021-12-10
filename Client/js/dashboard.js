locationNumber =-1;
if(localStorage.getItem('role') !=null){
    bytes = CryptoJS.AES.decrypt(localStorage.getItem('role'), 'A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv');
    role = bytes.toString(CryptoJS.enc.Utf8);
    
}

if(localStorage.getItem('token')==null && role!=1){
    location.href ="/index.html";
}
