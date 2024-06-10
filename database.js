import mysql from 'mysql2'

export const pool= mysql.createPool({
    host: 'localhost',
    user: "root",
    password: "root",
    database: "stockp",
    connectionLimit: 10
}).promise()

function getRandom6CharString() {
    const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%*`;
    let result = '';
    
    for (let i = 0; i <6; i++) {
        let randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    
    return result;
}


export async function signup(username,password,email,name){
    return await pool.query("insert into user values(?,?,?,?)",[username,email,password,name])
}


export  function login(username,password){

    console.log(username,password)
    return pool.query("select * from user where username=? and password=?",[username,password])
}

export  function getstocks(username){
    return pool.query("select * from stocks where username=?",[username])
}

export async function addstock(username,stockName,price,IAmount){
    const [result]= await pool.query("insert into stocks values(?,?,?,?)",[username,stockName,price,IAmount])
    return result
}

export async function addrel(username,custname){

    const [result] = await pool.query("insert into relations values(?,?)",[custname,username])
    return result

}

export async function getcuststocks(username){

    const [result]=await pool.query("select cust from relations where admin=? ",[username])


    const customers=[]
    for(var i=0;i<result.length;i++){
        customers.push(result[i].cust)
    }

    console.log(customers)

    let stocks=[]
    for(var i=0;i<customers.length;i++){
        const [da]=await pool.query("select * from stocks where username=?",[customers[i]])
        stocks.push(...da)
    }

    console.log(stocks)

    return stocks
}

export async function getuq(username){

    const [result] = await pool.query("select uq from uniqueid where username=?",[username])

    if(result.length!=0){
        return result[0].uq
    }
    else{
        return false
    }
}

export async function putuq(username){

    let uq=""
    let da=1

    while(da!=0){

        uq = getRandom6CharString()

        let result = await pool.query("select uq from uniqueid where uq=? ",[uq])

        da=result[0].length
    }

    const result = pool.query("insert into uniqueid values(?,?)",[username,uq])

    return result
}

export async function deletestok(username,stock){

    console.log(username,stock);

    return pool.query("delete from stocks where username=? and stock=?",[username,stock])

}