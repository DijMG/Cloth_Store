const Product_Space = document.getElementById("product_bar");
var Current_Chosen_Product_Id = "";
var Clothing_Data;
function Fetch_Clothing_Data(){
    return new Promise(async (resolve,reject)=>{
        try{
            const response = await fetch("http://localhost/Cloth_Store/Info.json",{
                method:"GET",
                mode:"cors",
                cache:"no-cache"
            });
            if(!response.ok || response.status != 200){
                throw new Error("not ok!!");
            }else{
                resolve(response.json())
            }
        }catch(error){
            let err = new Error("Error!");
            reject(err);
        }
    })
}
Fetch_Clothing_Data()
.then(Info=>{
    Clothing_Data = Info;
    console.log(Info);
    while(Product_Space.children.length > 0){
        Product_Space.children[0].remove();
    }
    for(let x = 0;x < Info.length;x++){
        console.log(Info[x]);

        let Main = document.createElement("div");
        Main.setAttribute("class","product");

        let Image = document.createElement("img");
        Image.setAttribute("src","assets/"+Info[x].Image);
        Image.style.width = "90%";
        Image.style.height = "90%";
        Main.appendChild(Image)

        let Description = document.createElement("p");
        Description.setAttribute("class","product_description")
        Description.textContent = Info[x].Description;
        Main.appendChild(Description)

        let Price = document.createElement("span");
        Price.setAttribute("class","price");
        Price.textContent = Info[x].Price + " $";
        Main.appendChild(Price)

        if(Info[x].discount_state != ""){
            Price.style.textDecoration = "line-through";

            let Discount = document.createElement("span");
            Discount.setAttribute("class","discount");
            let discounted_price = parseInt(Info[x].Price - (Info[x].Price * (Info[x].discount_state/100)));
            discounted_price += .99;
            Discount.textContent = discounted_price + " $";
            Discount.textContent[Discount.textContent.length]
            Main.appendChild(Discount)
        }

        Product_Space.appendChild(Main);

        Main.addEventListener("click",function(){
            Current_Chosen_Product_Id = Clothing_Data[x].Id;
            Item_Check(Info[x]);
        });

    }
})
.catch(err=>{
    console.log("error:" + err);
})
function Item_Check(Product_Info){
    document.getElementById("individual_product_bar").style.display = "flex";
    console.log(Product_Info);
    document.getElementById("individual_product_description").textContent = Product_Info.Description;
    document.getElementById("individual_pic").setAttribute("src","assets/"+Product_Info.Image);
    
    let path = document.getElementById("individual_price_main").children;
    path[0].children[0].style.textDecoration = "";
    path[0].children[1].textContent = "";
    path[0].children[0].textContent = Product_Info.Price + " $";
    if(Product_Info.discount_state != ""){
        path[0].children[0].style.textDecoration = "line-through";
        path[0].children[1].setAttribute("class","individual_discount");
        let discounted_price = parseInt(Product_Info.Price - (Product_Info.Price * (Product_Info.discount_state/100)));
        discounted_price += .99;
        path[0].children[1].textContent = discounted_price + " $";
    }
    path[1].children[1].textContent = "out of " + Product_Info.stock;
}
document.getElementById("individual_exit").addEventListener("click",function(){
    document.getElementById("individual_product_bar").style.display = "none";
    Current_Chosen_Product_Id = "";
});
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape"){
        document.getElementById("individual_product_bar").style.display = "none";
        Current_Chosen_Product_Id = "";
    }
});
document.getElementById("indivi_purchase").addEventListener("click",function(){
    let amount = parseInt(document.getElementById("amount_buy").value);
    if(amount != NaN){
        for(let x = 0;x < Clothing_Data.length;x++){
            console.log(Clothing_Data[x].Id,Current_Chosen_Product_Id);
            if(Clothing_Data[x].Id == Current_Chosen_Product_Id){
                if(Clothing_Data[x].stock >= amount){
                    Clothing_Data[x].stock -= amount; 
                    Item_Check(Clothing_Data[x]); 
                    break;
                }else{
                    document.getElementById("indivi_purchase").classList.add('failed-purchase');
                    setTimeout(function() {
                        document.getElementById("indivi_purchase").classList.remove('failed-purchase');
                    }, 500);
                }
            }
        }
    }
});