function random_string(n,s='aA1'){
    var a='';
    if(s.indexOf('a')!==-1){
        a+='abcdefghijklmnopqrstuvwxyz';
    }
    if(s.indexOf('A')!==-1){
        a+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if(s.indexOf('1')!==-1){
        a+='0123456789';
    }
    if(s.indexOf('@')!==-1){
        a+='@#$%^?&.,\'";:+-*/';
    }
    var r='';
    for (var i=0;i<n;i++) {
        r+=a[Math.floor(Math.random()* a.length)];
    }
    return r;
}
module.exports = {
    random_string
}