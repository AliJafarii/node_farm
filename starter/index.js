const fs = require ('fs');
const http = require ('http');
const url = require ('url');


/////////////////////////////
/////FILES

// // non-blocking  , synchronus way
// const textin = fs.readFileSync('./1-node-farm/starter/txt/input.txt' , 'utf-8');
// console.log(textin);
// const textout = fs.writeFileSync('./1-node-farm/starter/txt/output.txt' , `this is what we know about the avocadu: ${textin} \n ${Date.now()}`);
// console.log('file written');
// .
// .
// .
// .
// .
//// blocking   ,  asynchronus way
// fs.readFile('./1-node-farm/starter/txt/sttttart.txt' , 'utf-8' , (err,data1)=>{
//     if (err) return console.log('ERORR!!!');;
//     fs.readFile(`./1-node-farm/starter/txt/${data1}.txt` , 'utf-8' , (err,data2)=>{
//         console.log(data2);
//         fs.readFile(`./1-node-farm/starter/txt/append.txt` , 'utf-8' , (err,data3)=>{
//             console.log(data3);
//             fs.writeFile(`./1-node-farm/starter/txt/final.txt` , `${data2} \n ${data3} `, 'utf-8' , err=>{
//                  console.log('file has been wirtten');
//              });

//         });
//     });
// });
// console.log('will read file');



/////////////////////////////
/////SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html` , 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html` , 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html` , 'utf-8');
const replaceTemplate = (temp , product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g , product.productName);
    output = output.replace(/{%IMAGE%}/g , product.image);
    output = output.replace(/{%PRICE%}/g , product.price);
    output = output.replace(/{%FROM%}/g , product.from);
    output = output.replace(/{%NUTRIENTS%}/g , product.nutrients);
    output = output.replace(/{%QUANTITY%}/g , product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g , product.description);
    output = output.replace(/{%ID%}/g , product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g , 'not-organic')
    return output;
}
    

const data = fs.readFileSync(`${__dirname}/dev-data/data.json` , 'utf-8');
const dataObj = JSON.parse(data);
const server = http.createServer((req,res) => {
    const {query , pathname} = (url.parse(req.url , true));

    
    // OVERVIEW PAGE
    if (pathname === '/' || pathname === '/overview' ){
        res.writeHead(200 , {'content-type' : 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard , el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}' , cardsHtml);
        res.end(output); 
    }

    // PRODUCT PAGE
    else if (pathname === '/product' ) {
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct , product);
        res.end(output);
    }

    // API 
    else if (pathname === '/api' ) 
    {
        res.writeHead(200 , {'content-type' : 'application/json'})
        res.end(data); 
    }

    // NOT FOUND
    else {
        res.writeHead(404 , {'content-type' : 'text/html'})
        res.end('<h1> page not found </h1>'); 
    }
});



server.listen(3000 , '127.0.0.1' , () =>{
    console.log('Listening to request on port 3000'); 
})