const url = "http://localhost/symfonyServer/ciger/public/index.php/category";


const getAll = async () => {
    let content=1;
    await $.ajax({
        method: "GET",
        url: url
    }).done(function (res) {
        category = res.category
        
        for (let i = 0; i < category.length; i++) {
            if(category[i].status==1){
                if(content==1){
                    content = `<div class="col-md-6 col-sm-12 col-lg-3 mb-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title">${category[i].name}</h5>
                            <a class="btn btn-primary" onclick="redMovie('${category[i].name}')">Ir</a>
                        </div>
                    </div>
                </div>`;
                }else{
                    content += `<div class="col-md-6 col-sm-12 col-lg-3 mb-3">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <h5 class="card-title">${category[i].name}</h5>
                                        <a class="btn btn-primary" onclick="redMovie('${category[i].name}')">Ir</a>
                                    </div>
                                </div>
                            </div>`;
                }
            }
            
            
                   
        }
        
    });
    $("#insert").html(content);
}
const redMovie = async(name) =>{
    await $.ajax({
        method: "GET",
        url: 'http://localhost:4000/movie/category/'+name
    }).done(function (res) {
        if(res.message ==="Have not Movies"){
            
        }else{
            location.href = "/view/specificCategory.html?name="+name;
        }
    });
}