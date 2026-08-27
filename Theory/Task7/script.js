var user = {
    "name" : "Lavanya",
    "batch" : "B3"
};

var userstr = JSON.stringify(user)
localStorage.setItem("data", "test"); 
localStorage.setItem("user", userstr);

var res = localStorage.getItem("user");
console.log(res);
var resObj = JSON.parse(res);
console.log(resObj);