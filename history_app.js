var unm=1;
function main_fun(u){
    unm=u;
    var dt = new Date();
    var y=dt.getFullYear()
    var m=dt.getMonth()+1
    var d=dt.getDate()
    document.getElementById("year").value=String(y)
    document.getElementById("month").value=String(m)
    document.getElementById("day").value=String(d)
    up()
}
function up(){
    up_data(document.getElementById("year").value,document.getElementById("month").value,document.getElementById("day").value)
}
function up_data(y,m,d){
    if(m.length==1) m = "0" + m
    if(d.length==1) d = "0" + d
    console.log( y );
    console.log( m );
    console.log( d );
    $.getJSON( "https://dady-door.firebaseio.com/door"+String(unm)+"_history/"+y+"-"+m+"-"+d+" .json").then((val2) => {
        var v=Object.values(val2)
        var s="";
        for(let i=0;i<v.length;i++)
        s+="<tr><th>"+v[i].T+"</th><th>"+v[i].name+"</th><th>"+v[i].ps+"</th><th>"+v[i].id+"</th></tr>"
        $("#tbody1").html(s)
    }).fail(function() { 
        var s="<tr><th>"+' '+"</th><th>"+' '+"</th><th>"+' '+"</th><th>"+' '+"</th></tr>"
        $("#tbody1").html(s) 
    })
}
//$("#tbody1").html(tas)



//console.log("4565456656656");
//$("#tbody1").html(s)
