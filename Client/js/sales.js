const url = "http://localhost:4000/sale";

if (localStorage.getItem('token') == null) {
    location.href = "/index.html";
} else if (localStorage.getItem('role') != null) {
    bytes = CryptoJS.AES.decrypt(localStorage.getItem('role'), 'A3KfcDnLtmlLhT0zIH1XIIvFe0YuD9Sv');
    role = bytes.toString(CryptoJS.enc.Utf8);

}

const getAll = async () => {
    let content;
    await $.ajax({
        method: "GET",
        url: url
    }).done(async (res) => {
        sale = res.sale
        for (let i = 0; i < sale.length; i++) {
            let pay_id = sale[i].pay_id
            let data = {pay_id}
            let nameMovie;
            await $.ajax({
                method: "GET",
                url: 'http://localhost:4000/movie/'+sale[i].id_movie
            }).done((resM) => {
                nameMovie = resM.movie[0].title
            });
            await $.ajax({
                method: "POST",
                url: 'http://localhost:4000/paypal/capture-payment',
                data: data
            }).done(async (resP) => {
                
                content+=`<tr>
                <td>${nameMovie}</td>
                <td>${resP.body.payer.payer_info.first_name} ${resP.body.payer.payer_info.last_name}</td>
                <td>${resP.body.payer.payer_info.email}</td>
                <td>${resP.body.transactions[0].amount.total} ${resP.body.transactions[0].amount.currency}</td>
                <td>Paypal</td>
                <td>${resP.body.state}</td>
            </tr>`
            });       
        }
        $("#table > tbody").html(content);
    });

}
